const { query } = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db-config.js');

function checkTables(tables) {}
function checkTableColumns(table, columns) {}

function setCharAt(str, index, chr) {
	if (index > str.length - 1) return str;
	return str.substring(0, index) + chr + str.substring(index + 1);
}
function config() {
	const schemaFile = JSON.parse(fs.readFileSync(path.join(__dirname, 'schema.json')), 'utf8');
	for (const table in schemaFile['tables']) {
		const path = schemaFile['tables'][table];
		const columns = path.columns;
		const datatypes = path.datatype;
		const options = path.options;
		checkTables(table);
		checkTableColumns(table, columns);
		let queryString = '';
		querieBuilder = 'CREATE TABLE ' + table + ' (';
		// prettier-ignore
		for (let i = 0; i < columns.length; i++) {
      queryString += columns[i] + ' ' + datatypes[i];
			if (options[i].startsWith('FOREIGN KEY')) {
        queryString +=" " +options[i].substring(options[i].indexOf('REFERENCES'), options[i].length);
			} 
      else {
        queryString += ' ' + options[i];
			}
      querieBuilder+=queryString+",";
			queryString = '';
		}

		querieBuilder = setCharAt(querieBuilder, querieBuilder.lastIndexOf(','), ')');
		db.query(
			`SELECT EXISTS ( SELECT 1 FROM pg_tables WHERE tablename ='${table}') AS table_existence;`,
			(err, res) => {
				if (err) {
					throw err;
				}
				if (!res) {
					db.query(querieBuilder, (err, result) => {
						if (err) {
							throw err;
						}
						console.log(result);
					});
				}
			}
		);
	}
}
module.exports = {
	config,
	demo: () => {
		console.log('Test');
	},
};
