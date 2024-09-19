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
      case 'Artist':
        routePath = `/artists/${id}`; // Route for artists using name
        break;
      // Add other specific categories if needed
      default:
        break;
    }

    router.push(routePath);
  };

  const handleColorNavigate = (color: string) => {
    router.push(`/colors/${color}`);
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

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => handleColorNavigate('W')}
            className="px-4 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100"
          >
            White
          </button>
          <button
            onClick={() => handleColorNavigate('U')}
            className="px-4 py-2 bg-blue-500 text-white border border-blue-300 rounded hover:bg-blue-600"
          >
            Blue
          </button>
          <button
            onClick={() => handleColorNavigate('B')}
            className="px-4 py-2 bg-black text-white border border-gray-700 rounded hover:bg-gray-800"
          >
            Black
          </button>
          <button
            onClick={() => handleColorNavigate('R')}
            className="px-4 py-2 bg-red-500 text-white border border-red-300 rounded hover:bg-red-600"
          >
            Red
          </button>
          <button
            onClick={() => handleColorNavigate('G')}
            className="px-4 py-2 bg-green-500 text-white border border-green-300 rounded hover:bg-green-600"
          >
            Green
          </button>
        </div>

        <div className="text-sm sm:text-base text-center text-gray-500 mt-6">
          Powered by GraphQL and Neo4j
        </div>
      </div>
    </div>
  );
};

export default HomePage;
