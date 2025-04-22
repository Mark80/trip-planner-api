

class FetchTrips {
    constructor(tripServiceDal, airports) {
      // Iniezione di TripServiceDal
      this.tripServiceDal = tripServiceDal;
      this.airports = airports;
      this.cachedTrips = [];
    }
  
    async fetchAllTrips() {
      try {
        const allTrips = [];
  
        for (let origin of this.airports) {
          for (let destination of this.airports) {
            if (origin === destination) continue;
  
            console.log(`Fetching trips for ${origin} to ${destination}`);
  
            const response = await this.tripServiceDal.getTrips(origin, destination);
            const trips = response.data || [];
  
            allTrips.push(...trips);
          }
        }
  
        this.cachedTrips = allTrips;
        console.log(`✔️  Fetched and cached ${this.cachedTrips.length} trips`);
      } catch (error) {
        console.error('❌ Error fetching trips:', error);
      }
    }
  
    getCachedTrips() {
      return this.cachedTrips;
    }

    resetCache() {
        this.cachedTrips = [];
      }

  }
  
  module.exports = FetchTrips;
  