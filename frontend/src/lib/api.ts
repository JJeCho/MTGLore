import { gql } from "@apollo/client";
import client from "./apolloClient";

interface NetworkError extends Error {
  networkError?: unknown;
}

interface FetchLoreOptions {
  cache?: boolean;
  skip?: number;
  limit?: number;
}

// Step 1: Define the GraphQL Queries
const getCardQuery = gql`
  query GetCard($uuid: String!) {
    cardSet(uuid: $uuid) {
      name
      manaValue
      rarity
      type
      colors
      power
      toughness
      flavorText
      artist
      hasFoil
      hasNonFoil
      borderColor
      frameVersion
      originalText
      keywords
      subtypes
      supertypes
    }
  }
`;

const getSetQuery = gql`
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
        colors
        artist
        keywords
        subtypes
        supertypes
      }
    }
  }
`;

const getArtistQuery = gql`
  query GetArtist($name: String!) {
    artist(name: $name) {
      name
      cards {
        uuid
        name
        manaValue
        rarity
        type
        colors
        artist
      }
    }
  }
`;

const getColorQuery = gql`
  query GetColor($name: String!, $skip: Int = 0, $limit: Int = 10) {
    color(name: $name, skip: $skip, limit: $limit) {
      name
      cards {
        uuid
        name
        manaValue
        rarity
        type
        power
        toughness
        colors
        keywords
        subtypes
        supertypes
        code  # Make sure you include the code field in the query
      }
    }
  }
`;

const getCardsQuery = gql`
  query GetCardSets($skip: Int = 0, $limit: Int = 30) {
    cardSets(skip: $skip, limit: $limit) {
      uuid
      name
      manaValue
      rarity
      type
      colors
      power
      toughness
      flavorText
      artist
      hasFoil
      hasNonFoil
      borderColor
      frameVersion
      originalText
      keywords
      subtypes
      supertypes
    }
  }
`;

// Step 2: Handle Variable Mapping Based on Category
const getVariablesByCategory = (
  id: string,
  category: "Card" | "Set" | "Artist" | "Color" | "Cards",
  skip: number,
  limit: number
) => {
  switch (category) {
    case "Card":
      return { uuid: id };
    case "Set":
      return { code: id };
    case "Artist":
      return { name: id };
    case "Color":
      return { name: id, skip, limit };
    case "Cards":
      return { skip, limit };
    default:
      throw new Error("Invalid category");
  }
};

// Step 3: Handle GraphQL Query Execution
const executeGraphQLQuery = async (
  query: any,
  variables: any,
  cache: boolean
) => {
  try {
    const { data, errors } = await client.query({
      query,
      variables,
      fetchPolicy: cache ? "cache-first" : "no-cache",
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(
        `GraphQL errors: ${errors.map((err: any) => err.message).join(", ")}`
      );
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("GraphQL error:", error.message);

      if ((error as NetworkError).networkError) {
        console.error("Network error details:", (error as NetworkError).networkError);
        throw new Error("Network error occurred while fetching data");
      } else {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
    } else {
      throw new Error("Unknown error occurred");
    }
  }
};

// Step 4: Main fetchLore Function
export const fetchLore = async (
  id: string,
  category: "Card" | "Set" | "Artist" | "Color" | "Cards",
  options: FetchLoreOptions = {}
) => {
  if (!id && category !== "Cards") {
    throw new Error("ID and category must be provided");
  }

  const { cache = false, skip = 0, limit = 10 } = options;

  // Map category to GraphQL query
  const query = (() => {
    switch (category) {
      case "Card":
        return getCardQuery;
      case "Set":
        return getSetQuery;
      case "Artist":
        return getArtistQuery;
      case "Color":
        return getColorQuery;
      case "Cards":
        return getCardsQuery;
      default:
        throw new Error("Invalid category");
    }
  })();

  // Prepare variables based on category
  const variables = getVariablesByCategory(id, category, Math.floor(skip), Math.floor(limit));

  console.log("Sending GraphQL request with variables:", variables);

  // Execute GraphQL query
  const data = await executeGraphQLQuery(query, variables, cache);

  // Return data based on category
  switch (category) {
    case "Card":
      return data.cardSet;
    case "Set":
      return data.set;
    case "Artist":
      return data.artist;
    case "Color":
      return data.color;
    case "Cards":
      return data.cardSets;
    default:
      throw new Error("Invalid category");
  }
};
