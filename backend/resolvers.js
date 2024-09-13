const neo4j = require('neo4j-driver');

// Helper function to run a Cypher query and return results
const runCypherQuery = async (driver, query, params = {}) => {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result.records.map(record => record.toObject());
  } finally {
    await session.close();
  }
};

const resolvers = {
  Query: {
    // Fetch all planeswalkers
    planeswalkers: async (_, __, { driver }) => {
      const query = `
        MATCH (p:Planeswalker)
        RETURN p.name AS name, p.description AS description
      `;
      const result = await runCypherQuery(driver, query);
      return result.map(({ name, description }) => ({ name, description }));
    },

    // Fetch a single planeswalker by name
    planeswalker: async (_, { name }, { driver }) => {
      const query = `
        MATCH (p:Planeswalker {name: $name})
        RETURN p.name AS name, p.description AS description
      `;
      const result = await runCypherQuery(driver, query, { name });
      return result[0] || null;
    },

    // Fetch all creatures
    creatures: async (_, __, { driver }) => {
      const query = `
        MATCH (c:Creature)
        RETURN c.name AS name, c.description AS description
      `;
      const result = await runCypherQuery(driver, query);
      return result.map(({ name, description }) => ({ name, description }));
    },

    // Fetch a single creature by name
    creature: async (_, { name }, { driver }) => {
      const query = `
        MATCH (c:Creature {name: $name})
        RETURN c.name AS name, c.description AS description
      `;
      const result = await runCypherQuery(driver, query, { name });
      return result[0] || null;
    },

    // Fetch all artifacts
    artifacts: async (_, __, { driver }) => {
      const query = `
        MATCH (a:Artifact)
        RETURN a.name AS name, a.description AS description
      `;
      const result = await runCypherQuery(driver, query);
      return result.map(({ name, description }) => ({ name, description }));
    },

    // Fetch a single artifact by name
    artifact: async (_, { name }, { driver }) => {
      const query = `
        MATCH (a:Artifact {name: $name})
        RETURN a.name AS name, a.description AS description
      `;
      const result = await runCypherQuery(driver, query, { name });
      return result[0] || null;
    },

    // Fetch all lands
    lands: async (_, __, { driver }) => {
      const query = `
        MATCH (l:Land)
        RETURN l.name AS name, l.description AS description
      `;
      const result = await runCypherQuery(driver, query);
      return result.map(({ name, description }) => ({ name, description }));
    },

    // Fetch a single land by name
    land: async (_, { name }, { driver }) => {
      const query = `
        MATCH (l:Land {name: $name})
        RETURN l.name AS name, l.description AS description
      `;
      const result = await runCypherQuery(driver, query, { name });
      return result[0] || null;
    },

    // Fetch all planes
    planes: async (_, __, { driver }) => {
      const query = `
        MATCH (pl:Plane)
        RETURN pl.name AS name, pl.description AS description
      `;
      const result = await runCypherQuery(driver, query);
      return result.map(({ name, description }) => ({ name, description }));
    },

    // Fetch a single plane by name
    // Fetch a single plane by name
plane: async (_, { name }, { driver }) => {
  const query = `
    MATCH (pl:Plane {name: $name})
    OPTIONAL MATCH (loc:Location)-[:EXISTS_IN]->(pl)
    RETURN pl.name AS name, 
           pl.description AS description, 
           collect({name: loc.name, description: loc.description}) AS locations
  `;
  const result = await runCypherQuery(driver, query, { name });
  if (!result[0]) return null;

  return {
    name: result[0].name,
    description: result[0].description,
    locations: result[0].locations.filter(loc => loc.name !== null),
  };
},

    // Fetch all sets
    // Fetch all sets
sets: async (_, __, { driver }) => {
  const query = `
    MATCH (s:Set)
    RETURN s.name AS name, s.baseSetSize AS baseSetSize, s.releaseDate AS releaseDate, s.totalSetSize AS totalSetSize, s.type AS type
  `;
  const result = await runCypherQuery(driver, query);
  return result.map(({ name, baseSetSize, releaseDate, totalSetSize, type }) => ({
    name,
    baseSetSize,
    releaseDate,
    totalSetSize,
    type,
  }));
},


   // Fetch a specific set by name
set: async (_, { name }, { driver }) => {
  const query = `
    MATCH (s:Set {name: $name})
    OPTIONAL MATCH (c:CardSet)-[:BELONGS_TO]->(s)
    RETURN s.name AS name, 
           s.baseSetSize AS baseSetSize, 
           s.releaseDate AS releaseDate, 
           s.totalSetSize AS totalSetSize, 
           s.type AS type,
           collect({
             uuid: c.uuid,
             name: c.name,
             manaValue: c.manaValue,
             rarity: c.rarity,
             type: c.type,
             colors: c.colors,
             power: c.power,
             toughness: c.toughness
           }) AS cards
  `;
  const result = await runCypherQuery(driver, query, { name });
  if (!result[0]) return null;

  const { baseSetSize, releaseDate, totalSetSize, type, cards } = result[0];
  return {
    name,
    baseSetSize,
    releaseDate,
    totalSetSize,
    type,
    cards: cards.filter(card => card.uuid !== null),
  };
},



    // Fetch a single card from a set by UUID
    cardSet: async (_, { name }, { driver }) => {
      const query = `
        MATCH (c:CardSet {name: $name})
        RETURN c.uuid AS uuid, 
               c.name AS name, 
               c.manaValue AS manaValue, 
               c.convertedManaCost AS convertedManaCost, 
               c.rarity AS rarity, 
               c.type AS type
      `;
      const result = await runCypherQuery(driver, query, { name });
      return result[0] || null; // Return the first result or null if not found
    },

    /// Fetch all cards in a set (using set name)
cardsInSet: async (_, { name }, { driver }) => {
  const query = `
    MATCH (c:CardSet)-[:BELONGS_TO]->(s:Set {name: $name})
    RETURN c.uuid AS uuid, 
           c.name AS name, 
           c.manaValue AS manaValue, 
           c.rarity AS rarity, 
           c.type AS type
  `;
  const result = await runCypherQuery(driver, query, { name });
  return result.map(({ uuid, name, manaValue, rarity, type, colors, power, toughness }) => ({
    uuid,
    name,
    manaValue,
    rarity,
    type,
    colors,
    power,
    toughness,
  }));
},

  },
};

module.exports = { resolvers };
