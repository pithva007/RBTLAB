import React from 'react';
import { Code2, BookOpen } from 'lucide-react';

interface PseudocodeLine {
  lineNum: number;
  code: string;
  indent: number;
  comment?: string;
}

const INSERT_PSEUDOCODE: PseudocodeLine[] = [
  { lineNum: 1, code: 'RB-INSERT(T, z):', indent: 0 },
  { lineNum: 2, code: 'y = NIL, x = T.root', indent: 1 },
  { lineNum: 3, code: 'while x != NIL: y = x', indent: 1 },
  { lineNum: 4, code: 'if z.key < x.key: x = x.left', indent: 2 },
  { lineNum: 5, code: 'else: x = x.right', indent: 2 },
  { lineNum: 7, code: 'z.p = y; attach z as child of y', indent: 1 },
  { lineNum: 8, code: 'z.color = RED  // Preserve black-height', indent: 1 },
  { lineNum: 10, code: 'if y == NIL: T.root.color = BLACK; return', indent: 1 },
  { lineNum: 13, code: '// If parent is BLACK -> no violation', indent: 1 },
  { lineNum: 16, code: 'while z.p.color == RED:  // Red-Red clash!', indent: 1 },
  { lineNum: 18, code: 'y = z.uncle; if y.color == RED:  // Case 1', indent: 2 },
  { lineNum: 19, code: 'z.p.color = BLACK', indent: 3 },
  { lineNum: 20, code: 'y.color = BLACK', indent: 3 },
  { lineNum: 21, code: 'z.p.p.color = RED; z = z.p.p', indent: 3 },
  { lineNum: 24, code: 'else: // Uncle is BLACK', indent: 2 },
  { lineNum: 25, code: 'if z == z.p.inner: LEFT-ROTATE(T, z.p)', indent: 3 },
  { lineNum: 28, code: 'z.p.color = BLACK', indent: 3 },
  { lineNum: 29, code: 'z.p.p.color = RED', indent: 3 },
  { lineNum: 30, code: 'RIGHT-ROTATE(T, z.p.p)', indent: 3 },
  { lineNum: 33, code: 'T.root.color = BLACK  // Rule #2 root is black', indent: 1 },
  { lineNum: 35, code: 'return // All 5 RBT invariants valid', indent: 1 },
];

const DELETE_PSEUDOCODE: PseudocodeLine[] = [
  { lineNum: 1, code: 'RB-DELETE(T, z):', indent: 0 },
  { lineNum: 2, code: 'y = z (or successor of z)', indent: 1 },
  { lineNum: 3, code: 'y_original_color = y.color', indent: 1 },
  { lineNum: 4, code: 'if z.left == NIL: x = z.right; TRANSPLANT(T, z, z.right)', indent: 1 },
  { lineNum: 5, code: 'else if z.right == NIL: x = z.left; TRANSPLANT(T, z, z.left)', indent: 1 },
  { lineNum: 6, code: 'else: y = MINIMUM(z.right); x = y.right; splice y into z', indent: 1 },
  { lineNum: 7, code: 'if y_original_color == BLACK: RB-DELETE-FIXUP(T, x)', indent: 1 },
  { lineNum: 8, code: 'RB-DELETE-FIXUP(T, x):  // Double-Black fixup', indent: 0 },
  { lineNum: 9, code: 'while x != T.root and x.color == BLACK:', indent: 1 },
  { lineNum: 10, code: 'w = x.sibling', indent: 2 },
  { lineNum: 11, code: 'if w.color == RED: // Case 1: Sibling RED', indent: 2 },
  { lineNum: 12, code: 'w.color = BLACK; x.p.color = RED; ROTATE(x.p)', indent: 3 },
  { lineNum: 13, code: 'if w.left.isBlack and w.right.isBlack: // Case 2', indent: 2 },
  { lineNum: 14, code: 'w.color = RED; x = x.p', indent: 3 },
  { lineNum: 15, code: 'else: if w.far_child.isBlack: // Case 3', indent: 2 },
  { lineNum: 16, code: 'w.near_child.color = BLACK; ROTATE(w)', indent: 3 },
  { lineNum: 17, code: 'w.color = x.p.color; x.p.color = BLACK; ROTATE(x.p) // Case 4', indent: 2 },
  { lineNum: 18, code: 'x.color = BLACK; T.root.color = BLACK', indent: 1 },
];

interface PseudocodePanelProps {
  operation?: 'INSERT' | 'DELETE' | 'SEARCH' | 'RESET';
  activeLine?: number;
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  operation = 'INSERT',
  activeLine = 1,
}) => {
  const codeLines = operation === 'DELETE' ? DELETE_PSEUDOCODE : INSERT_PSEUDOCODE;

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-3 shadow-xl space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-2 px-1">
        <div className="flex items-center gap-1.5 text-slate-200 font-bold">
          <Code2 size={14} className="text-blue-400" />
          <span>Algorithm Pseudocode</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold border border-blue-500/20">
            {operation}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <BookOpen size={12} />
          <span>CLRS 3rd Ed.</span>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="max-h-[220px] overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
        {codeLines.map((line) => {
          const isActive = activeLine === line.lineNum;
          return (
            <div
              key={line.lineNum}
              className={`flex items-center gap-2 px-2 py-0.5 rounded text-[11px] transition-colors leading-5 ${
                isActive
                  ? 'bg-blue-600/20 text-white font-semibold border-l-2 border-blue-400 pl-1.5 shadow-sm'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {/* Line indicator / number */}
              <span className={`w-5 text-right shrink-0 select-none ${isActive ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
                {line.lineNum}
              </span>

              {/* Active pointer arrow */}
              <span className="w-3 text-center shrink-0">
                {isActive ? <span className="text-amber-400 animate-pulse font-bold text-xs">▶</span> : null}
              </span>

              {/* Code line content */}
              <span
                style={{ paddingLeft: `${line.indent * 12}px` }}
                className={isActive ? 'text-blue-200' : ''}
              >
                {line.code}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PseudocodePanel;
