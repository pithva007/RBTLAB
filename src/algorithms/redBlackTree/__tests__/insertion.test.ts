import { describe, it, expect, beforeEach } from 'vitest';
import { RedBlackTree } from '../RedBlackTree';
import { RBNode } from '../RBNode';

describe('Red-Black Tree Insertion', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
    RBNode.resetIdCounter();
  });

  it('inserts first node as black root', () => {
    const node = tree.insert(50);
    expect(node).not.toBeNull();
    expect(tree.root).toBe(node);
    expect(tree.root?.value).toBe(50);
    expect(tree.root?.color).toBe('BLACK');
    expect(tree.getNodeCount()).toBe(1);
  });

  it('handles Case 1: Uncle is RED (recoloring parent, uncle, and grandparent)', () => {
    // 50 (B) -> left 30 (R), right 70 (R)
    // insert 10 -> uncle 70 is RED -> recolor 30 & 70 BLACK, 50 BLACK (root)
    tree.insert(50);
    tree.insert(30);
    tree.insert(70);
    tree.insert(10);

    const n50 = tree.root;
    const n30 = n50?.left;
    const n70 = n50?.right;
    const n10 = n30?.left;

    expect(n50?.color).toBe('BLACK');
    expect(n30?.color).toBe('BLACK');
    expect(n70?.color).toBe('BLACK');
    expect(n10?.color).toBe('RED');
  });

  it('handles Left-Left Case (LL): Right rotation at grandparent with recoloring', () => {
    // Insert descending: 30, 20, 10
    // 10 creates LL clash on 20 -> right rotate at 30
    tree.insert(30);
    tree.insert(20);
    tree.insert(10);

    // Root should now be 20 (BLACK), left 10 (RED), right 30 (RED)
    expect(tree.root?.value).toBe(20);
    expect(tree.root?.color).toBe('BLACK');
    expect(tree.root?.left?.value).toBe(10);
    expect(tree.root?.left?.color).toBe('RED');
    expect(tree.root?.right?.value).toBe(30);
    expect(tree.root?.right?.color).toBe('RED');
    expect(tree.inorderTraversal()).toEqual([10, 20, 30]);
  });

  it('handles Right-Right Case (RR): Left rotation at grandparent with recoloring', () => {
    // Insert ascending: 10, 20, 30
    // 30 creates RR clash on 20 -> left rotate at 10
    tree.insert(10);
    tree.insert(20);
    tree.insert(30);

    // Root should now be 20 (BLACK), left 10 (RED), right 30 (RED)
    expect(tree.root?.value).toBe(20);
    expect(tree.root?.color).toBe('BLACK');
    expect(tree.root?.left?.value).toBe(10);
    expect(tree.root?.left?.color).toBe('RED');
    expect(tree.root?.right?.value).toBe(30);
    expect(tree.root?.right?.color).toBe('RED');
    expect(tree.inorderTraversal()).toEqual([10, 20, 30]);
  });

  it('handles Left-Right Case (LR): Left rotate parent, then Right rotate grandparent', () => {
    // Insert: 30, 10, 20
    tree.insert(30);
    tree.insert(10);
    tree.insert(20);

    // Root should be 20 (BLACK), left 10 (RED), right 30 (RED)
    expect(tree.root?.value).toBe(20);
    expect(tree.root?.color).toBe('BLACK');
    expect(tree.root?.left?.value).toBe(10);
    expect(tree.root?.left?.color).toBe('RED');
    expect(tree.root?.right?.value).toBe(30);
    expect(tree.root?.right?.color).toBe('RED');
    expect(tree.inorderTraversal()).toEqual([10, 20, 30]);
  });

  it('handles Right-Left Case (RL): Right rotate parent, then Left rotate grandparent', () => {
    // Insert: 10, 30, 20
    tree.insert(10);
    tree.insert(30);
    tree.insert(20);

    // Root should be 20 (BLACK), left 10 (RED), right 30 (RED)
    expect(tree.root?.value).toBe(20);
    expect(tree.root?.color).toBe('BLACK');
    expect(tree.root?.left?.value).toBe(10);
    expect(tree.root?.left?.color).toBe('RED');
    expect(tree.root?.right?.value).toBe(30);
    expect(tree.root?.right?.color).toBe('RED');
    expect(tree.inorderTraversal()).toEqual([10, 20, 30]);
  });

  it('handles duplicate value insertion gracefully without corrupting tree', () => {
    tree.insert(50);
    tree.insert(25);
    const result = tree.insertWithTrace(50);

    expect(result.isDuplicate).toBe(true);
    expect(tree.getNodeCount()).toBe(2);
    expect(tree.inorderTraversal()).toEqual([25, 50]);
  });

  it('records detailed step logs and balancing case trace during insertion', () => {
    tree.insert(50);
    tree.insert(20);
    const result = tree.insertWithTrace(10);

    expect(result.steps.length).toBeGreaterThan(3);
    const phases = result.steps.map((s) => s.phase);
    expect(phases).toContain('INPUT_RECEIVED');
    expect(phases).toContain('BST_INSERTION');
    expect(phases).toContain('NODE_CREATED');
    expect(phases).toContain('IDENTIFY_CASE');
    expect(phases).toContain('ROTATION');
    expect(phases).toContain('INSERTION_COMPLETE');

    // Balancing case must be identified as UNCLE_BLACK_LL
    const caseStep = result.steps.find((s) => s.phase === 'IDENTIFY_CASE');
    expect(caseStep?.balancingCase).toBe('UNCLE_BLACK_LL');
  });

  it('maintains red-black invariants across multiple insertions', () => {
    const values = [50, 20, 70, 10, 30, 60, 80, 5, 15, 25, 35];
    values.forEach((v) => tree.insert(v));

    expect(tree.getNodeCount()).toBe(values.length);
    expect(tree.inorderTraversal()).toEqual([...values].sort((a, b) => a - b));

    // Verify root is BLACK
    expect(tree.root?.color).toBe('BLACK');

    // Verify Property 4: No RED node has a RED child
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

    // Verify Property 5: Equal black heights on all root-to-leaf paths
    const getLeafBlackHeights = (node: RBNode | null, currentBH: number, heights: number[]) => {
      if (!node) {
        heights.push(currentBH + 1); // null/nil counts as 1 black
        return;
      }
      const bh = currentBH + (node.isBlack ? 1 : 0);
      getLeafBlackHeights(node.left, bh, heights);
      getLeafBlackHeights(node.right, bh, heights);
    };
    const blackHeights: number[] = [];
    getLeafBlackHeights(tree.root, 0, blackHeights);
    const firstBH = blackHeights[0];
    blackHeights.forEach((bh) => expect(bh).toBe(firstBH));
  });
});
