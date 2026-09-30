import React, { useMemo } from 'react';
import { PageRoute } from '../components/common/Navbar';
import { RedBlackTree } from '../algorithms/redBlackTree/RedBlackTree';
import { TreeCanvas } from '../components/visualizer/TreeCanvas';
import {
  Eye,
  GraduationCap,
  Trophy,
  Activity,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Pre-balanced sample tree for Hero demonstration
  const sampleTreeSnapshot = useMemo(() => {
    const tree = new RedBlackTree();
    [50, 25, 75, 12, 37, 62, 88].forEach((v) => tree.insert(v));
    return tree.getState();
  }, []);

  const featureCards: {
    route: PageRoute;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    border: string;
  }[] = [
    {
      route: 'visualizer',
      title: 'Interactive Visualizer',
      subtitle: 'Dynamic Tree Animation',
      description:
        'Insert, delete, and search keys while stepping through rebalancing cases, color flips, and atomic rotations.',
      icon: <Eye size={20} className="text-red-400" />,
      color: 'bg-red-500/10 text-red-400',
      border: 'border-red-500/20 hover:border-red-500/50',
    },
    {
      route: 'learn',
      title: 'Learning Mode',
      subtitle: 'DAA Case Encyclopedia',
      description:
        'Explore all 8 CLRS balancing cases with deep explanations of violated invariants, rotation rationale, and complexity.',
      icon: <GraduationCap size={20} className="text-blue-400" />,
      color: 'bg-blue-500/10 text-blue-400',
      border: 'border-blue-500/20 hover:border-blue-500/50',
    },
    {
      route: 'challenge',
      title: 'Challenge Mode',
      subtitle: 'Algorithmic Arena',
      description:
        'Test your predictive intuition on partially balanced trees: identify violations, predict rotations, and earn high scores.',
      icon: <Trophy size={20} className="text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-400',
      border: 'border-amber-500/20 hover:border-amber-500/50',
    },
    {
      route: 'stress',
      title: 'Stress Test Laboratory',
      subtitle: 'Scalable Benchmarking',
      description:
        'Run empirical benchmarks up to 10,000 nodes across 5 data distributions and plot Recharts performance curves.',
      icon: <Activity size={20} className="text-purple-400" />,
      color: 'bg-purple-500/10 text-purple-400',
      border: 'border-purple-500/20 hover:border-purple-500/50',
    },
    {
      route: 'compare',
      title: 'BST vs. Red-Black Tree',
      subtitle: 'Empirical Skew Analysis',
      description:
        'Witness side-by-side how ordered input degenerates standard BSTs into O(n) sticks while RBT stays strictly balanced.',
      icon: <GitCompare size={20} className="text-emerald-400" />,
      color: 'bg-emerald-500/10 text-emerald-400',
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
    },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>Design & Analysis of Algorithms Laboratory</span>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            RB-TREE LAB
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-slate-200">
            "Understand how self-balancing trees actually think."
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An interactive laboratory for exploring Red-Black Tree insertion, deletion, rotations, balancing cases, and performance.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('visualizer')}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-red-950/60 transition-all hover:scale-105"
          >
            <span>Explore Visualizer</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onNavigate('challenge')}
            className="px-6 py-2.5 rounded-xl bg-[#111624] hover:bg-[#161c2e] text-slate-200 font-bold text-sm border border-[#222b40] flex items-center gap-2 transition-all hover:border-slate-600"
          >
            <Trophy size={16} className="text-amber-400" />
            <span>Start Challenge</span>
          </button>
        </div>

        {/* Theoretical Asymptotic Complexity Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-3xl mx-auto pt-4">
          <div className="p-2.5 rounded-lg border border-[#1e2638] bg-[#0c101a] font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Search</div>
            <div className="text-sm font-bold text-emerald-400">O(log n)</div>
          </div>
          <div className="p-2.5 rounded-lg border border-[#1e2638] bg-[#0c101a] font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Insert</div>
            <div className="text-sm font-bold text-emerald-400">O(log n)</div>
          </div>
          <div className="p-2.5 rounded-lg border border-[#1e2638] bg-[#0c101a] font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Delete</div>
            <div className="text-sm font-bold text-emerald-400">O(log n)</div>
          </div>
          <div className="p-2.5 rounded-lg border border-[#1e2638] bg-[#0c101a] font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Rotations / Ins</div>
            <div className="text-sm font-bold text-blue-400">≤ 2</div>
          </div>
          <div className="p-2.5 rounded-lg border border-[#1e2638] bg-[#0c101a] font-mono col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-500 uppercase">Rotations / Del</div>
            <div className="text-sm font-bold text-purple-400">≤ 3</div>
          </div>
        </div>

        {/* Sample Animated Interactive Tree Preview */}
        <div className="pt-4 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#1e2638] bg-[#090d16] p-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#182032] text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live Self-Balanced Sample Tree (7 Nodes)
              </span>
              <span>All 5 Invariants Satisfied</span>
            </div>
            <TreeCanvas treeSnapshot={sampleTreeSnapshot} showNilLeavesInitial={true} />
          </div>
        </div>
      </section>

      {/* Five Laboratory Modes Grid */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Comprehensive Laboratory Suites
          </h2>
          <p className="text-xs text-slate-400">
            Select a mode to explore Red-Black Tree mechanics, benchmarking, and challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => (
            <div
              key={card.route}
              onClick={() => onNavigate(card.route)}
              className={`p-5 rounded-xl border bg-[#0c101a] ${card.border} transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${card.color} border border-current/20`}>
                    {card.icon}
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    {card.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#182032] flex items-center text-xs font-semibold text-slate-300 group-hover:text-blue-400 transition-colors">
                <span>Launch Mode</span>
                <ArrowRight size={13} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLRS The 5 Fundamental Properties Overview */}
      <section className="p-6 rounded-2xl border border-[#1e2638] bg-[#0c101a] shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1e2638] pb-3">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            The 5 Red-Black Tree Invariants (CLRS)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { num: 1, text: 'Every node is colored RED or BLACK.' },
            { num: 2, text: 'The root node is always BLACK.' },
            { num: 3, text: 'Every leaf (NIL sentinel) is BLACK.' },
            { num: 4, text: 'If a node is RED, both its children are BLACK.' },
            { num: 5, text: 'All simple paths to descendant leaves have equal black height.' },
          ].map((item) => (
            <div
              key={item.num}
              className="p-3 rounded-lg border border-[#1b2336] bg-[#111624] space-y-1"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold">
                <CheckCircle2 size={13} />
                <span>Property {item.num}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
