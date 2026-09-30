import React from 'react';
import { TreePropertiesStatus } from '../../algorithms/redBlackTree/types';
import { CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PropertyPanelProps {
  status: TreePropertiesStatus;
  isOperationInProgress?: boolean;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  status,
  isOperationInProgress = false,
}) => {
  const properties = [
    {
      num: 1,
      title: 'Node Colors',
      description: 'Every node is colored RED or BLACK.',
      isValid: status.prop1Valid,
    },
    {
      num: 2,
      title: 'Root Property',
      description: 'The root node is always BLACK.',
      isValid: status.prop2Valid,
    },
    {
      num: 3,
      title: 'Leaf Sentinels',
      description: 'Every leaf (NIL sentinel) is BLACK.',
      isValid: status.prop3Valid,
    },
    {
      num: 4,
      title: 'Red Invariant',
      description: 'A RED node cannot have a RED child.',
      isValid: status.prop4Valid,
    },
    {
      num: 5,
      title: 'Black Height',
      description: 'All simple paths to descendant leaves have equal black height.',
      isValid: status.prop5Valid,
    },
  ];

  return (
    <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-[#1e2638] pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Red-Black Tree Properties (CLRS Invariants)
          </h3>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
            status.allValid
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : isOperationInProgress
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
        >
          {status.allValid ? (
            <>
              <ShieldCheck size={13} />
              <span>Tree Balanced</span>
            </>
          ) : (
            <>
              <ShieldAlert size={13} />
              <span>{isOperationInProgress ? 'Rebalancing...' : 'Property Violated'}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {properties.map((prop) => (
          <div
            key={prop.num}
            className={`p-2.5 rounded-lg border transition-all ${
              prop.isValid
                ? 'border-emerald-500/20 bg-emerald-950/10'
                : 'border-amber-500/30 bg-amber-950/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-slate-500 font-semibold">
                PROP {prop.num}
              </span>
              {prop.isValid ? (
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 size={13} />
                  <span>Valid</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                  <AlertTriangle size={13} />
                  <span>Violated</span>
                </div>
              )}
            </div>
            <h4 className="text-xs font-semibold text-slate-200">{prop.title}</h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {prop.description}
            </p>
          </div>
        ))}
      </div>

      {/* Violation Log Message when any property is breached */}
      {status.violations.length > 0 && (
        <div className="mt-3 p-2.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-mono space-y-1">
          {status.violations.map((v, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">⚠</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
