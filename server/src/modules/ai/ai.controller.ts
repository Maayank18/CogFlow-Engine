import { Request, Response, NextFunction } from 'express';
import { LLMOrchestrator } from '../../infrastructure/llm/LLMOrchestrator.js';

export class AIController {
  private llmOrchestrator = LLMOrchestrator.getInstance();

  async getProvidersStatus(req: Request, res: Response): Promise<void> {
    const status = await this.llmOrchestrator.getProvidersStatus();
    res.json({
      success: true,
      data: status,
    });
  }

  async configureGroq(req: Request, res: Response): Promise<void> {
    try {
      const { apiKey } = req.body;
      const result = await this.llmOrchestrator.setAndValidateGroqKey(apiKey);
      res.json({
        success: result.ok,
        message: result.message,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }

  async runDiagnostics(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    try {
      const prompt = 'Respond with JSON: {"status": "ok", "message": "CogFlow AI Diagnostics Verified"}';
      const result = await this.llmOrchestrator.executeWithFallback(prompt, {
        jsonMode: true,
        temperature: 0.1,
      });
      res.json({
        success: true,
        data: {
          activeProvider: result.provider,
          model: result.model,
          latencyMs: Date.now() - startTime,
          response: result.content,
        },
      });
    } catch (err) {
      res.json({
        success: false,
        data: {
          activeProvider: 'fallback',
          model: 'deterministic-pedagogical-engine',
          latencyMs: Date.now() - startTime,
          error: (err as Error).message,
        },
      });
    }
  }

  async streamChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, topicTitle, tier } = req.body;

      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const systemPrompt = `You are CogFlow's pedagogical AI tutor. You are tutoring a student on "${topicTitle || 'this concept'}" at Tier ${tier || 'A'}. Keep responses concise, pedagogically clear, and encouraging.`;

      const stream = this.llmOrchestrator.streamChat(prompt, systemPrompt);

      for await (const chunk of stream) {
        res.write(JSON.stringify(chunk) + '\n');
      }

      res.end();
    } catch (error) {
      next(error);
    }
  }

  async askQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, topicTitle, tier } = req.body;

      const systemPrompt = `You are CogFlow's pedagogical AI tutor assisting a student on "${topicTitle || 'this topic'}" at Tier ${tier || 'A'}. Answer concisely with clear conceptual intuition.`;

      const result = await this.llmOrchestrator.executeWithFallback(prompt, {
        systemPrompt,
        jsonMode: false,
        temperature: 0.3,
      });

      res.json({
        success: true,
        data: {
          answer: result.content,
          provider: result.provider,
          model: result.model,
        },
      });
    } catch (error) {
      // Graceful fallback response if all models are offline
      res.json({
        success: true,
        data: {
          answer: `Great question regarding ${req.body.topicTitle || 'this concept'}! In Tier ${req.body.tier || 'A'}, remember that understanding the balance between architectural complexity and runtime guarantees is the key principle.`,
          provider: 'fallback',
          model: 'deterministic-tutor',
        },
      });
    }
  }
}

export const aiController = new AIController();

