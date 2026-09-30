import React, { useState } from 'react';
import {
  Eye,
  GraduationCap,
  Trophy,
  Activity,
  GitCompare,
  Info,
  Home,
  Code2,
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { route: PageRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'home', label: 'Dashboard', icon: <Home size={15} /> },
    { route: 'visualizer', label: 'Visualizer', icon: <Eye size={15} /> },
    { route: 'learn', label: 'Learn', icon: <GraduationCap size={15} /> },
    { route: 'challenge', label: 'Challenge', icon: <Trophy size={15} /> },
    { route: 'stress', label: 'Stress Test', icon: <Activity size={15} /> },
    { route: 'compare', label: 'BST vs RBT', icon: <GitCompare size={15} /> },
    { route: 'about', label: 'About', icon: <Info size={15} /> },
  ];

  const handleNavClick = (route: PageRoute) => {
    onRouteChange(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e2638] bg-[#0c101a]/95 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavClick('home')}
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

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
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

        {/* Right Action: GitHub Link + Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/pithva007/RBTLAB"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#111624] transition-colors text-xs font-mono"
            title="GitHub Repository"
          >
            <Code2 size={15} />
            <span>GitHub</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161d2e] transition-colors"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#1e2638] space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#182136] text-white font-semibold border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#111624]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-[#182032] flex items-center justify-between px-3 text-xs text-slate-400">
            <a
              href="https://github.com/pithva007/RBTLAB"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white font-mono py-1"
            >
              <Code2 size={14} />
              <span>GitHub Repository</span>
            </a>
            <span className="font-mono text-[10px] text-slate-500">v1.0</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
