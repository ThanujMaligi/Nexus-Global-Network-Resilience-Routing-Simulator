package com.nexus.model;

import java.util.Objects;

/**
 * NEXUS Graph Engine - Edge Model
 * Represents a connection between two nodes with weight and data.
 */
public class Edge<T> {
    private final String id;
    private final String source;
    private final String target;
    private final double weight;
    private T data; // For interviewer flexibility (e.g. Latency vs. Throughput)

    public Edge(String id, String source, String target, double weight) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.weight = weight;
    }

    public String getId() { return id; }
    public String getSource() { return source; }
    public String getTarget() { return target; }
    public double getWeight() { return weight; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Edge<?> edge = (Edge<?>) o;
        return Objects.equals(id, edge.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Edge{" + "id='" + id + '\'' + ", source='" + source + '\'' + ", target='" + target + '\'' + '}';
    }
}
