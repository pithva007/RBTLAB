import React, { useState, useMemo } from 'react';
import { generateChallenges, ChallengeCategory, Challenge } from '../components/challenge/challengeGenerator';
import { QuizCard } from '../components/challenge/QuizCard';
import { ScoreTracker } from '../components/challenge/ScoreTracker';
import { Trophy, HelpCircle, Shuffle } from 'lucide-react';

export const ChallengePage: React.FC = () => {
  const allChallenges = useMemo(() => generateChallenges(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Score state
  const [score, setScore] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem('rbt_lab_best_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const filteredChallenges = useMemo(() => {
    if (selectedCategory === 'ALL') return allChallenges;
    return allChallenges.filter((c) => c.category === selectedCategory);
  }, [allChallenges, selectedCategory]);

  const activeChallenge: Challenge =
    filteredChallenges[currentIndex % filteredChallenges.length] || allChallenges[0];

  const handleAnswer = (isCorrect: boolean) => {
    setQuestionsAnswered((prev) => prev + 1);
    if (isCorrect) {
      const newScore = score + 10;
      setScore(newScore);
      setCorrectAnswers((prev) => prev + 1);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('rbt_lab_best_score', newScore.toString());
      }
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredChallenges.length);
  };

  const handleShuffle = () => {
    const randomIdx = Math.floor(Math.random() * filteredChallenges.length);
    setCurrentIndex(randomIdx);
  };

  const handleResetScore = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
  };

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'IDENTIFY_CASE', label: 'Balancing Cases' },
    { id: 'PREDICT_ROTATION', label: 'Predict Rotation' },
    { id: 'PREDICT_RECOLORING', label: 'Predict Recolor' },
    { id: 'IDENTIFY_VIOLATION', label: 'Invariants' },
    { id: 'IDENTIFY_UNCLE', label: 'Uncle / Relations' },
    { id: 'IDENTIFY_COMPLEXITY', label: 'Complexity Bounds' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-[#1e2638] bg-gradient-to-r from-[#0c101a] via-[#111624] to-[#0c101a] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Challenge Laboratory & Assessment Arena
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Test your mastery of Red-Black Tree balancing cases, rotations, recolorings, and theoretical invariants.
            </p>
          </div>
        </div>
      </div>

      {/* Score Tracker */}
      <ScoreTracker
        score={score}
        questionsAnswered={questionsAnswered}
        correctAnswers={correctAnswers}
        bestScore={bestScore}
        onResetScore={handleResetScore}
      />

      {/* Category Filter Pills & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl border border-[#1e2638] bg-[#0c101a]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as ChallengeCategory | 'ALL');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-[#111624] text-slate-400 border border-[#222b40] hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleShuffle}
          className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1.5 border border-slate-700 transition-colors"
          title="Pick a random challenge"
        >
          <Shuffle size={13} />
          <span>Random</span>
        </button>
      </div>

      {/* Active Quiz Card */}
      <QuizCard
        key={activeChallenge.id}
        challenge={activeChallenge}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />

      {/* Educational Note */}
      <div className="p-4 rounded-xl border border-[#1e2638] bg-[#0c101a] flex items-center gap-3 text-xs text-slate-400">
        <HelpCircle size={18} className="text-blue-400 shrink-0" />
        <p>
          Need a refresher? Visit the <strong className="text-slate-200">Learning Mode</strong> to review all 8 CLRS balancing cases or test them interactively in the <strong className="text-slate-200">Visualizer</strong>.
        </p>
      </div>
    </div>
  );
};

export default ChallengePage;
