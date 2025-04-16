const TripService = require('./tripService');

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

  describe('saveTrip', () => {
    it('should save a trip', () => {
      const req = { body: { id: 'abc123', origin: 'SYD', destination: 'GRU' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      tripService.saveTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Trip saved',
        trip: req.body
      });
    });

    it('should return 400 if no trip id', () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      tripService.saveTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Trip data with ID is required'
      });
    });
  });

  describe('listSavedTrips', () => {
    it('should return saved trips', () => {
      const res = {
        json: jest.fn()
      };

      tripService.listSavedTrips({}, res);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteTrip', () => {
    it('should delete a trip by id', () => {
      // Setup: save one trip first
      const saveReq = { body: { id: 'todelete' } };
      const dummyRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      tripService.saveTrip(saveReq, dummyRes);

      const req = { params: { id: 'todelete' } };
      const res = {
        json: jest.fn()
      };

      tripService.deleteTrip(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: `Trip todelete deleted`
      });
    });
  });
});
