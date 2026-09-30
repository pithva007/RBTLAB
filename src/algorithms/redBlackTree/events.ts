import { RedBlackTree } from './RedBlackTree';
import {
  SerializedRBNode,
  TreePropertiesStatus,
  TreeStatistics,
} from './types';
import { insertWithTrace } from './insertion';
import { deleteWithTrace } from './deletion';
import { validateTree } from './validation';
import { RBNode } from './RBNode';

export type AlgorithmEventType =
  | 'INSERT_START'
  | 'BST_INSERT'
  | 'NODE_CREATED'
  | 'RED_RED_VIOLATION'
  | 'IDENTIFY_UNCLE'
  | 'IDENTIFY_CASE'
  | 'RECOLOR'
  | 'LEFT_ROTATION'
  | 'RIGHT_ROTATION'
  | 'LEFT_RIGHT_ROTATION'
  | 'RIGHT_LEFT_ROTATION'
  | 'ROOT_VERIFY'
  | 'DELETE_START'
  | 'ANALYZE_CHILDREN'
  | 'FIND_SUCCESSOR'
  | 'REPLACE_VALUE'
  | 'SPLICE_OUT'
  | 'DOUBLE_BLACK'
  | 'IDENTIFY_SIBLING'
  | 'DELETE_CASE'
  | 'ROOT_CORRECTION'
  | 'SEARCH_STEP'
  | 'SEARCH_FOUND'
  | 'SEARCH_NOT_FOUND'
  | 'OPERATION_COMPLETE';

export interface EducationalWhy {
  whatHappened: string;
  whyDidItHappen: string;
  violatedProperty?: string;
  caseDetected?: string;
  actionReason: string;
  complexity: string;
}

export interface HighlightRoles {
  current?: number | null;
  parent?: number | null;
  grandparent?: number | null;
  uncle?: number | null;
  sibling?: number | null;
  successor?: number | null;
  rotatedNode?: number | null;
  pivotNode?: number | null;
}

export interface AlgorithmEvent {
  id: string;
  stepIndex: number;
  totalSteps: number;
  type: AlgorithmEventType;
  operation: 'INSERT' | 'DELETE' | 'SEARCH' | 'RESET';
  targetValue: number;
  title: string;
  description: string;
  educationalWhy: EducationalWhy;
  highlightRoles: HighlightRoles;
  treeSnapshot: SerializedRBNode | null;
  propertiesStatus: TreePropertiesStatus;
  statistics: TreeStatistics;
}

/**
 * Generates an event stream for tree insertion with educational metadata.
 */
