import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi";
import * as util from "util";
import { json } from "stream/consumers";

const dynamoDb = new DynamoDBClient({ region: process.env.region });
const enc = new util.TextEncoder();
const connectionTable = process.env.connectionTable;
export async function handler(event: any) {
    const messageData = JSON.parse(event.body).data;
    if (messageData == undefined) {
        return { status: 400, body: "no data received" };
    }
    console.log(event.requestContext);
    const { domainName, stage, connectionId } = event.requestContext;
    const connectionClient = new ApiGatewayManagementApiClient({
        region: process.env.REGION,
        endpoint: `https://${domainName}/${stage}`
    });
    const responseToClient = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: enc.encode(JSON.stringify({ messageData }))
    });
    const message = await connectionClient.send(responseToClient);
    connectionClient.destroy();
    console.log("Message from management api");
    console.log(message);

    return { status: 200, body: "Message Sent" };
}
