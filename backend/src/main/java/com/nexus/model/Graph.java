package com.nexus.model;

import java.util.*;

/**
 * NEXUS Graph Engine - Generic Adjacency List
 * Optimized for performance ($O(1)$ lookups) and space efficiency ($O(V+E)$).
 */
public class Graph<V, E> {
    private final Map<String, Node<V>> nodes = new HashMap<>();
    private final Map<String, List<Edge<E>>> adjacencyList = new HashMap<>();
    private final boolean isDirected;

    public Graph(boolean isDirected) {
        this.isDirected = isDirected;
    }

    /**
     * Big O: $O(1)$ average time to add a node.
     */
    public void addNode(Node<V> node) {
        nodes.put(node.getId(), node);
        adjacencyList.putIfAbsent(node.getId(), new ArrayList<>());
    }

    /**
     * Big O: $O(1)$ to add an edge to the adjacency list.
     */
    public void addEdge(Edge<E> edge) {
        if (!nodes.containsKey(edge.getSource()) || !nodes.containsKey(edge.getTarget())) {
            throw new IllegalArgumentException("Source or Target node not found in graph.");
        }

        adjacencyList.get(edge.getSource()).add(edge);

        if (!isDirected) {
            Edge<E> reverseEdge = new Edge<>(
                edge.getId() + "_rev",
                edge.getTarget(),
                edge.getSource(),
                edge.getWeight()
            );
            reverseEdge.setData(edge.getData());
            adjacencyList.get(edge.getTarget()).add(reverseEdge);
        }
    }

    public Node<V> getNode(String id) { return nodes.get(id); }
    public List<Edge<E>> getNeighbors(String nodeId) { return adjacencyList.getOrDefault(nodeId, Collections.emptyList()); }
    public Collection<Node<V>> getAllNodes() { return nodes.values(); }
    public boolean isDirected() { return isDirected; }

    /**
     * Interview Tip: Keeping nodes in a Map allows for $O(1)$ access,
     * while the Adjacency List allows for efficient neighbor traversal.
     */
}
