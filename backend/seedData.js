// backend/seedData.js
const fs = require('fs');
const csv = require('csv-parser');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Define a function to process the CSV file and insert data into Neo4j
async function seedData() {
  const session = driver.session(); // Create a session outside the transaction

  try {
    // Start a transaction
    const transaction = session.beginTransaction();

    // Use the csv-parser to read the data from the CSV file
    fs.createReadStream('./backend/seedData.csv')
      .pipe(csv())
      .on('data', async (row) => {
        // Check the type of data (Planeswalker, Creature, Artifact, Land, etc.)
        let query = '';
        let params = { name: row.Name, description: row.Description };

        switch (row.Type) {
          case 'Planeswalker':
            query = 'CREATE (p:Planeswalker {name: $name, description: $description})';
            break;
          case 'Creature':
            query = 'CREATE (c:Creature {name: $name, description: $description})';
            break;
          case 'Artifact':
            query = 'CREATE (a:Artifact {name: $name, description: $description})';
            break;
          case 'Land':
            query = 'CREATE (l:Land {name: $name, description: $description})';
            break;
          case 'Plane':
            query = 'CREATE (p:Plane {name: $name, description: $description})';
            break;
          case 'Location':
            query = 'MATCH (plane:Plane {name: $plane}) CREATE (loc:Location {name: $name, description: $description})-[:EXISTS_IN]->(plane)';
            params.plane = row.Plane; // Add plane relationship for locations
            break;
          default:
            console.error(`Unknown type: ${row.Type}`);
            return;
        }

        // Run the query within the transaction
        await transaction.run(query, params);
      })
      .on('end', async () => {
        // Commit the transaction after processing all rows
        await transaction.commit();
        console.log('CSV file successfully processed and data inserted.');
        await session.close();
        await driver.close();
      })
      .on('error', async (error) => {
        console.error('Error reading the CSV file:', error);
        await transaction.rollback();
        await session.close();
        await driver.close();
      });
  } catch (error) {
    console.error('Error seeding data:', error);
    await session.close();
    await driver.close();
  }
}

seedData();
