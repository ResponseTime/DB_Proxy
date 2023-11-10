const fs = require("fs");
const path = require("path");
const db = require("./db-config.js");

function checkTableColumns(table, columns) {
  const query = `SELECT column_name FROM information_schema.columns WHERE table_name = $1`;
  db.query(query, [table], (err, res) => {
    if (err) {
      console.error("Error executing query", err);
      return;
    }

    const columnNames = res.rows.map((row) => row.column_name);
    console.log("Column names:", table, columnNames);
  });
}

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}
function config() {
  // prettier-ignore
  const schemaFile = JSON.parse(fs.readFileSync(path.join(__dirname, "schema.json")),"utf8");
  for (const table in schemaFile["tables"]) {
    const path = schemaFile["tables"][table];
    const columns = path.columns;
    const datatypes = path.datatype;
    const options = path.options;
    // prettier-ignore
    db.query(`SELECT EXISTS ( SELECT 1 FROM pg_tables WHERE tablename ='${table}') AS table_existence;`,(err, res) => {
        if (err) {
          throw err;
        }
        if (!res) {
			const columnsDefinition = columns.map((col, i) => `${col} ${datatypes[i]} ${options[i]}`);
			const queryBuilder = `CREATE TABLE ${table} (${columnsDefinition.join(",")})`;
          db.query(queryBuilder, (err, result) => {
            if (err) {
              throw err;
            }
            console.log(result);
          });
        } else {
          checkTableColumns(table, columns);
        }
      }
    );
  }
}
module.exports = {
  config,
  demo: () => {
    console.log("Test");
  },
};
