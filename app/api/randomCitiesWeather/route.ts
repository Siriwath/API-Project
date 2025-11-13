import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "mydatabase",
    });

    // Get 4 random cities
    const [rows] = await connection.execute("SELECT name FROM cities ORDER BY RAND() LIMIT 4");
    await connection.end();

    const apiKey = process.env.API_KEY;
    const weatherPromises = (rows as any[]).map(async (city) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      return {
        name: city.name,
        temp: data.main?.temp || 0,
        description: data.weather?.[0]?.description || "N/A",
      };
    });

    const results = await Promise.all(weatherPromises);

    return NextResponse.json({ cities: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
