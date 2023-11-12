import * as s3 from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as AJV from "ajv";
import { v4 } from "uuid";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

interface ScreenshotUploadRequest {
  callId: string;
}

const screenshotUploadRequestSchema: AJV.JSONSchemaType<ScreenshotUploadRequest> =
  {
      type: "object",
      properties: {
          callId: { type: "string" }
      },
      required: ["callId"]
  };

const S3 = new s3.S3Client({});
const bucket = process.env.screenshotBucket;

export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    const ajv = new AJV.default();
    const validateCall = ajv.compile<ScreenshotUploadRequest>(
        screenshotUploadRequestSchema
    );

    if (!bucket) {
        return { statusCode: 500, body: "Internal Server Error" };
    }

    if (!event.body || !validateCall(JSON.parse(event.body))) {
        return { statusCode: 400, body: "Bad Request" };
    }

    const request = JSON.parse(event.body) as ScreenshotUploadRequest;
    const key = `${v4()}.jpeg`;

    const command = new s3.PutObjectCommand({
        Key: key,
        Bucket: bucket,
        Metadata: { callId: request.callId }
    });
    const presignedUrl = await getSignedUrl(S3, command);

    return { statusCode: 200, body: JSON.stringify({ presignedUrl, key }) };
};
