package com.nexus.algo;

import com.nexus.model.Graph;
import com.nexus.model.Node;
import com.nexus.model.Edge;
import java.util.*;

/**
 * INTERVIEW FOCUS: Tarjan's Low-Link Algorithm (Bridges & Articulation Points)
 * 
 * Question: "What are Articulation Points and Bridges?"
 * Answer: Bridges are edges that, if removed, increase the number of 
 *         connected components. Articulation points are nodes that, 
 *         if removed, do the same.
 */
public class TarjanAnalyzer<V, E> {

    private int time = 0;
    private final Set<String> articulationPoints = new HashSet<>();
    private final List<Edge<E>> bridges = new ArrayList<>();

    /**
     * Big O: $O(V + E)$ - Standard DFS performance with constant overhead per node/edge.
     * Logic: A node u is an articulation point if it's the root with >1 children 
     *        OR if it's not the root and has a child v such that no node in v's 
     *        subtree has a back-edge to u or any of u's ancestors.
     */
    public void analyze(Graph<V, E> graph) {
        time = 0;
        articulationPoints.clear();
        bridges.clear();

        int n = graph.getAllNodes().size();
        if (n == 0) return;

        Map<String, Integer> discoveryTime = new HashMap<>();
        Map<String, Integer> lowLink = new HashMap<>();
        Map<String, String> parent = new HashMap<>();
        Set<String> visited = new HashSet<>();

        for (Node<V> node : graph.getAllNodes()) {
            if (!visited.contains(node.getId())) {
                findAPAndBridges(graph, node.getId(), visited, discoveryTime, lowLink, parent);
            }
        }
    }

    private void findAPAndBridges(Graph<V, E> graph, String u, Set<String> visited, 
                                  Map<String, Integer> disc, Map<String, Integer> low, 
                                  Map<String, String> parent) {
        visited.add(u);
        int currentTime = ++time;
        disc.put(u, currentTime);
        low.put(u, currentTime);
        int children = 0;

        for (Edge<E> edge : graph.getNeighbors(u)) {
            String v = edge.getTarget();

            if (!visited.contains(v)) {
                children++;
                parent.put(v, u);
                findAPAndBridges(graph, v, visited, disc, low, parent);

                // Check low-link value of subtree
                low.put(u, Math.min(low.get(u), low.get(v)));

                // 1. Check for Bridge
                if (low.get(v) > disc.get(u)) {
                    bridges.add(edge);
                }

                // 2. Check for Articulation Point (Non-root)
                if (parent.get(u) != null && low.get(v) >= disc.get(u)) {
                    articulationPoints.add(u);
                }
            } else if (!v.equals(parent.get(u))) {
                // Update low-link for back-edge
                low.put(u, Math.min(low.get(u), disc.get(v)));
            }
        }

        // 3. Check for Articulation Point (Root special case)
        if (parent.get(u) == null && children > 1) {
            articulationPoints.add(u);
        }
    }

    public Set<String> getArticulationPoints() { return articulationPoints; }
    public List<Edge<E>> getBridges() { return bridges; }
}
