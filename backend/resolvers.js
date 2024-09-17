const neo4j = require("neo4j-driver");

// Helper function to run a Cypher query and return results
const runCypherQuery = async (session, query, params = {}) => {
  const result = await session.run(query, params);
  return result.records.map((record) => record.toObject());
};

const resolvers = {
  Query: {
    // Fetch all sets with optional pagination
    sets: async (_, { limit = 10, offset = 0 }, { driver }) => {
      const session = driver.session();
      const query = `
        MATCH (s:Set)
        RETURN s.name AS name, s.baseSetSize AS baseSetSize, s.releaseDate AS releaseDate,
               s.totalSetSize AS totalSetSize, s.type AS type, s.code AS code
        SKIP $offset
        LIMIT $limit
      `;
      try {
        const result = await runCypherQuery(session, query, { offset, limit });
        return result.map(
          ({ name, baseSetSize, releaseDate, totalSetSize, type, code }) => ({
            name,
            baseSetSize,
            releaseDate,
            totalSetSize,
            type,
            code,
            cards: [],
          })
        );
      } finally {
        await session.close();
      }
    },

    // Fetch a single set by name, including its cards
    set: async (_, { name }, { driver }) => {
      const session = driver.session();
      const query = `
        MATCH (s:Set {name: $name})
        OPTIONAL MATCH (c:CardSet)-[:BELONGS_TO]->(s)
        WHERE c.name IS NOT NULL
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
      try {
        const [record] = await runCypherQuery(session, query, { name });
        if (record) {
          const { name, baseSetSize, releaseDate, totalSetSize, type, cards } = record;
          return {
            name,
            baseSetSize,
            releaseDate,
            totalSetSize,
            type,
            cards,
          };
        } else {
          return null;
        }
      } finally {
        await session.close();
      }
    },

    // Fetch a card by name
    cardSet: async (_, { name }, { driver }) => {
      const session = driver.session();
      const query = `
        MATCH (c:CardSet {name: $name})
        RETURN c.name AS name, c.manaValue AS manaValue, c.uuid AS uuid,
               c.convertedManaCost AS convertedManaCost, c.rarity AS rarity,
               c.type AS type, c.colors AS colors, c.power AS power, c.toughness AS toughness
      `;
      try {
        const [card] = await runCypherQuery(session, query, { name });
        return card || null;
      } finally {
        await session.close();
      }
    },
    search: async (_, { searchTerm }, { driver }) => {
      const session = driver.session();
      const query = `
        MATCH (s:Set)
        WHERE toLower(s.name) CONTAINS toLower($searchTerm)
        RETURN s.name AS name, 'Set' AS category
        UNION ALL
        MATCH (cs:CardSet)
        WHERE toLower(cs.name) CONTAINS toLower($searchTerm)
        RETURN cs.name AS name, 'Card' AS category
      `;
      try {
        const result = await session.run(query, { searchTerm });
        const records = result.records.map(record => ({
          name: record.get('name'),
          category: record.get('category'),
        }));

        // Ensure that we return an empty array if no results were found
        return records.length > 0 ? records : [];
      } catch (error) {
        console.error('Error executing search query:', error);
        return []; // Return an empty array if an error occurs
      } finally {
        await session.close();
      }
    },
  },
};

module.exports = { resolvers };
