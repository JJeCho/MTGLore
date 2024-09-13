"use client";
import { useEffect, useState } from 'react';
import { fetchLore } from '@/lib/api'; // Ensure this is correctly importing fetchLore

type CardSet = {
  uuid: string;
  name: string;
  manaValue: number | null;
  rarity: string | null;
  type: string | null;
  colors: string[];
  power: string | null;
  toughness: string | null;
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

  const [setData, setSetData] = useState<SetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const decodedName = decodeURIComponent(name);

  // Log params and name to debug
  console.log("Params:", params);
  console.log("Name:", name);
  console.log("Decoded Name:", decodedName);

  useEffect(() => {
    // Check if name is available
    if (!name) {
      console.log("No name provided, skipping fetch");
      return;
    }

    const fetchSetData = async () => {
      try {
        console.log("Fetching set data for:", decodedName);
        const data = await fetchLore(decodedName, 'Set'); // Fetch set data using fetchLore
        console.log(data)
        setSetData(data);
      } catch (err) {
        console.error("Error fetching set data:", err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSetData();
  }, [name, decodedName]); // Depend on both 'name' and 'decodedName'

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!setData) return <div>No data found</div>;

  return (
    <div>
      <h1>{setData.name}</h1>
      <p>Base Set Size: {setData.baseSetSize}</p>
      <p>Release Date: {setData.releaseDate}</p>
      <p>Total Set Size: {setData.totalSetSize}</p>
      <p>Type: {setData.type}</p>
      <h2>Cards in Set:</h2>
      <ul>
  {setData.cards.map((card) => (
    <li key={card.uuid}>
      {card.name} - {card.type ?? 'Unknown type'} - {card.rarity ?? 'Unknown rarity'}
      <br />
      Mana Value: {card.manaValue !== null ? card.manaValue : 'N/A'} <br />
    </li>
  ))}
</ul>
    </div>
  );
};

export default SetPage;
