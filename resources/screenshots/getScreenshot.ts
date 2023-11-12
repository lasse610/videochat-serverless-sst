import * as s3 from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DB, ScreenshotTable } from "../common/database";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Screenshot } from "../common/types/api/screenshots";

export interface GetScreenshotParams extends APIGatewayProxyEventV2 {
  pathParameters: {
    screenshotId: string;
  };
}

const clientS3 = new s3.S3Client({});

export const handler = async (
    event: GetScreenshotParams
): Promise<APIGatewayProxyResultV2> => {
    const bucket = process.env.screenshotBucket;
    const screenshotId = event.pathParameters.screenshotId;

    if (!screenshotId) {
        return { statusCode: 400, body: "Bad Request" };
    }

    const screenshot = (await DB.selectFrom("screenshot")
        .selectAll()
        .where("screenshot.id", "=", screenshotId)
        .executeTakeFirst()) as ScreenshotTable;

    if (!screenshot) {
        return { statusCode: 404, body: "Not Found" };
    }

    const command = new GetObjectCommand({ Bucket: bucket, Key: screenshot.id });
    const presignedUrl = await getSignedUrl(clientS3, command);

    const response: Screenshot = {
        ...screenshot,
        url: presignedUrl,
        serialnumbers: JSON.parse(screenshot.serialnumbers)
    };

    return { statusCode: 200, body: JSON.stringify(response) };
};
