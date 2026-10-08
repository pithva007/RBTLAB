<div align="center">

# 🔴⚫ RB-Tree Lab

### Interactive Red-Black Tree Laboratory, Visualizer & Algorithmic Benchmarking Platform

[![Live Demo](https://img.shields.io/badge/Demo-rbtvisuals.vercel.app-ff3366?style=for-the-badge&logo=vercel&logoColor=white)](https://rbtvisuals.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-pithva007%2FRBTLAB-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pithva007/RBTLAB)
[![Tests Passing](https://img.shields.io/badge/Tests-62%2F62%20Passing-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/pithva007/RBTLAB)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

> *"Understand how self-balancing trees actually think."*
> 
> **RB-Tree Lab** is an interactive, production-grade algorithm laboratory designed to bridge the gap between theoretical textbook algorithms (**CLRS Chapter 13**) and observable software mechanics. Built with a decoupled pure TypeScript algorithmic engine, real-time step-by-step playback, runtime invariant verification, empirical stress benchmarks, and competitive challenges.

<br/>

👉 **[Launch Live Visualizer at rbtvisuals.vercel.app](https://rbtvisuals.vercel.app)** 👈

</div>

---

## 📑 Table of Contents

- [🌟 Why RB-Tree Lab?](#-why-rb-tree-lab)
- [🌐 Live Deployment](#-live-deployment)
- [📐 The 5 Red-Black Tree Invariants](#-the-5-red-black-tree-invariants)
- [🔬 Core Laboratory Suites](#-core-laboratory-suites)
  - [1. Dynamic Tree Visualizer](#1-dynamic-tree-visualizer)
  - [2. Learning Mode (CLRS Case Encyclopedia)](#2-learning-mode-clrs-case-encyclopedia)
  - [3. BST vs. RBT Degeneration Comparison](#3-bst-vs-rbt-degeneration-comparison)
  - [4. Stress Test & Asymptotic Benchmarks](#4-stress-test--asymptotic-benchmarks)
  - [5. Algorithmic Arena (Challenge & Quiz Mode)](#5-algorithmic-arena-challenge--quiz-mode)
  - [6. Real-World Production Systems Guide](#6-real-world-production-systems-guide)
- [🧠 Algorithmic Rebalancing Mechanics](#-algorithmic-rebalancing-mechanics)
  - [Tree Rotations (Left & Right)](#tree-rotations-left--right)
  - [Insertion Fixup (Cases 1, 2, 3)](#insertion-fixup-cases-1-2-3)
  - [Deletion Fixup (Double-Black Cases 1, 2, 3, 4)](#deletion-fixup-double-black-cases-1-2-3-4)
- [📊 Asymptotic Complexity Comparison](#-asymptotic-complexity-comparison)
- [🏗️ Architectural Design & Codebase Structure](#️-architectural-design--codebase-structure)
- [🧪 Automated Test Suite](#-automated-test-suite)
- [🚀 Quick Start & Local Development](#-quick-start--local-development)
- [🛠️ Tech Stack](#️-tech-stack)
- [📄 License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Why RB-Tree Lab?

Most online Data Structures & Algorithms visualizers jump straight from an input value to the completed, balanced tree, concealing the very mechanics students and engineers need to understand:

- **Intermediate Event Streaming**: RB-Tree Lab records every atomic step—relationship resolution, double-red detection, uncle inspection, color flips, and pointer swaps.
- **Role-Based Highlighting**: Color-codes nodes dynamically according to their active algorithmic role (`Inserted`, `Violator`, `Parent`, `Uncle`, `Grandparent`, `Sibling`).
- **Mathematical Coordinate Layout**: Hierarchical tree layout computed dynamically via a custom collision-free coordinate engine—no hardcoded node placements.
- **Strict Decoupling**: The core Red-Black Tree and BST implementations have **zero dependencies on React, HTML, or the DOM**.
- **Interactive Invariant Inspector**: Automatically re-checks all 5 Red-Black properties on every intermediate step with real-time pass/fail badges.

---

## 🌐 Live Deployment

The laboratory is permanently hosted on Vercel with automated CI/CD:

| Resource | Link |
| :--- | :--- |
| **Production URL** | **[https://rbtvisuals.vercel.app](https://rbtvisuals.vercel.app)** |
| **Alternative Domain** | **[http://rbtvisuals.vercel.app](http://rbtvisuals.vercel.app)** |
| **Source Code** | **[https://github.com/pithva007/RBTLAB](https://github.com/pithva007/RBTLAB)** |

---

## 📐 The 5 Red-Black Tree Invariants

Every valid Red-Black Tree strictly adheres to the five fundamental properties outlined in Cormen, Leiserson, Rivest, and Stein (*Introduction to Algorithms*, Chapter 13):

```
       [ 50 (BLACK) ]               <-- Rule #2: Root is BLACK
         /        \
   [ 25 (RED) ]  [ 75 (RED) ]       <-- Rule #1: Every node is RED or BLACK
     /      \      /      \
  [12(B)] [37(B)][62(B)] [88(B)]    <-- Rule #4: No two consecutive REDs
   /   \   /   \  /   \   /   \
  NIL NIL NIL NILNIL NIL NIL NIL   <-- Rule #3: NIL leaves are BLACK
                                   <-- Rule #5: Equal black-height along all simple paths (bh = 2)
```

1. **Property 1 (Node Color)**: Every node is either `RED` or `BLACK`.
2. **Property 2 (Root Invariant)**: The root node is always `BLACK`.
3. **Property 3 (Leaf Invariant)**: Every leaf (`NIL` sentinel) is `BLACK`.
4. **Property 4 (Red Invariant / Double-Red Prohibition)**: If a node is `RED`, then both its children must be `BLACK`. In other words, no simple path can contain two consecutive `RED` nodes.
5. **Property 5 (Black-Height Invariant)**: For each node, all simple downward paths from the node to descendant leaves contain the **exact same number of black nodes**.

### Mathematical Height Guarantee
From these 5 invariants, a Red-Black Tree containing $n$ internal nodes satisfies:

$$\text{Height } h \le 2 \log_2(n + 1)$$

This guarantees that search, insert, and delete operations always complete in guaranteed $O(\log n)$ worst-case time without exception.

---

## 🔬 Core Laboratory Suites

The application consists of 6 dedicated modules accessible through the global navigation bar:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              RB-TREE LAB SUITES                              │
├──────────────┬──────────────┬──────────────┬──────────────┬──────────────────┤
│  Visualizer  │  Learn Mode  │  BST vs RBT  │ Stress Test  │ Algorithmic Quiz │
│ Step Debugger│ CLRS 8 Cases │ Skew Compare │ 10k Benchmarks│ Intuition Arena │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────────┘
```

### 1. Dynamic Tree Visualizer
- **High-DPI SVG Canvas**: Fluid layout with zoom controls ($0.4\times$ to $2.5\times$), mouse drag panning, touch gestures, and viewport centering.
- **NIL Sentinel Toggle**: View or hide the black sentinel `NIL` leaves to inspect true black-height boundary conditions.
- **Step-by-Step Playback Controller**:
  - `Play` / `Pause` with dynamic playback speed ($100\text{ ms}$ to $1500\text{ ms}$).
  - `Step Next` & `Step Prev` for micro-investigation of balancing stages.
  - `Skip to End` and `Restart` for rapid iteration.
- **Role-Based Highlighting Matrix**:
  | Role Indicator | Badge | Meaning |
  | :--- | :--- | :--- |
  | **Inserted Node** | 🟢 Green Glow | Node currently being placed or inspected |
  | **Violator** | 🔴 Red Pulse | Double-red clash or double-black deficit |
  | **Parent** | 🟡 Yellow Ring | Parent of the current node |
  | **Uncle** | 🟣 Purple Ring | Sibling of the parent node |
  | **Grandparent** | 🟠 Orange Ring | Parent of the parent node |
  | **Sibling** | 🔵 Blue Ring | Sibling of the double-black node (during deletion) |
- **Synchronized Pseudocode Panel**: Highlights corresponding line in Cormen et al.'s `RB-INSERT` or `RB-DELETE-FIXUP` algorithms as the tree mutates.
- **Time-Travel History**: Complete snapshot undo/redo stack (`Undo` / `Redo`).
- **Data Generator Presets**:
  - Random permutations
  - Strictly ascending ($1, 2, 3, \dots, n$ — worst-case skew trigger)
  - Strictly descending
  - Nearly sorted datasets
  - Duplicate-heavy collections

### 2. Learning Mode (CLRS Case Encyclopedia)
An interactive textbook mode explaining all **8 foundational balancing cases**:
- **Insertion Cases**:
  - **Case 1 (Uncle is RED)**: Recolor parent, uncle, and grandparent; push check to grandparent.
  - **Case 2a / 2b (Uncle is BLACK — Triangle Configuration)**: Inner child zigzag; convert to line via single child rotation.
  - **Case 3a / 3b (Uncle is BLACK — Line Configuration)**: Outer child straight line; recolor and rotate grandparent.
- **Deletion Cases (Double-Black Resolutions)**:
  - **Case 1 (Sibling is RED)**: Transform into black sibling via parent rotation.
  - **Case 2 (Sibling is BLACK with Black Children)**: Recolor sibling to RED; propagate double-black upward.
  - **Case 3 (Sibling is BLACK with Red Inner Nephew)**: Rotate sibling to align outer child.
  - **Case 4 (Sibling is BLACK with Red Outer Nephew)**: Final terminal rotation and recolor; eliminates double-black completely.
- **Live Interactive Demos**: Click *"Simulate Case"* to witness pre-configured before-and-after tree transformations with dedicated commentary.

### 3. BST vs. RBT Degeneration Comparison
Witness the dramatic difference between an unbalanced Binary Search Tree and a self-balancing Red-Black Tree under identical inputs:
- **Degeneration Demonstrator**: Feed sequentially sorted data ($1, 2, 3, 4, 5, 6, 7, 8, 9, 10$).
- **Visual Contrast**:
  - Standard BST degenerates into a linear linked list of height $h = n$, leading to worst-case $O(n)$ search time.
  - Red-Black Tree maintains logarithmic height $h = O(\log n)$ through automatic rotations and recoloring.
- **Live Empirical Metrics**: Direct side-by-side comparison of tree height, pointer comparison counts, search traversal depth, and total rotation count.

### 4. Stress Test & Asymptotic Benchmarks
A browser-based stress testing suite powered by **Recharts**:
- **Scalable Stress Load**: Test from $10$ up to $10,000$ operations in real time.
- **Operation Profiles**: `INSERT_ALL`, `DELETE_ALL`, `MIXED (70% Insert / 30% Delete)`, and `SEARCH_BENCHMARK`.
- **Empirical Curve Analysis**: Plots actual operations against theoretical $O(\log n)$ and $O(n)$ curves.
- **Detailed Telemetry**: Displays exact millisecond execution time, total rotations performed, total recoloring events, and total node comparisons.

### 5. Algorithmic Arena (Challenge & Quiz Mode)
Gamified knowledge evaluation for algorithm students and technical interview preparation:
- **Dynamic Challenge Categories**:
  - `IDENTIFY_VIOLATION`: Spot which of the 5 invariants is broken.
  - `IDENTIFY_UNCLE`: Trace tree relationships to isolate the uncle node.
  - `IDENTIFY_CASE`: Classify the active insertion or deletion fixup case.
  - `PREDICT_ROTATION`: Determine whether a Left or Right rotation is required and at which pivot.
  - `PREDICT_RECOLORING`: Predict node color transitions after rebalancing.
  - `IDENTIFY_COMPLEXITY`: Answer asymptotic complexity and rotation-bound questions.
- **Real-Time Score & Streak Tracker**: Track correct streaks, accuracy percentages, and access detailed hints and explanations for every answer.

### 6. Real-World Production Systems Guide
Explains where Red-Black Trees are actively used in production operating systems and language standard libraries:
- 🐧 **Linux Kernel Completely Fair Scheduler (CFS)**: Indexes runnable processes by `vruntime` using `<linux/rbtree.h>`.
- ⚡ **C++ Standard Template Library (STL)**: Powers `std::map`, `std::set`, `std::multimap`, and `std::multiset` in GCC libstdc++ and LLVM libc++.
- ☕ **Java Collections Framework**: Powers `java.util.TreeMap`, `TreeSet`, and handles hash collisions in `HashMap` buckets when bin count exceeds 8 (treeification).
- 💾 **OS Virtual Memory Managers**: Linux, FreeBSD, and Windows NT index Virtual Memory Areas (VMAs) for $O(\log n)$ address lookups and allocations.

---

## 🧠 Algorithmic Rebalancing Mechanics

### Tree Rotations (Left & Right)

Rotations are fundamental $O(1)$ operations that change the local tree structure while strictly preserving the Binary Search Tree invariant ($Left < Root < Right$).

#### Left Rotation at Node $x$:
```
       |                               |
       x                               y
      / \        LEFT-ROTATE(x)       / \
     α   y      ───────────────>     x   γ
        / \                         / \
       β   γ                       α   β
```

#### Right Rotation at Node $y$:
```
         |                             |
         y                             x
        / \      RIGHT-ROTATE(y)      / \
       x   γ    ───────────────>     α   y
      / \                               / \
     α   β                             β   γ
```

---

### Insertion Fixup (Cases 1, 2, 3)

When a new key $z$ is inserted, it is initially colored **`RED`** to preserve the Black-Height invariant (Property 5). If its parent is also **`RED`**, Property 4 (no double-red) is violated.

```
                    ┌────────────────────────────┐
                    │    Double-Red Violation    │
                    │      (z.parent is RED)     │
                    └─────────────┬──────────────┘
                                  │
                   Is Uncle RED or BLACK?
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
            ┌───────────────┐           ┌───────────────┐
            │ Uncle is RED  │           │Uncle is BLACK │
            │   (Case 1)    │           │ (Cases 2 & 3) │
            └───────┬───────┘           └───────┬───────┘
                    │                           │
          Recolor Parent & Uncle            Is z an Inner Child
          to BLACK; Grandparent             (Zigzag / Triangle)?
          to RED. Advance check             ┌───┴───┐
          to Grandparent.                   ▼       ▼
                                          YES      NO
                                           │        │
                                     Case 2:       Case 3:
                                     Rotate at     Recolor Parent to BLACK,
                                     Parent to     Grandparent to RED.
                                     make Line     Rotate at Grandparent.
                                           │              │
                                           └──────────────┘
                                                  ▼
                                          Balanced! (≤ 2 Rotations)
```

> [!IMPORTANT]
> **Insertion Rotation Bound**: No insertion in a Red-Black Tree ever requires more than **2 rotations** to restore complete balance, regardless of tree size!

---

### Deletion Fixup (Double-Black Cases 1, 2, 3, 4)

Deleting a black node removes a unit of black-height from a path, producing a conceptual **Double-Black** deficit on node $x$. The algorithm eliminates this deficit by consulting sibling $w$:

| Case | Precondition | Algorithmic Action | Result |
| :---: | :--- | :--- | :--- |
| **Case 1** | Sibling $w$ is `RED` | Recolor $w$ to `BLACK`, parent to `RED`. Rotate at parent. | Converts to Case 2, 3, or 4. |
| **Case 2** | Sibling $w$ is `BLACK`, both children of $w$ are `BLACK` | Recolor $w$ to `RED`. Push double-black up to parent $x.p$. | Loop terminates if $x.p$ was `RED`, else repeats up the tree. |
| **Case 3** | Sibling $w$ is `BLACK`, inner child is `RED`, outer is `BLACK` | Recolor inner child `BLACK`, $w$ to `RED`. Rotate at $w$. | Converts directly to Case 4. |
| **Case 4** | Sibling $w$ is `BLACK`, outer child is `RED` | Set $w$.color = parent.color, parent = `BLACK`, outer child = `BLACK`. Rotate at parent. | **Terminal.** Double-black completely resolved. |

> [!IMPORTANT]
> **Deletion Rotation Bound**: No deletion in a Red-Black Tree ever requires more than **3 rotations** to restore complete balance!

---

## 📊 Asymptotic Complexity Comparison

| Data Structure | Search (Avg) | Search (Worst) | Insert (Worst) | Delete (Worst) | Max Rotations / Ins | Max Rotations / Del | Strict Balance |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Standard BST** | $O(\log n)$ | $O(n)$ | $O(n)$ | $O(n)$ | $0$ | $0$ | ❌ None |
| **AVL Tree** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $\le 2$ | $O(\log n)$ | ✅ Rigorous ($\Delta h \le 1$) |
| **Red-Black Tree** | $\mathbf{O(\log n)}$ | $\mathbf{O(\log n)}$ | $\mathbf{O(\log n)}$ | $\mathbf{O(\log n)}$ | $\mathbf{\le 2}$ | $\mathbf{\le 3}$ | ✅ Bounded ($h \le 2\log(n+1)$) |
| **Skip List** | $O(\log n)$ | $O(n)$ | $O(\log n)$ | $O(\log n)$ | N/A | N/A | ⚠️ Probabilistic |

---

## 🏗️ Architectural Design & Codebase Structure

The codebase is built on **Clean Architecture principles**: the core data structures and algorithms have zero coupling to React, canvas drawing, or DOM elements.

```
rbt-lab/
├── index.html                           # App shell with dark mode & fonts
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # Strict TypeScript 5 configuration
├── tailwind.config.js                   # Custom theme & animation tokens
├── vercel.json                          # Single Page App rewrite rule
├── vite.config.ts                       # Vite 6 bundler config
├── src/
│   ├── main.tsx                         # React entry point
│   ├── App.tsx                          # Hash-based routing & view dispatcher
│   ├── index.css                        # Tailwind CSS directives & global scrollbars
│   │
│   ├── algorithms/                      # 🧠 PURE ALGORITHMS (Zero UI Coupling)
│   │   ├── redBlackTree/
│   │   │   ├── types.ts                 # Color, SerializedRBNode, NodeRole definitions
│   │   │   ├── RBNode.ts                # Red-Black Node class with kinship helpers
│   │   │   ├── RedBlackTree.ts          # Core RBT container & tree metrics
│   │   │   ├── rotations.ts             # Atomic Left-Rotate & Right-Rotate
│   │   │   ├── insertion.ts             # BST insert + Case 1/2/3 rebalancing
│   │   │   ├── deletion.ts              # BST delete + Case 1/2/3/4 Double-Black fixup
│   │   │   ├── validation.ts            # Invariant validator for Properties 1–5
│   │   │   ├── events.ts                # Event generator & playback execution engine
│   │   │   └── __tests__/               # Algorithmic unit tests (Vitest)
│   │   └── bst/
│   │       ├── BSTNode.ts               # Unbalanced BST node
│   │       ├── BinarySearchTree.ts      # Unbalanced BST comparison class
│   │       └── __tests__/               # BST unit tests
│   │
│   ├── components/                      # 🎨 UI & VISUALIZATION LAYER
│   │   ├── common/                      # Global Navbar & layout containers
│   │   ├── visualizer/                  # TreeCanvas, TreeNode, TreeEdge, Controls,
│   │   │                                # PseudocodePanel, ExplanationPanel, Panels
│   │   ├── learn/                       # CaseVisualizer & LearnExplainer
│   │   ├── compare/                     # TreeComparisonView (BST vs RBT side-by-side)
│   │   ├── stress/                      # PerformanceCharts (Recharts curves)
│   │   └── challenge/                   # QuizCard, ScoreTracker, challengeGenerator
│   │
│   ├── hooks/
│   │   └── useTreeHistory.ts            # Full undo/redo time-travel snapshot hook
│   ├── pages/                           # Primary route pages (Visualizer, Learn, etc.)
│   └── utils/
│       ├── treeLayout.ts                # Collision-free hierarchical SVG coordinates
│       └── datasets.ts                  # Preset & PRNG dataset generators
```

---

## 🧪 Automated Test Suite

RB-Tree Lab includes **62 automated unit tests** across 13 test suites executed with Vitest:

```bash
npm run test
```

```
✓ src/algorithms/redBlackTree/__tests__/RBNode.test.ts (7 tests)
✓ src/algorithms/redBlackTree/__tests__/rotations.test.ts (6 tests)
✓ src/algorithms/redBlackTree/__tests__/insertion.test.ts (9 tests)
✓ src/algorithms/redBlackTree/__tests__/deletion.test.ts (7 tests)
✓ src/algorithms/redBlackTree/__tests__/validation.test.ts (6 tests)
✓ src/algorithms/redBlackTree/__tests__/events.test.ts (4 tests)
✓ src/algorithms/redBlackTree/__tests__/RedBlackTree.test.ts (3 tests)
✓ src/algorithms/redBlackTree/__tests__/stress.test.ts (3 tests)
✓ src/algorithms/bst/__tests__/BinarySearchTree.test.ts (4 tests)
✓ src/utils/__tests__/treeLayout.test.ts (3 tests)
✓ src/utils/__tests__/datasets.test.ts (5 tests)
✓ src/components/challenge/__tests__/challengeGenerator.test.ts (2 tests)
✓ src/components/learn/__tests__/CaseVisualizer.test.ts (3 tests)

Test Files  13 passed (13)
     Tests  62 passed (62)
```

### Coverage Highlights:
- **Kinship Resolution**: Verified sibling, uncle, and grandparent pointer traversal across asymmetric subtrees.
- **BST Invariant Invariance**: Validated that Left and Right rotations preserve binary search tree order without key loss.
- **Double-Red Elimination**: Thorough coverage of all insertion cases (Case 1 recoloring, Case 2 triangle, Case 3 line).
- **Double-Black Resolution**: Exhaustive verification of deletion cases 1 through 4 including predecessor/successor splicing.
- **Adversarial Invariant Verification**: Purposefully corrupted tree nodes tested against `validation.ts` to confirm 100% detection of violated properties 1, 2, 3, 4, and 5.
- **Layout Non-Collision**: Proves that generated SVG node coordinates never overlap at identical $(x, y)$ positions.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm`, `yarn`, or `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/pithva007/RBTLAB.git
cd RBTLAB
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Run Automated Tests
```bash
# Run tests once
npm test

# Run tests in interactive watch mode
npm run test:watch
```

### 5. Create a Production Build
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory.

### 6. Preview Production Build Locally
```bash
npm run preview
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[TypeScript 5.7](https://www.typescriptlang.org/)** | Strongly typed, type-safe implementation of pure algorithmic data structures |
| **[React 18.3](https://react.dev/)** | Declarative component UI and reactive state orchestration |
| **[Vite 6.0](https://vitejs.dev/)** | Next-generation ultra-fast frontend build tool and dev server |
| **[Tailwind CSS 3.4](https://tailwindcss.com/)** | High-contrast, dark-mode design system with responsive layouts |
| **[Recharts 2.15](https://recharts.org/)** | Composable charting library for asymptotic stress performance curves |
| **[Lucide React](https://lucide.dev/)** | Clean, accessible iconography throughout the user interface |
| **[Vitest 2.1](https://vitest.dev/)** | Blazing-fast unit test runner for algorithmic and utility suites |
| **[Vercel](https://vercel.com/)** | Edge global deployment and CDN hosting |

---

## 📄 License & Acknowledgments

This project is open-source and licensed under the **[MIT License](LICENSE)**.

### References & Reading
- **Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein** — *Introduction to Algorithms* (3rd & 4th Editions), Chapter 13: Red-Black Trees.
- **Robert Sedgewick** — *Left-Leaning Red-Black Trees* (Princeton University).
- **Linux Kernel Source** — [`include/linux/rbtree.h`](https://github.com/torvalds/linux/blob/master/include/linux/rbtree.h) and [`lib/rbtree.c`](https://github.com/torvalds/linux/blob/master/lib/rbtree.c).

---

<div align="center">
  <sub>Built for students, software engineers, and algorithm enthusiasts.</sub><br/>
  <sub>Explore the live visualizer anytime at <a href="https://rbtvisuals.vercel.app"><strong>rbtvisuals.vercel.app</strong></a></sub>
</div>
