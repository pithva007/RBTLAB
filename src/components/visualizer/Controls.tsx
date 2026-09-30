import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Undo2,
  Redo2,
  Sparkles,
  Search,
  Plus,
  Trash2,
} from 'lucide-react';
import { DatasetPresetType, PRESET_DATASETS } from '../../utils/datasets';

interface ControlsProps {
  onInsert: (value: number) => void;
  onDelete: (value: number) => void;
  onSearch: (value: number) => void;
  onReset: () => void;
  onLoadPreset: (type: DatasetPresetType, count?: number) => void;
  onGenerateRandom: (count: number) => void;

  // Stepping & Playback
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  hasPrevStep: boolean;
  hasNextStep: boolean;
  currentStep: number;
  totalSteps: number;

  // Animation Speed
  speedMs: number;
  onSpeedChange: (speed: number) => void;

  // History
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onInsert,
  onDelete,
  onSearch,
  onReset,
  onLoadPreset,
  onGenerateRandom,
  isPlaying,
  onPlay,
  onPause,
  onStepNext,
  onStepPrev,
  hasPrevStep,
  hasNextStep,
  currentStep,
  totalSteps,
  speedMs,
  onSpeedChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [randomCount, setRandomCount] = useState<number>(8);

  const parsedVal = parseInt(inputValue, 10);
  const isValidNum = !isNaN(parsedVal);

  const handleInsert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isValidNum) {
      onInsert(parsedVal);
      setInputValue('');
    }
  };

  const handleDelete = () => {
    if (isValidNum) {
      onDelete(parsedVal);
      setInputValue('');
    }
  };

  const handleSearch = () => {
    if (isValidNum) {
      onSearch(parsedVal);
    }
  };

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-4 shadow-xl space-y-4">
      {/* Top Row: Direct Number Action Form & History */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleInsert} className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[140px]">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter node key (e.g. 45)..."
              className="w-full px-3 py-1.5 rounded-lg border border-[#222b40] bg-[#111624] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="submit"
              disabled={!isValidNum}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-red-950/40"
            >
              <Plus size={14} />
              <span>Insert</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={!isValidNum}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Trash2 size={13} className="text-red-400" />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={handleSearch}
              disabled={!isValidNum}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Search size={13} />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Undo / Redo / Reset */}
        <div className="flex items-center gap-1.5 border-l border-[#1e2638] pl-3 shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30"
            title="Undo operation"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30"
            title="Redo operation"
          >
            <Redo2 size={16} />
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Reset tree to empty"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Middle Row: Playback & Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg border border-[#182032] bg-[#090d16]">
        {/* Play / Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStepPrev}
            disabled={!hasPrevStep}
            className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Previous step"
          >
            <SkipBack size={15} />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-colors"
            >
              <Pause size={14} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={!hasNextStep}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-950/40 transition-colors"
            >
              <Play size={14} />
              <span>Play</span>
            </button>
          )}

          <button
            onClick={onStepNext}
            disabled={!hasNextStep}
            className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Next step"
          >
            <SkipForward size={15} />
          </button>

          <span className="text-xs font-mono text-slate-400 ml-2">
            Step {totalSteps > 0 ? currentStep + 1 : 0} / {totalSteps}
          </span>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Speed:</span>
          <input
            type="range"
            min="100"
            max="1500"
            step="100"
            value={speedMs}
            onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
            className="w-24 accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400 w-12 text-right">
            {(speedMs / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Bottom Row: Predefined Datasets & Random Generation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1">Presets:</span>
          {PRESET_DATASETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#111624] hover:bg-slate-800 text-slate-300 border border-[#222b40] transition-colors"
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="3"
            max="30"
            value={randomCount}
            onChange={(e) => setRandomCount(parseInt(e.target.value, 10) || 8)}
            className="w-14 px-2 py-1 rounded border border-[#222b40] bg-[#111624] text-xs font-mono text-center text-slate-200"
            title="Number of random nodes"
          />
          <button
            onClick={() => onGenerateRandom(randomCount)}
            className="px-3 py-1 rounded bg-gradient-to-r from-red-600/80 to-purple-600/80 hover:from-red-600 hover:to-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles size={13} />
            <span>Generate Random</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
