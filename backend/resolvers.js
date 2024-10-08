const neo4j = require("neo4j-driver");

const resolvers = {
  Query: {
    set: async (_, { code }, { driver }) => {
      if (!driver) {
        throw new Error("Neo4j driver not initialized");
      }

      const session = driver.session({ defaultAccessMode: neo4j.session.READ });
      console.log("Set resolver called with code:", code);

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
          name: record.get("name"),
          releaseDate: record.get("releaseDate"),
          totalSetSize: record.get("totalSetSize"),
          type: record.get("type"),
          cards: record.get("cards"),
        };
      } catch (error) {
        console.error("Error fetching set:", error.message);
        throw new Error(`Error fetching set: ${error.message}`);
      } finally {
        await session.close();
      }
    },

    // Fetch a card by its uuid (expanded information for cards)
    cardSet: async (_, { uuid }, { driver }) => {
      if (!driver) {
        throw new Error("Neo4j driver not initialized");
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
               c.scryfallId AS scryfallId,
               [ (c)-[:BELONGS_TO]->(s:Set) | s.code ] AS code,
                [ (c)-[:BELONGS_TO]->(s:Set) | s.name ] AS setName,
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
        console.error("Error fetching cardSet:", error.message);
        throw new Error(`Error fetching cardSet: ${error.message}`);
      } finally {
        await session.close();
      }
    },

    artist: async (_, { name }, { driver }) => {
      if (!driver) {
        throw new Error("Neo4j driver not initialized");
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
          name: record.get("name"),
          cards: record.get("cards"),
        };
      } catch (error) {
        console.error("Error searching for artist:", error.message);
        throw new Error(`Error searching for artist: ${error.message}`);
      } finally {
        await session.close();
      }
    },

    rarity: async (_, { name, skip = 0, limit = 30 }, { driver }) => {
      const session = driver.session({ defaultAccessMode: neo4j.session.READ });

      const query = `
        MATCH (c:CardSet {rarity: $name})
       WITH c
        ORDER BY c.name
        SKIP $skip
        LIMIT $limit
        RETURN collect({
          name: c.name,
          manaValue: c.manaValue,
          uuid: c.uuid,
          rarity: c.rarity,
          type: c.type,
          power: c.power,
          toughness: c.toughness,
          code: [ (c)-[:BELONGS_TO]->(s:Set) | s.code ],
          setName: [ (c)-[:BELONGS_TO]->(s:Set) | s.name ],
          colors: [ (c)-[:HAS_COLOR]->(co:Color) | co.name ],
          keywords: [ (c)-[:HAS_KEYWORD]->(k:Keyword) | k.name ],
          subtypes: [ (c)-[:HAS_SUBTYPE]->(st:Subtype) | st.name ],
          supertypes: [ (c)-[:HAS_SUPERTYPE]->(su:Supertype) | su.name ]
        }) AS cards
      `;

      try {
        const result = await session.run(query, {
          name,
          skip: neo4j.int(skip),
          limit: neo4j.int(limit),
        });

        if (!result.records.length) {
          throw new Error(`No color found with rarity "${name}"`);
        }

        const record = result.records[0];
        console.log(record.get("cards"));
        return {
          cards: record.get("cards"),
        };
      } catch (error) {
        console.error("Error searching for color:", error.message);
        throw new Error(`Error searching for color: ${error.message}`);
      } finally {
        await session.close();
      }
    },

    manaValue: async (_, { value, skip = 0, limit = 30 }, { driver }) => {
      const session = driver.session({ defaultAccessMode: neo4j.session.READ });

      const query = `
        MATCH (c:CardSet {manaValue: $value})
        WITH c
        ORDER BY c.name
        SKIP $skip
        LIMIT $limit
        RETURN collect({
          name: c.name,
          manaValue: c.manaValue,
          uuid: c.uuid,
          rarity: c.rarity,
          type: c.type,
          power: c.power,
          toughness: c.toughness,
          code: [ (c)-[:BELONGS_TO]->(s:Set) | s.code ],
          setName: [ (c)-[:BELONGS_TO]->(s:Set) | s.name ],
          colors: [ (c)-[:HAS_COLOR]->(co:Color) | co.name ],
          keywords: [ (c)-[:HAS_KEYWORD]->(k:Keyword) | k.name ],
          subtypes: [ (c)-[:HAS_SUBTYPE]->(st:Subtype) | st.name ],
          supertypes: [ (c)-[:HAS_SUPERTYPE]->(su:Supertype) | su.name ]
        }) AS cards
      `;

      try {
        const result = await session.run(query, {
          value,
          skip: neo4j.int(skip),
          limit: neo4j.int(limit),
        });

        if (!result.records.length) {
          throw new Error(`No card found with manaValue "${value}"`);
        }

        const record = result.records[0];
        console.log(record.get("cards"));
        return {
          cards: record.get("cards"),
        };
      } catch (error) {
        console.error("Error searching for color:", error.message);
        throw new Error(`Error searching for color: ${error.message}`);
      } finally {
        await session.close();
      }
    },

    color: async (_, { name, skip = 0, limit = 30 }, { driver }) => {
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
          code: [ (card)-[:BELONGS_TO]->(s:Set) | s.code ],
          colors: [ (card)-[:HAS_COLOR]->(co:Color) | co.name ],
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
          name: record.get("name"),
          cards: record.get("cards"),
        };
      } catch (error) {
        console.error("Error searching for color:", error.message);
        throw new Error(`Error searching for color: ${error.message}`);
      } finally {
        await session.close();
      }
    },

    cardSets: async (
      _,
      { manaValue, rarity, type, colorName, skip = 0, limit = 30 },
      { driver }
    ) => {
      if (!driver) {
        throw new Error("Neo4j driver not initialized");
      }
    
      const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    
      let query = `MATCH (c:CardSet)\n`;
    
      const whereClauses = [];
    
      if (manaValue !== undefined) {
        whereClauses.push(`c.manaValue = $manaValue`);
      }
    
      if (rarity) {
        whereClauses.push(`toLower(c.rarity) CONTAINS toLower($rarity)`);
      }
    
      if (type) {
        whereClauses.push(`toLower(c.type) CONTAINS toLower($type)`);
      }
    
      if (whereClauses.length > 0) {
        query += `WHERE ${whereClauses.join(' AND ')}\n`;
      }
    
      query += `OPTIONAL MATCH (c)-[:HAS_COLOR]->(co:Color)\n`;
      query += `WITH c, collect(DISTINCT co.name) AS colors\n`;
    
      const colorWhereClauses = [];
    
      let colorNames = [];
      let colorLogic = 'OR';
    
      if (colorName) {
        if (colorName.includes(',')) {
          // Split by comma to get individual colors (OR logic)
          colorNames = colorName.split(',').map((c) => c.trim());
          colorLogic = 'OR';
        } else {
          // No commas, treat each character as a color code (AND logic)
          colorNames = colorName.split('');
          colorLogic = 'AND';
        }
      }
    
      if (colorNames.length > 0) {
        if (colorLogic === 'AND') {
          colorWhereClauses.push(`ALL(color IN $colorNames WHERE color IN colors)`);
        } else if (colorLogic === 'OR') {
          colorWhereClauses.push(`ANY(color IN $colorNames WHERE color IN colors)`);
        }
      }
    
      if (colorWhereClauses.length > 0) {
        query += `WHERE ${colorWhereClauses.join(' AND ')}\n`;
      }
    
      query += `ORDER BY c.name\n`;
      query += `SKIP $skip\n`;
      query += `LIMIT $limit\n`;
    
      query += `RETURN 
        c.uuid AS uuid, 
        c.name AS name, 
        c.manaValue AS manaValue, 
        c.rarity AS rarity, 
        c.type AS type, 
        colors,
        c.power AS power, 
        c.toughness AS toughness, 
        c.flavorText AS flavorText, 
        [ (c)-[:HAS_ARTIST]->(a:Artist) | a.name ][0] AS artist, 
        c.hasFoil AS hasFoil, 
        c.hasNonFoil AS hasNonFoil, 
        c.borderColor AS borderColor, 
        c.frameVersion AS frameVersion, 
        c.originalText AS originalText, 
        [ (c)-[:HAS_KEYWORD]->(k:Keyword) | k.name ] AS keywords, 
        [ (c)-[:HAS_SUBTYPE]->(st:Subtype) | st.name ] AS subtypes, 
        [ (c)-[:HAS_SUPERTYPE]->(su:Supertype) | su.name ] AS supertypes\n`;
    
      try {
        const params = { skip: neo4j.int(skip), limit: neo4j.int(limit) };
        if (manaValue !== undefined) params.manaValue = manaValue;
        if (rarity) params.rarity = rarity;
        if (type) params.type = type;
        if (colorNames.length > 0) params.colorNames = colorNames;
    
        console.log("Final Cypher Query:", query);
        console.log("Parameters:", params);
    
        const result = await session.run(query, params);
    
        return result.records.map((record) => ({
          uuid: record.get("uuid"),
          name: record.get("name"),
          manaValue: record.get("manaValue"),
          rarity: record.get("rarity"),
          type: record.get("type"),
          colors: record.get("colors"),
          power: record.get("power"),
          toughness: record.get("toughness"),
          flavorText: record.get("flavorText"),
          artist: record.get("artist"),
          hasFoil: record.get("hasFoil"),
          hasNonFoil: record.get("hasNonFoil"),
          borderColor: record.get("borderColor"),
          frameVersion: record.get("frameVersion"),
          originalText: record.get("originalText"),
          keywords: record.get("keywords"),
          subtypes: record.get("subtypes"),
          supertypes: record.get("supertypes"),
        }));
      } catch (error) {
        console.error("Error fetching card sets:", error.message);
        throw new Error(`Error fetching card sets: ${error.message}`);
      } finally {
        await session.close();
      }
    },
    
    search: async (_, { searchTerm }, { driver }) => {
      if (!driver) {
        throw new Error("Neo4j driver not initialized");
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
        return (
          result.records.map((record) => ({
            name: record.get("name"),
            category: record.get("category"),
            code: record.get("code") || null,
            uuid: record.get("uuid") || null,
          })) || []
        );
      } catch (error) {
        console.error(
          "Error searching sets, cards, and artists:",
          error.message
        );
        throw new Error(
          `Error searching sets, cards, and artists: ${error.message}`
        );
      } finally {
        await session.close();
      }
    },
  },
};

module.exports = { resolvers };
