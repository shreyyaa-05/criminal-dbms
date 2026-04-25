import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  connectTimeout: 60000,

  ssl: {
    minVersion: "TLSv1.2"
  }
});

// Test pool connection
db.getConnection((err, conn) => {
  if (err) {
    console.log("DB ERROR:", err);
    return;
  }

  console.log("TiDB Pool Connected Successfully");
  conn.release();
});