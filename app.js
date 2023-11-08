require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.get("/", (req, res) => {
  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
