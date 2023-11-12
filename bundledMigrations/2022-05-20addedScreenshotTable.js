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
var addedScreenshotTable_exports = {};
__export(addedScreenshotTable_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(addedScreenshotTable_exports);
async function up(db) {
  await db.schema.createTable("screenshot").addColumn("id", "varchar(36)", (col) => col.primaryKey()).addColumn("dateCreated", "varchar(30)").addColumn("serialnumbers", "text").addColumn("notes", "text").addColumn("filename", "text").addColumn("callId", "varchar(36)").execute();
}
async function down(db) {
  await db.schema.dropTable("screenshot").execute();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
