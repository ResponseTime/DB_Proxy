require("dotenv").config();
const express = require("express");
const app = express();
const configurator = require("./schema_config.js");
const d = require("./db-config.js");
const port = 3000;
let db;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/insert/:table", async (req, res) => {
  try {
    const table_name = req.params.table;
    const insertBody = req.body;
    const columns = [];
    const values = [];
    Object.keys(insertBody).forEach((element) => {
      columns.push(element.toLowerCase());
      values.push(insertBody[element]);
    });
    // prettier-ignore
    let query = `INSERT INTO ${table_name} (${columns.join(", ")}) VALUES (${values.map((val,i)=>{return '$'+(i+1)})});`;
    console.log(query);
    const res = await db.query(query, values);
    if (res) {
      res.status(500).json(res);
    }
    res.status(200).json({ insert: true });
  } catch (err) {
    res.status(500).json(err);
  }
});
app.get("/select/:table/:id", async (req, res) => {
  try {
    const table_name = req.params.table;
    const id = req.params.id;
    const query = `SELECT * FROM ${table_name} WHERE id = ${id}`;
    const result = await db.query(query);
    if (result.rowCount < 1) {
      res.status(404).json({ err: "Data for Id not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
app.get("/desc/:table", async (req, res) => {
  try {
    const table_name = req.params.table;
    const query = `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = '${table_name}';`;
    const result = await db.query(query);
    const colArr = [{ table: table_name }];
    result.rows.forEach((row) => {
      colArr.push({
        column_name: row.column_name,
        data_type: row.data_type,
      });
    });
    res.json(colArr);
  } catch (err) {
    res.status(500).json(err);
  }
});
app.post("/update/:table/:id", async (req, res) => {
  try {
    const table_name = req.params.table;
    const id = req.params.id;
    const update = req.body.update;
    const updateCols = [];
    const values = [];
    Object.keys(update).forEach((element) => {
      updateCols.push(element);
      values.push(update[element]);
    });
    const query = `UPDATE ${table_name} SET ${updateCols.map((val, i) => {
      return val + "=" + "($" + (i + 1 + ")");
    })} WHERE id=${id}`;
    const res = await db.query(query, values);
    if (res) {
      res.status(500).json(res);
    }
    res.status(200).json({ update: true });
  } catch (err) {
    res.status(500).json(err);
  }
});
app.delete("/delete/:table/:id", async (req, res) => {
  try {
    const table_name = req.params.table;
    const id = req.params.id;
    const query = `DELETE FROM ${table_name} WHERE id = ${id}`;
    const result = await db.query(query);
    if (result.rowCount > 0) {
      res.status(200).json({ delete: true });
    } else {
      res.status(500).json({ err: "No data to delete" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(port, async () => {
  db = await d.connect();
  console.log(`App listening at http://localhost:${port}`);
  configurator.config();
});
