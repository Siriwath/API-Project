import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cityName = url.searchParams.get("name");

  if (!cityName) {
    return NextResponse.json({ error: "No city provided" }, { status: 400 });
  }

  try {
    const apiKey = process.env.API_KEY;
    const apiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    );

    if (!apiRes.ok) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const cityData = await apiRes.json();

    // Log search
    await logSearchedCity(cityName, "");

    // Return only the needed fields
    return NextResponse.json({
      name: cityData.name,
      temp: cityData.main?.temp ?? 0,
      description: cityData.weather?.[0]?.description ?? "N/A",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
