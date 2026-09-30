import { RBNode } from './RBNode';
import { RedBlackTree } from './RedBlackTree';
import { InsertBalancingCase, SerializedRBNode } from './types';
import { rotateLeft, rotateRight } from './rotations';

export type InsertStepPhase =
  | 'INPUT_RECEIVED'
  | 'TRAVERSE_COMPARE'
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'BST_INSERTION'
  | 'NODE_CREATED'
  | 'CHECK_VIOLATION'
  | 'NO_VIOLATION'
  | 'RED_RED_VIOLATION'
  | 'IDENTIFY_CASE'
  | 'RECOLOR_PARENT'
  | 'RECOLOR_UNCLE'
  | 'RECOLOR_GRANDPARENT'
  | 'RECOLOR'
  | 'BEFORE_ROTATION'
  | 'ROTATION'
  | 'ROOT_VERIFY'
  | 'INSERTION_COMPLETE';

export interface InsertStepLog {
  step: number;
  phase: InsertStepPhase;
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
  pseudocodeLine?: number;
  comparison?: {
    currentVal: number;
    targetVal: number;
    decision: 'LEFT' | 'RIGHT' | 'EQUAL';
  };
}

export interface InsertResult {
  insertedNode: RBNode | null;
  steps: InsertStepLog[];
  isDuplicate: boolean;
}

/**
 * Inserts a value into the Red-Black Tree while recording step-by-step
 * algorithmic reasoning, comparisons, balancing cases, and snapshots.
 */
