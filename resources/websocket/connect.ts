export async function handler(event: any) {
    console.log("new connection");
    return { statusCode: 200, body: "Connected" };
}
