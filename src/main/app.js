require('dotenv').config();
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const TripService = require('./tripService');
const TripServiceDal = require('./tripDal');
const PathFinder = require('./pathFinder');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/swagger.yaml'));
const FetchTrips = require('./allTrips');
const airports = require('./airports');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tripServiceDal = new TripServiceDal();
const tripService = new TripService(tripServiceDal, new PathFinder());
const fetchTrips = new FetchTrips(tripServiceDal, airports);

// Fetch trips once at startup
fetchTrips.fetchAllTrips();

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token is missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
}

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth Route
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== 'admin' || password !== 'password') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const user = { username };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Search trips Route
app.get('/api/trips', async (req, res) => {
  const { origin, destination, sort_by } = req.query;

  try {
    const allTrips = fetchTrips.getCachedTrips();
    const sortedTrips = await tripService.fetchAndSortTrips(origin, destination, sort_by);
    const bestMatch = await tripService.findBestMatch(allTrips, origin, destination, sort_by);

    res.json({
      sortedTrips,
      bestMatch
    });
  } catch (err) {
    console.error('Error in search:', err);
    res.status(500).json({ error: 'Error during trip search' });
  }
});

// Save trip Route
app.post('/api/trips', authenticateToken, (req, res) => {
  try {
    const result = tripService.saveTrip(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all saved trips Route
app.get('/api/trips/saved', authenticateToken, (req, res) => {
  const trips = tripService.listSavedTrips();
  res.json(trips);
});

// Get a specific trip Route
app.get('/api/trips/:id', authenticateToken, (req, res) => {
  const trip = tripService.listSavedTrips().find(t => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  res.json(trip);
});

// Delete a trip Route
app.delete('/api/trips/:id', authenticateToken, (req, res) => {
  try {
    const result = tripService.deleteTrip(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Trip Planner API running on port ${PORT}`);
});
