import { PedagogicalTier } from './cognitive.js';

export type PedagogicalMode = 'learn' | 'visualize' | 'code' | 'notes' | 'practice';

export interface ConceptSection {
  id: string;
  order: number;
  title: string;
  content: string; // Markdown supported
  collapsible?: boolean;
  takeaway?: string;
  checkQuestion?: {
    question: string;
    answer: string;
  };
}

export interface DiagramStage {
  step: number;
  label: string;
  description: string;
  highlightedNodeId?: string;
}

export interface VisualDiagramData {
  id: string;
  type: 'mermaid' | 'flowchart' | 'architecture' | 'state';
  title: string;
  caption: string;
  mermaidCode: string;
  stages: DiagramStage[];
}

export interface CodeExampleData {
  id: string;
  language: string;
  title: string;
  code: string;
  explanation: string;
  complexity: {
    time: string;
    space: string;
    explanation?: string;
  };
  edgeCases: string[];
  inputOutputDemo?: {
    input: string;
    output: string;
    explanation?: string;
  };
}

export interface RevisionNoteItem {
  id: string;
  type: 'definition' | 'formula' | 'pitfall' | 'flashcard';
  title: string;
  content: string;
  reverseContent?: string; // For flashcards
  tags?: string[];
  isUserCreated?: boolean;
}

export type AssessmentQuestionType = 'mcq' | 'concept';

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  prompt: string;
  tier: PedagogicalTier;
  options?: string[]; // For MCQ
  correctAnswerIndex?: number; // For MCQ
  explanation: string;
  maxScore: number;
  rubricCriteria?: string[]; // For conceptual questions
}

export interface ConceptualGradingResult {
  score: number;
  maximumScore: number;
  percentage: number;
  passed: boolean;
  strengths: string[];
  missingConcepts: string[];
  misconceptions: string[];
  feedback: string;
  recommendedRevision: string[];
}

export interface LessonContent {
  id: string;
  topicId: string;
  topicTitle: string;
  subjectTitle: string;
  tier: PedagogicalTier;
  summary: string;
  learningObjectives: string[];
  sections: ConceptSection[];
  visualDiagram: VisualDiagramData;
  codeExample: CodeExampleData;
  revisionNotes: RevisionNoteItem[];
  practiceQuestions: AssessmentQuestion[];
  sourceReferences?: Array<{
    documentTitle: string;
    pageNumber?: number;
    quote?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
