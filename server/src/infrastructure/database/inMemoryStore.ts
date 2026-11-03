/**
 * CogFlow In-Memory Resilience Document Store
 * Provides transparent zero-configuration local persistence when MongoDB is unavailable.
 */

export interface InMemoryCollection<T extends { id?: string; _id?: string }> {
  items: T[];
  find(filter?: Partial<T> | ((item: T) => boolean)): T[];
  findOne(filter: Partial<T> | ((item: T) => boolean)): T | null;
  findById(id: string): T | null;
  create(data: Omit<T, 'id' | '_id' | 'createdAt' | 'updatedAt'>): T;
  findByIdAndUpdate(id: string, update: Partial<T>): T | null;
  deleteOne(id: string): boolean;
  clear(): void;
}

class CollectionImpl<T extends { id?: string; _id?: string }> implements InMemoryCollection<T> {
  public items: T[] = [];

  find(filter?: Partial<T> | ((item: T) => boolean)): T[] {
    if (!filter) return [...this.items];
    if (typeof filter === 'function') {
      return this.items.filter(filter);
    }
    return this.items.filter((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if ((item as Record<string, unknown>)[key] !== val) return false;
      }
      return true;
    });
  }

  findOne(filter: Partial<T> | ((item: T) => boolean)): T | null {
    const results = this.find(filter);
    return results.length > 0 ? results[0] : null;
  }

  findById(id: string): T | null {
    return this.items.find((item) => (item.id || item._id) === id) || null;
  }

  create(data: Record<string, unknown>): T {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const now = new Date();
    const item = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    } as unknown as T;
    this.items.push(item);
    return item;
  }

  findByIdAndUpdate(id: string, update: Partial<T>): T | null {
    const item = this.findById(id);
    if (!item) return null;
    Object.assign(item, update, { updatedAt: new Date() });
    return item;
  }

  deleteOne(id: string): boolean {
    const index = this.items.findIndex((item) => (item.id || item._id) === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  clear(): void {
    this.items = [];
  }
}

export const inMemoryStore = {
  users: new CollectionImpl<any>(),
  userPreferences: new CollectionImpl<any>(),
  subjects: new CollectionImpl<any>(),
  topics: new CollectionImpl<any>(),
  lessons: new CollectionImpl<any>(),
  learningSessions: new CollectionImpl<any>(),
  topicProgress: new CollectionImpl<any>(),
  assessments: new CollectionImpl<any>(),
  assessmentAttempts: new CollectionImpl<any>(),
  learningNotes: new CollectionImpl<any>(),
  uploadedDocuments: new CollectionImpl<any>(),
  cognitiveEvents: new CollectionImpl<any>(),
  adaptationEvents: new CollectionImpl<any>(),
};

