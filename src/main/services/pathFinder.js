class PathFinder {
    constructor() {}
  
    findCheapestPath(trips, origin, destination) {
      return this._findPath(trips, origin, destination, 'cost');
    }
  
    findFastestPath(trips, origin, destination) {
      return this._findPath(trips, origin, destination, 'duration');
    }
  
    // It could happen that the shortest or least expensive route from A -> B is A -> C -> B.
    _findPath(trips, origin, destination, mode) {
      const graph = this._buildGraph(trips);
      const visited = new Set();
      const queue = [{ node: origin, path: [], totalValue: 0 }];
  
      let bestPath = null;
      let bestValue = Infinity;
  
      while (queue.length > 0) {
        const current = queue.shift();
        const { node, path, totalValue } = current;
  
        if (node === destination) {
          if (totalValue < bestValue) {
            bestValue = totalValue;
            bestPath = path;
          }
          continue;
        }
  
        if (!graph[node]) continue;
  
        for (const neighbor of graph[node]) {
          const visitKey = `${node}-${neighbor.destination}-${mode}`;
          if (visited.has(visitKey)) continue;
  
          visited.add(visitKey);
          const addedValue = mode === 'cost' ? neighbor.cost : neighbor.duration;
          queue.push({
            node: neighbor.destination,
            path: [...path, neighbor.trip],
            totalValue: totalValue + addedValue
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
          duration: trip.duration,
          trip
        });
      }
      return graph;
    }
  }
  
  module.exports = PathFinder;
  