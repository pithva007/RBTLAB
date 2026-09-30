import { BSTNode } from './BSTNode';
import { SerializedRBNode } from '../redBlackTree/types';

export interface BSTStatistics {
  nodes: number;
  height: number;
  comparisons: number;
  insertOperations: number;
  deleteOperations: number;
  searchOperations: number;
}

export class BinarySearchTree {
  public root: BSTNode | null = null;
  private stats: BSTStatistics = {
    nodes: 0,
    height: 0,
    comparisons: 0,
    insertOperations: 0,
    deleteOperations: 0,
    searchOperations: 0,
  };

  public clear(): void {
    this.root = null;
    this.stats = {
      nodes: 0,
      height: 0,
      comparisons: 0,
      insertOperations: 0,
      deleteOperations: 0,
      searchOperations: 0,
    };
  }

  public insert(value: number): boolean {
    this.stats.insertOperations++;
    const newNode = new BSTNode(value);

    if (!this.root) {
      this.root = newNode;
      this.updateStats();
      return true;
    }

    let current: BSTNode | null = this.root;
    let parent: BSTNode | null = null;

    while (current !== null) {
      parent = current;
      this.stats.comparisons++;

      if (value === current.value) {
        return false; // Duplicate
      }

      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    newNode.parent = parent;
    if (value < parent!.value) {
      parent!.left = newNode;
    } else {
      parent!.right = newNode;
    }

    this.updateStats();
    return true;
  }

  public search(value: number): { found: boolean; comparisons: number } {
    this.stats.searchOperations++;
    let current = this.root;
    let comparisons = 0;

    while (current !== null) {
      comparisons++;
      this.stats.comparisons++;

      if (current.value === value) {
        return { found: true, comparisons };
      }

      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found: false, comparisons };
  }

  public delete(value: number): boolean {
    this.stats.deleteOperations++;
    let current = this.root;

    while (current !== null) {
      this.stats.comparisons++;
      if (current.value === value) break;
      current = value < current.value ? current.left : current.right;
    }

    if (!current) return false;

    // Node found: handle 0, 1, or 2 children
    if (!current.left || !current.right) {
      const child = current.left || current.right;
      if (!current.parent) {
        this.root = child;
      } else if (current === current.parent.left) {
        current.parent.left = child;
      } else {
        current.parent.right = child;
      }
      if (child) child.parent = current.parent;
    } else {
      // 2 children: Find inorder successor
      let successor = current.right;
      while (successor.left) {
        successor = successor.left;
      }
      current.value = successor.value;

      // Splice successor
      const succChild = successor.right;
      if (successor === successor.parent!.left) {
        successor.parent!.left = succChild;
      } else {
        successor.parent!.right = succChild;
      }
      if (succChild) succChild.parent = successor.parent;
    }

    this.updateStats();
    return true;
  }

  public getHeight(node: BSTNode | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  public getNodeCount(node: BSTNode | null = this.root): number {
    if (!node) return 0;
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }

  public inorderTraversal(node: BSTNode | null = this.root): number[] {
    const res: number[] = [];
    const traverse = (n: BSTNode | null) => {
      if (!n) return;
      traverse(n.left);
      res.push(n.value);
      traverse(n.right);
    };
    traverse(node);
    return res;
  }

  private updateStats(): void {
    this.stats.nodes = this.getNodeCount();
    this.stats.height = this.getHeight();
  }

  public getStatistics(): BSTStatistics {
    this.updateStats();
    return { ...this.stats };
  }

  public getState(): SerializedRBNode | null {
    if (!this.root) return null;
    return this.root.serialize();
  }
}
