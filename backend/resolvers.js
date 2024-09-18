const neo4j = require("neo4j-driver");

// Helper function to run a Cypher query and return results
const runCypherQuery = async (session, query, params = {}) => {
  const result = await session.run(query, params);
  return result.records.map((record) => record.toObject());
};

const resolvers = {
  Query: {
    set: async (_, { code }, { driver }) => {
      console.log(code);
      const session = driver.session();
      const query = `
        MATCH (s:Set {code: $code})
        OPTIONAL MATCH (c:CardSet)-[:BELONGS_TO]->(s)
        RETURN s.name AS name, 
               s.releaseDate AS releaseDate, 
               s.totalSetSize AS totalSetSize, 
               collect({
                 uuid: c.uuid,
                 name: c.name,
                 manaValue: c.manaValue,
                 rarity: c.rarity,
                 type: c.type
               }) AS cards
      `;
      try {
        const [record] = await runCypherQuery(session, query, { code });
        return record || null;
      } finally {
        await session.close();
      }
    },

    // Fetch a card by uuid
    cardSet: async (_, { uuid }, { driver }) => {
      const session = driver.session();
      const query = `
        MATCH (c:CardSet {uuid: $uuid})
        RETURN c.name AS name, c.manaValue AS manaValue, c.uuid AS uuid,
               c.convertedManaCost AS convertedManaCost, c.rarity AS rarity,
               c.type AS type
      `;
      try {
        const [card] = await runCypherQuery(session, query, { uuid });
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
        RETURN s.name AS name, 'Set' AS category, s.code AS code, null AS uuid
        UNION ALL
        MATCH (cs:CardSet)
        WHERE toLower(cs.name) CONTAINS toLower($searchTerm)
        RETURN cs.name AS name, 'Card' AS category, null AS code, cs.uuid AS uuid
      `;
      try {
        const result = await session.run(query, { searchTerm });
        const records = result.records.map(record => ({
          name: record.get('name'),
          category: record.get('category'),
          code: record.get('code'),  // Ensure the code is captured for sets
          uuid: record.get('uuid'),  // Ensure the uuid is captured for card sets
        }));
    
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
