# RB-Tree Lab (Red-Black Tree Laboratory)

An interactive, production-grade algorithm laboratory and visualizer for exploring and mastering **Red-Black Self-Balancing Binary Search Trees**.

Built with **React 18**, **TypeScript 5**, **Tailwind CSS 3**, **Vite 6**, and **Vitest**.

---

## 🌟 Key Features

### 1. Interactive Visualizer
- **Dynamic Tree Canvas**: High-DPI SVG rendering with dynamic hierarchical layout calculation (`treeLayout.ts`).
- **Smooth Panning & Zooming**: Mouse drag, touch dragging for smartphones and tablets, scroll wheel zoom, reset viewport, and toggleable NIL sentinel leaves.
- **Visual Node Roles**: Role-based color coding for nodes actively involved in operations:
  - 🟢 **Inserted Node**
  - 🔴 **Violator / Double Red**
  - 🟡 **Parent**
  - 🟣 **Uncle**
  - 🟠 **Grandparent**
  - 🔵 **Sibling**
- **Step-by-Step Playback**: Step forward, step backward, auto-play with adjustable speed (100ms - 1500ms), and real-time step explanation log.
- **Time-Travel History**: Undo and redo past operations with complete snapshot preservation.
- **Preset Data Generators**: Sorted ascending/descending, random permutations, alternating extremes, and duplicate datasets.
- **Invariants Inspector**: Live runtime verification of all 5 Red-Black Tree properties with real-time pass/fail badges and tree metrics.

### 2. Interactive Learning Mode
- **Theory & Invariant Guides**: Detailed explanations of the 5 foundational Red-Black Tree axioms.
- **Interactive Case Visualizer**:
  - **Insertion**: Case 1 (Red Uncle / Recolor), Case 2 (Black Uncle Triangle / Double Rotation), Case 3 (Black Uncle Line / Single Rotation).
  - **Deletion**: Case 1 (Red Sibling), Case 2 (Black Sibling with Black Children), Case 3 (Black Sibling with Red Inner Child), Case 4 (Black Sibling with Red Outer Child).
- **Interactive Demonstration**: Step through before-and-after states of each case with dynamic tree diagrams.

### 3. BST vs. Red-Black Tree Comparison
- **Degeneration Demonstrator**: Side-by-side visualization of an unbalanced BST against a self-balancing Red-Black Tree.
- **Degenerate Patterns**: Test adversarial sequential datasets (`1, 2, 3, 4, 5, 6, 7, 8`) to witness standard BST degenerate into an $O(n)$ linked list while the Red-Black Tree remains tightly bounded at $O(\log n)$ height.
- **Direct Metrics**: Real-time height comparisons, node comparison counts, and percentage depth reduction metrics.

### 4. Stress Testing & Browser Benchmarks
- **Large-Scale Operations**: Test trees with up to 1,000+ nodes.
- **Performance Curves**: Interactive charts rendered with Recharts comparing experimental operations against theoretical $O(\log n)$ and $O(n)$ bounds.
- **Automated Validation**: Rigorous runtime verification confirming that black-height equality and no double-red rules hold across thousands of operations.

### 5. Challenge & Quiz Mode
- **Algorithmic Practice**: Test your knowledge with dynamically generated Red-Black Tree questions:
  - Rotations (Left vs. Right rotation outcomes)
  - Color flips and recoloring mechanics
  - Insertion balancing case identification
  - Deletion fixup classifications
- **Score & Streak Tracking**: Real-time score calculator, streak counter, and comprehensive explanations for correct and incorrect answers.

---

## 📐 Red-Black Tree Invariants

Every valid Red-Black Tree satisfies the following mathematical invariants:

1. **Node Color**: Every node is either **RED** or **BLACK**.
2. **Root Invariant**: The root node is always **BLACK**.
3. **Leaf Invariant**: Every leaf (`NIL` sentinel) is **BLACK**.
4. **Red Invariant**: If a node is **RED**, both of its children must be **BLACK** (no two consecutive red nodes on any simple path).
5. **Black-Height Invariant**: For each node, all simple downward paths to descendant leaves contain the **exact same number of black nodes**.

---

## 🏗️ Codebase Architecture

The project strictly separates pure algorithmic data structures from UI rendering:

```
src/
├── algorithms/
│   ├── redBlackTree/
│   │   ├── types.ts          # Core types (Color, SerializedRBNode, etc.)
│   │   ├── RBNode.ts         # Red-Black Node implementation
│   │   ├── RedBlackTree.ts   # Core RBT data structure class
│   │   ├── rotations.ts      # Left and Right tree rotations
│   │   ├── insertion.ts      # BST insertion + recolor / rotation balancing
│   │   ├── deletion.ts       # BST deletion + Double-Black fixup cases
│   │   ├── validation.ts     # Invariant checker & black-height validator
│   │   ├── events.ts         # Step-by-step animation event emitter
│   │   └── __tests__/        # Complete algorithmic unit test suite
│   └── bst/
│       ├── BSTNode.ts        # Unbalanced BST node
│       ├── BinarySearchTree.ts # Unbalanced BST comparison class
│       └── __tests__/        # BST unit test suite
├── components/
│   ├── common/               # Navbar, layout shell
│   ├── visualizer/           # TreeCanvas, TreeNode, TreeEdge, Controls, Panels
│   ├── learn/                # CaseVisualizer, LearnExplainer
│   ├── compare/              # TreeComparisonView
│   ├── stress/               # PerformanceCharts
│   └── challenge/            # QuizCard, ScoreTracker, challengeGenerator
├── hooks/
│   └── useTreeHistory.ts     # History stack & undo/redo hook
├── pages/                    # Route pages (Landing, Visualizer, Learn, Challenge, etc.)
├── utils/
│   ├── treeLayout.ts         # Hierarchical tree coordinates layout engine
│   └── datasets.ts           # Predefined & randomized dataset presets
├── App.tsx                   # Hash routing and page switcher
└── main.tsx                  # React application entry point
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/pithva007/RBTLAB.git
cd RBTLAB

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Run Unit Tests

```bash
npm run test
```

### Production Build

```bash
npm run build
```

---

## 🧪 Test Suite Summary

The laboratory includes **62 comprehensive unit tests** across 13 test suites covering:
- Node creation, color toggling, sibling, uncle, and grandparent resolution
- Left and right rotations preserving binary search order
- Insertion balancing across all recoloring and rotation cases
- Deletion fixups across all double-black cases
- Red-Black Tree invariant validations with positive and adversarial corrupted cases
- Unbalanced Binary Search Tree behavior and height degeneration
- Step-by-step event emission for animation replay
- Tree layout coordinate generation without node collisions
- Dynamic quiz generation with deterministic seeds

---

## 📄 License

MIT License. Open for educational and research use.
