import {
    Table,
    Api,
    WebSocketApi,
    Queue,
    Bucket,
    ReactStaticSite,
    Auth,
    Stack,
    App,
    RDS
} from "@serverless-stack/resources";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";

import { StackProps, RemovalPolicy, Duration } from "aws-cdk-lib";

export default class MyStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);
        const databaseName = "testdb";
        const tenantId = "testTenantId";

        const auth = new Auth(this, "auth", {
            login: ["email"]
        });

        const updateUserAttributesPermission = new iam.PolicyStatement({
            actions: ["cognito-idp:AdminUpdateUserAttributes"],
            effect: iam.Effect.ALLOW,
            resources: ["arn:aws:cognito-idp:eu-central-1:327720173366:userpool/*"]
        });

        const tenantTable = new Table(this, "tenant_table", {
            fields: {
                tenantId: "string",
                userPoolId: "string",
                apiUrl: "string"
            },
            primaryIndex: { partitionKey: "tenantId" },
            globalIndexes: {
                UserPoolId: { partitionKey: "userPoolId", projection: "all" }
            },
            cdk: {
                table: {
                    removalPolicy: RemovalPolicy.DESTROY
                }
            }
        });

        const rds = new RDS(this, "mainDatabase", {
            engine: "postgresql10.14",
            defaultDatabaseName: databaseName,
            migrations: "bundledMigrations"
        });

        const connectionTable = new Table(this, "connection_table", {
            fields: {
                userId: "string",
                connectionId: "string"
            },
            primaryIndex: { partitionKey: "userId" },
            globalIndexes: { getByConnectionId: { partitionKey: "connectionId" } },

            cdk: {
                table: {
                    removalPolicy: RemovalPolicy.DESTROY
                }
            }
        });

        const screenshotBucket = new Bucket(this, "screenshot_bucket", {
            cors: [
                {
                    allowedMethods: ["PUT"],
                    allowedOrigins: ["http://localhost:3000"]
                }
            ]
        });
        // Video processing

        const originAccessIdentity = new cloudfront.OriginAccessIdentity(
            this,
            "vide_origin_access_identity",
            {}
        );
        const hslBucket = new Bucket(this, "hsl_bucket", {});
        const ffmpegLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            "ffmpeg__layer",
            "arn:aws:lambda:eu-central-1:327720173366:layer:ffmpeg:4"
        );

        const videoFragmentBucket = new Bucket(this, "video_fragment_bucket", {
            cors: [
                {
                    allowedMethods: ["PUT"],
                    allowedOrigins: ["http://localhost:3000"],
                    allowedHeaders: ["Content-Type"]
                }
            ],
            notifications: {}
        });

        // video processor notification. Fires when upload ended message is saved to

        const videoProcessingQueue = new Queue(this, "video_processing_queue", {
            consumer: {
                function: {
                    handler: "resources/videos/videoProcessor.handler",
                    layers: [ffmpegLayer],
                    permissions: [videoFragmentBucket, hslBucket],
                    timeout: "15 minutes",
                    environment: {
                        region: this.region,
                        videoFragmentBucket: videoFragmentBucket.bucketName,
                        hslBucket: hslBucket.bucketName
                    }
                },
                cdk: {
                    eventSource: {
                        batchSize: 1
                    }
                }
            },
            cdk: {
                queue: {
                    visibilityTimeout: Duration.minutes(30)
                }
            }
        });
        videoFragmentBucket.addNotifications(this, {
            videoProcessor: {
                events: ["object_created"],
                filters: [{ suffix: ".txt" }],
                queue: videoProcessingQueue,
                type: "queue"
            }
        });

        hslBucket.cdk.bucket.grantRead(originAccessIdentity);

        const hslDistribution = new cloudfront.Distribution(
            this,
            "hsl_distribution",
            {
                defaultBehavior: {
                    origin: new cloudfrontOrigins.S3Origin(hslBucket.cdk.bucket, {
                        originAccessIdentity
                    })
                },
                additionalBehaviors: {},
                priceClass: cloudfront.PriceClass.PRICE_CLASS_100
            }
        );

        // Web socket api

        const webSocketApi = new WebSocketApi(this, "Api", {
            defaults: {
                function: {
                    environment: {
                        region: Stack.of(this).region,
                        connectionTable: connectionTable.tableName
                    },
                    permissions: [connectionTable]
                }
            },
            routes: {
                $connect: "resources/websocket/connect.handler",
                initialize: "resources/websocket/initializeConnection.handler",
                callUser: {
                    function: {
                        handler: "resources/websocket/callUser.handler"
                    }
                },
                $disconnect: "resources/websocket/disconnect.handler",
                $default: "resources/websocket/default.handler"
            }
        });

        const api = new Api(this, "baseApi", {
            cdk: {},

            defaults: {
                function: {
                    environment: {
                        region: this.region,
                        RDS_DATABASE: databaseName,
                        RDS_SECRET: rds.secretArn,
                        RDS_ARN: rds.clusterArn
                    }
                }
            },
            routes: {
                "POST /token": {
                    authorizer: "none",
                    function: {
                        handler: "resources/token/getToken.handler",
                        environment: {
                            TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
                            TWILIO_API_KEY_SID: process.env.TWILIO_API_KEY_SID!,
                            TWILIO_API_KEY_SECRET: process.env.TWILIO_API_KEY_SECRET!
                        }
                    }
                }
            }
        });

        // Calls
        api.addRoutes(this, {
            "POST /calls": {
                function: {
                    handler: "resources/calls/saveCall.handler",
                    permissions: [rds]
                }
            },
            "GET /calls": {
                function: {
                    handler: "resources/calls/getAllCalls.handler",
                    permissions: [rds]
                }
            },
            "GET /calls/{id}": {
                function: {
                    handler: "resources/calls/getCallById.handler",
                    permissions: [rds, screenshotBucket],
                    environment: {
                        screenshotBucket: screenshotBucket.bucketName
                    }
                }
            },
            "PUT /calls/{id}": {
                function: {
                    handler: "resources/calls/updateCall.handler",
                    permissions: [rds]
                }
            }
        });
        // Invites
        api.addRoutes(this, {
            "GET /invites/{id}": {
                function: {
                    handler: "resources/invites/getInvite.handler",
                    permissions: [rds]
                }
            },
            "POST /invites": {
                function: {
                    handler: "resources/invites/postInvite.handler",
                    permissions: [rds]
                }
            }
        });

        // Screenshots

        const detectTextPermission = new iam.PolicyStatement({
            actions: ["rekognition:DetectText"],
            effect: iam.Effect.ALLOW,
            resources: ["*"]
        });

        api.addRoutes(this, {
            "POST /screenshot/requestUploadUrl": {
                function: {
                    handler: "resources/screenshots/requestUploadUrl.handler",
                    permissions: [screenshotBucket],
                    environment: {
                        screenshotBucket: screenshotBucket.bucketName
                    }
                }
            },
            "POST /screenshot": {
                function: {
                    handler: "resources/screenshots/saveScreenshot.handler",
                    permissions: [screenshotBucket, rds, detectTextPermission],
                    environment: {
                        screenshotBucket: screenshotBucket.bucketName
                    }
                }
            },
            "PATCH /screenshot/{id}": {
                function: {
                    handler: "resources/screenshots/updateScreenshot.handler",
                    permissions: [rds, screenshotBucket],
                    environment: {
                        screenshotBucket: screenshotBucket.bucketName
                    }
                }
            },
            "GET /screenshot/{id}": {
                function: {
                    handler: "resources/screenshots/getScreenshot.handler",
                    permissions: [rds, screenshotBucket],
                    environment: {
                        screenshotBucket: screenshotBucket.bucketName
                    }
                }
            },
            "DELETE /screenshot/{id}": {
                function: {
                    handler: "resources/screenshots/deleteScreenshot.handler",
                    permissions: [rds, screenshotBucket],
                    environment: {
                        screenshotBucket: screenshotBucket.bucketName
                    }
                }
            }
        });

        // video

        api.addRoutes(this, {
            "POST /videos": {
                function: {
                    handler: "resources/videos/postVideoFragment.handler",
                    permissions: [videoFragmentBucket],
                    environment: {
                        videoFragmentBucket: videoFragmentBucket.bucketName
                    }
                }
            }
        });

        new ReactStaticSite(this, "streem-frontend", {
            path: "frontend",
            environment: {
                REACT_APP_API_URL: api.url,
                REACT_APP_WEBSOCKET_API_URL: webSocketApi.url,
                REACT_APP_S3_REGION: this.region,
                REACT_APP_USER_POOL_ID: auth.userPoolId,
                REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
                REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
                REACT_APP_VIDEO_URL: hslDistribution.distributionDomainName,
                REACT_APP_MAPBOX_API_TOKEN: process.env.REACT_APP_MAPBOX_API_TOKEN!
            }
        });

        this.addOutputs({ webSocketApiUrl: webSocketApi.url });
        this.addOutputs({
            ApiUrl: api.url,
            videos: hslDistribution.distributionDomainName
        });
    }
}
