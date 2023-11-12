var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var add_invite_table_exports = {};
__export(add_invite_table_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(add_invite_table_exports);
async function up(db) {
  await db.schema.createTable("invite").addColumn("answered", "boolean").addColumn("customer_name", "text").addColumn("reference", "text").addColumn("date_created", "varchar(30)").addColumn("time_to_live", "integer").addColumn("id", "text", (col) => col.primaryKey()).addColumn("agent_name", "text").addColumn("user_id", "text").execute();
}
async function down(db) {
  await db.schema.dropTable("invite").execute();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
