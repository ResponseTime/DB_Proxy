const fs = require("fs");
const path = require("path");
const db = require("./db-config.js");

function config() {
  // prettier-ignore
  const schemaFile = JSON.parse(fs.readFileSync(path.join(__dirname, "schema.json")),"utf8");
  Object.keys(schemaFile).forEach((table) => {
    db.query(
      `SELECT EXISTS ( SELECT 1 FROM pg_tables WHERE tablename ='${table.toLowerCase()}') AS table_existence;`,
      (err, res) => {
        if (err) {
          throw err;
        }
        const existence = res.rows.map((row) => row.table_existence)[0];
        if (!existence) {
          const createTableQuery = `CREATE TABLE ${table.toLowerCase()} (${schemaFile[
            table
          ].join(", ")});`;
          db.query(createTableQuery, (err, res) => {
            if (err) {
              throw err;
            }
          });
        } else {
          const query = `SELECT column_name FROM information_schema.columns WHERE table_name = $1`;
          db.query(query, [table.toLowerCase()], (err, res) => {
            if (err) {
              console.error("Error executing query", err);
              return;
            }
            const columnNames = res.rows.map((row) => row.column_name.trim());
            columns = schemaFile[table].map((row) => {
              return row.split(" ")[0].trim().toLowerCase();
            });
            let newCols = [];
            for (let i in columns) {
              if (!columnNames.includes(columns[i])) {
                newCols.push(columns[i]);
              }
            }
            let rese = [];
            for (let i of schemaFile[table]) {
              if (newCols.includes(i.split(" ")[0])) {
                rese.push(i);
              }
            }
            if (rese.length > 0) {
              let addCols = `ALTER TABLE ${table.toLowerCase()} ADD COLUMN ${rese.join(
                ", ADD COLUMN "
              )};`;
              db.query(addCols);
            }
          });
        }
      }
    );
  });
}

module.exports = {
  config,
  demo: () => {
    console.log("Test");
  },
};
