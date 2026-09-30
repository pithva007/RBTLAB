import { SerializedRBNode } from '../redBlackTree/types';

let bstNodeCounter = 0;

export class BSTNode {
  public id: string;
  public value: number;
  public left: BSTNode | null = null;
  public right: BSTNode | null = null;
  public parent: BSTNode | null = null;

  constructor(value: number, id?: string) {
    this.value = value;
    this.id = id || `bst_node_${++bstNodeCounter}_${value}`;
  }

  public serialize(): SerializedRBNode {
    return {
      id: this.id,
      value: this.value,
      color: 'BLACK', // Rendered as neutral dark/slate in comparative view
      isNil: false,
      role: 'normal',
      left: this.left ? this.left.serialize() : null,
      right: this.right ? this.right.serialize() : null,
    };
  }

  public static resetCounter(): void {
    bstNodeCounter = 0;
  }
}
