const mysql = require('mysql2/promise');
require("dotenv").config()


// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: process.env.DB_CONNECTION_LIMIT,
    connectionLimit: process.env.DB_QUEUE_LIMIT,
    port: 8889,
    queueLimit: 0
});

module.exports = pool;