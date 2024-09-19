import { gql } from '@apollo/client';
import client from './apolloClient';

export const fetchLore = async (id: string, category: 'Card' | 'Set', options = { cache: false }) => {
  if (!id || !category) {
    throw new Error('ID and category must be provided');
  }

  const queries = {
    Card: gql`
      query GetCard($uuid: String!) {
        cardSet(uuid: $uuid) {
          name
          manaValue
          rarity
          type
          colors  # Fetch the array of strings directly, no subfields
          power
          toughness
          flavorText
          artist  # Fetch the string directly, no subfields
          hasFoil
          hasNonFoil
          borderColor
          frameVersion
          originalText
          keywords # Add keywords as an array of names
          subtypes # Add subtypes as an array of names
          supertypes # Add supertypes as an array of names
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
            uuid
            name
            manaValue
            rarity
            type
            colors  # Fetch the array of strings directly, no subfields
            artist  # Fetch the string directly, no subfields
            keywords # Add keywords for each card
            subtypes # Add subtypes for each card
            supertypes # Add supertypes for each card
          }
        }
      }
    `,
  };

  const query = queries[category];

  try {
    const variables = category === 'Card' ? { uuid: id } : { code: id };
    console.log('Sending GraphQL request with variables:', variables);
    const { data, errors } = await client.query({
      query,
      variables,
      fetchPolicy: options.cache ? 'cache-first' : 'no-cache',
    });

    if (errors) {
      console.error('GraphQL errors:', errors);
      throw new Error(`GraphQL errors: ${errors.map((err) => err.message).join(', ')}`);
    }

    return category === 'Card' ? data.cardSet : data.set;
  } catch (error) {
    console.error(`GraphQL error for ${category} with ID ${id}:`, error);
    if (error.networkError) {
      console.error('Network error details:', error.networkError);
      throw new Error('Network error occurred while fetching data');
    } else {
      throw new Error(`Failed to fetch ${category}`);
    }
  }
};
