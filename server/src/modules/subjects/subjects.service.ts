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
    title: 'Computer Science & Systems',
    category: 'Computer Science',
    description: 'Foundational algorithms, distributed architectures, operating systems, and memory models.',
    icon: 'Cpu',
    order: 1,
    topics: [
      {
        slug: 'distributed-consensus-raft',
        title: 'Distributed Consensus & Raft Protocol',
        summary: 'How distributed nodes agree on a shared state machine log in the presence of network partitions and node crashes.',
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
    ],
  },
  {
    slug: 'mathematics',
    title: 'Mathematics & Analysis',
    category: 'Mathematics',
    description: 'Rigorous linear algebra, multivariable optimization, probability theory, and discrete structures.',
    icon: 'Sigma',
    order: 2,
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
    description: 'Classical mechanics, thermodynamics, wave propagation, and quantum theory.',
    icon: 'Atom',
    order: 3,
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
];

export class SubjectsService {
  async ensureCurriculumSeeded(): Promise<void> {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      if (inMemoryStore.subjects.items.length === 0) {
        console.log('[Curriculum] Seeding in-memory curriculum catalog...');
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
      return;
    }

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
  }

  async listSubjects(category?: string, search?: string) {
    await this.ensureCurriculumSeeded();
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      let items = inMemoryStore.subjects.find();
      if (category) {
        items = items.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      return items;
    }

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    return SubjectModel.find(filter).sort({ order: 1 });
  }

  async getSubject(idOrSlug: string) {
    await this.ensureCurriculumSeeded();
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      return (
        inMemoryStore.subjects.findOne({ slug: idOrSlug }) ||
        inMemoryStore.subjects.findById(idOrSlug)
      );
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    if (isMongoId) {
      return SubjectModel.findById(idOrSlug);
    }
    return SubjectModel.findOne({ slug: idOrSlug });
  }

  async listTopics(subjectId: string) {
    await this.ensureCurriculumSeeded();
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      return inMemoryStore.topics.find((t) => t.subjectId === subjectId);
    }

    return TopicModel.find({ subjectId }).sort({ order: 1 });
  }

  async getTopic(topicIdOrSlug: string) {
    await this.ensureCurriculumSeeded();
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      return (
        inMemoryStore.topics.findById(topicIdOrSlug) ||
        inMemoryStore.topics.findOne({ slug: topicIdOrSlug })
      );
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(topicIdOrSlug);
    if (isMongoId) {
      return TopicModel.findById(topicIdOrSlug);
    }
    return TopicModel.findOne({ slug: topicIdOrSlug });
  }
}

export const subjectsService = new SubjectsService();

