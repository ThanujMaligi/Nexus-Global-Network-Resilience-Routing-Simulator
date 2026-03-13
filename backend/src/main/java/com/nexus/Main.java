package com.nexus;

import com.nexus.algo.BaseTraversal;
import com.nexus.algo.TarjanAnalyzer;
import com.nexus.algo.AStarPathfinder;
import com.nexus.algo.GraphStats;
import com.nexus.data.GlobalBackbone;
import com.nexus.model.Graph;
import com.nexus.model.Edge;

import java.util.List;
import java.util.Set;

/**
 * NEXUS - Project Entry Point
 * Demonstrates the advanced graph algorithms for an interviewer.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("--- NEXUS: Global Infrastructure Engine ---");
        System.out.println("--- DS&A Mastery Suite ---\n");

        // 1. Setup Graph
        Graph<String, String> graph = GlobalBackbone.getInitialGraph();
        System.out.println("[SETUP] Graph loaded with " + graph.getAllNodes().size() + " nodes.");

        // 2. Demonstrate Traversals (DFS vs BFS)
        BaseTraversal<String, String> traversal = new BaseTraversal<>();
        List<String> dfsOrder = traversal.dfsRecursive(graph, "LON");
        List<String> bfsOrder = traversal.bfs(graph, "LON");

        System.out.println("\n[1] Traversal Analysis (Start: London):");
        System.out.println("DFS (Deep Search): " + String.join(" -> ", dfsOrder));
        System.out.println("BFS (Layer Search): " + String.join(" -> ", bfsOrder));
        System.out.println("Interview Tip: BFS is optimal for shortest paths in unweighted graphs.");

        // 3. Demonstrate Tarjan's (Resilience)
        TarjanAnalyzer<String, String> tarjan = new TarjanAnalyzer<>();
        tarjan.analyze(graph);
        Set<String> ap = tarjan.getArticulationPoints();
        List<Edge<String>> bridges = tarjan.getBridges();

        System.out.println("\n[2] Tarjan's Resilience Analysis:");
        System.out.println("Critical Hubs (APs): " + ap);
        System.out.println("Critical Links (Bridges): " + bridges.size() + " identified.");
        for (Edge<String> b : bridges) {
            System.out.println("  ! Bridge Found: " + b.getSource() + " <-> " + b.getTarget());
        }

        // 4. Demonstrate Graph Statistics
        GraphStats<String, String> stats = new GraphStats<>();
        System.out.println("\n[3] Network Metrics:");
        System.out.println("Is fully connected: " + stats.isConnected(graph));
        System.out.println("Most Central Hub (by Degree): " + stats.getMostCentralNode(graph));

        // 5. Demonstrate A* Pathfinding
        AStarPathfinder<String, String> pathfinder = new AStarPathfinder<>();
        List<String> path = pathfinder.findShortestPath(graph, "NYC", "SIN");

        System.out.println("\n[4] A* Pathfinding (NYC -> Singapore):");
        if (path != null) {
            System.out.println("Optimal Path: " + String.join(" -> ", path));
            System.out.println("Context: A* uses Euclidean distance to guide the search.");
        }

        System.out.println("\n--- Analysis Complete ---");
    }
}
