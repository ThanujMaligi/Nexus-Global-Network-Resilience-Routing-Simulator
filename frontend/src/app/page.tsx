'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { 
  Node, 
  Edge, 
  generatorTarjan, 
  generatorAStar, 
  generatorBFS, 
  getGraphStats,
  AlgorithmStep
} from '../lib/algorithms';

// --- REAL-WORLD TIER-1 BACKBONE DATASET ---
const INITIAL_NODES: Node[] = [
  { id: 'NYC', label: 'New York', x: 180, y: 240, active: true },
  { id: 'LAX', label: 'Los Angeles', x: 80, y: 280, active: true },
  { id: 'CHI', label: 'Chicago', x: 140, y: 220, active: true },
  { id: 'LON', label: 'London', x: 380, y: 160, active: true },
  { id: 'FRA', label: 'Frankfurt', x: 430, y: 180, active: true },
  { id: 'AMS', label: 'Amsterdam', x: 410, y: 165, active: true },
  { id: 'PAR', label: 'Paris', x: 400, y: 190, active: true },
  { id: 'DXB', label: 'Dubai', x: 550, y: 350, active: true },
  { id: 'SIN', label: 'Singapore', x: 720, y: 520, active: true },
  { id: 'HKG', label: 'Hong Kong', x: 750, y: 400, active: true },
  { id: 'TKO', label: 'Tokyo', x: 880, y: 280, active: true },
  { id: 'SYD', label: 'Sydney', x: 920, y: 580, active: true },
  { id: 'BOM', label: 'Mumbai', x: 620, y: 420, active: true },
  { id: 'GRU', label: 'Sao Paulo', x: 280, y: 550, active: true },
  { id: 'CPT', label: 'Cape Town', x: 450, y: 580, active: true },
  { id: 'SFO', label: 'San Francisco', x: 60, y: 260, active: true },
];

const INITIAL_EDGES: Edge[] = [
  { id: 'E1', source: 'NYC', target: 'LON', weight: 5585, active: true },
  { id: 'E2', source: 'NYC', target: 'PAR', weight: 5837, active: true },
  { id: 'E3', source: 'LON', target: 'FRA', weight: 637, active: true },
  { id: 'E4', source: 'FRA', target: 'AMS', weight: 360, active: true },
  { id: 'E5', source: 'AMS', target: 'LON', weight: 350, active: true },
  { id: 'E6', source: 'NYC', target: 'CHI', weight: 1140, active: true },
  { id: 'E7', source: 'CHI', target: 'SFO', weight: 3000, active: true },
  { id: 'E8', source: 'SFO', target: 'LAX', weight: 560, active: true },
  { id: 'E9', source: 'LAX', target: 'NYC', weight: 3900, active: true },
  { id: 'E10', source: 'LAX', target: 'TKO', weight: 8800, active: true },
  { id: 'E11', source: 'SFO', target: 'TKO', weight: 8200, active: true },
  { id: 'E12', source: 'TKO', target: 'HKG', weight: 2800, active: true },
  { id: 'E13', source: 'HKG', target: 'SIN', weight: 2500, active: true },
  { id: 'E14', source: 'SIN', target: 'SYD', weight: 6300, active: true },
  { id: 'E15', source: 'SIN', target: 'BOM', weight: 3900, active: true },
  { id: 'E16', source: 'BOM', target: 'DXB', weight: 1900, active: true },
  { id: 'E17', source: 'DXB', target: 'FRA', weight: 4800, active: true },
  { id: 'E18', source: 'DXB', target: 'CPT', weight: 7000, active: true },
  { id: 'E19', source: 'CPT', target: 'GRU', weight: 8000, active: true },
  { id: 'E20', source: 'GRU', target: 'NYC', weight: 7600, active: true },
  { id: 'E21', source: 'NYC', target: 'BOM', weight: 12500, active: true },
  { id: 'E22', source: 'LON', target: 'DXB', weight: 5500, active: true },
];

