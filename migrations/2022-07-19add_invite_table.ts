import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("invite")
        .addColumn("answered", "boolean")
        .addColumn("customer_name", "text")
        .addColumn("reference", "text")
        .addColumn("date_created", "varchar(30)")
        .addColumn("time_to_live", "integer")
        .addColumn("id", "text", (col) => col.primaryKey())
        .addColumn("agent_name", "text")
        .addColumn("user_id", "text")
        .execute();
}

export async function down(db) {
    await db.schema.dropTable("invite").execute();
}
