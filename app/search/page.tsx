"use client"; // needed for client-side state

import { useState } from "react";
import Link from "next/link";

interface WeatherData {
  name: string;
  temp: number;
  description: string;
}

export default function SearchPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/searchCity?name=${city}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Failed to fetch weather.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-600 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Search for a City</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
        />
        <button
          onClick={fetchWeather}
          className="px-4 py-2 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-300">{error}</p>}

      {weather && (
        <div className="mt-6 bg-blue-400 rounded-lg p-6 shadow-md text-white text-center">
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <p className="text-2xl font-semibold">{Math.round(weather.temp)}°C</p>
          <p className="capitalize">{weather.description}</p>
        </div>
      )}

      {/* Back to Home button */}
      <Link href="/">
        <button className="mt-12 mb-10 w-64 py-3 bg-white text-blue-600 font-semibold rounded-full
                           shadow-md hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
