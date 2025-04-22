const FetchTrips = require('../main/services/allTrips');

// Mock di TripServiceDal
const mockTripServiceDal = {
  getTrips: jest.fn().mockResolvedValue({
    data: [
      { id: '1', origin: 'A', destination: 'B', cost: 100, duration: 2 },
      { id: '2', origin: 'A', destination: 'C', cost: 50, duration: 3 },
      { id: '3', origin: 'C', destination: 'B', cost: 20, duration: 1 }
    ]
  })
};

describe('FetchTrips', () => {
  let fetchTrips;

  beforeEach(() => {
    // Inizializza FetchTrips con una lista ridotta di aeroporti
    fetchTrips = new FetchTrips(mockTripServiceDal, ['A', 'B']);
    fetchTrips.resetCache();
  });

  it('should fetch and cache trips correctly', async () => {
    await fetchTrips.fetchAllTrips();

    // Combinazioni: A->B, B->A = 2 chiamate
    expect(mockTripServiceDal.getTrips).toHaveBeenCalledTimes(2);
    expect(fetchTrips.getCachedTrips()).toHaveLength(6); // 3 trip per chiamata, 2 chiamate = 6
    expect(fetchTrips.getCachedTrips()[0].id).toBe('1');
  });
});
