// ============================================================
// API: /api/workout-logs
// GET  → list all logs
// POST → create a new log entry
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { store, generateId } from "@/lib/store";
import type { LogWorkoutPayload, ApiResponse, WorkoutLog } from "@/types/fitness";

export async function GET() {
  const sorted = [...store.logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return NextResponse.json<ApiResponse<WorkoutLog[]>>({
    success: true,
    data: sorted,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LogWorkoutPayload;

    // Basic validation
    if (!body.dayId || body.bodyWeightKg <= 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, message: "dayId and bodyWeightKg are required" },
        { status: 400 }
      );
    }

    const log: WorkoutLog = {
      id: generateId(),
      userId: "user-1",
      dayId: body.dayId,
      dayType: body.dayType,
      date: new Date().toISOString(),
      bodyWeightKg: body.bodyWeightKg,
      durationMin: body.durationMin,
      sets: body.sets,
      rpe: body.rpe,
      caloriesBurned: body.caloriesBurned,
      notes: body.notes,
      createdAt: new Date().toISOString(),
    };

    store.logs.unshift(log);

    return NextResponse.json<ApiResponse<WorkoutLog>>(
      { success: true, data: log, message: "Workout logged successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
