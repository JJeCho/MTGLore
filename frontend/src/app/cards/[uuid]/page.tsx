"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { fetchLore } from "@/lib/api";
import axios from "axios";
import { Card as ShadCNCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Card = {
  name: string;
  manaValue: number | null;
  convertedManaCost: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[] | null;
  power: string | null;
  toughness: string | null;
  flavorText: string | null;
  artist: string | null;
  hasFoil: boolean | null;
  hasNonFoil: boolean | null;
  borderColor: string | null;
  frameVersion: string | null;
  originalText: string | null;
  keywords: string[] | null;
  subtypes: string[] | null;
  supertypes: string[] | null;
  code: string[] | null;
  setName: string[] | null;
  scryfallId: string | null;
};

const CardPage = ({ params }: { params: { uuid: string } }) => {
  const [card, setCard] = useState<Card | null>(null);
  const [cardInfo, setCardInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { uuid } = params;
  const router = useRouter();

  useEffect(() => {
    const getCardData = async () => {
      try {
        const cardData = await fetchLore(uuid, "Card");
        const cardInfo = await axios.get(`https://api.scryfall.com/cards/${cardData.scryfallId}`);
        setCard(cardData);
        setCardInfo(cardInfo.data);
      } catch (err) {
        setError("Error fetching card data");
      } finally {
        setLoading(false);
      }
    };

    getCardData();
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-6 w-full max-w-xl mb-4" />
        <Skeleton className="h-6 w-full max-w-xl mb-4" />
        <Skeleton className="h-6 w-full max-w-xl mb-4" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!card) return <p className="text-center text-gray-500">No card data found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-8 lg:p-16">
      <ShadCNCard className="bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-12 max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-700 text-center mb-6">{card.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardInfo?.released_at && (
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">Release Date:</p>
                <p className="text-gray-700">{cardInfo.released_at}</p>
              </div>
            )}

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

            {card.setName && (
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">Set Name:</p>
                <p className="text-gray-700">{card.setName}</p>
              </div>
            )}

            {cardInfo?.mana_cost && (
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">Mana Cost:</p>
                <p className="text-gray-700">{cardInfo.mana_cost}</p>
              </div>
            )}

            {cardInfo?.legalities && (
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">Legalities:</p>
                <ul className="list-disc pl-5 text-gray-700">
                  {Object.entries(cardInfo.legalities).map(([key, value], i) => (
                    <li key={i} className="capitalize">
                      {key}: {value as string}
                    </li>
                  ))}
                </ul>
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
                <p className="text-gray-700">{card.colors.join(", ")}</p>
              </div>
            )}

            {card.artist && (
              <div
                className="flex flex-col md:col-span-2 cursor-pointer"
                onClick={() => router.push(`/artists/${encodeURIComponent(card.artist!)}`)}
              >
                <p className="text-lg font-semibold text-gray-800">Artist:</p>
                <p className="text-blue-600 hover:underline">{card.artist}</p>
              </div>
            )}

            {card.flavorText && (
              <div className="flex flex-col md:col-span-2">
                <p className="text-lg font-semibold text-gray-800">Flavor Text:</p>
                <p className="text-gray-700 italic">{`"${card.flavorText}"`}</p>
              </div>
            )}

            {cardInfo?.oracle_text && (
              <div className="flex flex-col md:col-span-2">
                <p className="text-lg font-semibold text-gray-800">Oracle Text:</p>
                <p className="text-gray-700">{cardInfo.oracle_text}</p>
              </div>
            )}

            {cardInfo?.image_uris?.normal && (
              <img
                src={cardInfo.image_uris.normal}
                alt={card.name}
                className="rounded-lg shadow-md"
              />
            )}
          </div>
        </CardContent>
      </ShadCNCard>
    </div>
  );
};

export default CardPage;
