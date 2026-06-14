// ============================================================
// IN-MEMORY STORE — dev/demo
// Replace with Prisma + PostgreSQL for production
// ============================================================
import type { WorkoutLog, UserProfile } from "@/types/fitness";

// Global store survives hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __fitnessStore: {
    logs: WorkoutLog[];
    userProfile: UserProfile;
  } | undefined;
}

if (!global.__fitnessStore) {
  global.__fitnessStore = {
    logs: [],
    userProfile: {
      id: "user-1",
      bodyWeightKg: 0,   // 0 = not set yet
      updatedAt: new Date().toISOString(),
    },
  };
}

export const store = global.__fitnessStore;

// ── helpers ─────────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
