const axios = require('axios');
const TRIPS_API_URL = 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';
const API_KEY = process.env.TRIPS_API_KEY;

let savedTrips = [];

class TripServiceDal {

    async getTrips(origin, destination){
        return await axios.get(TRIPS_API_URL, {
              headers: {
                'x-api-key': API_KEY
              },
              params: {
                origin,
                destination
              }
            });
    }

    saveTrip(trip){
      savedTrips.push(trip);
    }

    deleteTrip(id){
      return savedTrips.filter(trip => trip.id !== id);  
    }

    all(){
      return savedTrips;
    }



}

module.exports = TripServiceDal;
