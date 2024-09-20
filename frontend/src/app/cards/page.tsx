"use client";

import { useState, useEffect } from "react";
import { fetchLore } from "@/lib/api";

// Define the color mapping for MTG colors
const colorMapping: Record<string, string> = {
  W: "#FFFFFF",   // White
  U: "#1E90FF",   // Blue
  B: "#000000",   // Black
  R: "#FF4500",   // Red
  G: "#228B22",   // Green
  C: "#606060",   // Colorless (optional)
};

type CardSet = {
  uuid: string;
  name: string;
  manaValue: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[] | null;
  power: string | null;
  toughness: string | null;
  flavorText: string | null;
  artist: string | null;
};

const CardsPage = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const limit = 30; // Pagination limit

  // Fetch data for card sets using the `fetchLore` function
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLore("", "Cards", { skip, limit }); // Use the cardSets resolver
      setCardSets(data);
      console.log(data);
    } catch (err) {
      setError("Error fetching card sets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [skip]);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!cardSets.length) return <p className="text-center text-gray-500">No card sets found</p>;

  // Function to determine the border gradient based on card colors
  const getBorderColor = (colors: string[] | null): string => {
    if (!colors || colors.length === 0) {
      return "#A9A9A9"; // Default to colorless if no colors are present
    }
    // If only one color, return it directly as a solid color
    if (colors.length === 1) {
      return colorMapping[colors[0]] || "#A9A9A9";
    }
    // If multiple colors, return a gradient
    const gradientColors = colors
      .map((color) => colorMapping[color] || "#A9A9A9")
      .join(", ");
    return `linear-gradient(45deg, ${gradientColors})`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Cards</h1>
      <div className="flex mb-2">
        <button
          onClick={() => setSkip((prevSkip) => Math.max(0, prevSkip - limit))}
          disabled={skip === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setSkip((prevSkip) => prevSkip + limit)}
          disabled={cardSets.length < limit}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {cardSets.map((card) => (
          <div
            key={card.uuid}
            className="bg-gray-100 shadow-md rounded-lg p-4 w-full flex flex-col justify-between h-full"
            style={{
              // Apply a solid border for single-color cards
              border: (card.colors?.length ?? 0) === 1 || (card.colors?.length ?? 0) === 0
                ? `4px solid ${getBorderColor(card.colors)}`
                : "4px solid transparent", // Use transparent for multi-color cards to apply gradient
              // Apply gradient border for multi-color cards using `borderImage`
              borderImage: (card.colors?.length ?? 0) > 1
                ? `${getBorderColor(card.colors)} 1` // Apply the gradient
                : undefined, // No gradient for single-color cards
            }}
          >
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
              <p className="text-sm"><strong>Mana Value:</strong> {card.manaValue}</p>
              <p className="text-sm"><strong>Rarity:</strong> {card.rarity}</p>
              <p className="text-sm"><strong>Type:</strong> {card.type}</p>
              <p className="text-sm"><strong>Colors:</strong> {card.colors?.join(', ') || 'Colorless'}</p>
            </div>

            {/* Only display power and toughness if available */}
            {card.power && card.toughness && (
              <div className="mt-4">
                <p className="text-sm"><strong>Power:</strong> {card.power}</p>
                <p className="text-sm"><strong>Toughness:</strong> {card.toughness}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsPage;
