import { gql } from "@apollo/client";
import client from "./apolloClient";

interface NetworkError extends Error {
  networkError?: unknown;
}

export const fetchLore = async (
  id: string,
  category: "Card" | "Set" | "Artist",
  options = { cache: false }
) => {
  if (!id || !category) {
    throw new Error("ID and category must be provided");
  }

  const queries = {
    Card: gql`
      query GetCard($uuid: String!) {
        cardSet(uuid: $uuid) {
          name
          manaValue
          rarity
          type
          colors # Fetch the array of strings directly, no subfields
          power
          toughness
          flavorText
          artist # Fetch the string directly, no subfields
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
            colors # Fetch the array of strings directly, no subfields
            artist # Fetch the string directly, no subfields
            keywords # Add keywords for each card
            subtypes # Add subtypes for each card
            supertypes # Add supertypes for each card
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
  };

  const query = queries[category];

  try {
    const variables =
      category === "Card"
        ? { uuid: id }
        : category === "Set"
        ? { code: id }
        : { name: id };

    console.log("Sending GraphQL request with variables:", variables);

    const { data, errors } = await client.query({
      query,
      variables,
      fetchPolicy: options.cache ? "cache-first" : "no-cache",
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(
        `GraphQL errors: ${errors.map((err) => err.message).join(", ")}`
      );
    }

    // Return data based on the category
    console.log(data)
    if (category === "Card") {
      return data.cardSet;
    } else if (category === "Set") {
      return data.set;
    } else if (category === "Artist") {
      return data.artist;
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
