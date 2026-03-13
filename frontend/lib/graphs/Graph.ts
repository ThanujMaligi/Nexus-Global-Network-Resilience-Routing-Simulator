/**
 * NEXUS Graph Engine - Core Data Structures
 * Generic Weighted Graph supporting Directed/Undirected edges.
 */

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  data?: any;
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
  capacity?: number;
  flow?: number;
  id: string;
}

export class Graph {
  nodes: Map<string, Node> = new Map();
  adjacencyList: Map<string, Edge[]> = new Map();
  isDirected: boolean;

  constructor(isDirected: boolean = false) {
    this.isDirected = isDirected;
  }

  addNode(node: Node) {
    this.nodes.set(node.id, node);
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, []);
    }
  }

  addEdge(edge: Edge) {
    const edges = this.adjacencyList.get(edge.source) || [];
    edges.push(edge);
    this.adjacencyList.set(edge.source, edges);

    if (!this.isDirected) {
      const reverseEdge: Edge = {
        ...edge,
        id: `${edge.target}-${edge.source}`,
        source: edge.target,
        target: edge.source,
      };
      const reverseEdges = this.adjacencyList.get(edge.target) || [];
      reverseEdges.push(reverseEdge);
      this.adjacencyList.set(edge.target, reverseEdges);
    }
  }

  getNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  getEdges(): Edge[] {
    const allEdges: Edge[] = [];
    this.adjacencyList.forEach((edges) => {
      allEdges.push(...edges);
    });
    return allEdges;
  }

  removeNode(nodeId: string) {
    this.nodes.delete(nodeId);
    this.adjacencyList.delete(nodeId);
    // Remove all edges pointing to this node
    this.adjacencyList.forEach((edges, source) => {
      this.adjacencyList.set(
        source,
        edges.filter((e) => e.target !== nodeId)
      );
    });
  }

  removeEdge(edgeId: string) {
    this.adjacencyList.forEach((edges, source) => {
      this.adjacencyList.set(
        source,
        edges.filter((e) => e.id !== edgeId)
      );
    });
  }

  getNeighbors(nodeId: string): Edge[] {
    return this.adjacencyList.get(nodeId) || [];
  }
}
