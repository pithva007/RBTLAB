import { RBNode } from './RBNode';
import { TreeStatistics, SerializedRBNode } from './types';

export class RedBlackTree {
  public root: RBNode | null = null;
  public NIL: RBNode;
  protected statistics: TreeStatistics;

  constructor() {
    this.NIL = RBNode.createNil();
    this.statistics = this.createInitialStatistics();
  }

  protected createInitialStatistics(): TreeStatistics {
    return {
      nodes: 0,
      height: 0,
      blackHeight: 0,
      redNodes: 0,
      blackNodes: 0,
      rotations: 0,
      leftRotations: 0,
      rightRotations: 0,
      recolorings: 0,
      comparisons: 0,
      searchOperations: 0,
      insertOperations: 0,
      deleteOperations: 0,
    };
  }

  public getRoot(): RBNode | null {
    return this.root;
  }

  public isEmpty(): boolean {
    return this.root === null || this.root === this.NIL;
  }

  public clear(): void {
    this.root = null;
    this.statistics = this.createInitialStatistics();
  }

  public search(value: number): {
    found: boolean;
    node: RBNode | null;
    comparisons: number;
    path: RBNode[];
  } {
    this.statistics.searchOperations++;
    let current = this.root;
    let comparisons = 0;
    const path: RBNode[] = [];

    while (current && current !== this.NIL && !current.isNil) {
      path.push(current);
      comparisons++;
      this.statistics.comparisons++;

      if (current.value === value) {
        return { found: true, node: current, comparisons, path };
      }

      if (value < current.value!) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found: false, node: null, comparisons, path };
  }

  public find(value: number): RBNode | null {
    const result = this.search(value);
    return result.node;
  }

  public findMin(subRoot: RBNode | null = this.root): RBNode | null {
    if (!subRoot || subRoot === this.NIL || subRoot.isNil) return null;
    let current = subRoot;
    while (current.left && current.left !== this.NIL && !current.left.isNil) {
      current = current.left;
    }
    return current;
  }

  public findMax(subRoot: RBNode | null = this.root): RBNode | null {
    if (!subRoot || subRoot === this.NIL || subRoot.isNil) return null;
    let current = subRoot;
    while (current.right && current.right !== this.NIL && !current.right.isNil) {
      current = current.right;
    }
    return current;
  }

  public getHeight(node: RBNode | null = this.root): number {
    if (!node || node === this.NIL || node.isNil) return 0;
    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);
    return 1 + Math.max(leftHeight, rightHeight);
  }

  public getBlackHeight(node: RBNode | null = this.root): number {
    if (!node || node === this.NIL || node.isNil) return 1; // NIL sentinel has black height 1
    const leftBH = this.getBlackHeight(node.left);
    const rightBH = this.getBlackHeight(node.right);
    // In a balanced RB tree, leftBH === rightBH
    return (node.isBlack ? 1 : 0) + Math.max(leftBH, rightBH);
  }

  public getNodeCount(node: RBNode | null = this.root): number {
    if (!node || node === this.NIL || node.isNil) return 0;
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }

  public inorderTraversal(node: RBNode | null = this.root): number[] {
    const result: number[] = [];
    const traverse = (n: RBNode | null) => {
      if (!n || n === this.NIL || n.isNil) return;
      traverse(n.left);
      if (n.value !== null) result.push(n.value);
      traverse(n.right);
    };
    traverse(node);
    return result;
  }

  public preorderTraversal(node: RBNode | null = this.root): number[] {
    const result: number[] = [];
    const traverse = (n: RBNode | null) => {
      if (!n || n === this.NIL || n.isNil) return;
      if (n.value !== null) result.push(n.value);
      traverse(n.left);
      traverse(n.right);
    };
    traverse(node);
    return result;
  }

  public postorderTraversal(node: RBNode | null = this.root): number[] {
    const result: number[] = [];
    const traverse = (n: RBNode | null) => {
      if (!n || n === this.NIL || n.isNil) return;
      traverse(n.left);
      traverse(n.right);
      if (n.value !== null) result.push(n.value);
    };
    traverse(node);
    return result;
  }

  public updateStatistics(): TreeStatistics {
    let redCount = 0;
    let blackCount = 0;

    const countColors = (n: RBNode | null) => {
      if (!n || n === this.NIL || n.isNil) return;
      if (n.isRed) redCount++;
      else if (n.isBlack) blackCount++;
      countColors(n.left);
      countColors(n.right);
    };

    countColors(this.root);

    this.statistics.nodes = this.getNodeCount(this.root);
    this.statistics.height = this.getHeight(this.root);
    this.statistics.blackHeight = this.getBlackHeight(this.root);
    this.statistics.redNodes = redCount;
    this.statistics.blackNodes = blackCount;

    return { ...this.statistics };
  }

  public recordRotation(type: 'LEFT' | 'RIGHT'): void {
    this.statistics.rotations++;
    if (type === 'LEFT') {
      this.statistics.leftRotations++;
    } else {
      this.statistics.rightRotations++;
    }
  }

  public recordRecoloring(count = 1): void {
    this.statistics.recolorings += count;
  }

  public getStatistics(): TreeStatistics {
    this.updateStatistics();
    return { ...this.statistics };
  }

  public resetStatistics(): void {
    this.statistics = this.createInitialStatistics();
    this.updateStatistics();
  }

  public getState(): SerializedRBNode | null {
    if (!this.root || this.root === this.NIL) return null;
    return this.root.serialize();
  }

  public clone(): RedBlackTree {
    const clonedTree = new RedBlackTree();
    clonedTree.statistics = { ...this.statistics };
    if (this.root && this.root !== this.NIL) {
      clonedTree.root = this.root.clone();
    }
    return clonedTree;
  }
}
