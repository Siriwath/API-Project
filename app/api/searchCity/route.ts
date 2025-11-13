import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Helper function to log the search
async function logSearchedCity(cityName: string, pastName: string = "") {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "mydatabase",
  });

  await connection.execute(
    "INSERT INTO cities (name, past_name) VALUES (?, ?)",
    [cityName, pastName]
  );

  await connection.end();
}

// GET request handler
export async function GET(request: Request) {
  const url = new URL(request.url);
  const cityName = url.searchParams.get("name"); // /api/search-city?name=Paris

  if (!cityName) {
    return NextResponse.json({ error: "No city provided" }, { status: 400 });
  }

  try {
    // 1️⃣ Fetch city info from OpenWeather
    const apiKey = process.env.API_KEY;
    const apiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    );

    if (!apiRes.ok) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const cityData = await apiRes.json();

    // 2️⃣ Log the search in MySQL
    // If you want, you can pass a previous city as pastName, or leave empty
    await logSearchedCity(cityName, "");

    // 3️⃣ Return the API data to frontend
    return NextResponse.json({ city: cityData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
