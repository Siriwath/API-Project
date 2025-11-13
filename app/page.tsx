import Link from "next/link";

interface City {
  name: string;
  temp: number;
}

export default async function HomePage() {
  const res = await fetch(
    `${process.env.BASE_URL || "http://localhost:3000"}/api/randomCitiesWeather`
  );
  const data = await res.json();
  const cities: City[] = data.cities;

  return (
    <div className="w-screen min-h-screen flex flex-col justify-between items-center bg-blue-600 p-6">
      
      {/* Top rectangle */}
      <div className="w-full max-w-2xl bg-blue-400 rounded-lg text-center py-4 px-6 mb-12 shadow-md">
        <h1 className="text-xl font-semibold text-white">
          Lovely weather we're having
        </h1>
      </div>

      {/* Four circles */}
      <div className="flex justify-center items-start gap-12">
        {cities.map((city, idx) => {
          const fontSize = Math.max(14, 32 - city.name.length * 1.5);
          return (
            <div key={idx} className="flex flex-col items-center">
              {/* Circle with temperature */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500
                              flex items-center justify-center shadow-lg hover:shadow-xl
                              transition-shadow duration-300">
                <span className="text-2xl font-bold text-white">
                  {Math.round(city.temp)}°C
                </span>
              </div>

              {/* City name below circle */}
              <span
                style={{ fontSize }}
                className="mt-3 font-semibold text-white text-center"
              >
                {city.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom search button */}
      <Link href="/search">
        <button className="mt-24 mb-10 w-64 py-3 bg-white text-blue-600 font-semibold rounded-full
                           shadow-md hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
          Search Your City
        </button>
      </Link>
    </div>
  );
}