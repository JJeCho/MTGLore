'use client';

import { useRouter } from 'next/navigation';
import LiveSearch from '@/components/LiveSearch';  // Adjust the import path if needed

const HomePage = () => {
  const router = useRouter();

  // Update the handleNavigate function to use uuid for Card and code for Set
  const handleNavigate = (category: string, id: string) => {
    let routePath = `/lore/${category}/${id}`; // Default route

    // Modify the route path based on the category
    switch (category) {
      case 'Set':
        routePath = `/sets/${id}`; // Route for sets using code
        break;
      case 'Card':
        routePath = `/cards/${id}`; // Route for cards using uuid
        break;
      // Add other specific categories if needed
      default:
        break;
    }

    router.push(routePath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6 md:p-12 lg:p-16">
      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 md:p-12 lg:p-16 max-w-lg w-full lg:max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-700 mb-4">
          Magic: The Gathering Lore Encyclopedia
        </h1>
        <p className="text-gray-700 text-center text-base sm:text-lg md:text-xl mb-6">
          Search for your favorite cards, sets, and more from the Magic: The Gathering universe.
        </p>

        {/* LiveSearch component */}
        <LiveSearch onResultClick={handleNavigate} />

        <div className="text-sm sm:text-base text-center text-gray-500 mt-6">
          Powered by GraphQL and Neo4j
        </div>
      </div>
    </div>
  );
};

export default HomePage;
