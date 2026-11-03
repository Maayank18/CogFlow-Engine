import { LessonContent, PedagogicalTier } from '@cogflow/shared';
import { FALLBACK_CURRICULUM_CATALOG } from '../subjects/catalogData';

export function getClientFallbackLesson(
  topicIdOrSlug: string,
  tier: PedagogicalTier = 'A'
): LessonContent {
  // Find topic in catalog
  let topicTitle = 'Distributed Consensus & Raft Protocol';
  let subjectTitle = 'Computer Science & Distributed Systems';
  let summary = 'How distributed nodes agree on a shared state machine log in the presence of network partitions and crashes.';

  for (const sub of FALLBACK_CURRICULUM_CATALOG) {
    const found = sub.topics.find((t) => t.id === topicIdOrSlug || t.slug === topicIdOrSlug);
    if (found) {
      topicTitle = found.title;
      subjectTitle = sub.title;
      summary = found.summary;
      break;
    }
  }

  // Format clean readable title if slug passed
  if (topicTitle === 'Distributed Consensus & Raft Protocol' && topicIdOrSlug && topicIdOrSlug !== 'distributed-consensus-raft') {
    topicTitle = topicIdOrSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  if (tier === 'B') {
    return {
      id: `lesson-${topicIdOrSlug}-B`,
      topicId: topicIdOrSlug,
      topicTitle,
      subjectTitle,
      tier: 'B',
      summary: `Foundational introduction to ${topicTitle}: breaking down core intuition through vivid real-world analogies and cognitive scaffolding.`,
      learningObjectives: [
        `Understand the fundamental motivation behind ${topicTitle} without technical jargon barriers`,
        `Visualize how ${topicTitle} operates using everyday physical analogies`,
        `Recognize when and why ${topicTitle} is essential in modern software systems`,
      ],
      sections: [
        {
          id: 'sec-b-1',
          order: 1,
          title: `What is ${topicTitle}? (The Everyday Analogy)`,
          content: `Imagine organizing a student council where 5 members need to agree on school rules. If everyone talks at once and sends conflicting announcements, absolute chaos breaks out.

${topicTitle} acts like a structured voting committee with clear rules:
1. One person is elected spokesperson (the **Leader**).
2. The leader writes proposed decisions in a notebook.
3. Once a majority of members agree, the decision is officially published.

Even if one or two members fall asleep or lose connection, the committee continues working smoothly!`,
          collapsible: false,
          takeaway: `${topicTitle} exists to bring predictable, intuitive coordination to systems without single points of failure.`,
          checkQuestion: {
            question: `What is the core problem that ${topicTitle} was created to solve?`,
            answer: `It coordinates agreement and order across multiple independent parties even when individual parts fail.`,
          },
        },
        {
          id: 'sec-b-2',
          order: 2,
          title: 'Step-by-Step Walkthrough',
          content: `Let's break down the 3 primary phases of this mechanism:

1. **The Proposal Phase**: A new request arrives at the boundary.
2. **The Verification Phase**: The system checks with a quorum of peers to confirm majority agreement.
3. **The Final Commit Phase**: Once confirmed, the result is locked into history and executed.

Notice how no individual part can overwrite history without majority consensus!`,
          collapsible: false,
          takeaway: `The system processes items in distinct stages to avoid uncoordinated conflicts.`,
        },
        {
          id: 'sec-b-3',
          order: 3,
          title: 'Common Misconceptions to Avoid',
          content: `> **Misconception**: "A system must pause completely if any single node disconnects."
> 
> **Reality**: In ${topicTitle}, as long as a majority (e.g. 3 out of 5 nodes) is operational, the entire system continues serving reads and writes without interruption.`,
          collapsible: true,
          takeaway: `Majority quorum guarantees continuous progress even with minority node failures.`,
        },
      ],
      visualDiagram: {
        id: 'diag-b-1',
        type: 'mermaid',
        title: `Intuitive Conceptual Flow: ${topicTitle}`,
        caption: 'Visualizing client request routing through the leader node to follower confirmation.',
        mermaidCode: `flowchart LR
  Client["Client Request"] --> Leader["Elected Leader"]
  Leader --> NodeA["Follower Node 1"]
  Leader --> NodeB["Follower Node 2"]
  NodeA -.->|"Acknowledge"| Leader
  NodeB -.->|"Acknowledge"| Leader
  Leader --> Commit["Committed to Log"]`,
        stages: [
          { step: 1, label: 'Client Request', description: 'User submits an update to the cluster.' },
          { step: 2, label: 'Leader Replicate', description: 'Leader forwards proposed log entry to followers.' },
          { step: 3, label: 'Quorum Commit', description: 'Once majority confirms, state machine commits the value.' },
        ],
      },
      codeExample: {
        id: 'code-b-1',
        language: 'typescript',
        title: `Foundations Walkthrough: ${topicTitle}`,
        code: `// Beginner-friendly implementation of majority consensus
interface ClusterNode {
  id: string;
  isAlive: boolean;
  term: number;
}

function verifyMajorityQuorum(nodes: ClusterNode[]): boolean {
  const activeNodes = nodes.filter(n => n.isAlive);
  const majorityThreshold = Math.floor(nodes.length / 2) + 1;
  
  console.log(\`Active nodes: \${activeNodes.length} / \${nodes.length}\`);
  console.log(\`Quorum threshold required: \${majorityThreshold}\`);
  
  return activeNodes.length >= majorityThreshold;
}

// Example: 5-node cluster with 1 node offline
const cluster: ClusterNode[] = [
  { id: 'node-1', isAlive: true, term: 1 },
  { id: 'node-2', isAlive: true, term: 1 },
  { id: 'node-3', isAlive: true, term: 1 },
  { id: 'node-4', isAlive: true, term: 1 },
  { id: 'node-5', isAlive: false, term: 1 },
];

console.log("Can commit operations?", verifyMajorityQuorum(cluster)); // true (4 >= 3)`,
        explanation: 'This clean example checks whether enough cluster members are alive to satisfy the majority quorum rule (N/2 + 1).',
        complexity: {
          time: 'O(N) - Linear scan over cluster member statuses',
          space: 'O(1) - Evaluates state in-place without dynamic allocation',
          explanation: 'Fast in-memory arithmetic check.',
        },
        edgeCases: ['Split cluster with exactly 50% split (cannot form majority)', 'Single-node cluster edge cases'],
      },
      revisionNotes: [
        {
          id: 'note-b-1',
          type: 'definition',
          title: 'Quorum Rule',
          content: 'A majority subset of nodes (floor(N/2) + 1) required to validate any state machine mutation.',
          tags: ['foundation', 'quorum'],
        },
        {
          id: 'note-b-2',
          type: 'pitfall',
          title: 'Split-Brain Trap',
          content: 'Never allow minority partitions to elect a separate leader, or data will permanently diverge.',
          tags: ['safety', 'pitfall'],
        },
        {
          id: 'note-b-3',
          type: 'flashcard',
          title: `Quorum Requirement`,
          content: `In a 7-node cluster, how many nodes must be online to commit an operation?`,
          reverseContent: `4 nodes (floor(7/2) + 1 = 4).`,
          tags: ['flashcard', 'recall'],
        },
      ],
      practiceQuestions: [
        {
          id: 'prac-b-1',
          type: 'mcq',
          prompt: 'In a 5-node distributed cluster, what is the maximum number of simultaneous node failures the cluster can endure while remaining operational?',
          tier: 'B',
          options: ['1 node', '2 nodes', '3 nodes', '4 nodes'],
          correctAnswerIndex: 1,
          explanation: 'With 5 nodes, majority quorum is floor(5/2) + 1 = 3 nodes. If 2 nodes fail, 3 remain online (majority intact). If 3 fail, only 2 remain, halting commits.',
          maxScore: 10,
        },
        {
          id: 'prac-b-2',
          type: 'mcq',
          prompt: 'What is the primary role of periodic heartbeats sent by the cluster leader?',
          tier: 'B',
          options: [
            'To synchronize local system clocks across motherboards',
            'To reset follower election timers and prevent unneeded elections',
            'To compress stored JSON payloads on follower hard drives',
            'To encrypt all communication channels with TLS certificates',
          ],
          correctAnswerIndex: 1,
          explanation: 'Followers continuously count down their election timers. As long as periodic heartbeats (empty AppendEntries) arrive from the leader, followers reset their timers and stay passive.',
          maxScore: 10,
        },
        {
          id: 'prac-b-3',
          type: 'mcq',
          prompt: 'What specific event triggers a follower node to transition into candidate state?',
          tier: 'B',
          options: [
            'Receiving a write request directly from a user',
            'Its randomized election timer expires without receiving a leader heartbeat',
            'Its local CPU utilization exceeds 90%',
            'Another follower node shuts down gracefully',
          ],
          correctAnswerIndex: 1,
          explanation: 'When a follower experiences an election timeout because no heartbeats or valid AppendEntries were received from the current leader, it assumes the leader has failed and starts an election.',
          maxScore: 10,
        },
        {
          id: 'prac-b-4',
          type: 'mcq',
          prompt: 'Why does Raft use randomized election timeouts (e.g. 150ms-300ms) rather than a fixed timer?',
          tier: 'B',
          options: [
            'To randomly distribute hard drive wear across cluster nodes',
            'To break symmetry so one candidate times out first and gathers majority votes without split votes',
            'To generate cryptographic entropy for SSL keys',
            'To simulate variable network ping latency',
          ],
          correctAnswerIndex: 1,
          explanation: 'If all nodes had identical timeouts, they would all declare candidacy at the exact same millisecond, splitting votes equally and deadlocking. Randomization ensures one node almost always times out first.',
          maxScore: 10,
        },
        {
          id: 'prac-b-5',
          type: 'mcq',
          prompt: 'What does an incremented Term number signify in the Raft consensus protocol?',
          tier: 'B',
          options: [
            'The total number of megabytes saved to disk',
            'A logical clock epoch indicating a new election cycle and leadership reign',
            'The number of active client TCP sockets',
            'The software version number of the Raft binary',
          ],
          correctAnswerIndex: 1,
          explanation: 'Terms act as a logical clock in Raft. They allow nodes to detect obsolete information (such as stale leaders or out-of-date vote requests).',
          maxScore: 10,
        },
        {
          id: 'prac-b-6',
          type: 'mcq',
          prompt: 'When is a log entry considered safely committed and applied to the state machine in Raft?',
          tier: 'B',
          options: [
            'As soon as the client finishes sending the HTTP request',
            'Immediately when the leader writes it to its own local buffer',
            'Once it has been replicated to and acknowledged by a majority of cluster nodes',
            'Only when 100% of all cluster nodes acknowledge receipt',
          ],
          correctAnswerIndex: 2,
          explanation: 'Raft operates on quorum agreement. Once a majority (e.g. 3 of 5 nodes) has written the entry to their logs, it is committed and cannot be lost.',
          maxScore: 10,
        },
        {
          id: 'prac-b-7',
          type: 'mcq',
          prompt: 'Which entity in a Raft cluster is authorized to accept and coordinate write operations?',
          tier: 'B',
          options: [
            'Any follower node can commit writes directly to disk',
            'Only the single elected leader node coordinates write operations',
            'Any candidate node that has collected at least one vote',
            'External client load balancers write directly to state machines',
          ],
          correctAnswerIndex: 1,
          explanation: 'Raft is a strong-leader protocol. All state machine mutations must be sent to the elected leader, which sequences them into its log and replicates them to followers.',
          maxScore: 10,
        },
        {
          id: 'prac-b-8',
          type: 'mcq',
          prompt: 'If a 5-node cluster splits into two network partitions (one with 3 nodes, one with 2 nodes), what occurs in the 2-node partition?',
          tier: 'B',
          options: [
            'It successfully commits writes at double speed',
            'It cannot commit any client writes because it cannot achieve a majority quorum (3 nodes)',
            'It deletes all historical data permanently',
            'It elects a leader that overwrites the 3-node partition',
          ],
          correctAnswerIndex: 1,
          explanation: 'The 2-node partition is a minority (2 < 3). Because it cannot reach a majority quorum, it refuses to commit new state mutations, preventing split-brain data corruption.',
          maxScore: 10,
        },
        {
          id: 'prac-b-9',
          type: 'concept',
          prompt: 'Explain in your own words why having an odd number of nodes (e.g. 3 or 5) is preferred over an even number (e.g. 4 or 6) in quorum systems.',
          tier: 'B',
          explanation: 'Odd node counts avoid exact 50-50 splits and provide higher fault tolerance per added hardware cost.',
          maxScore: 20,
          rubricCriteria: [
            'Mentions split-vote tie breaking',
            'Compares fault tolerance efficiency between odd and even numbers',
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (tier === 'S') {
    return {
      id: `lesson-${topicIdOrSlug}-S`,
      topicId: topicIdOrSlug,
      topicTitle,
      subjectTitle,
      tier: 'S',
      summary: `Advanced formalization of ${topicTitle}: mathematical invariants, asymptotic optimality proofs, concurrency mechanics, and distributed failure modes.`,
      learningObjectives: [
        `Formulate formal safety invariants and prove term monotonicity for ${topicTitle}`,
        `Analyze network partition topologies, asymmetric packet loss, and split-brain resolution`,
        `Examine non-blocking consensus pipelines, batching amortization, and zero-copy replication`,
      ],
      sections: [
        {
          id: 'sec-s-1',
          order: 1,
          title: `Formal Invariants & Mathematical Safety Proofs`,
          content: `In distributed consensus, safety is defined by the **State Machine Safety Invariant**:

$$\\text{If a server has applied an entry at index } i \\text{ to its state machine, no other server will ever apply a different entry for index } i.$$

This guarantee rests on two inductive lemmas:
1. **Leader Completeness**: If a log entry is committed in a given term, that entry will be present in the logs of the leaders for all higher-numbered terms.
2. **Log Matching Property**: If two entries in different logs have the same index and term, they store identical commands, and their logs are identical in all preceding entries.

Under network partitions, vector clock causal ordering $\\vec{V}(a) < \\vec{V}(b)$ ensures that split-brain reconciliations never violate term monotonicity.`,
          collapsible: false,
          takeaway: `Leader completeness guarantees that once an entry achieves quorum, it is mathematically immutable.`,
          checkQuestion: {
            question: `How does Raft enforce the Leader Completeness property during candidate elections?`,
            answer: `A follower will deny its vote if the candidate's log is less up-to-date than its own log (evaluated by last log term, then last log index).`,
          },
        },
        {
          id: 'sec-s-2',
          order: 2,
          title: 'Joint Consensus & Dynamic Cluster Reconfiguration',
          content: `Changing cluster membership (adding or removing nodes) dynamically without pausing transactions requires **Joint Consensus**:

$$\\mathcal{C}_{\\text{old,new}} = \\mathcal{C}_{\\text{old}} \\cap \\mathcal{C}_{\\text{new}}$$

During transition, decisions require independent majorities from both $\\mathcal{C}_{\\text{old}}$ and $\\mathcal{C}_{\\text{new}}$ simultaneously. Only after $\\mathcal{C}_{\\text{old,new}}$ entry is committed does the leader commit the final $\\mathcal{C}_{\\text{new}}$ configuration.`,
          collapsible: false,
          takeaway: `Joint consensus avoids overlapping independent majorities during cluster membership resizing.`,
        },
        {
          id: 'sec-s-3',
          order: 3,
          title: 'High-Throughput Optimizations: Batching & Pipelining',
          content: `In production state machines (e.g., etcd, CockroachDB):
- **Log Pipelining**: The leader issues subsequent \`AppendEntries\` RPCs before receiving ACKs from prior rounds.
- **Group Commit**: Multiple concurrent client writes are batched into a single \`fsync\` disk flush call, reducing disk write latency from $N \\times 5\\text{ms}$ to $5\\text{ms}$.`,
          collapsible: true,
          takeaway: `Group commit amortizes storage write amplification across concurrent request batches.`,
        },
      ],
      visualDiagram: {
        id: 'diag-s-1',
        type: 'mermaid',
        title: `Formal State Transition: Leader Monotonicity & Invariants`,
        caption: 'Mathematical state transition diagram proving invariant safety across election terms.',
        mermaidCode: `flowchart TD
  Init(["Node Bootstrapped"]) --> Follower["Follower: Term T"]
  Follower -->|"Election Timeout Elapsed"| PreVote{"Pre-Vote Quorum Check"}
  PreVote -->|"Quorum Confirmed"| Candidate["Candidate: RequestVote Term T+1"]
  PreVote -->|"No Quorum"| Follower
  Candidate -->|"Majority Votes Secured"| Leader["Leader: Linearizable AppendEntries"]
  Candidate -->|"Higher Term Discovered"| Follower
  Leader -->|"Higher Term Discovered"| Follower
  Leader -->|"Pipelined Heartbeat & Replication"| Leader`,
        stages: [
          { step: 1, label: 'Candidate Propose', description: 'Increments term, votes for self, broadcasts RequestVote RPC.' },
          { step: 2, label: 'Quorum Acquisition', description: 'Secures strict majority of cluster votes including log recency checks.' },
          { step: 3, label: 'Leader Assertion', description: 'Transmits initial empty AppendEntries heartbeats to suppress competitor candidates.' },
        ],
      },
      codeExample: {
        id: 'code-s-1',
        language: 'typescript',
        title: `Production Raft Invariant Guard (TypeScript)`,
        code: `// Strict State Machine Safety Guard
export interface LogEntry {
  term: number;
  index: number;
  command: unknown;
}

export class RaftInvariantValidator {
  public static validateLogMatching(leaderLog: LogEntry[], peerLog: LogEntry[]): boolean {
    const minLen = Math.min(leaderLog.length, peerLog.length);
    for (let i = 0; i < minLen; i++) {
      if (leaderLog[i].term === peerLog[i].term && leaderLog[i].index === peerLog[i].index) {
        // Log Matching Invariant: All prior entries must match identically
        for (let j = 0; j <= i; j++) {
          if (leaderLog[j].term !== peerLog[j].term) {
            throw new Error(\`Invariant Violation at index \${j}: Term divergence detected!\`);
          }
        }
      }
    }
    return true;
  }
}`,
        explanation: 'Enforces the Log Matching Safety Invariant with asymptotic O(N) verification under split-brain recovery.',
        complexity: {
          time: 'O(N) - Validates term identity up to matched index',
          space: 'O(1) - Zero allocation pointer verification',
          explanation: 'Strict deterministic validation guard.',
        },
        edgeCases: ['Asymmetric partitions with divergent uncommitted log tails', 'Term rollover edge cases'],
      },
      revisionNotes: [
        {
          id: 'note-s-1',
          type: 'definition',
          title: 'State Machine Safety',
          content: 'No two servers can ever apply conflicting commands at the same log index.',
          tags: ['invariant', 'formal'],
        },
        {
          id: 'note-s-2',
          type: 'pitfall',
          title: 'Uncommitted Leader Overwrites',
          content: 'A leader can never commit an entry from a previous term by counting replicas; it must commit an entry from its current term.',
          tags: ['raft', 'pitfall'],
        },
        {
          id: 'note-s-3',
          type: 'flashcard',
          title: 'Raft Safety Invariant',
          content: 'Why cannot a leader commit a log entry from an older term simply by verifying replica count?',
          reverseContent: 'A subsequent leader with higher term could legitimately overwrite it before current-term entry commits.',
          tags: ['flashcard', 'advanced'],
        },
      ],
      practiceQuestions: [
        {
          id: 'prac-s-1',
          type: 'mcq',
          prompt: 'Under what exact condition is a Candidate permitted to receive a Vote from a peer in Raft?',
          tier: 'S',
          options: [
            'If the Candidate has higher hardware CPU specs',
            'If Candidate term >= peer term AND Candidate log is at least as up-to-date as peer log',
            'Whenever the Candidate is the first to send a UDP packet',
            'Only if all 100% of nodes in the cluster agree unanimously',
          ],
          correctAnswerIndex: 1,
          explanation: 'The voter verifies: term >= currentTerm, has not voted for another candidate in this term, and candidate log is at least as up-to-date (higher term on last entry, or identical term with length >= peer length).',
          maxScore: 10,
        },
        {
          id: 'prac-s-2',
          type: 'mcq',
          prompt: 'In TLA+ formal verification of Raft, what is the core invariant guaranteed by the Leader Completeness property?',
          tier: 'S',
          options: [
            'Every elected leader must immediately delete all prior entries',
            'If a log entry is committed at term T and index I, it is present in the leader log for all terms > T',
            'All follower nodes must respond to RPCs within 1 millisecond',
            'Network sockets must never experience packet reordering',
          ],
          correctAnswerIndex: 1,
          explanation: 'Leader Completeness states that if an entry is committed at term T and index I, then that entry will be present in the logs of the leaders for all terms greater than T. This ensures committed entries are never lost or overwritten.',
          maxScore: 10,
        },
        {
          id: 'prac-s-3',
          type: 'mcq',
          prompt: 'How does Raft circumvent the Fischer-Lynch-Paterson (FLP) impossibility result regarding consensus in asynchronous distributed systems?',
          tier: 'S',
          options: [
            'By requiring perfectly synchronized atomic clocks across all nodes',
            'By ensuring deterministic safety always, while relying on partial synchrony and randomized timers for liveness',
            'By discarding all failed nodes permanently and never allowing them to rejoin',
            'By substituting consensus with probabilistic Byzantine gossip protocols',
          ],
          correctAnswerIndex: 1,
          explanation: 'FLP proves that no deterministic asynchronous consensus algorithm can guarantee liveness with even a single unannounced crash. Raft guarantees safety under arbitrary asynchronous network conditions, while using randomized timeouts to ensure liveness under partial synchrony.',
          maxScore: 10,
        },
        {
          id: 'prac-s-4',
          type: 'mcq',
          prompt: 'What specific failure mode does the Pre-Vote protocol extension prevent in production Raft clusters?',
          tier: 'S',
          options: [
            'Hard disk bad sectors corrupting the write-ahead log',
            'A partitioned node repeatedly incrementing its term and deposing healthy leaders upon reconnecting',
            'Garbage collection pauses causing thread deadlocks',
            'TCP buffer overflows when transferring snapshots',
          ],
          correctAnswerIndex: 1,
          explanation: 'Without Pre-Vote, a disconnected node increments its term repeatedly. When reconnected, its higher term forces the legitimate leader to step down immediately. Pre-Vote requires candidates to verify they can gain a majority BEFORE incrementing their term.',
          maxScore: 10,
        },
        {
          id: 'prac-s-5',
          type: 'mcq',
          prompt: 'How does two-phase Joint Consensus (C_old,new) guarantee safety during dynamic cluster reconfiguration?',
          tier: 'S',
          options: [
            'By shutting down the entire cluster for maintenance before applying the new configuration',
            'By requiring separate majority quorum approvals from both C_old and C_new simultaneously during transition',
            'By delegating membership decisions to an external etcd coordinator',
            'By allowing only 1-node additions once every 24 hours',
          ],
          correctAnswerIndex: 1,
          explanation: 'In joint consensus, configuration entries C_old,new require a majority of C_old AND a majority of C_new to agree before committing. This prevents C_old and C_new from electing disjoint independent leaders.',
          maxScore: 10,
        },
        {
          id: 'prac-s-6',
          type: 'mcq',
          prompt: 'Why must a Raft node persist currentTerm and votedFor to non-volatile disk before responding to a RequestVote RPC?',
          tier: 'S',
          options: [
            'To calculate disk read/write bandwidth benchmarks',
            'To prevent a node from rebooting and voting for a different candidate in the same term, which could elect two leaders',
            'To encrypt voter identities against eavesdropping attacks',
            'To ensure the operating system kernel cache is flushed for page tables',
          ],
          correctAnswerIndex: 1,
          explanation: 'If a node voted for Candidate A, crashed, rebooted with memory reset, and then voted for Candidate B in the same term, two candidates could both attain majority quorums, violating the election safety invariant.',
          maxScore: 10,
        },
        {
          id: 'prac-s-7',
          type: 'mcq',
          prompt: 'What dangerous edge condition threatens local Leader Lease reads if physical clock drift or VM pauses occur?',
          tier: 'S',
          options: [
            'Log entries might be converted to base64 encoding',
            'A leader paused by a stop-the-world GC may believe its lease is active when it expired, serving stale reads while a new leader commits writes',
            'Followers automatically wipe their snapshot directories',
            'Candidate election timeouts shrink to zero milliseconds',
          ],
          correctAnswerIndex: 1,
          explanation: 'Leader leases rely on bounded physical time. If a leader suffers a hypervisor pause or severe clock skew, its lease may expire on other nodes while its local clock paused, causing it to return stale reads after a successor leader was elected.',
          maxScore: 10,
        },
        {
          id: 'prac-s-8',
          type: 'mcq',
          prompt: 'In high-throughput Raft engines (e.g. etcd, CockroachDB), how does pipelined log replication achieve multi-gigabyte throughput?',
          tier: 'S',
          options: [
            'By disabling disk persistence completely and running purely in RAM',
            'By dispatching subsequent AppendEntries batches in-flight without blocking on round-trip acknowledgments for preceding RPCs',
            'By replacing TCP sockets with raw unverified UDP datagrams',
            'By executing state machine commands before log replication completes',
          ],
          correctAnswerIndex: 1,
          explanation: 'Instead of stop-and-wait replication where each round-trip RPC incurs network latency, pipelining streams consecutive batches concurrently, optimizing network bandwidth while maintaining strict serial order in commitIndex updates.',
          maxScore: 10,
        },
        {
          id: 'prac-s-9',
          type: 'concept',
          prompt: 'Prove why Raft requires a leader to commit at least one entry from its CURRENT term before it can consider previous-term entries safely committed.',
          tier: 'S',
          explanation: 'Figure 8 in Raft paper shows an older entry replicated to majority can still be overwritten by a subsequent leader elected on a higher term unless anchored by a current term commit.',
          maxScore: 20,
          rubricCriteria: [
            'Cites older term replica vulnerability',
            'Explains current term anchoring mechanism',
            'Analyzes election restriction interaction',
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Tier A (Core Standard - Flow State)
  return {
    id: `lesson-${topicIdOrSlug}-A`,
    topicId: topicIdOrSlug,
    topicTitle,
    subjectTitle,
    tier: 'A',
    summary: `Production-grade architecture for ${topicTitle}: term monotonicity, leader election heartbeats, log replication consistency, and fault recovery.`,
    learningObjectives: [
      `Master leader election mechanics and randomized timeout mitigation in Raft`,
      `Implement log replication, term monotonicity, and commit index advancement`,
      `Handle node crashes, reconnects, and log repair protocols gracefully`,
    ],
    sections: [
      {
        id: 'sec-a-1',
        order: 1,
        title: `Core Architecture of ${topicTitle}`,
        content: `Raft decomposes distributed consensus into three distinct subproblems:
1. **Leader Election**: When an existing leader fails, a new leader must be elected via randomized timeouts to prevent split votes.
2. **Log Replication**: The elected leader accepts client writes, appends them to its local log, and replicates them to follower nodes.
3. **Safety**: If any server has applied a particular log entry to its state machine, no other server will ever apply a different log entry for the same index.

A server in Raft exists in one of three roles: **Leader**, **Follower**, or **Candidate**. Followers respond to incoming RPCs. If followers receive no communication within an election timeout (typically 150ms-300ms), they transition to candidate state.`,
        collapsible: false,
        takeaway: `Raft decomposes consensus into Leader Election, Log Replication, and Safety invariants.`,
        checkQuestion: {
          question: `What triggers a follower node to transition into a candidate state?`,
          answer: `The expiration of its randomized election timeout without receiving a heartbeat from a valid leader.`,
        },
      },
      {
        id: 'sec-a-2',
        order: 2,
        title: 'Heartbeat Mechanics & Randomized Timeouts',
        content: `Split votes occur when multiple followers become candidates simultaneously and divide votes evenly, causing an election stall.

Raft solves this with **Randomized Election Timeouts** (e.g., uniformly chosen between 150ms and 300ms). This guarantees that one candidate will almost always time out before others, collect votes, and broadcast heartbeats to return others to follower state.`,
        collapsible: false,
        takeaway: `Randomized timeouts break election symmetry, ensuring fast single-round elections.`,
      },
      {
        id: 'sec-a-3',
        order: 3,
        title: 'Log Replication & Consistency Check',
        content: `When a leader receives a command:
1. Appends command as entry in local log with \`currentTerm\`.
2. Sends \`AppendEntries\` RPCs in parallel to all followers.
3. Follower verifies that entry matches its preceding log term and index (\`prevLogIndex\`, \`prevLogTerm\`).
4. Once acknowledged by majority, leader increments \`commitIndex\` and applies to state machine.`,
        collapsible: true,
        takeaway: `AppendEntries consistency check guarantees that logs never diverge.`,
      },
    ],
    visualDiagram: {
      id: 'diag-a-1',
      type: 'mermaid',
      title: `Raft 3-Role State Machine`,
      caption: 'State transitions between Follower, Candidate, and Leader states.',
      mermaidCode: `flowchart TD
  Start(["Cluster Online"]) --> Follower["Follower State"]
  Follower -->|"Election Timeout without Heartbeat"| Candidate["Candidate State"]
  Candidate -->|"Majority Votes Acquired"| Leader["Leader State"]
  Candidate -->|"Discovers Higher Term"| Follower
  Candidate -->|"Split Vote Timeout"| Candidate
  Leader -->|"Discovers Higher Term"| Follower
  Leader -->|"Heartbeats & Replication"| Leader`,
      stages: [
        { step: 1, label: 'Follower', description: 'Listens for heartbeats and appends verified entries.' },
        { step: 2, label: 'Candidate', description: 'Sollicits votes from peers with election timer.' },
        { step: 3, label: 'Leader', description: 'Coordinates all log replication and serves client queries.' },
      ],
    },
    codeExample: {
      id: 'code-a-1',
      language: 'typescript',
      title: `Raft Election & Heartbeat Protocol`,
      code: `export type NodeRole = 'follower' | 'candidate' | 'leader';

export interface RaftState {
  currentTerm: number;
  votedFor: string | null;
  role: NodeRole;
  commitIndex: number;
}

export function handleElectionTimeout(state: RaftState, nodeId: string): { state: RaftState; votes: number } {
  // Step 1: Transition to candidate and increment term
  const newState: RaftState = {
    ...state,
    role: 'candidate',
    currentTerm: state.currentTerm + 1,
    votedFor: nodeId, // Vote for self
  };

  // Step 2: Initialize vote tally with self vote
  const initialVotes = 1;
  console.log(\`[\${nodeId}] Started election for Term \${newState.currentTerm}\`);

  return { state: newState, votes: initialVotes };
}`,
      explanation: 'Production implementation of Raft election initiation with term monotonicity and self-vote initialization.',
      complexity: {
        time: 'O(1) - Constant time state mutation',
        space: 'O(1) - Single stack frame allocation',
        explanation: 'Instantaneous state transition.',
      },
      edgeCases: ['Receiving heartbeat from valid leader while candidate', 'Network partition isolating former leader'],
    },
    revisionNotes: [
      {
        id: 'note-a-1',
        type: 'definition',
        title: 'Term Monotonicity',
        content: 'Terms act as a logical clock in Raft, enabling servers to detect obsolete information like stale leaders.',
        tags: ['term', 'clock'],
      },
      {
        id: 'note-a-2',
        type: 'pitfall',
        title: 'Fixed Timeouts',
        content: 'Never use fixed timeouts for election timers, as all nodes will timeout simultaneously and cause permanent split-vote livelock.',
        tags: ['timing', 'pitfall'],
      },
      {
        id: 'note-a-3',
        type: 'flashcard',
        title: 'Heartbeat Frequency',
        content: 'How often should a Raft leader send heartbeats relative to election timeouts?',
        reverseContent: 'Heartbeats must be sent several times faster (e.g. every 50ms) than election timeout (150ms-300ms) to prevent false elections.',
        tags: ['flashcard', 'heartbeat'],
      },
    ],
    practiceQuestions: [
      {
        id: 'prac-a-1',
        type: 'mcq',
        prompt: 'Why does Raft use randomized election timeouts instead of fixed timer values?',
        tier: 'A',
        options: [
          'To generate cryptographically secure hash seeds',
          'To prevent split votes by ensuring one candidate times out before others',
          'To synchronize hardware clocks across disparate data centers',
          'To reduce TCP connection handshakes',
        ],
        correctAnswerIndex: 1,
        explanation: 'Randomized timeouts break symmetry among followers so that one node times out first and collects majority votes before other timers expire.',
        maxScore: 10,
      },
      {
        id: 'prac-a-2',
        type: 'mcq',
        prompt: 'Under Raft election restrictions, why will a follower deny its vote to a candidate?',
        tier: 'A',
        options: [
          'If the candidate has fewer CPU cores than the voter',
          'If the candidate log is less up-to-date than the voter log',
          'If the candidate was elected in any previous term',
          'If the voter already has 10 client connections open',
        ],
        correctAnswerIndex: 1,
        explanation: 'Raft guarantees safety by ensuring that any elected leader contains all previously committed entries. A voter rejects a candidate whose log is less up-to-date (evaluated by last log term, then length).',
        maxScore: 10,
      },
      {
        id: 'prac-a-3',
        type: 'mcq',
        prompt: 'What does the Log Matching Invariant guarantee if two entries in different logs have the same index and term?',
        tier: 'A',
        options: [
          'They store identical state machine commands and their logs are identical in all preceding entries',
          'Only that their timestamps match within 100 milliseconds',
          'That both nodes must immediately step down to followers',
          'That the leader must issue an immediate log truncation to index 0',
        ],
        correctAnswerIndex: 0,
        explanation: 'Log Matching Invariant: If two entries in different logs have the same index and term, they store identical commands, and their logs are identical in all preceding entries up to that index.',
        maxScore: 10,
      },
      {
        id: 'prac-a-4',
        type: 'mcq',
        prompt: 'If a follower rejects an AppendEntries RPC because its log does not match at prevLogIndex and prevLogTerm, how does the leader resolve the conflict?',
        tier: 'A',
        options: [
          'The leader crashes immediately and triggers cluster re-election',
          'The leader decrements nextIndex for that follower and re-sends AppendEntries until a common point is found',
          'The leader wipes the follower hard drive completely via SSH',
          'The follower takes over as leader immediately',
        ],
        correctAnswerIndex: 1,
        explanation: 'When rejected, the leader decrements nextIndex for that follower and retries AppendEntries. Once prevLogIndex/prevLogTerm match, the follower overwrites any conflicting entries with the leader authoritative entries.',
        maxScore: 10,
      },
      {
        id: 'prac-a-5',
        type: 'mcq',
        prompt: 'Why cannot a Raft leader commit an uncommitted log entry from a PRIOR term simply by counting replicas on a majority?',
        tier: 'A',
        options: [
          'Because network packets from prior terms are dropped by kernel firewalls',
          'Because a future leader elected on a higher term could legitimately overwrite that entry (Figure 8 anomaly)',
          'Because follower nodes refuse to write older terms to their SSDs',
          'Because JSON deserialization fails on older term structures',
        ],
        correctAnswerIndex: 1,
        explanation: 'Figure 8 in Ongaro & Ousterhout paper proves that older entries replicated to a majority can still be overwritten by a subsequent leader. A leader can only safely commit an older entry indirectly by committing an entry from its CURRENT term.',
        maxScore: 10,
      },
      {
        id: 'prac-a-6',
        type: 'mcq',
        prompt: 'How does Read-Index (Linearizable Reads) allow a Raft leader to serve read queries without appending a new log entry to disk?',
        tier: 'A',
        options: [
          'It guesses that no network partitions exist',
          'It records its commitIndex and exchanges a round of heartbeat RPCs with a majority to confirm it has not been deposed',
          'It forwards all read queries to random follower nodes without checking terms',
          'It stores all read data in an unencrypted Redis cache',
        ],
        correctAnswerIndex: 1,
        explanation: 'To prevent returning stale data after an undetected partition, the leader records its commitIndex, verifies its leadership by confirming majority heartbeats, waits for its state machine to apply up to that index, and returns the read value.',
        maxScore: 10,
      },
      {
        id: 'prac-a-7',
        type: 'mcq',
        prompt: 'When does a leader send an InstallSnapshot RPC instead of an AppendEntries RPC to a lagging follower?',
        tier: 'A',
        options: [
          'When the follower has been offline and the entries it needs have already been compacted and discarded from the leader log',
          'Whenever the network throughput drops below 1 megabit/sec',
          'Every 10 seconds regardless of follower state',
          'When the follower sends a HTTP 404 response',
        ],
        correctAnswerIndex: 0,
        explanation: 'To prevent logs from growing unbounded, servers take snapshots and discard applied entries. If a follower lags behind the leader snapshot threshold, the missing entries no longer exist in the log, so the leader sends an InstallSnapshot RPC.',
        maxScore: 10,
      },
      {
        id: 'prac-a-8',
        type: 'mcq',
        prompt: 'If a leader appends a client write to its local log but crashes before sending AppendEntries to any follower, what happens to that entry?',
        tier: 'A',
        options: [
          'It is committed retroactively by the next leader',
          'The entry was never committed and will be cleanly overwritten and discarded by the newly elected leader',
          'The client application will hang forever and cannot reconnect',
          'The whole cluster enters an unrecoverable failure state',
        ],
        correctAnswerIndex: 1,
        explanation: 'Because the entry was never replicated to any peer, no majority knows about it. The newly elected leader will not have it in its log, and will overwrite the uncommitted entry on the rebooted old leader when replicating its own entries.',
        maxScore: 10,
      },
      {
        id: 'prac-a-9',
        type: 'concept',
        prompt: 'Describe the sequence of actions that occurs when a Raft leader receives a write request from an external client.',
        tier: 'A',
        explanation: 'Leader appends to log, broadcasts AppendEntries, waits for majority ACKs, commits to state machine, and replies to client.',
        maxScore: 20,
        rubricCriteria: [
          'Mentions local log append',
          'Identifies parallel AppendEntries broadcast',
          'Details majority quorum ACK before commit',
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