export function generateInsertEvents(
  initialTree: RedBlackTree,
  value: number
): AlgorithmEvent[] {
  // Clone the tree so we execute step-by-step snapshots without mutating the initial tree
  const treeClone = initialTree.clone();
  const insertResult = insertWithTrace(treeClone, value);
  const rawSteps = insertResult.steps;
  const total = rawSteps.length;

  const events: AlgorithmEvent[] = [];

  rawSteps.forEach((step, index) => {
    let eventType: AlgorithmEventType = 'INSERT_START';
    let why: EducationalWhy = {
      whatHappened: step.message,
      whyDidItHappen: step.explanation,
      actionReason: 'Standard binary search tree insertion step.',
      complexity: 'O(log n)',
    };

    switch (step.phase) {
      case 'INPUT_RECEIVED':
        eventType = 'INSERT_START';
        why = {
          whatHappened: `Initiated insert for value ${value}.`,
          whyDidItHappen: `New element requested by user/algorithm.`,
          actionReason: `Traverse from root to locate appropriate BST leaf position.`,
          complexity: 'O(log n) search traversal',
        };
        break;

      case 'BST_INSERTION':
        eventType = 'BST_INSERT';
        why = {
          whatHappened: `Placed ${value} according to BST comparison ordering.`,
          whyDidItHappen: `In a BST, keys in the left subtree are smaller, and right subtree are larger.`,
          actionReason: `Establish basic binary search tree position prior to color balance checks.`,
          complexity: 'O(1) pointer assignment after search',
        };
        break;

      case 'NODE_CREATED':
        eventType = 'NODE_CREATED';
        why = {
          whatHappened: `Node ${value} created with initial color RED.`,
          whyDidItHappen: `New nodes must be RED to preserve Property 5 (equal black height) on all paths.`,
          violatedProperty: undefined,
          actionReason: `If colored BLACK, every path through this node would immediately violate black height equality.`,
          complexity: 'O(1)',
        };
        break;

      case 'CHECK_VIOLATION':
        eventType = 'RED_RED_VIOLATION';
        why = {
          whatHappened: `Red-Red conflict detected between ${step.nodeRoles.current} and ${step.nodeRoles.parent}.`,
          whyDidItHappen: `Both child and parent are RED.`,
          violatedProperty: 'Property 4: A RED node cannot have a RED child.',
          actionReason: `Consecutive red nodes are strictly forbidden in Red-Black Trees.`,
          complexity: 'O(1) inspection',
        };
        break;

      case 'IDENTIFY_CASE':
        eventType = step.nodeRoles.uncle !== null ? 'IDENTIFY_UNCLE' : 'IDENTIFY_CASE';
        why = {
          whatHappened: `Balancing case identified: ${step.balancingCase ?? 'Unknown'}.`,
          whyDidItHappen: `Checked color of uncle node (${step.nodeRoles.uncle ?? 'NIL/BLACK'}) and child orientation.`,
          caseDetected: step.balancingCase,
          actionReason:
            step.balancingCase === 'UNCLE_RED'
              ? 'Uncle is RED: push blackness down from grandparent by recoloring.'
              : 'Uncle is BLACK: resolve violation through rotations and recoloring.',
          complexity: 'O(1)',
        };
        break;

      case 'RECOLOR':
        eventType = 'RECOLOR';
        why = {
          whatHappened: `Recolored parent and uncle to BLACK, grandparent to RED.`,
          whyDidItHappen: `Uncle was RED (Case 1). Pushing blackness down restores local balance.`,
          caseDetected: step.balancingCase,
          actionReason: `Now the grandparent is RED; rebalance must continue upwards towards the root.`,
          complexity: 'O(1) color updates (at most O(log n) recolorings up the tree)',
        };
        break;

      case 'ROTATION':
        eventType = step.message.includes('Left') ? 'LEFT_ROTATION' : 'RIGHT_ROTATION';
        why = {
          whatHappened: step.message,
          whyDidItHappen: `Restructuring tree pointers to decrease subtree height and eliminate consecutive REDs.`,
          caseDetected: step.balancingCase,
          actionReason: `Tree rotations change pointer hierarchy without violating the BST inorder sequence.`,
          complexity: 'O(1) rotation (at most 2 rotations per insertion)',
        };
        break;

      case 'ROOT_VERIFY':
        eventType = 'ROOT_VERIFY';
        why = {
          whatHappened: `Root verified and guaranteed BLACK.`,
          whyDidItHappen: `Red-Black Tree Property 2 mandates the root must be BLACK.`,
          violatedProperty: 'Property 2: The root is BLACK.',
          actionReason: `Recoloring root from RED to BLACK increases the black height of all paths uniformly by 1.`,
          complexity: 'O(1)',
        };
        break;

      case 'INSERTION_COMPLETE':
        eventType = 'OPERATION_COMPLETE';
        why = {
          whatHappened: `Insertion of ${value} successfully completed.`,
          whyDidItHappen: `All 5 Red-Black properties are satisfied.`,
          actionReason: `The tree is balanced and ready for subsequent queries or modifications.`,
          complexity: 'Total time: O(log n), at most 2 rotations',
        };
        break;
    }

    events.push({
      id: `insert_event_${index + 1}`,
      stepIndex: index + 1,
      totalSteps: total,
      type: eventType,
      operation: 'INSERT',
      targetValue: value,
      title: step.message,
      description: step.explanation,
      educationalWhy: why,
      highlightRoles: {
        current: step.nodeRoles.current,
        parent: step.nodeRoles.parent,
        grandparent: step.nodeRoles.grandparent,
        uncle: step.nodeRoles.uncle,
      },
      treeSnapshot: step.treeSnapshot,
      propertiesStatus: validateTree(treeClone),
      statistics: { ...treeClone.getStatistics() },
    });
  });

  return events;
}

/**
 * Generates an event stream for tree deletion with educational metadata.
 */
