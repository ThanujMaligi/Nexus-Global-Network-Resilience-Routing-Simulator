# NEXUS: Global Resilience Analyzer (Interview Edition)

A high-performance graph engineering project designed to showcase advanced DS&A mastery in technical interviews. It focuses on the relationship between fundamental traversal (DFS/BFS) and advanced analysis (Tarjan's Low-Link) to identify critical points of failure in global infrastructure.

## 🚀 Key Features

- **Advanced Java Engine**: Standard Adjacency List ($O(V+E)$ space) with Generic support.
- **Tarjan's Analysis**: Identifies **Articulation Points** (Hubs) and **Bridges** (Links) in a single DFS pass ($O(V+E)$ time).
- **Informed Pathfinding**: Optimized **A* Search** using Euclidean heuristics and a custom PriorityQueue approach.
- **Network Metrics**: Real-time calculation of **Connectivity** and node **Degree Centrality**.
- **Premium Cyber UI**: Next.js dashboard with a high-tech "Infrastructure Monitor" aesthetic and real-time canvas rendering.

## 🕹️ Fault Tolerance Demo (Core "Wow" Factor)

The visualizer is not just a static simulation; it is a live engine:
1.  **Toggle Nodes**: Click any node on the canvas to "Kill" it (simulate a hub failure).
2.  **Live Re-Analysis**: The system automatically re-runs Tarjan's algorithm to identify new critical points of failure as the network topology changes.
3.  **DS&A Badges**: View internal algorithm states like **Discovery Times (d)** and **Low-Link Values (l)** directly above nodes.

---

## 🛠️ How to Run

### Java Backend
You can compile and run the backend using standard Java (JDK 17+ requested).

1.  Open your terminal in the `./backend` directory.
2.  Compile the main entry point:
    ```bash
    javac -d bin -sourcepath src/main/java src/main/java/com/nexus/Main.java
    ```
3.  Run the application:
    ```bash
    java -cp bin com.nexus.Main
    ```

### Next.js Frontend
1.  Navigate to `./frontend`.
2.  Install dependencies: `npm install`.
3.  Run the dev server: `npm run dev`.

---

## 🎓 Interview Talking Points

### 1. "How does Tarjan's relate to DFS?"
**Answer:** Tarjan's is a single-pass DFS. While traversing, we assign each node a `discovery_time` and a `low_link_value`. If a node `v` has `low[v] > disc[u]`, the edge `(u, v)` is a **Bridge**.

### 2. "Why use A* over Dijkstra?"
**Answer:** Dijkstra is "blind" and expands in all directions equally. A* uses a **Heuristic** ($h(n)$) to guide the search towards the goal, exploring significantly fewer nodes.

### 3. "What is the time complexity of Articulation Point detection?"
**Answer:** It is $O(V+E)$ because each vertex and edge is visited exactly once in the DFS traversal.

---

## 📁 Project Structure
- `./backend`: Standard Java source code with clean models and algorithms (DFS, BFS, Tarjan, A*, Stats).
- `./frontend`: Next.js simulation dashboard with interactive Canvas rendering.
