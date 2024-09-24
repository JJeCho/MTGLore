const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # CardSet type (individual cards)
  type CardSet {
    name: String!
    manaValue: Float
    uuid: String!
    convertedManaCost: Float
    rarity: String
    type: String
    colors: [String]
    power: String
    toughness: String
    flavorText: String
    artist: String # Artist can be nullable
    hasFoil: Boolean
    hasNonFoil: Boolean
    borderColor: String
    frameVersion: String
    originalText: String
    keywords: [String]
    subtypes: [String]
    supertypes: [String]
    code: [String]
    setName: [String]
    scryfallId: String
  }

  # Set type (a collection of CardSets)
  type Set {
    name: String
    releaseDate: String
    totalSetSize: Int
    type: String
    code: String
    cards: [CardSet]
  }

  # Artist type
  type Artist {
    name: String!
    cards: [CardSet!]!
  }

  type Color {
    name: String!
    cards: [CardSet!]!
  }

  type Rarity {
    name: String!
    cards: [CardSet!]!
  }

  type ManaValue {
    manaValue: Float!
    cards: [CardSet!]!
  }

  # SearchResult type for combined set, card, and artist search results
  type SearchResult {
    name: String!
    category: String!
    uuid: String
    code: String
  }

  # Queries for fetching sets, card sets, artists, and search results
  type Query {
    # Search across sets, cards, and artists by term
    search(searchTerm: String!): [SearchResult!]!

    # Search for artists by name
    artist(name: String!): Artist

    # Fetch a color by its name
    color(name: String!, skip: Int = 0, limit: Int = 10): Color

    # Fetch a set by its code
    set(code: String!): Set

    # Fetch a card by its uuid
    cardSet(uuid: String!): CardSet

    cardSets(
      manaValue: Float
      rarity: String
      type: String
      colorName: String
      skip: Int = 0
      limit: Int = 30
    ): [CardSet!]!

    rarity(name: String!, skip: Int = 0, limit: Int = 30): Rarity

    manaValue(value: Float!, skip: Int = 0, limit: Int = 30): ManaValue
  }
`;

module.exports = { typeDefs };
