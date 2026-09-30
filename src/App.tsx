import React, { useState, useEffect } from 'react';
import { Navbar, PageRoute } from './components/common/Navbar';
import { LandingPage } from './pages/LandingPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { LearnPage } from './pages/LearnPage';
import { ChallengePage } from './pages/ChallengePage';
import { StressTestPage } from './pages/StressTestPage';
import { ComparePage } from './pages/ComparePage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  // Sync route with window.location.hash
  const getInitialRoute = (): PageRoute => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['visualizer', 'learn', 'challenge', 'stress', 'compare', 'about'].includes(hash)) {
      return hash as PageRoute;
    }
    return 'home';
  };

  const [route, setRoute] = useState<PageRoute>(getInitialRoute);

  const handleRouteChange = (newRoute: PageRoute) => {
    setRoute(newRoute);
    window.location.hash = newRoute === 'home' ? '/' : `/${newRoute}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['visualizer', 'learn', 'challenge', 'stress', 'compare', 'about'].includes(hash)) {
        setRoute(hash as PageRoute);
      } else {
        setRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* Top Laboratory Navigation Bar */}
      <Navbar currentRoute={route} onRouteChange={handleRouteChange} />

      {/* Main Page Workspace */}
      <main className="flex-1 px-4 sm:px-6 py-6">
        {route === 'home' && <LandingPage onNavigate={handleRouteChange} />}
        {route === 'visualizer' && <VisualizerPage />}
        {route === 'learn' && <LearnPage />}
        {route === 'challenge' && <ChallengePage />}
        {route === 'stress' && <StressTestPage />}
        {route === 'compare' && <ComparePage />}
        {route === 'about' && <AboutPage />}
      </main>

      {/* Laboratory Developer Footer */}
      <footer className="border-t border-[#1e2638] bg-[#090d16] py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-slate-400 font-semibold">RB-Tree Lab</span>
            <span>· Design & Analysis of Algorithms Laboratory</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>CLRS Chapter 13</span>
            <span>·</span>
            <button
              onClick={() => handleRouteChange('about')}
              className="hover:text-white transition-colors"
            >
              Architecture & Invariants
            </button>
            <span>·</span>
            <a
              href="https://github.com/pithva007/RBTLAB"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
