import { RBNode } from './RBNode';
import { RedBlackTree } from './RedBlackTree';
import { DeleteBalancingCase, SerializedRBNode } from './types';
import { rotateLeft, rotateRight } from './rotations';

export interface DeleteStepLog {
  step: number;
  phase:
    | 'LOCATE_NODE'
    | 'ANALYZE_CHILDREN'
    | 'FIND_SUCCESSOR'
    | 'REPLACE_VALUE'
    | 'SPLICE_OUT'
    | 'DOUBLE_BLACK_DETECTED'
    | 'IDENTIFY_SIBLING'
    | 'APPLY_CASE'
    | 'RECOLOR'
    | 'ROTATION'
    | 'ROOT_CORRECTION'
    | 'DELETION_COMPLETE';
  message: string;
  explanation: string;
  balancingCase?: DeleteBalancingCase;
  violatedProperty?: string;
  nodeRoles: {
    current?: number | null;
    sibling?: number | null;
    parent?: number | null;
    successor?: number | null;
  };
  treeSnapshot: SerializedRBNode | null;
}

export interface DeleteResult {
  deleted: boolean;
  steps: DeleteStepLog[];
  deletedValue: number;
}

export function deleteWithTrace(tree: RedBlackTree, value: number): DeleteResult {
  const steps: DeleteStepLog[] = [];
  let stepCount = 0;

  const logStep = (
    phase: DeleteStepLog['phase'],
    message: string,
    explanation: string,
    roles: DeleteStepLog['nodeRoles'] = {},
    balancingCase?: DeleteBalancingCase,
    violatedProperty?: string
  ) => {
    stepCount++;
    steps.push({
      step: stepCount,
      phase,
      message,
      explanation,
      balancingCase,
      violatedProperty,
      nodeRoles: roles,
      treeSnapshot: tree.getState(),
    });
  };

  logStep(
    'LOCATE_NODE',
    `DELETE ${value}`,
    `Search tree to locate node with value ${value} for deletion.`,
    { current: value }
  );

  const searchRes = tree.search(value);
  const z = searchRes.node;

  if (!z) {
    logStep(
      'DELETION_COMPLETE',
      `Value ${value} not found`,
      `Cannot delete ${value} because it does not exist in the Red-Black Tree.`,
      { current: value }
    );
    return { deleted: false, steps, deletedValue: value };
  }

  logStep(
    'LOCATE_NODE',
    `Found node ${value} (${z.color})`,
    `Node with value ${value} located. Examining children to determine deletion strategy.`,
    { current: value }
  );

  // Determine node y to physically remove and child x
  let y: RBNode = z;
  let yOriginalColor = y.color;
  let x: RBNode | null = null;
  let isTempNil = false;

  const hasLeft = z.left !== null && !z.left.isNil;
  const hasRight = z.right !== null && !z.right.isNil;

  if (!hasLeft || !hasRight) {
    // 0 or 1 child
    logStep(
      'ANALYZE_CHILDREN',
      `Node ${value} has ${!hasLeft && !hasRight ? 'no children (leaf)' : 'one child'}`,
      !hasLeft && !hasRight
        ? `Node ${value} is a leaf node. It will be directly spliced out.`
        : `Node ${value} has a single child. Splicing node out and promoting its child directly.`,
      { current: value },
      !hasLeft && !hasRight ? 'NODE_RED_LEAF' : 'ONE_CHILD_REPLACE'
    );
    y = z;
  } else {
    // 2 children -> Find inorder successor (minimum of right subtree)
    logStep(
      'ANALYZE_CHILDREN',
      `Node ${value} has two children`,
      `Node has both left and right children. Must find its inorder successor (smallest key in right subtree) to replace its value.`,
      { current: value },
      'INORDER_SUCCESSOR'
    );

    y = tree.findMin(z.right)!;

    logStep(
      'FIND_SUCCESSOR',
      `Inorder successor is ${y.value} (${y.color})`,
      `Found inorder successor ${y.value}. Successor has at most one child (right child).`,
      { current: value, successor: y.value },
      'INORDER_SUCCESSOR'
    );
  }

  yOriginalColor = y.color;

  // Determine x (the child that moves into y's position)
  if (y.left && !y.left.isNil) {
    x = y.left;
  } else if (y.right && !y.right.isNil) {
    x = y.right;
  } else {
    // y is a leaf. Create a temporary sentinel NIL to hold parent pointer during fixup
    x = RBNode.createNil(y.parent);
    isTempNil = true;
  }

  // Splice y out
  const yParent = y.parent;
  if (x) {
    x.parent = yParent;
  }

  if (yParent === null) {
    tree.root = x && !x.isNil ? x : null;
  } else if (y === yParent.left) {
    yParent.left = x;
  } else {
    yParent.right = x;
  }

  logStep(
    'SPLICE_OUT',
    `Spliced out node ${y.value} (${yOriginalColor})`,
    `Detached node ${y.value} from parent ${yParent ? yParent.value : 'none (was root)'}.`,
    { current: y.value, parent: yParent?.value }
  );

  // If y was successor, replace z's value with y's value
  if (y !== z) {
    logStep(
      'REPLACE_VALUE',
      `Replaced node ${z.value} value with successor ${y.value}`,
      `Copied value ${y.value} into target node to maintain BST ordering.`,
      { current: y.value, successor: z.value },
      'INORDER_SUCCESSOR'
    );
    z.value = y.value;
  }

  tree.getStatistics().deleteOperations++;

  // If y was RED, deleting it preserves all Red-Black properties!
  if (yOriginalColor === 'RED') {
    logStep(
      'DELETION_COMPLETE',
      `Node was RED -> No balancing required`,
      `Deleting a RED node does not alter black height (Property 5) and cannot create a Red-Red violation. Tree remains fully balanced.`,
      { current: value },
      'NODE_RED_LEAF'
    );

    if (isTempNil && x && x.parent) {
      if (x === x.parent.left) x.parent.left = null;
      else if (x === x.parent.right) x.parent.right = null;
    }

    tree.updateStatistics();
    return { deleted: true, steps, deletedValue: value };
  }

  // y was BLACK -> Double Black violation on x
  logStep(
    'DOUBLE_BLACK_DETECTED',
    `Deleted node was BLACK -> Double-Black violation on ${x && !x.isNil ? x.value : 'NIL child'}`,
    `Removing a BLACK node reduces black height by 1 along paths through its position. The child ${x && !x.isNil ? x.value : 'NIL'} receives an extra unit of blackness (DOUBLE-BLACK).`,
    { current: x && !x.isNil ? x.value : null, parent: x?.parent?.value },
    undefined,
    'Property 5: Equal black height along all paths'
  );

  // Execute Double-Black Fixup
  deleteFixup(tree, x, logStep);

  // Remove temporary sentinel if present
  if (isTempNil && x) {
    if (x.parent) {
      if (x === x.parent.left) x.parent.left = null;
      else if (x === x.parent.right) x.parent.right = null;
    }
    if (tree.root === x) {
      tree.root = null;
    }
  }

  if (tree.root && tree.root.isNil) {
    tree.root = null;
  }

  if (tree.root) {
    tree.root.color = 'BLACK';
  }

  tree.updateStatistics();

  logStep(
    'DELETION_COMPLETE',
    `Tree balanced after deleting ${value}`,
    `All Red-Black Tree invariants fully restored and verified.`,
    { current: value }
  );

  return { deleted: true, steps, deletedValue: value };
}

