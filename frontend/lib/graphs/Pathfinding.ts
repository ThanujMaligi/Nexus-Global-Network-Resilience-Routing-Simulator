/**
 * NEXUS Graph Engine - Pathfinding Algorithms
 * Implementation of A* and Dijkstra.
 */

import { Node, Edge, Graph } from "./Graph";

export interface PathResult {
  path: string[];
  distance: number;
}

export class Pathfinding {
  /**
   * Euclidean Distance Heuristic
   */
  static getHeuristic(a: Node, b: Node): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  /**
   * A* Pathfinding Algorithm
   */
  static aStar(graph: Graph, startId: string, endId: string): PathResult | null {
    const startNode = graph.nodes.get(startId);
    const endNode = graph.nodes.get(endId);

    if (!startNode || !endNode) return null;

    const openSet = new Set([startId]);
    const cameFrom = new Map<string, string>();

    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    graph.nodes.forEach((_, id) => {
      gScore.set(id, Infinity);
      fScore.set(id, Infinity);
    });

    gScore.set(startId, 0);
    fScore.set(startId, this.getHeuristic(startNode, endNode));

    while (openSet.size > 0) {
      // Find the node in openSet with the lowest fScore
      let currentId = Array.from(openSet).reduce((a, b) =>
        (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b
      );

      if (currentId === endId) {
        return this.reconstructPath(cameFrom, currentId, gScore.get(endId) || 0);
      }

      openSet.delete(currentId);

      const neighbors = graph.getNeighbors(currentId);
      for (const edge of neighbors) {
        const tentativeGScore = (gScore.get(currentId) || 0) + edge.weight;

        if (tentativeGScore < (gScore.get(edge.target) || Infinity)) {
          cameFrom.set(edge.target, currentId);
          gScore.set(edge.target, tentativeGScore);
          fScore.set(
            edge.target,
            tentativeGScore + this.getHeuristic(graph.nodes.get(edge.target)!, endNode)
          );
          openSet.add(edge.target);
        }
      }
    }

    return null;
  }

  /**
   * Dijkstra Pathfinding Algorithm
   * Equivalent to A* with zero heuristic
   */
  static dijkstra(graph: Graph, startId: string, endId: string): PathResult | null {
    // Dijkstra is just A* where heuristic = 0
    // But let's implement a clean version or just call A* with proxy.
    // For educational/portfolio purposes, a full implementation is better.
    const nodes = graph.getNodes();
    const distances = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const unvisited = new Set<string>();

    nodes.forEach((n) => {
      distances.set(n.id, Infinity);
      prev.set(n.id, null);
      unvisited.add(n.id);
    });

    distances.set(startId, 0);

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let uId = Array.from(unvisited).reduce((a, b) =>
        (distances.get(a) || Infinity) < (distances.get(b) || Infinity) ? a : b
      );

      if (distances.get(uId) === Infinity) break;
      if (uId === endId) break;

      unvisited.delete(uId);

      graph.getNeighbors(uId).forEach((edge) => {
        const alt = (distances.get(uId) || 0) + edge.weight;
        if (alt < (distances.get(edge.target) || Infinity)) {
          distances.set(edge.target, alt);
          prev.set(edge.target, uId);
        }
      });
    }

    if (distances.get(endId) === Infinity) return null;

    const path: string[] = [];
    let curr: string | null | undefined = endId;
    while (curr) {
      path.unshift(curr);
      curr = prev.get(curr);
    }

    return { path, distance: distances.get(endId) || 0 };
  }

  private static reconstructPath(
    cameFrom: Map<string, string>,
    currentId: string,
    distance: number
  ): PathResult {
    const path = [currentId];
    while (cameFrom.has(currentId)) {
      currentId = cameFrom.get(currentId)!;
      path.unshift(currentId);
    }
    return { path, distance };
  }
}
