import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  topicId: mongoose.Types.ObjectId;
  tier: 'B' | 'A' | 'S';
  summary: string;
  learningObjectives: string[];
  sections: Array<{
    id: string;
    order: number;
    title: string;
    content: string;
    collapsible?: boolean;
    takeaway?: string;
    checkQuestion?: {
      question: string;
      answer: string;
    };
  }>;
  visualDiagram: {
    id: string;
    type: 'mermaid' | 'flowchart' | 'architecture' | 'state';
    title: string;
    caption: string;
    mermaidCode: string;
    stages: Array<{
      step: number;
      label: string;
      description: string;
      highlightedNodeId?: string;
    }>;
  };
  codeExample: {
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
  };
  revisionNotes: Array<{
    id: string;
    type: 'definition' | 'formula' | 'pitfall' | 'flashcard';
    title: string;
    content: string;
    reverseContent?: string;
    tags?: string[];
  }>;
  practiceQuestions: Array<{
    id: string;
    type: 'mcq' | 'concept';
    prompt: string;
    tier: 'B' | 'A' | 'S';
    options?: string[];
    correctAnswerIndex?: number;
    explanation: string;
    maxScore: number;
    rubricCriteria?: string[];
  }>;
  sourceReferences?: Array<{
    documentTitle: string;
    pageNumber?: number;
    quote?: string;
  }>;
  generationProvider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ['B', 'A', 'S'],
      required: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    learningObjectives: {
      type: [String],
      required: true,
    },
    sections: [
      {
        id: { type: String, required: true },
        order: { type: Number, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        collapsible: { type: Boolean, default: false },
        takeaway: { type: String },
        checkQuestion: {
          question: { type: String },
          answer: { type: String },
        },
      },
    ],
    visualDiagram: {
      id: { type: String, required: true },
      type: {
        type: String,
        enum: ['mermaid', 'flowchart', 'architecture', 'state'],
        default: 'mermaid',
      },
      title: { type: String, required: true },
      caption: { type: String, default: '' },
      mermaidCode: { type: String, required: true },
      stages: [
        {
          step: { type: Number, required: true },
          label: { type: String, required: true },
          description: { type: String, required: true },
          highlightedNodeId: { type: String },
        },
      ],
    },
    codeExample: {
      id: { type: String, required: true },
      language: { type: String, required: true, default: 'typescript' },
      title: { type: String, required: true },
      code: { type: String, required: true },
      explanation: { type: String, required: true },
      complexity: {
        time: { type: String, default: 'O(n)' },
        space: { type: String, default: 'O(1)' },
        explanation: { type: String },
      },
      edgeCases: { type: [String], default: [] },
      inputOutputDemo: {
        input: { type: String },
        output: { type: String },
        explanation: { type: String },
      },
    },
    revisionNotes: [
      {
        id: { type: String, required: true },
        type: {
          type: String,
          enum: ['definition', 'formula', 'pitfall', 'flashcard'],
          required: true,
        },
        title: { type: String, required: true },
        content: { type: String, required: true },
        reverseContent: { type: String },
        tags: { type: [String], default: [] },
      },
    ],
    practiceQuestions: [
      {
        id: { type: String, required: true },
        type: { type: String, enum: ['mcq', 'concept'], required: true },
        prompt: { type: String, required: true },
        tier: { type: String, enum: ['B', 'A', 'S'], required: true },
        options: { type: [String] },
        correctAnswerIndex: { type: Number },
        explanation: { type: String, required: true },
        maxScore: { type: Number, default: 10 },
        rubricCriteria: { type: [String] },
      },
    ],
    sourceReferences: [
      {
        documentTitle: { type: String },
        pageNumber: { type: Number },
        quote: { type: String },
      },
    ],
    generationProvider: {
      type: String,
      default: 'local-ollama',
    },
  },
  {
    timestamps: true,
  }
);

LessonSchema.index({ topicId: 1, tier: 1 }, { unique: true });

export const LessonModel =
  mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

