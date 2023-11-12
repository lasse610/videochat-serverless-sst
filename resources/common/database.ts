import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDSDataService } from "aws-sdk";
import { stringMap } from "aws-sdk/clients/backup";
import { bool } from "aws-sdk/clients/signer";

export interface CallTable {
  id: string;
  dateCreated: string;
  duration: number;
  customerName: string;
  customerPhoneNumber: string;
  latitude: number | null;
  longitude: number | null;
  reference: string;
  userId: string;
  notes: string;
  userName: string;
  hasVideo: boolean;
}

export interface InviteTable {
  answered: boolean;
  customer_name: string;
  reference: string;
  date_created: string;
  time_to_live: number;
  id: string;
  user_id: string;
  agent_name: string;
}

export interface ScreenshotTable {
  id: string;
  dateCreated: string;
  serialnumbers: string;
  notes: string;
  callId: string;
  filename: string;
}

export interface Database {
  call: CallTable;
  screenshot: ScreenshotTable;
  invite: InviteTable;
}

export const DB = new Kysely<Database>({
    dialect: new DataApiDialect({
        mode: "postgres",
        driver: {
            client: new RDSDataService(),
            database: process.env.RDS_DATABASE ?? "no value provided",
            secretArn: process.env.RDS_SECRET ?? "no value provided",
            resourceArn: process.env.RDS_ARN ?? "no value provided"
        }
    })
});

export function updateCallHasVideoById(callId: string, hasVideo: boolean) {
    return DB.updateTable("call")
        .set({ hasVideo })
        .where("call.id", "=", callId)
        .executeTakeFirst();
}
