import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "mydatabase",
  });

  // Get 4 random cities
  const [rows] = await connection.execute(
    "SELECT * FROM cities ORDER BY RAND() LIMIT 4"
  );

  await connection.end();

  return NextResponse.json({ cities: rows });
}
