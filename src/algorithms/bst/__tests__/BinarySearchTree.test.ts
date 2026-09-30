import { describe, it, expect, beforeEach } from 'vitest';
import { BinarySearchTree } from '../BinarySearchTree';
import { RedBlackTree } from '../../redBlackTree/RedBlackTree';

describe('BinarySearchTree vs RedBlackTree', () => {
  let bst: BinarySearchTree;
  let rbt: RedBlackTree;

  beforeEach(() => {
    bst = new BinarySearchTree();
    rbt = new RedBlackTree();
  });

  it('inserts elements and maintains BST ordering', () => {
    const values = [50, 30, 70, 20, 40, 60, 80];
    values.forEach((v) => bst.insert(v));

    expect(bst.getNodeCount()).toBe(7);
    expect(bst.inorderTraversal()).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });

  it('demonstrates O(n) skew on ascending data in BST while RBT stays O(log n)', () => {
    const ascending = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    ascending.forEach((v) => {
      bst.insert(v);
      rbt.insert(v);
    });

    // In unbalanced BST, height equals node count (10)
    expect(bst.getHeight()).toBe(10);

    // In Red-Black Tree, height is strictly balanced (<= 2 * log2(11) = 4)
    expect(rbt.getHeight()).toBeLessThanOrEqual(5);
    expect(rbt.getHeight()).toBeLessThan(bst.getHeight());
  });

  it('searches for elements and tracks comparison counts', () => {
    [10, 20, 30, 40, 50].forEach((v) => bst.insert(v));

    // In a skewed BST, finding 50 requires traversing all 5 levels
    const found = bst.search(50);
    expect(found.found).toBe(true);
    expect(found.comparisons).toBe(5);

    const notFound = bst.search(99);
    expect(notFound.found).toBe(false);
  });

  it('handles deletion in BST (leaf, 1-child, 2-children)', () => {
    [50, 30, 70, 20, 40, 60, 80].forEach((v) => bst.insert(v));

    // Delete leaf (20)
    expect(bst.delete(20)).toBe(true);
    expect(bst.inorderTraversal()).toEqual([30, 40, 50, 60, 70, 80]);

    // Delete 2-child node (50)
    expect(bst.delete(50)).toBe(true);
    expect(bst.inorderTraversal()).toEqual([30, 40, 60, 70, 80]);
  });
});
