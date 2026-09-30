import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RedBlackTree } from '../algorithms/redBlackTree/RedBlackTree';
import {
  generateInsertEvents,
  generateDeleteEvents,
  generateSearchEvents,
  AlgorithmExecutionEngine,
  AlgorithmEvent,
} from '../algorithms/redBlackTree/events';
import { useTreeHistory } from '../hooks/useTreeHistory';
import { TreeCanvas } from '../components/visualizer/TreeCanvas';
import { Controls } from '../components/visualizer/Controls';
import { OperationLog } from '../components/visualizer/OperationLog';
import { PropertyPanel } from '../components/visualizer/PropertyPanel';
import { StatisticsPanel } from '../components/visualizer/StatisticsPanel';
import { LearnExplainer } from '../components/learn/LearnExplainer';
import { PseudocodePanel } from '../components/visualizer/PseudocodePanel';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { DatasetPresetType, generateDataset } from '../utils/datasets';
import { LayoutNode } from '../utils/treeLayout';

export const VisualizerPage: React.FC = () => {
  // Underlying live algorithmic tree
  const treeRef = useRef<RedBlackTree>(new RedBlackTree());

  // Execution engine for stepping and animated playback
  const engineRef = useRef<AlgorithmExecutionEngine>(new AlgorithmExecutionEngine());

  // Current active event stream & step index
  const [events, setEvents] = useState<AlgorithmEvent[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(700);

  // Selected node inspection modal/panel
  const [selectedNode, setSelectedNode] = useState<LayoutNode | null>(null);

  // History hook for undo/redo
  const {
    history,
    canUndo,
    canRedo,
    pushEntry,
    undo,
    redo,
    clear: clearHistory,
  } = useTreeHistory(null, treeRef.current.getStatistics());

  // Apply an event to UI state
  const applyEvent = useCallback((event: AlgorithmEvent) => {
    setStepIndex(event.stepIndex - 1);
  }, []);

  // Sync engine speed
  useEffect(() => {
    engineRef.current.setSpeed(speedMs);
  }, [speedMs]);

  // Load a sequence of events into the playback engine
  const loadEvents = useCallback((newEvents: AlgorithmEvent[], autoPlay: boolean = false) => {
    engineRef.current.stop();
    setIsPlaying(false);
    setEvents(newEvents);
    setStepIndex(0);
    engineRef.current.setEvents(newEvents);

    if (autoPlay && newEvents.length > 1) {
      setIsPlaying(true);
      engineRef.current.play(
        (event) => applyEvent(event),
        () => setIsPlaying(false)
      );
    }
  }, [applyEvent]);

  // Active event & snapshot
  const currentEvent = events[stepIndex] || null;
  const currentSnapshot = currentEvent ? currentEvent.treeSnapshot : treeRef.current.getState();
  const currentStats = currentEvent ? currentEvent.statistics : treeRef.current.getStatistics();
  const currentProps = currentEvent ? currentEvent.propertiesStatus : treeRef.current.validate();

  // Operation Handlers
  const handleInsert = (value: number) => {
    if (engineRef.current.isPlaying()) {
      engineRef.current.stop();
      setIsPlaying(false);
    }
    const generatedEvents = generateInsertEvents(treeRef.current, value);
    pushEntry('INSERT', `INSERT ${value}`, treeRef.current.getState(), treeRef.current.getStatistics(), value);
    loadEvents(generatedEvents, true);
  };

  const handleDelete = (value: number) => {
    if (engineRef.current.isPlaying()) {
      engineRef.current.stop();
      setIsPlaying(false);
    }
    const generatedEvents = generateDeleteEvents(treeRef.current, value);
    pushEntry('DELETE', `DELETE ${value}`, treeRef.current.getState(), treeRef.current.getStatistics(), value);
    loadEvents(generatedEvents, true);
  };

  const handleSearch = (value: number) => {
    const generatedEvents = generateSearchEvents(treeRef.current, value);
    loadEvents(generatedEvents, true);
  };

  const handleReset = () => {
    engineRef.current.stop();
    setIsPlaying(false);
    treeRef.current.clear();
    setEvents([]);
    setStepIndex(0);
    clearHistory(null, treeRef.current.getStatistics());
  };

  const handleLoadPreset = (type: DatasetPresetType, count = 8) => {
    engineRef.current.stop();
    setIsPlaying(false);
    treeRef.current.clear();
    const data = generateDataset(type, { count, min: 10, max: 99 });

    // Step through each insert in the preset
    data.forEach((v) => treeRef.current.insert(v));
    const lastSnapshot = treeRef.current.getState();
    const lastStats = treeRef.current.getStatistics();

    pushEntry('LOAD_DATASET', `LOAD PRESET (${type})`, lastSnapshot, lastStats);

    // Create a final completion event
    const finalEvent: AlgorithmEvent = {
      id: `preset_load_${Date.now()}`,
      stepIndex: 1,
      totalSteps: 1,
      type: 'OPERATION_COMPLETE',
      operation: 'INSERT',
      targetValue: data[data.length - 1],
      title: `Loaded ${type} dataset (${data.length} keys)`,
      description: `Loaded array [${data.join(', ')}]. Tree automatically self-balanced according to Red-Black invariants.`,
      educationalWhy: {
        whatHappened: `Successfully populated tree with ${data.length} elements.`,
        whyDidItHappen: `Initial dataset loaded into tree structure.`,
        actionReason: `Demonstrates global tree geometry under ${type} input.`,
        complexity: `O(n log n) total build time`,
      },
      highlightRoles: {},
      treeSnapshot: lastSnapshot,
      propertiesStatus: treeRef.current.validate(),
      statistics: lastStats,
    };

    setEvents([finalEvent]);
    setStepIndex(0);
    engineRef.current.setEvents([finalEvent]);
  };

  const handleGenerateRandom = (count: number) => {
    handleLoadPreset('random', count);
  };

  // Playback Controls
  const handlePlay = () => {
    if (events.length === 0) return;
    if (stepIndex >= events.length - 1) {
      setStepIndex(0);
      engineRef.current.reset();
    }
    setIsPlaying(true);
    engineRef.current.play(
      (event) => applyEvent(event),
      () => setIsPlaying(false)
    );
  };

  const handlePause = () => {
    engineRef.current.pause();
    setIsPlaying(false);
  };

  const handleStepNext = () => {
    handlePause();
    const nextEvent = engineRef.current.next();
    if (nextEvent) applyEvent(nextEvent);
  };

  const handleStepPrev = () => {
    handlePause();
    const prevEvent = engineRef.current.prev();
    if (prevEvent) applyEvent(prevEvent);
  };

  const handleRestart = () => {
    handlePause();
    const firstEvent = engineRef.current.goTo(0);
    if (firstEvent) applyEvent(firstEvent);
  };

  const handleSkipToEnd = () => {
    handlePause();
    if (events.length > 0) {
      const lastEvent = engineRef.current.goTo(events.length - 1);
      if (lastEvent) applyEvent(lastEvent);
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    handlePause();
    const prevEntry = undo();
    if (prevEntry) {
      treeRef.current.clear();
      const targetIndex = history.indexOf(prevEntry);
      for (let i = 1; i <= targetIndex; i++) {
        const item = history[i];
        if (item.operation === 'INSERT' && item.value !== undefined) {
          treeRef.current.insert(item.value);
        } else if (item.operation === 'DELETE' && item.value !== undefined) {
          treeRef.current.delete(item.value);
        }
      }
      setEvents([]);
      setStepIndex(0);
    }
  };

  const handleRedo = () => {
    handlePause();
    const nextEntry = redo();
    if (nextEntry) {
      treeRef.current.clear();
      const targetIndex = history.indexOf(nextEntry);
      for (let i = 1; i <= targetIndex; i++) {
        const item = history[i];
        if (item.operation === 'INSERT' && item.value !== undefined) {
          treeRef.current.insert(item.value);
        } else if (item.operation === 'DELETE' && item.value !== undefined) {
          treeRef.current.delete(item.value);
        }
      }
      setEvents([]);
      setStepIndex(0);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Controls Suite */}
      <Controls
        onInsert={handleInsert}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onReset={handleReset}
        onLoadPreset={handleLoadPreset}
        onGenerateRandom={handleGenerateRandom}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepNext={handleStepNext}
        onStepPrev={handleStepPrev}
        onRestart={handleRestart}
        onSkipToEnd={handleSkipToEnd}
        hasPrevStep={engineRef.current.hasPrev()}
        hasNextStep={engineRef.current.hasNext()}
        currentStep={stepIndex}
        totalSteps={events.length}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Main Workspace: SVG Tree Canvas, Pseudocode, Explanation, and Operation Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Tree Canvas & Algorithm Pseudocode */}
        <div className="lg:col-span-8 space-y-4">
          <TreeCanvas
            treeSnapshot={currentSnapshot}
            highlightRoles={currentEvent?.highlightRoles ?? {}}
            onNodeClick={(node) => setSelectedNode(node)}
            showNilLeavesInitial={true}
          />

          <PseudocodePanel
            operation={currentEvent?.operation ?? 'INSERT'}
            activeLine={currentEvent?.pseudocodeLine}
          />
        </div>

        {/* Right Column: "WHAT IS HAPPENING?" Explanation Panel & Operation Timeline */}
        <div className="lg:col-span-4 space-y-4">
          <ExplanationPanel
            currentEvent={currentEvent}
            stepIndex={stepIndex}
            totalSteps={events.length}
          />

          <OperationLog
            events={events}
            currentStepIndex={stepIndex}
            onSelectStep={(idx) => {
              handlePause();
              const target = engineRef.current.goTo(idx);
              if (target) applyEvent(target);
            }}
          />
        </div>
      </div>

      {/* DAA Algorithmic Reasoning Explainer */}
      <LearnExplainer
        why={currentEvent?.educationalWhy ?? null}
        stepTitle={currentEvent?.title}
      />

      {/* Live Properties Panel (Dynamic 5 Invariants) */}
      <PropertyPanel
        status={currentProps}
        isOperationInProgress={isPlaying || (events.length > 0 && stepIndex < events.length - 1)}
      />

      {/* Live Statistics & Telemetry Panel */}
      <StatisticsPanel statistics={currentStats} />

      {/* Node Detail Inspection Modal (When a node is clicked) */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-[#1e2638] bg-[#0c101a] p-5 shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-2">
              <span className="font-bold text-white text-sm">Node Inspection</span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Value:</span>
                <span className="font-bold text-white">{selectedNode.value ?? 'NIL'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Color:</span>
                <span className={selectedNode.color === 'RED' ? 'text-red-400 font-bold' : 'text-slate-300'}>
                  {selectedNode.color}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Depth / Level:</span>
                <span>{selectedNode.depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Canvas Position:</span>
                <span>({Math.round(selectedNode.x)}, {Math.round(selectedNode.y)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Role:</span>
                <span className="text-blue-400 font-bold uppercase">{selectedNode.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizerPage;
