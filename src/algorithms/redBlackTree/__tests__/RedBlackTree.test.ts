import { describe, it, expect, beforeEach } from 'vitest';
import { RedBlackTree } from '../RedBlackTree';
import { RBNode } from '../RBNode';

describe('RedBlackTree Core Structure', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
    RBNode.resetIdCounter();
  });

  it('initializes with empty tree and correct zero stats', () => {
    expect(tree.isEmpty()).toBe(true);
    expect(tree.getRoot()).toBeNull();
    const stats = tree.getStatistics();
    expect(stats.nodes).toBe(0);
    expect(stats.height).toBe(0);
    expect(stats.rotations).toBe(0);
  });

  it('computes traversals and searches properly on constructed tree', () => {
    // Manually assemble a valid BST for structure testing
    const root = new RBNode(50, 'BLACK');
    const left = new RBNode(25, 'RED');
    const right = new RBNode(75, 'RED');
    const leftLeft = new RBNode(10, 'BLACK');
    const leftRight = new RBNode(35, 'BLACK');

    root.left = left;
    left.parent = root;
    root.right = right;
    right.parent = root;

    left.left = leftLeft;
    leftLeft.parent = left;
    left.right = leftRight;
    leftRight.parent = left;

    tree.root = root;

    expect(tree.isEmpty()).toBe(false);
    expect(tree.getNodeCount()).toBe(5);
    expect(tree.getHeight()).toBe(3);

    // Inorder: 10, 25, 35, 50, 75
    expect(tree.inorderTraversal()).toEqual([10, 25, 35, 50, 75]);
    // Preorder: 50, 25, 10, 35, 75
    expect(tree.preorderTraversal()).toEqual([50, 25, 10, 35, 75]);
    // Postorder: 10, 35, 25, 75, 50
    expect(tree.postorderTraversal()).toEqual([10, 35, 25, 75, 50]);

    // Search existing
    const searchFound = tree.search(35);
    expect(searchFound.found).toBe(true);
    expect(searchFound.node?.value).toBe(35);
    expect(searchFound.comparisons).toBe(3); // root (50) -> left (25) -> right (35)
    expect(searchFound.path.map((n) => n.value)).toEqual([50, 25, 35]);

    // Search non-existing
    const searchNotFound = tree.search(99);
    expect(searchNotFound.found).toBe(false);
    expect(searchNotFound.node).toBeNull();
    expect(searchNotFound.comparisons).toBe(2); // root (50) -> right (75) -> right (null)

    // Min and Max
    expect(tree.findMin()?.value).toBe(10);
    expect(tree.findMax()?.value).toBe(75);
  });

  it('updates statistics and counts colors accurately', () => {
    const root = new RBNode(20, 'BLACK');
    const left = new RBNode(10, 'RED');
    const right = new RBNode(30, 'BLACK');

    root.left = left;
    left.parent = root;
    root.right = right;
    right.parent = root;
    tree.root = root;

    const stats = tree.getStatistics();
    expect(stats.nodes).toBe(3);
    expect(stats.redNodes).toBe(1);
    expect(stats.blackNodes).toBe(2);
    expect(stats.height).toBe(2);

    tree.clear();
    expect(tree.isEmpty()).toBe(true);
    expect(tree.getNodeCount()).toBe(0);
  });
});
