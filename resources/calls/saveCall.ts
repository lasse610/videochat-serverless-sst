import { DB } from "../common/database";
import * as AJV from "ajv";
import * as uuid from "uuid";
import { DateTime } from "luxon";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { SimpleDB } from "aws-sdk";

interface Call {
  duration: number;
  customerName: string;
  customerPhoneNumber: string;
  latitude: number;
  longitude: number;
  reference: string;
  userId: string;
  callId: string;
  notes: string;
  userName: string;
}

/*
  duration: number,
  customerName: string,
  customerPhoneNumber: string,
  latitude: number,
  longitude: number,
  sid: string,
  notes: string,
  reference: string,
  screenshots: string[],
  userId: string
  */

const createCallSchema: AJV.JSONSchemaType<Call> = {
    type: "object",
    properties: {
        duration: { type: "integer" },
        callId: { type: "string" },
        customerName: { type: "string" },
        customerPhoneNumber: { type: "string" },
        latitude: { type: "number" },
        longitude: { type: "number" },
        reference: { type: "string" },
        userId: { type: "string" },
        notes: { type: "string" },
        userName: { type: "string" }
    },
    required: [
        "userName",
        "callId",
        "longitude",
        "latitude",
        "duration",
        "customerName",
        "reference",
        "userId"
    ]
};

export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    const database = DB;
    const ajv = new AJV.default();
    const validateCallRequest = ajv.compile<Call>(createCallSchema);

    if (!event.body || !validateCallRequest(JSON.parse(event.body))) {
        return { statusCode: 400, body: "Bad Request" };
    }
    const call = JSON.parse(event.body) as unknown as Call;
    const savedCall = await database
        .insertInto("call")
        .values({
            id: call.callId,
            dateCreated: DateTime.now().toISO(),
            duration: call.duration,
            customerName: call.customerName,
            customerPhoneNumber: call.customerPhoneNumber,
            latitude: call.latitude,
            longitude: call.longitude,
            reference: call.reference,
            userId: call.userId,
            notes: call.notes,
            userName: call.userName,
            hasVideo: false
        })
        .returningAll()
        .executeTakeFirst();

    console.log("moi");

    return { statusCode: 200, body: JSON.stringify(savedCall) };
};
