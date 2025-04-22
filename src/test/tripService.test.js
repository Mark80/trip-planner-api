const TripService = require('../main/services/tripService');
const PathFinder = require('../main/services/pathFinder'); // importa PathFinder

describe('TripService', () => {
  let tripDalMock;
  let pathFinderMock;
  let tripService;
  let savedTrips;

  const mockTrips = [
    { id: '1', origin: 'SYD', destination: 'GRU', cost: 500, duration: 10 },
    { id: '2', origin: 'SYD', destination: 'GRU', cost: 300, duration: 15 },
    { id: '3', origin: 'SYD', destination: 'GRU', cost: 700, duration: 5 },
    { id: '4', origin: 'SYD', destination: 'LAX', cost: 400, duration: 12 },
    { id: '5', origin: 'LAX', destination: 'GRU', cost: 600, duration: 8 }
  ];

  beforeEach(() => {
    savedTrips = [];

    tripDalMock = {
      getTrips: jest.fn().mockResolvedValue({ data: mockTrips }),
      saveTrip: jest.fn((trip) => savedTrips.push(trip)),
      all: jest.fn(() => savedTrips),
      deleteTrip: jest.fn((id) => {
        savedTrips = savedTrips.filter(t => t.id !== id);
        return savedTrips;
      })
    };

    pathFinderMock = {
      findCheapestPath: jest.fn().mockReturnValue([{ id: '2', origin: 'SYD', destination: 'GRU', cost: 300, duration: 15 }]),
      findShortestPath: jest.fn().mockReturnValue([{ id: '3', origin: 'SYD', destination: 'GRU', cost: 700, duration: 5 }])
    };

    tripService = new TripService(tripDalMock, pathFinderMock); // Iniettiamo anche il pathFinder
  });

  describe('fetchAndSortTrips', () => {
    it('should sort trips by fastest', async () => {
      const result = await tripService.fetchAndSortTrips('SYD', 'GRU', 'fastest');
      expect(result[0].duration).toBe(5);
      expect(result).toHaveLength(3);
    });

    it('should sort trips by cheapest', async () => {
      const result = await tripService.fetchAndSortTrips('SYD', 'GRU', 'cheapest');
      expect(result[0].cost).toBe(300);
      expect(result).toHaveLength(3);
    });
  });

  describe('saveTrip', () => {
    it('should throw error if trip is missing', () => {
        expect(() => tripService.saveTrip(null)).toThrow('Trip data with ID is required');
    });

    it('should throw error if trip has no ID', () => {
        expect(() => tripService.saveTrip({ origin: 'SYD' })).toThrow('Trip data with ID is required');
    });
});

});

