import React from 'react';
import { Award, Trophy, CheckCircle, Target, RotateCcw } from 'lucide-react';

interface ScoreTrackerProps {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  bestScore: number;
  onResetScore: () => void;
}

export const ScoreTracker: React.FC<ScoreTrackerProps> = ({
  score,
  questionsAnswered,
  correctAnswers,
  bestScore,
  onResetScore,
}) => {
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-[#1e2638] pb-2">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Challenge Mode Performance Tracker
          </h3>
        </div>

        <button
          onClick={onResetScore}
          className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          title="Reset score"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Score */}
        <div className="p-2.5 rounded-lg border border-[#1a2234] bg-[#111624]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Score</span>
            <Award size={13} className="text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-400">{score}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">+10 / correct</div>
        </div>

        {/* Answered */}
        <div className="p-2.5 rounded-lg border border-[#1a2234] bg-[#111624]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Answered</span>
            <Target size={13} className="text-blue-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-200">{questionsAnswered}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Total attempts</div>
        </div>

        {/* Correct */}
        <div className="p-2.5 rounded-lg border border-[#1a2234] bg-[#111624]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Correct</span>
            <CheckCircle size={13} className="text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">{correctAnswers}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Valid answers</div>
        </div>

        {/* Accuracy */}
        <div className="p-2.5 rounded-lg border border-[#1a2234] bg-[#111624]">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Accuracy</span>
            <span className="text-[11px] font-mono font-bold text-cyan-400">%</span>
          </div>
          <div className="text-lg font-bold font-mono text-cyan-400">{accuracy}%</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Precision rate</div>
        </div>

        {/* Best Score */}
        <div className="p-2.5 rounded-lg border border-[#1a2234] bg-[#111624] col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Best Score</span>
            <Trophy size={13} className="text-purple-400" />
          </div>
          <div className="text-lg font-bold font-mono text-purple-400">{bestScore}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">All-time record</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreTracker;
