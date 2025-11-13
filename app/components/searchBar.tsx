"use client";

import { useState } from "react";

interface SearchBarProps {
  onResults: (results: any) => void; // callback for API response
}

export default function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/searchCity?name=${encodeURIComponent(trimmedQuery)}`);

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      onResults(data); // send API response to parent
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong");
      onResults({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <button type="submit" style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
