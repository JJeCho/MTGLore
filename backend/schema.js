const { gql } = require('apollo-server-express');

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
    artist: String
    hasFoil: Boolean
    hasNonFoil: Boolean
    borderColor: String
    frameVersion: String
    originalText: String
  }

  # Set type (a collection of CardSets)
  type Set {
    name: String!
    releaseDate: String!
    totalSetSize: Int!
    code: String!
    cards: [CardSet!]!
  }

  # SearchResult type for combined set and card search results
  type SearchResult {
    name: String!
    category: String!
    uuid: String
    code: String
  }

  # Queries for fetching sets, card sets, and search results
  type Query {
    # Search across sets and cards by term
    search(searchTerm: String!): [SearchResult!]!

    # Fetch a set by its code
    set(code: String!): Set

    # Fetch a card by its uuid
    cardSet(uuid: String!): CardSet
  }
`;

module.exports = { typeDefs };
