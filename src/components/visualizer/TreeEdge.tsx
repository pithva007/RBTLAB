import React from 'react';
import { LayoutEdge } from '../../utils/treeLayout';

interface TreeEdgeProps {
  edge: LayoutEdge;
}

export const TreeEdge: React.FC<TreeEdgeProps> = ({ edge }) => {
  const { sourceX, sourceY, targetX, targetY, isToNil } = edge;

  // Compute smooth curved cubic bezier path
  const midY = (sourceY + targetY) / 2;
  const pathD = `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;

  return (
    <g className="tree-edge-group transition-all duration-300">
      <path
        d={pathD}
        fill="none"
        stroke={isToNil ? '#334155' : '#64748b'}
        strokeWidth={isToNil ? 1.5 : 2}
        strokeDasharray={isToNil ? '3 3' : undefined}
        strokeOpacity={isToNil ? 0.4 : 0.8}
        className="transition-all duration-300"
      />
    </g>
  );
};

export default TreeEdge;
