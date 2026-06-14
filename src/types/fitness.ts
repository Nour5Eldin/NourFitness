// ============================================================
// TYPES — Nour Fitness
// Central source of truth for all fitness data shapes
// ============================================================

export type DayType =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "cardio"
  | "rest"
  | "optional";

export type PhaseType = "warmup" | "main" | "cooldown" | "cardio" | "stretch";

export interface ExerciseName {
  ar: string; // Arabic
  en: string; // English
}

export interface Exercise {
  id: string;
  name: ExerciseName;
  focus: string;         // Arabic note
  sets: string;          // e.g. "3 × 10–12"
  muscleGroup?: string;  // primary muscle group
}

export interface Phase {
  type: PhaseType;
  labelAr: string;
  labelEn: string;
  durationMin: number;
  exercises: Exercise[];
}

export interface TimeSegment {
  labelAr: string;
  labelEn: string;
  min: number;
  color: string;
}

/** Scientific MET-based calorie formula:
 *  calories = (MET × bodyWeight_kg × duration_min) / 60
 *  EPOC = base_calories × epocFactor
 */
export interface MetabolicsConfig {
  met: number;       // MET value for activity type
  epocFactor: number; // Post-exercise oxygen consumption % (0–1)
}

export interface DayColors {
  accent: string;     // main brand color
  badgeBg: string;
  badgeText: string;
}

export interface TrainingDay {
  id: string;           // e.g. "sat-push"
  dayIndex: number;     // 0=Sat … 6=Fri
  nameAr: string;       // "السبت"
  nameEn: string;       // "Saturday" / short "Sat"
  type: DayType;
  labelAr: string;      // "Push — صدر / كتف / ترايسبس"
  labelEn: string;      // "Push — Chest / Shoulder / Triceps"
  subAr: string;
  subEn: string;
  totalSets: number;
  durationMin: number;
  rpe: number;          // Rate of Perceived Exertion 0–10
  metabolics: MetabolicsConfig;
  timeSegments: TimeSegment[];
  phases: Phase[];
  tipAr: string;
  tipEn: string;
  colors: DayColors;
}

// ============================================================
// BACKEND / API TYPES
// ============================================================

export interface WorkoutLog {
  id: string;
  userId: string;
  dayId: string;         // references TrainingDay.id
  dayType: DayType;
  date: string;          // ISO string
  bodyWeightKg: number;
  durationMin: number;
  sets: number;
  rpe: number;
  caloriesBurned: number;
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  bodyWeightKg: number;
  updatedAt: string;
}

// API response shapes
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LogWorkoutPayload {
  dayId: string;
  dayType: DayType;
  bodyWeightKg: number;
  durationMin: number;
  sets: number;
  rpe: number;
  caloriesBurned: number;
  notes?: string;
}
