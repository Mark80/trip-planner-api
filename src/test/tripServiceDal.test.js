const axios = require('axios');
const TripServiceDal = require('../main/dal/tripDal');

// Mock di axios.get
jest.mock('axios');

describe('TripServiceDal', () => {
  let service;

  beforeEach(() => {
    service = new TripServiceDal();

    axios.get.mockReset();
  });

  describe('getTrips', () => {
    it('should call axios with correct URL, headers and params', async () => {
      const origin = 'LAX';
      const destination = 'JFK';

      const mockResponse = { data: [{ id: 1, origin, destination }] };
      axios.get.mockResolvedValue(mockResponse);

      const response = await service.getTrips(origin, destination);

      expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
        headers: {
          'x-api-key': process.env.TRIPS_API_KEY
        },
        params: { origin, destination }
      });

      expect(response).toEqual(mockResponse);
    });
  });

  describe('saveTrip', () => {
    it('should save a trip', () => {
      const trip = { id: '123', origin: 'LAX', destination: 'JFK' };
      service.saveTrip(trip);

      expect(service.all()).toContainEqual(trip);
    });
  });

  describe('deleteTrip', () => {
    it('should delete a trip by id', () => {
      const trip1 = { id: '1', origin: 'LAX', destination: 'JFK' };
      const trip2 = { id: '2', origin: 'CDG', destination: 'ORD' };

      service.saveTrip(trip1);
      service.saveTrip(trip2);

      const remainingTrips = service.deleteTrip('1');

      expect(remainingTrips).not.toContainEqual(trip1);
      expect(remainingTrips).toContainEqual(trip2);
    });
  });

  describe('all', () => {
    it('should return all saved trips', () => {
      const trip = { id: 'abc', origin: 'AMS', destination: 'DXB' };
      service.saveTrip(trip);

      const trips = service.all();
      expect(trips).toEqual(expect.arrayContaining([trip]));
    });
  });
});
