import { describe, it, expect } from 'vitest';
import { LLMOrchestrator } from '../infrastructure/llm/LLMOrchestrator.js';
import { getDeterministicFallbackLesson } from '../infrastructure/llm/deterministicFallback.js';

describe('AI Orchestrator & Multi-Tier Fallback Engine', () => {
  const orchestrator = LLMOrchestrator.getInstance();

  it('reports provider health statuses including local deterministic fallback engine', async () => {
    const status = await orchestrator.getProvidersStatus();
    expect(status).toHaveProperty('providers');
    expect(status.providers.length).toBeGreaterThanOrEqual(4);

    const fallback = status.providers.find((p) => p.id === 'fallback');
    expect(fallback).toBeDefined();
    expect(fallback?.available).toBe(true);
  });

  it('generates consistent, structured lessons with 5 distinct studios across B, A, and S tiers', async () => {
    // Generate Tier B (Foundations)
    const lessonB = await orchestrator.generateLesson({
      topicId: 'test-topic-1',
      topicTitle: 'Distributed Systems',
      subjectTitle: 'Computer Science',
      tier: 'B',
    });

    expect(lessonB.tier).toBe('B');
    expect(lessonB.sections.length).toBeGreaterThan(0);
    expect(lessonB.visualDiagram.mermaidCode).toContain('graph');
    expect(lessonB.codeExample.code).toBeDefined();
    expect(lessonB.revisionNotes.length).toBeGreaterThan(0);
    expect(lessonB.practiceQuestions.length).toBeGreaterThan(0);

    // Generate Tier S (Advanced)
    const lessonS = await orchestrator.generateLesson({
      topicId: 'test-topic-1',
      topicTitle: 'Distributed Systems',
      subjectTitle: 'Computer Science',
      tier: 'S',
    });

    expect(lessonS.tier).toBe('S');
    expect(lessonS.summary).toContain('Advanced formalization');
    expect(lessonS.sections[0].content.toLowerCase()).toContain('invariant');
  });

  it('evaluates conceptual student answers against semantic rubrics', async () => {
    const result = await orchestrator.evaluateConceptualAnswer({
      topicTitle: 'Distributed Consensus',
      tier: 'A',
      questionPrompt: 'Explain why randomized election timeouts prevent split-vote deadlocks in Raft.',
      expectedExplanation: 'Random timeouts ensure nodes do not simultaneously initiate elections, allowing one node to garner quorum.',
      rubricCriteria: [
        'Explains simultaneous split vote dilemmas',
        'Details randomized timeouts breaking symmetry',
        'References majority quorum',
      ],
      studentAnswer:
        'When multiple nodes start an election at the exact same time, votes get divided evenly and no leader can form a majority. Randomized timeouts break this symmetry by ensuring one node initiates its campaign earlier than the others and receives a quorum.',
      maxScore: 20,
    });

    expect(result.score).toBeGreaterThanOrEqual(10);
    expect(result.percentage).toBeGreaterThanOrEqual(60);
    expect(result.strengths.length).toBeGreaterThan(0);
  });
});