export default function NexusDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const algoTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  
  const [activeAlgorithm, setActiveAlgorithm] = useState<string>('None');
  const [activeMode, setActiveMode] = useState<'Path' | 'Analysis'>('Path');
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] NEXUS Global Backbone Online. All nodes synchronized.']);
  const [editMode, setEditMode] = useState<'None' | 'Relocate'>('None');
  const [sourceNodeId, setSourceNodeId] = useState<string | null>('NYC');
  const [targetNodeId, setTargetNodeId] = useState<string | null>('TKO');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  
  // Performance Metrics
  const [metrics, setMetrics] = useState({ ops: 0, startTime: 0, duration: 0 });
  
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightEdges, setHighlightEdges] = useState<Set<string>>(new Set());
  const [discoveryTimes, setDiscoveryTimes] = useState<Map<string, number>>(new Map());
  const [lowLinks, setLowLinks] = useState<Map<string, number>>(new Map());
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [pathNodes, setPathNodes] = useState<string[]>([]);

  const stats = useMemo(() => getGraphStats(nodes, edges), [nodes, edges]);

  const complexityMap: Record<string, string> = {
    'A*': 'O(E log V)',
    'BFS': 'O(V + E)',
    'Tarjan': 'O(V + E)',
    'None': '--'
  };

  const stopAlgorithm = useCallback(() => {
    if (algoTimerRef.current) {
      clearInterval(algoTimerRef.current);
      algoTimerRef.current = null;
    }
    setCurrentNodeId(null);
    setHighlightNodes(new Set());
    setHighlightEdges(new Set());
    setDiscoveryTimes(new Map());
    setLowLinks(new Map());
    setPathNodes([]);
    setActiveAlgorithm('None');
    setMetrics({ ops: 0, startTime: 0, duration: 0 });
  }, []);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev, msg].slice(-100));
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target) return;
      
      let strokeColor = '#1e293b';
      let lineWidth = 1;

      if (activeMode === 'Path') {
        const idxS = pathNodes.indexOf(source.id);
        const idxT = pathNodes.indexOf(target.id);
        if (idxS !== -1 && idxT !== -1 && Math.abs(idxS - idxT) === 1) {
          strokeColor = '#10b981';
          lineWidth = 4;
        } else {
          strokeColor = '#334155';
        }
      } else if (activeMode === 'Analysis') {
        if (highlightEdges.has(edge.id)) {
          strokeColor = '#f59e0b';
          lineWidth = 3;
        } else {
          strokeColor = '#334155';
        }
      }

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    });

    nodes.forEach((node) => {
      const isHovered = hoveredNodeId === node.id;
      const isCurrent = currentNodeId === node.id;
      const isSource = sourceNodeId === node.id;
      const isTarget = targetNodeId === node.id;

      let fillColor = '#0f172a';
      let strokeColor = '#475569';
      let radius = 12;

      if (activeMode === 'Path') {
        if (isSource) { fillColor = '#10b981'; strokeColor = '#34d399'; radius = 16; }
        else if (isTarget) { fillColor = '#f59e0b'; strokeColor = '#fbbf24'; radius = 16; }
        else if (isCurrent) { fillColor = '#3b82f6'; strokeColor = '#fff'; radius = 18; }
        else if (pathNodes.includes(node.id)) { fillColor = '#1e293b'; strokeColor = '#3b82f6'; }
      } else if (activeMode === 'Analysis') {
        const isAP = highlightNodes.has(node.id) && activeAlgorithm === 'Tarjan';
        if (isAP) { fillColor = '#ef4444'; strokeColor = '#f87171'; radius = 16; }
        else if (isCurrent) { fillColor = '#3b82f6'; strokeColor = '#fff'; radius = 18; }
        else if (highlightNodes.has(node.id)) { fillColor = '#1e293b'; strokeColor = '#3b82f6'; }
      }
      if (isHovered) { strokeColor = '#818cf8'; }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = `bold 10px 'Inter'`;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + (radius + 15));
    });
  }, [nodes, edges, highlightNodes, highlightEdges, pathNodes, currentNodeId, hoveredNodeId, activeMode, sourceNodeId, targetNodeId, activeAlgorithm]);

  useEffect(() => {
    draw();
  }, [draw]);

  const startAlgo = (type: string) => {
    stopAlgorithm();
    setActiveAlgorithm(type);
    const stTime = performance.now();
    setMetrics({ ops: 0, startTime: stTime, duration: 0 });

    let newGen;
    if (type === 'Tarjan') newGen = generatorTarjan(nodes, edges);
    else if (type === 'BFS') newGen = generatorBFS(nodes, edges, sourceNodeId!, targetNodeId!);
    else if (type === 'A*') newGen = generatorAStar(nodes, edges, sourceNodeId!, targetNodeId!);
    
    if (newGen) {
      algoTimerRef.current = setInterval(() => {
        const { done, value } = newGen.next();
        const currTime = performance.now();
        if (done) {
          if (algoTimerRef.current) clearInterval(algoTimerRef.current);
          if (value?.path) setPathNodes(value.path);
          setMetrics(prev => ({ ...prev, duration: currTime - prev.startTime }));
        } else {
          if (value.currentNode) setCurrentNodeId(value.currentNode);
          if (value.discoveryTimes) setDiscoveryTimes(new Map(value.discoveryTimes));
          if (value.lowLinks) setLowLinks(new Map(value.lowLinks));
          if (value.bridges) setHighlightEdges(new Set(value.bridges));
          if (value.articulationPoints) setHighlightNodes(new Set(value.articulationPoints));
          if (value.visitedNodes) setHighlightNodes(new Set(value.visitedNodes));
          if (value.path) setPathNodes(value.path);
          if (value.log) addLog(value.log);
          if (value.operationCount) setMetrics(prev => ({ ...prev, ops: value.operationCount!, duration: currTime - prev.startTime }));
        }
      }, 100);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedNode = nodes.find(n => Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2)) < 24);
    if (editMode === 'Relocate' && clickedNode) {
      setIsDragging(true);
      setDragNodeId(clickedNode.id);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragNodeId(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (isDragging && dragNodeId) {
      setNodes(prev => prev.map(n => n.id === dragNodeId ? { ...n, x, y } : n));
    }
    const hovered = nodes.find(n => Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2)) < 24);
    setHoveredNodeId(hovered?.id || null);
  };

  const reset = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    stopAlgorithm();
    setLogs(['[SYSTEM] Factory reset complete.']);
  };

  return (
    <main className="dashboard h-screen overflow-hidden flex flex-row bg-[#020617] text-slate-100 font-sans">
      <nav className="panel h-full flex flex-col border-r border-white/5 bg-[#0f172a]/40 backdrop-blur-xl w-80 min-w-[320px]">
        <header className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xl">N</div>
            <h1 className="text-2xl font-black uppercase italic">NEXUS</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl space-y-3">
             <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Performance HUD</div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <div className="text-[8px] text-slate-500 uppercase font-black">Operations</div>
                   <div className="text-lg font-mono font-black text-blue-100">{metrics.ops}</div>
                </div>
                <div>
                   <div className="text-[8px] text-slate-500 uppercase font-black">Time Complexity</div>
                   <div className="text-lg font-mono font-black text-blue-400">{complexityMap[activeAlgorithm]}</div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5">
                <button onClick={() => { setActiveMode('Path'); stopAlgorithm(); }} className={`flex-1 py-1 text-[10px] font-black uppercase rounded-lg transition ${activeMode === 'Path' ? 'bg-blue-600' : 'text-slate-500'}`}>Route</button>
                <button onClick={() => { setActiveMode('Analysis'); stopAlgorithm(); }} className={`flex-1 py-1 text-[10px] font-black uppercase rounded-lg transition ${activeMode === 'Analysis' ? 'bg-blue-600' : 'text-slate-500'}`}>Analysis</button>
             </div>
             
             <div className="grid grid-cols-1 gap-2">
                {activeMode === 'Path' ? (
                  <>
                    <button className="btn btn-secondary" onClick={() => startAlgo('A*')}>A* Global Routing</button>
                    <button className="btn btn-secondary" onClick={() => startAlgo('BFS')}>Shortest Hop (BFS)</button>
                  </>
                ) : (
                  <button className="btn btn-secondary" onClick={() => startAlgo('Tarjan')}>Tarjan Resilience</button>
                )}
             </div>
          </div>
        </div>

        <div className="p-6 pt-2 border-t border-white/5 bg-black/20 font-mono text-[9px] text-slate-400 h-48 overflow-y-auto" ref={terminalRef}>
            {logs.map((log, i) => <div key={i} className="mb-1 leading-tight">➜ {log}</div>)}
        </div>
      </nav>

      <section className="relative flex-1 bg-[#020617] overflow-hidden">
        <header className="absolute top-0 left-0 right-0 h-16 bg-[#0f172a]/60 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-8">
           <div className={`flex gap-4 transition-all duration-500 ${activeMode !== 'Path' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex flex-col">
                 <label className="text-[7px] font-black text-emerald-500 uppercase">Start Hub</label>
                 <select value={sourceNodeId || ''} onChange={(e) => setSourceNodeId(e.target.value)} className="bg-slate-900 text-[10px] rounded p-1">
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                 </select>
              </div>
              <div className="flex flex-col">
                 <label className="text-[7px] font-black text-amber-500 uppercase">End Hub</label>
                 <select value={targetNodeId || ''} onChange={(e) => setTargetNodeId(e.target.value)} className="bg-slate-900 text-[10px] rounded p-1">
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                 </select>
              </div>
           </div>
           <button className={`p-2 rounded text-[10px] ${editMode === 'Relocate' ? 'bg-blue-600' : 'bg-slate-800'}`} onClick={() => setEditMode(editMode === 'Relocate' ? 'None' : 'Relocate')}>Relocate Mode</button>
        </header>

        <canvas 
          ref={canvasRef} 
          onMouseDown={handleCanvasMouseDown} 
          onMouseUp={handleCanvasMouseUp} 
          onMouseMove={handleMouseMove} 
          className="w-full h-full cursor-crosshair pt-16" 
        />
        
        <div className="absolute bottom-8 right-8 bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-[8px] font-black uppercase text-slate-400">Stable Route</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"/> <span className="text-[8px] font-black uppercase text-slate-400">Critical AP</span></div>
        </div>
      </section>

      <style jsx global>{`
        .btn { padding: 0.7rem; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; transition: 0.3s; background: #0f172a; border: 1px solid #1e293b; color: #94a3b8; }
        .btn:hover { border-color: #3b82f6; color: white; }
        .grid-bg { background-image: radial-gradient(#1e293b 1px, transparent 1px); background-size: 30px 30px; }
      `}</style>
    </main>
  );
}
