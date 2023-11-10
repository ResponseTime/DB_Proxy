require("dotenv").config();
const express = require("express");
const app = express();
const configurator = require("./schema_config.js");
const db = require("./db-config.js");
const port = 3000;

app.post("/insert/:table", (req, res) => {});
app.get("/select/:table/:id", (req, res) => {});
app.get("/description/:table", (req, res) => {});
app.post("/select/:table/:id", (req, res) => {});
app.delete("/delete/:table/:id", (req, res) => {});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  configurator.config();
});
