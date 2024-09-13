'use client';

import { useState, useEffect } from 'react';

type SearchResult = {
  name: string;
  category: string;
};

const LiveSearch = ({ onResultClick }: { onResultClick: (category: string, name: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Debouncing state and timeout to avoid sending requests too frequently
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm) {
        setLoading(true);

        try {
          // Fetch search results from the server-side API
          const response = await fetch(`/api/search?searchTerm=${debouncedSearchTerm}`, {
            method: 'POST',
          });

          const results: SearchResult[] = await response.json();
          setSearchResults(results);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for Planeswalkers, Creatures, Sets, Cards, etc."
        className="border border-gray-300 rounded px-2 py-1"
      />

      {loading && <p>Searching...</p>}

      {searchResults.length > 0 && (
        <ul className="mt-2">
          {searchResults.map((result, index) => (
            <li key={index} className="mb-1">
              <button
                onClick={() => onResultClick(result.category, result.name)}
                className="text-blue-500 hover:underline"
              >
                {result.name} ({result.category})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveSearch;
