const neo4j = require("neo4j-driver");

// Helper function to run a Cypher query and return results
const runCypherQuery = async (session, query, params = {}) => {
  const result = await session.run(query, params);
  return result.records.map((record) => record.toObject());
};

const resolvers = {
  Query: {
    // Fetch a set by its code (including expanded card details like colors and artist)
    set: async (_, { code }, { driver }) => {
      if (!driver) {
        throw new Error('Neo4j driver not initialized');
      }

      const session = driver.session({ defaultAccessMode: neo4j.session.READ });
      console.log('Set resolver called with code:', code);

      try {
        const query = `
          MATCH (s:Set {code: $code})
          OPTIONAL MATCH (c:CardSet)-[:BELONGS_TO]->(s)
          OPTIONAL MATCH (c)-[:HAS_COLOR]->(co:Color)
          OPTIONAL MATCH (c)-[:HAS_ARTIST]->(a:Artist)
          WITH s, c, collect(DISTINCT co.name) AS colors, a.name AS artist
          RETURN s.name AS name, 
                 s.releaseDate AS releaseDate, 
                 s.totalSetSize AS totalSetSize, 
                 s.type AS type,
                 collect({
                   uuid: c.uuid,
                   name: c.name,
                   manaValue: c.manaValue,
                   rarity: c.rarity,
                   type: c.type,
                   colors: colors,   // colors is already handled by collect(DISTINCT)
                   artist: artist    // artist is already handled in WITH
                 }) AS cards
        `;
        const [record] = await runCypherQuery(session, query, { code });
        if (!record) {
          throw new Error(`Set with code ${code} not found`);
        }
        return record;
      } catch (error) {
        console.error('Error fetching set:', error.message);
        throw new Error(`Error fetching set: ${error.message}`);
      } finally {
        await session.close();
      }
    },

    // Fetch a card by its uuid (expanded information for cards)
    cardSet: async (_, { uuid }, { driver }) => {
      if (!driver) {
        throw new Error('Neo4j driver not initialized');
      }

      const session = driver.session({ defaultAccessMode: neo4j.session.READ });
      const query = `
        MATCH (c:CardSet {uuid: $uuid})
        OPTIONAL MATCH (c)-[:HAS_COLOR]->(co:Color)
        OPTIONAL MATCH (c)-[:HAS_ARTIST]->(a:Artist)
        OPTIONAL MATCH (c)-[:HAS_KEYWORD]->(k:Keyword)
        OPTIONAL MATCH (c)-[:HAS_SUBTYPE]->(st:Subtype)
        OPTIONAL MATCH (c)-[:HAS_SUPERTYPE]->(su:Supertype)
        RETURN c.name AS name, 
               c.manaValue AS manaValue, 
               c.uuid AS uuid,
               c.rarity AS rarity, 
               c.type AS type, 
               collect(DISTINCT co.name) AS colors, 
               c.power AS power,
               c.toughness AS toughness,
               c.flavorText AS flavorText,
               CASE WHEN a IS NOT NULL THEN a.name ELSE null END AS artist,  // Handle null artist
               c.hasFoil AS hasFoil,
               c.hasNonFoil AS hasNonFoil,
               c.borderColor AS borderColor,
               c.frameVersion AS frameVersion,
               c.originalText AS originalText,
               collect(DISTINCT k.name) AS keywords,
               collect(DISTINCT st.name) AS subtypes,
               collect(DISTINCT su.name) AS supertypes
      `;
      try {
        const [card] = await runCypherQuery(session, query, { uuid });
        return card || null;
      } catch (error) {
        console.error('Error fetching cardSet:', error.message);
        throw new Error(`Error fetching cardSet: ${error.message}`);
      } finally {
        await session.close();
      }
    },
    artist: async (_, { name }, { driver }) => {
      if (!driver) {
        throw new Error('Neo4j driver not initialized');
      }

      const session = driver.session({ defaultAccessMode: neo4j.session.READ });

      // Updated query to avoid nested aggregate functions
      const query = `
        MATCH (a:Artist {name: $name})-[:HAS_ARTIST]-(c:CardSet)
        OPTIONAL MATCH (c)-[:HAS_COLOR]->(co:Color)
        WITH a, c, collect(DISTINCT co.name) AS colors
        RETURN a.name AS name, 
               collect({
                 uuid: c.uuid,
                 name: c.name,
                 manaValue: c.manaValue,
                 rarity: c.rarity,
                 type: c.type,
                 colors: colors,
                 artist: a.name
               }) AS cards
      `;

      try {
        const result = await session.run(query, { name });

        if (!result.records.length) {
          throw new Error(`No artist found with name "${name}"`);
        }

        const record = result.records[0];
        
        return {
          name: record.get('name'),
          cards: record.get('cards')
        };
      } catch (error) {
        console.error('Error searching for artist:', error.message);
        throw new Error(`Error searching for artist: ${error.message}`);
      } finally {
        await session.close();
      }
    },


    

    // Search sets and cards by name
    search: async (_, { searchTerm }, { driver }) => {
      if (!driver) {
        throw new Error('Neo4j driver not initialized');
      }

      const session = driver.session({ defaultAccessMode: neo4j.session.READ });
      const query = `
        MATCH (s:Set)
        WHERE toLower(s.name) CONTAINS toLower($searchTerm)
        RETURN s.name AS name, 'Set' AS category, s.code AS code, null AS uuid
        UNION ALL
        MATCH (cs:CardSet)
        WHERE toLower(cs.name) CONTAINS toLower($searchTerm)
        RETURN cs.name AS name, 'Card' AS category, null AS code, cs.uuid AS uuid
        UNION ALL
        MATCH (a:Artist)-[:HAS_ARTIST]-(c:CardSet)
        WHERE toLower(a.name) CONTAINS toLower($searchTerm)
        RETURN a.name AS name, 'Artist' AS category, null AS code, c.uuid AS uuid
      `;
      try {
        const result = await session.run(query, { searchTerm });
        // Always return an empty array instead of null
        return result.records.map(record => ({
          name: record.get('name'),
          category: record.get('category'),
          code: record.get('code') || null,
          uuid: record.get('uuid') || null,
        })) || [];
      } catch (error) {
        console.error('Error searching sets, cards, and artists:', error.message);
        throw new Error(`Error searching sets, cards, and artists: ${error.message}`);
      } finally {
        await session.close();
      }
    },
  },
};

module.exports = { resolvers };
