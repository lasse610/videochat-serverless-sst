import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDbClient = new DynamoDBClient({
    region: process.env.region ?? "eu-centra-1"
});
const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);
const connectionTable = process.env.connectionTable;

export async function handler(event: any) {
    console.log(event);
    const body = JSON.parse(event.body);
    if (!body) {
        return { status: 400, body: "bad request" };
    }

    console.log(body);

    const command = new PutCommand({
        Item: {
            userId: body.data.username,
            connectionId: event.requestContext.connectionId
        },
        TableName: connectionTable
    });

    const res = await dynamoDBDocumentClient.send(command);
    return { status: 200, body: "Message Sent" };
}
