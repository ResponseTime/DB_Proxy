const fs = require("fs");
const path = require("path");
const db = require("./db-config.js");

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
          db.query(queryBuilder);
        } else {
			const query = `SELECT column_name FROM information_schema.columns WHERE table_name = $1`;
			db.query(query, [table], (err, res) => {
			  if (err) {
				console.error("Error executing query", err);
				return;
			  }
			  const columnNames = res.rows.map((row) => row.column_name);
			  newCols = columns.filter((column) => !columnNames.includes(column));
			  if(newCols.length > 0) {
				  let idx = newCols.map((column) => columns.indexOf(column))
				  let definition = idx.map((i)=>`${columns[i]} ${datatypes[i]} ${options[i]}`)
				  let queryAdd = `ALTER TABLE ${table} ADD ${definition.join(" ")}`
				  db.query(queryAdd,(err, res) =>{
					 if (err) {
						throw err
					}
			  	})
			}	
			});
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
