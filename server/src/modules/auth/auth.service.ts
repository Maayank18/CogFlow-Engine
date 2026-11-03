import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';
import { UserModel, UserPreferencesModel } from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';

export class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;
    const normalizedEmail = email.toLowerCase().trim();
    const { isInMemoryMode } = getDatabaseStatus();

    // Check if user already exists
    if (isInMemoryMode) {
      const existing = inMemoryStore.users.findOne({ email: normalizedEmail });
      if (existing) {
        throw new Error('An account with this email already exists.');
      }
    } else {
      const existing = await UserModel.findOne({ email: normalizedEmail });
      if (existing) {
        throw new Error('An account with this email already exists.');
      }
    }

    // Hash password securely with 12 salt rounds
    const passwordHash = await bcrypt.hash(password, 12);

    let user: any;
    if (isInMemoryMode) {
      user = inMemoryStore.users.create({
        name,
        email: normalizedEmail,
        passwordHash,
        role: 'learner',
      });

      inMemoryStore.userPreferences.create({
        userId: user.id,
        theme: 'system',
        defaultTier: 'A',
        preferredMode: 'learn',
        cameraMonitoringConsent: false,
        behavioralTelemetryConsent: true,
        soundEffects: true,
        reducedMotion: false,
        academicLevel: 'intermediate',
        primaryInterests: [],
      });
    } else {
      user = await UserModel.create({
        name,
        email: normalizedEmail,
        passwordHash,
        role: 'learner',
      });

      await UserPreferencesModel.create({
        userId: user._id,
        theme: 'system',
        defaultTier: 'A',
        preferredMode: 'learn',
        cameraMonitoringConsent: false,
        behavioralTelemetryConsent: true,
        soundEffects: true,
        reducedMotion: false,
        academicLevel: 'intermediate',
        primaryInterests: [],
      });
    }

    const userId = (user.id || user._id).toString();
    const token = this.generateToken({ userId, email: normalizedEmail, role: user.role });

    return {
      user: {
        id: userId,
        email: normalizedEmail,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    const { email, password } = data;
    const normalizedEmail = email.toLowerCase().trim();
    const { isInMemoryMode } = getDatabaseStatus();

    let user: any;
    if (isInMemoryMode) {
      user = inMemoryStore.users.findOne({ email: normalizedEmail });
    } else {
      user = await UserModel.findOne({ email: normalizedEmail }).select('+passwordHash');
    }

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const userId = (user.id || user._id).toString();
    const token = this.generateToken({ userId, email: normalizedEmail, role: user.role });

    return {
      user: {
        id: userId,
        email: normalizedEmail,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();
    let user: any;
    let preferences: any;

    if (isInMemoryMode) {
      user = inMemoryStore.users.findById(userId);
      preferences = inMemoryStore.userPreferences.findOne({ userId });
    } else {
      user = await UserModel.findById(userId);
      preferences = await UserPreferencesModel.findOne({ userId });
    }

    if (!user) {
      throw new Error('User not found.');
    }

    return {
      user: {
        id: (user.id || user._id).toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      preferences: preferences || {
        theme: 'system',
        defaultTier: 'A',
        preferredMode: 'learn',
        cameraMonitoringConsent: false,
        behavioralTelemetryConsent: true,
      },
    };
  }

  async forgotPassword(email: string): Promise<string> {
    const normalizedEmail = email.toLowerCase().trim();
    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    // In production this sends an email with the token
    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    // In dev simulation, any valid token resets successfully
    return true;
  }

  private generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, config.security.jwtSecret, {
      expiresIn: config.security.jwtExpiresIn as any,
    });
  }
}

export const authService = new AuthService();
