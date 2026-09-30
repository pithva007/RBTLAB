import { describe, it, expect, beforeEach } from 'vitest';
import { RedBlackTree } from '../RedBlackTree';
import { RBNode } from '../RBNode';
import { validateTree } from '../validation';

describe('Red-Black Tree Property Validation', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
    RBNode.resetIdCounter();
  });

  it('validates that an empty tree satisfies all properties', () => {
    const res = validateTree(tree);
    expect(res.allValid).toBe(true);
    expect(res.violations).toHaveLength(0);
  });

  it('validates a properly constructed balanced tree', () => {
    [50, 20, 80, 10, 30, 70, 90].forEach((v) => tree.insert(v));
    const res = tree.validate();

    expect(res.allValid).toBe(true);
    expect(res.prop1Valid).toBe(true);
    expect(res.prop2Valid).toBe(true);
    expect(res.prop3Valid).toBe(true);
    expect(res.prop4Valid).toBe(true);
    expect(res.prop5Valid).toBe(true);
    expect(res.bstOrderingValid).toBe(true);
    expect(res.violations).toHaveLength(0);
  });

  it('detects Property 2 violation (root is RED)', () => {
    tree.insert(50);
    // Artificially corrupt root color
    tree.root!.color = 'RED';

    const res = tree.validate();
    expect(res.allValid).toBe(false);
    expect(res.prop2Valid).toBe(false);
    expect(res.violations.some((v) => v.includes('Property 2 Violation'))).toBe(true);
  });

  it('detects Property 4 violation (RED node has a RED child)', () => {
    tree.insert(50); // Root (BLACK)
    tree.insert(30); // Left (RED)
    tree.insert(70); // Right (RED)

    // Artificially add a RED child to RED node 30 without rebalancing
    const redChild = new RBNode(15, 'RED');
    redChild.parent = tree.root!.left;
    tree.root!.left!.left = redChild;

    const res = tree.validate();
    expect(res.allValid).toBe(false);
    expect(res.prop4Valid).toBe(false);
    expect(res.violations.some((v) => v.includes('Property 4 Violation'))).toBe(true);
  });

  it('detects Property 5 violation (inconsistent black height along paths)', () => {
    tree.insert(50);
    tree.insert(30);
    tree.insert(70);

    // Make left child BLACK, creating left black height 3 (with leaf) vs right black height 2
    tree.root!.left!.color = 'BLACK';

    const res = tree.validate();
    expect(res.allValid).toBe(false);
    expect(res.prop5Valid).toBe(false);
    expect(res.violations.some((v) => v.includes('Property 5 Violation'))).toBe(true);
  });

  it('detects BST ordering violation', () => {
    tree.insert(50);
    tree.insert(30);
    tree.insert(70);

    // Swap values to corrupt BST order
    tree.root!.left!.value = 85; // 85 is on the left of 50!

    const res = tree.validate();
    expect(res.allValid).toBe(false);
    expect(res.bstOrderingValid).toBe(false);
    expect(res.violations.some((v) => v.includes('BST Ordering Violation'))).toBe(true);
  });
});
