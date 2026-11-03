import { config } from '../../config/index.js';
import { OllamaProvider } from './OllamaProvider.js';
import { GroqProvider } from './GroqProvider.js';
import { OpenRouterProvider } from './OpenRouterProvider.js';
import { LLMProvider, GenerationResponse, LLMChunk } from './types.js';
import {
  SYSTEM_PROMPT_BASE,
  buildLessonPrompt,
  buildSemanticGradingPrompt,
  buildSyllabusExtractionPrompt,
} from './prompts.js';
import { getDeterministicFallbackLesson } from './deterministicFallback.js';
import { LessonContent, ConceptualGradingResult } from '@cogflow/shared';

export function extractAndParseJson<T = any>(content: string): T {
  const text = (content || '').trim();

  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Continue
  }

  // 1. Try markdown fenced block ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // Continue to bracket search
    }
  }

  // 2. Find outermost JSON object { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Clean trailing commas before } or ] and invisible control characters
      const cleaned = candidate
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      try {
        return JSON.parse(cleaned);
      } catch {
        // Continue
      }
    }
  }

  // 3. Find outermost JSON array [ ... ]
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const candidate = text.substring(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      const cleaned = candidate.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(cleaned);
    }
  }

  throw new Error(`Failed to extract valid JSON from LLM output. Raw snippet: ${text.slice(0, 150)}...`);
}

export class LLMOrchestrator {
  private static instance: LLMOrchestrator;
  private ollama: OllamaProvider;
  private groq: GroqProvider;
  private openRouter: OpenRouterProvider;

  private constructor() {
    this.ollama = new OllamaProvider();
    this.groq = new GroqProvider();
    this.openRouter = new OpenRouterProvider();
  }

  public static getInstance(): LLMOrchestrator {
    if (!LLMOrchestrator.instance) {
      LLMOrchestrator.instance = new LLMOrchestrator();
    }
    return LLMOrchestrator.instance;
  }

  public async getProvidersStatus(): Promise<{
    defaultProvider: string;
    cloudFallbackEnabled: boolean;
    providers: Array<{ id: string; name: string; available: boolean; model?: string; details?: string }>;
  }> {
    const [ollamaOk, groqOk, openRouterOk] = await Promise.all([
      this.ollama.isAvailable(),
      this.groq.isAvailable(),
      this.openRouter.isAvailable(),
    ]);

    const ollamaModels = ollamaOk ? await this.ollama.listAvailableModels() : [];

    return {
      defaultProvider: config.llm.defaultProvider,
      cloudFallbackEnabled: config.llm.enableCloudFallback,
      providers: [
        {
          id: this.ollama.id,
          name: this.ollama.name,
          available: ollamaOk,
          model: this.ollama.defaultModel,
          details: ollamaOk
            ? `Connected (${ollamaModels.join(', ') || this.ollama.defaultModel})`
            : 'Disconnected (Run `ollama serve` on http://127.0.0.1:11434)',
        },
        {
          id: this.groq.id,
          name: this.groq.name,
          available: groqOk,
          model: this.groq.defaultModel,
          details: groqOk
            ? `Connected (Fast LPU Fallback: ${this.groq.defaultModel})`
            : 'No GROQ_API_KEY set (Optional high-speed cloud fallback)',
        },
        {
          id: this.openRouter.id,
          name: this.openRouter.name,
          available: openRouterOk,
          model: config.llm.openRouterModel,
          details: openRouterOk ? 'Connected' : 'No OpenRouter key set',
        },
        {
          id: 'fallback',
          name: 'Deterministic Local Engine',
          available: true,
          model: 'calm-precision-v2',
          details: 'Always Online (Guarantees zero-blank studios)',
        },
      ],
    };
  }

