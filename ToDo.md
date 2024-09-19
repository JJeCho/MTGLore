# Magic: The Gathering Card Exploration Application

## User Stories

### 1. Explore Magic: The Gathering Cards by a Specific Artist
**As a User, I want to explore Magic: The Gathering cards made by a specific artist, so I can discover more cards from my favorite artists.**

#### Tasks:
- **Backend:**
  - Extend the existing Neo4j schema to include `artist` as a property for each card node.
  - Create a new GraphQL query in Apollo Server that allows filtering cards by artist name.
  - Implement case-insensitive search functionality for artist names.
  - Index the `artist` property in the Neo4j database to optimize search performance.
  
- **Frontend:**
  - Add a search field to input the artist’s name on the cards exploration page.
  - Connect the input field to the GraphQL query to dynamically fetch cards by artist.
  - Display results in a list format, including card name, type, mana cost, and artist.
  - Include error handling for empty or invalid search results (e.g., "No cards found for this artist").
  
- **Testing:**
  - Write unit tests for the GraphQL query to ensure accurate retrieval of artist-related cards.
  - Test UI functionality for searching and displaying results.
  - Validate the performance of the artist search query using a variety of artist names.

---

### 2. Explore Magic: The Gathering Cards by Color
**As a User, I want to explore Magic: The Gathering cards of a specific color, so I can discover more cards that synergize with my favorite deck.**

#### Tasks:
- **Backend:**
  - Add a `color` property to the card nodes in Neo4j, representing one or multiple colors.
  - Create a GraphQL query that filters cards by color, allowing multi-color filtering (e.g., "red," "blue").
  - Optimize the Neo4j query for filtering based on single or multiple color combinations.
  - Ensure appropriate indexing on the `color` property for performance.
  
- **Frontend:**
  - Implement a filter UI component with checkboxes for each card color (red, blue, black, etc.).
  - Connect the UI to the backend query, allowing users to filter cards by one or multiple colors.
  - Display filtered results, including the card's color indicators.
  - Add a clear filter button to reset the search.
  
- **Testing:**
  - Test the filtering logic to ensure that cards are correctly displayed based on selected colors.
  - Validate UI responsiveness and behavior with multiple color selections.
  - Perform edge case tests, such as when no color is selected or when invalid color combinations are chosen.

---

### 3. Explore Magic: The Gathering Cards by Mana Value
**As a User, I want to explore Magic: The Gathering cards of a specific mana value, so I can discover more cards to optimize my favorite deck.**

#### Tasks:
- **Backend:**
  - Ensure that all cards in the Neo4j database have a `manaValue` property.
  - Create a new GraphQL query that filters cards based on their mana value.
  - Allow filtering by a specific mana value or a range (e.g., cards with mana value between 2-4).
  - Optimize the query to handle large ranges or multiple results efficiently.
  
- **Frontend:**
  - Implement a slider or input field for users to filter cards by mana value.
  - Display the mana value range dynamically in the UI, showing cards with matching values.
  - Allow users to combine mana value filtering with other filters (e.g., color or artist).
  
- **Testing:**
  - Test the mana value query for accuracy and edge cases (e.g., very high or low mana values).
  - Ensure the frontend UI responds properly to changes in mana value selection.
  - Validate combinations of mana value and other filters (e.g., mana value + artist).

---

### 4. Explore Magic: The Gathering Cards by Rarity
**As a User, I want to explore Magic: The Gathering cards of a specific rarity, so I can discover more cards for my favorite deck.**

#### Tasks:
- **Backend:**
  - Ensure that each card in the Neo4j database includes a `rarity` property (e.g., common, uncommon, rare, mythic rare).
  - Create a GraphQL query that allows users to filter cards by rarity.
  - Add indexing on the `rarity` property in Neo4j for better query performance.
  
- **Frontend:**
  - Add a dropdown menu or buttons for selecting card rarities on the search interface.
  - Integrate the rarity selection with the GraphQL query to display cards of the selected rarity.
  - Combine the rarity filter with other filters like color or mana value to narrow down searches.
  
- **Testing:**
  - Test the rarity filter to ensure it works correctly for all rarity categories.
  - Validate that the filter correctly narrows results when combined with other search criteria.
  - Ensure that cards are correctly sorted by rarity when no other filters are applied.

---

### 5. Card Preview Image
**As a User, I want to see a preview image of the Magic: The Gathering card, so that I can tell printings of the same card apart visually.**

#### Tasks:
- **Backend:**
  - Ensure that each card node in Neo4j includes a `imageUrl` property that stores a link to the card’s image.
  - Update existing queries to include the `imageUrl` property in the response.
  
- **Frontend:**
  - Modify the card display component to show a preview image next to each card’s name.
  - Ensure that the image is fetched asynchronously and loaded efficiently to avoid UI lag.
  - Add functionality to enlarge the preview image when the user hovers or clicks on it for a closer view.
  
- **Testing:**
  - Test the UI to ensure images are loaded correctly for all cards.
  - Validate image rendering speed and the user’s ability to enlarge previews.
  - Ensure the correct image is displayed for each printing of the card, particularly for cards with multiple versions.

---

### 6. User-Friendly UI for Card Exploration
**As a User, I want to work with a UI that is easy to understand and use, so that I can optimize my experience exploring relations between Magic: The Gathering cards.**

#### Tasks:
- **Frontend:**
  - Create a responsive, intuitive layout for the card exploration page with clear search and filter options.
  - Use consistent styling (via Tailwind CSS or another framework) for search inputs, buttons, and results.
  - Implement a card sorting feature that allows users to sort by name, mana value, rarity, or type.
  - Provide visual feedback when filters are applied (e.g., chips or badges to indicate active filters).
  - Add tooltips or hover effects for better UX when interacting with complex filter options.
  - Ensure that the UI is accessible (e.g., screen reader support, keyboard navigation).
  
- **Testing:**
  - Perform UX tests to ensure the UI is intuitive and easy to use for users of all levels.
  - Conduct accessibility testing to validate compliance with accessibility standards.
  - Test across devices and screen sizes to ensure the layout is responsive and user-friendly on mobile and desktop.

---

**End of Tasks**
