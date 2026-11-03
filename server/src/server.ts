import { createApp } from './app.js';
import { config } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './infrastructure/database/index.js';
import { subjectsService } from './modules/subjects/subjects.service.js';

async function bootstrap() {
  console.log('========================================================');
  console.log('  🧠 CogFlow Adaptive Learning Platform — Starting Engine');
  console.log('========================================================');

  try {
    // 1. Connect to Database (with automatic fallback to in-memory resilience store)
    await connectDatabase();

    // 2. Ensure initial curriculum is seeded
    await subjectsService.ensureCurriculumSeeded();

    // 3. Initialize Express application
    const app = createApp();

    const server = app.listen(config.port, config.host, () => {
      console.log(`[Server] Running in ${config.env.toUpperCase()} mode.`);
      console.log(`[Server] Listening on http://${config.host}:${config.port}`);
      console.log(`[Server] Client Origin: ${config.clientOrigin}`);
      console.log(`[Server] Default LLM: ${config.llm.defaultProvider} (${config.llm.ollamaModel})`);
      console.log(`[Server] Cognitive Provider: ${config.cognitive.provider}`);
      console.log('========================================================\n');
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('[Server] Process terminated cleanly.');
        process.exit(0);
      });

      // Force close after 8 seconds
      setTimeout(() => {
        console.error('[Server] Forced shutdown timeout exceeded.');
        process.exit(1);
      }, 8000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[Server] Critical bootstrap failure:', error);
    process.exit(1);
  }
}

bootstrap();
