"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For navigation in Next.js
import { fetchLore } from '@/lib/api'; // Ensure this is correctly importing fetchLore

type CardSet = {
  uuid: string;
  name: string;
  manaValue: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[] | null; // Colors are now objects with "name" field
  artist: string | null; // Artist is now an object with a "name" field
};

type SetData = {
  name: string;
  releaseDate: string;
  totalSetSize: number;
  type: string;
  cards: CardSet[];
};

const SetPage = ({ params }: { params: { code: string } }) => {
  const { code } = params;
  const router = useRouter(); // Use router for navigation

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
        const data = await fetchLore(code, 'Set'); // Fetch set data using fetchLore
        setSetData(data);
        console.log(data)
      } catch (err) {
        console.error("Error fetching set data:", err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSetData();
  }, [code]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!setData) return <div className="text-center mt-10">No data found</div>;

  // Function to handle card click, navigating to /cards/[uuid]
  const handleCardClick = (uuid: string) => {
    router.push(`/cards/${encodeURIComponent(uuid)}`); // Navigate to card page using uuid
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">{setData.name}</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <p className="text-lg"><span className="font-semibold">Release Date:</span> {setData.releaseDate}</p>
        <p className="text-lg"><span className="font-semibold">Total Set Size:</span> {setData.totalSetSize}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Cards in Set:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {setData.cards.length > 0 ? (
          setData.cards.map((card) => (
            <div
              key={card.uuid}
              className="border border-gray-300 bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(card.uuid)} // Navigate on click using uuid
            >
              <h3 className="font-bold text-xl mb-2">{card.name}</h3>
              
              {/* Conditional rendering for each field */}
              <p className="text-gray-700">Type: {card.type ?? 'Unknown type'}</p>
              <p className="text-gray-700">Rarity: {card.rarity ?? 'Unknown rarity'}</p>
              <p className="text-gray-700">Mana Value: {card.manaValue !== null ? card.manaValue : 'N/A'}</p>

              {card.colors && card.colors.length > 0 ? (
                <p className="text-gray-700">Colors: {card.colors}</p>
              )
              : (
                <p className="text-gray-700">Colors: Colorless</p>
              )}

              {card.artist && (
                <p className="text-gray-700">Artist: {card.artist}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No cards found in this set.</p>
        )}
      </div>
    </div>
  );
};

export default SetPage;
