
const TripServiceDal = require('./tripServiceDal'); // Importa il TripServiceDal
const tripServiceDal = new TripServiceDal();

const airports = [
    "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
    "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
    "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
    "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
    "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
];


async function fetchAllTrips() {
    try {
        for (let origin of airports) {
            for (let destination of airports) {
                // Non fare la richiesta per la stessa combinazione origin/destination
                if (origin === destination) continue;

                console.log(`Fetching trips for ${origin} to ${destination}`);
                
                // Chiamata al servizio per ottenere i trips
                const response = await tripServiceDal.getTrips(origin, destination);
                
                // Qui puoi fare qualcosa con la risposta, per esempio loggarla o salvarla
                console.log(`Trips from ${origin} to ${destination}:`, response.data);
            }
        }
    } catch (error) {
        console.error('Error fetching trips:', error);
    }
}

module.exports = { fetchAllTrips };
