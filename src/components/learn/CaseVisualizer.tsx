import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  RotateCw,
  Palette,
  Play,
} from 'lucide-react';

export interface EducationalCase {
  id: string;
  category: 'INSERTION' | 'DELETION';
  name: string;
  condition: string;
  violation: string;
  resolution: string;
  operations: string[];
  complexity: string;
  setupValues: number[];
  triggerValue: number;
}

export const EDUCATIONAL_CASES: EducationalCase[] = [
  {
    id: 'ins_case_1',
    category: 'INSERTION',
    name: 'Insertion Case 1: Uncle is RED',
    condition: 'New node is RED, parent is RED, and uncle node is RED.',
    violation: 'Property 4: A RED node cannot have a RED child.',
    resolution:
      'Recolor parent and uncle to BLACK, and grandparent to RED. Then advance check to grandparent.',
    operations: ['Recolor parent to BLACK', 'Recolor uncle to BLACK', 'Recolor grandparent to RED'],
    complexity: 'O(1) local recoloring, may propagate up to O(log n) times.',
    setupValues: [50, 30, 70],
    triggerValue: 10,
  },
  {
    id: 'ins_case_2a',
    category: 'INSERTION',
    name: 'Insertion Case 2a: Left-Left Line (Uncle is BLACK)',
    condition: 'New node is outer left child of parent, and parent is left child of grandparent. Uncle is BLACK/NIL.',
    violation: 'Property 4: Consecutive RED nodes in straight line.',
    resolution:
      'Recolor parent to BLACK, grandparent to RED, and perform a Right Rotation at grandparent.',
    operations: ['Recolor parent to BLACK', 'Recolor grandparent to RED', 'Right Rotation @ Grandparent'],
    complexity: 'O(1) rotation and recoloring. Finishes immediately.',
    setupValues: [50, 30],
    triggerValue: 10,
  },
  {
    id: 'ins_case_3a',
    category: 'INSERTION',
    name: 'Insertion Case 3a: Left-Right Triangle (Uncle is BLACK)',
    condition: 'New node is inner right child of parent, but parent is left child of grandparent (zigzag).',
    violation: 'Property 4: Consecutive RED nodes in triangle configuration.',
    resolution:
      'Left rotate parent to convert into Left-Left line, then apply Case 2a (recolor & right rotate grandparent).',
    operations: ['Left Rotation @ Parent', 'Right Rotation @ Grandparent', 'Recoloring'],
    complexity: 'O(1) double rotation. Finishes immediately.',
    setupValues: [50, 20],
    triggerValue: 35,
  },
  {
    id: 'ins_case_2b',
    category: 'INSERTION',
    name: 'Insertion Case 2b: Right-Right Line (Uncle is BLACK)',
    condition: 'New node is outer right child of parent, and parent is right child of grandparent. Uncle is BLACK/NIL.',
    violation: 'Property 4: Consecutive RED nodes in straight right line.',
    resolution:
      'Recolor parent to BLACK, grandparent to RED, and perform a Left Rotation at grandparent.',
    operations: ['Recolor parent to BLACK', 'Recolor grandparent to RED', 'Left Rotation @ Grandparent'],
    complexity: 'O(1) rotation and recoloring. Finishes immediately.',
    setupValues: [30, 50],
    triggerValue: 70,
  },
  {
    id: 'del_case_1',
    category: 'DELETION',
    name: 'Deletion Case 1: Sibling is RED',
    condition: 'Double-black node has a RED sibling.',
    violation: 'Property 5: Equal black height on all paths.',
    resolution:
      'Recolor sibling to BLACK, parent to RED, and rotate parent towards double-black child. Converts to sibling BLACK case.',
    operations: ['Recolor sibling BLACK', 'Recolor parent RED', 'Rotate parent towards child'],
    complexity: 'O(1) rotation and recolor; transforms to Cases 2, 3, or 4.',
    setupValues: [30, 20, 50, 40, 60],
    triggerValue: 20,
  },
  {
    id: 'del_case_2',
    category: 'DELETION',
    name: 'Deletion Case 2: Sibling is BLACK, both children BLACK',
    condition: 'Sibling is BLACK and both of sibling’s children are BLACK (or NIL).',
    violation: 'Property 5: Deficit of 1 black unit on double-black branch.',
    resolution:
      'Recolor sibling to RED. Double-black moves up to parent node. If parent was RED, recolor parent to BLACK to terminate.',
    operations: ['Recolor sibling to RED', 'Double-black moves up to parent'],
    complexity: 'O(1) recolor, may propagate up to O(log n) levels.',
    setupValues: [50, 20, 70],
    triggerValue: 20,
  },
  {
    id: 'del_case_3',
    category: 'DELETION',
    name: 'Deletion Case 3: Sibling is BLACK, near child is RED',
    condition: 'Sibling is BLACK, near child is RED, and far child is BLACK.',
    violation: 'Property 5: Imbalance with inner red nephew.',
    resolution:
      'Recolor near child BLACK, sibling RED, and rotate sibling away from double-black child. Transforms to Case 4.',
    operations: ['Recolor nephew BLACK', 'Recolor sibling RED', 'Rotate sibling away'],
    complexity: 'O(1) rotation; transforms to terminal Case 4.',
    setupValues: [50, 20, 80, 70],
    triggerValue: 20,
  },
  {
    id: 'del_case_4',
    category: 'DELETION',
    name: 'Deletion Case 4: Sibling is BLACK, far child is RED',
    condition: 'Sibling is BLACK and far child (outer nephew) is RED.',
    violation: 'Property 5: Deficit can be resolved by pulling far red nephew into black position.',
    resolution:
      'Sibling gets parent’s color, parent becomes BLACK, far child becomes BLACK, and rotate parent towards child. Double-black eliminated!',
    operations: ['Sibling inherits parent color', 'Parent & Nephew to BLACK', 'Rotate parent', 'Terminates immediately'],
    complexity: 'O(1) terminal step. Tree is fully balanced.',
    setupValues: [50, 20, 70, 85],
    triggerValue: 20,
  },
];

