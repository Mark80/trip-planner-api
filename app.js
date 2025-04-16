// File: app.js
require('dotenv').config();
const express = require('express');
const TripService = require('./tripService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tripService = new TripService();

app.get('/api/trips/search', async (req, res) => {
    const { origin, destination, sort_by } = req.query;

    validateQueryParams(origin, destination, sort_by)

    try {
        const sortedTrips = await tripService.fetchAndSortTrips(origin, destination, sort_by);
        res.json(sortedTrips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

app.post('/api/trips/save', (req, res) => tripService.saveTrip(req, res));

app.get('/api/trips/saved', (req, res) => tripService.listSavedTrips(req, res));

app.delete('/api/trips/delete/:id', (req, res) => tripService.deleteTrip(req, res));

app.listen(PORT, () => {
    console.log(`Trip Planner API running on port ${PORT}`);
});

function validateQueryParams(origin, destination, sort_by) {
    if (!origin || !destination || !['fastest', 'cheapest'].includes(sort_by)) {
        return { error: 'Missing or invalid parameters' };
    }
    return null;
}