export function generateDeleteEvents(
  initialTree: RedBlackTree,
  value: number
): AlgorithmEvent[] {
  const treeClone = initialTree.clone();
  const deleteResult = deleteWithTrace(treeClone, value);
  const rawSteps = deleteResult.steps;
  const total = rawSteps.length;

  const events: AlgorithmEvent[] = [];

  rawSteps.forEach((step, index) => {
    let eventType: AlgorithmEventType = 'DELETE_START';
    let why: EducationalWhy = {
      whatHappened: step.message,
      whyDidItHappen: step.explanation,
      actionReason: 'Standard binary search tree deletion step.',
      complexity: 'O(log n)',
    };

    switch (step.phase) {
      case 'LOCATE_NODE':
        eventType = 'DELETE_START';
        why = {
          whatHappened: `Traversing tree to find node ${value}.`,
          whyDidItHappen: `Must locate target node before inspecting child links.`,
          actionReason: `Follow BST comparisons left or right.`,
          complexity: 'O(log n) search',
        };
        break;

      case 'ANALYZE_CHILDREN':
        eventType = 'ANALYZE_CHILDREN';
        why = {
          whatHappened: step.message,
          whyDidItHappen: `Deletion mechanics differ depending on whether node has 0, 1, or 2 children.`,
          caseDetected: step.balancingCase,
          actionReason: `0/1 child nodes are spliced out directly; 2-child nodes require replacement with inorder successor.`,
          complexity: 'O(1)',
        };
        break;

      case 'FIND_SUCCESSOR':
        eventType = 'FIND_SUCCESSOR';
        why = {
          whatHappened: `Identified inorder successor node ${step.nodeRoles.successor}.`,
          whyDidItHappen: `Inorder successor is the smallest value in the right subtree.`,
          caseDetected: 'INORDER_SUCCESSOR',
          actionReason: `Successor preserves BST order when its key replaces the deleted node.`,
          complexity: 'O(log n) path to leftmost node',
        };
        break;

      case 'REPLACE_VALUE':
        eventType = 'REPLACE_VALUE';
        why = {
          whatHappened: step.message,
          whyDidItHappen: `Copied successor key into original node.`,
          caseDetected: 'INORDER_SUCCESSOR',
          actionReason: `Maintains BST ordering while reducing problem to deleting the successor node (which has <= 1 child).`,
          complexity: 'O(1)',
        };
        break;

      case 'SPLICE_OUT':
        eventType = 'SPLICE_OUT';
        why = {
          whatHappened: step.message,
          whyDidItHappen: `Unlinked target node from parent and promoted its child.`,
          actionReason: `Physically excise node from the data structure.`,
          complexity: 'O(1)',
        };
        break;

      case 'DOUBLE_BLACK_DETECTED':
        eventType = 'DOUBLE_BLACK';
        why = {
          whatHappened: `Double-black condition triggered at ${step.nodeRoles.current ?? 'NIL'}.`,
          whyDidItHappen: `Deleting a BLACK node removed 1 unit of black height.`,
          violatedProperty: 'Property 5: Equal black height on all paths.',
          actionReason: `Must rebalance tree via sibling recoloring or rotations to restore equal black heights.`,
          complexity: 'O(1) detection',
        };
        break;

      case 'IDENTIFY_SIBLING':
        eventType = 'IDENTIFY_SIBLING';
        why = {
          whatHappened: step.message,
          whyDidItHappen: `Rebalancing case is determined by the color of the sibling and its children.`,
          actionReason: `Examine sibling to match one of the 4 CLRS double-black cases.`,
          complexity: 'O(1)',
        };
        break;

      case 'APPLY_CASE':
        eventType = 'DELETE_CASE';
        why = {
          whatHappened: step.message,
          whyDidItHappen: `Applied specific double-black elimination rule.`,
          caseDetected: step.balancingCase,
          actionReason: `Case transforms the double-black condition or moves it higher up towards the root.`,
          complexity: 'O(1) per case',
        };
        break;

      case 'ROOT_CORRECTION':
        eventType = 'ROOT_CORRECTION';
        why = {
          whatHappened: step.message,
          whyDidItHappen: `Double-black reached the root or root had an extra black unit.`,
          violatedProperty: 'Property 2: The root is BLACK.',
          actionReason: `Absorbing extra black into the root restores global black height equality.`,
          complexity: 'O(1)',
        };
        break;

      case 'DELETION_COMPLETE':
        eventType = 'OPERATION_COMPLETE';
        why = {
          whatHappened: `Deletion of ${value} completed successfully.`,
          whyDidItHappen: `All 5 Red-Black Tree invariants validated.`,
          actionReason: `Tree is balanced and ready.`,
          complexity: 'Total time: O(log n), at most 3 rotations',
        };
        break;

      default:
        eventType = 'DELETE_CASE';
        break;
    }

    events.push({
      id: `delete_event_${index + 1}`,
      stepIndex: index + 1,
      totalSteps: total,
      type: eventType,
      operation: 'DELETE',
      targetValue: value,
      title: step.message,
      description: step.explanation,
      educationalWhy: why,
      highlightRoles: {
        current: step.nodeRoles.current,
        parent: step.nodeRoles.parent,
        sibling: step.nodeRoles.sibling,
        successor: step.nodeRoles.successor,
      },
      treeSnapshot: step.treeSnapshot,
      propertiesStatus: validateTree(treeClone),
      statistics: { ...treeClone.getStatistics() },
    });
  });

  return events;
}

