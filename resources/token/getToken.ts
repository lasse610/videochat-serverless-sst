import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { jwt } from "twilio";
import { VideoGrant } from "twilio/lib/jwt/AccessToken";

import * as AJV from "ajv";
import { eventNames } from "process";

interface GetTokenRequest {
  userIdentity: string;
  roomName: string;
}

const createGetTokenRequestSchema: AJV.JSONSchemaType<GetTokenRequest> = {
    type: "object",
    properties: {
        userIdentity: { type: "string" },
        roomName: { type: "string" }
    },
    required: ["roomName", "userIdentity"]
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

export async function handler(
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    console.log(event);
    const ajv = new AJV.default();
    const validateScrenshotRequest = ajv.compile<GetTokenRequest>(
        createGetTokenRequestSchema
    );
    if (!event.body || !validateScrenshotRequest(JSON.parse(event.body))) {
        return { statusCode: 400, body: "Bad Request" };
    }
    const { userIdentity, roomName } = JSON.parse(event.body) as GetTokenRequest;

    const token = tokenGenerator(userIdentity, roomName);

    return { statusCode: 200, body: JSON.stringify({ token, room_type: "go" }) };
}

function tokenGenerator(identity: string, room: string) {
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created

    if (
        accountSid === undefined ||
    apiKeySid === undefined ||
    apiKeySecret === undefined
    ) {
        throw new Error("twilio credentials not configured properly");
    }

    console.log(accountSid, apiKeySecret, apiKeySid);
    const token = new jwt.AccessToken(accountSid, apiKeySid, apiKeySecret);

    // Assign identity to the token
    token.identity = identity;

    // Grant the access token Twilio Video capabilities
    const grant = new VideoGrant();
    grant.room = room;
    token.addGrant(grant);

    // Serialize the token to a JWT string
    return token.toJwt();
}
