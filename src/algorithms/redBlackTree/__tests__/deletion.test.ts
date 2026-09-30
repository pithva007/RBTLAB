import { describe, it, expect, beforeEach } from 'vitest';
import { RedBlackTree } from '../RedBlackTree';
import { RBNode } from '../RBNode';

describe('Red-Black Tree Deletion', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
    RBNode.resetIdCounter();
  });

  const verifyRedBlackProperties = (tree: RedBlackTree) => {
    if (!tree.root) return;

    // Property 2: Root is BLACK
    expect(tree.root.color).toBe('BLACK');

    // Property 4: No RED node has a RED child
    const checkRedRed = (node: RBNode | null) => {
      if (!node) return;
      if (node.isRed) {
        if (node.left) expect(node.left.isRed).toBe(false);
        if (node.right) expect(node.right.isRed).toBe(false);
      }
      checkRedRed(node.left);
      checkRedRed(node.right);
    };
    checkRedRed(tree.root);

    // Property 5: Equal black height on all paths
    const leafBlackHeights: number[] = [];
    const traverseBH = (node: RBNode | null, currentBH: number) => {
      if (!node) {
        leafBlackHeights.push(currentBH + 1);
        return;
      }
      const bh = currentBH + (node.isBlack ? 1 : 0);
      traverseBH(node.left, bh);
      traverseBH(node.right, bh);
    };
    traverseBH(tree.root, 0);

    const firstBH = leafBlackHeights[0];
    leafBlackHeights.forEach((bh) => expect(bh).toBe(firstBH));
  };

  it('deletes the only node (root) in the tree', () => {
    tree.insert(50);
    const deleted = tree.delete(50);
    expect(deleted).toBe(true);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.root).toBeNull();
  });

  it('deletes a red leaf node directly without rebalancing', () => {
    // 20 (B) -> left 10 (R), right 30 (R)
    tree.insert(20);
    tree.insert(10);
    tree.insert(30);

    const res = tree.deleteWithTrace(10);
    expect(res.deleted).toBe(true);
    expect(tree.find(10)).toBeNull();
    expect(tree.inorderTraversal()).toEqual([20, 30]);
    verifyRedBlackProperties(tree);
  });

  it('deletes a node with one child correctly', () => {
    // 20 (B) -> 10 (B) -> 5 (R)
    tree.insert(20);
    tree.insert(10);
    tree.insert(30);
    tree.insert(5);

    expect(tree.find(10)).not.toBeNull();
    tree.delete(10);
    expect(tree.find(10)).toBeNull();
    expect(tree.inorderTraversal()).toEqual([5, 20, 30]);
    verifyRedBlackProperties(tree);
  });

  it('deletes a node with two children by replacing with inorder successor', () => {
    const values = [50, 25, 75, 10, 40, 60, 90, 35, 45];
    values.forEach((v) => tree.insert(v));

    const res = tree.deleteWithTrace(25);
    expect(res.deleted).toBe(true);
    expect(tree.find(25)).toBeNull();

    // Check that inorder successor replacement step was logged
    const successorStep = res.steps.find((s) => s.phase === 'FIND_SUCCESSOR');
    expect(successorStep).toBeDefined();

    expect(tree.inorderTraversal()).toEqual(
      values.filter((v) => v !== 25).sort((a, b) => a - b)
    );
    verifyRedBlackProperties(tree);
  });

  it('handles double-black sibling cases and rebalances correctly', () => {
    // Construct tree that triggers double black fixup
    const values = [10, 20, 30, 40, 50, 60, 70, 80];
    values.forEach((v) => tree.insert(v));

    // Delete multiple nodes that trigger sibling rotations and recolorings
    [80, 70, 60, 10].forEach((val) => {
      const deleted = tree.delete(val);
      expect(deleted).toBe(true);
      expect(tree.find(val)).toBeNull();
      verifyRedBlackProperties(tree);
    });

    expect(tree.inorderTraversal()).toEqual([20, 30, 40, 50]);
  });

  it('returns false when attempting to delete non-existent value', () => {
    tree.insert(50);
    tree.insert(20);
    const res = tree.deleteWithTrace(999);
    expect(res.deleted).toBe(false);
    expect(tree.getNodeCount()).toBe(2);
  });

  it('maintains strict red-black invariants across randomized insert/delete sequences', () => {
    const numbers = [12, 45, 2, 78, 34, 99, 56, 23, 87, 65, 11, 3, 8, 44, 90];
    numbers.forEach((n) => tree.insert(n));
    verifyRedBlackProperties(tree);

    // Delete subset of numbers
    const toDelete = [2, 78, 56, 12, 90];
    toDelete.forEach((n) => {
      tree.delete(n);
      verifyRedBlackProperties(tree);
    });

    const remaining = numbers
      .filter((n) => !toDelete.includes(n))
      .sort((a, b) => a - b);
    expect(tree.inorderTraversal()).toEqual(remaining);

    // Delete all remaining
    remaining.forEach((n) => {
      tree.delete(n);
      verifyRedBlackProperties(tree);
    });

    expect(tree.isEmpty()).toBe(true);
  });
});
