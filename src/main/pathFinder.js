class PathFinder {
  constructor() {}

  findCheapestPath(trips, origin, destination) {
    return this._findPath(trips, origin, destination, 'cost');
  }

  findShortestPath(trips, origin, destination) {
    return this._findPath(trips, origin, destination, 'hops');
  }

  _findPath(trips, origin, destination, mode) {
    const graph = this._buildGraph(trips);
    const visited = new Set();
    const queue = [{ node: origin, path: [], totalCost: 0 }];

    let bestPath = null;
    let bestValue = Infinity;

    while (queue.length > 0) {
      const current = queue.shift();
      const { node, path, totalCost } = current;

      if (node === destination) {
        const value = mode === 'cost' ? totalCost : path.length;
        if (value < bestValue) {
          bestValue = value;
          bestPath = path;
        }
        continue;
      }

      if (!graph[node]) continue;

      for (const neighbor of graph[node]) {
        const visitKey = `${node}-${neighbor.destination}-${mode}`;
        if (visited.has(visitKey)) continue;

        visited.add(visitKey);
        queue.push({
          node: neighbor.destination,
          path: [...path, neighbor.trip],
          totalCost: totalCost + neighbor.cost
        });
      }
    }

    return bestPath;
  }

  _buildGraph(trips) {
    const graph = {};
    for (const trip of trips) {
      if (!graph[trip.origin]) {
        graph[trip.origin] = [];
      }
      graph[trip.origin].push({
        destination: trip.destination,
        cost: trip.cost,
        trip
      });
    }
    return graph;
  }
}

module.exports = PathFinder;
