const TripService = require('../main/tripService');

describe('TripService', () => {
  let tripDalMock;
  let tripService;

  const mockTrips = [
    { id: '1', origin: 'SYD', destination: 'GRU', cost: 500, duration: 10 },
    { id: '2', origin: 'SYD', destination: 'GRU', cost: 300, duration: 15 },
    { id: '3', origin: 'SYD', destination: 'GRU', cost: 700, duration: 5 }
  ];

  beforeEach(() => {
    // Crea un mock dell'oggetto tripDal
    tripDalMock = {
      getTrips: jest.fn().mockResolvedValue({ data: mockTrips })
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
});