export function insertWithTrace(tree: RedBlackTree, value: number): InsertResult {
  const steps: InsertStepLog[] = [];
  let stepCount = 0;

  const logStep = (
    phase: InsertStepPhase,
    message: string,
    explanation: string,
    roles: InsertStepLog['nodeRoles'] = {},
    balancingCase?: InsertBalancingCase,
    violatedProperty?: string,
    pseudocodeLine?: number,
    comparison?: InsertStepLog['comparison']
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
      pseudocodeLine,
      comparison,
    });
  };

  // 1. Initial Step: Start of insertion
  logStep(
    'INPUT_RECEIVED',
    `Starting insertion of ${value}`,
    `Received request to insert value ${value} into the Red-Black Tree. Beginning binary search tree traversal from the root.`,
    { current: tree.root ? tree.root.value : value },
    undefined,
    undefined,
    1
  );

  // 2. Traversal: Standard BST Search with step-by-step comparisons
  let parent: RBNode | null = null;
  let current = tree.root;

  while (current !== null && !current.isNil) {
    parent = current;
    const currentVal = current.value!;

    // Step-by-step comparison
    if (value === currentVal) {
      logStep(
        'TRAVERSE_COMPARE',
        `Comparison at node ${currentVal}: ${value} == ${currentVal}`,
        `Target value ${value} matches existing node ${currentVal}. Duplicate keys are rejected.`,
        { current: currentVal },
        undefined,
        undefined,
        3,
        { currentVal, targetVal: value, decision: 'EQUAL' }
      );

      logStep(
        'INSERTION_COMPLETE',
        `Value ${value} already exists in tree`,
        `Duplicate value ${value} rejected. Red-Black Tree maintains unique keys.`,
        { current: value },
        undefined,
        undefined,
        4
      );
      return { insertedNode: current, steps, isDuplicate: true };
    }

    const isLeft = value < currentVal;
    logStep(
      'TRAVERSE_COMPARE',
      `Comparison at node ${currentVal}: ${value} ${isLeft ? '<' : '>'} ${currentVal}`,
      `Comparing target ${value} with current node ${currentVal} to determine subtree branch.`,
      { current: currentVal },
      undefined,
      undefined,
      3,
      { currentVal, targetVal: value, decision: isLeft ? 'LEFT' : 'RIGHT' }
    );

    if (isLeft) {
      logStep(
        'MOVE_LEFT',
        `${value} < ${currentVal} -> Move to LEFT child`,
        `In a BST, keys smaller than ${currentVal} reside in the left subtree.`,
        { current: currentVal },
        undefined,
        undefined,
        4
      );
      current = current.left;
    } else {
      logStep(
        'MOVE_RIGHT',
        `${value} > ${currentVal} -> Move to RIGHT child`,
        `In a BST, keys larger than ${currentVal} reside in the right subtree.`,
        { current: currentVal },
        undefined,
        undefined,
        5
      );
      current = current.right;
    }
  }

  // 3. Create Node with Color = RED
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
    `Found insertion position: Placed ${value} as ${parent ? (value < parent.value! ? 'left' : 'right') + ' child of ' + parent.value : 'root'}`,
    `Binary search tree search complete. Empty leaf position found under ${parent ? 'parent ' + parent.value : 'root'}.`,
    { current: value, parent: parent?.value },
    undefined,
    undefined,
    7
  );

  logStep(
    'NODE_CREATED',
    `Creating node ${value} with color RED`,
    `Node ${value} created as RED. New nodes are always colored RED to preserve Property 5 (equal black height) on all paths.`,
    { current: value, parent: parent?.value },
    undefined,
    undefined,
    8
  );

  // 4. Special Case: Tree was empty, new node is root
  if (parent === null) {
    logStep(
      'ROOT_VERIFY',
      `Node ${value} is root -> Recolor BLACK`,
      `Red-Black Tree Property 2 mandates that the root must always be BLACK. Node ${value} recolored from RED to BLACK.`,
      { current: value },
      undefined,
      'Property 2: The root is BLACK',
      10
    );
    newNode.color = 'BLACK';
    tree.recordRecoloring(1);
    tree.updateStatistics();

    logStep(
      'INSERTION_COMPLETE',
      `Insertion of ${value} complete (Root)`,
      `Root node established and colored BLACK. All 5 Red-Black properties satisfied.`,
      { current: value },
      undefined,
      undefined,
      11
    );

    return { insertedNode: newNode, steps, isDuplicate: false };
  }

  // 5. Check if parent is BLACK (No violation)
  if (!parent.isRed) {
    logStep(
      'CHECK_VIOLATION',
      `✓ No Red-Red violation: Parent ${parent.value} is BLACK`,
      `The parent node ${parent.value} is BLACK. Inserting a RED child under a BLACK parent does not violate Property 4 (no red-red) or Property 5 (black height).`,
      { current: value, parent: parent.value },
      'PARENT_BLACK',
      undefined,
      13
    );

    logStep(
      'INSERTION_COMPLETE',
      `Insertion of ${value} complete`,
      `No rebalancing needed. All 5 Red-Black properties satisfied.`,
      { current: value },
      undefined,
      undefined,
      14
    );

    return { insertedNode: newNode, steps, isDuplicate: false };
  }

  // 6. Fix Red-Black Violations (parent is RED)
  let z: RBNode = newNode;

  while (z.parent !== null && z.parent.isRed) {
    const p = z.parent;
    const gp = p.parent;

    if (!gp) {
      break; // Parent is root, will be recolored BLACK at the end
    }

    const isParentLeft = p.isLeftChild();
    const uncle = isParentLeft ? gp.right : gp.left;
    const uncleIsRed = uncle !== null && !uncle.isNil && uncle.isRed;

    // Detect violation step
    logStep(
      'CHECK_VIOLATION',
      `⚠ RED-RED VIOLATION: Current ${z.value} (RED) and Parent ${p.value} (RED)`,
      `Property 4 violation detected: A RED node cannot have a RED child. Both child ${z.value} and parent ${p.value} are RED.`,
      {
        current: z.value,
        parent: p.value,
        grandparent: gp.value,
        uncle: uncle && !uncle.isNil ? uncle.value : null,
      },
      undefined,
      'Property 4: A RED node cannot have a RED child.',
      16
    );

    if (uncleIsRed) {
      // CASE 1: Uncle is RED
      logStep(
        'IDENTIFY_CASE',
        `Case 1: Uncle ${uncle!.value} is RED (Recoloring Case)`,
        `Because uncle ${uncle!.value} is RED, we can restore local balance by pushing blackness down: recolor parent and uncle to BLACK, and grandparent to RED.`,
        {
          current: z.value,
          parent: p.value,
          grandparent: gp.value,
          uncle: uncle!.value,
        },
        'UNCLE_RED',
        undefined,
        18
      );

      // Step-by-step recoloring
      p.color = 'BLACK';
      tree.recordRecoloring(1);
      tree.updateStatistics();
      logStep(
        'RECOLOR',
        `Recoloring Parent ${p.value}: RED -> BLACK`,
        `Parent ${p.value} recolored to BLACK, resolving the immediate Red-Red clash with node ${z.value}.`,
        { current: z.value, parent: p.value, grandparent: gp.value, uncle: uncle!.value },
        'UNCLE_RED',
        undefined,
        19
      );

      uncle!.color = 'BLACK';
      tree.recordRecoloring(1);
      tree.updateStatistics();
      logStep(
        'RECOLOR',
        `Recoloring Uncle ${uncle!.value}: RED -> BLACK`,
        `Uncle ${uncle!.value} recolored to BLACK, preserving black-height symmetry across both subtrees.`,
        { current: z.value, parent: p.value, grandparent: gp.value, uncle: uncle!.value },
        'UNCLE_RED',
        undefined,
        20
      );

      gp.color = 'RED';
      tree.recordRecoloring(1);
      tree.updateStatistics();
      logStep(
        'RECOLOR',
        `Recoloring Grandparent ${gp.value}: BLACK -> RED`,
        `Grandparent ${gp.value} recolored to RED to compensate for the additional black nodes below it. Rebalancing continues upwards.`,
        { current: gp.value, grandparent: gp.value },
        'UNCLE_RED',
        undefined,
        21
      );

      z = gp;
    } else {
      // Uncle is BLACK (or NIL)
      if (isParentLeft) {
        // Parent is LEFT child of Grandparent
        if (z.isRightChild()) {
          // CASE 3a (Triangle / Left-Right)
          logStep(
            'IDENTIFY_CASE',
            `Case 3a: Left-Right Triangle (${gp.value} -> ${p.value} -> ${z.value})`,
            `The current node ${z.value} is the right child of parent ${p.value}, and parent is left child of grandparent ${gp.value} (zigzag). A LEFT ROTATION at parent ${p.value} is required to form a straight line.`,
            {
              current: z.value,
              parent: p.value,
              grandparent: gp.value,
              uncle: uncle && !uncle.isNil ? uncle.value : null,
            },
            'UNCLE_BLACK_LR',
            undefined,
            24
          );

          z = p;
          logStep(
            'ROTATION',
            `Left rotation @ ${z.value}`,
            `Performing Left Rotation at parent ${z.value} to transform the Left-Right triangle into a straight Left-Left line.`,
            { current: z.value, parent: z.parent?.value, grandparent: gp.value },
            'UNCLE_BLACK_LR',
            undefined,
            25
          );

          rotateLeft(tree, z);
          tree.updateStatistics();

          logStep(
            'ROTATION',
            `Left rotation @ ${z.value} complete -> Formed Left-Left Line`,
            `Left rotation complete. Nodes are now in a straight Left-Left configuration.`,
            { current: z.value, parent: z.parent?.value, grandparent: z.parent?.parent?.value },
            'UNCLE_BLACK_LR',
            undefined,
            26
          );
        }

        // CASE 2a (Line / Left-Left)
        const currentP = z.parent!;
        const currentGP = currentP.parent!;

        logStep(
          'IDENTIFY_CASE',
          `Case 2a: Left-Left Line (${currentGP.value} -> ${currentP.value} -> ${z.value})`,
          `The current node ${z.value} is the left child of parent ${currentP.value}, and parent is left child of grandparent ${currentGP.value} (straight line). Recolor parent to BLACK, grandparent to RED, and perform a RIGHT ROTATION at grandparent ${currentGP.value}.`,
          {
            current: z.value,
            parent: currentP.value,
            grandparent: currentGP.value,
            uncle: uncle && !uncle.isNil ? uncle.value : null,
          },
          'UNCLE_BLACK_LL',
          undefined,
          28
        );

        // Recoloring before rotation
        currentP.color = 'BLACK';
        currentGP.color = 'RED';
        tree.recordRecoloring(2);
        tree.updateStatistics();

        logStep(
          'RECOLOR',
          `Recolored: Parent ${currentP.value} -> BLACK, Grandparent ${currentGP.value} -> RED`,
          `Parent ${currentP.value} colored BLACK to serve as the new balanced subtree root. Grandparent ${currentGP.value} colored RED before rotation.`,
          { current: z.value, parent: currentP.value, grandparent: currentGP.value },
          'UNCLE_BLACK_LL',
          undefined,
          29
        );

        logStep(
          'ROTATION',
          `Right rotation @ ${currentGP.value}`,
          `Performing Right Rotation at grandparent ${currentGP.value}. Node ${currentP.value} becomes the new subtree root.`,
          { current: z.value, parent: currentP.value, grandparent: currentGP.value },
          'UNCLE_BLACK_LL',
          undefined,
          30
        );

        rotateRight(tree, currentGP);
        tree.updateStatistics();

        logStep(
          'ROTATION',
          `Right rotation @ ${currentGP.value} complete`,
          `Right rotation complete. Subtree root is now ${currentP.value} (BLACK), fully restoring Red-Black balance.`,
          { current: z.value, parent: currentP.value },
          'UNCLE_BLACK_LL',
          undefined,
          31
        );
      } else {
        // Parent is RIGHT child of Grandparent
        if (z.isLeftChild()) {
          // CASE 3b (Triangle / Right-Left)
          logStep(
            'IDENTIFY_CASE',
            `Case 3b: Right-Left Triangle (${gp.value} -> ${p.value} -> ${z.value})`,
            `The current node ${z.value} is the left child of parent ${p.value}, and parent is right child of grandparent ${gp.value} (zigzag). A RIGHT ROTATION at parent ${p.value} is required to form a straight line.`,
            {
              current: z.value,
              parent: p.value,
              grandparent: gp.value,
              uncle: uncle && !uncle.isNil ? uncle.value : null,
            },
            'UNCLE_BLACK_RL',
            undefined,
            24
          );

          z = p;
          logStep(
            'ROTATION',
            `Right rotation @ ${z.value}`,
            `Performing Right Rotation at parent ${z.value} to transform the Right-Left triangle into a straight Right-Right line.`,
            { current: z.value, parent: z.parent?.value, grandparent: gp.value },
            'UNCLE_BLACK_RL',
            undefined,
            25
          );

          rotateRight(tree, z);
          tree.updateStatistics();

          logStep(
            'ROTATION',
            `Right rotation @ ${z.value} complete -> Formed Right-Right Line`,
            `Right rotation complete. Nodes are now in a straight Right-Right configuration.`,
            { current: z.value, parent: z.parent?.value, grandparent: z.parent?.parent?.value },
            'UNCLE_BLACK_RL',
            undefined,
            26
          );
        }

        // CASE 2b (Line / Right-Right)
        const currentP = z.parent!;
        const currentGP = currentP.parent!;

        logStep(
          'IDENTIFY_CASE',
          `Case 2b: Right-Right Line (${currentGP.value} -> ${currentP.value} -> ${z.value})`,
          `The current node ${z.value} is the right child of parent ${currentP.value}, and parent is right child of grandparent ${currentGP.value} (straight line). Recolor parent to BLACK, grandparent to RED, and perform a LEFT ROTATION at grandparent ${currentGP.value}.`,
          {
            current: z.value,
            parent: currentP.value,
            grandparent: currentGP.value,
            uncle: uncle && !uncle.isNil ? uncle.value : null,
          },
          'UNCLE_BLACK_RR',
          undefined,
          28
        );

        currentP.color = 'BLACK';
        currentGP.color = 'RED';
        tree.recordRecoloring(2);
        tree.updateStatistics();

        logStep(
          'RECOLOR',
          `Recolored: Parent ${currentP.value} -> BLACK, Grandparent ${currentGP.value} -> RED`,
          `Parent ${currentP.value} colored BLACK to serve as the new balanced subtree root. Grandparent ${currentGP.value} colored RED before rotation.`,
          { current: z.value, parent: currentP.value, grandparent: currentGP.value },
          'UNCLE_BLACK_RR',
          undefined,
          29
        );

        logStep(
          'ROTATION',
          `Left rotation @ ${currentGP.value}`,
          `Performing Left Rotation at grandparent ${currentGP.value}. Node ${currentP.value} becomes the new subtree root.`,
          { current: z.value, parent: currentP.value, grandparent: currentGP.value },
          'UNCLE_BLACK_RR',
          undefined,
          30
        );

        rotateLeft(tree, currentGP);
        tree.updateStatistics();

        logStep(
          'ROTATION',
          `Left rotation @ ${currentGP.value} complete`,
          `Left rotation complete. Subtree root is now ${currentP.value} (BLACK), fully restoring Red-Black balance.`,
          { current: z.value, parent: currentP.value },
          'UNCLE_BLACK_RR',
          undefined,
          31
        );
      }
    }
  }

  // 7. Ensure root is strictly BLACK
  if (tree.root && tree.root.color !== 'BLACK') {
    logStep(
      'ROOT_VERIFY',
      `Ensure root is BLACK: Recolor ${tree.root.value} -> BLACK`,
      `Red-Black Tree Property 2 mandates the root must be BLACK. Colored root node ${tree.root.value} BLACK.`,
      { current: tree.root.value },
      undefined,
      'Property 2: The root is BLACK',
      33
    );
    tree.root.color = 'BLACK';
    tree.recordRecoloring(1);
  } else {
    logStep(
      'ROOT_VERIFY',
      `Root ${tree.root?.value} verified BLACK`,
      `Verified Red-Black Tree Property 2: Root is BLACK.`,
      { current: tree.root?.value },
      undefined,
      undefined,
      34
    );
  }

  tree.updateStatistics();

  // 8. Insertion Complete
  logStep(
    'INSERTION_COMPLETE',
    `INSERT ${value} COMPLETE`,
    `Successfully completed insertion of ${value}. Tree self-balanced and all 5 Red-Black properties satisfied.`,
    { current: value },
    undefined,
    undefined,
    35
  );

  return { insertedNode: newNode, steps, isDuplicate: false };
}

/**
 * Standard pure insertion API without extra tracing overhead.
 */
export function insert(tree: RedBlackTree, value: number): RBNode | null {
  return insertWithTrace(tree, value).insertedNode;
}
