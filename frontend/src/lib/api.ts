import { gql } from '@apollo/client';
import client from './apolloClient'; // Assuming Apollo Client is set up

export const fetchLore = async (name: string, category: string) => {
  let query;

  // Decode the name to handle URL-encoded characters
  const decodedName = decodeURIComponent(name);
  console.log(decodedName, name)
  // Dynamically choose the query based on the category
  switch (category) {
    case 'Planeswalker':
      query = gql`
        query GetPlaneswalker($name: String!) {
          planeswalker(name: $name) {
            name
            description
          }
        }
      `;
      break;
    case 'Creature':
      query = gql`
        query GetCreature($name: String!) {
          creature(name: $name) {
            name
            description
          }
        }
      `;
      break;
    case 'Artifact':
      query = gql`
        query GetArtifact($name: String!) {
          artifact(name: $name) {
            name
            description
          }
        }
      `;
      break;
    case 'Land':
      query = gql`
        query GetLand($name: String!) {
          land(name: $name) {
            name
            description
          }
        }
      `;
      break;
    case 'Plane':
      query = gql`
        query GetPlane($name: String!) {
          plane(name: $name) {
            name
            description
            locations {
              name
              description
            }
          }
        }
      `;
      break;
    case 'Card': // Fetch a card based on the name from CardSet
    console.log(name)
      query = gql`
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
      `;
      break;
    case 'Set': // Fetch a set based on the name
      console.log(name)
      query = gql`
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
      `;
      break;
    default:
      throw new Error('Invalid category');
  }

  try {
    // Use Apollo Client to fetch the data from the GraphQL server
    const { data } = await client.query({
      query,
      variables: { name: decodedName },
      fetchPolicy: 'no-cache', // Avoid caching issues
    });

    // Return the correct data based on category
    switch (category) {
      case 'Planeswalker':
        return data.planeswalker;
      case 'Creature':
        return data.creature;
      case 'Artifact':
        return data.artifact;
      case 'Land':
        return data.land;
      case 'Plane':
        return {
          ...data.plane,
          locations: data.plane.locations || [] // Ensure locations is an array (empty if no locations)
        };
      case 'Card':
        return data.cardSet; // Card is stored as cardSet in Neo4j
      case 'Set':
        return {
          ...data.set,
          cards: data.set.cards || [] // Ensure cards is an array (empty if no cards)
        };
      default:
        return null;
    }
  } catch (error) {
    console.error(`GraphQL error for ${category} with name ${decodedName}:`, error); // Log the error with category and decoded name
    throw new Error('Failed to fetch data');
  }
};
