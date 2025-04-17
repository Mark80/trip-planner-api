class PathFinder {
    findCheapestPath(trips, origin, destination) {
      const graph = {};
  
      // Costruisci il grafo
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
  
      const visited = new Set();
      const queue = [{ node: origin, path: [], totalCost: 0 }];
  
      let bestPath = null;
      let minCost = Infinity;
  
      while (queue.length > 0) {
        const current = queue.shift();
        const { node, path, totalCost } = current;
  
        if (node === destination) {
          if (totalCost < minCost) {
            minCost = totalCost;
            bestPath = path;
          }
          continue;
        }
  
        if (!graph[node]) continue;
  
        for (const neighbor of graph[node]) {
          if (visited.has(`${node}-${neighbor.destination}`)) continue;
  
          visited.add(`${node}-${neighbor.destination}`);
          queue.push({
            node: neighbor.destination,
            path: [...path, neighbor.trip],
            totalCost: totalCost + neighbor.cost
          });
        }
      }
  
      return bestPath;
    }
  }
  
  module.exports = PathFinder;
  