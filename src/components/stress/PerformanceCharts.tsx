import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Layers, RotateCw, Search, GitCompare } from 'lucide-react';

export interface BenchmarkPoint {
  nodes: number;
  bstHeight: number;
  rbtHeight: number;
  theoreticalMaxHeight: number;
  bstComparisons: number;
  rbtComparisons: number;
  rotations: number;
  recolorings: number;
  rbtTimeMs: number;
  bstTimeMs: number;
}

interface PerformanceChartsProps {
  data: BenchmarkPoint[];
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState<'HEIGHT' | 'COMPARISONS' | 'BALANCING' | 'BST_VS_RBT'>('BST_VS_RBT');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-[#1e2638] bg-[#0c101a]/95 p-3 shadow-2xl backdrop-blur font-mono text-xs space-y-1">
          <p className="text-slate-400 font-bold border-b border-[#1e2638] pb-1">
            Nodes (N): <span className="text-white">{label}</span>
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-2xl space-y-4">
      {/* Chart Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#1e2638] pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">
            Algorithmic Performance Curves
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-[#111624] p-1 rounded-lg border border-[#1e2638] flex-wrap">
          <button
            onClick={() => setActiveChart('BST_VS_RBT')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeChart === 'BST_VS_RBT'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare size={13} />
            <span>BST vs RBT Height</span>
          </button>

          <button
            onClick={() => setActiveChart('HEIGHT')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeChart === 'HEIGHT'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={13} />
            <span>RBT Height vs 2·log₂(n)</span>
          </button>

          <button
            onClick={() => setActiveChart('COMPARISONS')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeChart === 'COMPARISONS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search size={13} />
            <span>Comparisons</span>
          </button>

          <button
            onClick={() => setActiveChart('BALANCING')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeChart === 'BALANCING'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCw size={13} />
            <span>Rotations & Recolorings</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-[360px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'BST_VS_RBT' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#182032" />
              <XAxis dataKey="nodes" stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="bstHeight"
                name="BST Height (Unbalanced)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="rbtHeight"
                name="Red-Black Tree Height"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="theoreticalMaxHeight"
                name="Theoretical Bound 2·log₂(N+1)"
                stroke="#6366f1"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          ) : activeChart === 'HEIGHT' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#182032" />
              <XAxis dataKey="nodes" stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="rbtHeight"
                name="Empirical RBT Height"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="theoreticalMaxHeight"
                name="Worst-Case Bound: 2·log₂(N+1)"
                stroke="#38bdf8"
                strokeDasharray="3 3"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : activeChart === 'COMPARISONS' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#182032" />
              <XAxis dataKey="nodes" stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="rbtComparisons"
                name="RBT Comparisons"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="bstComparisons"
                name="BST Comparisons"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#182032" />
              <XAxis dataKey="nodes" stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="rotations"
                name="Rotations (Left + Right)"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="recolorings"
                name="Recolorings"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceCharts;
