"use client";
import { useState, useEffect } from 'react';
import { fetchLore } from '@/lib/api'; // Adjust the path if necessary

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
        const cardData = await fetchLore(decodedName, 'Card'); // Fetch card data using the fetchLore function
        setCard(cardData);
      } catch (err) {
        setError('Error fetching card data');
      } finally {
        setLoading(false);
      }
    };

    getCardData();
  }, [decodedName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!card) return <p>No card data found</p>;

  return (
    <div>
      <h1>{card.name}</h1>
      <p>Mana Value: {card.manaValue !== null ? card.manaValue : 'N/A'}</p>
      <p>Converted Mana Cost: {card.convertedManaCost !== null ? card.convertedManaCost : 'N/A'}</p>
      <p>Rarity: {card.rarity ?? 'Unknown'}</p>
      <p>Type: {card.type ?? 'Unknown'}</p>
    </div>
  );
};

export default CardPage;
