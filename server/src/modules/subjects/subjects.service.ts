import { SubjectModel, TopicModel } from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';

export interface SeedSubjectData {
  slug: string;
  title: string;
  category: 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Engineering';
  description: string;
  icon: string;
  order: number;
  topics: Array<{
    slug: string;
    title: string;
    summary: string;
    prerequisites: string[];
    learningObjectives: string[];
    estimatedMinutes: number;
    difficultyBaseline: 'B' | 'A' | 'S';
    order: number;
  }>;
}

export const INITIAL_CURRICULUM: SeedSubjectData[] = [
  {
    slug: 'computer-science',
    title: 'Computer Science & Distributed Systems',
    category: 'Computer Science',
    description: 'Consensus protocols, high-concurrency event loops, storage indexing, and CPU memory coherence.',
    icon: 'Cpu',
    order: 1,
    topics: [
      {
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
    slug: 'artificial-intelligence',
    title: 'AI & Neural Systems',
    category: 'Computer Science',
    description: 'Transformer architectures, diffusion generative models, self-attention, and high-dimensional vector search.',
    icon: 'Sparkles',
    order: 2,
    topics: [
      {
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
    slug: 'mathematics',
    title: 'Mathematics & Analysis',
    category: 'Mathematics',
    description: 'Rigorous linear algebra, multivariable optimization, probability theory, and discrete structures.',
    icon: 'Sigma',
    order: 3,
    topics: [
      {
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
    slug: 'physics',
    title: 'Physics & Physical Systems',
    category: 'Physics',
    description: 'Classical mechanics, thermodynamics, wave propagation, and quantum information theory.',
    icon: 'Atom',
    order: 4,
    topics: [
      {
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
    slug: 'engineering',
    title: 'Systems & Software Engineering',
    category: 'Engineering',
    description: 'Ultra-low-latency architectures, mechanical sympathy, circuit breakers, and fault-tolerant topologies.',
    icon: 'Layers',
    order: 5,
    topics: [
      {
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

export class SubjectsService {
  async ensureCurriculumSeeded(): Promise<void> {
    // 1. Always seed in-memory store so it is immediately populated
    if (inMemoryStore.subjects.items.length === 0) {
      console.log('[Curriculum] Populating in-memory curriculum catalog...');
      for (const item of INITIAL_CURRICULUM) {
        const subject = inMemoryStore.subjects.create({
          slug: item.slug,
          title: item.title,
          category: item.category,
          description: item.description,
          icon: item.icon,
          topicCount: item.topics.length,
          order: item.order,
        });

        for (const top of item.topics) {
          inMemoryStore.topics.create({
            subjectId: subject.id,
            slug: top.slug,
            title: top.title,
            summary: top.summary,
            prerequisites: top.prerequisites,
            learningObjectives: top.learningObjectives,
            estimatedMinutes: top.estimatedMinutes,
            difficultyBaseline: top.difficultyBaseline,
            order: top.order,
          });
        }
      }
    }

    const { isConnected, isInMemoryMode } = getDatabaseStatus();
    if (isInMemoryMode || !isConnected) return;

    try {
      const count = await SubjectModel.countDocuments();
      if (count === 0) {
        console.log('[Curriculum] Seeding initial curriculum into MongoDB...');
        for (const item of INITIAL_CURRICULUM) {
          const subject = await SubjectModel.create({
            slug: item.slug,
            title: item.title,
            category: item.category,
            description: item.description,
            icon: item.icon,
            topicCount: item.topics.length,
            order: item.order,
          });

          for (const top of item.topics) {
            await TopicModel.create({
              subjectId: subject._id,
              slug: top.slug,
              title: top.title,
              summary: top.summary,
              prerequisites: top.prerequisites,
              learningObjectives: top.learningObjectives,
              estimatedMinutes: top.estimatedMinutes,
              difficultyBaseline: top.difficultyBaseline,
              order: top.order,
            });
          }
        }
        console.log('[Curriculum] Seeded successfully.');
      }
    } catch {
      // In-memory already has the data
    }
  }

  async listSubjects(category?: string, search?: string) {
    await this.ensureCurriculumSeeded();
    const { isConnected, isInMemoryMode } = getDatabaseStatus();

    // If using in-memory or MongoDB is unavailable
    if (isInMemoryMode || !isConnected) {
      let items = inMemoryStore.subjects.find();
      if (category && category.toLowerCase() !== 'all') {
        items = items.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase().trim();
        items = items.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        );
      }
      return items.sort((a, b) => a.order - b.order);
    }

    try {
      const filter: Record<string, unknown> = {};
      if (category && category.toLowerCase() !== 'all') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const mongoResults = await SubjectModel.find(filter).sort({ order: 1 });
      if (mongoResults && mongoResults.length > 0) return mongoResults;
    } catch {
      // Fallback to in-memory store
    }

    return inMemoryStore.subjects.find().sort((a, b) => a.order - b.order);
  }

  async getSubject(idOrSlug: string) {
    await this.ensureCurriculumSeeded();
    const { isConnected, isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode || !isConnected) {
      return (
        inMemoryStore.subjects.findOne({ slug: idOrSlug }) ||
        inMemoryStore.subjects.findById(idOrSlug) ||
        inMemoryStore.subjects.items[0]
      );
    }

    try {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
      if (isMongoId) {
        const sub = await SubjectModel.findById(idOrSlug);
        if (sub) return sub;
      }
      const subBySlug = await SubjectModel.findOne({ slug: idOrSlug });
      if (subBySlug) return subBySlug;
    } catch {
      // Fallback
    }

    return inMemoryStore.subjects.findOne({ slug: idOrSlug }) || inMemoryStore.subjects.items[0];
  }

  async listTopics(subjectIdOrSlug: string) {
    await this.ensureCurriculumSeeded();
    const { isConnected, isInMemoryMode } = getDatabaseStatus();

    // 1. Resolve subject if slug or ID was passed
    const inMemSubject =
      inMemoryStore.subjects.findOne({ slug: subjectIdOrSlug }) ||
      inMemoryStore.subjects.findById(subjectIdOrSlug);
    const inMemTargetId = inMemSubject ? (inMemSubject.id || inMemSubject._id) : subjectIdOrSlug;

    if (isInMemoryMode || !isConnected) {
      // Return topics matching subject ID, or matching slug, or matching subjectId directly
      const topics = inMemoryStore.topics.find(
        (t) => t.subjectId === inMemTargetId || t.subjectId === subjectIdOrSlug
      );
      if (topics.length > 0) return topics.sort((a, b) => a.order - b.order);
      // If none found for specific subject, return all topics
      return inMemoryStore.topics.items.slice(0, 10);
    }

    try {
      let targetMongoSubjectId = subjectIdOrSlug;
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(subjectIdOrSlug);
      if (!isMongoId) {
        const sub = await SubjectModel.findOne({ slug: subjectIdOrSlug });
        if (sub) targetMongoSubjectId = sub._id.toString();
      }

      const mongoTopics = await TopicModel.find({ subjectId: targetMongoSubjectId }).sort({ order: 1 });
      if (mongoTopics && mongoTopics.length > 0) return mongoTopics;
    } catch {
      // Fallback
    }

    return inMemoryStore.topics
      .find((t) => t.subjectId === inMemTargetId || t.subjectId === subjectIdOrSlug)
      .sort((a, b) => a.order - b.order);
  }

  async getTopic(topicIdOrSlug: string) {
    await this.ensureCurriculumSeeded();
    const { isConnected, isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode || !isConnected) {
      return (
        inMemoryStore.topics.findOne({ slug: topicIdOrSlug }) ||
        inMemoryStore.topics.findById(topicIdOrSlug) ||
        inMemoryStore.topics.items[0]
      );
    }

    try {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(topicIdOrSlug);
      let topic = null;
      if (isMongoId) {
        topic = await TopicModel.findById(topicIdOrSlug);
      }
      if (!topic) {
        topic = await TopicModel.findOne({ slug: topicIdOrSlug });
      }
      if (topic) return topic;
    } catch {
      // Fallback
    }

    return (
      inMemoryStore.topics.findOne({ slug: topicIdOrSlug }) ||
      inMemoryStore.topics.findById(topicIdOrSlug) ||
      inMemoryStore.topics.items[0]
    );
  }

  async createSubject(data: {
    title: string;
    category?: 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Engineering';
    description?: string;
    icon?: string;
  }) {
    await this.ensureCurriculumSeeded();
    const { isConnected, isInMemoryMode } = getDatabaseStatus();

    const title = data.title.trim();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const category = data.category || 'Computer Science';
    const description = data.description || `Structured discipline for ${title}.`;
    const icon = data.icon || 'BookOpen';

    // Check if already exists
    let existing = await this.getSubject(slug);
    if (existing && (existing.title.toLowerCase() === title.toLowerCase() || existing.slug === slug)) {
      return existing;
    }

    if (isInMemoryMode || !isConnected) {
      const subject = inMemoryStore.subjects.create({
        slug,
        title,
        category,
        description,
        icon,
        topicCount: 0,
        order: inMemoryStore.subjects.items.length + 1,
      });
      return subject;
    }

    try {
      const subject = await SubjectModel.create({
        slug,
        title,
        category,
        description,
        icon,
        topicCount: 0,
        order: (await SubjectModel.countDocuments()) + 1,
      });
      return subject;
    } catch {
      return inMemoryStore.subjects.create({
        slug,
        title,
        category,
        description,
        icon,
        topicCount: 0,
        order: inMemoryStore.subjects.items.length + 1,
      });
    }
  }

  async createTopic(data: {
    title: string;
    subjectIdOrSlug?: string;
    category?: 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Engineering';
    summary?: string;
    difficultyBaseline?: 'B' | 'A' | 'S';
    estimatedMinutes?: number;
    learningObjectives?: string[];
  }) {
    await this.ensureCurriculumSeeded();
    const { isConnected, isInMemoryMode } = getDatabaseStatus();

    const title = data.title.trim();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Resolve or create subject
    let subject: any = null;
    if (data.subjectIdOrSlug) {
      subject = await this.getSubject(data.subjectIdOrSlug);
    }
    if (!subject) {
      subject = await this.createSubject({
        title: data.subjectIdOrSlug || 'Custom Studies',
        category: data.category || 'Computer Science',
      });
    }

    const subjectId = subject ? (subject.id || subject._id || subject.slug).toString() : 'custom';
    const summary = data.summary || `AI-generated structured curriculum for ${title}.`;
    const difficultyBaseline = data.difficultyBaseline || 'A';
    const estimatedMinutes = data.estimatedMinutes || 30;
    const learningObjectives =
      data.learningObjectives && data.learningObjectives.length > 0
        ? data.learningObjectives
        : [
            `Master the fundamental intuition and core principles of ${title}`,
            `Analyze real-world architecture patterns, tradeoffs, and edge cases`,
            `Verify knowledge retention through multi-tier conceptual practice`,
          ];

    // Check if topic exists
    const existingTopic = await this.getTopic(slug);
    if (existingTopic && (existingTopic.slug === slug || existingTopic.title.toLowerCase() === title.toLowerCase())) {
      return existingTopic;
    }

    if (isInMemoryMode || !isConnected) {
      const newTopic = inMemoryStore.topics.create({
        subjectId,
        slug,
        title,
        summary,
        prerequisites: ['Foundational concepts'],
        learningObjectives,
        estimatedMinutes,
        difficultyBaseline,
        order: inMemoryStore.topics.items.length + 1,
      });
      return newTopic;
    }

    try {
      const mongoSubId = subject._id || subject.id;
      const newTopic = await TopicModel.create({
        subjectId: mongoSubId,
        slug,
        title,
        summary,
        prerequisites: ['Foundational concepts'],
        learningObjectives,
        estimatedMinutes,
        difficultyBaseline,
        order: (await TopicModel.countDocuments()) + 1,
      });
      return newTopic;
    } catch {
      return inMemoryStore.topics.create({
        subjectId,
        slug,
        title,
        summary,
        prerequisites: ['Foundational concepts'],
        learningObjectives,
        estimatedMinutes,
        difficultyBaseline,
        order: inMemoryStore.topics.items.length + 1,
      });
    }
  }
}

export const subjectsService = new SubjectsService();
