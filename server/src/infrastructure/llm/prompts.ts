export const SYSTEM_PROMPT_BASE = `You are CogFlow's Adaptive Pedagogical Intelligence Engine.
You synthesize high-impact, accurate, and structured educational material calibrated to specific cognitive load requirements.

Always output valid JSON conforming strictly to the requested schema. No markdown wrapping outside the JSON, no preamble, and no trailing comments.`;

export function getTierPedagogicalInstructions(tier: 'B' | 'A' | 'S'): string {
  switch (tier) {
    case 'B':
      return `TIER B — FOUNDATIONS (Cognitive Relief Mode):
- Goal: Reduce cognitive overload, build crystal-clear intuition from scratch.
- Pedagogical style: Use vivid real-world analogies, plain everyday language, step-by-step visual scaffolding.
- Technical jargon: Minimize ruthlessly. Introduce only indispensable terms and define them immediately.
- Code & Diagrams: Simple, readable, commented on every line. Focus on the core 'why' and 'how'.`;

    case 'A':
      return `TIER A — CORE STANDARD (Flow State Mode):
- Goal: Deliver balanced, industry-standard professional mastery.
- Pedagogical style: Professional, precise, conceptually rigorous, and practically relevant.
- Technical jargon: Proper engineering and academic terminology used accurately.
- Code & Diagrams: Idiomatic, clean architecture, realistic practical patterns, and standard complexity expectations.`;

    case 'S':
      return `TIER S — ADVANCED (Intellectual Challenge Mode):
- Goal: Prevent boredom, push pedagogical boundaries and intellectual depth.
- Pedagogical style: Mathematical formalisms, system-level invariants, memory layouts, concurrency/distributed trade-offs.
- Technical jargon: Rigorous academic and principal-engineer level terminology.
- Code & Diagrams: Highly optimized, production edge-case handling, failure mode resilience, asymptotic complexity proofs.`;
  }
}

