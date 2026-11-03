import { config } from '../../config/index.js';
import { LLMProvider, LLMMessage, GenerationOptions, GenerationResponse, LLMChunk } from './types.js';

export class OpenRouterProvider implements LLMProvider {
  public readonly id = 'openrouter' as const;
  public readonly name = 'OpenRouter Cloud';
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = config.llm.openRouterApiKey;
    this.defaultModel = config.llm.openRouterModel;
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generate(
    prompt: string | LLMMessage[],
    options?: GenerationOptions
  ): Promise<GenerationResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API Key is not configured on server.');
    }

    const startTime = Date.now();
    const messages: LLMMessage[] = [];

    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    if (typeof prompt === 'string') {
      messages.push({ role: 'user', content: prompt });
    } else {
      messages.push(...prompt);
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://cogflow.internal',
        'X-Title': 'CogFlow Learning Platform',
      },
      body: JSON.stringify({
        model: this.defaultModel,
        messages,
        temperature: options?.temperature ?? 0.3,
        response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
        max_tokens: options?.maxTokens,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenRouter API error ${res.status}: ${errorText}`);
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };

    return {
      content: data.choices[0]?.message?.content || '',
      provider: 'openrouter',
      model: this.defaultModel,
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
      durationMs: Date.now() - startTime,
    };
  }
}
