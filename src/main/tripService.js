const axios = require('axios');
const TRIPS_API_URL = 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';
const API_KEY = process.env.TRIPS_API_KEY;


class TripService {
  constructor(tripServiceDal, pathFinder) {
    this.tripDal = tripServiceDal;
    this.pathFinder = pathFinder;
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

  async findBestMatch(trips, origin, destination, sort_by) {
    if (sort_by === 'fastest') {
      return this.pathFinder.findShortestPath(trips, origin, destination);
    } else {
      return this.pathFinder.findCheapestPath(trips, origin, destination);
    }
  }

  saveTrip(trip) {
    if (!trip || !trip.id) {
      throw new Error('Trip data with ID is required');
    }
    this.tripDal.saveTrip(trip);
    return trip;
  }

  listSavedTrips() {
    return this.tripDal.all();
  }

  deleteTrip(id) {
    return this.tripDal.deleteTrip(id);
  }
}

module.exports = TripService;
