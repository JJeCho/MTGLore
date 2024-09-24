"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchLore } from "@/lib/api";
import getBorderColor from "@/lib/borderColor";
import { Card as ShadCNCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Card = {
  uuid: string;
  name: string;
  manaValue: number;
  rarity: string;
  type: string;
  colors: string[];
};

const ArtistPage = ({ params }: { params: { name: string } }) => {
  const [artistData, setArtistData] = useState<{
    name: string;
    cards: Card[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { name } = params;

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        const decodedArtistName = decodeURIComponent(name);
        const data = await fetchLore(decodedArtistName, "Artist");
        setArtistData(data);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-6 w-full max-w-lg mb-4" />
        <Skeleton className="h-6 w-full max-w-lg mb-4" />
        <Skeleton className="h-6 w-full max-w-lg mb-4" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!artistData) {
    return <p className="text-center text-gray-500">No data found for the artist</p>;
  }

  const { name: artistName, cards } = artistData;

  const handleCardClick = (uuid: string) => {
    router.push(`/cards/${uuid}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-8 lg:p-16">
      <h1 className="text-3xl font-bold text-center mb-6">Artist: {artistName}</h1>
      <p className="text-xl font-medium mb-4 text-center">Total Cards: {cards.length}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {cards.map((card) => (
          <ShadCNCard
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
              <CardTitle className="text-lg font-semibold">{card.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Mana Value: {card.manaValue}</p>
              <p className="text-gray-600">Rarity: {card.rarity}</p>
              <p className="text-gray-600">Type: {card.type}</p>
              <p className="text-gray-600">
                Colors: {card.colors.join(", ") || "Colorless"}
              </p>
            </CardContent>
          </ShadCNCard>
        ))}
      </div>
    </div>
  );
};

export default ArtistPage;
