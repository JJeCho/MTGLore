"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLore } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import  getBorderColor  from '@/lib/borderColor';
import { SetData } from '@/lib/types';

const SetPage = ({ params }: { params: { code: string } }) => {
  const { code } = params;
  const router = useRouter();

  const [setData, setSetData] = useState<SetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      console.log("No code provided, skipping fetch");
      return;
    }

    const fetchSetData = async () => {
      try {
        const data = await fetchLore(code, 'Set');
        setSetData(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching set data:", err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSetData();
  }, [code]);

  if (loading) {
    return (
      <div className="container mx-auto mt-10">
        <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-24 w-full mx-auto mb-6" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!setData) return <div className="text-center mt-10">No data found</div>;

  const handleCardClick = (uuid: string) => {
    router.push(`/cards/${encodeURIComponent(uuid)}`);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-6">{setData.name}</h1>

      <Card className="bg-gray-50 p-6 mb-8 shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Set Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg"><span className="font-bold">Release Date:</span> {setData.releaseDate}</p>
          <p className="text-lg"><span className="font-bold">Total Set Size:</span> {setData.totalSetSize}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Cards in Set:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {setData.cards.length > 0 ? (
          setData.cards.map((card) => (
            <Card
              key={card.uuid}
              className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200 rounded-lg"
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
                <CardTitle className="text-xl font-bold mb-2">{card.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700"><span className="font-bold">Type:</span> {card.type ?? 'Unknown type'}</p>
                <p className="text-gray-700"><span className="font-bold">Rarity:</span> {card.rarity ?? 'Unknown rarity'}</p>
                <p className="text-gray-700"><span className="font-bold">Mana Value:</span> {card.manaValue !== null ? card.manaValue : 'N/A'}</p>

                {card.colors && card.colors.length > 0 ? (
                  <p className="text-gray-700"><span className="font-bold">Colors:</span> {card.colors.join(', ')}</p>
                ) : (
                  <p className="text-gray-700"><span className="font-bold">Colors:</span> Colorless</p>
                )}

                {card.artist && (
                  <p className="text-gray-700"><span className="font-bold">Artist:</span> {card.artist}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No cards found in this set.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
      </div>
    </div>
  );
};

export default SetPage;
