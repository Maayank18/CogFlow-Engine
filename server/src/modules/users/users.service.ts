import { UserModel, UserPreferencesModel } from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';

export class UsersService {
  async getPreferences(userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();
    if (isInMemoryMode) {
      let pref = inMemoryStore.userPreferences.findOne({ userId });
      if (!pref) {
        pref = inMemoryStore.userPreferences.create({
          userId,
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
      return pref;
    }

    let pref = await UserPreferencesModel.findOne({ userId });
    if (!pref) {
      pref = await UserPreferencesModel.create({
        userId,
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
    return pref;
  }

  async updatePreferences(userId: string, data: Record<string, unknown>) {
    const { isInMemoryMode } = getDatabaseStatus();
    if (isInMemoryMode) {
      const existing = inMemoryStore.userPreferences.findOne({ userId });
      if (existing) {
        return inMemoryStore.userPreferences.findByIdAndUpdate(existing.id, data);
      }
      return inMemoryStore.userPreferences.create({ userId, ...data });
    }

    const updated = await UserPreferencesModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    );
    return updated;
  }

  async updateProfile(userId: string, data: { name?: string }) {
    const { isInMemoryMode } = getDatabaseStatus();
    if (isInMemoryMode) {
      return inMemoryStore.users.findByIdAndUpdate(userId, data);
    }
    return UserModel.findByIdAndUpdate(userId, { $set: data }, { new: true });
  }
}

export const usersService = new UsersService();