  public async setAndValidateGroqKey(apiKey: string): Promise<{ ok: boolean; message: string }> {
    if (!apiKey || apiKey.trim().length === 0) {
      return { ok: false, message: 'API key is required.' };
    }
    const cleanKey = apiKey.trim();
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${cleanKey}` },
      });
      if (res.ok) {
        process.env.GROQ_API_KEY = cleanKey;
        return { ok: true, message: 'Groq Cloud API Key validated and connected successfully!' };
      }
      return { ok: false, message: `Groq authentication failed (${res.status}): ${res.statusText}` };
    } catch (err) {
      return { ok: false, message: `Connection error: ${(err as Error).message}` };
    }
  }

  /**
   * Dispatches generation across active providers in priority order.
   */
  public async executeWithFallback(
    prompt: string,
    options?: { systemPrompt?: string; jsonMode?: boolean; temperature?: number }
  ): Promise<GenerationResponse> {
    const priorityList: LLMProvider[] = [];

    if (config.llm.defaultProvider === 'ollama') {
      priorityList.push(this.ollama);
      if (config.llm.enableCloudFallback) {
        priorityList.push(this.groq, this.openRouter);
      }
    } else if (config.llm.defaultProvider === 'groq') {
      priorityList.push(this.groq);
      if (config.llm.enableCloudFallback) {
        priorityList.push(this.ollama, this.openRouter);
      }
    } else if (config.llm.defaultProvider === 'openrouter') {
      priorityList.push(this.openRouter);
      if (config.llm.enableCloudFallback) {
        priorityList.push(this.groq, this.ollama);
      }
    } else {
      // Default mock/fallback
      priorityList.push(this.ollama, this.groq);
    }

    const errors: string[] = [];

    for (const provider of priorityList) {
      try {
        const available = await provider.isAvailable();
        if (!available) continue;

        console.log(`[LLMOrchestrator] Attempting generation with provider: ${provider.name}...`);
        const result = await provider.generate(prompt, {
          systemPrompt: options?.systemPrompt || SYSTEM_PROMPT_BASE,
          jsonMode: options?.jsonMode ?? true,
          temperature: options?.temperature ?? 0.3,
        });
        return result;
      } catch (err) {
        console.warn(`[LLMOrchestrator] Provider ${provider.name} failed: ${(err as Error).message}`);
        errors.push(`${provider.name}: ${(err as Error).message}`);
      }
    }

    throw new Error(`All configured LLM providers failed:\n${errors.join('\n')}`);
  }

  /**
   * Generates a multi-tier lesson with structured validation and deterministic fallback.
   */
  public async generateLesson(params: {
    topicId: string;
    topicTitle: string;
    subjectTitle: string;
    tier: 'B' | 'A' | 'S';
    summary?: string;
    learningObjectives?: string[];
    documentContext?: string;
  }): Promise<LessonContent> {
    const prompt = buildLessonPrompt(params);

    try {
      const response = await this.executeWithFallback(prompt, {
        systemPrompt: SYSTEM_PROMPT_BASE,
        jsonMode: true,
      });

      // Robust extraction and parsing of structured JSON from any model output
      const parsed = extractAndParseJson(response.content);

      // Prepare pedagogical fallback to fill any omitted studios
      const fallback = getDeterministicFallbackLesson({
        topicTitle: params.topicTitle,
        subjectTitle: params.subjectTitle,
        tier: params.tier,
        topicId: params.topicId,
      });

      return {
        id: `lesson-${params.topicId}-${params.tier}`,
        topicId: params.topicId,
        topicTitle: params.topicTitle,
        subjectTitle: params.subjectTitle,
        tier: params.tier,
        summary: parsed.summary || fallback.summary,
        learningObjectives:
          Array.isArray(parsed.learningObjectives) && parsed.learningObjectives.length > 0
            ? parsed.learningObjectives
            : fallback.learningObjectives,
        sections:
          Array.isArray(parsed.sections) && parsed.sections.length > 0
            ? parsed.sections
            : fallback.sections,
        visualDiagram:
          parsed.visualDiagram && parsed.visualDiagram.mermaidCode
            ? parsed.visualDiagram
            : fallback.visualDiagram,
        codeExample:
          parsed.codeExample && parsed.codeExample.code
            ? parsed.codeExample
            : fallback.codeExample,
        revisionNotes:
          Array.isArray(parsed.revisionNotes) && parsed.revisionNotes.length > 0
            ? parsed.revisionNotes
            : fallback.revisionNotes,
        practiceQuestions:
          Array.isArray(parsed.practiceQuestions) && parsed.practiceQuestions.length > 0
            ? parsed.practiceQuestions
            : fallback.practiceQuestions,
        sourceReferences: params.documentContext ? [{ documentTitle: 'Syllabus Ingestion', pageNumber: 1 }] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn(
        `[LLMOrchestrator] Dynamic LLM generation fell back to deterministic pedagogical engine: ${(err as Error).message}`
      );
      return getDeterministicFallbackLesson({
        topicTitle: params.topicTitle,
        subjectTitle: params.subjectTitle,
        tier: params.tier,
        topicId: params.topicId,
      });
    }
  }

  /**
   * Evaluates student conceptual answer against rubric criteria.
   */
  public async evaluateConceptualAnswer(params: {
    topicTitle: string;
    tier: 'B' | 'A' | 'S';
    questionPrompt: string;
    expectedExplanation: string;
    rubricCriteria: string[];
    studentAnswer: string;
    maxScore: number;
  }): Promise<ConceptualGradingResult> {
    const prompt = buildSemanticGradingPrompt(params);

    try {
      const response = await this.executeWithFallback(prompt, {
        systemPrompt: SYSTEM_PROMPT_BASE,
        jsonMode: true,
        temperature: 0.2,
      });

      const parsed = extractAndParseJson(response.content);

      return {
        score: Math.min(params.maxScore, Math.max(0, parsed.score ?? Math.round(params.maxScore * 0.8))),
        maximumScore: params.maxScore,
        percentage: parsed.percentage ?? Math.round(((parsed.score || 0) / params.maxScore) * 100),
        passed: Boolean(parsed.passed ?? ((parsed.score || 0) / params.maxScore >= 0.7)),
        strengths: parsed.strengths || ['Demonstrated foundational understanding of the core concept'],
        missingConcepts: parsed.missingConcepts || [],
        misconceptions: parsed.misconceptions || [],
        feedback: parsed.feedback || 'Well-articulated conceptual explanation.',
        recommendedRevision: parsed.recommendedRevision || [],
      };
    } catch (err) {
      console.warn(`[LLMOrchestrator] Conceptual grading evaluation fallback: ${(err as Error).message}`);
      
      // Deterministic semantic rubric evaluator fallback
      const wordCount = params.studentAnswer.trim().split(/\s+/).length;
      const hasKeywords = params.rubricCriteria.some((c) =>
        params.studentAnswer.toLowerCase().includes(c.split(' ')[0].toLowerCase())
      );

      const ratio = wordCount > 25 && hasKeywords ? 0.85 : wordCount > 10 ? 0.65 : 0.4;
      const score = Math.round(params.maxScore * ratio);

      return {
        score,
        maximumScore: params.maxScore,
        percentage: Math.round(ratio * 100),
        passed: ratio >= 0.7,
        strengths: ['Addressed the main question prompt with relevant reasoning'],
        missingConcepts: ratio < 0.7 ? ['Consider articulating boundary cases and system invariants more deeply'] : [],
        misconceptions: [],
        feedback:
          ratio >= 0.7
            ? 'Strong conceptual clarity demonstrated.'
            : 'Good initial start, but try detailing the causal mechanism and failure modes.',
        recommendedRevision: ['Review core principles in Learn Studio'],
      };
    }
  }

  /**
   * Extracts structured topics from uploaded syllabus text.
   */
  public async extractSyllabusTopics(documentText: string): Promise<{
    subjectTitle: string;
    category: 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Engineering';
    overview: string;
    topics: Array<{
      title: string;
      description: string;
      pageReference?: number;
      estimatedTier: 'B' | 'A' | 'S';
      prerequisites?: string[];
      learningObjectives?: string[];
    }>;
  }> {
    const prompt = buildSyllabusExtractionPrompt(documentText);

    try {
      const response = await this.executeWithFallback(prompt, {
        systemPrompt: SYSTEM_PROMPT_BASE,
        jsonMode: true,
      });

      return extractAndParseJson(response.content);
    } catch (err) {
      console.warn(`[LLMOrchestrator] Syllabus extraction fallback: ${(err as Error).message}`);
      // Fallback heuristics: find lines with Chapter/Unit/Week/Topic
      const lines = documentText.split('\n').map((l) => l.trim()).filter((l) => l.length > 5);
      const candidates = lines
        .filter((l) => /^(module|chapter|unit|topic|week|\d+\.)/i.test(l))
        .slice(0, 6)
        .map((title, idx) => ({
          title: title.replace(/^(module|chapter|unit|topic|week|\d+\.)\s*[:\-]?\s*/i, '').slice(0, 60),
          description: `Extracted syllabus module covering foundational and advanced concepts.`,
          pageReference: idx + 1,
          estimatedTier: 'A' as const,
          prerequisites: [],
          learningObjectives: ['Master the key syllabus concepts'],
        }));

      return {
        subjectTitle: 'Ingested Syllabus Course',
        category: 'Computer Science',
        overview: 'Course extracted from uploaded syllabus document.',
        topics:
          candidates.length > 0
            ? candidates
            : [
                {
                  title: 'Introduction & Core Foundations',
                  description: 'Syllabus introductory unit',
                  pageReference: 1,
                  estimatedTier: 'B',
                  prerequisites: [],
                  learningObjectives: ['Understand the core foundations'],
                },
                {
                  title: 'Core Mechanisms & Algorithms',
                  description: 'Syllabus core operational unit',
                  pageReference: 2,
                  estimatedTier: 'A',
                  prerequisites: [],
                  learningObjectives: ['Master intermediate operations'],
                },
                {
                  title: 'Advanced Architecture & Optimization',
                  description: 'Syllabus capstone module',
                  pageReference: 3,
                  estimatedTier: 'S',
                  prerequisites: [],
                  learningObjectives: ['Deep dive into production optimization'],
                },
              ],
      };
    }
  }

  /**
   * Real-time stream dispatch
   */
  public async *streamChat(prompt: string, systemPrompt?: string): AsyncIterable<LLMChunk> {
    if (await this.ollama.isAvailable()) {
      yield* this.ollama.stream(prompt, { systemPrompt });
    } else if (await this.groq.isAvailable()) {
      yield* this.groq.stream(prompt, { systemPrompt });
    } else {
      // Deterministic progressive chunk delivery
      const fullResponse = `CogFlow Adaptive Intelligence (Offline Mode): We have analyzed your query regarding "${prompt.slice(0, 40)}...". When connecting to a local Ollama instance (qwen2.5-coder:7b) or configuring Groq/OpenRouter keys, responses will stream live from the neural model. All core platform features, B/A/S pedagogical modes, and assessments remain fully operational!`;
      const words = fullResponse.split(' ');
      for (const word of words) {
        yield { content: word + ' ', isComplete: false, provider: 'fallback' };
        await new Promise((r) => setTimeout(r, 25));
      }
      yield { content: '', isComplete: true, provider: 'fallback' };
    }
  }
}

