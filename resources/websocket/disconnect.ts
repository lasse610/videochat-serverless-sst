import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    QueryCommand,
    DeleteCommand,
    DeleteCommandOutput
} from "@aws-sdk/lib-dynamodb";

const region = process.env.region;
const dynamoDBClient = new DynamoDBClient({ region });
const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const connectionTable = process.env.connectionTable;

export async function handler(event: any) {
    console.log(event);
    // Get item using connection id, delete item using primary key.
    const connectionId = event.requestContext.connectionId;
    const queryCommand = new QueryCommand({
        TableName: connectionTable,
        IndexName: "getByConnectionId",
        KeyConditionExpression: "connectionId = :key",
        ExpressionAttributeValues: { ":key": connectionId }
    });
    const queryRes = await dynamoDBDocumentClient.send(queryCommand);
    if (queryRes.Count === 0) {
        return { statusCode: 200, body: "could not find connection" };
    }
    console.log(JSON.stringify(queryRes));
    const promiseArr: Promise<DeleteCommandOutput>[] = [];
    queryRes.Items?.forEach((item) => {
        console.log(item);
        const deleteCommand = new DeleteCommand({
            TableName: connectionTable,
            Key: { userId: item.userId }
        });
        promiseArr.push(dynamoDBDocumentClient.send(deleteCommand));
    });
    await Promise.all(promiseArr);

    return { statusCode: 200, body: "Disconnected" };
}
