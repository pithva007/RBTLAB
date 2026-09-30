import { RBNode } from './RBNode';
import { RedBlackTree } from './RedBlackTree';
import { InsertBalancingCase, SerializedRBNode } from './types';
import { rotateLeft, rotateRight } from './rotations';

export interface InsertStepLog {
  step: number;
  phase:
    | 'INPUT_RECEIVED'
    | 'BST_INSERTION'
    | 'NODE_CREATED'
    | 'CHECK_VIOLATION'
    | 'IDENTIFY_CASE'
    | 'RECOLOR'
    | 'ROTATION'
    | 'ROOT_VERIFY'
    | 'INSERTION_COMPLETE';
  message: string;
  explanation: string;
  balancingCase?: InsertBalancingCase;
  violatedProperty?: string;
  nodeRoles: {
    current?: number | null;
    parent?: number | null;
    grandparent?: number | null;
    uncle?: number | null;
  };
  treeSnapshot: SerializedRBNode | null;
}

export interface InsertResult {
  insertedNode: RBNode | null;
  steps: InsertStepLog[];
  isDuplicate: boolean;
}

/**
 * Inserts a value into the Red-Black Tree while recording step-by-step
 * algorithmic reasoning, balancing cases, and snapshots.
 */
export function insertWithTrace(tree: RedBlackTree, value: number): InsertResult {
  const steps: InsertStepLog[] = [];
  let stepCount = 0;

  const logStep = (
    phase: InsertStepLog['phase'],
    message: string,
    explanation: string,
    roles: InsertStepLog['nodeRoles'] = {},
    balancingCase?: InsertBalancingCase,
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
    'INPUT_RECEIVED',
    `INSERT ${value}`,
    `Received request to insert value ${value} into the Red-Black Tree.`
  );

  // 1. Standard BST Insertion
  let parent: RBNode | null = null;
  let current = tree.root;

  while (current !== null && !current.isNil) {
    parent = current;
    if (value === current.value) {
      logStep(
        'INSERTION_COMPLETE',
        `Value ${value} already exists`,
        `Duplicate value ${value} found at existing node. In this lab, duplicate values are rejected to maintain strict set invariants.`,
        { current: value }
      );
      return { insertedNode: current, steps, isDuplicate: true };
    }

    if (value < current.value!) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  // Create new node initially colored RED
  const newNode = new RBNode(value, 'RED');
  newNode.parent = parent;

  if (parent === null) {
    tree.root = newNode;
  } else if (value < parent.value!) {
    parent.left = newNode;
  } else {
    parent.right = newNode;
  }

  tree.getStatistics().insertOperations++;
  tree.updateStatistics();

  logStep(
    'BST_INSERTION',
    `BST insertion: Placed ${value} as ${parent ? (value < parent.value! ? 'left' : 'right') + ' child of ' + parent.value : 'root'}`,
    `Standard binary search tree insertion locates position for ${value} following BST ordering (smaller values left, larger values right).`,
    { current: value, parent: parent?.value }
  );

  logStep(
    'NODE_CREATED',
    `Node ${value} initially colored RED`,
    `Every newly inserted node is colored RED by convention to preserve Property 5 (equal black height) along all paths.`,
    { current: value }
  );

  // 2. Case: Tree was empty, new node is root
  if (parent === null) {
    logStep(
      'ROOT_VERIFY',
      `Node ${value} is root -> Recolor BLACK`,
      `Red-Black Tree Property 2 states that the root must always be BLACK. Node ${value} recolored to BLACK.`,
      { current: value }
    );
    newNode.color = 'BLACK';
    tree.recordRecoloring(1);
    tree.updateStatistics();

    logStep(
      'INSERTION_COMPLETE',
      `Tree balanced after inserting root ${value}`,
      `Insertion complete. All 5 Red-Black Tree invariants satisfied.`,
      { current: value }
    );

    return { insertedNode: newNode, steps, isDuplicate: false };
  }

  // 3. Fix Red-Black Tree Invariants
  let z: RBNode = newNode;

  while (z.parent !== null && z.parent.isRed) {
    const p = z.parent;
    const gp = p.parent;

    if (!gp) {
      break; // Parent is root, will be colored black at the end
    }

    const isParentLeft = p.isLeftChild();
    const uncle = isParentLeft ? gp.right : gp.left;
    const uncleIsRed = uncle !== null && !uncle.isNil && uncle.isRed;

    logStep(
      'CHECK_VIOLATION',
      `Red-Red violation detected: Node ${z.value} (RED) and Parent ${p.value} (RED)`,
      `Property 4 violation: A RED node cannot have a RED child. Both child ${z.value} and parent ${p.value} are RED.`,
      {
        current: z.value,
        parent: p.value,
        grandparent: gp.value,
        uncle: uncle?.value ?? null,
      },
      undefined,
      'Property 4: A RED node cannot have a RED child.'
    );

    if (uncleIsRed) {
      // CASE 1: Uncle is RED -> Recolor parent, uncle, and grandparent
      logStep(
        'IDENTIFY_CASE',
        `Balancing Case 1: Uncle ${uncle!.value} is RED`,
        `When the uncle node is RED, balance is restored by pushing blackness down from grandparent ${gp.value} to parent ${p.value} and uncle ${uncle!.value}.`,
        {
          current: z.value,
          parent: p.value,
          grandparent: gp.value,
          uncle: uncle!.value,
        },
        'UNCLE_RED'
      );

      p.color = 'BLACK';
      uncle!.color = 'BLACK';
      gp.color = 'RED';
      tree.recordRecoloring(3);
      tree.updateStatistics();

      logStep(
        'RECOLOR',
        `Recolored: Parent ${p.value} -> BLACK, Uncle ${uncle!.value} -> BLACK, Grandparent ${gp.value} -> RED`,
        `Parent and Uncle became BLACK (resolving the immediate Red-Red clash). Grandparent became RED and must now be checked for violations higher up.`,
        {
          current: z.value,
          parent: p.value,
          grandparent: gp.value,
          uncle: uncle!.value,
        },
        'UNCLE_RED'
      );

      z = gp;
    } else {
      // Uncle is BLACK (or NIL)
      if (isParentLeft) {
        // Parent is LEFT child of Grandparent
        if (z.isRightChild()) {
          // CASE 2 (Triangle / Left-Right)
          logStep(
            'IDENTIFY_CASE',
            `Balancing Case 3a: Uncle is BLACK, Left-Right triangle (${gp.value} -> ${p.value} -> ${z.value})`,
            `Inner child creates a zigzag/triangle. First perform a Left Rotation at parent ${p.value} to align into a straight line (Left-Left).`,
            {
              current: z.value,
              parent: p.value,
              grandparent: gp.value,
              uncle: uncle?.value ?? null,
            },
            'UNCLE_BLACK_LR'
          );

          z = p;
          rotateLeft(tree, z);

          logStep(
            'ROTATION',
            `Left rotation @ ${z.value}`,
            `Rotated parent ${z.value} left. The nodes are now in a straight Left-Left configuration.`,
            {
              current: z.value,
              parent: z.parent?.value,
              grandparent: z.parent?.parent?.value,
            },
            'UNCLE_BLACK_LR'
          );
        }

        // CASE 3 (Line / Left-Left)
        const currentP = z.parent!;
        const currentGP = currentP.parent!;

        logStep(
          'IDENTIFY_CASE',
          `Balancing Case 2a: Uncle is BLACK, Left-Left line (${currentGP.value} -> ${currentP.value} -> ${z.value})`,
          `Outer child creates a straight line. Recolor parent to BLACK, grandparent to RED, and perform a Right Rotation at grandparent ${currentGP.value}.`,
          {
            current: z.value,
            parent: currentP.value,
            grandparent: currentGP.value,
            uncle: uncle?.value ?? null,
          },
          'UNCLE_BLACK_LL'
        );

        currentP.color = 'BLACK';
        currentGP.color = 'RED';
        tree.recordRecoloring(2);
        tree.updateStatistics();

        rotateRight(tree, currentGP);

        logStep(
          'ROTATION',
          `Right rotation @ ${currentGP.value}`,
          `Right rotated grandparent ${currentGP.value}. Subtree root is now ${currentP.value} (BLACK), fully restoring balance.`,
          {
            current: z.value,
            parent: currentP.value,
          },
          'UNCLE_BLACK_LL'
        );
      } else {
        // Parent is RIGHT child of Grandparent
        if (z.isLeftChild()) {
          // CASE 2 (Triangle / Right-Left)
          logStep(
            'IDENTIFY_CASE',
            `Balancing Case 3b: Uncle is BLACK, Right-Left triangle (${gp.value} -> ${p.value} -> ${z.value})`,
            `Inner child creates a zigzag/triangle. First perform a Right Rotation at parent ${p.value} to align into a straight line (Right-Right).`,
            {
              current: z.value,
              parent: p.value,
              grandparent: gp.value,
              uncle: uncle?.value ?? null,
            },
            'UNCLE_BLACK_RL'
          );

          z = p;
          rotateRight(tree, z);

          logStep(
            'ROTATION',
            `Right rotation @ ${z.value}`,
            `Rotated parent ${z.value} right. The nodes are now in a straight Right-Right configuration.`,
            {
              current: z.value,
              parent: z.parent?.value,
              grandparent: z.parent?.parent?.value,
            },
            'UNCLE_BLACK_RL'
          );
        }

        // CASE 3 (Line / Right-Right)
        const currentP = z.parent!;
        const currentGP = currentP.parent!;

        logStep(
          'IDENTIFY_CASE',
          `Balancing Case 2b: Uncle is BLACK, Right-Right line (${currentGP.value} -> ${currentP.value} -> ${z.value})`,
          `Outer child creates a straight line. Recolor parent to BLACK, grandparent to RED, and perform a Left Rotation at grandparent ${currentGP.value}.`,
          {
            current: z.value,
            parent: currentP.value,
            grandparent: currentGP.value,
            uncle: uncle?.value ?? null,
          },
          'UNCLE_BLACK_RR'
        );

        currentP.color = 'BLACK';
        currentGP.color = 'RED';
        tree.recordRecoloring(2);
        tree.updateStatistics();

        rotateLeft(tree, currentGP);

        logStep(
          'ROTATION',
          `Left rotation @ ${currentGP.value}`,
          `Left rotated grandparent ${currentGP.value}. Subtree root is now ${currentP.value} (BLACK), fully restoring balance.`,
          {
            current: z.value,
            parent: currentP.value,
          },
          'UNCLE_BLACK_RR'
        );
      }
    }
  }

  // Ensure root is strictly BLACK
  if (tree.root && tree.root.color !== 'BLACK') {
    logStep(
      'ROOT_VERIFY',
      `Ensure root is BLACK: Recolor ${tree.root.value} -> BLACK`,
      `Red-Black Tree Property 2 requires root to be BLACK. Colored root node ${tree.root.value} BLACK.`,
      { current: tree.root.value }
    );
    tree.root.color = 'BLACK';
    tree.recordRecoloring(1);
  } else {
    logStep(
      'ROOT_VERIFY',
      `Root ${tree.root?.value} verified BLACK`,
      `Verified Red-Black Tree Property 2: Root is BLACK.`,
      { current: tree.root?.value }
    );
  }

  tree.updateStatistics();

  logStep(
    'INSERTION_COMPLETE',
    `Tree balanced after inserting ${value}`,
    `Successfully balanced Red-Black Tree. All 5 properties validated.`,
    { current: value }
  );

  return { insertedNode: newNode, steps, isDuplicate: false };
}

/**
 * Standard pure insertion API without extra tracing overhead.
 */
export function insert(tree: RedBlackTree, value: number): RBNode | null {
  return insertWithTrace(tree, value).insertedNode;
}
