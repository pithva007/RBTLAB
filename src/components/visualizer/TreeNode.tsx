import React from 'react';
import { LayoutNode } from '../../utils/treeLayout';

interface TreeNodeProps {
  node: LayoutNode;
  onNodeClick?: (node: LayoutNode) => void;
  radius?: number;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onNodeClick,
  radius = 22,
}) => {
  const { x, y, value, color, isNil, role } = node;

  // Determine role tag configuration
  const roleConfig: Record<string, { label: string; bg: string; border: string; text: string }> = {
    current: { label: 'CURRENT', bg: '#0284c7', border: '#38bdf8', text: '#ffffff' },
    parent: { label: 'PARENT', bg: '#d97706', border: '#fbbf24', text: '#ffffff' },
    grandparent: { label: 'GP', bg: '#9333ea', border: '#c084fc', text: '#ffffff' },
    uncle: { label: 'UNCLE', bg: '#059669', border: '#34d399', text: '#ffffff' },
    sibling: { label: 'SIBLING', bg: '#4f46e5', border: '#818cf8', text: '#ffffff' },
    successor: { label: 'SUCC', bg: '#0d9488', border: '#2dd4bf', text: '#ffffff' },
  };

  const activeRole = role !== 'normal' ? roleConfig[role] : null;

  if (isNil) {
    return (
      <g
        transform={`translate(${x}, ${y})`}
        className="tree-node-nil cursor-pointer transition-transform duration-300"
        aria-label="NIL sentinel leaf node (BLACK)"
      >
        <rect
          x={-14}
          y={-10}
          width={28}
          height={20}
          rx={4}
          fill="#0a0e17"
          stroke="#334155"
          strokeWidth={1.5}
        />
        <text
          x={0}
          y={3}
          textAnchor="middle"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          fill="#64748b"
        >
          NIL
        </text>
      </g>
    );
  }

  // Base styling for Red, Black, and Double Black nodes
  const isRed = color === 'RED';
  const isDoubleBlack = color === 'DOUBLE_BLACK';

  let fillGradient = isRed ? '#dc2626' : '#111827';
  let strokeColor = isRed ? '#f87171' : '#374151';

  if (isDoubleBlack) {
    fillGradient = '#090d16';
    strokeColor = '#06b6d4';
  }

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="tree-node group cursor-pointer transition-all duration-300 focus:outline-none"
      onClick={() => onNodeClick && onNodeClick(node)}
      tabIndex={0}
      role="button"
      aria-label={`Node ${value}, color: ${color}${role !== 'normal' ? `, role: ${role}` : ''}`}
    >
      {/* Outer Glow Ring for Roles */}
      {activeRole && (
        <circle
          cx={0}
          cy={0}
          r={radius + 6}
          fill="none"
          stroke={activeRole.border}
          strokeWidth={2.5}
          strokeDasharray="4 2"
          className="animate-spin-slow opacity-80"
        />
      )}

      {/* Main Node Circle */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        fill={fillGradient}
        stroke={activeRole ? activeRole.border : strokeColor}
        strokeWidth={activeRole ? 3 : 2}
        filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))"
        className="transition-colors duration-200"
      />

      {/* Node Value */}
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontSize="13"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fill="#f8fafc"
        className="select-none pointer-events-none"
      >
        {value}
      </text>

      {/* Color Indicator Badge (Accessibility & Quick identification) */}
      <circle
        cx={radius - 5}
        cy={-radius + 5}
        r={5}
        fill={isRed ? '#ef4444' : '#1f2937'}
        stroke="#ffffff"
        strokeWidth={1}
      />
      <text
        x={radius - 5}
        y={-radius + 7.5}
        textAnchor="middle"
        fontSize="6"
        fontFamily="sans-serif"
        fontWeight="bold"
        fill="#ffffff"
        className="select-none pointer-events-none"
      >
        {isRed ? 'R' : 'B'}
      </text>

      {/* Role Tag Label */}
      {activeRole && (
        <g transform={`translate(0, ${radius + 12})`}>
          <rect
            x={-24}
            y={-7}
            width={48}
            height={14}
            rx={3}
            fill={activeRole.bg}
            stroke={activeRole.border}
            strokeWidth={1}
          />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            fontSize="8"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
            fill={activeRole.text}
            className="select-none uppercase tracking-wider"
          >
            {activeRole.label}
          </text>
        </g>
      )}
    </g>
  );
};

export default TreeNode;
