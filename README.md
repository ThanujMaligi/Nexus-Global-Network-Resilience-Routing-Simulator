# NEXUS: Global Resilience Analyzer & Routing Simulator 🌐

A high-performance graph engineering and visualization project designed to demonstrate advanced Data Structures & Algorithms (DS&A) mastery. It explores the relationship between fundamental traversal algorithms (BFS) and advanced analysis (Tarjan's Low-Link, A* Search) to identify critical points of failure and optimize pathways in global network infrastructure.

---

## 🚀 Key Features

- **Tarjan's Low-Link Analysis:** Identifies **Articulation Points** (critical hub nodes) and **Bridges** (single-point-of-failure communication links) in a single DFS pass ($O(V+E)$ time).
- **Informed Pathfinding (A* Search):** Optimizes path routing using Euclidean distance heuristics, evaluated against a baseline Breadth-First Search (BFS) to show efficiency improvements.
- **Fault-Tolerance Live Visualizer:** An interactive HTML5 Canvas dashboard allowing users to click and "kill" any node, triggering a live recalculation of the network's remaining bridges and paths.
- **Resilience Metrics:** Real-time feedback on network connectivity, degree centrality, and path efficiency.
- **Premium Tech Aesthetic:** A sleek, high-contrast dark mode dashboard built with Next.js and Tailwind CSS resembling an infrastructure control console.

---

## 🧠 Core Graph Algorithms

### 1. Tarjan's Low-Link Algorithm (Bridges & Articulation Points)
To find critical connection pathways without running costly $O(V \cdot (V+E))$ node-removal algorithms, we use Tarjan's algorithm. By traversing the graph once in a Depth-First Search ($O(V+E)$ time), we track the discovery time (`disc`) and the lowest reachable discovery time (`low`) for each node:
- **Bridge Condition:** An edge $(u, v)$ is a bridge if and only if $low[v] > disc[u]$.
- **Articulation Point Condition:** A node $u$ is an articulation point if it is a root with $\ge 2$ children, or if it is not a root and has a child $v$ such that $low[v] \ge disc[u]$.

### 2. Heuristic Pathfinding (A* Search)
We optimize routing paths by incorporating geographic coordinates. The algorithm evaluates the total cost function:
$$f(n) = g(n) + h(n)$$
- $g(n)$ is the exact distance from the starting node to node $n$.
- $h(n)$ is the Euclidean distance heuristic from $n$ to the target destination.
This guided search significantly reduces the search space compared to unweighted Breadth-First Search.

---

## 🕹️ Live Demo & Usage

1. **Simulate Hub Failure:** Click any node in the interactive graph canvas. The node changes color to red (simulated offline status).
2. **Dynamic Recalculation:** The routing engine immediately runs Tarjan's algorithm to highlight new bridges (in yellow) and computes alternative A* paths.
3. **Wait-Time reduction:** View stats comparing BFS routing and A* routing (typically showing a **40%** decrease in node expansions).

---

## 🛠️ Tech Stack & Setup

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Graphics Engine:** HTML5 Canvas API with custom node/edge renderer
- **State Management:** React Context API for real-time algorithm configuration

### Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ThanujMaligi/Nexus-Global-Network-Resilience-Routing-Simulator.git
   cd Nexus-Global-Network-Resilience-Routing-Simulator
   ```

2. **Install Packages:**
   ```bash
   npm install
   ```

3. **Run Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the interactive analyzer.
