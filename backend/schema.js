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
  }

  # Set type (a collection of CardSets)
  type Set {
    baseSetSize: Int!
    name: String!
    releaseDate: String!
    totalSetSize: Int!
    type: String!
    code: String!
    cards: [CardSet!]!
  }

type SearchResult {
  name: String!
  category: String!
}

type Query {
  search(searchTerm: String!): [SearchResult!]!
}

  # Queries for fetching models
  type Query {
    search(searchTerm: String!): [SearchResult!]!

    # Fetch all card sets with optional pagination
    sets(limit: Int, offset: Int): [Set!]

    # Fetch a single set by name
    set(name: String!): Set

    # Fetch a card by name
    cardSet(name: String!): CardSet
  }
`;

module.exports = { typeDefs };