/**
 * Red-Black Deletion Balancing Fixup (CLRS 4-Case Double-Black Elimination)
 */
function deleteFixup(
  tree: RedBlackTree,
  initialX: RBNode | null,
  logStep: (
    phase: DeleteStepLog['phase'],
    message: string,
    explanation: string,
    roles?: DeleteStepLog['nodeRoles'],
    balancingCase?: DeleteBalancingCase,
    violatedProperty?: string
  ) => void
): void {
  let x = initialX;

  while (x !== tree.root && (x === null || x.isBlack)) {
    const parent = x ? x.parent : null;
    if (!parent) break;

    const isLeftChild = x === parent.left;
    let sibling = isLeftChild ? parent.right : parent.left;

    logStep(
      'IDENTIFY_SIBLING',
      `Identified sibling: ${sibling && !sibling.isNil ? sibling.value : 'NIL'} (${sibling?.color ?? 'BLACK'})`,
      `Checking sibling node of double-black position to determine which CLRS deletion case applies.`,
      {
        current: x && !x.isNil ? x.value : null,
        parent: parent.value,
        sibling: sibling && !sibling.isNil ? sibling.value : null,
      }
    );

    if (isLeftChild) {
      // Sibling is parent.right
      if (sibling && sibling.isRed) {
        // CASE 1: Sibling is RED
        logStep(
          'APPLY_CASE',
          `Deletion Case 1: Sibling ${sibling.value} is RED`,
          `Recolor sibling to BLACK, parent to RED, and perform Left Rotation at parent ${parent.value}. This converts to a case where sibling is BLACK.`,
          {
            current: x && !x.isNil ? x.value : null,
            parent: parent.value,
            sibling: sibling.value,
          },
          'DB_SIBLING_RED'
        );

        sibling.color = 'BLACK';
        parent.color = 'RED';
        tree.recordRecoloring(2);
        rotateLeft(tree, parent);
        sibling = parent.right;
      }

      const sibLeftBlack = !sibling || !sibling.left || sibling.left.isNil || sibling.left.isBlack;
      const sibRightBlack = !sibling || !sibling.right || sibling.right.isNil || sibling.right.isBlack;

      if (sibLeftBlack && sibRightBlack) {
        // CASE 2: Sibling is BLACK and both sibling children are BLACK
        logStep(
          'APPLY_CASE',
          `Deletion Case 2: Sibling ${sibling && !sibling.isNil ? sibling.value : 'NIL'} is BLACK and both children are BLACK`,
          `Recolor sibling to RED. Double-black moves up to parent ${parent.value}.`,
          {
            current: x && !x.isNil ? x.value : null,
            parent: parent.value,
            sibling: sibling && !sibling.isNil ? sibling.value : null,
          },
          'DB_SIBLING_BLACK_BOTH_CHILDREN_BLACK'
        );

        if (sibling && !sibling.isNil) {
          sibling.color = 'RED';
          tree.recordRecoloring(1);
        }
        x = parent;
      } else {
        // At least one child of sibling is RED
        if (sibRightBlack) {
          // CASE 3: Near child (left) is RED, far child (right) is BLACK
          logStep(
            'APPLY_CASE',
            `Deletion Case 3: Sibling ${sibling!.value} is BLACK, near child ${sibling!.left?.value} is RED, far child is BLACK`,
            `Recolor sibling's left child to BLACK, sibling to RED, and perform Right Rotation at sibling ${sibling!.value}. This transforms into Case 4.`,
            {
              parent: parent.value,
              sibling: sibling!.value,
            },
            'DB_SIBLING_BLACK_NEAR_CHILD_RED'
          );

          if (sibling && sibling.left) {
            sibling.left.color = 'BLACK';
            sibling.color = 'RED';
            tree.recordRecoloring(2);
            rotateRight(tree, sibling);
            sibling = parent.right;
          }
        }

        // CASE 4: Far child (right) is RED
        logStep(
          'APPLY_CASE',
          `Deletion Case 4: Sibling ${sibling && !sibling.isNil ? sibling.value : 'NIL'} is BLACK, far child ${sibling?.right?.value} is RED`,
          `Set sibling's color to parent's color, parent to BLACK, sibling's right child to BLACK, and perform Left Rotation at parent ${parent.value}. Double-black is eliminated.`,
          {
            parent: parent.value,
            sibling: sibling?.value,
          },
          'DB_SIBLING_BLACK_FAR_CHILD_RED'
        );

        if (sibling) {
          sibling.color = parent.color;
          parent.color = 'BLACK';
          if (sibling.right) {
            sibling.right.color = 'BLACK';
          }
          tree.recordRecoloring(3);
          rotateLeft(tree, parent);
        }
        x = tree.root; // Terminate loop
      }
    } else {
      // Mirror Right Child: Sibling is parent.left
      if (sibling && sibling.isRed) {
        // CASE 1 Mirror: Sibling is RED
        logStep(
          'APPLY_CASE',
          `Deletion Case 1 (Mirror): Sibling ${sibling.value} is RED`,
          `Recolor sibling to BLACK, parent to RED, and perform Right Rotation at parent ${parent.value}.`,
          {
            parent: parent.value,
            sibling: sibling.value,
          },
          'DB_SIBLING_RED'
        );

        sibling.color = 'BLACK';
        parent.color = 'RED';
        tree.recordRecoloring(2);
        rotateRight(tree, parent);
        sibling = parent.left;
      }

      const sibLeftBlack = !sibling || !sibling.left || sibling.left.isNil || sibling.left.isBlack;
      const sibRightBlack = !sibling || !sibling.right || sibling.right.isNil || sibling.right.isBlack;

      if (sibLeftBlack && sibRightBlack) {
        // CASE 2 Mirror: Sibling is BLACK and both children BLACK
        logStep(
          'APPLY_CASE',
          `Deletion Case 2 (Mirror): Sibling ${sibling && !sibling.isNil ? sibling.value : 'NIL'} is BLACK and both children are BLACK`,
          `Recolor sibling to RED. Double-black moves up to parent ${parent.value}.`,
          {
            parent: parent.value,
            sibling: sibling && !sibling.isNil ? sibling.value : null,
          },
          'DB_SIBLING_BLACK_BOTH_CHILDREN_BLACK'
        );

        if (sibling && !sibling.isNil) {
          sibling.color = 'RED';
          tree.recordRecoloring(1);
        }
        x = parent;
      } else {
        if (sibLeftBlack) {
          // CASE 3 Mirror: Near child (right) is RED, far child (left) is BLACK
          logStep(
            'APPLY_CASE',
            `Deletion Case 3 (Mirror): Sibling ${sibling!.value} is BLACK, near child ${sibling!.right?.value} is RED`,
            `Recolor sibling's right child to BLACK, sibling to RED, and perform Left Rotation at sibling ${sibling!.value}.`,
            {
              parent: parent.value,
              sibling: sibling!.value,
            },
            'DB_SIBLING_BLACK_NEAR_CHILD_RED'
          );

          if (sibling && sibling.right) {
            sibling.right.color = 'BLACK';
            sibling.color = 'RED';
            tree.recordRecoloring(2);
            rotateLeft(tree, sibling);
            sibling = parent.left;
          }
        }

        // CASE 4 Mirror: Far child (left) is RED
        logStep(
          'APPLY_CASE',
          `Deletion Case 4 (Mirror): Sibling ${sibling && !sibling.isNil ? sibling.value : 'NIL'} is BLACK, far child ${sibling?.left?.value} is RED`,
          `Set sibling's color to parent's color, parent to BLACK, sibling's left child to BLACK, and perform Right Rotation at parent ${parent.value}. Double-black eliminated.`,
          {
            parent: parent.value,
            sibling: sibling?.value,
          },
          'DB_SIBLING_BLACK_FAR_CHILD_RED'
        );

        if (sibling) {
          sibling.color = parent.color;
          parent.color = 'BLACK';
          if (sibling.left) {
            sibling.left.color = 'BLACK';
          }
          tree.recordRecoloring(3);
          rotateRight(tree, parent);
        }
        x = tree.root;
      }
    }
  }

  if (x && !x.isNil) {
    if (x.color !== 'BLACK') {
      logStep(
        'ROOT_CORRECTION',
        `Recolor node ${x.value} to BLACK to complete fixup`,
        `Extra black absorbed by node ${x.value}.`,
        { current: x.value }
      );
      x.color = 'BLACK';
      tree.recordRecoloring(1);
    }
  }
}

export function deleteNode(tree: RedBlackTree, value: number): boolean {
  return deleteWithTrace(tree, value).deleted;
}
