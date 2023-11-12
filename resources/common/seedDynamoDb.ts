import * as dynamodb from "@aws-sdk/client-dynamodb";

const client = new dynamodb.DynamoDBClient({ region: "eu-central-1" });

export const handler = async () => {
    console.log("seeding database");
    const tenantTable = process.env.tenantTable;
    const tenantId = process.env.tenantId || "";
    const userPoolId = process.env.userPoolId || "";
    const cognitoIdentityPoolId = process.env.cognitoIdentityPoolId || "";
    const apiUrl = process.env.ApiUrl || "";

    const command = new dynamodb.PutItemCommand({
        TableName: tenantTable,
        Item: {
            tenantId: {
                S: tenantId
            },
            userPoolId: {
                S: userPoolId
            },
            apiUrl: {
                S: apiUrl
            }
        }
    });

    await client.send(command);

    console.log("finished seeding database");
};
