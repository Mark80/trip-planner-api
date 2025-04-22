const PathFinder = require('../main/services/pathFinder');

describe('PathFinder', () => {
  const trips = [
    { id: '1', origin: 'A', destination: 'B', cost: 100, duration: 2 },
    { id: '2', origin: 'A', destination: 'C', cost: 50, duration: 2 },
    { id: '3', origin: 'C', destination: 'B', cost: 20, duration: 1 },
    { id: '4', origin: 'B', destination: 'D', cost: 30, duration: 3 },
    { id: '5', origin: 'A', destination: 'D', cost: 300, duration: 10 }
  ];

  let pathFinder;

  beforeEach(() => {
    pathFinder = new PathFinder();
  });

  test('findCheapestPath returns the path with lowest total cost', () => {
    const path = pathFinder.findCheapestPath(trips, 'A', 'B');
    expect(path.map(p => p.id)).toEqual(['2', '3']); // A -> C -> B
    const totalCost = path.reduce((sum, trip) => sum + trip.cost, 0);
    expect(totalCost).toBe(70);
  });

  test('findShortestPath returns the path with lowest total duration', () => {
    const path = pathFinder.findFastestPath(trips, 'A', 'D');
    expect(path.map(p => p.id)).toEqual(['1', '4']); // A -> B -> D
    const totalDuration = path.reduce((sum, trip) => sum + trip.duration, 0);
    expect(totalDuration).toBe(5); // 2 (A->B) + 3 (B->D)
  });

  test('returns null if no path is found', () => {
    const path = pathFinder.findCheapestPath(trips, 'X', 'Y');
    expect(path).toBeNull();
  });
});
