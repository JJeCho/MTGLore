const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Planeswalker {
    name: String!
    description: String!
  }

  type Creature {
    name: String!
    description: String!
  }

  type Artifact {
    name: String!
    description: String!
  }

  type Land {
    name: String!
    description: String!
  }

  type Plane {
    name: String!
    description: String!
    locations: [Location]
  }

  type Location {
    name: String!
    description: String!
  }

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
    cards: [CardSet!]!
  }

  type Query {
    planeswalkers: [Planeswalker!]
    planeswalker(name: String!): Planeswalker
    creatures: [Creature!]
    creature(name: String!): Creature
    artifacts: [Artifact!]
    artifact(name: String!): Artifact
    lands: [Land!]
    land(name: String!): Land
    planes: [Plane!]
    plane(name: String!): Plane

    # Set-related queries
    sets: [Set!]
    set(name: String!): Set
    cardSet(name: String!): CardSet
    cardsInSet(name: String!): [CardSet!]
  }
`;

module.exports = { typeDefs };
