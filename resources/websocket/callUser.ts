import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi";
import * as util from "util";

interface CallUserRequest {
  action: string;
  data: {
    customerName: string;
    userId: string;
    uuid: string;
  };
}

interface IncomingCallMessage {
  action: string;
  data: {
    customerName: string;
    room: string;
  };
}

const region = process.env.region;
const dynamoDBClient = new DynamoDBClient({ region: process.env.region });
const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const enc = new util.TextEncoder();
const connectionTable = process.env.connectionTable;

export async function handler(event: any) {
    const messageData = JSON.parse(event.body) as CallUserRequest;
    if (messageData == undefined) {
        return { status: 400, body: "no data received" };
    }
    console.log(messageData);
    const data = messageData.data;
    const getConnectionCommand = new GetCommand({
        TableName: connectionTable,
        Key: { userId: data.userId }
    });
    const getConnectionOutput = await dynamoDBDocumentClient.send(
        getConnectionCommand
    );
    if (!getConnectionOutput.Item) {
        return { statusCode: 404, body: "connection not found" };
    }
    const connectionId = getConnectionOutput.Item.connectionId;
    console.log(getConnectionOutput);
    const { domainName, stage } = event.requestContext;

    const incomingCallMessage: IncomingCallMessage = {
        action: "incomingCall",
        data: {
            customerName: messageData.data.customerName,
            room: messageData.data.uuid
        }
    };
    const connectionClient = new ApiGatewayManagementApiClient({
        region: process.env.REGION,
        endpoint: `https://${domainName}/${stage}`
    });
    const responseToClient = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: enc.encode(JSON.stringify(incomingCallMessage))
    });
    const message = await connectionClient.send(responseToClient);
    connectionClient.destroy();
    console.log("Message from management api");
    console.log(message);

    return { status: 200, body: "Message Sent" };
}
