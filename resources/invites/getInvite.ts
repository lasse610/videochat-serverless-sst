import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DB } from "../common/database";

interface GetInvitesRequest extends APIGatewayProxyEventV2 {
  pathParameters: {
    id: string;
  };
}

export async function handler(
    event: GetInvitesRequest
): Promise<APIGatewayProxyResultV2> {
    const id = event.pathParameters.id;
    if (!id) {
        return { statusCode: 400, body: "bad request" };
    }
    console.log(id);
    const res = await DB.selectFrom("invite")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
    console.log(JSON.stringify(res));
    if (res) {
        return { statusCode: 200, body: JSON.stringify(res) };
    }

    return { statusCode: 404, body: "not found" };
}
