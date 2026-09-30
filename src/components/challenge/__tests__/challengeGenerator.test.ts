import { describe, it, expect } from 'vitest';
import { generateChallenges, ChallengeCategory } from '../challengeGenerator';

describe('Challenge Generator Engine', () => {
  const challenges = generateChallenges();

  it('generates challenges for all specified categories', () => {
    const categories: ChallengeCategory[] = [
      'IDENTIFY_VIOLATION',
      'IDENTIFY_UNCLE',
      'IDENTIFY_CASE',
      'PREDICT_ROTATION',
      'PREDICT_RECOLORING',
      'IDENTIFY_COMPLEXITY',
    ];

    const presentCategories = new Set(challenges.map((c) => c.category));
    categories.forEach((cat) => {
      expect(presentCategories.has(cat), `Missing category: ${cat}`).toBe(true);
    });
  });

  it('ensures each challenge has valid options, bounds, and explanations', () => {
    challenges.forEach((ch) => {
      expect(ch.question.length).toBeGreaterThan(15);
      expect(ch.options.length).toBeGreaterThanOrEqual(3);
      expect(ch.correctIndex).toBeGreaterThanOrEqual(0);
      expect(ch.correctIndex).toBeLessThan(ch.options.length);
      expect(ch.explanation.length).toBeGreaterThan(20);
    });
  });
});
