// ============================================================
// API: /api/user-weight
// GET   → get current stored weight
// PATCH → update user weight
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { ApiResponse, UserProfile } from "@/types/fitness";

export async function GET() {
  return NextResponse.json<ApiResponse<UserProfile>>({
    success: true,
    data: store.userProfile,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as { bodyWeightKg: number };

    if (!body.bodyWeightKg || body.bodyWeightKg < 30 || body.bodyWeightKg > 250) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, message: "Weight must be between 30–250 kg" },
        { status: 400 }
      );
    }

    store.userProfile.bodyWeightKg = body.bodyWeightKg;
    store.userProfile.updatedAt = new Date().toISOString();

    return NextResponse.json<ApiResponse<UserProfile>>({
      success: true,
      data: store.userProfile,
      message: "Weight updated",
    });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "Invalid request" },
      { status: 400 }
    );
  }
}
