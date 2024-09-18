import { gql } from '@apollo/client';
import client from './apolloClient';
export const fetchLore = async (id: string, category: 'Card' | 'Set', options = { cache: false }) => {
  if (!id || !category) {
    throw new Error('ID and category must be provided');
  }

  const queries = {
    Card: gql`
      query GetCardSet($uuid: String!) {
        cardSet(uuid: $uuid) {
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
      query GetSet($code: String!) {
        set(code: $code) {
          name
          releaseDate
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

  // Select the appropriate query based on the category
  const query = queries[category];

  // Define variables based on the category ('Card' uses uuid, 'Set' uses code)
  const variables = category === 'Card' ? { uuid: id } : { code: id };

  try {
    // Execute the query with the correct variables
    const { data, errors } = await client.query({
      query,
      variables,
      fetchPolicy: options.cache ? 'cache-first' : 'no-cache',
    });

    if (errors) {
      console.error('GraphQL errors:', errors);
      throw new Error(`GraphQL errors: ${errors.map((err) => err.message).join(', ')}`);
    }

    // Return the correct data based on the category
    return category === 'Card' ? data.cardSet : data.set;
  } catch (error) {
    console.error(`GraphQL error for ${category} with ID ${id}:`, error);
    if (error.networkError) {
      throw new Error('Network error occurred while fetching data');
    } else {
      throw new Error(`Failed to fetch ${category}`);
    }
  }
};
