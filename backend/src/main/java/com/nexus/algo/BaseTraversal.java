package com.nexus.algo;

import com.nexus.model.Graph;
import com.nexus.model.Node;
import com.nexus.model.Edge;
import java.util.*;

/**
 * INTERVIEW FOCUS: Basic Depth-First Search (DFS)
 * 
 * Question: "How does Tarjan's relate to DFS?"
 * Answer: Tarjan's IS a single-pass DFS. While traversing, it computes 
 *         discovery times and low-link values to find bridges/articulation points
 *         in O(V+E) time, rather than just visiting nodes.
 */
public class BaseTraversal<V, E> {

    /**
     * Big O: $O(V + E)$ - Every node and every edge is visited exactly once.
     * Space: $O(V)$ - Recursion stack and 'visited' set.
     */
    public List<String> dfsRecursive(Graph<V, E> graph, String startNodeId) {
        List<String> traversalOrder = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        
        dfsHelper(graph, startNodeId, visited, traversalOrder);
        
        return traversalOrder;
    }

    private void dfsHelper(Graph<V, E> graph, String currentId, Set<String> visited, List<String> order) {
        // Step 1: Mark as visited
        visited.add(currentId);
        order.add(currentId);

        // Step 2: Explore neighbors
        for (Edge<E> edge : graph.getNeighbors(currentId)) {
            if (!visited.contains(edge.getTarget())) {
                dfsHelper(graph, edge.getTarget(), visited, order);
            }
        }
    }

    /**
     * Interview Tip: In a production environment, iterative DFS with a Stack 
     * is safer (prevents StackOverflowError on deep graphs), but recursive 
     * DFS is the foundation of Tarjan's and more intuitive to explain.
     */
    public List<String> dfsIterative(Graph<V, E> graph, String startNodeId) {
        List<String> traversalOrder = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        Stack<String> stack = new Stack<>();

        stack.push(startNodeId);

        while (!stack.isEmpty()) {
            String currentId = stack.pop();

            if (!visited.contains(currentId)) {
                visited.add(currentId);
                traversalOrder.add(currentId);

                // Add neighbors in reverse for consistent order with recursive
                List<Edge<E>> neighbors = graph.getNeighbors(currentId);
                for (int i = neighbors.size() - 1; i >= 0; i--) {
                    String neighborId = neighbors.get(i).getTarget();
                    if (!visited.contains(neighborId)) {
                        stack.push(neighborId);
                    }
                }
            }
        }
        return traversalOrder;
    }

    /**
     * INTERVIEW FOCUS: Breadth-First Search (BFS)
     * 
     * Question: "When to use BFS over DFS?"
     * Answer: BFS is optimal for finding the shortest path in an unweighted graph
     *         and explores the graph "layer by layer." It uses a Queue ($FIFO$).
     */
    public List<String> bfs(Graph<V, E> graph, String startNodeId) {
        List<String> order = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();

        queue.add(startNodeId);
        visited.add(startNodeId);

        while (!queue.isEmpty()) {
            String currentId = queue.poll();
            order.add(currentId);

            for (Edge<E> edge : graph.getNeighbors(currentId)) {
                if (!visited.contains(edge.getTarget())) {
                    visited.add(edge.getTarget());
                    queue.add(edge.getTarget());
                }
            }
        }
        return order;
    }
}
