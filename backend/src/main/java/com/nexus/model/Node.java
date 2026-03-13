package com.nexus.model;

import java.util.Objects;

/**
 * NEXUS Graph Engine - Node Model
 * Represents a vertex in the infrastructure graph.
 */
public class Node<T> {
    private final String id;
    private final String label;
    private final double x;
    private final double y;
    private T data; // Generic data for interviewer flexibility (e.g. Server metrics, City info)

    public Node(String id, String label, double x, double y) {
        this.id = id;
        this.label = label;
        this.x = x;
        this.y = y;
    }

    public String getId() { return id; }
    public String getLabel() { return label; }
    public double getX() { return x; }
    public double getY() { return y; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Node<?> node = (Node<?>) o;
        return Objects.equals(id, node.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Node{" + "id='" + id + '\'' + ", label='" + label + '\'' + '}';
    }
}
