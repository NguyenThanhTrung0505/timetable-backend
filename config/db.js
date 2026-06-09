// Thay vì require, chúng ta dùng import
import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.getConnection()
    .then((connection) => {
        console.log("✅ Connected to MySQL successfully!");
        connection.release();
    })
    .catch((err) => {
        console.error("❌ Error connecting to MySQL:", err.message);
    });

// THAY ĐỔI QUAN TRỌNG NHẤT Ở ĐÂY:
// Bỏ: module.exports = pool;
export default pool;
