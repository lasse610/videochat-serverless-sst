import * as AJV from "ajv";
import { DB } from "../common/database";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

interface UpdateScreenshotRequest extends APIGatewayProxyEventV2 {
  pathParameters: { id: string };
}

interface UpdateScreenshotBody {
  notes: string;
}

const createScreenshotSchema: AJV.JSONSchemaType<UpdateScreenshotBody> = {
    type: "object",
    properties: {
        notes: { type: "string" }
    },
    required: ["notes"]
};

export const handler = async (
    event: UpdateScreenshotRequest
): Promise<APIGatewayProxyResultV2> => {
    const ajv = new AJV.default();
    const validateScrenshotRequest = ajv.compile<UpdateScreenshotBody>(
        createScreenshotSchema
    );
    const id = event.pathParameters.id;

    if (!id || !event.body || !validateScrenshotRequest(JSON.parse(event.body))) {
        return { statusCode: 400, body: "Bad Request" };
    }
    const screenshot = JSON.parse(event.body) as unknown as UpdateScreenshotBody;
    console.log(id);
    const response = await DB.updateTable("screenshot")
        .set({ notes: screenshot.notes })
        .where("id", "=", id)
        .executeTakeFirst();
    console.log(response);
    if (response.numUpdatedRows < 1) {
        return { statusCode: 404, body: "Not Found" };
    }
    return { statusCode: 200, body: "Success" };
};
