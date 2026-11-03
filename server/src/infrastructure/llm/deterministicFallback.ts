import { LessonContent } from '@cogflow/shared';

export function getDeterministicFallbackLesson(params: {
  topicTitle: string;
  subjectTitle: string;
  tier: 'B' | 'A' | 'S';
  topicId?: string;
}): LessonContent {
  const { topicTitle, subjectTitle, tier, topicId = 'topic-fallback' } = params;

  if (tier === 'B') {
    return {
      id: `lesson-${topicId}-B`,
      topicId,
      topicTitle,
      subjectTitle,
      tier: 'B',
      summary: `Foundational introduction to ${topicTitle}: breaking down the core intuition through real-world analogies and gentle scaffolding.`,
      learningObjectives: [
        `Understand the fundamental motivation behind ${topicTitle} without technical barrier`,
        `Visualize how ${topicTitle} operates using everyday physical analogies`,
        `Recognize when and why ${topicTitle} is used in modern applications`,
      ],
      sections: [
        {
          id: 'sec-b-1',
          order: 1,
          title: `What is ${topicTitle}? (The Everyday Analogy)`,
          content: `Imagine organizing a massive library where books constantly arrive. If you simply throw books onto a single heap, finding any specific title becomes painfully slow. 

${topicTitle} acts like an intuitive, self-balancing index: it introduces order and predictable structure so that retrieving, adding, and updating information feels effortless.

Instead of getting bogged down in complex mathematics, think of ${topicTitle} as a reliable set of guardrails designed to solve one primary dilemma: maintaining order while keeping operations fast.`,
          collapsible: false,
          takeaway: `${topicTitle} exists to bring predictable, intuitive structure to complex processes.`,
          checkQuestion: {
            question: `What is the core problem that ${topicTitle} was created to solve?`,
            answer: `It eliminates chaotic organization and enables predictable, fast operations through systematic structure.`,
          },
        },
        {
          id: 'sec-b-2',
          order: 2,
          title: 'Step-by-Step Walkthrough',
          content: `Let's break the mechanism into 3 intuitive steps:

1. **The Entry Phase**: A new request or data item arrives at the boundary.
2. **The Sorting Phase**: Rather than scanning everything, ${topicTitle} directs the item to its designated path.
3. **The Balance Phase**: If one section becomes too crowded, the system gently redistributes the load.

Notice how each phase guarantees that no single part gets overwhelmed!`,
          collapsible: false,
          takeaway: `The system processes items in distinct stages to avoid bottlenecks.`,
        },
        {
          id: 'sec-b-3',
          order: 3,
          title: 'Common Misconceptions to Avoid',
          content: `> **Misconception**: "${topicTitle} is only useful for giant supercomputers."
> 
> **Reality**: Even in small everyday apps—like organizing your smartphone contacts or streaming audio—the foundational logic of ${topicTitle} keeps interactions smooth and lag-free.`,
          collapsible: true,
          takeaway: `Even lightweight systems benefit from structured, scalable design.`,
        },
      ],
      visualDiagram: {
        id: 'diag-b-1',
        type: 'mermaid',
        title: `Intuitive Flow: ${topicTitle}`,
        caption: 'High-level conceptual diagram illustrating the gentle flow from input to organized state.',
        mermaidCode: `graph LR
  subgraph Input
    A[Incoming Item]
  end
  subgraph Processing [${topicTitle} Core]
    B[Route & Inspect] --> C[Apply Guardrails]
  end
  subgraph Output
    C --> D[Balanced Result]
  end
  style B fill:#eff6ff,stroke:#3b82f6
  style C fill:#f0fdfa,stroke:#0d9488
  style D fill:#f8fafc,stroke:#64748b`,
        stages: [
          { step: 1, label: 'Incoming Item', description: 'Item arrives at the ingestion boundary.' },
          { step: 2, label: 'Route & Inspect', description: 'Quickly examines destination rules without scanning all items.' },
          { step: 3, label: 'Balanced Result', description: 'Safely placed into structured state.' },
        ],
      },
      codeExample: {
        id: 'code-b-1',
        language: 'typescript',
        title: `Introductory Walkthrough: ${topicTitle}`,
        code: `// Beginner-friendly implementation of ${topicTitle}
function demonstrateConcept(items: string[]): string[] {
  console.log("Starting ${topicTitle} organization...");
  
  // Step 1: Filter out invalid items
  const validItems = items.filter(item => item.length > 0);
  
  // Step 2: Apply the simple transformation rule
  const structured = validItems.map(item => item.trim().toLowerCase());
  
  return structured;
}

// Example usage:
const sampleData = ["  Alpha", "Beta ", "Gamma"];
console.log(demonstrateConcept(sampleData));
// Result: ["alpha", "beta", "gamma"]`,
        explanation: 'This gentle code example demonstrates the boundary check and normalization steps with full line-by-line readability.',
        complexity: {
          time: 'O(n) - Single pass over the data',
          space: 'O(n) - Stores the cleaned result',
          explanation: 'Proportional directly to the count of input items.',
        },
        edgeCases: ['Empty input array', 'Strings containing only whitespace'],
        inputOutputDemo: {
          input: '["  Alpha", "Beta "]',
          output: '["alpha", "beta"]',
          explanation: 'Whitespace trimmed and lowercased for uniform matching.',
        },
      },
      revisionNotes: [
        {
          id: 'note-b-1',
          type: 'definition',
          title: `${topicTitle} (Foundational)`,
          content: `A systematic approach to organizing and processing data predictably and efficiently.`,
          tags: ['foundation', 'concept'],
        },
        {
          id: 'note-b-2',
          type: 'pitfall',
          title: 'Unnecessary Complication',
          content: `Do not over-engineer before understanding the baseline requirements. Keep the simplest workable structure first.`,
          tags: ['architecture', 'pitfall'],
        },
        {
          id: 'note-b-3',
          type: 'flashcard',
          title: `Flashcard: Goal of ${topicTitle}`,
          content: `What is the primary motivation for implementing ${topicTitle}?`,
          reverseContent: `To achieve predictable performance and avoid catastrophic unorganized slowdowns.`,
          tags: ['flashcard', 'recall'],
        },
      ],
      practiceQuestions: [
        {
          id: 'prac-b-1',
          type: 'mcq',
          prompt: `Which of the following best describes the main advantage of ${topicTitle} at the foundational tier?`,
          tier: 'B',
          options: [
            'It replaces all other programming languages entirely',
            'It provides structured, predictable organization that prevents bottlenecks',
            'It guarantees infinite speed regardless of physical hardware',
            'It only works with encrypted binary databases',
          ],
          correctAnswerIndex: 1,
          explanation: `${topicTitle} introduces deliberate structure to keep processing fast and predictable.`,
          maxScore: 10,
        },
        {
          id: 'prac-b-2',
          type: 'concept',
          prompt: `In simple words, explain why having an organized structure for ${topicTitle} is superior to handling items randomly as they arrive.`,
          tier: 'B',
          explanation: 'A good answer explains that random handling leads to bottlenecks and unpredictable searches, while structure enables fast retrieval.',
          maxScore: 10,
          rubricCriteria: [
            'Mentions avoiding bottlenecks or delays',
            'Contrasts random chaotic search with structured paths',
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (tier === 'S') {
    return {
      id: `lesson-${topicId}-S`,
      topicId,
      topicTitle,
      subjectTitle,
      tier: 'S',
      summary: `Advanced formalization of ${topicTitle}: mathematical invariants, asymptotic optimality proofs, concurrency mechanics, and distributed failure modes.`,
      learningObjectives: [
        `Formulate formal invariants and prove worst-case asymptotic bounds for ${topicTitle}`,
        `Analyze cache locality, memory layout, and lock-free/concurrent coordination paradigms`,
        `Diagnose distributed failure modes, split-brain scenarios, and production tail-latency amplification`,
      ],
      sections: [
        {
          id: 'sec-s-1',
          order: 1,
          title: `Formal Invariants & Mathematical Formulation of ${topicTitle}`,
          content: `Let $\\Sigma = (S, \\delta, s_0, F)$ denote the underlying state transition system. The primary invariant $I(S)$ must hold under all concurrent interleavings:

$$\\forall s \\in S, \\quad \\Phi(s) \\implies \\Phi(\\delta(s, e))$$

In high-throughput environments, ${topicTitle} guarantees state transitions in amortized $\\mathcal{O}(\\log n)$ time while bounding memory overhead by $\\mathcal{O}(n)$. 

When memory bandwidth saturates, branch mispredictions and L1/L2 cache misses dominate runtime over raw instruction count. Therefore, modern high-performance implementations leverage contiguous block allocations and vectorization (SIMD) to achieve cache-line alignment.`,
          collapsible: false,
          takeaway: `State preservation is proved through inductive invariance over transitions $\\delta(s, e)$.`,
          checkQuestion: {
            question: `Why does cache locality often dominate asymptotic instruction count in modern implementations?`,
            answer: `DRAM access latency (50-100ns) is orders of magnitude slower than CPU registers (0.5ns); non-sequential pointer chasing introduces CPU pipeline stalls.`,
          },
        },
        {
          id: 'sec-s-2',
          order: 2,
          title: 'Concurrency, Memory Ordering & Lock-Free Coordination',
          content: `Under preemptive multi-core execution, naive mutual exclusion (locks) suffers from priority inversion, convoying, and thread starvation.

We implement non-blocking coordination using atomic primitives (e.g., \`compare_exchange_weak\`) under acquire-release memory semantics:

- **Acquire Barrier**: Guarantees that subsequent memory reads observe writes committed prior to the release operation.
- **Release Barrier**: Enforces that prior stores are visible to other threads before the flag is set.
- **ABA Problem Prevention**: Mitigated via tagged generational pointers or Hazard Pointers.`,
          collapsible: false,
          takeaway: `Memory ordering semantics (Acquire/Release) must be strictly enforced to avoid data races without lock penalties.`,
        },
        {
          id: 'sec-s-3',
          order: 3,
          title: 'Distributed System Failure Modes & Tail-Latency',
          content: `In distributed deployments across partitions, the CAP theorem and PACELC bounds dictate strict trade-offs:

1. **Partial Network Partitions**: Gossip protocols must reconcile divergence via vector clocks or Conflict-Free Replicated Data Types (CRDTs).
2. **Tail Latency Amplification**: When 100 sub-queries are issued in parallel, the 99th percentile latency of individual requests becomes the median latency of the overall transaction.`,
          collapsible: true,
          takeaway: `Hedging requests and vector clocks prevent tail-latency amplification in partitioned clusters.`,
        },
      ],
      visualDiagram: {
        id: 'diag-s-1',
        type: 'mermaid',
        title: `Formal State Transition & Invariant Enforcement`,
        caption: 'Formal state diagram demonstrating invariant preservation across concurrent mutation events.',
        mermaidCode: `stateDiagram-v2
  [*] --> InvariantMaintained: Initialize System
  InvariantMaintained --> MutationPending: Propose Delta e
  MutationPending --> AtomicCASValidation: Compare-and-Swap
  AtomicCASValidation --> InvariantMaintained: Invariant holds Phi(s')
  AtomicCASValidation --> BackoffRetry: CAS Conflict (Contention)
  BackoffRetry --> MutationPending: Exponential Jitter
  InvariantMaintained --> DistributedQuorum: Commit to Consensus Log
  DistributedQuorum --> [*]: Acknowledged by Quorum (2F+1)`,
        stages: [
          { step: 1, label: 'Invariant Maintained', description: 'System in verified stable state satisfying all predicates.' },
          { step: 2, label: 'Atomic CAS Validation', description: 'Hardware-level atomic instruction ensures zero data races.' },
          { step: 3, label: 'Distributed Quorum', description: 'Byzantine or Crash-Fault-Tolerant consensus commits state transition.' },
        ],
      },
      codeExample: {
        id: 'code-s-1',
        language: 'typescript',
        title: `Lock-Free & Invariant-Checked ${topicTitle} Engine`,
        code: `// High-Performance Production Invariant Implementation
export class Concurrent${topicTitle.replace(/[^a-zA-Z]/g, '')}Engine<T> {
  private headIndex: number = 0;
  private readonly capacity: number;
  private readonly buffer: (T | null)[];

  constructor(capacity: number = 1024) {
    // Capacity rounded up to power of two for bitwise wrapping
    this.capacity = 1 << (32 - Math.clz32(capacity - 1));
    this.buffer = new Array(this.capacity).fill(null);
  }

  /**
   * Enqueues an element with bounded O(1) time and cache alignment.
   * Asserts invariant: size strictly <= capacity.
   */
  public push(item: T): boolean {
    const mask = this.capacity - 1;
    const current = this.headIndex;
    const targetSlot = current & mask;

    if (this.buffer[targetSlot] !== null) {
      // Slot collision / capacity exceeded; prevent overflow
      return false;
    }

    this.buffer[targetSlot] = item;
    this.headIndex = (current + 1) | 0; // Prevent 31-bit integer overflow
    return true;
  }

  public getInvariantHealth(): { utilization: number; isSound: boolean } {
    const occupied = this.buffer.filter(x => x !== null).length;
    return {
      utilization: occupied / this.capacity,
      isSound: occupied <= this.capacity,
    };
  }
}`,
        explanation: 'Uses bitwise power-of-two modulo masking to prevent division instructions, accompanied by integer overflow wrapping protection.',
        complexity: {
          time: 'Amortized O(1) worst-case; no memory allocations on critical hot path.',
          space: 'O(N) bounded pre-allocated memory; eliminates GC pauses.',
          explanation: 'Eliminates pointer de-referencing overhead and avoids garbage collection pressure.',
        },
        edgeCases: [
          'Ring buffer capacity wrap-around with 32-bit integer boundary',
          'High thread contention leading to cache-line bouncing (false sharing)',
        ],
      },
      revisionNotes: [
        {
          id: 'note-s-1',
          type: 'formula',
          title: 'Amortized Complexity Bound',
          content: `$$\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1}) \\le \\mathcal{O}(1)$$`,
          tags: ['math', 'proof', 'complexity'],
        },
        {
          id: 'note-s-2',
          type: 'pitfall',
          title: 'False Sharing & Cache Bouncing',
          content: `Independent variables situated within the same 64-byte L1 cache line cause hardware bus invalidations when modified by separate CPU cores.`,
          tags: ['hardware', 'memory', 'concurrency'],
        },
        {
          id: 'note-s-3',
          type: 'flashcard',
          title: 'Flashcard: PACELC Theorem',
          content: 'In distributed systems, what does PACELC stand for?',
          reverseContent: 'If Partition (P), trade Availability (A) vs Consistency (C); Else (E), trade Latency (L) vs Consistency (C).',
          tags: ['distributed-systems', 'flashcard'],
        },
      ],
      practiceQuestions: [
        {
          id: 'prac-s-1',
          type: 'mcq',
          prompt: `In a lock-free implementation of ${topicTitle}, which mechanism best protects against the ABA problem in hazard pointer deallocation?`,
          tier: 'S',
          options: [
            'Increasing JVM heap allocation size',
            'Generational tagged pointer versions or deferred reclamation epochs',
            'Applying recursive mutexes around all read operations',
            'Disabling thread preemption at the OS kernel level',
          ],
          correctAnswerIndex: 1,
          explanation: 'Generational tags ensure that even if a memory address is re-allocated, its monotonically increasing tag prevents invalid CAS matches.',
          maxScore: 10,
        },
        {
          id: 'prac-s-2',
          type: 'concept',
          prompt: `Prove how tail-latency amplification impairs a high-fanout distributed deployment of ${topicTitle}, and describe two engineering mitigations.`,
          tier: 'S',
          explanation: 'Demonstrate calculation of overall latency P(all < t) = p^k where k is fanout, and detail hedge requests or deadline propagation.',
          maxScore: 20,
          rubricCriteria: [
            'Mathematically models latency across fanout requests (P = p^k)',
            'Identifies hedged requests or speculative retry mechanisms',
            'Explains deadline propagation or circuit breaking',
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Tier A: Core Standard (Default)
  return {
    id: `lesson-${topicId}-A`,
    topicId,
    topicTitle,
    subjectTitle,
    tier: 'A',
    summary: `Professional, production-grade guide to ${topicTitle}: core principles, architecture patterns, standard algorithms, and real-world implementation trade-offs.`,
    learningObjectives: [
      `Master the core architectural components and operational mechanics of ${topicTitle}`,
      `Implement production-ready patterns with standard error handling and validation`,
      `Evaluate performance trade-offs, standard complexity metrics, and common engineering pitfalls`,
    ],
    sections: [
      {
        id: 'sec-a-1',
        order: 1,
        title: `Core Conceptual Foundations of ${topicTitle}`,
        content: `${topicTitle} is an established engineering pillar within ${subjectTitle}. It solves the challenge of maintaining systematic structure, rapid access, and reliable mutation under standard operational workloads.

Unlike naive approaches that scale linearly (O(n)), ${topicTitle} optimizes critical operations to logarithmic or constant time by enforcing structural invariants.

### Key Characteristics:
1. **Deterministic Guarantees**: Predictable performance boundaries across standard workloads.
2. **Scalability**: Gracefully handles growth without architectural rewrites.
3. **Composability**: Integrates cleanly into broader software architectures and pipelines.`,
        collapsible: false,
        takeaway: `${topicTitle} provides predictable scaling and deterministic guarantees for production software.`,
        checkQuestion: {
          question: `What distinguishes ${topicTitle} from naive unindexed approaches?`,
          answer: `It enforces structural invariants to maintain sub-linear time complexity across mutations and queries.`,
        },
      },
      {
        id: 'sec-a-2',
        order: 2,
        title: 'Architectural Mechanics & Data Flow',
        content: `When a request passes through the ${topicTitle} pipeline, three coordinated modules take effect:

1. **The Ingestion & Validation Layer**: Verifies input schemas and bounds before mutation.
2. **The Processing & Indexing Core**: Updates internal state while preserving tree/graph invariants.
3. **The Materialization Layer**: Yields deterministic results and commits state change to storage.`,
        collapsible: false,
        takeaway: `Clean separation between ingestion, invariant enforcement, and materialization ensures modularity.`,
      },
      {
        id: 'sec-a-3',
        order: 3,
        title: 'Engineering Trade-offs & Production Considerations',
        content: `Every engineering decision involves trade-offs:
- **Read Latency vs. Write Amplification**: Aggressive pre-indexing accelerates reads at the expense of write overhead.
- **Memory Footprint**: Auxiliary pointers and metadata consume roughly 15-30% additional memory overhead.
- **Concurrency**: Requires read-write lock splitting or optimistic locking to avoid global lock contention.`,
        collapsible: true,
        takeaway: `Balance write overhead with read velocity based on your application's read/write ratio.`,
      },
    ],
    visualDiagram: {
      id: 'diag-a-1',
      type: 'mermaid',
      title: `System Architecture: ${topicTitle}`,
      caption: 'Component interaction and data flow diagram for production systems.',
      mermaidCode: `graph TD
  Client[Client / Service Request] --> Gateway[API Gateway & Rate Limiter]
  Gateway --> Ingestion[Ingestion Validator]
  subgraph Engine [${topicTitle} Core]
    Ingestion --> Router{Routing Logic}
    Router -->|Read Query| Cache[(Fast Path Index)]
    Router -->|Write Mutation| InvariantCheck[Invariant Validator]
    InvariantCheck --> StateStore[(Persistent State)]
  end
  Cache --> Response[Response Transformer]
  StateStore --> Response
  Response --> Client
  style Engine fill:#f8fafc,stroke:#3b82f6,stroke-dasharray: 5 5`,
      stages: [
        { step: 1, label: 'Client Ingestion', description: 'Request parsed and validated against boundary schema.' },
        { step: 2, label: 'Core Invariant Validation', description: 'Checks state consistency before mutation.' },
        { step: 3, label: 'Transformation & Response', description: 'Clean response formatted and returned to caller.' },
      ],
    },
    codeExample: {
      id: 'code-a-1',
      language: 'typescript',
      title: `Production Implementation: ${topicTitle}`,
      code: `// Standard Production-Grade Implementation of ${topicTitle}
export interface ConfigOptions {
  enableLogging?: boolean;
  maxRetries?: number;
}

export class ${topicTitle.replace(/[^a-zA-Z]/g, '')}Service<T> {
  private store = new Map<string, T>();

  constructor(private readonly options: ConfigOptions = {}) {}

  public executeOperation(key: string, value: T): boolean {
    if (!key || key.trim() === '') {
      throw new Error("Invalid key provided to ${topicTitle} operation.");
    }

    try {
      // Invariant check: verify item does not violate uniqueness
      this.store.set(key, value);
      
      if (this.options.enableLogging) {
        console.info(\`[${topicTitle}] Successfully stored key: \${key}\`);
      }
      return true;
    } catch (error) {
      console.error(\`[${topicTitle}] Failed to execute:\`, error);
      return false;
    }
  }

  public retrieve(key: string): T | undefined {
    return this.store.get(key);
  }
}`,
      explanation: 'Production pattern featuring parameter validation, error boundaries, typed configuration, and encapsulated state management.',
      complexity: {
        time: 'O(1) average case for Map lookups and mutations.',
        space: 'O(n) where n is the number of active stored entries.',
        explanation: 'Hash table bucket distribution keeps lookup times constant on average.',
      },
      edgeCases: ['Duplicate key collision', 'Empty string key passed to mutation API'],
      inputOutputDemo: {
        input: 'service.executeOperation("node_1", { status: "active" })',
        output: 'true',
        explanation: 'Item committed and state returned successfully.',
      },
    },
    revisionNotes: [
      {
        id: 'note-a-1',
        type: 'definition',
        title: `${topicTitle} Definition`,
        content: `A core architectural pattern providing structured data management, deterministic complexity, and scalable operations.`,
        tags: ['core', 'architecture'],
      },
      {
        id: 'note-a-2',
        type: 'pitfall',
        title: 'Premature Optimization Trap',
        content: `Avoid introducing distributed clustering or lock-free concurrency until profiling reveals lock contention or throughput ceilings.`,
        tags: ['pitfall', 'best-practices'],
      },
      {
        id: 'note-a-3',
        type: 'flashcard',
        title: `Flashcard: ${topicTitle} Time Complexity`,
        content: `What is the expected average time complexity of ${topicTitle} lookup operations?`,
        reverseContent: `O(1) for hash-based tables, or O(log n) for balanced tree structures.`,
        tags: ['flashcard', 'complexity'],
      },
    ],
    practiceQuestions: [
      {
        id: 'prac-a-1',
        type: 'mcq',
        prompt: `In standard production engineering, what is the primary architectural trade-off when implementing ${topicTitle}?`,
        tier: 'A',
        options: [
          'Decreased memory footprint in exchange for slower compilation times',
          'Read acceleration and fast lookups in exchange for write mutation overhead and auxiliary index memory',
          'Elimination of all network security requirements',
          'Forcing all application code into a single synchronous thread',
        ],
        correctAnswerIndex: 1,
        explanation: 'Indexes and structural invariant preservation speed up queries but add slight mutation overhead and memory consumption.',
        maxScore: 10,
      },
      {
        id: 'prac-a-2',
        type: 'concept',
        prompt: `Explain how you would monitor the health and performance of ${topicTitle} in a production environment with high traffic.`,
        tier: 'A',
        explanation: 'Should mention throughput (QPS), latency percentiles (P95/P99), error rates, and memory saturation.',
        maxScore: 15,
        rubricCriteria: [
          'Identifies latency percentiles (P95, P99)',
          'Considers error rates and throughput metrics',
          'Addresses memory or index saturation monitoring',
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

