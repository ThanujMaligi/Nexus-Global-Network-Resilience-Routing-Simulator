package com.nexus.algo;

import com.nexus.model.Graph;
import com.nexus.model.Node;
import com.nexus.model.Edge;
import java.util.*;

/**
 * INTERVIEW FOCUS: A* Pathfinding (Heuristic Search)
 * 
 * Question: "Difference between Dijkstra and A*?"
 * Answer: Dijkstra is blind ($h(n) = 0$), expanding in all directions. 
 *         A* is informed ($f(n) = g(n) + h(n)$), prioritizing nodes that 
 *         seem closer to the goal based on a heuristic.
 */
public class AStarPathfinder<V, E> {

    /**
     * Big O: $O(E \log V)$ with a PriorityQueue.
     * Heuristic: Euclidean distance for coordinates.
     */
    public List<String> findShortestPath(Graph<V, E> graph, String startId, String endId) {
        Node<V> endNode = graph.getNode(endId);
        if (endNode == null) return null;

        PriorityQueue<PathNode> openSet = new PriorityQueue<>();
        Map<String, String> cameFrom = new HashMap<>();

        Map<String, Double> gScore = new HashMap<>();
        Map<String, Double> fScore = new HashMap<>();

        for (Node<V> node : graph.getAllNodes()) {
            gScore.put(node.getId(), Double.POSITIVE_INFINITY);
            fScore.put(node.getId(), Double.POSITIVE_INFINITY);
        }

        gScore.put(startId, 0.0);
        fScore.put(startId, heuristic(graph.getNode(startId), endNode));
        openSet.add(new PathNode(startId, fScore.get(startId)));

        while (!openSet.isEmpty()) {
            PathNode current = openSet.poll();
            String currentId = current.nodeId;

            if (currentId.equals(endId)) {
                return reconstructPath(cameFrom, currentId);
            }

            for (Edge<E> edge : graph.getNeighbors(currentId)) {
                double tentativeGScore = gScore.get(currentId) + edge.getWeight();

                if (tentativeGScore < gScore.get(edge.getTarget())) {
                    cameFrom.put(edge.getTarget(), currentId);
                    gScore.put(edge.getTarget(), tentativeGScore);
                    fScore.put(edge.getTarget(), tentativeGScore + heuristic(graph.getNode(edge.getTarget()), endNode));
                    
                    // Optimization: We could use a "Contains" check or just add it again.
                    // PriorityQueue doesn't update values, so we just add a new entry.
                    openSet.add(new PathNode(edge.getTarget(), fScore.get(edge.getTarget())));
                }
            }
        }

        return null; // No path found
    }

    private double heuristic(Node<V> a, Node<V> b) {
        if (a == null || b == null) return 0;
        // Euclidean distance
        return Math.sqrt(Math.pow(a.getX() - b.getX(), 2) + Math.pow(a.getY() - b.getY(), 2));
    }

    private List<String> reconstructPath(Map<String, String> cameFrom, String current) {
        LinkedList<String> path = new LinkedList<>();
        path.add(current);
        while (cameFrom.containsKey(current)) {
            current = cameFrom.get(current);
            path.addFirst(current);
        }
        return path;
    }

    private static class PathNode implements Comparable<PathNode> {
        String nodeId;
        double fScore;

        PathNode(String nodeId, double fScore) {
            this.nodeId = nodeId;
            this.fScore = fScore;
        }

        @Override
        public int compareTo(PathNode other) {
            return Double.compare(this.fScore, other.fScore);
        }
    }
}
