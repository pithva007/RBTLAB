import { describe, it, expect } from 'vitest';
import { generateDataset, createRng } from '../datasets';

describe('Dataset Generator and PRNG', () => {
  it('generates reproducible numbers using deterministic seed', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);

    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];

    expect(seq1).toEqual(seq2);
  });

  it('generates ascending sequence correctly', () => {
    const data = generateDataset('ascending', { count: 8, min: 10, max: 80 });
    expect(data).toHaveLength(8);
    for (let i = 1; i < data.length; i++) {
      expect(data[i]).toBeGreaterThan(data[i - 1]);
    }
  });

  it('generates descending sequence correctly', () => {
    const data = generateDataset('descending', { count: 8, min: 10, max: 80 });
    expect(data).toHaveLength(8);
    for (let i = 1; i < data.length; i++) {
      expect(data[i]).toBeLessThan(data[i - 1]);
    }
  });

  it('generates random unique elements when allowDuplicates is false', () => {
    const data = generateDataset('random', { count: 15, min: 1, max: 50, allowDuplicates: false });
    expect(data).toHaveLength(15);
    const unique = new Set(data);
    expect(unique.size).toBe(15);
  });

  it('generates duplicate heavy numbers from limited pool', () => {
    const data = generateDataset('duplicate_heavy', { count: 20 });
    expect(data).toHaveLength(20);
    const unique = new Set(data);
    expect(unique.size).toBeLessThanOrEqual(5);
  });
});
