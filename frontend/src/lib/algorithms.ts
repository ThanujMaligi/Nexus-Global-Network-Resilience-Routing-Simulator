export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  active?: boolean;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  active?: boolean;
}

export interface AlgorithmStep {
  currentNode?: string;
  visitedNodes?: string[];
  discoveryTimes?: Map<string, number>;
  lowLinks?: Map<string, number>;
  bridges?: string[];
  articulationPoints?: string[];
  path?: string[];
  frontier?: { id: string; g: number; h: number; f: number }[];
  connectedComponents?: number;
  log: string;
  operationCount?: number;
}

/**
 * Tarjan's Generator for step-by-step visualization.
 */
export function* generatorTarjan(nodes: Node[], edges: Edge[]) {
  const activeNodes = nodes.filter(n => n.active !== false);
  const activeEdges = edges.filter(e => e.active !== false);
  
  const adj = new Map<string, string[]>();
  activeNodes.forEach(n => adj.set(n.id, []));
  activeEdges.forEach(e => {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  });

  const discoveryTime = new Map<string, number>();
  const lowLink = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const visited = new Set<string>();
  const bridges: string[] = [];
  const articulationPoints = new Set<string>();
  let time = 0;
  let ops = 0;

  function* dfs(u: string): Generator<AlgorithmStep> {
    visited.add(u);
    discoveryTime.set(u, ++time);
    lowLink.set(u, time);
    let children = 0;
    ops++;

    yield {
      currentNode: u,
      discoveryTimes: new Map(discoveryTime),
      lowLinks: new Map(lowLink),
      log: `Visited ${u}. Discovery Time: ${time}`,
      operationCount: ops
    };

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      ops++;
      if (!visited.has(v)) {
        children++;
        parent.set(v, u);
        yield* dfs(v);

        lowLink.set(u, Math.min(lowLink.get(u)!, lowLink.get(v)!));
        
        yield {
          currentNode: u,
          discoveryTimes: new Map(discoveryTime),
          lowLinks: new Map(lowLink),
          log: `Backtracking to ${u}. Updated Low-link from ${v}.`,
          operationCount: ops
        };

        if (lowLink.get(v)! > discoveryTime.get(u)!) {
          const edgeId = edges.find(e => 
            (e.source === u && e.target === v) || (e.source === v && e.target === u)
          )?.id;
          if (edgeId) {
            bridges.push(edgeId);
            yield { bridges: [...bridges], log: `Found Bridge: ${u} - ${v}`, operationCount: ops };
          }
        }

        if (parent.get(u) !== null && lowLink.get(v)! >= discoveryTime.get(u)!) {
          articulationPoints.add(u);
          yield { articulationPoints: Array.from(articulationPoints), log: `Found Articulation Point: ${u}`, operationCount: ops };
        }
      } else if (v !== parent.get(u)) {
        lowLink.set(u, Math.min(lowLink.get(u)!, discoveryTime.get(v)!));
        yield {
          currentNode: u,
          lowLinks: new Map(lowLink),
          log: `Back-edge detected from ${u} to ${v}. Updated Low-link.`,
          operationCount: ops
        };
      }
    }

    if (parent.get(u) === null && children > 1) {
      articulationPoints.add(u);
      yield { articulationPoints: Array.from(articulationPoints), log: `Root ${u} is an Articulation Point (multiple children).`, operationCount: ops };
    }
  }

  for (const n of activeNodes) {
    if (!visited.has(n.id)) {
      yield* dfs(n.id);
    }
  }

  yield {
    bridges,
    articulationPoints: Array.from(articulationPoints),
    log: "Tarjan's Complete.",
    operationCount: ops
  };
}

/**
 * BFS Generator with Path Reconstruction.
 */
