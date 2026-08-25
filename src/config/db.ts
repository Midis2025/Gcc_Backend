import mongoose from 'mongoose';
import { env } from './env';

export class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {
    // Register global Mongoose connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ [Database] Database is connected successfully!');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ [Database] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [Database] MongoDB disconnected.');
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<typeof mongoose | void> {
    if (this.isConnected || mongoose.connection.readyState >= 1) {
      this.isConnected = true;
      return;
    }

    try {
      console.log('⏳ [Database] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(env.DATABASE_URL);
      this.isConnected = true;
      console.log(`✅ [Database] Database is connected successfully to host: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error('❌ [Database] Failed to connect to database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('🔌 [Database] Database connection closed.');
  }
}

export const db = Database.getInstance();
