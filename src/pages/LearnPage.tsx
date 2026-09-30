import React, { useState } from 'react';
import { CaseVisualizer } from '../components/learn/CaseVisualizer';
import { LearnExplainer } from '../components/learn/LearnExplainer';
import { TreeCanvas } from '../components/visualizer/TreeCanvas';
import { OperationLog } from '../components/visualizer/OperationLog';
import { RedBlackTree } from '../algorithms/redBlackTree/RedBlackTree';
import {
  generateInsertEvents,
  generateDeleteEvents,
  AlgorithmEvent,
} from '../algorithms/redBlackTree/events';
import { BookOpen, GraduationCap, Table } from 'lucide-react';

export const LearnPage: React.FC = () => {
  const [activeEvents, setActiveEvents] = useState<AlgorithmEvent[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Initialize a demo case on load
  const handleLoadCase = (
    setupValues: number[],
    triggerValue: number,
    isDelete: boolean
  ) => {
    const demoTree = new RedBlackTree();
    setupValues.forEach((v) => demoTree.insert(v));

    let events: AlgorithmEvent[] = [];
    if (isDelete) {
      events = generateDeleteEvents(demoTree, triggerValue);
    } else {
      events = generateInsertEvents(demoTree, triggerValue);
    }

    setActiveEvents(events);
    setStepIndex(0);
  };

  const currentEvent = activeEvents[stepIndex] || null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-2xl border border-[#1e2638] bg-gradient-to-r from-[#0c101a] via-[#111624] to-[#0c101a] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <GraduationCap size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Learning Laboratory & DAA Theory
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive reference for Design & Analysis of Algorithms students studying self-balancing trees.
            </p>
          </div>
        </div>
      </div>

      {/* Case Visualizer Encyclopedia */}
      <CaseVisualizer onLoadCase={handleLoadCase} />

      {/* Interactive Case Simulator Canvas (Appears when a case is loaded) */}
      {activeEvents.length > 0 && (
        <div className="p-5 rounded-xl border border-blue-500/30 bg-[#0c101a] space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">
                Live Case Simulator: Step {stepIndex + 1} of {activeEvents.length}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-200 transition-colors"
              >
                Previous Step
              </button>
              <button
                onClick={() => setStepIndex((i) => Math.min(activeEvents.length - 1, i + 1))}
                disabled={stepIndex >= activeEvents.length - 1}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xs font-semibold text-white transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <TreeCanvas
                treeSnapshot={currentEvent?.treeSnapshot ?? null}
                highlightRoles={currentEvent?.highlightRoles ?? {}}
              />
            </div>
            <div className="lg:col-span-4">
              <OperationLog
                events={activeEvents}
                currentStepIndex={stepIndex}
                onSelectStep={(idx) => setStepIndex(idx)}
              />
            </div>
          </div>

          <LearnExplainer
            why={currentEvent?.educationalWhy ?? null}
            stepTitle={currentEvent?.title}
          />
        </div>
      )}

      {/* DAA Algorithm Complexity Comparison Table */}
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-[#1e2638] pb-3">
          <Table size={16} className="text-purple-400" />
          <h3 className="text-sm font-bold text-white">
            Theoretical Complexity Comparison (BST vs AVL vs Red-Black Tree)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#1e2638] text-slate-400 font-mono">
                <th className="py-2.5 px-3">Data Structure</th>
                <th className="py-2.5 px-3">Search (Average)</th>
                <th className="py-2.5 px-3">Search (Worst)</th>
                <th className="py-2.5 px-3">Insert (Worst)</th>
                <th className="py-2.5 px-3">Delete (Worst)</th>
                <th className="py-2.5 px-3">Max Rotations / Op</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182032] font-mono text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">
                  Standard BST
                </td>
                <td className="py-2.5 px-3 text-emerald-400">O(log n)</td>
                <td className="py-2.5 px-3 text-red-400 font-bold">O(n) [Skewed]</td>
                <td className="py-2.5 px-3 text-red-400 font-bold">O(n)</td>
                <td className="py-2.5 px-3 text-red-400 font-bold">O(n)</td>
                <td className="py-2.5 px-3 text-slate-500">None (Unbalanced)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">
                  AVL Tree
                </td>
                <td className="py-2.5 px-3 text-emerald-400">O(log n)</td>
                <td className="py-2.5 px-3 text-emerald-400">O(log n) [Strict 1.44 log n]</td>
                <td className="py-2.5 px-3 text-emerald-400">O(log n)</td>
                <td className="py-2.5 px-3 text-emerald-400">O(log n)</td>
                <td className="py-2.5 px-3 text-amber-400">O(log n) for deletion</td>
              </tr>
              <tr className="hover:bg-slate-900/40 bg-red-950/10">
                <td className="py-2.5 px-3 font-sans font-semibold text-red-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Red-Black Tree
                </td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(log n)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(log n) [Max 2 log n]</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(log n)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(log n)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">
                  ≤ 2 (Insert), ≤ 3 (Delete)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-[#1e2638]">
          <strong className="text-slate-300">Why Red-Black Trees are preferred for OS kernels and standard libraries:</strong>{' '}
          While AVL trees maintain a stricter balance (resulting in slightly faster lookups), Red-Black Trees require at most 2 rotations on insertion and at most 3 rotations on deletion, making them faster for insert/delete-heavy workloads (e.g. Linux CFS, C++ std::map, Java TreeMap).
        </p>
      </div>

      {/* University DAA Quick Study Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[#1e2638] bg-[#0c101a] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <BookOpen size={14} className="text-blue-400" />
            <span>Black Height Invariant</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The black height <code className="text-blue-300">bh(x)</code> is the number of black nodes on any path from node x down to a leaf (not counting x). If a node has black height k, its subtree contains at least <code className="text-blue-300">2^k - 1</code> internal nodes.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#1e2638] bg-[#0c101a] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <BookOpen size={14} className="text-red-400" />
            <span>Red-Red Invariant</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Because no two RED nodes can appear consecutively, the longest simple path in a Red-Black Tree is at most twice the length of the shortest path. Hence the height <code className="text-red-300">h ≤ 2 log2(n + 1)</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#1e2638] bg-[#0c101a] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <BookOpen size={14} className="text-purple-400" />
            <span>Rotations Invariant</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rotations preserve BST inorder traversal <code className="text-purple-300">(Left &lt; Root &lt; Right)</code> while altering pointer heights. They take strictly <code className="text-purple-300">O(1)</code> time using a fixed number of pointer exchanges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
