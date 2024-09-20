# Magic: The Gathering Card Exploration Application

## User Stories

### 1. Explore Magic: The Gathering Cards by a Specific Artist
**As a User, I want to explore Magic: The Gathering cards made by a specific artist, so I can discover more cards from my favorite artists.**

#### Tasks:
- **Backend:**
  + Extend the Neo4j schema to include an `artist` node and create relationships between card nodes and artists.
  + Create a GraphQL query in Apollo Server to search for artists by name and return associated cards.
  + Modify the existing search query to support artist search by name.
  
- **Frontend:**
  + Update the live search component on the card exploration page to support searching for artists by name.
  + Connect the input field to the GraphQL query to fetch artists dynamically.
  + Create dynamic routes for `/artist/[name]` and associated pages.
  + Implement `onClick` navigation to the artist route.
  + On the artist page, display a list of card results including card name, type, mana cost, and artist.
  + Handle errors for empty or invalid searches (e.g., "No cards found for this artist").
  
- **Testing:**
  + Write unit tests for the GraphQL query to ensure correct retrieval of cards by artist.
  - Test the UI for searching and displaying artist-related cards.
  - Validate the performance of artist search queries with various artist names.

---

### 2. Explore Magic: The Gathering Cards by Color
**As a User, I want to explore Magic: The Gathering cards of a specific color, so I can discover cards that synergize with my favorite deck.**

#### Tasks:
- **Backend:**
  + Extend the database to include Color nodes that have relationships with card nodes, supporting multiple colors.
  / Create a GraphQL query that allows searching cards by color, with support for multi-color filtering.
  
- **Frontend:**
  - Implement a UI component to navigate to `/cards/` route and page where users can explore and filter all cards
  + Implement a UI component to navigate to `/colors/[color]` routes and pages.
  - Connect the UI component to the backend query to filter cards by color(s).
  - Display filtered results with corresponding color indicators.

- **Testing:**
  - Test filtering logic to verify correct display of cards based on selected colors.
  - Validate UI responsiveness when multiple colors are selected.
  - Perform edge case testing, including no color selection or invalid color combinations.

---

### 3. Explore Magic: The Gathering Cards by Mana Value
**As a User, I want to explore Magic: The Gathering cards of a specific mana value, so I can optimize my deck with cards of similar mana costs.**

#### Tasks:
- **Backend:**
  - Create a GraphQL query to filter cards based on their mana value.
  - Support filtering by a specific mana value or a range (e.g., 2-4 mana).
  - Optimize the query to handle large ranges or multiple results efficiently.
  
- **Frontend:**
  - Implement a slider or input field for users to filter cards by mana value.
  - Display the mana value range dynamically and show matching cards in real time.
  - Enable users to combine mana value filtering with other filters (e.g., color or artist).
  
- **Testing:**
  - Test the mana value query for accuracy and edge cases (e.g., extremely high or low values).
  - Ensure UI responsiveness when mana value filters are changed.
  - Validate combinations of filters (e.g., mana value + artist).

---

### 4. Explore Magic: The Gathering Cards by Rarity
**As a User, I want to explore Magic: The Gathering cards of specific rarity, so I can discover rare or common cards for my deck.**

#### Tasks:
- **Backend:**
  - Ensure the Neo4j database contains a `rarity` property (e.g., common, uncommon, rare, mythic rare).
  - Create a GraphQL query to filter cards by rarity.
  - Index the `rarity` property for better query performance.
  
- **Frontend:**
  - Add a dropdown or button-based UI for selecting card rarity on the search interface.
  - Connect the rarity filter to the GraphQL query and display matching cards.
  - Allow combining the rarity filter with other filters (e.g., color, mana value).
  
- **Testing:**
  - Test the rarity filter for all categories to ensure correct functionality.
  - Validate results when combined with other filters.
  - Ensure correct sorting of cards by rarity when no other filters are applied.

---

### 5. Card Preview Image
**As a User, I want to see a preview image of Magic: The Gathering cards, so I can visually distinguish different printings of the same card.**

#### Tasks:
- **Backend:**
  - Ensure each card node in Neo4j contains an `imageUrl` property to store the card's image link.
  - Update queries to include the `imageUrl` property in the response.
  
- **Frontend:**
  - Modify the card display component to show a preview image next to the card name.
  - Ensure images load asynchronously and efficiently to avoid UI delays.
  - Add functionality to enlarge the preview image when hovered or clicked.
  
- **Testing:**
  - Validate that images load correctly for all cards.
  - Test the speed of image rendering and the enlargement functionality.
  - Ensure that the correct image is displayed for cards with multiple printings.

---

### 6. User-Friendly UI for Card Exploration
**As a User, I want an intuitive UI for exploring Magic: The Gathering cards, so I can efficiently find and explore card relations.**

#### Tasks:
- **Frontend:**
  - Design a responsive, user-friendly layout with clear search and filter options.
  - Apply consistent styling (e.g., using Tailwind CSS) to search inputs, buttons, and results.
  - Implement a card sorting feature (by name, mana value, rarity, or type).
  - Show active filters as badges or chips for better UX.
  - Add tooltips and hover effects to complex filter options.
  - Ensure the UI is accessible, with screen reader support and keyboard navigation.
  
- **Testing:**
  - Conduct UX testing to ensure ease of use for users of all levels.
  - Perform accessibility testing for compliance with standards.
  - Test the layout across devices and screen sizes to ensure responsiveness on mobile and desktop.

---

**End of Tasks**

