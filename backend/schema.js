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
    artist: String  # Artist can be nullable
    hasFoil: Boolean
    hasNonFoil: Boolean
    borderColor: String
    frameVersion: String
    originalText: String
    keywords: [String]
    subtypes: [String]
    supertypes: [String]
  }

  # Set type (a collection of CardSets)
  type Set {
    name: String
    releaseDate: String
    totalSetSize: Int
    type: String
    cards: [CardSet]
  }

  # Artist type
  type Artist {
    name: String!
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

    # Fetch a set by its code
    set(code: String!): Set

    # Fetch a card by its uuid
    cardSet(uuid: String!): CardSet
  }
`;

module.exports = { typeDefs };
