export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  systemPrompt?: string;
  timeoutMs?: number;
}

export interface GenerationResponse {
  content: string;
  provider: 'ollama' | 'groq' | 'openrouter' | 'fallback';
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  durationMs: number;
}

export interface LLMChunk {
  content: string;
  isComplete: boolean;
  provider: string;
}

export interface LLMProvider {
  readonly id: 'ollama' | 'groq' | 'openrouter' | 'fallback';
  readonly name: string;
  isAvailable(): Promise<boolean>;
  generate(prompt: string | LLMMessage[], options?: GenerationOptions): Promise<GenerationResponse>;
  stream?(
    prompt: string | LLMMessage[],
    options?: GenerationOptions
  ): AsyncIterable<LLMChunk>;
}
