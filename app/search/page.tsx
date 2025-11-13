import Link from "next/link";

interface City {
  name: string;
  temp: number;
  description: string;
}

export default async function HomePage() {
  const res = await fetch(`${process.env.BASE_URL || "http://localhost:3000"}/api/randomCitiesWeather`);
  const data = await res.json();
  const cities: City[] = data.cities;

  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-6 bg-gray-50">
      {/* Display each city as plain text */}
      <div className="mt-20 space-y-4">
        {cities.map((city, index) => (
          <div key={index} className="text-center text-lg font-medium text-gray-700">
            {city.name} — {Math.round(city.temp)}°C — {city.description}
          </div>
        ))}
      </div>

      {/* Bottom button */}
      <Link href="/search">
        <button className="mt-auto mb-10 px-8 py-3 bg-indigo-500 text-white rounded-full shadow-md
                           hover:bg-indigo-600 hover:scale-105 transition-all duration-300">
          Search Your City
        </button>
      </Link>
    </div>
  );
}
