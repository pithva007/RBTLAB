import { useState, useCallback } from 'react';
import { SerializedRBNode, TreeStatistics } from '../algorithms/redBlackTree/types';

export interface HistoryEntry {
  id: string;
  operation: 'INSERT' | 'DELETE' | 'SEARCH' | 'RESET' | 'LOAD_DATASET';
  value?: number;
  label: string;
  timestamp: number;
  treeSnapshot: SerializedRBNode | null;
  statistics: TreeStatistics;
}

export function useTreeHistory(initialSnapshot: SerializedRBNode | null = null, initialStats?: TreeStatistics) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init_state',
      operation: 'RESET',
      label: 'Initial Empty State',
      timestamp: Date.now(),
      treeSnapshot: initialSnapshot,
      statistics: initialStats || {
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
      },
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const pushEntry = useCallback(
    (
      operation: HistoryEntry['operation'],
      label: string,
      treeSnapshot: SerializedRBNode | null,
      statistics: TreeStatistics,
      value?: number
    ) => {
      const newEntry: HistoryEntry = {
        id: `history_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        operation,
        value,
        label,
        timestamp: Date.now(),
        treeSnapshot,
        statistics: { ...statistics },
      };

      setHistory((prev) => {
        // Truncate any redo history if a new action is performed
        const truncated = prev.slice(0, currentIndex + 1);
        return [...truncated, newEntry];
      });

      setCurrentIndex((prev) => prev + 1);
      return newEntry;
    },
    [currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const target = currentIndex - 1;
      setCurrentIndex(target);
      return history[target];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const target = currentIndex + 1;
      setCurrentIndex(target);
      return history[target];
    }
    return null;
  }, [currentIndex, history]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        setCurrentIndex(index);
        return history[index];
      }
      return null;
    },
    [history]
  );

  const clear = useCallback(
    (emptySnapshot: SerializedRBNode | null = null, emptyStats?: TreeStatistics) => {
      const init: HistoryEntry = {
        id: `init_state_${Date.now()}`,
        operation: 'RESET',
        label: 'Initial Empty State',
        timestamp: Date.now(),
        treeSnapshot: emptySnapshot,
        statistics: emptyStats || {
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
        },
      };
      setHistory([init]);
      setCurrentIndex(0);
      return init;
    },
    []
  );

  return {
    history,
    currentIndex,
    currentEntry: history[currentIndex] || null,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    pushEntry,
    undo,
    redo,
    goTo,
    clear,
  };
}
