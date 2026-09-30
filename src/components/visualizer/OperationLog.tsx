import React, { useEffect, useRef } from 'react';
import { AlgorithmEvent } from '../../algorithms/redBlackTree/events';
import { Terminal, Copy, Check } from 'lucide-react';

interface OperationLogProps {
  events: AlgorithmEvent[];
  currentStepIndex: number;
  onSelectStep?: (index: number) => void;
}

export const OperationLog: React.FC<OperationLogProps> = ({
  events,
  currentStepIndex,
  onSelectStep,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-scroll to active event
  useEffect(() => {
    if (logContainerRef.current) {
      const activeElem = logContainerRef.current.querySelector('.active-step');
      if (activeElem) {
        activeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStepIndex]);

  const copyLogText = () => {
    const text = events.map((e) => `[Step ${e.stepIndex}/${e.totalSteps}] ${e.title} -> ${e.description}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (type: AlgorithmEvent['type']) => {
    switch (type) {
      case 'RED_RED_VIOLATION':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'DOUBLE_BLACK':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'LEFT_ROTATION':
      case 'RIGHT_ROTATION':
      case 'LEFT_RIGHT_ROTATION':
      case 'RIGHT_LEFT_ROTATION':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'RECOLOR':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'IDENTIFY_CASE':
      case 'IDENTIFY_UNCLE':
      case 'IDENTIFY_SIBLING':
      case 'DELETE_CASE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'OPERATION_COMPLETE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] flex flex-col h-[320px] shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e2638] bg-[#0e1322]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-slate-400" />
          <span className="text-xs font-mono font-bold text-slate-300">
            Algorithm Operation Log
          </span>
          {events.length > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {currentStepIndex + 1} of {events.length} steps
            </span>
          )}
        </div>

        <button
          onClick={copyLogText}
          disabled={events.length === 0}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors disabled:opacity-40"
          title="Copy log to clipboard"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      </div>

      {/* Log Entries Terminal */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-2.5 font-mono text-xs space-y-1.5 scrollbar-thin"
        role="log"
        aria-live="polite"
      >
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center py-6">
            <span className="font-mono text-sm mb-1">// Idle</span>
            <p className="text-[11px] max-w-xs">
              Execute an insert, delete, or search operation to observe the step-by-step rebalancing log.
            </p>
          </div>
        ) : (
          events.map((e, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={e.id}
                onClick={() => onSelectStep && onSelectStep(index)}
                className={`p-2 rounded border cursor-pointer transition-all ${
                  isCurrent
                    ? 'active-step bg-blue-950/60 border-blue-500/80 shadow-md text-slate-100 ring-1 ring-blue-500/40'
                    : isCompleted
                    ? 'bg-[#111524]/80 border-slate-800 hover:bg-[#151b2e] text-slate-300'
                    : 'bg-[#0c101c]/40 border-slate-900/60 opacity-40 hover:opacity-75 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-slate-500 text-[10px] w-4 text-right shrink-0 select-none">
                      {index + 1}.
                    </span>
                    <span className="w-4 text-center shrink-0 select-none">
                      {isCompleted ? (
                        <span className="text-emerald-400 font-bold">✓</span>
                      ) : isCurrent ? (
                        <span className="text-blue-400 font-bold">→</span>
                      ) : (
                        <span className="text-slate-600">○</span>
                      )}
                    </span>
                    <span
                      className={`truncate text-xs ${
                        isCurrent
                          ? 'font-bold text-white'
                          : isCompleted
                          ? 'font-medium text-slate-200'
                          : 'font-normal text-slate-500'
                      }`}
                    >
                      {e.title}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-semibold tracking-wider shrink-0 ${getBadgeStyle(
                      e.type
                    )}`}
                  >
                    {e.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div
                  className={`text-[11px] mt-1 leading-relaxed pl-7 ${
                    isCurrent
                      ? 'text-slate-300'
                      : isCompleted
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {e.description}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OperationLog;
