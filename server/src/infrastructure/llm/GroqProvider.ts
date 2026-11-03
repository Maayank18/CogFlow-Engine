import { config } from '../../config/index.js';
import { LLMProvider, LLMMessage, GenerationOptions, GenerationResponse, LLMChunk } from './types.js';

export class GroqProvider implements LLMProvider {
  public readonly id = 'groq' as const;
  public readonly name = 'Groq Cloud';
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = config.llm.groqApiKey;
    this.defaultModel = config.llm.groqModel;
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generate(
    prompt: string | LLMMessage[],
    options?: GenerationOptions
  ): Promise<GenerationResponse> {
    if (!this.apiKey) {
      throw new Error('Groq API Key is not configured on server.');
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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 45000);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages,
          temperature: options?.temperature ?? 0.3,
          response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
          max_tokens: options?.maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API error ${res.status}: ${errorText}`);
      }

      const data = (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
        usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
      };

      return {
        content: data.choices[0]?.message?.content || '',
        provider: 'groq',
        model: this.defaultModel,
        usage: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
        },
        durationMs: Date.now() - startTime,
      };
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  async *stream(
    prompt: string | LLMMessage[],
    options?: GenerationOptions
  ): AsyncIterable<LLMChunk> {
    if (!this.apiKey) {
      throw new Error('Groq API Key is not configured.');
    }

    const messages: LLMMessage[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    if (typeof prompt === 'string') {
      messages.push({ role: 'user', content: prompt });
    } else {
      messages.push(...prompt);
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.defaultModel,
        messages,
        temperature: options?.temperature ?? 0.3,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Groq stream failed with status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const jsonStr = trimmed.replace('data: ', '');
        if (jsonStr === '[DONE]') {
          yield { content: '', isComplete: true, provider: 'groq' };
          return;
        }
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta?.content || '';
          if (delta) {
            yield { content: delta, isComplete: false, provider: 'groq' };
          }
        } catch {
          // Ignore SSE chunk parse errors
        }
      }
    }
  }
}
