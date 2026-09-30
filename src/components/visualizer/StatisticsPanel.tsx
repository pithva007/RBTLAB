import React from 'react';
import { TreeStatistics } from '../../algorithms/redBlackTree/types';
import {
  Layers,
  RotateCw,
  Palette,
  Search,
  PlusCircle,
  MinusCircle,
  Hash,
  Scale,
} from 'lucide-react';

interface StatisticsPanelProps {
  statistics: TreeStatistics;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ statistics }) => {
  const statItems = [
    {
      label: 'Total Nodes',
      value: statistics.nodes,
      icon: <Hash size={14} className="text-blue-400" />,
      sub: `${statistics.redNodes} Red · ${statistics.blackNodes} Black`,
    },
    {
      label: 'Tree Height',
      value: statistics.height,
      icon: <Layers size={14} className="text-amber-400" />,
      sub: `Max path length`,
    },
    {
      label: 'Black Height',
      value: statistics.blackHeight,
      icon: <Scale size={14} className="text-emerald-400" />,
      sub: `Uniform along all paths`,
    },
    {
      label: 'Rotations',
      value: statistics.rotations,
      icon: <RotateCw size={14} className="text-purple-400" />,
      sub: `${statistics.leftRotations} L · ${statistics.rightRotations} R`,
    },
    {
      label: 'Recolorings',
      value: statistics.recolorings,
      icon: <Palette size={14} className="text-red-400" />,
      sub: `Color updates`,
    },
    {
      label: 'Comparisons',
      value: statistics.comparisons,
      icon: <Search size={14} className="text-cyan-400" />,
      sub: `Key evaluations`,
    },
  ];

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-[#1e2638] pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Live Tree Telemetry & Statistics
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <PlusCircle size={11} className="text-emerald-400" />
            {statistics.insertOperations}
          </span>
          <span className="flex items-center gap-1">
            <MinusCircle size={11} className="text-red-400" />
            {statistics.deleteOperations}
          </span>
          <span className="flex items-center gap-1">
            <Search size={11} className="text-cyan-400" />
            {statistics.searchOperations}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg border border-[#1a2234] bg-[#111624] hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="text-[11px]">{item.label}</span>
              {item.icon}
            </div>
            <div className="text-lg font-bold font-mono text-white tracking-tight">
              {item.value}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
              {item.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPanel;
