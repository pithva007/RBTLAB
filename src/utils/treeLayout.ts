import { SerializedRBNode, NodeRole } from '../algorithms/redBlackTree/types';
import { HighlightRoles } from '../algorithms/redBlackTree/events';

export interface LayoutNode {
  id: string;
  value: number | null;
  color: 'RED' | 'BLACK' | 'DOUBLE_BLACK';
  isNil: boolean;
  x: number;
  y: number;
  depth: number;
  role: NodeRole;
  isCurrent?: boolean;
  isParent?: boolean;
  isGrandparent?: boolean;
  isUncle?: boolean;
  isSibling?: boolean;
  isSuccessor?: boolean;
  originalNode: SerializedRBNode;
}

export interface LayoutEdge {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceId: string;
  targetId: string;
  isToNil: boolean;
}

export interface TreeLayoutResult {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
}

export interface LayoutOptions {
  nodeRadius?: number;
  levelHeight?: number;
  minSpacing?: number;
  showNilLeaves?: boolean;
  roles?: HighlightRoles;
}

/**
 * Computes non-overlapping 2D layout coordinates for a Red-Black Tree.
 * Uses a modified Reingold-Tilford aesthetic layout suited for binary trees.
 */
export function computeTreeLayout(
  root: SerializedRBNode | null,
  options: LayoutOptions = {}
): TreeLayoutResult {
  const {
    nodeRadius = 24,
    levelHeight = 80,
    minSpacing = 64,
    showNilLeaves = true,
    roles = {},
  } = options;

  if (!root) {
    return {
      nodes: [],
      edges: [],
      bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 },
    };
  }

  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];

  // Track position map and subtree widths
  let nextX = 50;

  function determineRole(val: number | null, isNil: boolean): NodeRole {
    if (isNil || val === null) return 'normal';
    if (roles.current === val) return 'current';
    if (roles.parent === val) return 'parent';
    if (roles.grandparent === val) return 'grandparent';
    if (roles.uncle === val) return 'uncle';
    if (roles.sibling === val) return 'sibling';
    if (roles.successor === val) return 'successor';
    return 'normal';
  }

  // First pass: postorder traversal to position leaves and parents
  function layoutSubtree(
    node: SerializedRBNode,
    depth: number
  ): { x: number; y: number; minX: number; maxX: number } {
    const y = 50 + depth * levelHeight;

    const hasLeftChild = node.left && (!node.left.isNil || showNilLeaves);
    const hasRightChild = node.right && (!node.right.isNil || showNilLeaves);

    // Leaf node or showing NIL
    if (!hasLeftChild && !hasRightChild) {
      const x = nextX;
      nextX += minSpacing;

      const role = determineRole(node.value, node.isNil);
      nodes.push({
        id: node.id,
        value: node.value,
        color: node.color,
        isNil: node.isNil,
        x,
        y,
        depth,
        role,
        isCurrent: roles.current === node.value,
        isParent: roles.parent === node.value,
        isGrandparent: roles.grandparent === node.value,
        isUncle: roles.uncle === node.value,
        isSibling: roles.sibling === node.value,
        isSuccessor: roles.successor === node.value,
        originalNode: node,
      });

      return { x, y, minX: x, maxX: x };
    }

    let leftResult: { x: number; y: number } | null = null;
    let rightResult: { x: number; y: number } | null = null;

    if (hasLeftChild && node.left) {
      leftResult = layoutSubtree(node.left, depth + 1);
    }

    // Position current node between children, or relative to single child
    let currentX: number;
    if (leftResult && !hasRightChild) {
      currentX = nextX;
      nextX += minSpacing;
    } else if (!leftResult && hasRightChild) {
      currentX = nextX;
      nextX += minSpacing;
    } else {
      currentX = 0; // Will be set after right child
    }

    if (hasRightChild && node.right) {
      rightResult = layoutSubtree(node.right, depth + 1);
    }

    if (leftResult && rightResult) {
      currentX = (leftResult.x + rightResult.x) / 2;
    } else if (leftResult) {
      currentX = leftResult.x + minSpacing / 2;
    } else if (rightResult) {
      currentX = rightResult.x - minSpacing / 2;
    }

    const role = determineRole(node.value, node.isNil);
    nodes.push({
      id: node.id,
      value: node.value,
      color: node.color,
      isNil: node.isNil,
      x: currentX,
      y,
      depth,
      role,
      isCurrent: roles.current === node.value,
      isParent: roles.parent === node.value,
      isGrandparent: roles.grandparent === node.value,
      isUncle: roles.uncle === node.value,
      isSibling: roles.sibling === node.value,
      isSuccessor: roles.successor === node.value,
      originalNode: node,
    });

    // Add edges
    if (leftResult && node.left) {
      edges.push({
        id: `edge_${node.id}_to_${node.left.id}`,
        sourceX: currentX,
        sourceY: y + (node.isNil ? 10 : nodeRadius),
        targetX: leftResult.x,
        targetY: leftResult.y - (node.left.isNil ? 10 : nodeRadius),
        sourceId: node.id,
        targetId: node.left.id,
        isToNil: node.left.isNil,
      });
    }

    if (rightResult && node.right) {
      edges.push({
        id: `edge_${node.id}_to_${node.right.id}`,
        sourceX: currentX,
        sourceY: y + (node.isNil ? 10 : nodeRadius),
        targetX: rightResult.x,
        targetY: rightResult.y - (node.right.isNil ? 10 : nodeRadius),
        sourceId: node.id,
        targetId: node.right.id,
        isToNil: node.right.isNil,
      });
    }

    const minX = leftResult ? leftResult.x : currentX;
    const maxX = rightResult ? rightResult.x : currentX;

    return { x: currentX, y, minX, maxX };
  }

  layoutSubtree(root, 0);

  // Compute total bounds with margin
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  const padding = 60;
  const bounds = {
    minX: minX - padding,
    maxX: maxX + padding,
    minY: minY - padding,
    maxY: maxY + padding,
    width: Math.max(300, maxX - minX + padding * 2),
    height: Math.max(200, maxY - minY + padding * 2),
  };

  return { nodes, edges, bounds };
}
