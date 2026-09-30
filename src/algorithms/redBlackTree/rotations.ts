import { RBNode } from './RBNode';
import { RedBlackTree } from './RedBlackTree';

export interface RotationResult {
  type: 'LEFT' | 'RIGHT' | 'LEFT_RIGHT' | 'RIGHT_LEFT';
  nodeValue: number;
  pivotValue: number;
  newSubtreeRoot: RBNode;
  description: string;
}

/**
 * Performs a Left Rotation around node x.
 *
 *       x                  y
 *      / \                / \
 *     a   y     -->      x   c
 *        / \            / \
 *       b   c          a   b
 */
export function rotateLeft(tree: RedBlackTree, x: RBNode): RotationResult {
  if (!x.right || x.right.isNil) {
    throw new Error(`Cannot perform left rotation at node ${x.value}: right child is null/NIL`);
  }

  const y = x.right;
  const pivotVal = y.value ?? 0;
  const nodeVal = x.value ?? 0;

  // 1. Establish x's right child to be y's left child (b)
  x.right = y.left;
  if (y.left && !y.left.isNil) {
    y.left.parent = x;
  }

  // 2. Link y's parent to x's parent
  y.parent = x.parent;
  if (x.parent === null) {
    tree.root = y;
  } else if (x.isLeftChild()) {
    x.parent.left = y;
  } else {
    x.parent.right = y;
  }

  // 3. Put x on y's left
  y.left = x;
  x.parent = y;

  // 4. Update tree statistics
  const stats = tree.getStatistics();
  stats.rotations++;
  stats.leftRotations++;

  return {
    type: 'LEFT',
    nodeValue: nodeVal,
    pivotValue: pivotVal,
    newSubtreeRoot: y,
    description: `LEFT ROTATION @ ${nodeVal} with pivot ${pivotVal}`,
  };
}

/**
 * Performs a Right Rotation around node y.
 *
 *         y                x
 *        / \              / \
 *       x   c   -->      a   y
 *      / \                  / \
 *     a   b                b   c
 */
export function rotateRight(tree: RedBlackTree, y: RBNode): RotationResult {
  if (!y.left || y.left.isNil) {
    throw new Error(`Cannot perform right rotation at node ${y.value}: left child is null/NIL`);
  }

  const x = y.left;
  const pivotVal = x.value ?? 0;
  const nodeVal = y.value ?? 0;

  // 1. Establish y's left child to be x's right child (b)
  y.left = x.right;
  if (x.right && !x.right.isNil) {
    x.right.parent = y;
  }

  // 2. Link x's parent to y's parent
  x.parent = y.parent;
  if (y.parent === null) {
    tree.root = x;
  } else if (y.isRightChild()) {
    y.parent.right = x;
  } else {
    y.parent.left = x;
  }

  // 3. Put y on x's right
  x.right = y;
  y.parent = x;

  // 4. Update tree statistics
  const stats = tree.getStatistics();
  stats.rotations++;
  stats.rightRotations++;

  return {
    type: 'RIGHT',
    nodeValue: nodeVal,
    pivotValue: pivotVal,
    newSubtreeRoot: x,
    description: `RIGHT ROTATION @ ${nodeVal} with pivot ${pivotVal}`,
  };
}

/**
 * Performs a Left-Right Double Rotation around node z.
 * (Left rotation on z.left, followed by Right rotation on z)
 */
export function rotateLeftRight(tree: RedBlackTree, z: RBNode): RotationResult {
  if (!z.left || z.left.isNil) {
    throw new Error(`Cannot perform left-right rotation at node ${z.value}: left child is missing`);
  }
  const child = z.left;
  const leftRes = rotateLeft(tree, child);
  const rightRes = rotateRight(tree, z);

  return {
    type: 'LEFT_RIGHT',
    nodeValue: z.value ?? 0,
    pivotValue: leftRes.pivotValue,
    newSubtreeRoot: rightRes.newSubtreeRoot,
    description: `LEFT-RIGHT ROTATION: Left rotate @ ${child.value}, then Right rotate @ ${z.value}`,
  };
}

/**
 * Performs a Right-Left Double Rotation around node z.
 * (Right rotation on z.right, followed by Left rotation on z)
 */
export function rotateRightLeft(tree: RedBlackTree, z: RBNode): RotationResult {
  if (!z.right || z.right.isNil) {
    throw new Error(`Cannot perform right-left rotation at node ${z.value}: right child is missing`);
  }
  const child = z.right;
  const rightRes = rotateRight(tree, child);
  const leftRes = rotateLeft(tree, z);

  return {
    type: 'RIGHT_LEFT',
    nodeValue: z.value ?? 0,
    pivotValue: rightRes.pivotValue,
    newSubtreeRoot: leftRes.newSubtreeRoot,
    description: `RIGHT-LEFT ROTATION: Right rotate @ ${child.value}, then Left rotate @ ${z.value}`,
  };
}
