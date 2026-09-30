import { NodeColor, NodeRole, SerializedRBNode } from './types';

let nodeIdCounter = 0;

export class RBNode {
  public id: string;
  public value: number | null;
  public color: NodeColor;
  public left: RBNode | null = null;
  public right: RBNode | null = null;
  public parent: RBNode | null = null;
  public role: NodeRole = 'normal';

  constructor(value: number | null, color: NodeColor = 'RED', id?: string) {
    this.value = value;
    this.color = color;
    this.id = id || `node_${++nodeIdCounter}_${value !== null ? value : 'nil'}`;
  }

  public get isNil(): boolean {
    return this.value === null;
  }

  public get isRed(): boolean {
    return this.color === 'RED';
  }

  public get isBlack(): boolean {
    return this.color === 'BLACK';
  }

  public isLeftChild(): boolean {
    return this.parent !== null && this.parent.left === this;
  }

  public isRightChild(): boolean {
    return this.parent !== null && this.parent.right === this;
  }

  public getSibling(): RBNode | null {
    if (!this.parent) return null;
    return this.isLeftChild() ? this.parent.right : this.parent.left;
  }

  public getGrandparent(): RBNode | null {
    return this.parent ? this.parent.parent : null;
  }

  public getUncle(): RBNode | null {
    const grandparent = this.getGrandparent();
    if (!grandparent || !this.parent) return null;
    return this.parent.isLeftChild() ? grandparent.right : grandparent.left;
  }

  public serialize(): SerializedRBNode {
    return {
      id: this.id,
      value: this.value,
      color: this.color,
      isNil: this.isNil,
      role: this.role,
      left: this.left ? this.left.serialize() : null,
      right: this.right ? this.right.serialize() : null,
    };
  }

  public clone(visited = new Map<RBNode, RBNode>()): RBNode {
    if (visited.has(this)) {
      return visited.get(this)!;
    }

    const cloned = new RBNode(this.value, this.color, this.id);
    cloned.role = this.role;
    visited.set(this, cloned);

    if (this.left) {
      cloned.left = this.left.clone(visited);
      cloned.left.parent = cloned;
    }
    if (this.right) {
      cloned.right = this.right.clone(visited);
      cloned.right.parent = cloned;
    }

    return cloned;
  }

  public static createNil(parent: RBNode | null = null): RBNode {
    const nilNode = new RBNode(null, 'BLACK');
    nilNode.parent = parent;
    return nilNode;
  }

  public static resetIdCounter(): void {
    nodeIdCounter = 0;
  }
}
