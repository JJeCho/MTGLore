const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,POST',
    credentials: true,
  })
);

// Validate environment variables
if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
  console.error('Missing Neo4j environment variables');
  process.exit(1); 
}

// Neo4j driver setup with connection pooling
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Apollo Server initialization
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ driver, req }),
});

// Start Apollo Server and apply it to the Express app
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Start listening
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}${server.graphqlPath}`);
  });
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
});

// Graceful shutdown of the server and Neo4j driver
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await server.stop();
  await driver.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await server.stop();
  await driver.close();
  process.exit(0);
});
