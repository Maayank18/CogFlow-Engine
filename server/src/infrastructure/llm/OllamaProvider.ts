import { config } from '../../config/index.js';
import { LLMProvider, LLMMessage, GenerationOptions, GenerationResponse, LLMChunk } from './types.js';

export class OllamaProvider implements LLMProvider {
  public readonly id = 'ollama' as const;
  public readonly name = 'Local Ollama';

  public get host(): string {
    return process.env.OLLAMA_HOST || config.llm.ollamaHost || 'http://127.0.0.1:11434';
  }

  public get defaultModel(): string {
    return process.env.OLLAMA_MODEL || config.llm.ollamaModel || 'qwen2.5-coder:7b';
  }

  public get timeoutMs(): number {
    return parseInt(process.env.OLLAMA_TIMEOUT_MS || '180000', 10);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.host}/api/tags`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return false;
      const data = (await res.json()) as { models?: Array<{ name: string }> };
      return Boolean(data.models && data.models.length > 0);
    } catch {
      return false;
    }
  }

  async listAvailableModels(): Promise<string[]> {
    try {
      const res = await fetch(`${this.host}/api/tags`);
      if (!res.ok) return [];
      const data = (await res.json()) as { models?: Array<{ name: string }> };
      return (data.models || []).map((m) => m.name);
    } catch {
      return [];
    }
  }

  async generate(
    prompt: string | LLMMessage[],
    options?: GenerationOptions
  ): Promise<GenerationResponse> {
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
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || this.timeoutMs);

    try {
      const res = await fetch(`${this.host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.defaultModel,
          messages,
          stream: false,
          format: options?.jsonMode ? 'json' : undefined,
          options: {
            temperature: options?.temperature ?? 0.4,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Ollama HTTP error ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as {
        message?: { content: string };
        prompt_eval_count?: number;
        eval_count?: number;
      };

      return {
        content: data.message?.content || '',
        provider: 'ollama',
        model: this.defaultModel,
        usage: {
          promptTokens: data.prompt_eval_count,
          completionTokens: data.eval_count,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
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
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || this.timeoutMs);

    try {
      const res = await fetch(`${this.host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.defaultModel,
          messages,
          stream: true,
          format: options?.jsonMode ? 'json' : undefined,
          options: {
            temperature: options?.temperature ?? 0.4,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok || !res.body) {
        throw new Error(`Ollama streaming failed with status ${res.status}`);
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
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            yield {
              content: parsed.message?.content || '',
              isComplete: Boolean(parsed.done),
              provider: 'ollama',
            };
          } catch {
            // Ignore partial JSON parse errors in stream
          }
        }
      }
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }
}

