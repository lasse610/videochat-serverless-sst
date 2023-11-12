import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import {v4} from 'uuid';


export  const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{
  console.log(process.env.TABLE_CLUSTER_ARN, process.env.TABLE_SECRET_ARN, event);
const res = v4();
  const response = {
    "statusCode": 200,
    "headers": {
        "my_header": "my_value"
    },
    "body":JSON.stringify({message:res}),
    "isBase64Encoded": false
};
  return Promise.resolve(response);


}