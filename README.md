
# Card Relations Explorer

This project is a full-stack application created to explore the relationships between Magic: The Gathering cards using a graph database. The goal of the project is to provide users with a utility that allows them to search, visualize, and explore card sets, their relations, and various metadata such as mana cost, rarity, and more.

## Purpose

This project was created for three main purposes:

1. **Understanding Graph Databases**: Gain a deeper understanding of graph databases, graph query languages (like Cypher for Neo4j), and methods for optimizing queries, such as using indexing, pagination, and caching.
   
2. **Data Visualization**: Practice techniques for visualizing relationships between data in a large dataset. This allows users to see how individual entities are connected within the graph, as well as interact with the data visually.

3. **Utility for Magic: The Gathering Enthusiasts**: Build a tool that allows users to explore card relations for various use cases such as creating tribal decks, finding cards by a favorite artist, or diving deeper into Magic: The Gathering lore.

## Tech Stack

- **Frontend**: Built with [Next.js](https://nextjs.org/), a React-based framework for server-side rendering and static site generation.
- **Backend**: Built with [Node.js](https://nodejs.org/) and [Apollo Server](https://www.apollographql.com/docs/apollo-server/), providing a GraphQL API for querying the data.
- **Database**: [Neo4j](https://neo4j.com/), a graph database designed for handling complex relationships between data points.

## Features

- **GraphQL API**: The backend exposes a GraphQL API that allows querying the Neo4j database for sets, cards, and relations between cards.
- **Card Search**: Users can search for cards, card sets, and related data using a live search feature.
- **Card Exploration**: Users can click on cards or sets to explore deeper relationships, such as finding other cards that belong to a set or related cards by artist, type, or mana cost.
- **Data Visualization**: Card data is presented visually, allowing users to explore relations in an intuitive and interactive manner.

## Key Functionality

- **Set Search**: Search for sets by name, and view detailed information about the set, including release date, base set size, total set size, and the cards it contains.
- **Card Search**: Explore individual cards by searching by name. View detailed information like mana value, type, rarity, and power/toughness (if applicable).
- **Card Relationships**: Visualize relationships between cards in terms of set membership and other attributes like artist, mana cost, or card type.
- **GraphQL Queries**: Efficiently fetch large datasets while optimizing performance with pagination and indexing techniques.
- **Server-Side Rendering**: Uses Next.js to handle server-side rendering for faster load times and better SEO.
  
## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/card-relations-explorer.git
   cd card-relations-explorer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Neo4j Database**:
   - Download and install Neo4j locally or use the Neo4j cloud services.
   - Set up your database and create a `.env` file in the root of your project with the following environment variables:
     ```
     NEO4J_URI=bolt://localhost:7687
     NEO4J_USER=neo4j
     NEO4J_PASSWORD=yourpassword
     ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

   This will start both the Next.js frontend and the Node.js backend.

## GraphQL API Endpoints

Here are some of the main GraphQL queries you can use to explore the data:

### Fetch Sets

```graphql
query GetSets($limit: Int, $offset: Int) {
  sets(limit: $limit, offset: $offset) {
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

### Fetch a Single Set by Name

```graphql
query GetSet($name: String!) {
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
    }
  }
}
```

### Fetch a Card by Name

```graphql
query GetCardSet($name: String!) {
  cardSet(name: $name) {
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

- **Deck Builder**: Allow users to build and save custom decks by dragging and dropping cards.
- **Lore Exploration**: Dive deeper into Magic: The Gathering lore by exploring card flavor texts, set themes, and other related details.
- **Advanced Filtering**: Enable more sophisticated filters to search for cards by specific attributes like mana cost, card type, or artist.
- **Use of AI for Card Art Scanning**: Leverage AI technology to extract information from card artworks to form links and relations between cards

## Contributions

Contributions are welcome! Feel free to submit a pull request or open an issue if you encounter any bugs or have feature requests.
