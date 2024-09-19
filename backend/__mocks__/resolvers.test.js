const { resolvers } = require('../resolvers');
const neo4j = require('neo4j-driver');

jest.mock('neo4j-driver');

describe('Resolvers', () => {
  let sessionMock;
  let driverMock;

  beforeEach(() => {
    // Reset mocks before each test
    sessionMock = {
      run: jest.fn(),
      close: jest.fn(),
    };

    driverMock = {
      session: jest.fn(() => sessionMock),
    };

    neo4j.driver.mockReturnValue(driverMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('set resolver', () => {
    it('should return set data when found', async () => {
      const mockRecord = {
        name: 'Test Set',
        releaseDate: '2021-01-01',
        totalSetSize: 100,
        type: 'Expansion',
        cards: [
          {
            uuid: 'card-uuid-1',
            name: 'Test Card 1',
            manaValue: 3,
            rarity: 'Rare',
            type: 'Creature',
            colors: ['Red'],
            artist: 'Artist Name',
          },
        ],
      };

      sessionMock.run.mockResolvedValue({
        records: [{ toObject: () => mockRecord }],
      });

      const context = { driver: driverMock };
      const args = { code: 'SET_CODE' };

      const result = await resolvers.Query.set(null, args, context);

      expect(result).toEqual(mockRecord);
      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when set not found', async () => {
      sessionMock.run.mockResolvedValue({ records: [] });

      const context = { driver: driverMock };
      const args = { code: 'INVALID_CODE' };

      await expect(resolvers.Query.set(null, args, context)).rejects.toThrow(
        'Set with code INVALID_CODE not found'
      );

      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('cardSet resolver', () => {
    it('should return card data when found', async () => {
      const mockCard = {
        name: 'Test Card',
        manaValue: 3,
        uuid: 'card-uuid',
        rarity: 'Rare',
        type: 'Creature',
        colors: ['U'],
        power: '2',
        toughness: '2',
        flavorText: 'Test flavor text',
        artist: 'Artist Name',
        hasFoil: true,
        hasNonFoil: false,
        borderColor: 'Black',
        frameVersion: '2015',
        originalText: 'Original card text',
        keywords: ['Flying'],
        subtypes: ['Wizard'],
        supertypes: ['Legendary'],
      };

      sessionMock.run.mockResolvedValue({
        records: [{ toObject: () => mockCard }],
      });

      const context = { driver: driverMock };
      const args = { uuid: 'card-uuid' };

      const result = await resolvers.Query.cardSet(null, args, context);

      expect(result).toEqual(mockCard);
      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });

    it('should return null when card not found', async () => {
      sessionMock.run.mockResolvedValue({ records: [] });

      const context = { driver: driverMock };
      const args = { uuid: 'invalid-uuid' };

      const result = await resolvers.Query.cardSet(null, args, context);

      expect(result).toBeNull();
      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('artist resolver', () => {
    it('should return artist data when found', async () => {
      const mockRecord = {
        name: 'Artist Name',
        cards: [
          {
            uuid: 'card-uuid',
            name: 'Test Card',
            manaValue: 3,
            rarity: 'Rare',
            type: 'Creature',
            colors: ['U'],
            artist: 'Artist Name',
          },
        ],
      };

      sessionMock.run.mockResolvedValue({
        records: [
          {
            get: (key) => mockRecord[key],
          },
        ],
      });

      const context = { driver: driverMock };
      const args = { name: 'Artist Name' };

      const result = await resolvers.Query.artist(null, args, context);

      expect(result).toEqual(mockRecord);
      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when artist not found', async () => {
      sessionMock.run.mockResolvedValue({ records: [] });

      const context = { driver: driverMock };
      const args = { name: 'Unknown Artist' };

      await expect(resolvers.Query.artist(null, args, context)).rejects.toThrow(
        'No artist found with name "Unknown Artist"'
      );

      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('search resolver', () => {
    it('should return search results', async () => {
      const mockRecords = [
        {
          get: (key) => {
            const data = {
              name: 'Test Set',
              category: 'Set',
              code: 'SET_CODE',
              uuid: null,
            };
            return data[key];
          },
        },
        {
          get: (key) => {
            const data = {
              name: 'Test Card',
              category: 'Card',
              code: null,
              uuid: 'card-uuid',
            };
            return data[key];
          },
        },
        {
          get: (key) => {
            const data = {
              name: 'Artist Name',
              category: 'Artist',
              code: null,
              uuid: 'card-uuid',
            };
            return data[key];
          },
        },
      ];

      sessionMock.run.mockResolvedValue({ records: mockRecords });

      const context = { driver: driverMock };
      const args = { searchTerm: 'Test' };

      const result = await resolvers.Query.search(null, args, context);

      expect(result).toEqual([
        {
          name: 'Test Set',
          category: 'Set',
          code: 'SET_CODE',
          uuid: null,
        },
        {
          name: 'Test Card',
          category: 'Card',
          code: null,
          uuid: 'card-uuid',
        },
        {
          name: 'Artist Name',
          category: 'Artist',
          code: null,
          uuid: 'card-uuid',
        },
      ]);

      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no results', async () => {
      sessionMock.run.mockResolvedValue({ records: [] });

      const context = { driver: driverMock };
      const args = { searchTerm: 'Nonexistent' };

      const result = await resolvers.Query.search(null, args, context);

      expect(result).toEqual([]);
      expect(sessionMock.run).toHaveBeenCalledTimes(1);
      expect(sessionMock.close).toHaveBeenCalledTimes(1);
    });
  });
});
