const axios = require('axios');
const TRIPS_API_URL = 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';
const API_KEY = process.env.TRIPS_API_KEY;

let savedTrips = [];

class TripService {
  constructor(tripServiceDal) {
    this.tripDal = tripServiceDal;
  }

  async fetchAndSortTrips(origin, destination, sort_by) {
    const response = await this.tripDal.getTrips(origin, destination);
    const filteredTrips = response.data.filter(
      trip => trip.origin === origin && trip.destination === destination
    );

    return filteredTrips.sort((a, b) =>
      sort_by === 'fastest' ? a.duration - b.duration : a.cost - b.cost
    );
  }

  saveTrip(trip) {
    if (!trip || !trip.id) {
      throw new Error('Trip data with ID is required');
    }
    this.tripDal.saveTrip(trip);
    return { message: 'Trip saved', trip };
  }

  listSavedTrips() {
    return this.tripDal.all();
  }

  deleteTrip(id) {
    if (!id) {
      throw new Error('Trip ID is required');
    }
    const updatedTrips = this.tripDal.deleteTrip(id);
    return { message: `Trip ${id} deleted`, trips: updatedTrips };
  }
}

module.exports = TripService;
