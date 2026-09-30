export type DatasetPresetType =
  | 'random'
  | 'ascending'
  | 'descending'
  | 'nearly_sorted'
  | 'duplicate_heavy';

export interface DatasetOptions {
  count?: number;
  min?: number;
  max?: number;
  seed?: number;
  allowDuplicates?: boolean;
}

/**
 * Deterministic pseudo-random number generator (Mulberry32).
 */
export function createRng(seed: number = 42): () => number {
  let s = seed >>> 0;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates datasets tailored for demonstrating Red-Black Tree balancing.
 */
export function generateDataset(
  type: DatasetPresetType,
  options: DatasetOptions = {}
): number[] {
  const {
    count = 10,
    min = 1,
    max = 100,
    seed = 12345,
    allowDuplicates = false,
  } = options;

  const rng = createRng(seed);

  switch (type) {
    case 'ascending': {
      // 1, 2, 3, 4, 5... (Severe skew test, triggers RR rotations)
      const step = Math.max(1, Math.floor((max - min) / count));
      const res: number[] = [];
      for (let i = 0; i < count; i++) {
        res.push(min + i * step);
      }
      return res;
    }

    case 'descending': {
      // 100, 99, 98... (Severe skew test, triggers LL rotations)
      const step = Math.max(1, Math.floor((max - min) / count));
      const res: number[] = [];
      for (let i = 0; i < count; i++) {
        res.push(max - i * step);
      }
      return res;
    }

    case 'nearly_sorted': {
      // Mostly sorted with ~15% random permutations
      const step = Math.max(1, Math.floor((max - min) / count));
      const res: number[] = [];
      for (let i = 0; i < count; i++) {
        res.push(min + i * step);
      }
      for (let i = 0; i < count - 1; i++) {
        if (rng() < 0.25) {
          const temp = res[i];
          res[i] = res[i + 1];
          res[i + 1] = temp;
        }
      }
      return res;
    }

    case 'duplicate_heavy': {
      // Numbers chosen from small pool of 5 distinct values
      const pool = [10, 20, 30, 40, 50];
      const res: number[] = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(rng() * pool.length);
        res.push(pool[idx]);
      }
      return res;
    }

    case 'random':
    default: {
      const set = new Set<number>();
      const res: number[] = [];
      const range = max - min + 1;

      while (res.length < count) {
        const val = min + Math.floor(rng() * range);
        if (allowDuplicates || !set.has(val)) {
          set.add(val);
          res.push(val);
        }
        if (!allowDuplicates && set.size >= range) break;
      }
      return res;
    }
  }
}

export const PRESET_DATASETS: {
  id: DatasetPresetType;
  label: string;
  description: string;
  sample: number[];
}[] = [
  {
    id: 'ascending',
    label: 'Ascending (1..N)',
    description: 'Forces standard BST into O(n) line; exercises RBT Left Rotations (RR cases).',
    sample: [10, 20, 30, 40, 50, 60, 70, 80],
  },
  {
    id: 'descending',
    label: 'Descending (N..1)',
    description: 'Forces standard BST into reverse line; exercises RBT Right Rotations (LL cases).',
    sample: [80, 70, 60, 50, 40, 30, 20, 10],
  },
  {
    id: 'random',
    label: 'Random Distribution',
    description: 'Balanced mix of Left and Right rotations, recolorings, and tree restructuring.',
    sample: [42, 17, 91, 3, 64, 28, 85, 50],
  },
  {
    id: 'nearly_sorted',
    label: 'Nearly Sorted',
    description: 'Simulates realistic data stream with slight disorder.',
    sample: [12, 15, 24, 20, 35, 48, 42, 60],
  },
  {
    id: 'duplicate_heavy',
    label: 'Duplicate Heavy',
    description: 'Tests duplicate collision detection and preservation of tree invariants.',
    sample: [20, 10, 20, 30, 20, 40, 10, 50],
  },
];
