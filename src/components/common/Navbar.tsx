import React from 'react';
import {
  Eye,
  GraduationCap,
  Trophy,
  Activity,
  GitCompare,
  Info,
  Home,
  Code2,
} from 'lucide-react';

export type PageRoute =
  | 'home'
  | 'visualizer'
  | 'learn'
  | 'challenge'
  | 'stress'
  | 'compare'
  | 'about';

interface NavbarProps {
  currentRoute: PageRoute;
  onRouteChange: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onRouteChange }) => {
  const navItems: { route: PageRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'home', label: 'Dashboard', icon: <Home size={15} /> },
    { route: 'visualizer', label: 'Visualizer', icon: <Eye size={15} /> },
    { route: 'learn', label: 'Learn', icon: <GraduationCap size={15} /> },
    { route: 'challenge', label: 'Challenge', icon: <Trophy size={15} /> },
    { route: 'stress', label: 'Stress Test', icon: <Activity size={15} /> },
    { route: 'compare', label: 'BST vs RBT', icon: <GitCompare size={15} /> },
    { route: 'about', label: 'About', icon: <Info size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e2638] bg-[#0c101a]/90 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onRouteChange('home')}
          className="flex items-center space-x-3 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center font-mono font-bold text-white text-xs shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform">
            RB
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>RB-Tree Lab</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Algorithm Laboratory
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => onRouteChange(item.route)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#182136] text-white font-semibold border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111624]'
                }`}
              >
                <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* GitHub Link */}
        <div className="hidden md:flex items-center">
          <a
            href="https://github.com/pithva007/RBTLAB"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#111624] transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="GitHub Repository"
          >
            <Code2 size={16} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
