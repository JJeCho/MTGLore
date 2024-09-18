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

  type SearchResult {
    name: String!
    category: String!
    uuid: String
    code: String
  }

  # Queries for fetching models
  type Query {
    # Search by term across sets and cards
    search(searchTerm: String!): [SearchResult!]!
    
    set(code: String!): Set

    # Fetch a card by uuid
    cardSet(uuid: String!): CardSet
  }
`;

module.exports = { typeDefs };
