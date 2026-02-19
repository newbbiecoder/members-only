const {Pool} = require("pg");
require("dotenv").config({path: ".env"});

const pool = new Pool({
    host: "localhost",
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASS,
    port: 5432
})

module.exports = pool;