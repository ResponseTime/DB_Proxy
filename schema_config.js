const fs = require("fs");
const path = require("path");
const d = require("./db-config.js");
async function config() {
  const db = await d.connect();
  // prettier-ignore
  const schemaFile = JSON.parse(fs.readFileSync(path.join(__dirname, "schema.json")),"utf8");
  // prettier-ignore
  const checkExistence = async (table) => {
    const resultSet = await db.query(`SELECT EXISTS ( SELECT 1 FROM pg_tables WHERE tablename ='${table.toLowerCase()}') AS table_existence;`);
    const existence = resultSet.rows.map((row) => row.table_existence)[0];
    return existence;
  };
  // prettier-ignore
  const createTable = async (table) => {
    const createTableQuery = `CREATE TABLE ${table.toLowerCase()} (${schemaFile[table].join(", ")});`;
    return await db.query(createTableQuery);
  };
  // prettier-ignore
  const checkColumns = async (table) => {
    const query = `SELECT column_name FROM information_schema.columns WHERE table_name = $1`;
    const resultSet = await db.query(query, [table.toLowerCase()]);
    return resultSet;
  }
  // prettier-ignore
  const alterTable = async (table,rese) => {
    let addCols = `ALTER TABLE ${table.toLowerCase()} ADD COLUMN ${rese.join(", ADD COLUMN ")};`;
    return await db.query(addCols);
  }
  // prettier-ignore
  Object.keys(schemaFile).forEach(async(table) => {
    try {  
      const exist = await checkExistence(table);
      console.log(exist," ",table);
      if (!exist) {
        const res = await createTable(table);
        console.log(res)
      } else {
        const resultSet = await checkColumns(table);
        const columnNames = resultSet.rows.map((row) => row.column_name.trim());
        let columns = schemaFile[table].map((row) => { return row.split(" ")[0].trim().toLowerCase()});
        let newCols = [];
            for (let i in columns) {
              if (!columnNames.includes(columns[i])) {
                newCols.push(columns[i]);
              }
            }
        console.log(newCols)
        let rese = [];
        for (let i of schemaFile[table]) {
          if (newCols.includes(i.split(" ")[0].toLowerCase())) {
              rese.push(i);
          }
        }
        if (rese.length > 0) {
          const res = await alterTable(table,rese);
          console.log(res)
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = {
  config,
  demo: () => {
    console.log("Test");
  },
};
