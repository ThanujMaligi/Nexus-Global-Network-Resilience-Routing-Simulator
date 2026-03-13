package com.nexus.data;

import com.nexus.model.Graph;
import com.nexus.model.Node;
import com.nexus.model.Edge;

import java.util.ArrayList;
import java.util.List;

/**
 * NEXUS - Global Infrastructure Dataset
 * Curated data for urban mobility or global backbone simulation.
 */
public class GlobalBackbone {

    public static Graph<String, String> getInitialGraph() {
        Graph<String, String> graph = new Graph<>(false); // Undirected

        // Major Global Hubs (Coordinates for Heuristic)
        Node<String> london = new Node<>("LON", "London", 51.5, -0.1);
        Node<String> newYork = new Node<>("NYC", "New York", 40.7, -74.0);
        Node<String> singapore = new Node<>("SIN", "Singapore", 1.35, 103.8);
        Node<String> tokyo = new Node<>("TKO", "Tokyo", 35.6, 139.6);
        Node<String> mumbai = new Node<>("MUM", "Mumbai", 19.0, 72.8);
        Node<String> frankfurt = new Node<>("FRA", "Frankfurt", 50.1, 8.6);
        Node<String> dubai = new Node<>("DXB", "Dubai", 25.2, 55.2);

        graph.addNode(london);
        graph.addNode(newYork);
        graph.addNode(singapore);
        graph.addNode(tokyo);
        graph.addNode(mumbai);
        graph.addNode(frankfurt);
        graph.addNode(dubai);

        // Primary Infrastructure Links (Weights are distance/latency)
        graph.addEdge(new Edge<>("E1", "NYC", "LON", 5585));
        graph.addEdge(new Edge<>("E2", "LON", "FRA", 637));
        graph.addEdge(new Edge<>("E3", "FRA", "DXB", 4843));
        graph.addEdge(new Edge<>("E4", "DXB", "MUM", 1930));
        graph.addEdge(new Edge<>("E5", "MUM", "SIN", 3910));
        graph.addEdge(new Edge<>("E6", "SIN", "TKO", 5320));
        graph.addEdge(new Edge<>("E7", "LON", "DXB", 5470));
        graph.addEdge(new Edge<>("E8", "NYC", "SIN", 15300)); // Direct deep sea link

        return graph;
    }
}
