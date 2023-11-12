import * as s3 from "@aws-sdk/client-s3";
import * as Rekognition from "@aws-sdk/client-rekognition";
import * as AJV from "ajv";
import { DB } from "../common/database";
import { DateTime } from "luxon";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { Screenshot } from "../common/types/api/screenshots";

interface CreateScreenshotRequest {
  callId: string;
  filename: string;
}

const createScreenshotSchema: AJV.JSONSchemaType<CreateScreenshotRequest> = {
    type: "object",
    properties: {
        callId: { type: "string" },
        filename: { type: "string" }
    },
    required: ["callId", "filename"]
};

const clientS3 = new s3.S3Client({});
const bucket = process.env.screenshotBucket;

const clientRekognition = new Rekognition.RekognitionClient({});

export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    const ajv = new AJV.default();
    const validateScrenshotRequest = ajv.compile<Screenshot>(
        createScreenshotSchema
    );

    if (!bucket) {
        return { statusCode: 500, body: "Internal Server Error" };
    }
    console.log(event.body);

    if (!event.body || !validateScrenshotRequest(JSON.parse(event.body))) {
        return { statusCode: 400, body: "Bad Request" };
    }

    const request = JSON.parse(event.body) as Screenshot;

    // Check if object exists in s3 bucket
    const objectHeadCommand = new HeadObjectCommand({
        Bucket: bucket,
        Key: request.filename
    });

    try {
        const s3Response = await clientS3.send(objectHeadCommand);
    } catch (error) {
        const err = error as Error;
        if (err.name == "NotFound") {
            console.log("NotFound error");

            return { statusCode: 404, body: "Specified image not found" };
        } else {
            console.log("unknown error");

            return { statusCode: 500, body: "Internal server error" };
        }
    }

    // Should check that call exists

    const detectTextCommand = new Rekognition.DetectTextCommand({
        Image: { S3Object: { Bucket: bucket, Name: request.filename } }
    });
    const detectTextResponse = await clientRekognition.send(detectTextCommand);

    const detectedText = detectTextResponse.TextDetections
        ? (detectTextResponse.TextDetections.map((obj) => obj.DetectedText).filter(
            (obj) => obj !== undefined
        ) as string[])
        : [];
    console.log(detectedText);

    const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: request.filename
    });

    const screenshotObject: Screenshot = {
        serialnumbers: detectedText,
        id: v4(),
        callId: request.callId,
        filename: request.filename,
        dateCreated: DateTime.now().toISO(),
        notes: "",
        url: await getSignedUrl(clientS3, getObjectCommand)
    };
    await DB.insertInto("screenshot")
        .values({
            serialnumbers: JSON.stringify(screenshotObject.serialnumbers),
            id: screenshotObject.id,
            callId: screenshotObject.callId,
            filename: screenshotObject.filename,
            dateCreated: screenshotObject.dateCreated,
            notes: screenshotObject.notes ?? ""
        })
        .execute();

    return { statusCode: 200, body: JSON.stringify(screenshotObject) };
};
