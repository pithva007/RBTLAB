import React from 'react';
import { SerializedRBNode } from '../../algorithms/redBlackTree/types';
import { TreeCanvas } from '../visualizer/TreeCanvas';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface TreeComparisonViewProps {
  bstSnapshot: SerializedRBNode | null;
  rbtSnapshot: SerializedRBNode | null;
  bstHeight: number;
  rbtHeight: number;
  bstComparisons: number;
  rbtComparisons: number;
  datasetName: string;
}

export const TreeComparisonView: React.FC<TreeComparisonViewProps> = ({
  bstSnapshot,
  rbtSnapshot,
  bstHeight,
  rbtHeight,
  bstComparisons,
  rbtComparisons,
  datasetName,
}) => {
  const isSkewed = bstHeight > rbtHeight * 1.5;
  const heightSavingPercent =
    bstHeight > 0 ? Math.round(((bstHeight - rbtHeight) / bstHeight) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Comparative Callout Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 shadow-lg ${
          isSkewed
            ? 'border-amber-500/30 bg-amber-950/20 text-amber-200'
            : 'border-blue-500/30 bg-blue-950/20 text-blue-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isSkewed ? (
            <AlertTriangle size={20} className="text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck size={20} className="text-blue-400 shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-bold text-white">
              Dataset: <span className="capitalize">{datasetName.replace('_', ' ')}</span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {isSkewed
                ? `Severe skew detected! Standard BST degenerates into an O(n) line (Height ${bstHeight}), while RBT stays balanced at Height ${rbtHeight}.`
                : `Both trees balanced. RBT height is ${rbtHeight} vs BST height ${bstHeight}.`}
            </p>
          </div>
        </div>

        {heightSavingPercent > 0 && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            +{heightSavingPercent}% Shallower Tree
          </div>
        )}
      </div>

      {/* Side-by-Side Tree Canvases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Standard Unbalanced BST */}
        <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                Standard Binary Search Tree (Unbalanced)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                No rotations · Vulnerable to O(n) degeneration
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Height: <strong className="text-amber-400">{bstHeight}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Compares: <strong>{bstComparisons}</strong>
              </span>
            </div>
          </div>

          <TreeCanvas
            treeSnapshot={bstSnapshot}
            showNilLeavesInitial={false}
          />
        </div>

        {/* Right: Red-Black Tree */}
        <div className="rounded-xl border border-red-500/30 bg-[#0c101a] p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Red-Black Tree (Self-Balancing)
              </h3>
              <p className="text-[11px] text-red-400/80 font-mono mt-0.5">
                Rotations + Recoloring · Guaranteed O(log n)
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/50">
                Height: <strong className="text-emerald-400">{rbtHeight}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Compares: <strong>{rbtComparisons}</strong>
              </span>
            </div>
          </div>

          <TreeCanvas
            treeSnapshot={rbtSnapshot}
            showNilLeavesInitial={false}
          />
        </div>
      </div>
    </div>
  );
};

export default TreeComparisonView;
