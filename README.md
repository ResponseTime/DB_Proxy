# DB_Proxy

Problem Statement
You’ve been asked to build a generic database proxy - a REST API for CRUD on a SQL database.
Translate REST language into valid SQL statements using your API endpoint handlers, written in
Javascript/Node. Use any server framework (Express, Koa) and SQL flavor (MySQL, Postgres) you
like.
You don’t know what the schema looks like, so your DB proxy should implement a system to
ingest schema files (could be JSON, whatever you like) and build the DB schema based on that,
on every server startup.


How to run the api:
- Clone the repo
- Run docker-compose up --build (should have docker installed)
- API will run on port 3000
- Postgress db will run on port 5432

What I did:
- Created a system to ingest schema file (json) to create tables
- Will check for any new added tables/ columns on every server startup
- Created 4 routes
    - Insert (POST)
    - Desc (Description of table) (GET)
    - Delete (DELETE)
    - Update (POST)
    - Select (GET)

What else I would do:
- Make the system for ingestion reliable
  - update/delete any columns that might have changed (to keep the schema and db in sync)
- Testing:
  - Even though manually tested the api and the schema ingestion system/ would use jest testing library to do extensive testing

What if this api was to run on concurrent environment:
- Race Condition!!!
- Transaction handling
- Concurrency Control (optimistic/pessimistic locking)

