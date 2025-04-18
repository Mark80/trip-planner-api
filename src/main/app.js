require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const TripService = require('./tripService');
const TripServiceDal = require('./tripDal');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tripService = new TripService(new TripServiceDal());

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token is missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'invalid Token' });
    req.user = user;
    next();
  });
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== 'admin' || password !== 'password') {
    return res.status(401).json({ error: 'Credenziali invalide' });
  }

  const user = { username };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});


app.get('/api/trips/search', async (req, res) => {
  const { origin, destination, sort_by } = req.query;

  if (!origin || !destination || !['fastest', 'cheapest'].includes(sort_by)) {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  try {
    const trips = await tripService.fetchAndSortTrips(origin, destination, sort_by);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});


app.post('/api/trips/save', (req, res) => {
  try {
    const result = tripService.saveTrip(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/trips/saved', (req, res) => {
  const trips = tripService.listSavedTrips();
  res.json(trips);
});

app.delete('/api/trips/delete/:id', (req, res) => {
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
