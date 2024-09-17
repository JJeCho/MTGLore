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
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for Planeswalkers, Creatures, Sets, Cards, etc."
        className="border border-gray-300 rounded px-2 py-1"
      />

      {loading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}

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
