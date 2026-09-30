import { describe, it, expect, beforeEach } from 'vitest';
import { RedBlackTree } from '../RedBlackTree';
import { RBNode } from '../RBNode';
import {
  rotateLeft,
  rotateRight,
  rotateLeftRight,
  rotateRightLeft,
} from '../rotations';

describe('Rotations', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
    RBNode.resetIdCounter();
  });

  it('performs left rotation on root node and preserves BST inorder order', () => {
    //      20
    //     /  \
    //   10    40
    //        /  \
    //       30  50
    const n20 = new RBNode(20, 'BLACK');
    const n10 = new RBNode(10, 'BLACK');
    const n40 = new RBNode(40, 'RED');
    const n30 = new RBNode(30, 'BLACK');
    const n50 = new RBNode(50, 'BLACK');

    n20.left = n10;
    n10.parent = n20;
    n20.right = n40;
    n40.parent = n20;

    n40.left = n30;
    n30.parent = n40;
    n40.right = n50;
    n50.parent = n40;

    tree.root = n20;
    const initialInorder = tree.inorderTraversal();
    expect(initialInorder).toEqual([10, 20, 30, 40, 50]);

    const result = rotateLeft(tree, n20);

    expect(result.type).toBe('LEFT');
    expect(tree.root).toBe(n40);
    expect(n40.parent).toBeNull();
    expect(n40.left).toBe(n20);
    expect(n20.parent).toBe(n40);
    expect(n20.right).toBe(n30);
    expect(n30.parent).toBe(n20);
    expect(n40.right).toBe(n50);

    // BST order must be preserved exactly
    expect(tree.inorderTraversal()).toEqual(initialInorder);
  });

  it('performs right rotation on root node and preserves BST inorder order', () => {
    //         50
    //        /  \
    //       30  70
    //      /  \
    //     20  40
    const n50 = new RBNode(50, 'BLACK');
    const n30 = new RBNode(30, 'RED');
    const n70 = new RBNode(70, 'BLACK');
    const n20 = new RBNode(20, 'BLACK');
    const n40 = new RBNode(40, 'BLACK');

    n50.left = n30;
    n30.parent = n50;
    n50.right = n70;
    n70.parent = n50;

    n30.left = n20;
    n20.parent = n30;
    n30.right = n40;
    n40.parent = n30;

    tree.root = n50;
    const initialInorder = tree.inorderTraversal();
    expect(initialInorder).toEqual([20, 30, 40, 50, 70]);

    const result = rotateRight(tree, n50);

    expect(result.type).toBe('RIGHT');
    expect(tree.root).toBe(n30);
    expect(n30.parent).toBeNull();
    expect(n30.right).toBe(n50);
    expect(n50.parent).toBe(n30);
    expect(n50.left).toBe(n40);
    expect(n40.parent).toBe(n50);
    expect(n30.left).toBe(n20);

    // BST order must be preserved exactly
    expect(tree.inorderTraversal()).toEqual(initialInorder);
  });

  it('correctly updates parent link when rotating an internal child node', () => {
    // Parent root is 100, rotate right child 150 leftwards
    const root = new RBNode(100, 'BLACK');
    const right = new RBNode(150, 'BLACK');
    const rightRight = new RBNode(200, 'RED');

    root.right = right;
    right.parent = root;
    right.right = rightRight;
    rightRight.parent = right;
    tree.root = root;

    rotateLeft(tree, right);

    expect(root.right).toBe(rightRight);
    expect(rightRight.parent).toBe(root);
    expect(rightRight.left).toBe(right);
    expect(right.parent).toBe(rightRight);
  });

  it('performs Left-Right and Right-Left double rotations', () => {
    // Left-Right: 50 -> 20 -> 35
    const root1 = new RBNode(50, 'BLACK');
    const n20 = new RBNode(20, 'RED');
    const n35 = new RBNode(35, 'RED');

    root1.left = n20;
    n20.parent = root1;
    n20.right = n35;
    n35.parent = n20;
    tree.root = root1;

    rotateLeftRight(tree, root1);
    expect(tree.root).toBe(n35);
    expect(n35.left).toBe(n20);
    expect(n35.right).toBe(root1);
    expect(tree.inorderTraversal()).toEqual([20, 35, 50]);

    // Right-Left: 50 -> 80 -> 65
    const tree2 = new RedBlackTree();
    const root2 = new RBNode(50, 'BLACK');
    const n80 = new RBNode(80, 'RED');
    const n65 = new RBNode(65, 'RED');

    root2.right = n80;
    n80.parent = root2;
    n80.left = n65;
    n65.parent = n80;
    tree2.root = root2;

    rotateRightLeft(tree2, root2);
    expect(tree2.root).toBe(n65);
    expect(n65.left).toBe(root2);
    expect(n65.right).toBe(n80);
    expect(tree2.inorderTraversal()).toEqual([50, 65, 80]);
  });

  it('tracks rotation statistics accurately', () => {
    const root = new RBNode(20, 'BLACK');
    const right = new RBNode(30, 'RED');
    root.right = right;
    right.parent = root;
    tree.root = root;

    rotateLeft(tree, root);
    const stats = tree.getStatistics();
    expect(stats.rotations).toBe(1);
    expect(stats.leftRotations).toBe(1);
    expect(stats.rightRotations).toBe(0);
  });

  it('throws error when rotating without required child', () => {
    const single = new RBNode(50, 'BLACK');
    tree.root = single;
    expect(() => rotateLeft(tree, single)).toThrow();
    expect(() => rotateRight(tree, single)).toThrow();
  });
});
