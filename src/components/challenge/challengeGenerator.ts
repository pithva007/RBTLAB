import { SerializedRBNode } from '../../algorithms/redBlackTree/types';
import { RedBlackTree } from '../../algorithms/redBlackTree/RedBlackTree';
import { RBNode } from '../../algorithms/redBlackTree/RBNode';

export type ChallengeCategory =
  | 'IDENTIFY_VIOLATION'
  | 'IDENTIFY_UNCLE'
  | 'IDENTIFY_CASE'
  | 'PREDICT_ROTATION'
  | 'PREDICT_RECOLORING'
  | 'IDENTIFY_COMPLEXITY';

export interface Challenge {
  id: string;
  category: ChallengeCategory;
  categoryLabel: string;
  question: string;
  treeSnapshot: SerializedRBNode | null;
  highlightRoles?: {
    current?: number | null;
    parent?: number | null;
    grandparent?: number | null;
    uncle?: number | null;
  };
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export function generateChallenges(): Challenge[] {
  const challenges: Challenge[] = [];

  // Challenge 1: Uncle is RED -> Predict Next Action
  {
    const tree1 = new RedBlackTree();
    tree1.insert(50);
    tree1.insert(30);
    tree1.insert(70);
    // Artificially attach 10 as RED without rebalancing yet
    const n10 = new RBNode(10, 'RED');
    n10.parent = tree1.root!.left;
    tree1.root!.left!.left = n10;

    challenges.push({
      id: 'ch_uncle_red_action',
      category: 'PREDICT_RECOLORING',
      categoryLabel: 'Predict Action',
      question:
        'A Red-Red clash occurred between new node 10 (RED) and parent 30 (RED). Uncle 70 is RED. What should the algorithm do next?',
      treeSnapshot: tree1.getState(),
      highlightRoles: { current: 10, parent: 30, grandparent: 50, uncle: 70 },
      options: [
        'Right Rotation @ 50',
        'Left Rotation @ 30',
        'Recolor: Parent 30 & Uncle 70 to BLACK, Grandparent 50 to RED',
        'Recolor: Node 10 to BLACK',
      ],
      correctIndex: 2,
      explanation:
        'When the uncle is RED (Case 1), balance is restored without rotations by pushing blackness down from grandparent 50 to parent 30 and uncle 70. Both become BLACK, while grandparent 50 becomes RED.',
    });
  }

  // Challenge 2: Left-Left Line (Uncle is BLACK/NIL) -> Predict Rotation
  {
    const tree2 = new RedBlackTree();
    tree2.insert(50);
    tree2.insert(30);
    // Attach 10 (RED) on left of 30. Uncle of 10 is NIL (BLACK).
    const n10 = new RBNode(10, 'RED');
    n10.parent = tree2.root!.left;
    tree2.root!.left!.left = n10;

    challenges.push({
      id: 'ch_ll_rotation',
      category: 'PREDICT_ROTATION',
      categoryLabel: 'Predict Rotation',
      question:
        'Red-Red conflict at 10 and 30 in a Left-Left straight line (50 -> 30 -> 10). Uncle is NIL (BLACK). Which rotation restores balance?',
      treeSnapshot: tree2.getState(),
      highlightRoles: { current: 10, parent: 30, grandparent: 50 },
      options: [
        'Left Rotation @ 50',
        'Right Rotation @ 50 (Grandparent)',
        'Left-Right Double Rotation',
        'No rotation needed, just recolor',
      ],
      correctIndex: 1,
      explanation:
        'Left-Left outer line with a black uncle (Case 2a) requires recoloring parent 30 to BLACK, grandparent 50 to RED, followed by a Right Rotation around grandparent 50.',
    });
  }

  // Challenge 3: Left-Right Triangle (Uncle is BLACK/NIL) -> Identify Case
  {
    const tree3 = new RedBlackTree();
    tree3.insert(50);
    tree3.insert(20);
    // Attach 35 (RED) as right child of 20 (RED)
    const n35 = new RBNode(35, 'RED');
    n35.parent = tree3.root!.left;
    tree3.root!.left!.right = n35;

    challenges.push({
      id: 'ch_lr_case',
      category: 'IDENTIFY_CASE',
      categoryLabel: 'Identify Case',
      question:
        'Path 50 -> 20 -> 35 forms an inner zigzag (Left-Right triangle) with black/NIL uncle. Which CLRS balancing case is this?',
      treeSnapshot: tree3.getState(),
      highlightRoles: { current: 35, parent: 20, grandparent: 50 },
      options: [
        'Case 1: Uncle is RED',
        'Case 2: Straight line (Left-Left)',
        'Case 3: Triangle (Left-Right) requiring Double Rotation',
        'Root recoloring case',
      ],
      correctIndex: 2,
      explanation:
        'Case 3 (inner child / triangle configuration) requires a Left Rotation on parent 20 to transform into a straight Left-Left line, followed by a Right Rotation on grandparent 50.',
    });
  }

  // Challenge 4: Identify Property Violated
  {
    const tree4 = new RedBlackTree();
    tree4.insert(40);
    tree4.insert(20);
    tree4.insert(60);
    // Artificially color root RED
    tree4.root!.color = 'RED';

    challenges.push({
      id: 'ch_prop_violation',
      category: 'IDENTIFY_VIOLATION',
      categoryLabel: 'Identify Violation',
      question:
        'Observe the root node 40. Which fundamental Red-Black Tree property is violated in this state?',
      treeSnapshot: tree4.getState(),
      highlightRoles: { current: 40 },
      options: [
        'Property 1: Every node is RED or BLACK',
        'Property 2: The root must always be BLACK',
        'Property 4: A RED node cannot have a RED child',
        'Property 5: Equal black height on all paths',
      ],
      correctIndex: 1,
      explanation:
        'Property 2 explicitly mandates: "The root of a Red-Black Tree is always BLACK." Root node 40 is colored RED.',
    });
  }

  // Challenge 5: Identify Uncle Node
  {
    const tree5 = new RedBlackTree();
    tree5.insert(100);
    tree5.insert(50);
    tree5.insert(150);
    tree5.insert(25);
    // Check uncle of 25
    challenges.push({
      id: 'ch_identify_uncle',
      category: 'IDENTIFY_UNCLE',
      categoryLabel: 'Identify Relationships',
      question:
        'For current node 25 (child of 50, grandchild of 100), which node is its uncle?',
      treeSnapshot: tree5.getState(),
      highlightRoles: { current: 25, parent: 50, grandparent: 100, uncle: 150 },
      options: [
        'Node 100',
        'Node 150 (Sibling of Parent 50)',
        'Node 50',
        'NIL Sentinel',
      ],
      correctIndex: 1,
      explanation:
        'The uncle of a node is the sibling of its parent. Since 25’s parent is 50, and 50’s sibling is 150 (both children of 100), node 150 is the uncle.',
    });
  }

  // Challenge 6: Complexity Analysis
  {
    challenges.push({
      id: 'ch_complexity_rotations',
      category: 'IDENTIFY_COMPLEXITY',
      categoryLabel: 'Theoretical Complexity',
      question:
        'In the worst-case scenario, what is the maximum number of tree rotations required to rebalance a Red-Black Tree after an insertion?',
      treeSnapshot: null,
      options: [
        'At most 1 rotation',
        'At most 2 rotations',
        'O(log n) rotations',
        'O(n) rotations',
      ],
      correctIndex: 1,
      explanation:
        'A key theorem of Red-Black Trees (CLRS Theorem 13.1): An insertion requires at most 2 tree rotations in the worst case (a double rotation in Case 3 transforms to Case 2, which finishes with 1 rotation). Recoloring may propagate O(log n) times, but rotations are strictly capped at 2.',
    });
  }

  // Challenge 7: Deletion Complexity
  {
    challenges.push({
      id: 'ch_complexity_deletion',
      category: 'IDENTIFY_COMPLEXITY',
      categoryLabel: 'Theoretical Complexity',
      question:
        'In the worst-case scenario, what is the maximum number of rotations required to rebalance a Red-Black Tree after a node deletion?',
      treeSnapshot: null,
      options: [
        'At most 2 rotations',
        'At most 3 rotations',
        'O(log n) rotations',
        'O(n) rotations',
      ],
      correctIndex: 1,
      explanation:
        'During deletion rebalancing, Case 1 may perform 1 rotation, transforming into Cases 2, 3, or 4. Case 3 may perform 1 rotation, transforming into Case 4, which performs 1 final rotation. Thus at most 3 rotations are ever performed during a deletion.',
    });
  }

  return challenges;
}
