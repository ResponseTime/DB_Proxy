require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const app = express();
const configurator = require("./schema_config.js");
const port = 3000;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.post("/insert/:table", (req, res) => {});
app.get("/select/:table", (req, res) => {});
app.post("/select/:table", (req, res) => {});
app.delete("/delete/:table/:id", (req, res) => {});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  configurator.config();
});