/**
 * Generates an event stream for searching a value.
 */
export function generateSearchEvents(
  tree: RedBlackTree,
  value: number
): AlgorithmEvent[] {
  const events: AlgorithmEvent[] = [];
  const path: RBNode[] = [];
  let current = tree.root;
  let comparisons = 0;

  const initialStats = { ...tree.getStatistics() };
  const props = validateTree(tree);

  // Search Step Start
  events.push({
    id: `search_start`,
    stepIndex: 1,
    totalSteps: 1,
    type: 'SEARCH_STEP',
    operation: 'SEARCH',
    targetValue: value,
    title: `SEARCH ${value}`,
    description: `Begin binary search starting at root (${tree.root?.value ?? 'empty'}).`,
    educationalWhy: {
      whatHappened: `Initiating search query for key ${value}.`,
      whyDidItHappen: `Look up value using binary search tree invariant.`,
      actionReason: `At each node, compare target value with current node value.`,
      complexity: 'O(log n) guaranteed by Red-Black Tree height bound',
    },
    highlightRoles: { current: tree.root?.value ?? null },
    treeSnapshot: tree.getState(),
    propertiesStatus: props,
    statistics: initialStats,
  });

  let found = false;

  while (current !== null && !current.isNil) {
    path.push(current);
    comparisons++;

    if (current.value === value) {
      found = true;
      events.push({
        id: `search_found_${comparisons}`,
        stepIndex: comparisons + 1,
        totalSteps: comparisons + 1,
        type: 'SEARCH_FOUND',
        operation: 'SEARCH',
        targetValue: value,
        title: `FOUND ${value} @ node (${current.color})`,
        description: `Target value ${value} matched current node value after ${comparisons} comparisons.`,
        educationalWhy: {
          whatHappened: `Target value ${value} found.`,
          whyDidItHappen: `Current node value matches target.`,
          actionReason: `Search terminates successfully.`,
          complexity: `${comparisons} comparisons (<= 2 * log2(n + 1))`,
        },
        highlightRoles: { current: current.value },
        treeSnapshot: tree.getState(),
        propertiesStatus: props,
        statistics: {
          ...initialStats,
          comparisons: initialStats.comparisons + comparisons,
          searchOperations: initialStats.searchOperations + 1,
        },
      });
      break;
    }

    const direction = value < current.value! ? 'left' : 'right';
    const nextNode = value < current.value! ? current.left : current.right;

    events.push({
      id: `search_compare_${comparisons}`,
      stepIndex: comparisons + 1,
      totalSteps: comparisons + 1,
      type: 'SEARCH_STEP',
      operation: 'SEARCH',
      targetValue: value,
      title: `Compare ${value} with ${current.value}`,
      description: `${value} is ${value < current.value! ? 'less' : 'greater'} than ${current.value}. Move to ${direction} child.`,
      educationalWhy: {
        whatHappened: `Evaluated BST branch direction: ${value} ${value < current.value! ? '<' : '>'} ${current.value}.`,
        whyDidItHappen: `BST property: smaller values are left, larger values are right.`,
        actionReason: `Prunes half the remaining subtree from the search space.`,
        complexity: 'O(1) comparison per tree level',
      },
      highlightRoles: {
        current: current.value,
        parent: current.parent?.value,
      },
      treeSnapshot: tree.getState(),
      propertiesStatus: props,
      statistics: {
        ...initialStats,
        comparisons: initialStats.comparisons + comparisons,
      },
    });

    current = nextNode;
  }

  if (!found) {
    events.push({
      id: `search_not_found`,
      stepIndex: events.length + 1,
      totalSteps: events.length + 1,
      type: 'SEARCH_NOT_FOUND',
      operation: 'SEARCH',
      targetValue: value,
      title: `NOT FOUND: ${value}`,
      description: `Reached NIL sentinel. Value ${value} does not exist in the Red-Black Tree.`,
      educationalWhy: {
        whatHappened: `Search reached a leaf sentinel without finding ${value}.`,
        whyDidItHappen: `All possible positions consistent with BST ordering were exhausted.`,
        actionReason: `Confirm absence of element in O(log n) time.`,
        complexity: `${comparisons} comparisons (<= 2 * log2(n + 1))`,
      },
      highlightRoles: {},
      treeSnapshot: tree.getState(),
      propertiesStatus: props,
      statistics: {
        ...initialStats,
        comparisons: initialStats.comparisons + comparisons,
        searchOperations: initialStats.searchOperations + 1,
      },
    });
  }

  // Update totalSteps across all generated search events
  const totalSteps = events.length;
  events.forEach((e) => {
    e.totalSteps = totalSteps;
  });

  return events;
}

