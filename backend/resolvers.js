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
          OPTIONAL MATCH (s)<-[:BELONGS_TO]-(c:CardSet)
          WITH s, c
          ORDER BY c.name
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
                   colors: [ (c)-[:HAS_COLOR]->(co:Color) | co.name ],
                   artist: [ (c)-[:HAS_ARTIST]->(a:Artist) | a.name ][0]  // Assuming one artist per card
                 }) AS cards
        `;
        const result = await session.run(query, { code });
        if (!result.records.length) {
          throw new Error(`Set with code ${code} not found`);
        }
        const record = result.records[0];
        return {
          name: record.get('name'),
          releaseDate: record.get('releaseDate'),
          totalSetSize: record.get('totalSetSize'),
          type: record.get('type'),
          cards: record.get('cards'),
        };
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
        RETURN c.name AS name, 
               c.manaValue AS manaValue, 
               c.uuid AS uuid,
               c.rarity AS rarity, 
               c.type AS type, 
               [ (c)-[:HAS_COLOR]->(co:Color) | co.name ] AS colors,
               c.power AS power,
               c.toughness AS toughness,
               c.flavorText AS flavorText,
               [ (c)-[:HAS_ARTIST]->(a:Artist) | a.name ][0] AS artist,  // Assuming one artist
               c.hasFoil AS hasFoil,
               c.hasNonFoil AS hasNonFoil,
               c.borderColor AS borderColor,
               c.frameVersion AS frameVersion,
               c.originalText AS originalText,
               [ (c)-[:HAS_KEYWORD]->(k:Keyword) | k.name ] AS keywords,
               [ (c)-[:HAS_SUBTYPE]->(st:Subtype) | st.name ] AS subtypes,
               [ (c)-[:HAS_SUPERTYPE]->(su:Supertype) | su.name ] AS supertypes
      `;
      try {
        const result = await session.run(query, { uuid });
        if (!result.records.length) {
          throw new Error(`Card with UUID ${uuid} not found`);
        }
        const record = result.records[0];
        return record.toObject();
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
    
      const query = `
        MATCH (a:Artist {name: $name})-[:HAS_ARTIST]-(c:CardSet)
        RETURN a.name AS name, 
               collect({
                 uuid: c.uuid,
                 name: c.name,
                 manaValue: c.manaValue,
                 rarity: c.rarity,
                 type: c.type,
                 colors: [ (c)-[:HAS_COLOR]->(co:Color) | co.name ],
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
    
    color: async (_, { name, skip = 0, limit = 30 }, { driver }) => {
      if (!driver) {
        throw new Error('Neo4j driver not initialized');
      }
    
      const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    
      const query = `
        MATCH (c:Color {name: $name})-[:HAS_COLOR]-(card:CardSet)
        WITH c, card
        ORDER BY card.name
        SKIP $skip
        LIMIT $limit
        RETURN c.name AS name, collect({
          name: card.name,
          manaValue: card.manaValue,
          uuid: card.uuid,
          rarity: card.rarity,
          type: card.type,
          power: card.power,
          toughness: card.toughness,
          keywords: [ (card)-[:HAS_KEYWORD]->(k:Keyword) | k.name ],
          subtypes: [ (card)-[:HAS_SUBTYPE]->(st:Subtype) | st.name ],
          supertypes: [ (card)-[:HAS_SUPERTYPE]->(su:Supertype) | su.name ]
        }) AS cards
      `;
    
      try {
        const result = await session.run(query, {
          name,
          skip: neo4j.int(skip),
          limit: neo4j.int(limit),
        });
    
        if (!result.records.length) {
          throw new Error(`No color found with name "${name}"`);
        }
    
        const record = result.records[0];
    
        return {
          name: record.get('name'),
          cards: record.get('cards'),
        };
      } catch (error) {
        console.error('Error searching for color:', error.message);
        throw new Error(`Error searching for color: ${error.message}`);
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
        MATCH (a:Artist)
        WHERE toLower(a.name) CONTAINS toLower($searchTerm)
        RETURN DISTINCT a.name AS name, 'Artist' AS category, null AS code, null AS uuid
      `;
      try {
        const result = await session.run(query, { searchTerm });
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
