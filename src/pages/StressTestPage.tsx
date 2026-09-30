import React, { useState } from 'react';
import { RedBlackTree } from '../algorithms/redBlackTree/RedBlackTree';
import { BinarySearchTree } from '../algorithms/bst/BinarySearchTree';
import { generateDataset, DatasetPresetType } from '../utils/datasets';
import { PerformanceCharts, BenchmarkPoint } from '../components/stress/PerformanceCharts';
import {
  Activity,
  Play,
  Info,
  Scale,
  Cpu,
  Layers,
  Search,
  RotateCw,
} from 'lucide-react';

export type StressOperation = 'INSERT_ALL' | 'DELETE_ALL' | 'MIXED' | 'SEARCH_BENCHMARK';

export const StressTestPage: React.FC = () => {
  const [maxNodes, setMaxNodes] = useState<number>(1000);
  const [datasetType, setDatasetType] = useState<DatasetPresetType>('random');
  const [operationType, setOperationType] = useState<StressOperation>('INSERT_ALL');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkPoint[]>([]);
  const [summaryStats, setSummaryStats] = useState<{
    totalNodes: number;
    finalRbtHeight: number;
    finalBstHeight: number;
    totalRotations: number;
    totalRecolorings: number;
    totalComparisons: number;
    timeMs: number;
  } | null>(null);

  const nodeScaleOptions = [10, 100, 500, 1000, 5000, 10000];

  const runBenchmark = () => {
    setIsRunning(true);

    // Run asynchronously to allow UI to render loading state
    setTimeout(() => {
      // Determine sample progression intervals up to maxNodes
      const intervals: number[] = [];
      if (maxNodes <= 100) {
        for (let i = 10; i <= maxNodes; i += Math.max(10, Math.floor(maxNodes / 5))) {
          intervals.push(i);
        }
      } else if (maxNodes <= 1000) {
        intervals.push(10, 50, 100, 250, 500, 750, 1000);
      } else {
        intervals.push(10, 100, 500, 1000, 2500, 5000, maxNodes);
      }

      const points: BenchmarkPoint[] = [];
      let finalRbtH = 0;
      let finalBstH = 0;
      let finalRotations = 0;
      let finalRecolorings = 0;
      let finalComparisons = 0;
      let totalExecutionMs = 0;

      for (const n of intervals) {
        const rawData = generateDataset(datasetType, {
          count: n,
          min: 1,
          max: n * 10,
          seed: 42 + n,
          allowDuplicates: datasetType === 'duplicate_heavy',
        });

        const rbt = new RedBlackTree();
        const bst = new BinarySearchTree();

        // 1. RBT execution
        const t0 = performance.now();
        if (operationType === 'INSERT_ALL' || operationType === 'SEARCH_BENCHMARK') {
          for (let i = 0; i < rawData.length; i++) {
            rbt.insert(rawData[i]);
          }
        } else if (operationType === 'DELETE_ALL') {
          for (let i = 0; i < rawData.length; i++) rbt.insert(rawData[i]);
          for (let i = 0; i < rawData.length; i++) rbt.delete(rawData[i]);
        } else if (operationType === 'MIXED') {
          for (let i = 0; i < rawData.length; i++) {
            rbt.insert(rawData[i]);
            if (i % 2 === 0 && i > 0) {
              rbt.delete(rawData[i - 1]);
            }
          }
        }

        if (operationType === 'SEARCH_BENCHMARK') {
          for (let i = 0; i < rawData.length; i++) {
            rbt.search(rawData[i]);
          }
        }
        const rbtTime = performance.now() - t0;

        // 2. BST execution (capped on large ascending datasets to prevent call stack overflow)
        let bstTime = 0;
        let bstH = 0;
        let bstComp = 0;

        if (n <= 2500 || datasetType !== 'ascending') {
          const tb0 = performance.now();
          if (operationType === 'INSERT_ALL' || operationType === 'SEARCH_BENCHMARK') {
            for (let i = 0; i < rawData.length; i++) bst.insert(rawData[i]);
          } else if (operationType === 'DELETE_ALL') {
            for (let i = 0; i < rawData.length; i++) bst.insert(rawData[i]);
            for (let i = 0; i < rawData.length; i++) bst.delete(rawData[i]);
          } else if (operationType === 'MIXED') {
            for (let i = 0; i < rawData.length; i++) {
              bst.insert(rawData[i]);
              if (i % 2 === 0 && i > 0) bst.delete(rawData[i - 1]);
            }
          }
          if (operationType === 'SEARCH_BENCHMARK') {
            for (let i = 0; i < rawData.length; i++) bst.search(rawData[i]);
          }
          bstTime = performance.now() - tb0;
          bstH = bst.getHeight();
          bstComp = bst.getStatistics().comparisons;
        } else {
          // Extrapolate for skewed BST
          bstH = n;
          bstComp = (n * (n + 1)) / 2;
          bstTime = 0;
        }

        const rbtStats = rbt.getStatistics();
        const theoreticalMaxHeight = Math.ceil(2 * Math.log2(n + 1));

        points.push({
          nodes: n,
          bstHeight: bstH,
          rbtHeight: rbtStats.height,
          theoreticalMaxHeight,
          bstComparisons: bstComp,
          rbtComparisons: rbtStats.comparisons,
          rotations: rbtStats.rotations,
          recolorings: rbtStats.recolorings,
          rbtTimeMs: parseFloat(rbtTime.toFixed(2)),
          bstTimeMs: parseFloat(bstTime.toFixed(2)),
        });

        if (n === maxNodes) {
          finalRbtH = rbtStats.height;
          finalBstH = bstH;
          finalRotations = rbtStats.rotations;
          finalRecolorings = rbtStats.recolorings;
          finalComparisons = rbtStats.comparisons;
          totalExecutionMs = rbtTime;
        }
      }

      setBenchmarkData(points);
      setSummaryStats({
        totalNodes: maxNodes,
        finalRbtHeight: finalRbtH,
        finalBstHeight: finalBstH,
        totalRotations: finalRotations,
        totalRecolorings: finalRecolorings,
        totalComparisons: finalComparisons,
        timeMs: totalExecutionMs,
      });
      setIsRunning(false);
    }, 50);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-[#1e2638] bg-gradient-to-r from-[#0c101a] via-[#111624] to-[#0c101a] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Activity size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Stress Test & Performance Laboratory
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical algorithmic benchmarking across scaling dataset sizes up to 10,000 nodes.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Scientific Disclaimer */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 text-slate-300 text-xs space-y-2">
        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[11px]">
          <Info size={15} />
          <span>Scientific Distinction: Theoretical Complexity vs. Experimental Performance</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 leading-relaxed">
          <div className="p-2.5 rounded-lg bg-[#0c101a] border border-[#1e2638]">
            <strong className="text-blue-300 block mb-0.5">THEORETICAL COMPLEXITY</strong>
            Strict mathematical bounds: Red-Black Trees guarantee height <code className="text-blue-300">h ≤ 2·log₂(n + 1)</code>, search in <code className="text-blue-300">O(log n)</code>, at most 2 rotations on insert, and at most 3 rotations on delete. These asymptotic invariants are mathematically immutable.
          </div>
          <div className="p-2.5 rounded-lg bg-[#0c101a] border border-[#1e2638]">
            <strong className="text-cyan-300 block mb-0.5">OBSERVED EXPERIMENTAL PERFORMANCE</strong>
            Physical JavaScript execution times (milliseconds) reflect browser V8 engine optimizations, memory allocations, garbage collection cycles, and CPU clock frequencies. We chart both operation counts and client runtimes to reflect true algorithmic rigor.
          </div>
        </div>
      </div>

      {/* Benchmark Configuration Panel */}
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
          <Cpu size={16} className="text-red-400" />
          Benchmark Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Node Count Scale */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Maximum Scale (Nodes):
            </label>
            <div className="grid grid-cols-3 gap-1.5 font-mono">
              {nodeScaleOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setMaxNodes(n)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    maxNodes === n
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-[#111624] text-slate-400 border-[#222b40] hover:bg-[#151c30] hover:text-slate-200'
                  }`}
                >
                  {n.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Dataset Distribution */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Dataset Distribution:
            </label>
            <div className="space-y-1">
              {[
                { id: 'random', label: 'Random Distribution' },
                { id: 'ascending', label: 'Ascending (1..N)' },
                { id: 'descending', label: 'Descending (N..1)' },
                { id: 'nearly_sorted', label: 'Nearly Sorted' },
                { id: 'duplicate_heavy', label: 'Duplicate Heavy' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDatasetType(d.id as DatasetPresetType)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    datasetType === d.id
                      ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                      : 'bg-[#111624] text-slate-400 border-[#222b40] hover:bg-[#151c30] hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operation Suite */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Operation Suite:
              </label>
              <div className="space-y-1">
                {[
                  { id: 'INSERT_ALL', label: 'Insert All Keys' },
                  { id: 'DELETE_ALL', label: 'Insert All, Then Delete All' },
                  { id: 'MIXED', label: 'Mixed 50/50 Insert & Delete' },
                  { id: 'SEARCH_BENCHMARK', label: 'Search All Keys Benchmark' },
                ].map((op) => (
                  <button
                    key={op.id}
                    onClick={() => setOperationType(op.id as StressOperation)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      operationType === op.id
                        ? 'bg-purple-600 text-white border-purple-500 font-semibold'
                        : 'bg-[#111624] text-slate-400 border-[#222b40] hover:bg-[#151c30] hover:text-slate-200'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all"
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Multi-Scale Benchmarks...</span>
                </>
              ) : (
                <>
                  <Play size={15} />
                  <span>Run Benchmark Laboratory ({maxNodes.toLocaleString()} Nodes)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Telemetry Metrics */}
      {summaryStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl border border-[#1e2638] bg-[#0c101a] shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Final RBT Height</span>
              <Layers size={14} className="text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {summaryStats.finalRbtHeight}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              vs BST Height: {summaryStats.finalBstHeight}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1e2638] bg-[#0c101a] shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Rotations</span>
              <RotateCw size={14} className="text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-purple-400">
              {summaryStats.totalRotations.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              {summaryStats.totalRecolorings.toLocaleString()} Recolorings
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1e2638] bg-[#0c101a] shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Comparisons</span>
              <Search size={14} className="text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-blue-400">
              {summaryStats.totalComparisons.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              O(log n) bounded
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1e2638] bg-[#0c101a] shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Observed Run Time</span>
              <Scale size={14} className="text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {summaryStats.timeMs.toFixed(1)} ms
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              V8 Client In-Memory
            </div>
          </div>
        </div>
      )}

      {/* Performance Charts */}
      {benchmarkData.length > 0 && (
        <PerformanceCharts data={benchmarkData} />
      )}
    </div>
  );
};

export default StressTestPage;
