"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For navigation in Next.js
import { fetchLore } from '@/lib/api'; // Ensure this is correctly importing fetchLore

type CardSet = {
  name: string;
  manaValue: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[];
};

type SetData = {
  name: string;
  baseSetSize: number;
  releaseDate: string;
  totalSetSize: number;
  type: string;
  cards: CardSet[];
};

const SetPage = ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const router = useRouter(); // Use router for navigation

  const [setData, setSetData] = useState<SetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const decodedName = decodeURIComponent(name);

  useEffect(() => {
    if (!name) {
      console.log("No name provided, skipping fetch");
      return;
    }

    const fetchSetData = async () => {
      try {
        const data = await fetchLore(decodedName, 'Set'); // Fetch set data using fetchLore
        setSetData(data);
      } catch (err) {
        console.error("Error fetching set data:", err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSetData();
  }, [name, decodedName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!setData) return <div>No data found</div>;

  // Function to handle card click, navigating to /cards/[name]
  const handleCardClick = (cardName: string) => {
    router.push(`/cards/${encodeURIComponent(cardName)}`); // Navigate to card page
  };

  return (
    <div>
      <h1>{setData.name}</h1>
      <p>Base Set Size: {setData.baseSetSize}</p>
      <p>Release Date: {setData.releaseDate}</p>
      <p>Total Set Size: {setData.totalSetSize}</p>
      <p>Type: {setData.type}</p>

      <h2>Cards in Set:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Responsive grid layout */}
        {setData.cards.length > 0 ? (
          setData.cards.map((card) => (
            <div
              key={card.name}
              className="card-container border border-gray-300 rounded p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCardClick(card.name)} // Navigate on click
            >
              <h3 className="font-bold text-lg">{card.name}</h3>
              <p>Type: {card.type ?? 'Unknown type'}</p>
              <p>Rarity: {card.rarity ?? 'Unknown rarity'}</p>
              <p>Mana Value: {card.manaValue !== null ? card.manaValue : 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No cards found in this set.</p>
        )}
      </div>
    </div>
  );
};

export default SetPage;
