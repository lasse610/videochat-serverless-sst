import * as AJV from "ajv";
import {DB} from '../common/database';
import { APIGatewayProxyEventV2,  APIGatewayProxyResultV2 } from "aws-lambda";

interface Call {
    id: string,
    duration: number,
    customerName: string,
    customerPhoneNumber: string,
    latitude: string | undefined,
    longitude:string | undefined,
    reference: string,
    userId: string,
    notes: string
  }

  const updateCallSchema: AJV.JSONSchemaType<Call> = {
    type: 'object',
    properties: {
      id: {type: 'string'},
      duration: {type: 'integer'},
      customerName: {type: 'string'},
      customerPhoneNumber: {type: 'string'},
      latitude: {type: 'string', nullable: true},
      longitude: {type: 'string', nullable: true},
      reference: {type: 'string'},
      userId: {type:'string'},
      notes: {type: 'string'}
    }, 
    required: ['id','duration','customerName', 'reference', 'userId']
  }

    
 
  export const handler = async (event: APIGatewayProxyEventV2):Promise<APIGatewayProxyResultV2> => {

    try {
        const ajv = new AJV.default();
        const validateCallSchema = ajv.compile<Call>(updateCallSchema);

        if(!event.body || !validateCallSchema(JSON.parse(event.body))){
            return {statusCode: 400, body: "Bad Request"}
        }
        const call = JSON.parse(event.body) as unknown as Call

        const response  = await DB.updateTable('call').set({notes: call.notes}).where('call.id','=', call.id).executeTakeFirst();
            
        if(response.numUpdatedRows < 1){
            return {statusCode: 404, body: "Not Found"}
        }
        return {statusCode: 200, body: "Success"}
    } catch {
        return {statusCode: 500, body: "Internal Server Error"}
    }

  }