import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as AJV from "ajv";

const region = process.env.region;
const videoFragmentBucket = process.env.videoFragmentBucket;
const client = new S3Client({ region });

/*
    Receive Bas64 encoded video fragments from client. Upload them to S3 into a directory named after the callId. The last fragment is sent with data field as undefined
*/

interface PostVideoFragmentBody {
  callId: string;
  action: "upload" | "finnish";
}

const PostVideoFragmentBodySchema: AJV.JSONSchemaType<PostVideoFragmentBody> = {
    type: "object",
    properties: {
        callId: { type: "string" },
        action: { type: "string", enum: ["upload", "finnish"] }
    },

    required: ["callId", "action"]
};

export async function handler(
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    const ajv = new AJV.default();
    const validateScrenshotRequest = ajv.compile<PostVideoFragmentBody>(
        PostVideoFragmentBodySchema
    );

    if (!event.body || !validateScrenshotRequest(JSON.parse(event.body))) {
        console.log("error in body validation");
        return { statusCode: 400, body: "bad request" };
    }

    const request = JSON.parse(event.body) as PostVideoFragmentBody;
    if (request.action !== "upload" && request.action !== "finnish") {
        console.log("unsupported action");
        return { statusCode: 400, body: "unsupported action" };
    }
    const callId = request.callId;
    const listDirectoryCommand = new ListObjectsV2Command({
        Bucket: videoFragmentBucket,
        Prefix: `${callId}/`,
        Delimiter: "/"
    });
    const response = await client.send(listDirectoryCommand);
    const index = getIndexFromListDirectoryResult(response);
    console.log(index);
    const action = request.action;
    // Check if video upload has already been finished for the call
    if (index === -1) {
        return {
            statusCode: 400,
            body: "call already has a finished video upload"
        };
    }

    // Check if this is the last package of the video upload
    if (action === "finnish") {
        const putFinnishObjectCommand = new PutObjectCommand({
            Bucket: videoFragmentBucket,
            Key: `${callId}/FINNISH.json`,
            Body: JSON.stringify({ callId })
        });
        const res = client.send(putFinnishObjectCommand);
        return { statusCode: 200, body: "success" };
    }

    const putVideoFragmentCommand = new PutObjectCommand({
        Bucket: videoFragmentBucket,
        Key: `${callId}/${index}`
    });
    const presignedUrl = await getSignedUrl(client, putVideoFragmentCommand);

    return { statusCode: 200, body: JSON.stringify({ presignedUrl }) };
}

function getIndexFromListDirectoryResult(response: ListObjectsV2CommandOutput) {
    const objects = response.Contents;
    if (!objects) {
        return 0;
    }
    let index = 0;
    for (const object of objects) {
        if (object.Key && object.Key.includes("FINNISH")) {
            return -1;
        }
        index++;
    }

    return index;
}
