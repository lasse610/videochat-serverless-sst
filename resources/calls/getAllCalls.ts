import { DB } from "../common/database";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    const database = DB;

    const calls = await database.selectFrom("call").selectAll().execute();

    return { statusCode: 200, body: JSON.stringify(calls) };
};
