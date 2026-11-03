import { SubjectItem, TopicItem } from '@cogflow/shared';

export interface CatalogSubjectWithTopics extends SubjectItem {
  order?: number;
  topics: TopicItem[];
}

export const FALLBACK_CURRICULUM_CATALOG: CatalogSubjectWithTopics[] = [
  {
    id: 'cs-distributed-systems',
    slug: 'computer-science',
    title: 'Computer Science & Distributed Systems',
    category: 'Computer Science',
    description: 'Consensus protocols, high-concurrency event loops, storage indexing, and CPU memory coherence.',
    icon: 'Cpu',
    topicCount: 4,
    order: 1,
    topics: [
      {
        id: 'top-raft-consensus',
        subjectId: 'cs-distributed-systems',
        slug: 'distributed-consensus-raft',
        title: 'Distributed Consensus & Raft Protocol',
        summary: 'How distributed nodes agree on a shared state machine log in the presence of network partitions and crashes.',
        prerequisites: ['Networking basics', 'State machine concepts'],
        learningObjectives: [
          'Master leader election, log replication, and safety invariants in Raft',
          'Understand term numbering and split-vote mitigation with randomized timeouts',
          'Analyze failure modes during asymmetric network partitions',
        ],
        estimatedMinutes: 35,
        difficultyBaseline: 'A',
        order: 1,
      },
      {
        id: 'top-b-plus-trees',
        subjectId: 'cs-distributed-systems',
        slug: 'b-plus-trees-database-indexing',
        title: 'B+ Trees & Storage Engine Indexing',
        summary: 'Self-balancing n-ary search tree structures optimized for block-based SSD and disk I/O.',
        prerequisites: ['Binary Search Trees', 'Disk vs RAM latency'],
        learningObjectives: [
          'Examine node fanout, page filling factors, and depth minimization',
          'Understand leaf node sequential linking for range scan efficiency',
          'Implement node splits and rebalancing under heavy mutation workloads',
        ],
        estimatedMinutes: 30,
        difficultyBaseline: 'A',
        order: 2,
      },
      {
        id: 'top-event-loop',
        subjectId: 'cs-distributed-systems',
        slug: 'asynchronous-event-loop',
        title: 'The Asynchronous Event Loop & Concurrency',
        summary: 'Single-threaded non-blocking I/O execution models, microtask queues, and cooperative scheduling.',
        prerequisites: ['Call stack mechanics', 'Callbacks and Promises'],
        learningObjectives: [
          'Trace task queue versus microtask queue execution order',
          'Avoid event loop starvation and thread-pool saturation',
          'Design high-throughput non-blocking asynchronous architectures',
        ],
        estimatedMinutes: 25,
        difficultyBaseline: 'A',
        order: 3,
      },
      {
        id: 'top-cache-coherence',
        subjectId: 'cs-distributed-systems',
        slug: 'cache-coherence-mesi',
        title: 'Cache Coherence & CPU Memory Models',
        summary: 'Hardware coherence protocols (MESI), store buffers, memory barriers, and false sharing.',
        prerequisites: ['CPU caches', 'Multithreading'],
        learningObjectives: [
          'Master Modified, Exclusive, Shared, and Invalid cache line states',
          'Understand why sequential consistency is sacrificed for hardware performance',
          'Diagnose cache line bouncing and lock contention in multi-core systems',
        ],
        estimatedMinutes: 30,
        difficultyBaseline: 'S',
        order: 4,
      },
    ],
  },
  {
    id: 'ai-neural-systems',
    slug: 'artificial-intelligence',
    title: 'AI & Neural Systems',
    category: 'Computer Science',
    description: 'Transformer architectures, diffusion generative models, self-attention, and high-dimensional vector search.',
    icon: 'Sparkles',
    topicCount: 3,
    order: 2,
    topics: [
      {
        id: 'top-transformers',
        subjectId: 'ai-neural-systems',
        slug: 'transformer-self-attention',
        title: 'Multi-Head Attention & Transformer Architecture',
        summary: 'Scaled dot-product attention, query-key-value transformations, and parallel sequence representation.',
        prerequisites: ['Linear Algebra', 'Matrix Multiplication', 'PyTorch / NumPy'],
        learningObjectives: [
          'Derive scaled dot-product attention mathematical formulation',
          'Understand positional encoding and rotary embeddings (RoPE)',
          'Analyze compute and memory complexity quadratic scaling vs FlashAttention',
        ],
        estimatedMinutes: 40,
        difficultyBaseline: 'A',
        order: 1,
      },
      {
        id: 'top-diffusion',
        subjectId: 'ai-neural-systems',
        slug: 'diffusion-generative-models',
        title: 'Score-Based Diffusion & Denoising SDEs',
        summary: 'Forward Gaussian noise schedules, reverse drift prediction, and classifier-free guidance.',
        prerequisites: ['Probability Distributions', 'Calculus', 'Neural Networks'],
        learningObjectives: [
          'Formulate forward and reverse diffusion processes mathematically',
          'Understand U-Net score matching and latent space optimization',
          'Implement classifier-free guidance (CFG) for prompt steering',
        ],
        estimatedMinutes: 35,
        difficultyBaseline: 'S',
        order: 2,
      },
      {
        id: 'top-vector-search',
        subjectId: 'ai-neural-systems',
        slug: 'vector-embeddings-hnsw',
        title: 'Vector Search & Hierarchical Navigable Small Worlds',
        summary: 'Approximate nearest neighbor graph algorithms for sub-millisecond similarity retrieval over millions of embeddings.',
        prerequisites: ['Graph Algorithms', 'Euclidean & Cosine Distance'],
        learningObjectives: [
          'Construct multi-layer skip-list inspired proximity graphs',
          'Tune efSearch and M parameters for recall-versus-latency trade-offs',
          'Deploy vector indexing in production RAG systems',
        ],
        estimatedMinutes: 30,
        difficultyBaseline: 'A',
        order: 3,
      },
    ],
  },
  {
    id: 'math-analysis',
    slug: 'mathematics',
    title: 'Mathematics & Analysis',
    category: 'Mathematics',
    description: 'Rigorous linear algebra, multivariable optimization, probability theory, and discrete structures.',
    icon: 'Sigma',
    topicCount: 2,
    order: 3,
    topics: [
      {
        id: 'top-eigenvalues',
        subjectId: 'math-analysis',
        slug: 'eigenvalues-spectral-decomposition',
        title: 'Eigenvalues & Spectral Theorem',
        summary: 'Vector transformations where direction is invariant; foundational for PCA, quantum states, and graph Laplacians.',
        prerequisites: ['Matrix multiplication', 'Determinants'],
        learningObjectives: [
          'Calculate characteristic polynomials and identify eigenspaces',
          'Apply the Spectral Theorem to symmetric linear operators',
          'Connect eigendecomposition to dimensionality reduction and Principal Component Analysis',
        ],
        estimatedMinutes: 35,
        difficultyBaseline: 'A',
        order: 1,
      },
      {
        id: 'top-gradient-descent',
        subjectId: 'math-analysis',
        slug: 'gradient-descent-convex-optimization',
        title: 'Gradient Descent & Convex Optimization',
        summary: 'First-order iterative algorithms for finding local and global minima in high-dimensional parameter spaces.',
        prerequisites: ['Partial derivatives', 'Vector calculus'],
        learningObjectives: [
          'Derive the Lipschitz smoothness bound and step size guarantees',
          'Analyze momentum, AdaGrad, and Adam adaptive learning rates',
          'Diagnose saddle points and ill-conditioned Hessian curvature',
        ],
        estimatedMinutes: 30,
        difficultyBaseline: 'A',
        order: 2,
      },
    ],
  },
  {
    id: 'physics-quantum',
    slug: 'physics',
    title: 'Physics & Physical Systems',
    category: 'Physics',
    description: 'Classical mechanics, thermodynamics, wave propagation, and quantum information theory.',
    icon: 'Atom',
    topicCount: 1,
    order: 4,
    topics: [
      {
        id: 'top-quantum-superposition',
        subjectId: 'physics-quantum',
        slug: 'quantum-superposition-qubits',
        title: 'Quantum Superposition & Wavefunction Collapse',
        summary: 'State representation in Hilbert space, quantum measurement postulates, and the Bloch sphere.',
        prerequisites: ['Complex numbers', 'Linear algebra vectors'],
        learningObjectives: [
          'Represent quantum states as linear combinations of orthogonal basis vectors',
          'Apply Born rule probabilities to measurement operators',
          'Understand decoherence and quantum gate transformations on the Bloch sphere',
        ],
        estimatedMinutes: 30,
        difficultyBaseline: 'A',
        order: 1,
      },
    ],
  },
  {
    id: 'eng-systems',
    slug: 'engineering',
    title: 'Systems & Software Engineering',
    category: 'Engineering',
    description: 'Ultra-low-latency architectures, mechanical sympathy, circuit breakers, and fault-tolerant topologies.',
    icon: 'Layers',
    topicCount: 2,
    order: 5,
    topics: [
      {
        id: 'top-lmax-disruptor',
        subjectId: 'eng-systems',
        slug: 'lmax-disruptor-ringbuffer',
        title: 'LMAX Disruptor & Lock-Free Ring Buffers',
        summary: 'Inter-thread messaging design leveraging mechanical sympathy, cache line padding, and memory fences.',
        prerequisites: ['Multithreading', 'Memory Barriers'],
        learningObjectives: [
          'Eliminate lock contention using single-writer sequence barriers',
          'Avoid false sharing with CPU cache line padding',
          'Achieve millions of ops/sec with sub-microsecond latency',
        ],
        estimatedMinutes: 35,
        difficultyBaseline: 'S',
        order: 1,
      },
      {
        id: 'top-circuit-breaker',
        subjectId: 'eng-systems',
        slug: 'circuit-breaker-fault-tolerance',
        title: 'Distributed Circuit Breakers & Cascading Failures',
        summary: 'Resilience engineering patterns that prevent total cluster outages when dependencies degrade.',
        prerequisites: ['Distributed Systems', 'HTTP / RPC'],
        learningObjectives: [
          'Model Closed, Open, and Half-Open circuit breaker states',
          'Calibrate error percentage thresholds and sliding window statistics',
          'Implement proactive load-shedding and graceful degradation',
        ],
        estimatedMinutes: 25,
        difficultyBaseline: 'A',
        order: 2,
      },
    ],
  },
];

