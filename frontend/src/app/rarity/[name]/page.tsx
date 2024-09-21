"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { fetchLore } from "@/lib/api";

type Card = {
  uuid: string;
  name: string;
  manaValue: number | null;
  convertedManaCost: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[] | null;
  power: string | null;
  toughness: string | null;
  flavorText: string | null;
  code: string | null;
  artist: string | null;
  hasFoil: boolean | null;
  hasNonFoil: boolean | null;
  borderColor: string | null;
  frameVersion: string | null;
  originalText: string | null;
  keywords: string[] | null;
  subtypes: string[] | null;
  supertypes: string[] | null;
};

type RarityData = {
  name: string;
  cards: Card[];
};

const RarityPage = ({ params }: { params: { name: string } }) => {
  const [rarityData, setRarityData] = useState<RarityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const limit = 30;

  const { name } = params;
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLore(name, "Rarity", { skip, limit });
      setRarityData(res);
      console.log(res);
    } catch (err) {
      setError("Error fetching color data");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (uuid: string) => {
    router.push(`/cards/${uuid}`);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, skip]);

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!rarityData)
    return <p className="text-center text-gray-500">No color data found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Color: {rarityData.name}</h1>
      <div className="flex mb-2">
        <button
          onClick={() => setSkip((prevSkip) => Math.max(0, Math.floor(prevSkip - limit)))}
          disabled={skip === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setSkip((prevSkip) => Math.floor(prevSkip + limit))}
          disabled={rarityData.cards.length < limit}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {rarityData.cards.map((card) => (
          <div key={card.uuid} onClick={() => handleCardClick(card.uuid)} className="bg-white shadow-md rounded-lg p-4 w-full">
            <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
            <p className="text-sm"><strong>Mana Value:</strong> {card.manaValue}</p>
            <p className="text-sm"><strong>Rarity:</strong> {card.rarity}</p>
            <p className="text-sm"><strong>Type:</strong> {card.type}</p>
            <p className="text-sm"><strong>Code:</strong> {card.code}</p>
            <p className="text-sm"><strong>Colors:</strong> {card.colors?.join(', ')}</p>
            <p className="text-sm"><strong>Power:</strong> {card.power}</p>
            <p className="text-sm"><strong>Toughness:</strong> {card.toughness}</p>
            <p className="text-sm"><strong>Keywords:</strong> {card.keywords?.join(', ')}</p>
            <p className="text-sm"><strong>Subtypes:</strong> {card.subtypes?.join(', ')}</p>
            <p className="text-sm"><strong>Supertypes:</strong> {card.supertypes?.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RarityPage;
