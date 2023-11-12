import * as s3 from "@aws-sdk/client-s3";
import { DB } from "../common/database";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export interface GetScreenshotParams extends APIGatewayProxyEventV2 {
  pathParameters: {
    screenshotId: string;
  };
}

interface DeleteScreenshotResponse {
  id: string;
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

    const screenshot = await DB.deleteFrom("screenshot")
        .where("screenshot.id", "=", screenshotId)
        .executeTakeFirst();

    if (screenshot.numDeletedRows < 1) {
        return { statusCode: 404, body: "Not Found" };
    }

    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: screenshotId
    });
    // TODO: Make sure delete is succesfull
    await clientS3.send(command);

    const response: DeleteScreenshotResponse = { id: screenshotId };

    return { statusCode: 200, body: JSON.stringify(response) };
};
