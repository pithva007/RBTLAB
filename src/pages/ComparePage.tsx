import React, { useState, useMemo } from 'react';
import { BinarySearchTree } from '../algorithms/bst/BinarySearchTree';
import { RedBlackTree } from '../algorithms/redBlackTree/RedBlackTree';
import { TreeComparisonView } from '../components/compare/TreeComparisonView';
import { generateDataset, DatasetPresetType, PRESET_DATASETS } from '../utils/datasets';
import { GitCompare, Layers, Search, RotateCw, Clock, ArrowRight } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<DatasetPresetType>('ascending');
  const [nodeCount, setNodeCount] = useState<number>(10);
  const [customInput, setCustomInput] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);

  // Parse active dataset
  const dataset = useMemo(() => {
    if (useCustom) {
      return customInput
        .split(/[,\s]+/)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
    }
    return generateDataset(selectedPreset, {
      count: nodeCount,
      min: 10,
      max: nodeCount * 10,
    });
  }, [selectedPreset, nodeCount, useCustom, customInput]);

  // Execute both algorithms on dataset
  const simulation = useMemo(() => {
    const bst = new BinarySearchTree();
    const rbt = new RedBlackTree();

    const t0 = performance.now();
    dataset.forEach((v) => bst.insert(v));
    const bstInsertTime = performance.now() - t0;

    const t1 = performance.now();
    dataset.forEach((v) => rbt.insert(v));
    const rbtInsertTime = performance.now() - t1;

    // Search query on median element or last element (stress search)
    const target = dataset[dataset.length - 1] ?? 50;
    const bstSearch = bst.search(target);
    const rbtSearch = rbt.search(target);

    const bstStats = bst.getStatistics();
    const rbtStats = rbt.getStatistics();

    return {
      bstSnapshot: bst.getState(),
      rbtSnapshot: rbt.getState(),
      bstHeight: bstStats.height,
      rbtHeight: rbtStats.height,
      bstComparisons: bstStats.comparisons,
      rbtComparisons: rbtStats.comparisons,
      bstSearchComparisons: bstSearch.comparisons,
      rbtSearchComparisons: rbtSearch.comparisons,
      rbtRotations: rbtStats.rotations,
      rbtRecolorings: rbtStats.recolorings,
      bstInsertTime,
      rbtInsertTime,
    };
  }, [dataset]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-[#1e2638] bg-gradient-to-r from-[#0c101a] via-[#111624] to-[#0c101a] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <GitCompare size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              BST vs. Red-Black Tree Comparison Laboratory
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirically analyze how ordered datasets degrade standard BSTs into O(n) skewed lines while Red-Black Trees maintain strict O(log n) height.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Controls Card */}
      <div className="p-4 rounded-xl border border-[#1e2638] bg-[#0c101a] shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 mr-1">Presets:</span>
            {PRESET_DATASETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPreset(p.id);
                  setUseCustom(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                  !useCustom && selectedPreset === p.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-[#111624] text-slate-400 border-[#222b40] hover:bg-[#151c30] hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Node Count Slider */}
          {!useCustom && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Node Count:</span>
              <input
                type="range"
                min="5"
                max="25"
                value={nodeCount}
                onChange={(e) => setNodeCount(parseInt(e.target.value, 10))}
                className="w-28 accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs text-slate-200 font-bold w-6 text-right">
                {nodeCount}
              </span>
            </div>
          )}
        </div>

        {/* Custom Input Option */}
        <div className="pt-2 border-t border-[#182032] flex flex-wrap items-center gap-3">
          <button
            onClick={() => setUseCustom(!useCustom)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border ${
              useCustom
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            Custom Dataset
          </button>

          {useCustom ? (
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 10, 20, 30, 40, 50, 60, 70"
              className="flex-1 px-3 py-1 rounded border border-[#222b40] bg-[#111624] text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            />
          ) : (
            <span className="text-xs font-mono text-slate-500 truncate">
              Dataset preview: [{dataset.slice(0, 10).join(', ')}{dataset.length > 10 ? '...' : ''}]
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Tree Visualization */}
      <TreeComparisonView
        bstSnapshot={simulation.bstSnapshot}
        rbtSnapshot={simulation.rbtSnapshot}
        bstHeight={simulation.bstHeight}
        rbtHeight={simulation.rbtHeight}
        bstComparisons={simulation.bstComparisons}
        rbtComparisons={simulation.rbtComparisons}
        datasetName={useCustom ? 'Custom Array' : selectedPreset}
      />

      {/* Experimental Metrics Comparison Grid */}
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Empirical Performance Benchmark Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Height Card */}
          <div className="p-3.5 rounded-lg border border-[#1e2638] bg-[#111624]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Tree Height</span>
              <Layers size={14} className="text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-lg font-bold font-mono text-slate-300">
                  {simulation.bstHeight}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">BST (No Rotations)</div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {simulation.rbtHeight}
                </div>
                <div className="text-[10px] text-emerald-500 uppercase font-mono">Red-Black Tree</div>
              </div>
            </div>
          </div>

          {/* Worst Search Comparisons */}
          <div className="p-3.5 rounded-lg border border-[#1e2638] bg-[#111624]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Search Comparisons</span>
              <Search size={14} className="text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-lg font-bold font-mono text-slate-300">
                  {simulation.bstSearchComparisons}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">BST Traversal</div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {simulation.rbtSearchComparisons}
                </div>
                <div className="text-[10px] text-emerald-500 uppercase font-mono">RBT Traversal</div>
              </div>
            </div>
          </div>

          {/* Rotations & Recolorings */}
          <div className="p-3.5 rounded-lg border border-[#1e2638] bg-[#111624]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Balancing Work</span>
              <RotateCw size={14} className="text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-lg font-bold font-mono text-slate-300">0</div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Rotations in BST</div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-purple-300">
                  {simulation.rbtRotations}
                </div>
                <div className="text-[10px] text-purple-400 uppercase font-mono">
                  {simulation.rbtRecolorings} Recolorings
                </div>
              </div>
            </div>
          </div>

          {/* Microsecond Timing */}
          <div className="p-3.5 rounded-lg border border-[#1e2638] bg-[#111624]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Client Execution Time</span>
              <Clock size={14} className="text-cyan-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-lg font-bold font-mono text-slate-300">
                  {simulation.bstInsertTime.toFixed(2)} ms
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">BST Insertion</div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-cyan-300">
                  {simulation.rbtInsertTime.toFixed(2)} ms
                </div>
                <div className="text-[10px] text-cyan-500 uppercase font-mono">RBT Insertion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
