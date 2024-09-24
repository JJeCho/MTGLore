"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { fetchLore } from "@/lib/api";
import getBorderColor from "@/lib/borderColor";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

type ColorData = {
  name: string;
  cards: Card[];
};

const ColorsPage = ({ params }: { params: { name: string } }) => {
  const [colorData, setColorData] = useState<ColorData | null>(null);
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
      const res = await fetchLore(name, "Color", { skip, limit });
      setColorData(res);
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
  }, [name, skip]);

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!colorData)
    return <p className="text-center text-gray-500">No color data found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold mb-6">Color: {colorData.name}</h1>

      <div className="flex mb-6 space-x-4">
        <Button
          variant="default"
          onClick={() => setSkip((prevSkip) => Math.max(0, prevSkip - limit))}
          disabled={skip === 0}
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={() => setSkip((prevSkip) => prevSkip + limit)}
          disabled={colorData.cards.length < limit}
        >
          Next
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {colorData.cards.map((card) => (
          <Card
            key={card.uuid}
            className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(card.uuid)}
            style={{
              border: (card.colors?.length ?? 0) === 1 || (card.colors?.length ?? 0) === 0
                ? `4px solid ${getBorderColor(card.colors)}`
                : "4px solid transparent",
              borderImage: (card.colors?.length ?? 0) > 1
                ? `${getBorderColor(card.colors)} 1`
                : undefined,
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold">{card.name}</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ColorsPage;
