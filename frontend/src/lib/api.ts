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

export const fetchLore = async (
  id: string,
  category: "Card" | "Set" | "Artist" | "Color",
  options: FetchLoreOptions = {}
) => {
  if (!id || !category) {
    throw new Error("ID and category must be provided");
  }

  const { cache = false, skip = 0, limit = 10 } = options;

  const queries = {
    Card: gql`
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
            colors
            artist
            keywords
            subtypes
            supertypes
          }
        }
      }
    `,
    Artist: gql`
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
    `,
    Color: gql`
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
            keywords
            subtypes
            supertypes
          }
        }
      }
    `,
  };

  const query = queries[category];

  try {
    let variables: any = {};

    if (category === "Card") {
      variables = { uuid: id };
    } else if (category === "Set") {
      variables = { code: id };
    } else if (category === "Artist") {
      variables = { name: id };
    } else if (category === "Color") {
      variables = {
        name: id,
        skip: Math.floor(skip),
        limit: Math.floor(limit),
      };
    }
    console.log("Sending GraphQL request with variables:", variables);

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

    // Return data based on the category
    console.log(data);
    if (category === "Card") {
      return data.cardSet;
    } else if (category === "Set") {
      return data.set;
    } else if (category === "Artist") {
      return data.artist;
    } else if (category === "Color") {
      return data.color;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `GraphQL error for ${category} with ID ${id}:`,
        error.message
      );

      // Check if the error has a networkError property
      if ((error as NetworkError).networkError) {
        console.error(
          "Network error details:",
          (error as NetworkError).networkError
        );
        throw new Error("Network error occurred while fetching data");
      } else {
        throw new Error(`Failed to fetch ${category}: ${error.message}`);
      }
    } else {
      // Handle the case where error is not an instance of Error
      throw new Error(`Unknown error occurred while fetching ${category}`);
    }
  }
};
