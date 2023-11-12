import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("screenshot")
        .addColumn("id", "varchar(36)", (col) => col.primaryKey())
        .addColumn("dateCreated", "varchar(30)")
        .addColumn("serialnumbers", "text")
        .addColumn("notes", "text")
        .addColumn("filename", "text")
        .addColumn("callId", "varchar(36)")
        .execute();
}

export async function down(db) {
    await db.schema.dropTable("screenshot").execute();
}