interface CaseVisualizerProps {
  onLoadCase?: (setupValues: number[], triggerValue: number, isDelete: boolean) => void;
}

export const CaseVisualizer: React.FC<CaseVisualizerProps> = ({ onLoadCase }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(EDUCATIONAL_CASES[0].id);
  const [activeTab, setActiveTab] = useState<'INSERTION' | 'DELETION'>('INSERTION');

  const filteredCases = EDUCATIONAL_CASES.filter((c) => c.category === activeTab);
  const activeCase = EDUCATIONAL_CASES.find((c) => c.id === selectedCaseId) || filteredCases[0];

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Balancing Cases Encyclopedia (CLRS)
          </h3>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('INSERTION');
              setSelectedCaseId('ins_case_1');
            }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'INSERTION'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Insertion (4 Cases)
          </button>
          <button
            onClick={() => {
              setActiveTab('DELETION');
              setSelectedCaseId('del_case_1');
            }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'DELETION'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deletion (4 Cases)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left List of Cases */}
        <div className="lg:col-span-5 space-y-1.5">
          {filteredCases.map((c) => {
            const isSelected = c.id === activeCase.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-500/50 bg-blue-950/30 text-white shadow-md'
                    : 'border-[#1b2336] bg-[#101524] text-slate-400 hover:bg-[#151c30] hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{c.name}</span>
                  <ArrowRight size={13} className={isSelected ? 'text-blue-400' : 'opacity-40'} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {c.condition}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Detail Inspection Card */}
        <div className="lg:col-span-7 rounded-xl border border-[#1e2638] bg-[#111625] p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                {activeCase.category} · {activeCase.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeCase.complexity}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">
              {activeCase.name}
            </h4>

            {/* Invariant Trigger Box */}
            <div className="mt-3 p-3 rounded-lg border border-red-500/20 bg-red-950/20">
              <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">
                Trigger & Invariant Breach:
              </div>
              <p className="text-xs text-slate-200 font-mono">
                {activeCase.violation}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeCase.condition}
              </p>
            </div>

            {/* Resolution Strategy */}
            <div className="mt-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Balancing Technique:
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeCase.resolution}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {activeCase.operations.map((op, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 text-[11px] font-mono border border-emerald-700/50"
                  >
                    {op.includes('Rotate') || op.includes('Rotation') ? (
                      <RotateCw size={11} />
                    ) : (
                      <Palette size={11} />
                    )}
                    {op}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action to Load this Scenario */}
          {onLoadCase && (
            <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Setup: [{activeCase.setupValues.join(', ')}] → Action: {activeCase.triggerValue}
              </span>

              <button
                onClick={() =>
                  onLoadCase(
                    activeCase.setupValues,
                    activeCase.triggerValue,
                    activeCase.category === 'DELETION'
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-950/50"
              >
                <Play size={13} />
                <span>Simulate in Visualizer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseVisualizer;
