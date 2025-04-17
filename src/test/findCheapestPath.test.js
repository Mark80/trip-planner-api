const PathFinder = require('../main/pathFinder');

describe('PathFinder', () => {
  const trips = [
    {
      origin: 'A',
      destination: 'B',
      cost: 100,
      duration: 1,
      type: 'flight',
      id: '1',
      display_name: 'A to B'
    },
    {
      origin: 'A',
      destination: 'C',
      cost: 50,
      duration: 1,
      type: 'flight',
      id: '2',
      display_name: 'A to C'
    },
    {
      origin: 'C',
      destination: 'B',
      cost: 40,
      duration: 1,
      type: 'flight',
      id: '3',
      display_name: 'C to B'
    },
    {
      origin: 'B',
      destination: 'D',
      cost: 70,
      duration: 1,
      type: 'flight',
      id: '4',
      display_name: 'B to D'
    },
    {
      origin: 'C',
      destination: 'D',
      cost: 60,
      duration: 1,
      type: 'flight',
      id: '5',
      display_name: 'C to D'
    }
  ];

  let pathFinder;

  beforeEach(() => {
    pathFinder = new PathFinder();
  });

  test('finds the cheapest path from A to B (via C)', () => {
    const result = pathFinder.findCheapestPath(trips, 'A', 'B');

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('2'); // A -> C
    expect(result[1].id).toBe('3'); // C -> B
    const totalCost = result.reduce((sum, trip) => sum + trip.cost, 0);
    expect(totalCost).toBe(90); // 50 + 40
  });

  test('finds the cheapest direct path when it is cheapest', () => {
    const directOnlyTrips = [
      {
        origin: 'A',
        destination: 'B',
        cost: 80,
        duration: 1,
        type: 'flight',
        id: '1',
        display_name: 'A to B'
      }
    ];

    const result = pathFinder.findCheapestPath(directOnlyTrips, 'A', 'B');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('returns null when no path exists', () => {
    const result = pathFinder.findCheapestPath(trips, 'X', 'Z');
    expect(result).toBeNull();
  });
});
