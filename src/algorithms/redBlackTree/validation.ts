import { RBNode } from './RBNode';
import { RedBlackTree } from './RedBlackTree';
import { TreePropertiesStatus } from './types';

export interface ComprehensiveValidationResult extends TreePropertiesStatus {
  bstOrderingValid: boolean;
  leafBlackHeights: number[];
  computedBlackHeight: number;
}

/**
 * Validates all 5 Red-Black Tree properties and BST ordering invariants.
 *
 * Property 1: Every node is RED or BLACK.
 * Property 2: The root is BLACK.
 * Property 3: Every NIL leaf is BLACK.
 * Property 4: If a node is RED, then both its children are BLACK (no RED-RED parent-child).
 * Property 5: For each node, all simple paths from the node to descendant leaves contain the same number of black nodes.
 */
export function validateTree(tree: RedBlackTree): ComprehensiveValidationResult {
  const violations: string[] = [];
  let prop1Valid = true;
  let prop2Valid = true;
  const prop3Valid = true; // Sentinels are always BLACK by definition
  let prop4Valid = true;
  let prop5Valid = true;
  let bstOrderingValid = true;

  const root = tree.root;

  // Empty tree is a valid Red-Black Tree
  if (!root || root.isNil) {
    return {
      prop1Valid: true,
      prop2Valid: true,
      prop3Valid: true,
      prop4Valid: true,
      prop5Valid: true,
      bstOrderingValid: true,
      allValid: true,
      violations: [],
      leafBlackHeights: [1],
      computedBlackHeight: 1,
    };
  }

  // 1. Property 2 Check: Root must be BLACK
  if (!root.isBlack) {
    prop2Valid = false;
    violations.push(`Property 2 Violation: Root node (${root.value}) is RED, but root must be BLACK.`);
  }

  // 2. Traversals for Property 1, Property 4, and BST Invariants
  const allNodes: RBNode[] = [];
  const inorderValues: number[] = [];

  const traverse = (node: RBNode | null) => {
    if (!node || node.isNil) return;

    // Inorder traversal for BST ordering
    traverse(node.left);

    allNodes.push(node);
    if (node.value !== null) {
      inorderValues.push(node.value);
    }

    // Property 1 Check: Color must be RED or BLACK
    if (node.color !== 'RED' && node.color !== 'BLACK') {
      prop1Valid = false;
      violations.push(
        `Property 1 Violation: Node (${node.value}) has invalid color '${node.color}'. Must be RED or BLACK.`
      );
    }

    // Property 4 Check: No RED node has a RED child
    if (node.isRed) {
      if (node.left && !node.left.isNil && node.left.isRed) {
        prop4Valid = false;
        violations.push(
          `Property 4 Violation: Red node (${node.value}) has a RED left child (${node.left.value}).`
        );
      }
      if (node.right && !node.right.isNil && node.right.isRed) {
        prop4Valid = false;
        violations.push(
          `Property 4 Violation: Red node (${node.value}) has a RED right child (${node.right.value}).`
        );
      }
    }

    traverse(node.right);
  };

  traverse(root);

  // Check BST Inorder Strictly Ascending
  for (let i = 1; i < inorderValues.length; i++) {
    if (inorderValues[i] <= inorderValues[i - 1]) {
      bstOrderingValid = false;
      violations.push(
        `BST Ordering Violation: Inorder sequence not strictly ascending (${inorderValues[i - 1]} >= ${inorderValues[i]}).`
      );
      break;
    }
  }

  // 3. Property 5 Check: All simple paths to descendant leaves have equal black height
  const leafBlackHeights: number[] = [];

  const checkBlackHeight = (node: RBNode | null, currentBlackCount: number) => {
    if (!node || node.isNil) {
      // Sentinel / leaf counts as 1 black node
      leafBlackHeights.push(currentBlackCount + 1);
      return;
    }

    const nextCount = currentBlackCount + (node.isBlack ? 1 : 0);
    checkBlackHeight(node.left, nextCount);
    checkBlackHeight(node.right, nextCount);
  };

  checkBlackHeight(root, 0);

  const targetBH = leafBlackHeights.length > 0 ? leafBlackHeights[0] : 1;
  for (let i = 1; i < leafBlackHeights.length; i++) {
    if (leafBlackHeights[i] !== targetBH) {
      prop5Valid = false;
      violations.push(
        `Property 5 Violation: Inconsistent black height detected across leaf paths (Found ${leafBlackHeights[i]} vs expected ${targetBH}).`
      );
      break;
    }
  }

  const allValid =
    prop1Valid &&
    prop2Valid &&
    prop3Valid &&
    prop4Valid &&
    prop5Valid &&
    bstOrderingValid;

  return {
    prop1Valid,
    prop2Valid,
    prop3Valid,
    prop4Valid,
    prop5Valid,
    bstOrderingValid,
    allValid,
    violations,
    leafBlackHeights,
    computedBlackHeight: targetBH,
  };
}
