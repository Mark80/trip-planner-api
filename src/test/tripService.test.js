const TripService = require('../main/tripService');

describe('TripService', () => {
  let tripDalMock;
  let tripService;
  let savedTrips;

  const mockTrips = [
    { id: '1', origin: 'SYD', destination: 'GRU', cost: 500, duration: 10 },
    { id: '2', origin: 'SYD', destination: 'GRU', cost: 300, duration: 15 },
    { id: '3', origin: 'SYD', destination: 'GRU', cost: 700, duration: 5 }
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

    tripService = new TripService(tripDalMock);
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
    it('should save a valid trip', () => {
      const newTrip = { id: '4', origin: 'SYD', destination: 'LAX', cost: 400, duration: 12 };
      const result = tripService.saveTrip(newTrip);
      expect(result).toEqual({ message: 'Trip saved', trip: newTrip });
      expect(savedTrips).toContainEqual(newTrip);
    });

    it('should throw error if trip is missing', () => {
      expect(() => tripService.saveTrip(null)).toThrow('Trip data with ID is required');
    });

    it('should throw error if trip has no ID', () => {
      expect(() => tripService.saveTrip({ origin: 'SYD' })).toThrow('Trip data with ID is required');
    });
  });

  describe('listSavedTrips', () => {
    it('should return all saved trips', () => {
      savedTrips.push(mockTrips[0], mockTrips[1]);
      const result = tripService.listSavedTrips();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(mockTrips[0]);
    });
  });

  describe('deleteTrip', () => {
    it('should delete trip by ID', () => {
      savedTrips.push(...mockTrips);
      const result = tripService.deleteTrip('2');
      expect(result.trips).toHaveLength(2);
      expect(result.trips.find(t => t.id === '2')).toBeUndefined();
      expect(result.message).toBe('Trip 2 deleted');
    });

    it('should throw error if ID is missing', () => {
      expect(() => tripService.deleteTrip()).toThrow('Trip ID is required');
    });
  });
});

