import { describe, it, expect, beforeEach } from 'vitest';
import { RedBlackTree } from '../RedBlackTree';
import { RBNode } from '../RBNode';
import {
  generateInsertEvents,
  generateDeleteEvents,
  generateSearchEvents,
  AlgorithmExecutionEngine,
} from '../events';

describe('Algorithm Event and Step Engine', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
    RBNode.resetIdCounter();
  });

  it('generates rich insertion event sequence with educational explanations and snapshots', () => {
    tree.insert(50);
    tree.insert(20);
    const events = generateInsertEvents(tree, 10);

    expect(events.length).toBeGreaterThan(3);

    const firstEvent = events[0];
    expect(firstEvent.operation).toBe('INSERT');
    expect(firstEvent.targetValue).toBe(10);
    expect(firstEvent.educationalWhy.whatHappened).toBeDefined();
    expect(firstEvent.educationalWhy.whyDidItHappen).toBeDefined();
    expect(firstEvent.educationalWhy.complexity).toBeDefined();

    const types = events.map((e) => e.type);
    expect(types).toContain('INSERT_START');
    expect(types).toContain('BST_INSERT');
    expect(types).toContain('NODE_CREATED');
    expect(types).toContain('RED_RED_VIOLATION');
    expect(types).toContain('RIGHT_ROTATION');
    expect(types).toContain('OPERATION_COMPLETE');

    // Check snapshots are captured
    const lastEvent = events[events.length - 1];
    expect(lastEvent.treeSnapshot).not.toBeNull();
    expect(lastEvent.propertiesStatus.allValid).toBe(true);
  });

  it('generates complete deletion event sequence', () => {
    [50, 25, 75, 10, 40].forEach((v) => tree.insert(v));

    const events = generateDeleteEvents(tree, 25);
    expect(events.length).toBeGreaterThan(2);

    const types = events.map((e) => e.type);
    expect(types).toContain('DELETE_START');
    expect(types).toContain('ANALYZE_CHILDREN');
    expect(types).toContain('FIND_SUCCESSOR');
    expect(types).toContain('REPLACE_VALUE');
    expect(types).toContain('OPERATION_COMPLETE');
  });

  it('generates search events with comparison path tracking', () => {
    [50, 20, 80, 10, 30].forEach((v) => tree.insert(v));

    // Search existing
    const foundEvents = generateSearchEvents(tree, 30);
    expect(foundEvents.length).toBeGreaterThan(1);
    expect(foundEvents[foundEvents.length - 1].type).toBe('SEARCH_FOUND');
    expect(foundEvents[foundEvents.length - 1].highlightRoles.current).toBe(30);

    // Search missing
    const notFoundEvents = generateSearchEvents(tree, 999);
    expect(notFoundEvents[notFoundEvents.length - 1].type).toBe('SEARCH_NOT_FOUND');
  });

  it('controls step-by-step navigation in AlgorithmExecutionEngine', () => {
    tree.insert(50);
    const events = generateInsertEvents(tree, 25);
    const engine = new AlgorithmExecutionEngine(events);

    expect(engine.getTotalSteps()).toBe(events.length);
    expect(engine.getStepIndex()).toBe(0);
    expect(engine.hasPrev()).toBe(false);
    expect(engine.hasNext()).toBe(true);

    const nextEvent = engine.next();
    expect(nextEvent).toBe(events[1]);
    expect(engine.getStepIndex()).toBe(1);
    expect(engine.hasPrev()).toBe(true);

    const prevEvent = engine.prev();
    expect(prevEvent).toBe(events[0]);
    expect(engine.getStepIndex()).toBe(0);

    engine.goTo(events.length - 1);
    expect(engine.getStepIndex()).toBe(events.length - 1);
    expect(engine.hasNext()).toBe(false);

    engine.reset();
    expect(engine.getStepIndex()).toBe(0);
  });
});