const CUSTOM_TOPICS_STORAGE_KEY = 'cogflow_custom_subjects_v1';

export function getStoredCustomSubjects(): CatalogSubjectWithTopics[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_TOPICS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[CatalogData] Error reading custom topics from localStorage:', err);
    return [];
  }
}

export function saveStoredCustomSubjects(subjects: CatalogSubjectWithTopics[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(CUSTOM_TOPICS_STORAGE_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.warn('[CatalogData] Error saving custom topics to localStorage:', err);
  }
}

export function getMergedCurriculumCatalog(): CatalogSubjectWithTopics[] {
  const custom = getStoredCustomSubjects();
  if (custom.length === 0) return FALLBACK_CURRICULUM_CATALOG;

  // Merge custom subjects with default catalog
  const merged = [...FALLBACK_CURRICULUM_CATALOG];
  for (const customSub of custom) {
    const existingIdx = merged.findIndex(
      (s) => s.id === customSub.id || s.slug === customSub.slug || s.title.toLowerCase() === customSub.title.toLowerCase()
    );
    if (existingIdx !== -1) {
      // Merge topics
      const existing = merged[existingIdx];
      const mergedTopics = [...existing.topics];
      for (const t of customSub.topics) {
        if (!mergedTopics.some((mt) => mt.id === t.id || mt.slug === t.slug || mt.title.toLowerCase() === t.title.toLowerCase())) {
          mergedTopics.unshift(t);
        }
      }
      merged[existingIdx] = {
        ...existing,
        topicCount: mergedTopics.length,
        topics: mergedTopics,
      };
    } else {
      merged.unshift(customSub);
    }
  }
  return merged;
}

export function addCustomTopicOrSubject(params: {
  subjectTitle: string;
  category?: string;
  topicTitle: string;
  summary?: string;
  difficultyBaseline?: 'B' | 'A' | 'S';
  customPrompt?: string;
}): { subject: CatalogSubjectWithTopics; topic: TopicItem } {
  const {
    subjectTitle = 'Custom Explorations',
    category = 'Computer Science',
    topicTitle,
    summary = `Comprehensive study of ${topicTitle} across intuitive foundations, architectural diagrams, code, and practice.`,
    difficultyBaseline = 'A',
  } = params;

  const validCategory = (
    ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering'].includes(category)
      ? category
      : 'Computer Science'
  ) as 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Engineering';

  const topicSlug = topicTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `custom-topic-${Date.now()}`;

  const subjectSlug = subjectTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `custom-subject-${Date.now()}`;

  const topicId = `top-custom-${Date.now()}`;
  const subjectId = `sub-custom-${Date.now()}`;

  const newTopic: TopicItem = {
    id: topicId,
    subjectId,
    slug: topicSlug,
    title: topicTitle,
    summary,
    prerequisites: ['Foundational concepts', 'Analytical reasoning'],
    learningObjectives: [
      `Master the core principles and underlying intuition of ${topicTitle}`,
      `Analyze architectural mechanics, tradeoffs, and failure modes`,
      `Evaluate operational proficiency with interactive multi-tier practice`,
    ],
    estimatedMinutes: 30,
    difficultyBaseline,
    order: 1,
  };

  const storedSubjects = getStoredCustomSubjects();
  let targetSubject: CatalogSubjectWithTopics;
  const existingSubject = storedSubjects.find(
    (s) => s.slug === subjectSlug || s.title.toLowerCase() === subjectTitle.toLowerCase()
  );

  if (existingSubject) {
    // Add topic to existing subject
    targetSubject = {
      ...existingSubject,
      topics: [newTopic, ...existingSubject.topics.filter((t) => t.slug !== topicSlug)],
      topicCount: existingSubject.topics.length + 1,
    };
    const idx = storedSubjects.findIndex((s) => s.id === existingSubject.id || s.slug === existingSubject.slug);
    if (idx !== -1) storedSubjects[idx] = targetSubject;
    else storedSubjects.unshift(targetSubject);
  } else {
    // Check if it's one of the built-in subjects
    const builtinSubject = FALLBACK_CURRICULUM_CATALOG.find(
      (s) => s.slug === subjectSlug || s.title.toLowerCase() === subjectTitle.toLowerCase()
    );

    if (builtinSubject) {
      targetSubject = {
        ...builtinSubject,
        topics: [newTopic, ...builtinSubject.topics],
        topicCount: builtinSubject.topics.length + 1,
      };
      storedSubjects.unshift(targetSubject);
    } else {
      targetSubject = {
        id: subjectId,
        slug: subjectSlug,
        title: subjectTitle,
        category: validCategory,
        description: `Custom curriculum for ${subjectTitle} powered by on-device and cloud LLM synthesis.`,
        icon: 'Sparkles',
        topicCount: 1,
        order: 0,
        topics: [newTopic],
      };
      storedSubjects.unshift(targetSubject);
    }
  }

  saveStoredCustomSubjects(storedSubjects);

  return { subject: targetSubject, topic: newTopic };
}

