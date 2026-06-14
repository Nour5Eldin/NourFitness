// ============================================================
// CALORIE CALCULATIONS — Scientific formulas
// ============================================================

/**
 * MET-based calorie formula
 * calories = (MET × bodyWeight_kg × duration_min) / 60
 */
export function calcDirectCalories(
  met: number,
  bodyWeightKg: number,
  durationMin: number
): number {
  if (bodyWeightKg <= 0 || durationMin <= 0) return 0;
  return Math.round((met * bodyWeightKg * durationMin) / 60);
}

/**
 * EPOC = Excess Post-Exercise Oxygen Consumption
 * Estimated as a percentage of direct burn
 */
export function calcEpoc(directCalories: number, epocFactor: number): number {
  return Math.round(directCalories * epocFactor);
}

export function calcTotalCalories(
  met: number,
  bodyWeightKg: number,
  durationMin: number,
  epocFactor: number
): { direct: number; epoc: number; total: number } {
  const direct = calcDirectCalories(met, bodyWeightKg, durationMin);
  const epoc = calcEpoc(direct, epocFactor);
  return { direct, epoc, total: direct + epoc };
}

/**
 * Fat loss estimate
 * 1 gram of fat ≈ 7.7 kcal
 */
export function calcFatLossGrams(totalCalories: number): number {
  return Math.round((totalCalories / 7700) * 1000);
}

/**
 * TDEE-based maintenance estimate
 * Simple: weight × 30 (sedentary-moderate)
 * More accurate: use Harris-Benedict or Mifflin-St Jeor
 */
export function calcMaintenanceCalories(bodyWeightKg: number): number {
  return Math.round(bodyWeightKg * 30);
}