export function* generatorBFS(nodes: Node[], edges: Edge[], startId: string, targetId?: string) {
  const activeNodes = nodes.filter(n => n.active !== false);
  const activeEdges = edges.filter(e => e.active !== false);
  const adj = new Map<string, string[]>();
  activeNodes.forEach(n => adj.set(n.id, []));
  activeEdges.forEach(e => {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  });

  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: string[] = [startId];
  visited.add(startId);
  let ops = 0;

  while (queue.length > 0) {
    const u = queue.shift()!;
    ops++;
    yield {
      currentNode: u,
      visitedNodes: Array.from(visited),
      log: `BFS: Dequeued ${u}.`,
      operationCount: ops
    };

    if (targetId && u === targetId) {
      const path: string[] = [u];
      let curr = u;
      while (parent.has(curr)) {
        curr = parent.get(curr)!;
        path.unshift(curr);
      }
      yield { path, log: `BFS: Target ${targetId} reached!`, operationCount: ops };
      return;
    }

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      ops++;
      if (!visited.has(v)) {
        visited.add(v);
        parent.set(v, u);
        queue.push(v);
        yield {
          currentNode: v,
          visitedNodes: Array.from(visited),
          log: `BFS: Discovered ${v} via ${u}.`,
          operationCount: ops
        };
      }
    }
  }
}

/**
 * A* Generator.
 */
export function* generatorAStar(nodes: Node[], edges: Edge[], startId: string, endId: string) {
  const activeNodesMap = new Map(nodes.filter(n => n.active !== false).map(n => [n.id, n]));
  const activeEdges = edges.filter(e => e.active !== false);
  
  const startNode = activeNodesMap.get(startId);
  const endNode = activeNodesMap.get(endId);
  if (!startNode || !endNode) return;

  const heuristic = (a: Node, b: Node) => 
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  const openSet = new Set<string>([startId]);
  let ops = 0;

  nodes.forEach(n => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });

  gScore.set(startId, 0);
  fScore.set(startId, heuristic(startNode, endNode));

  while (openSet.size > 0) {
    let currentId = Array.from(openSet).reduce((a, b) => 
      fScore.get(a)! < fScore.get(b)! ? a : b
    );
    ops++;

    yield {
      currentNode: currentId,
      frontier: Array.from(openSet).map(id => ({
        id,
        g: gScore.get(id)!,
        h: heuristic(activeNodesMap.get(id)!, endNode),
        f: fScore.get(id)!
      })),
      log: `Expanding node ${currentId} (f=${fScore.get(currentId)?.toFixed(0)})`,
      operationCount: ops
    };

    if (currentId === endId) {
      const path: string[] = [currentId];
      let temp = currentId;
      while (cameFrom.has(temp)) {
        temp = cameFrom.get(temp)!;
        path.unshift(temp);
      }
      yield { path, log: "Path Found!", operationCount: ops };
      return;
    }

    openSet.delete(currentId);

    const neighbors = activeEdges.filter(e => e.source === currentId || e.target === currentId);
    for (const edge of neighbors) {
      ops++;
      const neighborId = edge.source === currentId ? edge.target : edge.source;
      const neighborNode = activeNodesMap.get(neighborId);
      if (!neighborNode) continue;

      const tentativeGScore = gScore.get(currentId)! + edge.weight;
      if (tentativeGScore < gScore.get(neighborId)!) {
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeGScore);
        fScore.set(neighborId, tentativeGScore + heuristic(neighborNode, endNode));
        openSet.add(neighborId);
      }
    }
  }
}

/**
 * Graph Statistics Utility.
 */
export const getGraphStats = (nodes: Node[], edges: Edge[]) => {
  const activeNodes = nodes.filter(n => n.active !== false);
  const activeEdges = edges.filter(e => e.active !== false);
  
  // DFS to find components
  const visited = new Set<string>();
  let components = 0;

  const adj = new Map<string, string[]>();
  activeNodes.forEach(n => adj.set(n.id, []));
  activeEdges.forEach(e => {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  });

  const dfs = (u: string) => {
    visited.add(u);
    adj.get(u)?.forEach(v => {
      if (!visited.has(v)) dfs(v);
    });
  };

  activeNodes.forEach(n => {
    if (!visited.has(n.id)) {
      components++;
      dfs(n.id);
    }
  });

  return {
    nodeCount: activeNodes.length,
    edgeCount: activeEdges.length,
    components,
    isConnected: components === 1 && activeNodes.length > 0
  };
};
