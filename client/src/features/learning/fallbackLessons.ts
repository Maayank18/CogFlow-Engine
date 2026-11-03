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
        mermaidCode: `graph LR
  Client[Client Request] --> Leader[Elected Leader]
  Leader --> NodeA[Follower Node 1]
  Leader --> NodeB[Follower Node 2]
  NodeA -.->|Acknowledge| Leader
  NodeB -.->|Acknowledge| Leader
  Leader --> Commit[Committed to Log]
  style Leader fill:#0d9488,stroke:#0f766e,color:#fff
  style Commit fill:#2563eb,stroke:#1d4ed8,color:#fff`,
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
          prompt: `In a 5-node distributed cluster, what is the maximum number of simultaneous node failures the cluster can endure while remaining operational?`,
          tier: 'B',
          options: ['1 node', '2 nodes', '3 nodes', '4 nodes'],
          correctAnswerIndex: 1,
          explanation: `With 5 nodes, majority quorum is floor(5/2) + 1 = 3 nodes. If 2 nodes fail, 3 remain online (majority intact). If 3 fail, only 2 remain, halting commits.`,
          maxScore: 10,
        },
        {
          id: 'prac-b-2',
          type: 'concept',
          prompt: `Explain in your own words why having an odd number of nodes (e.g. 3 or 5) is preferred over an even number (e.g. 4 or 6) in quorum systems.`,
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
        mermaidCode: `stateDiagram-v2
  [*] --> Follower: Bootstrapped
  Follower --> Candidate: Election Timeout Elapsed
  Candidate --> Leader: Obtains Quorum of Votes
  Candidate --> Follower: Observes Higher Term
  Leader --> Follower: Discovers Peer with Term > CurrentTerm
  Leader --> Leader: Heartbeat & Log Replication
  style Leader fill:#7c3aed,stroke:#6d28d9,color:#fff`,
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
          prompt: `Under what exact condition is a Candidate permitted to receive a Vote from a peer in Raft?`,
          tier: 'S',
          options: [
            'If the Candidate has higher hardware CPU specs',
            'If Candidate term >= peer term AND Candidate log is at least as up-to-date as peer log',
            'Whenever the Candidate is the first to send a UDP packet',
            'Only if all 100% of nodes in the cluster agree unanimously',
          ],
          correctAnswerIndex: 1,
          explanation: `The candidate log must be at least as up-to-date as the receiver's log, evaluated first by comparing last log entry term, then log length.`,
          maxScore: 10,
        },
        {
          id: 'prac-s-2',
          type: 'concept',
          prompt: `Prove why Raft requires a leader to commit at least one entry from its CURRENT term before it can consider previous-term entries safely committed.`,
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
      mermaidCode: `stateDiagram-v2
  [*] --> Follower
  Follower --> Candidate: Times out (No Heartbeat)
  Candidate --> Leader: Votes from Majority
  Candidate --> Follower: Discovers Leader / Higher Term
  Candidate --> Candidate: Split Vote (Times out)
  Leader --> Follower: Discovers Higher Term
  style Leader fill:#2563eb,stroke:#1d4ed8,color:#fff
  style Follower fill:#0d9488,stroke:#0f766e,color:#fff`,
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
        prompt: `Why does Raft use randomized election timeouts instead of fixed timer values?`,
        tier: 'A',
        options: [
          'To generate cryptographically secure hash seeds',
          'To prevent split votes by ensuring one candidate times out before others',
          'To synchronize hardware clocks across disparate data centers',
          'To reduce TCP connection handshakes',
        ],
        correctAnswerIndex: 1,
        explanation: `Randomized timeouts break symmetry among followers so that one node times out first and collects majority votes before other timers expire.`,
        maxScore: 10,
      },
      {
        id: 'prac-a-2',
        type: 'concept',
        prompt: `Describe the sequence of actions that occurs when a Raft leader receives a write request from an external client.`,
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

