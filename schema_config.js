const fs = require("fs");
const path = require("path");
function config() {
  const schemaFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, "schema.json")),
    "utf8"
  );
  for (const key in schemaFile) {
    for (const value in schemaFile[key]) {
      const table_name = value;
      const columns = schemaFile[key][value].columns;
      const datatypes = schemaFile[key][value]["data-type"];
      const options = schemaFile[key][value].options;
      res = "";
      for (let i = 0; i < columns.length; i++) {
        res += " " + columns[i] + " : " + datatypes[i] + " : " + options[i];
      }
      console.log(table_name);
      console.log(res);
    }
  }
}
module.exports = {
  config,
  demo: () => {
    console.log(9);
  },
};
