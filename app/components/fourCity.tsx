"use client";
import { useEffect, useState } from "react";

interface CityWeather {
  name: string;
  temp: number;
  description: string;
}

export default function FourCity() {
  const [weatherData, setWeatherData] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/randomCitiesWeather");
        const data = await res.json();
        setWeatherData(data.cities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return <p>Loading cities...</p>;

  return (
    <div>
      <h1>Random Cities Weather</h1>
      <ul>
        {weatherData.map((city, idx) => (
          <li key={idx}>
            <h2>{city.name}</h2>
            <p>Temperature: {city.temp}°C</p>
            <p>Weather: {city.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
