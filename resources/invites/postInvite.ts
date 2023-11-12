import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AJV from "ajv";
import * as luxon from "luxon";

import { DB } from "../common/database";
import * as uuid from "uuid";
interface PostInviteRequest {
  customerName: string;
  reference: string;
  username: string;
  agentName: string;
}

const createPostInviteRequestSchema: AJV.JSONSchemaType<PostInviteRequest> = {
    type: "object",
    properties: {
        customerName: { type: "string" },
        reference: { type: "string" },
        username: { type: "string" },
        agentName: { type: "string" }
    },
    required: ["customerName", "reference", "username", "agentName"]
};

export async function handler(
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    const ajv = new AJV.default();
    const validateScrenshotRequest = ajv.compile<PostInviteRequest>(
        createPostInviteRequestSchema
    );
    if (!event.body || !validateScrenshotRequest(JSON.parse(event.body))) {
        return { statusCode: 400, body: "Bad Request" };
    }

    const request = JSON.parse(event.body) as PostInviteRequest;
    const id = uuid.v4();
    console.log(event.body);
    const res = await DB.insertInto("invite")
        .values({
            customer_name: request.customerName,
            reference: request.reference,
            id,
            answered: false,
            time_to_live: 360000,
            date_created: luxon.DateTime.now().toISO(),
            user_id: request.username,
            agent_name: request.agentName
        })
        .execute();
    console.log(JSON.stringify(res));

    return { statusCode: 200, body: JSON.stringify({ id }) };
}
