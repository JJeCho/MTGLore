"use client";

import { useState, useEffect } from "react";
import { fetchLore } from "@/lib/api"; // Adjust the path if necessary

type Card = {
  uuid: string;
  name: string;
  manaValue: number;
  rarity: string;
  type: string;
  colors: string[];
};

const ArtistPage = ({ params }: { params: { name: string } }) => {
  const [artistData, setArtistData] = useState<{ name: string; cards: Card[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { name } = params;

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        const decodedArtistName = decodeURIComponent(name);
        const data = await fetchLore(decodedArtistName, "Artist"); // Fetch artist's cards using the fetchLore function
        setArtistData(data);
        console.log(data)
        setLoading(false);
      } catch (err) {
        setError("Error fetching artist's data");
        console.error(err);
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artistData) {
    return <div>No data found for the artist</div>;
  }

  const { name: artistName, cards } = artistData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-8 lg:p-16">
      <h1 className="text-3xl font-bold mb-6">Artist: {artistName}</h1>
      <p className="text-xl font-medium mb-4">Total Cards: {cards.length}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {cards.map((card) => (
          <div key={card.uuid} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">{card.name}</h2>
            <p className="text-gray-600">Mana Value: {card.manaValue}</p>
            <p className="text-gray-600">Rarity: {card.rarity}</p>
            <p className="text-gray-600">Type: {card.type}</p>
            <p className="text-gray-600">Colors: {card.colors.join(", ") || "Colorless"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPage;
