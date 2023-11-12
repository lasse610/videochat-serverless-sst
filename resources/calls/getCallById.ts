import { DB } from "../common/database";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Screenshot } from "../common/types/api/screenshots";

interface GetCallByIdRequest extends APIGatewayProxyEventV2 {
  pathParameters: { id: string };
}

const s3Client = new S3Client({ region: process.env.region });
const screenshotBucket = process.env.screenshotBucket;

export const handler = async (
    event: GetCallByIdRequest
): Promise<APIGatewayProxyResultV2> => {
    const database = DB;
    const id = event.pathParameters.id;
    if (!id) {
        return { statusCode: 400, body: "Bad Request" };
    }
    const call = await database
        .selectFrom("call")
        .selectAll()
        .where("call.id", "=", id)
        .executeTakeFirst();
    const screenshots = await database
        .selectFrom("screenshot")
        .selectAll()
        .where("screenshot.callId", "=", id)
        .execute();
    const screenshotArr: Screenshot[] = [];

    if (!call) {
        return { statusCode: 404, body: "not found" };
    }

    for (const screenshot of screenshots) {
        const getObjectCommand = new GetObjectCommand({
            Bucket: screenshotBucket,
            Key: screenshot.filename
        });
        const url = await getSignedUrl(s3Client, getObjectCommand);
        screenshotArr.push({
            ...screenshot,
            url,
            serialnumbers: JSON.parse(screenshot.serialnumbers)
        });
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ ...call, screenshots: screenshotArr })
    };
};
