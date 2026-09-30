import React from 'react';
import { AlgorithmEvent } from '../../algorithms/redBlackTree/events';
import { AlertTriangle, ArrowRight, HelpCircle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExplanationPanelProps {
  currentEvent: AlgorithmEvent | null;
  stepIndex: number;
  totalSteps: number;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  currentEvent,
  stepIndex,
  totalSteps,
}) => {
  if (!currentEvent) {
    return (
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-4 shadow-xl text-xs font-mono space-y-2 text-slate-400">
        <div className="flex items-center gap-1.5 font-bold text-white text-sm">
          <HelpCircle size={15} className="text-blue-400" />
          <span>WHAT IS HAPPENING?</span>
        </div>
        <p className="text-slate-500">
          Ready for operation. Enter a key above or pick a dataset preset to begin step-by-step algorithm animation.
        </p>
      </div>
    );
  }

  const { title, description, educationalWhy, highlightRoles, comparison, type } = currentEvent;
  const isViolation = type === 'RED_RED_VIOLATION' || type === 'DOUBLE_BLACK';
  const isComplete = type === 'OPERATION_COMPLETE';

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-4 shadow-xl space-y-3 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-2">
        <div className="flex items-center gap-2">
          {isViolation ? (
            <ShieldAlert size={16} className="text-amber-400 shrink-0 animate-bounce" />
          ) : isComplete ? (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <Sparkles size={16} className="text-blue-400 shrink-0" />
          )}
          <span className="font-bold text-white text-sm tracking-wide">WHAT IS HAPPENING?</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
          Step {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Primary Action Title */}
      <div>
        <h4 className={`text-sm font-bold leading-tight ${isViolation ? 'text-amber-400' : isComplete ? 'text-emerald-400' : 'text-blue-300'}`}>
          {title}
        </h4>
        <p className="text-slate-300 text-xs mt-1.5 leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {/* Comparison Callout */}
      {comparison && (
        <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
          <span className="text-slate-400">Comparison:</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold font-mono">
              {comparison.targetVal} {comparison.decision === 'LEFT' ? '<' : comparison.decision === 'RIGHT' ? '>' : '=='} {comparison.currentVal}
            </span>
            <ArrowRight size={13} className="text-blue-400" />
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
              Branch {comparison.decision}
            </span>
          </div>
        </div>
      )}

      {/* Violated Property Alert Banner */}
      {educationalWhy.violatedProperty && (
        <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-2">
          <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-red-300 block text-[11px]">VIOLATION DETECTED</span>
            <span className="text-xs">{educationalWhy.violatedProperty}</span>
          </div>
        </div>
      )}

      {/* Case Detected Banner */}
      {educationalWhy.caseDetected && (
        <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-200 flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">Balancing Case:</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
            {educationalWhy.caseDetected.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      {/* Active Node Roles Chips */}
      {(highlightRoles.current !== undefined ||
        highlightRoles.parent !== undefined ||
        highlightRoles.grandparent !== undefined ||
        highlightRoles.uncle !== undefined ||
        highlightRoles.sibling !== undefined) && (
        <div className="pt-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
            Active Node Roles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {highlightRoles.current !== undefined && highlightRoles.current !== null && (
              <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold">
                CURRENT: {highlightRoles.current}
              </span>
            )}
            {highlightRoles.parent !== undefined && highlightRoles.parent !== null && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                PARENT: {highlightRoles.parent}
              </span>
            )}
            {highlightRoles.grandparent !== undefined && highlightRoles.grandparent !== null && (
              <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">
                GRANDPARENT: {highlightRoles.grandparent}
              </span>
            )}
            {highlightRoles.uncle !== undefined && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                UNCLE: {highlightRoles.uncle ?? 'NIL/BLACK'}
              </span>
            )}
            {highlightRoles.sibling !== undefined && highlightRoles.sibling !== null && (
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold">
                SIBLING: {highlightRoles.sibling}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Next Action / Rationale */}
      <div className="pt-2 border-t border-[#182032] text-[11px] text-slate-400 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Action Rationale:</span>
          <span className="text-slate-300 font-sans text-right max-w-[200px]">
            {educationalWhy.actionReason}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Time Complexity:</span>
          <span className="text-blue-400 font-bold">{educationalWhy.complexity}</span>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;
