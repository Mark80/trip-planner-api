const axios = require('axios');
const { mapTripData } = require('./tripMapper');
const TRIPS_API_URL = 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';
const API_KEY = process.env.TRIPS_API_KEY;

console.log(API_KEY);

let savedTrips = [];

class TripServiceDal {

  async getTrips(origin, destination) {
    try {
        const response = await axios.get(TRIPS_API_URL, {
            headers: {
                'x-api-key': API_KEY
            },
            params: {
                origin,
                destination
            }
        });

        // Apply the mapper to transform the data
        const mappedTrips = mapTripData(response.data);

        return {data: mappedTrips}; // Return the mapped data with the same field names
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error; // Handle the error appropriately
    }
}

    saveTrip(trip){
      savedTrips.push(trip);
    }

    deleteTrip(id){
      savedTrips = savedTrips.filter(trip => trip.id !== id)
      return savedTrips;  
    }

    all(){
      return savedTrips;
    }



}

module.exports = TripServiceDal;
