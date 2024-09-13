'use client';

import { useRouter } from 'next/navigation';
import LiveSearch from '@/components/LiveSearch';  // Adjust the import path if needed

const HomePage = () => {
  const router = useRouter();

  const handleNavigate = (category: string, name: string) => {
    let routePath = `/lore/${category}/${name}`; // Default route

    // Modify the route path based on the category
    switch (category) {
      case 'Set':
        routePath = `/sets/${name}`; // Route for sets
        break;
      case 'Card':
        routePath = `/cards/${name}`; // Route for cards
        break;
      // Add other specific categories if needed
      default:
        // Keep the default route for other categories like Planeswalkers, Creatures, etc.
        break;
    }

    router.push(routePath);
  };

  return (
    <div>
      <h1>Magic: The Gathering Lore Encyclopedia</h1>
      <p>Search for lore by name:</p>

      {/* Use the LiveSearch component and pass the handleNavigate function */}
      <LiveSearch onResultClick={handleNavigate} />
    </div>
  );
};

export default HomePage;
