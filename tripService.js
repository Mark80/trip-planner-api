const axios = require('axios');
const TRIPS_API_URL = 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';
const API_KEY = process.env.TRIPS_API_KEY;

let savedTrips = [];

class TripService {
   async fetchAndSortTrips(origin, destination, sort_by) {
    const response = await axios.get(TRIPS_API_URL, {
      headers: {
        'x-api-key': API_KEY
      },
      params: {
        origin,
        destination
      }
    });

    const filteredTrips = response.data.filter(trip =>
      trip.origin === origin && trip.destination === destination
    );

    return filteredTrips.sort((a, b) =>
      sort_by === 'fastest' ? a.duration - b.duration : a.cost - b.cost
    );
  }

   saveTrip(req, res) {
    const trip = req.body;
    if (!trip || !trip.id) {
      return res.status(400).json({ error: 'Trip data with ID is required' });
    }
    savedTrips.push(trip);
    res.status(201).json({ message: 'Trip saved', trip });
  }

   listSavedTrips(req, res) {
    res.json(savedTrips);
  }

   deleteTrip(req, res) {
    const { id } = req.params;
    savedTrips = savedTrips.filter(trip => trip.id !== id);
    res.json({ message: `Trip ${id} deleted` });
  }
}

module.exports = TripService;
