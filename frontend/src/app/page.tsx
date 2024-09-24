'use client';

import { useRouter } from 'next/navigation';
import LiveSearch from '@/components/LiveSearch';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const HomePage = () => {
  const router = useRouter();

  const handleNavigate = (category: string, id: string) => {
    let routePath = `/lore/${category}/${id}`;

    switch (category) {
      case 'Set':
        routePath = `/sets/${id}`;
        break;
      case 'Card':
        routePath = `/cards/${id}`;
        break;
      case 'Cards':
        routePath = `/cards`;
        break;
      case 'Artist':
        routePath = `/artists/${id}`;
        break;
      case 'Color':
        routePath = `/colors/${id}`;
        break;
      case 'Rarity':
        routePath = `/rarity/${id}`;
        break;
      case 'ManaValue':
        routePath = `/manaValue/${Number(id)}`;
        break;
      default:
        break;
    }

    router.push(routePath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6 md:p-12 lg:p-16">
      <Card className="w-full max-w-lg lg:max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-4">
            Magic: The Gathering Lore Encyclopedia
          </h1>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-6">
            Search for your favorite cards, sets, and more from the Magic: The Gathering universe.
          </p>
        </CardHeader>
        <CardContent>
          <LiveSearch onResultClick={handleNavigate} />

          <p className="text-sm sm:text-base text-center text-gray-500 mt-6">
            Powered by GraphQL and Neo4j
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
