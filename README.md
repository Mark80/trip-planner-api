
# Trip Planner API

This project is a simple API for planning and saving flight trips. It provides endpoints to search, save, delete, and retrieve flight paths based on cost or duration.

At startup, the application saves all the trips for every combination of origin and destination in a cache. This is done to create the graph that connects all the destinations. 
This step takes some time. In a real-world scenario, it should probably be implemented asynchronously (for example, using a queue). In this case, the graph would be updated in real-time and maybe use a graph database.
I prefer this approach instead of calling the API every time. The main reason is to improve the performance experienced by the customer.
The DAL, which handles communication with the external service, performs object mapping to decouple the logic from the contract. However, for simplicity, I kept the same format.
The best path is then calculated in the PathFinder class.
This aplication use a in memory database [javascript collection] for simplicity.


## 🛠️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/Mark80/trip-planner-api.git
cd trip-planner-api
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Create `.env` file (you can rename .env.example)
Create a `.env` file in the root with the following:
```env
PORT=3000
JWT_SECRET=your_jwt_secret
TRIPS_API_KEY=api_key
```

### 4.1 Run the app
```bash
yarn start
```

For development with hot reload:
```bash
yarn dev
```
### 4.2 Run the app in docker 
```bash
docker build -t trip-planner .
docker run -p 3000:3000 trip-planner
```

## ✅ Running Tests
```bash
yarn test
```

## 📚 Swagger Documentation

Once the app is running, access the API docs at:

```
http://localhost:3000/api-docs
```

You can authenticate using the "Authorize" button and providing a JWT token.

To get a token:
```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}
```

Then copy the token into the Swagger UI authorize modal.

## 📁 Project Structure
```
src/
├── main/
│   ├── app.js            # Express app
│   ├── pathFinder.js     # Path finding logic
│   ├── tripDal.js        # DAL for fetching trips
│   ├── tripService.js    # Business logic layer
│   ├── allTrips.js       # Cache/population utility
│   └── airports.js       # List of airports
├── test/
│   └── ...               # Jest unit tests
swagger.yaml              # API spec
```

---