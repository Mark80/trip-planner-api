function mapTripData(originalData) {
    return originalData.map(trip => {
        return {
            id: trip.id,  // Keeping the same field name
            origin: trip.origin, // Keeping the same field name
            destination: trip.destination, // Keeping the same field name
            cost: trip.cost, // Keeping the same field name
            duration: trip.duration // Keeping the same field name
        };
    });
}

module.exports = {
    mapTripData
};