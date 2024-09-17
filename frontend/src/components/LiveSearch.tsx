'use client';

import { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

// Define the GraphQL query for searching
const SEARCH_QUERY = gql`
  query Search($searchTerm: String!) {
    search(searchTerm: $searchTerm) {
      name
      category
    }
  }
`;

type SearchResult = {
  name: string;
  category: string;
};

const LiveSearch = ({ onResultClick }: { onResultClick: (category: string, name: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Apollo Client lazy query for searching
  const [search, { loading, data, error }] = useLazyQuery(SEARCH_QUERY);

  // Debounce search term to avoid over-querying
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Trigger the GraphQL query when the debounced search term changes
      search({ variables: { searchTerm: debouncedSearchTerm } });
    }
  }, [debouncedSearchTerm, search]);

  useEffect(() => {
    if (data && data.search) {
      setSearchResults(data.search);
    }
  }, [data]);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for Planeswalkers, Creatures, Sets, Cards, etc."
        className="border border-gray-300 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
      />

      {loading && <p className="text-gray-500 text-center mt-2">Searching...</p>}
      {error && <p className="text-red-500 text-center mt-2">Error: {error.message}</p>}

      {searchResults.length > 0 && (
        <ul className="mt-4 bg-white shadow-lg rounded-lg divide-y divide-gray-200">
          {searchResults.map((result, index) => (
            <li key={index} className="p-4 hover:bg-blue-50 transition duration-150">
              <button
                onClick={() => onResultClick(result.category, result.name)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {result.name} <span className="text-gray-500">({result.category})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveSearch;
