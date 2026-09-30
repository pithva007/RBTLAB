import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col">
      <header className="border-b border-[#1e2638] bg-[#0c101a]/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-red-900/30">
            RB
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              RB-Tree Lab
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                v1.0.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">Interactive Red-Black Tree Laboratory</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md text-center p-8 rounded-xl border border-[#1e2638] bg-[#111522] shadow-2xl">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 mb-4 border border-red-500/20 font-mono">
            O(log n)
          </div>
          <h2 className="text-xl font-bold mb-2">Algorithm Laboratory Initialized</h2>
          <p className="text-sm text-slate-400">
            Initializing Red-Black Tree engine, balancing cases, step simulator, and performance benchmarks.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
