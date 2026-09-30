import React, { useState } from 'react';
import { Challenge } from './challengeGenerator';
import { TreeCanvas } from '../visualizer/TreeCanvas';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface QuizCardProps {
  challenge: Challenge;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  challenge,
  onAnswer,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
    setHasSubmitted(true);
    const isCorrect = idx === challenge.correctIndex;
    onAnswer(isCorrect);
  };

  const isCorrect = selectedOption === challenge.correctIndex;

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-2xl space-y-4">
      {/* Category Tag & Counter */}
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
        <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {challenge.categoryLabel}
        </span>
        <span className="text-xs text-slate-500 font-mono">
          Challenge ID: {challenge.id}
        </span>
      </div>

      {/* Question Prompt */}
      <div>
        <h3 className="text-base font-bold text-white leading-snug">
          {challenge.question}
        </h3>
      </div>

      {/* Partial Tree Snapshot (if present) */}
      {challenge.treeSnapshot && (
        <div className="rounded-xl border border-[#1e2638] bg-[#080b11] p-2 overflow-hidden shadow-inner">
          <TreeCanvas
            treeSnapshot={challenge.treeSnapshot}
            highlightRoles={challenge.highlightRoles}
            showNilLeavesInitial={true}
          />
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
        {challenge.options.map((opt, idx) => {
          let btnStyle = 'border-[#222b40] bg-[#111624] text-slate-300 hover:bg-[#161c2d] hover:border-slate-700';

          if (hasSubmitted) {
            if (idx === challenge.correctIndex) {
              btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold shadow-lg shadow-emerald-950/50';
            } else if (idx === selectedOption) {
              btnStyle = 'border-red-500 bg-red-950/40 text-red-200 font-semibold shadow-lg shadow-red-950/50';
            } else {
              btnStyle = 'opacity-40 border-slate-800 bg-[#0e121e] text-slate-500';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={hasSubmitted}
              className={`p-3 rounded-lg border text-xs text-left font-medium transition-all flex items-start gap-2.5 ${btnStyle}`}
            >
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 leading-relaxed">{opt}</span>
              {hasSubmitted && idx === challenge.correctIndex && (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              )}
              {hasSubmitted && idx === selectedOption && !isCorrect && (
                <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation (Shown after answering) */}
      {hasSubmitted && (
        <div
          className={`p-4 rounded-xl border space-y-2 transition-all ${
            isCorrect
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
              : 'border-red-500/30 bg-red-950/20 text-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-emerald-400">✓ Correct! (+10 Points)</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-red-400" />
                  <span className="text-red-400">✗ Incorrect</span>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedOption(null);
                setHasSubmitted(false);
                onNext();
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-950/50"
            >
              <span>Next Challenge</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="pt-2 border-t border-[#1e2638] text-xs leading-relaxed text-slate-300">
            <strong className="text-white block mb-1 flex items-center gap-1">
              <HelpCircle size={13} className="text-blue-400" />
              Algorithmic Explanation:
            </strong>
            {challenge.explanation}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
