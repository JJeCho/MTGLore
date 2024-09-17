import { gql } from '@apollo/client';
import client from './apolloClient'; // Ensure Apollo Client is properly set up

// Function to fetch data from the server using Apollo Client
export const fetchLore = async (
  name: string,
  category: 'Card' | 'Set', // Enforce specific categories
  options = { cache: false } // Allow optional caching control
) => {
  if (!name || !category) {
    throw new Error('Name and category must be provided');
  }

  // Decode the name to handle URL-encoded characters
  const decodedName = decodeURIComponent(name);

  // GraphQL query based on the provided category
  const queries = {
    Card: gql`
      query GetCardSet($name: String!) {
        cardSet(name: $name) {
          name
          manaValue
          type
          uuid
          convertedManaCost
          rarity
        }
      }
    `,
    Set: gql`
      query GetSet($name: String!) {
        set(name: $name) {
          name
          releaseDate
          baseSetSize
          totalSetSize
          type
          cards {
            name
            manaValue
            type
            uuid
            rarity
          }
        }
      }
    `,
  };

  // Fetch the corresponding query for the category
  const query = queries[category];

  try {
    // Execute the query using Apollo Client
    const { data } = await client.query({
      query,
      variables: { name: decodedName },
      fetchPolicy: options.cache ? 'cache-first' : 'no-cache', // Dynamically set cache policy
    });

    // Return the appropriate data based on the category
    return category === 'Card' ? data.cardSet : { ...data.set, cards: data.set.cards || [] };

  } catch (error: unknown) { // Catching an unknown type error
    // Check if error is an instance of Error
    if (error instanceof Error) {
      console.error(`GraphQL error for ${category} with name ${decodedName}:`, error.message);
      
      // Handle specific error scenarios
      if ('networkError' in error) {
        throw new Error('Network error occurred while fetching data');
      }
      if ('graphQLErrors' in error) {
        throw new Error(`GraphQL errors: ${error.message}`);
      }
    } else {
      // In case the error is not of type Error
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }

    throw new Error('Failed to fetch data');
  }
};
