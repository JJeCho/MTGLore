"use client";
import { fetchLore } from '@/lib/api';
import { useEffect, useState } from 'react';

type LoreData = {
  name: string;
  description: string;
  locations?: { name: string; description: string }[];
};

const LorePage = ({ params }: { params: { category: string; name: string } }) => {
  const { category, name } = params;
  console.log(params);

  // Decode the URL-encoded name
  const decodedName = decodeURIComponent(name);

  const [lore, setLore] = useState<LoreData | null>(null);

  useEffect(() => {
    const fetchLoreData = async () => {
      const data = await fetchLore(decodedName, category); // Use decodedName
      setLore(data);
    };

    fetchLoreData();
  }, [category, decodedName]);

  if (!lore) return <div>Loading...</div>;

  return (
    <div>
      <h1>{lore.name}</h1>
      <p>{lore.description}</p>
      {lore.locations && lore.locations.length > 0 && (
        <div>
          <h2>Locations</h2>
          <ul>
            {lore.locations.map((location, index) => (
              <li key={index}>
                <strong>{location.name}</strong>: {location.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LorePage;
