import React from 'react';
import { EducationalWhy } from '../../algorithms/redBlackTree/events';
import {
  HelpCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

interface LearnExplainerProps {
  why: EducationalWhy | null;
  stepTitle?: string;
}

export const LearnExplainer: React.FC<LearnExplainerProps> = ({ why, stepTitle }) => {
  if (!why) {
    return (
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 text-center text-slate-500">
        <HelpCircle size={28} className="mx-auto mb-2 opacity-40 text-blue-400" />
        <h4 className="text-sm font-semibold text-slate-400">DAA Learning Explainer</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Perform a tree operation or step through an animation to view deep algorithmic insights, invariants, and balancing rationale.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Lightbulb size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Algorithmic Reasoning (DAA Laboratory)
            </h3>
            {stepTitle && (
              <p className="text-xs text-slate-400 font-mono mt-0.5">{stepTitle}</p>
            )}
          </div>
        </div>

        {why.caseDetected && (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {why.caseDetected}
          </span>
        )}
      </div>

      {/* Structured Explanations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* What Happened */}
        <div className="p-3 rounded-lg border border-[#1c2436] bg-[#101524]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <CheckCircle size={14} className="text-emerald-400" />
            <span>What happened?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {why.whatHappened}
          </p>
        </div>

        {/* Why did it happen */}
        <div className="p-3 rounded-lg border border-[#1c2436] bg-[#101524]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <HelpCircle size={14} className="text-blue-400" />
            <span>Why did it happen?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {why.whyDidItHappen}
          </p>
        </div>

        {/* Violated Property */}
        <div className="p-3 rounded-lg border border-[#1c2436] bg-[#101524]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <AlertCircle size={14} className="text-red-400" />
            <span>Which Red-Black property was violated?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {why.violatedProperty ? (
              <span className="text-red-300 font-medium">
                {why.violatedProperty}
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">
                No immediate property violated at this step.
              </span>
            )}
          </p>
        </div>

        {/* Why this Action */}
        <div className="p-3 rounded-lg border border-[#1c2436] bg-[#101524]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <Lightbulb size={14} className="text-amber-400" />
            <span>Why was this action selected?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {why.actionReason}
          </p>
        </div>
      </div>

      {/* Complexity Footer */}
      <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-950/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-purple-400" />
          <span className="text-slate-400 font-medium">Theoretical Complexity:</span>
          <span className="font-mono text-purple-300 font-bold">{why.complexity}</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Guaranteed O(log n) worst-case
        </span>
      </div>
    </div>
  );
};

export default LearnExplainer;
