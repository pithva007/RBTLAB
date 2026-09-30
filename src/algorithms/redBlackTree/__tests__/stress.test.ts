import { describe, it, expect } from 'vitest';
import { RedBlackTree } from '../RedBlackTree';
import { generateDataset } from '../../../utils/datasets';

describe('Red-Black Tree Stress and Performance Invariants', () => {
  it('guarantees logarithmic height bound across 500 sequential ascending nodes', () => {
    const tree = new RedBlackTree();
    const data = generateDataset('ascending', { count: 500, min: 1, max: 5000 });

    data.forEach((v) => tree.insert(v));

    expect(tree.getNodeCount()).toBe(500);

    // Theoretical maximum height is 2 * floor(log2(n + 1))
    const theoreticalMax = 2 * Math.ceil(Math.log2(501));
    const actualHeight = tree.getHeight();

    expect(actualHeight).toBeLessThanOrEqual(theoreticalMax);
    expect(tree.validate().allValid).toBe(true);
  });

  it('guarantees average rotations per insertion is strictly bounded by constant factor O(1)', () => {
    const tree = new RedBlackTree();
    const data = generateDataset('random', { count: 1000, min: 1, max: 100000, seed: 999 });

    data.forEach((v) => tree.insert(v));

    const stats = tree.getStatistics();
    // In theory, average rotations per insert in a Red-Black Tree is strictly < 0.6
    const avgRotations = stats.rotations / 1000;
    expect(avgRotations).toBeLessThan(1.0);
  });

  it('performs stress insert followed by stress delete while maintaining validity', () => {
    const tree = new RedBlackTree();
    const data = generateDataset('random', { count: 200, min: 1, max: 10000, seed: 777 });

    data.forEach((v) => tree.insert(v));
    expect(tree.getNodeCount()).toBe(200);
    expect(tree.validate().allValid).toBe(true);

    // Delete half the nodes
    const toDelete = data.slice(0, 100);
    toDelete.forEach((v) => tree.delete(v));
    expect(tree.getNodeCount()).toBe(100);
    expect(tree.validate().allValid).toBe(true);
  });
});
