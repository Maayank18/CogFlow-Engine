import mongoose from 'mongoose';
import net from 'net';
import { config } from '../../config/index.js';

let isConnected = false;
let isInMemoryMode = false;

async function isMongoPortOpen(host: string, port: number, timeoutMs = 600): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(timeoutMs);

    socket.once('connect', () => {
      isResolved = true;
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.once('error', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.connect(port, host);
  });
}

export async function connectDatabase(): Promise<boolean> {
  if (isConnected) return true;

  try {
    mongoose.set('strictQuery', true);
    console.log(`[Database] Inspecting MongoDB target at ${config.mongodb.uri.replace(/\/\/.*@/, '//***@')}...`);

    // Parse host and port from URI for rapid TCP check
    const isLocalhost = config.mongodb.uri.includes('127.0.0.1') || config.mongodb.uri.includes('localhost');
    const portMatch = config.mongodb.uri.match(/:(\d+)/);
    const port = portMatch ? parseInt(portMatch[1], 10) : 27017;
    const host = isLocalhost ? '127.0.0.1' : 'localhost';

    if (isLocalhost) {
      const portOpen = await isMongoPortOpen(host, port, 800);
      if (!portOpen) {
        if (config.mongodb.useInMemoryFallback) {
          console.log(`[Database] Port ${port} is not listening. Activating CogFlow In-Memory Resilience Store.`);
          isInMemoryMode = true;
          isConnected = true;
          return true;
        } else {
          throw new Error(`MongoDB daemon is not running on ${host}:${port}`);
        }
      }
    }

    // Connect to actual MongoDB instance
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    } as any);

    isConnected = true;
    isInMemoryMode = false;
    console.log('[Database] MongoDB connected successfully.');

    mongoose.connection.on('error', (err: any) => {
      console.error('[Database] Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] Disconnected from MongoDB.');
      isConnected = false;
    });

    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed: ${(error as Error).message}`);
    
    if (config.mongodb.useInMemoryFallback) {
      console.log('[Database] Activating CogFlow In-Memory Resilience Store.');
      isInMemoryMode = true;
      isConnected = true;
      return true;
    } else {
      console.error('[Database] In-memory fallback is disabled. Halting with error.');
      throw error;
    }
  }
}

export function getDatabaseStatus(): { isConnected: boolean; isInMemoryMode: boolean } {
  return {
    isConnected: isConnected || mongoose.connection.readyState === 1,
    isInMemoryMode,
  };
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  isConnected = false;
  isInMemoryMode = false;
  console.log('[Database] Disconnected.');
}