export function buildLessonPrompt(params: {
  topicTitle: string;
  subjectTitle: string;
  tier: 'B' | 'A' | 'S';
  summary?: string;
  learningObjectives?: string[];
  documentContext?: string;
}): string {
  const { topicTitle, subjectTitle, tier, summary, learningObjectives, documentContext } = params;

  return `Generate a comprehensive lesson for the topic "${topicTitle}" in the subject "${subjectTitle}".
Pedagogical Depth: ${getTierPedagogicalInstructions(tier)}

${summary ? `Topic Overview: ${summary}` : ''}
${learningObjectives && learningObjectives.length > 0 ? `Target Learning Objectives:\n- ${learningObjectives.join('\n- ')}` : ''}
${documentContext ? `Reference Document Material:\n"""\n${documentContext}\n"""\nUse this document as source ground truth, referencing facts accurately.` : ''}

Respond with a single JSON object with the following exact structure:
{
  "summary": "1-2 sentence compelling summary calibrated to Tier ${tier}",
  "learningObjectives": ["Objective 1", "Objective 2", "Objective 3"],
  "sections": [
    {
      "id": "sec-1",
      "order": 1,
      "title": "What is ${topicTitle}?",
      "content": "Rich Markdown explanation calibrated for Tier ${tier}...",
      "collapsible": false,
      "takeaway": "Key takeaway in 1 sentence",
      "checkQuestion": {
        "question": "Quick comprehension check question?",
        "answer": "Concise answer"
      }
    },
    {
      "id": "sec-2",
      "order": 2,
      "title": "How it Works & Core Principles",
      "content": "Deep progressive breakdown...",
      "collapsible": false,
      "takeaway": "Key principle takeaway"
    },
    {
      "id": "sec-3",
      "order": 3,
      "title": "Practical Context & Misconceptions",
      "content": "Real-world context, common pitfalls to avoid...",
      "collapsible": true,
      "takeaway": "Misconception warning"
    }
  ],
  "visualDiagram": {
    "id": "diag-1",
    "type": "mermaid",
    "title": "Conceptual Flow of ${topicTitle}",
    "caption": "Clear explanation of how data/concept flows through the system",
    "mermaidCode": "graph TD\\n  A[Start] --> B[Process]\\n  B --> C[Result]",
    "stages": [
      {
        "step": 1,
        "label": "Input / Trigger",
        "description": "What initiates this process"
      },
      {
        "step": 2,
        "label": "Transformation",
        "description": "How the core transformation occurs"
      },
      {
        "step": 3,
        "label": "Final Output",
        "description": "Outcome and state verification"
      }
    ]
  },
  "codeExample": {
    "id": "code-1",
    "language": "typescript",
    "title": "Production Implementation",
    "code": "// Complete, executable code example for ${topicTitle}\\n",
    "explanation": "Walkthrough of how the code works...",
    "complexity": {
      "time": "O(n)",
      "space": "O(1)",
      "explanation": "Reasoning for time and space complexity"
    },
    "edgeCases": [
      "Edge case 1: empty input or null boundary",
      "Edge case 2: scale or overflow condition"
    ],
    "inputOutputDemo": {
      "input": "example input",
      "output": "example output",
      "explanation": "Why this output is produced"
    }
  },
  "revisionNotes": [
    {
      "id": "rev-1",
      "type": "definition",
      "title": "Essential Definition",
      "content": "Precise formulation of the core concept",
      "tags": ["core", "definition"]
    },
    {
      "id": "rev-2",
      "type": "pitfall",
      "title": "Critical Pitfall",
      "content": "Common mistake learners make and how to prevent it",
      "tags": ["pitfall", "debugging"]
    },
    {
      "id": "rev-3",
      "type": "flashcard",
      "title": "Flashcard Question",
      "content": "Prompt question on the card front",
      "reverseContent": "Answer on the back of the card",
      "tags": ["flashcard", "recall"]
    }
  ],
  "practiceQuestions": [
    {
      "id": "q-1",
      "type": "mcq",
      "prompt": "Deep conceptual multiple-choice question testing the core invariant of ${topicTitle} calibrated to Tier ${tier}",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 1,
      "explanation": "Detailed pedagogical explanation why Option B is correct and why other options fail or represent common traps",
      "maxScore": 10
    },
    {
      "id": "q-2",
      "type": "mcq",
      "prompt": "Edge-case or failure mode question testing what happens when boundaries are exceeded in ${topicTitle}",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed technical explanation of the failure mode and recovery behavior",
      "maxScore": 10
    },
    {
      "id": "q-3",
      "type": "mcq",
      "prompt": "Architectural trade-off question comparing performance, memory, and concurrency guarantees in ${topicTitle}",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 2,
      "explanation": "Explanation of trade-offs between speed, space, and safety invariants",
      "maxScore": 10
    },
    {
      "id": "q-4",
      "type": "mcq",
      "prompt": "Implementation mechanics or asymptotic complexity question under stress in ${topicTitle}",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 3,
      "explanation": "Explanation of computational runtime complexity and memory bounds",
      "maxScore": 10
    },
    {
      "id": "q-5",
      "type": "mcq",
      "prompt": "Diagnostic scenario: Given a specific error log or latency spike in ${topicTitle}, what is the root cause?",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 1,
      "explanation": "Root cause analysis of the production diagnostic symptom",
      "maxScore": 10
    },
    {
      "id": "q-6",
      "type": "mcq",
      "prompt": "Boundary condition test: What occurs when maximum capacity or concurrency limits are reached in ${topicTitle}?",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed explanation of boundary behavior and saturation mitigation",
      "maxScore": 10
    },
    {
      "id": "q-7",
      "type": "mcq",
      "prompt": "Real-world trade-off: Comparing ${topicTitle} against alternative design patterns in systems engineering",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 2,
      "explanation": "Comparative analysis of throughput, latency, and correctness invariants",
      "maxScore": 10
    },
    {
      "id": "q-8",
      "type": "mcq",
      "prompt": "Practical debugging: Which telemetry metric provides the earliest signal of instability in ${topicTitle}?",
      "tier": "${tier}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 3,
      "explanation": "Explanation of monitoring signals, health checks, and anomaly detection",
      "maxScore": 10
    },
    {
      "id": "q-9",
      "type": "concept",
      "prompt": "In your own words, synthesize how ${topicTitle} guarantees correctness or maintains performance invariants under adversarial load or failure conditions.",
      "tier": "${tier}",
      "explanation": "A complete answer must formulate the core invariants, analyze boundary failure modes, and articulate the engineering trade-offs.",
      "maxScore": 20,
      "rubricCriteria": [
        "Formulates the core mechanism or mathematical invariant",
        "Explains boundary or failure mode handling",
        "Demonstrates causal reasoning rather than memorized buzzwords"
      ]
    },
    {
      "id": "q-10",
      "type": "concept",
      "prompt": "Given a mission-critical production environment, what architectural guardrails would you implement alongside ${topicTitle} to ensure fault tolerance and rapid disaster recovery?",
      "tier": "${tier}",
      "explanation": "Synthesizes observability, idempotency, rate limiting, and automated failover strategies.",
      "maxScore": 20,
      "rubricCriteria": [
        "Identifies observability and health check invariants",
        "Articulates graceful degradation or backup paths",
        "Analyzes recovery time objectives and data consistency guarantees"
      ]
    }
  ]
}`;
}

