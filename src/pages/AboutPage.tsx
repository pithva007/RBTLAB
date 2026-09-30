import React from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Code2,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-[#1e2638] bg-gradient-to-r from-[#0c101a] via-[#111624] to-[#0c101a] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BookOpen size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              About RB-Tree Lab
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive Red-Black Tree Balancing, Visualization, Challenge & Performance Analysis Platform.
            </p>
          </div>
        </div>
      </div>

      {/* Purpose & Laboratory Philosophy */}
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-2">
          <GraduationCap size={16} className="text-blue-400" />
          Laboratory Mission & Educational Design
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>RB-Tree Lab</strong> was built from scratch without generic visualization libraries or third-party tree engines. It was engineered to bridge the gap between theoretical textbook algorithms (specifically CLRS Chapter 13) and observable software mechanics.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Standard DSA visualizers jump directly from an input to a final rendered tree. In contrast, RB-Tree Lab captures the intermediate algorithmic events: parent and grandparent relationship detection, uncle inspection, case identification, double-black propagations, and atomic pointer rotations.
        </p>
      </div>

      {/* Real-World Systems Utilizing Red-Black Trees */}
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-2">
          <Cpu size={16} className="text-emerald-400" />
          Where Are Red-Black Trees Used in Production?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-[#1b2336] bg-[#111624] space-y-1">
            <h4 className="font-bold text-emerald-400">Linux Kernel CFS Scheduler</h4>
            <p className="text-slate-400 leading-relaxed">
              The Linux Completely Fair Scheduler (CFS) tracks runnable processes indexed by their execution runtime using an in-kernel Red-Black Tree (<code className="text-slate-300">rbtree.h</code>).
            </p>
          </div>
          <div className="p-3 rounded-lg border border-[#1b2336] bg-[#111624] space-y-1">
            <h4 className="font-bold text-blue-400">C++ STL std::map and std::set</h4>
            <p className="text-slate-400 leading-relaxed">
              Major C++ Standard Template Library implementations (libstdc++, libc++) power associative containers using Red-Black Trees to guarantee <code className="text-slate-300">O(log n)</code> lookup, insertion, and deletion.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-[#1b2336] bg-[#111624] space-y-1">
            <h4 className="font-bold text-purple-400">Java TreeMap & TreeSet</h4>
            <p className="text-slate-400 leading-relaxed">
              Java’s <code className="text-slate-300">java.util.TreeMap</code> and <code className="text-slate-300">HashMap</code> (when bin size exceeds 8) convert bucket linked lists into Red-Black Trees to guard against hash collision DoS attacks.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-[#1b2336] bg-[#111624] space-y-1">
            <h4 className="font-bold text-amber-400">Virtual Memory Managers</h4>
            <p className="text-slate-400 leading-relaxed">
              Operating system kernels (Linux, FreeBSD, Windows) index virtual memory areas (VMAs) to find contiguous free address spaces in logarithmic time.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Architecture & Guarantees */}
      <div className="rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-2">
          <Layers size={16} className="text-purple-400" />
          Technical Architecture
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Backend Required:</strong> High-performance client-side TypeScript engine executes deterministic insertions, deletions, rotations, and property verifications in real-time.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Clean Separation of Concerns:</strong> The algorithm engine (<code className="text-slate-400">src/algorithms/redBlackTree</code>) has zero dependencies on React or DOM structures.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Mathematical Coordinate Layout:</strong> Tree visualization coordinates are computed dynamically via binary tree hierarchy algorithms; node positions are never hardcoded.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Unit Test Coverage:</strong> 62+ Vitest automated unit tests verify every rotation direction, all 4 insertion cases, all 4 deletion cases, and Property 1–5 invariants.
            </span>
          </li>
        </ul>
      </div>

      {/* Repository & Source */}
      <div className="p-4 rounded-xl border border-[#1e2638] bg-[#0c101a] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Code2 size={16} className="text-slate-300" />
          <span>Open-Source Algorithm Laboratory on GitHub</span>
        </div>
        <a
          href="https://github.com/pithva007/RBTLAB"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>View on GitHub</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
