import { describe, it, expect } from 'vitest';
import { EDUCATIONAL_CASES } from '../CaseVisualizer';
import { RedBlackTree } from '../../../algorithms/redBlackTree/RedBlackTree';

describe('Educational Case Encyclopedia', () => {
  it('contains all 4 CLRS insertion cases and 4 deletion cases', () => {
    const insertionCases = EDUCATIONAL_CASES.filter((c) => c.category === 'INSERTION');
    const deletionCases = EDUCATIONAL_CASES.filter((c) => c.category === 'DELETION');

    expect(insertionCases).toHaveLength(4);
    expect(deletionCases).toHaveLength(4);
  });

  it('provides complete theoretical descriptions for every case', () => {
    EDUCATIONAL_CASES.forEach((c) => {
      expect(c.name).toBeDefined();
      expect(c.condition.length).toBeGreaterThan(10);
      expect(c.violation.length).toBeGreaterThan(10);
      expect(c.resolution.length).toBeGreaterThan(10);
      expect(c.complexity).toContain('O(');
      expect(c.setupValues.length).toBeGreaterThan(0);
      expect(c.triggerValue).toBeTypeOf('number');
    });
  });

  it('successfully simulates every case into a valid Red-Black Tree', () => {
    EDUCATIONAL_CASES.forEach((c) => {
      const tree = new RedBlackTree();
      c.setupValues.forEach((v) => tree.insert(v));

      if (c.category === 'DELETION') {
        tree.delete(c.triggerValue);
      } else {
        tree.insert(c.triggerValue);
      }

      const valResult = tree.validate();
      expect(valResult.allValid, `Failed for case: ${c.name}`).toBe(true);
      expect(valResult.violations).toHaveLength(0);
    });
  });
});