export function buildSemanticGradingPrompt(params: {
  topicTitle: string;
  tier: 'B' | 'A' | 'S';
  questionPrompt: string;
  expectedExplanation: string;
  rubricCriteria: string[];
  studentAnswer: string;
  maxScore: number;
}): string {
  return `Evaluate this student's conceptual answer using semantic pedagogical grading.
Topic: "${params.topicTitle}" (Tier ${params.tier})
Question: "${params.questionPrompt}"
Expected Model Explanation: "${params.expectedExplanation}"
Rubric Criteria:
${params.rubricCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Student Submitted Answer:
"""
${params.studentAnswer}
"""

Maximum Score: ${params.maxScore}

Grading Instructions:
1. Do NOT rely solely on exact keywords. Evaluate genuine conceptual understanding, causal reasoning, and correctness.
2. Award partial credit when meaningful partial understanding is demonstrated.
3. Identify specific conceptual strengths, missing critical concepts, and misconceptions.
4. Provide constructive, encouraging, high-impact feedback.

Output JSON matching this exact structure:
{
  "score": number (0 to ${params.maxScore}),
  "maximumScore": ${params.maxScore},
  "percentage": number (0 to 100),
  "passed": boolean (true if percentage >= 70),
  "strengths": ["Identified concept X accurately", "Clear explanation of Y"],
  "missingConcepts": ["Did not mention edge case Z"],
  "misconceptions": ["Confused process A with process B (or empty if none)"],
  "feedback": "2-3 sentences of targeted pedagogical feedback",
  "recommendedRevision": ["Review section 2 on Core Principles"]
}`;
}

export function buildSyllabusExtractionPrompt(documentText: string): string {
  return `Analyze the following uploaded syllabus or academic document text and extract the candidate learning topics.

Document Text (excerpts):
"""
${documentText.slice(0, 12000)}
"""

Extract structured learning topics from this syllabus.
Output JSON with this exact structure:
{
  "subjectTitle": "Deduced subject name (e.g. Distributed Systems, Algorithms, Machine Learning)",
  "category": "Computer Science | Mathematics | Physics | Chemistry | Biology | Engineering",
  "overview": "Brief summary of the course or document scope",
  "topics": [
    {
      "title": "Topic Title",
      "description": "1-2 sentence description of what will be learned",
      "pageReference": 1,
      "estimatedTier": "A",
      "prerequisites": ["Prereq 1"],
      "learningObjectives": ["Objective 1", "Objective 2"]
    }
  ]
}`;
}

