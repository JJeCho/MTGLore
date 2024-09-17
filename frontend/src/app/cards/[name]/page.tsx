"use client";

import { useState, useEffect } from "react";
import { fetchLore } from "@/lib/api"; // Adjust the path if necessary

type Card = {
  name: string;
  manaValue: number | null;
  convertedManaCost: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[];
  artist: string | null;
  power: string | null;
  toughness: string | null;
};

const CardPage = ({ params }: { params: { name: string } }) => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { name } = params;
  const decodedName = decodeURIComponent(name); // Decode the name to handle special characters

  useEffect(() => {
    const getCardData = async () => {
      try {
        const cardData = await fetchLore(decodedName, "Card"); // Fetch card data using the fetchLore function
        setCard(cardData);
      } catch (err) {
        setError("Error fetching card data");
      } finally {
        setLoading(false);
      }
    };

    getCardData();
  }, [decodedName]);

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!card)
    return <p className="text-center text-gray-500">No card data found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-8 lg:p-16">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-12 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          {card.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">Mana Value:</p>
            <p className="text-gray-700">
              {card.manaValue !== null ? card.manaValue : "N/A"}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">
              Converted Mana Cost:
            </p>
            <p className="text-gray-700">
              {card.convertedManaCost !== null ? card.convertedManaCost : "N/A"}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">Rarity:</p>
            <p className="text-gray-700">{card.rarity ?? "Unknown"}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">Type:</p>
            <p className="text-gray-700">{card.type ?? "Unknown"}</p>
          </div> 
          {card.power && (
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">Power:</p>
            <p className="text-gray-700">{card.power ?? "N/A"}</p>
          </div>
          )}
          {card.toughness && (
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">Toughness:</p>
            <p className="text-gray-700">{card.toughness ?? "N/A"}</p>
          </div>
          )}
          {card.colors && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Colors:</p>
              <p className="text-gray-700">{card.colors.join(", ")}</p>
            </div>
          )}
          {card.artist && (
          <div className="flex flex-col md:col-span-2">
            <p className="text-lg font-semibold text-gray-800">Artist:</p>
            <p className="text-gray-700">{card.artist ?? "Unknown"}</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPage;
