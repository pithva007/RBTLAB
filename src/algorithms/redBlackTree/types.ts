export type NodeColor = 'RED' | 'BLACK' | 'DOUBLE_BLACK';

export type NodeRole =
  | 'current'
  | 'parent'
  | 'grandparent'
  | 'uncle'
  | 'sibling'
  | 'successor'
  | 'normal';

export interface TreeStatistics {
  nodes: number;
  height: number;
  blackHeight: number;
  redNodes: number;
  blackNodes: number;
  rotations: number;
  leftRotations: number;
  rightRotations: number;
  recolorings: number;
  comparisons: number;
  searchOperations: number;
  insertOperations: number;
  deleteOperations: number;
}

export interface TreePropertiesStatus {
  prop1Valid: boolean; // Every node is RED or BLACK
  prop2Valid: boolean; // The root is BLACK
  prop3Valid: boolean; // Every NIL leaf is BLACK
  prop4Valid: boolean; // A RED node cannot have a RED child
  prop5Valid: boolean; // All paths to leaves have the same black height
  allValid: boolean;
  violations: string[];
}

export type InsertBalancingCase =
  | 'ROOT_INSERT'
  | 'PARENT_BLACK'
  | 'UNCLE_RED' // Case 1: Recolor parent, uncle, grandparent
  | 'UNCLE_BLACK_LL' // Case 2a: Left-Left line -> Right rotate grandparent
  | 'UNCLE_BLACK_RR' // Case 2b: Right-Right line -> Left rotate grandparent
  | 'UNCLE_BLACK_LR' // Case 3a: Left-Right triangle -> Left rotate parent, then Right rotate grandparent
  | 'UNCLE_BLACK_RL'; // Case 3b: Right-Left triangle -> Right rotate parent, then Left rotate grandparent

export type DeleteBalancingCase =
  | 'NODE_RED_LEAF'
  | 'ROOT_DELETED'
  | 'ONE_CHILD_REPLACE'
  | 'INORDER_SUCCESSOR'
  | 'DB_SIBLING_RED' // Case 1: Sibling is RED
  | 'DB_SIBLING_BLACK_BOTH_CHILDREN_BLACK' // Case 2: Sibling is BLACK and both children are BLACK
  | 'DB_SIBLING_BLACK_NEAR_CHILD_RED' // Case 3: Sibling is BLACK, near child RED, far child BLACK
  | 'DB_SIBLING_BLACK_FAR_CHILD_RED'; // Case 4: Sibling is BLACK, far child RED

export interface SerializedRBNode {
  id: string;
  value: number | null;
  color: NodeColor;
  isNil: boolean;
  left?: SerializedRBNode | null;
  right?: SerializedRBNode | null;
  role?: NodeRole;
}
