import { describe, it, expect } from 'vitest';
import { computeTreeLayout } from '../treeLayout';
import { RedBlackTree } from '../../algorithms/redBlackTree/RedBlackTree';

describe('Tree Layout Coordinates Engine', () => {
  it('returns empty result when tree is null', () => {
    const layout = computeTreeLayout(null);
    expect(layout.nodes).toHaveLength(0);
    expect(layout.edges).toHaveLength(0);
  });

  it('computes non-overlapping coordinates for a small tree with NIL leaves', () => {
    const tree = new RedBlackTree();
    tree.insert(50);
    tree.insert(25);
    tree.insert(75);

    const snapshot = tree.getState();
    const layout = computeTreeLayout(snapshot, { showNilLeaves: true });

    expect(layout.nodes.length).toBeGreaterThan(3);

    // Root (50) should be positioned between children
    const rootNode = layout.nodes.find((n) => n.value === 50);
    const leftNode = layout.nodes.find((n) => n.value === 25);
    const rightNode = layout.nodes.find((n) => n.value === 75);

    expect(rootNode).toBeDefined();
    expect(leftNode).toBeDefined();
    expect(rightNode).toBeDefined();

    expect(leftNode!.x).toBeLessThan(rootNode!.x);
    expect(rightNode!.x).toBeGreaterThan(rootNode!.x);
    expect(leftNode!.y).toBeGreaterThan(rootNode!.y);
    expect(rightNode!.y).toBeGreaterThan(rootNode!.y);
  });

  it('assigns highlight roles to layout nodes', () => {
    const tree = new RedBlackTree();
    tree.insert(50);
    tree.insert(25);

    const snapshot = tree.getState();
    const layout = computeTreeLayout(snapshot, {
      showNilLeaves: false,
      roles: { current: 25, parent: 50 },
    });

    const node25 = layout.nodes.find((n) => n.value === 25);
    const node50 = layout.nodes.find((n) => n.value === 50);

    expect(node25?.role).toBe('current');
    expect(node25?.isCurrent).toBe(true);
    expect(node50?.role).toBe('parent');
    expect(node50?.isParent).toBe(true);
  });
});
