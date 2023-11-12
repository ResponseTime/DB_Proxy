require("dotenv").config();
const express = require("express");
const app = express();
const configurator = require("./schema_config.js");
const db = require("./db-config.js");
const port = 3000;

app.post("/insert/:table", (req, res) => {});

app.get("/select/:table/:id", (req, res) => {
  const table_name = req.query.table;
  const id = req.query.id;
  const query = `SELECT * FROM ${table_name} WHERE id = ${id};`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.status(200).json({ data: result.rows[0] });
  });
});

app.get("/description/:table", (req, res) => {
  const table_name = req.query.table;
  const query = `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = ${table_name};`;
  db.query(query, (err, result) => {
    if (result.rows.length === 0) {
      res.status(404).json({ err: `Table '${table_name}' not found.` });
    } else {
      const colArr = [];
      result.rows.forEach((row) => {
        colArr.push({
          table_name: row.table_name,
          column_name: row.column_name,
          data_type: row.data_type,
        });
      });
      res.status(200).json({ data: colArr });
    }
  });
});

app.post("/update/:table/:id", (req, res) => {});
app.delete("/delete/:table/:id", (req, res) => {});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  configurator.config();
});
