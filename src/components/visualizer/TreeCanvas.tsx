import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SerializedRBNode } from '../../algorithms/redBlackTree/types';
import { HighlightRoles } from '../../algorithms/redBlackTree/events';
import { computeTreeLayout, LayoutNode } from '../../utils/treeLayout';
import { TreeNode } from './TreeNode';
import { TreeEdge } from './TreeEdge';
import { ZoomIn, ZoomOut, Maximize2, Eye, EyeOff } from 'lucide-react';

interface TreeCanvasProps {
  treeSnapshot: SerializedRBNode | null;
  highlightRoles?: HighlightRoles;
  onNodeClick?: (node: LayoutNode) => void;
  showNilLeavesInitial?: boolean;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  treeSnapshot,
  highlightRoles = {},
  onNodeClick,
  showNilLeavesInitial = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNilLeaves, setShowNilLeaves] = useState(showNilLeavesInitial);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Compute layout
  const layout = useMemo(() => {
    return computeTreeLayout(treeSnapshot, {
      showNilLeaves,
      roles: highlightRoles,
      nodeRadius: 22,
      levelHeight: 76,
      minSpacing: 60,
    });
  }, [treeSnapshot, showNilLeaves, highlightRoles]);

  // Center tree when snapshot changes
  useEffect(() => {
    if (containerRef.current && layout.nodes.length > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const treeCenterX = (layout.bounds.minX + layout.bounds.maxX) / 2;
      const initialPanX = containerWidth / 2 - treeCenterX;
      setPan({ x: initialPanX, y: 30 });
    }
  }, [layout.bounds.minX, layout.bounds.maxX, layout.nodes.length]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));
  const handleResetView = () => {
    setZoom(1);
    if (containerRef.current && layout.nodes.length > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const treeCenterX = (layout.bounds.minX + layout.bounds.maxX) / 2;
      setPan({ x: containerWidth / 2 - treeCenterX, y: 30 });
    } else {
      setPan({ x: 0, y: 0 });
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.min(Math.max(z + zoomDelta, 0.4), 2.5));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] rounded-xl border border-[#1e2638] bg-[#090d16] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onWheel={handleWheel}
      role="region"
      aria-label="Interactive Red-Black Tree Canvas"
    >
      {/* Background Blueprint Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#334155" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-lg bg-[#0e1320]/90 backdrop-blur border border-[#1e2638] shadow-lg">
        <button
          onClick={() => setShowNilLeaves(!showNilLeaves)}
          className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
            showNilLeaves
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={showNilLeaves ? 'Hide NIL sentinels' : 'Show NIL sentinels'}
        >
          {showNilLeaves ? <Eye size={13} /> : <EyeOff size={13} />}
          <span className="font-mono text-[11px]">NIL</span>
        </button>

        <div className="w-px h-4 bg-slate-800 mx-0.5" />

        <button
          onClick={handleZoomIn}
          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition-colors"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition-colors"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={handleResetView}
          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition-colors"
          title="Reset View"
          aria-label="Reset viewport"
        >
          <Maximize2 size={14} />
        </button>

        <span className="px-2 font-mono text-[11px] text-slate-400">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Empty State Overlay */}
      {layout.nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xl mb-3 shadow-inner">
            ∅
          </div>
          <h3 className="text-slate-200 font-semibold text-sm">Empty Tree</h3>
          <p className="text-slate-500 text-xs max-w-xs mt-1">
            Insert a number or generate a dataset to visualize the Red-Black Tree.
          </p>
        </div>
      )}

      {/* Main Interactive SVG Canvas */}
      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* Render Edges */}
        <g className="edges-layer">
          {layout.edges.map((edge) => (
            <TreeEdge key={edge.id} edge={edge} />
          ))}
        </g>

        {/* Render Nodes */}
        <g className="nodes-layer">
          {layout.nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              onNodeClick={onNodeClick}
              radius={22}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default TreeCanvas;
