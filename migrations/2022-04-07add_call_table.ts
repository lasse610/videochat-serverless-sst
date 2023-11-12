import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("call")
        .addColumn("id", "varchar(36)", (col) => col.primaryKey())
        .addColumn("dateCreated", "varchar(30)")
        .addColumn("duration", "integer")
        .addColumn("customerName", "text")
        .addColumn("customerPhoneNumber", "text")
        .addColumn("latitude", "numeric")
        .addColumn("longitude", "numeric")
        .addColumn("reference", "text")
        .addColumn("userId", "text")
        .addColumn("userName", "text")
        .addColumn("notes", "text")
        .addColumn("hasVideo", "boolean", (col) => col.defaultTo(false))
        .execute();
}

export async function down(db) {
    await db.schema.dropTable("call").execute();
}
