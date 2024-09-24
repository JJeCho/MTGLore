"use client";

import { useState, useEffect } from "react";
import { fetchLore } from "@/lib/api";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import getBorderColor from "@/lib/borderColor";
import { CardSet } from "@/lib/types";

const CardsPage = () => {
  const router = useRouter();
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [filters, setFilters] = useState<{ manaValue?: number; rarity?: string; type?: string; colorName?: string }>({
    manaValue: undefined,
    rarity: "",
    type: "",
    colorName: "",
  });
  const limit = 30;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLore("", "Cards", { skip, limit }, filters);
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

  const handleCardClick = (uuid: string) => {
    router.push(`/cards/${uuid}`);
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === "manaValue" ? parseFloat(value) || undefined : value || undefined,
    }));
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!cardSets.length) return <p className="text-center text-gray-500">No card sets found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Cards</h1>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="number"
          name="manaValue"
          placeholder="Mana Value"
          value={filters.manaValue || ""}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          name="rarity"
          placeholder="Rarity"
          value={filters.rarity || ""}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          name="type"
          placeholder="Type"
          value={filters.type || ""}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          name="colorName"
          placeholder="Color Name"
          value={filters.colorName || ""}
          onChange={handleFilterChange}
        />
        <Button onClick={fetchData}>Apply Filters</Button>
      </div>

      {/* Pagination Buttons */}
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
          disabled={cardSets.length < limit}
        >
          Next
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {cardSets.map((card) => (
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
              <p className="text-sm"><strong>Colors:</strong> {card.colors?.join(', ') || 'Colorless'}</p>
              {card.power && card.toughness && (
                <div className="mt-4">
                  <p className="text-sm"><strong>Power:</strong> {card.power}</p>
                  <p className="text-sm"><strong>Toughness:</strong> {card.toughness}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardsPage;
