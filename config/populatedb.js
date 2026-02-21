const {Client} = require("pg");
require("dotenv").config({path: '.env'});

const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    memberstatus BOOLEAN NOT NULL,
    isadmin BOOLEAN NOT NULL);
`;

const messagesTable = `
CREATE TABLE IF NOT EXISTS messages(
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(255) NOT NULL,
description VARCHAR(500) NOT NULL,
user_id INTEGER REFERENCES users(id)
);
`

const sessionTable = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`

async function main() {
    console.log("Seeding...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: false}
    })

    await client.connect();
    await client.query(usersTable);
    await client.query(messagesTable);
    await client.query(sessionTable);

    await client.end();
    console.log("Done!");
}

main();