/**
 * Controller to step, play, pause, and navigate algorithm event timelines.
 */
export class AlgorithmExecutionEngine {
  private events: AlgorithmEvent[] = [];
  private currentIndex = 0;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private isRunning = false;
  private speedMs = 700;

  constructor(events: AlgorithmEvent[] = []) {
    this.events = events;
  }

  public setEvents(events: AlgorithmEvent[]): void {
    this.stop();
    this.events = events;
    this.currentIndex = 0;
  }

  public getEvents(): AlgorithmEvent[] {
    return this.events;
  }

  public getCurrentEvent(): AlgorithmEvent | null {
    if (this.events.length === 0) return null;
    return this.events[this.currentIndex] || null;
  }

  public getStepIndex(): number {
    return this.currentIndex;
  }

  public getTotalSteps(): number {
    return this.events.length;
  }

  public hasNext(): boolean {
    return this.currentIndex < this.events.length - 1;
  }

  public hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  public next(): AlgorithmEvent | null {
    if (this.hasNext()) {
      this.currentIndex++;
      return this.getCurrentEvent();
    }
    return null;
  }

  public prev(): AlgorithmEvent | null {
    if (this.hasPrev()) {
      this.currentIndex--;
      return this.getCurrentEvent();
    }
    return null;
  }

  public goTo(index: number): AlgorithmEvent | null {
    if (index >= 0 && index < this.events.length) {
      this.currentIndex = index;
      return this.getCurrentEvent();
    }
    return null;
  }

  public reset(): AlgorithmEvent | null {
    this.stop();
    this.currentIndex = 0;
    return this.getCurrentEvent();
  }

  public setSpeed(speedMs: number): void {
    this.speedMs = Math.max(100, speedMs);
  }

  public getSpeed(): number {
    return this.speedMs;
  }

  public isPlaying(): boolean {
    return this.isRunning;
  }

  public play(
    onStep: (event: AlgorithmEvent) => void,
    onComplete?: () => void
  ): void {
    if (this.isRunning) return;
    this.isRunning = true;

    const tick = () => {
      if (!this.isRunning) return;

      if (this.hasNext()) {
        const nextEvent = this.next()!;
        onStep(nextEvent);
        this.timerId = setTimeout(tick, this.speedMs);
      } else {
        this.stop();
        if (onComplete) onComplete();
      }
    };

    this.timerId = setTimeout(tick, this.speedMs);
  }

  public pause(): void {
    this.stop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
