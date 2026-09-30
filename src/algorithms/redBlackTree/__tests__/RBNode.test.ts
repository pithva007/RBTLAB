import { describe, it, expect, beforeEach } from 'vitest';
import { RBNode } from '../RBNode';

describe('RBNode', () => {
  beforeEach(() => {
    RBNode.resetIdCounter();
  });

  it('creates a standard red node by default', () => {
    const node = new RBNode(42);
    expect(node.value).toBe(42);
    expect(node.color).toBe('RED');
    expect(node.isRed).toBe(true);
    expect(node.isBlack).toBe(false);
    expect(node.isNil).toBe(false);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
    expect(node.parent).toBeNull();
    expect(node.role).toBe('normal');
  });

  it('creates a nil sentinel black node', () => {
    const nil = RBNode.createNil();
    expect(nil.value).toBeNull();
    expect(nil.color).toBe('BLACK');
    expect(nil.isNil).toBe(true);
    expect(nil.isBlack).toBe(true);
    expect(nil.isRed).toBe(false);
  });

  it('identifies left and right child relationships correctly', () => {
    const parent = new RBNode(50, 'BLACK');
    const leftChild = new RBNode(25, 'RED');
    const rightChild = new RBNode(75, 'RED');

    parent.left = leftChild;
    leftChild.parent = parent;

    parent.right = rightChild;
    rightChild.parent = parent;

    expect(leftChild.isLeftChild()).toBe(true);
    expect(leftChild.isRightChild()).toBe(false);
    expect(rightChild.isLeftChild()).toBe(false);
    expect(rightChild.isRightChild()).toBe(true);
    expect(parent.isLeftChild()).toBe(false);
    expect(parent.isRightChild()).toBe(false);
  });

  it('retrieves sibling node accurately', () => {
    const parent = new RBNode(50, 'BLACK');
    const left = new RBNode(30, 'RED');
    const right = new RBNode(70, 'RED');

    parent.left = left;
    left.parent = parent;
    parent.right = right;
    right.parent = parent;

    expect(left.getSibling()).toBe(right);
    expect(right.getSibling()).toBe(left);
    expect(parent.getSibling()).toBeNull();
  });

  it('retrieves grandparent and uncle in both configurations', () => {
    // Left-Left setup
    const gp = new RBNode(100, 'BLACK');
    const parentLeft = new RBNode(50, 'RED');
    const uncleRight = new RBNode(150, 'RED');
    const child = new RBNode(25, 'RED');

    gp.left = parentLeft;
    parentLeft.parent = gp;

    gp.right = uncleRight;
    uncleRight.parent = gp;

    parentLeft.left = child;
    child.parent = parentLeft;

    expect(child.getGrandparent()).toBe(gp);
    expect(child.getUncle()).toBe(uncleRight);

    // Right-Right setup
    const childRight = new RBNode(175, 'RED');
    uncleRight.right = childRight;
    childRight.parent = uncleRight;

    expect(childRight.getGrandparent()).toBe(gp);
    expect(childRight.getUncle()).toBe(parentLeft);
  });

  it('clones a node subtree and preserves links', () => {
    const parent = new RBNode(50, 'BLACK');
    const left = new RBNode(25, 'RED');
    parent.left = left;
    left.parent = parent;

    const cloned = parent.clone();
    expect(cloned.value).toBe(50);
    expect(cloned.color).toBe('BLACK');
    expect(cloned.left?.value).toBe(25);
    expect(cloned.left?.parent).toBe(cloned);
    expect(cloned.left).not.toBe(left);
  });

  it('serializes a tree to JSON-compatible structure', () => {
    const node = new RBNode(10, 'BLACK');
    node.left = new RBNode(5, 'RED');
    node.left.parent = node;

    const serialized = node.serialize();
    expect(serialized.value).toBe(10);
    expect(serialized.color).toBe('BLACK');
    expect(serialized.left?.value).toBe(5);
    expect(serialized.left?.color).toBe('RED');
  });
});
