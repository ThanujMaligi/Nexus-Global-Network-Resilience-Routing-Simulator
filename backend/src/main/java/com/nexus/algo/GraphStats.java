package com.nexus.algo;

import com.nexus.model.Graph;
import com.nexus.model.Node;
import com.nexus.model.Edge;
import java.util.*;

/**
 * INTERVIEW FOCUS: Graph Resilience Metrics
 * 
 * Demonstrates basic graph analysis beyond traversal.
 */
public class GraphStats<V, E> {

    /**
     * Big O: $O(V + E)$ - Standard connectivity check via BFS/DFS.
     */
    public boolean isConnected(Graph<V, E> graph) {
        if (graph.getAllNodes().isEmpty()) return true;
        
        String startId = graph.getAllNodes().iterator().next().getId();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        
        queue.add(startId);
        visited.add(startId);
        
        while (!queue.isEmpty()) {
            String curr = queue.poll();
            for (Edge<E> edge : graph.getNeighbors(curr)) {
                if (!visited.contains(edge.getTarget())) {
                    visited.add(edge.getTarget());
                    queue.add(edge.getTarget());
                }
            }
        }
        
        return visited.size() == graph.getAllNodes().size();
    }

    /**
     * Degree Centrality: Identify nodes with the most connections.
     * Often used to identify "Critical Hubs" in infrastructure.
     */
    public Map<String, Integer> getDegreeCentrality(Graph<V, E> graph) {
        Map<String, Integer> centrality = new HashMap<>();
        for (Node<V> node : graph.getAllNodes()) {
            centrality.put(node.getId(), graph.getNeighbors(node.getId()).size());
        }
        return centrality;
    }

    /**
     * Efficiency: $O(V)$ - Simple iteration after graph built.
     */
    public String getMostCentralNode(Graph<V, E> graph) {
        Map<String, Integer> centrality = getDegreeCentrality(graph);
        return centrality.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");
    }
}
