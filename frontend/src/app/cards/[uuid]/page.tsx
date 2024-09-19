"use client";

import { useState, useEffect } from "react";
import { fetchLore } from "@/lib/api"; // Adjust the path if necessary

type Card = {
  name: string;
  manaValue: number | null;
  convertedManaCost: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[] | null; // Colors are objects with a "name" field
  power: string | null;
  toughness: string | null;
  flavorText: string | null;
  artist: string | null; // Artist is an object with a "name" field
  hasFoil: boolean | null;
  hasNonFoil: boolean | null;
  borderColor: string | null;
  frameVersion: string | null;
  originalText: string | null;
  keywords: string[] | null; // Keywords are objects with a "name" field
  subtypes: string[] | null; // Subtypes are objects with a "name" field
  supertypes: string[] | null; // Supertypes are objects with a "name" field
};

const CardPage = ({ params }: { params: { uuid: string } }) => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { uuid } = params;

  useEffect(() => {
    const getCardData = async () => {
      try {
        const cardData = await fetchLore(uuid, "Card"); // Fetch card data using the fetchLore function
        setCard(cardData);
        console.log(cardData);
      } catch (err) {
        setError("Error fetching card data");
      } finally {
        setLoading(false);
      }
    };

    getCardData();
  }, [uuid]);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!card) return <p className="text-center text-gray-500">No card data found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-8 lg:p-16">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-12 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          {card.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {card.manaValue !== null && (
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800">Mana Value:</p>
              <p className="text-gray-700">{card.manaValue}</p>
            </div>
          )}

          {card.rarity && (
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800">Rarity:</p>
              <p className="text-gray-700">{card.rarity}</p>
            </div>
          )}

          {card.type && (
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800">Type:</p>
              <p className="text-gray-700">{card.type}</p>
            </div>
          )}

          {card.power && (
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800">Power:</p>
              <p className="text-gray-700">{card.power}</p>
            </div>
          )}

          {card.toughness && (
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800">Toughness:</p>
              <p className="text-gray-700">{card.toughness}</p>
            </div>
          )}

          {card.colors && card.colors.length > 0 && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Colors:</p>
              <p className="text-gray-700">{card.colors}</p>
            </div>
          )}

          {card.artist && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Artist:</p>
              <p className="text-gray-700">{card.artist}</p>
            </div>
          )}

          {card.flavorText && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Flavor Text:</p>
              <p className="text-gray-700 italic">"{card.flavorText}"</p>
            </div>
          )}

          {card.originalText && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Original Text:</p>
              <p className="text-gray-700">"{card.originalText}"</p>
            </div>
          )}

          {card.borderColor && (
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800">Border Color:</p>
              <p className="text-gray-700">{card.borderColor}</p>
            </div>
          )}

          {card.frameVersion && (
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800">Frame Version:</p>
              <p className="text-gray-700">{card.frameVersion}</p>
            </div>
          )}

          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">Has Foil:</p>
            <p className="text-gray-700">{card.hasFoil ? "Yes" : "No"}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-800">Has Non-Foil:</p>
            <p className="text-gray-700">{card.hasNonFoil ? "Yes" : "No"}</p>
          </div>

          {card.subtypes && card.subtypes.length > 0 && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Subtypes:</p>
              <p className="text-gray-700">{card.subtypes.join(" ")}</p>
            </div>
          )}

          {card.supertypes && card.supertypes.length > 0 && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Supertypes:</p>
              <p className="text-gray-700">{card.supertypes.join(" ")}</p>
            </div>
          )}

          {card.keywords && card.keywords.length > 0 && (
            <div className="flex flex-col md:col-span-2">
              <p className="text-lg font-semibold text-gray-800">Keywords:</p>
              <p className="text-gray-700">{card.keywords.join(" ")}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CardPage;
