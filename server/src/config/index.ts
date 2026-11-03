import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config();

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  host: string;
  clientOrigin: string;
  mongodb: {
    uri: string;
    useInMemoryFallback: boolean;
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    cookieSecret: string;
  };
  llm: {
    defaultProvider: 'ollama' | 'groq' | 'openrouter' | 'mock';
    enableCloudFallback: boolean;
    ollamaHost: string;
    ollamaModel: string;
    ollamaTimeoutMs: number;
    groqApiKey: string;
    groqModel: string;
    openRouterApiKey: string;
    openRouterModel: string;
  };
  cognitive: {
    provider: 'mock' | 'external';
    enableSimulation: boolean;
    sustainedThresholdSeconds: number;
    confidenceThreshold: number;
  };
  uploads: {
    maxSizeBytes: number;
    uploadDir: string;
  };
}

export const config: AppConfig = {
  env: (process.env.NODE_ENV as AppConfig['env']) || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  host: process.env.HOST || '0.0.0.0',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cogflow',
    useInMemoryFallback: process.env.MONGODB_USE_IN_MEMORY_FALLBACK !== 'false',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'cogflow_development_secret_key_change_in_production_32chars!',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieSecret: process.env.COOKIE_SECRET || 'cogflow_secure_cookie_secret_dev_environment_32chars!',
  },
  llm: {
    defaultProvider: (process.env.DEFAULT_LLM_PROVIDER as AppConfig['llm']['defaultProvider']) || 'ollama',
    enableCloudFallback: process.env.ENABLE_CLOUD_FALLBACK !== 'false',
    ollamaHost: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b',
    ollamaTimeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS || '180000', 10),
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
    openRouterModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
  },
  cognitive: {
    provider: (process.env.COGNITIVE_PROVIDER as AppConfig['cognitive']['provider']) || 'mock',
    enableSimulation: process.env.ENABLE_COGNITIVE_SIMULATION !== 'false',
    sustainedThresholdSeconds: parseInt(process.env.COGNITIVE_SUSTAINED_THRESHOLD_SECONDS || '30', 10),
    confidenceThreshold: parseFloat(process.env.COGNITIVE_CONFIDENCE_THRESHOLD || '0.60'),
  },
  uploads: {
    maxSizeBytes: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '25', 10) * 1024 * 1024,
    uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads'),
  },
};

