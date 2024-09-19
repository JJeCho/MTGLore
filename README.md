
# Card Relations Explorer

Card Relations Explorer is a full-stack application designed for exploring the intricate relationships between Magic: The Gathering cards using a graph database. It enables users to search, visualize, and explore card sets, card metadata, and inter-card relations, such as mana cost, rarity, and more.

## Purpose

The project serves three key purposes:

1. **Graph Databases**: Develop a deeper understanding of graph databases (Neo4j) and how to query them using Cypher and GraphQL. It also includes optimization techniques such as indexing, pagination, and caching.
   
2. **Data Visualization**: Provide an interactive platform to visualize relationships between large datasets, particularly for Magic: The Gathering card sets and their associated metadata.

3. **MTG Enthusiasts Tool**: This project acts as a utility for Magic: The Gathering players and enthusiasts. Users can explore card relations, create tribal decks, find cards by a favorite artist, and dive deeper into Magic: The Gathering lore.

## Tech Stack

- **Frontend**: Built using [Next.js](https://nextjs.org/), a React-based framework for server-side rendering and static site generation.
- **Backend**: Powered by [Node.js](https://nodejs.org/) and [Apollo Server](https://www.apollographql.com/docs/apollo-server/) for handling GraphQL requests.
- **Database**: The application uses [Neo4j](https://neo4j.com/), a graph database optimized for relationship-based data.


## Features

- **GraphQL API**: A fully-functional GraphQL API is provided for querying the Neo4j database to retrieve card and set data.
- **Card Search & Exploration**: Users can search for cards and sets, and visualize the relationships between cards, sets, artists, mana costs, and other attributes.
- **Rich Metadata**: Users can explore deeper card attributes such as mana cost, rarity, power, toughness, card colors, and flavor texts.

## Installation and Setup

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/)
- [Neo4j](https://neo4j.com/download/) (either local installation or cloud service)

## JSON Reader for Graph Database Seeding

The project hosted at [JSON Reader](https://github.com/JJeCho/jsonReader) was developed to streamline the process of seeding the graph database (Neo4j) used in this application. It focuses on parsing and processing large JSON datasets to convert them into a format that can be ingested by the graph database.

### Key Features:
- **Efficient Parsing**: Handles large JSON files efficiently, preparing data for seamless import into the Neo4j database.
- **Data Transformation**: Automatically converts JSON data into nodes and relationships that correspond to Magic: The Gathering cards, sets, and their respective relations.
- **Neo4j Integration**: Outputs Cypher queries and structured data specifically designed for Neo4j, ensuring the accurate creation of graph relationships.

This tool is integral to the data pipeline for populating the Card Relations Explorer application with real-world Magic: The Gathering data, ensuring the database is seeded with rich, interconnected data points.


### Steps to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/card-relations-explorer.git
   cd card-relations-explorer
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up the Neo4j database:
   - Download and install Neo4j.
   - Set up your database and add environment variables in `.env` in the `backend` directory:
     ```bash
     NEO4J_URI=bolt://localhost:7687
     NEO4J_USER=neo4j
     NEO4J_PASSWORD=yourpassword
     ```

4. Follow all installation instructions at [JSON Reader](https://github.com/JJeCho/jsonReader) and seed the database using the `AllPrintings.json` file from the [MTGJSON website](https://mtgjson.com/downloads/all-files/#allprintings)

5. Start the application:
   ```bash
   npm run dev
   ```

This command will start both the Next.js frontend and the Node.js backend.

## GraphQL API Endpoints

Some key queries to explore card relations are:

### Get All Sets
```graphql
query GetAllSets {
  sets {
    name
    baseSetSize
    releaseDate
    totalSetSize
    type
    cards {
      name
      manaValue
      type
      rarity
    }
  }
}
```

### Get a Single Set by Name
```graphql
query GetSetByName($name: String!) {
  set(name: $name) {
    name
    baseSetSize
    releaseDate
    totalSetSize
    type
    cards {
      name
      manaValue
      type
      rarity
      colors
      power
      toughness
    }
  }
}
```

### Get Card by Name
```graphql
query GetCardByName($name: String!) {
  card(name: $name) {
    name
    manaValue
    type
    rarity
    colors
    power
    toughness
  }
}
```

## Future Features

- **Deck Builder**: Allow users to build and save custom decks.
- **Lore Exploration**: Delve deeper into Magic: The Gathering lore through card flavor texts and set themes.
- **Advanced Filtering**: More filters for mana cost, card type, artist, etc.
- **AI-Assisted Card Art Scanning**: AI-powered extraction of information from card artworks to generate further relations.

## Contributions

Contributions are highly encouraged! Feel free to open an issue or submit a pull request with improvements or bug fixes.

