"use server";

import { PLAN_CONFIG, PlanLevel } from "../constants";
import { connectDB } from "../db/connect";
import Book from "../models/book.model";
import VoiceSession from "../models/voice-session.model";
import { currentUser } from "@clerk/nextjs/server";

export async function startSession(bookId: string) {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    const plan = (user.publicMetadata.plan as PlanLevel) || "free";
    const limitCheck = await checkPlanLimits(user.id, plan);
    if (!limitCheck.allowed) {
      return { success: false, error: limitCheck.message };
    }

    const now = new Date();

    const session = await VoiceSession.create({
      clerkId: user.id,
      bookId,
      startedAt: new Date(),
      billingPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1),
    });
    // revalidatePath("/dashboard");
    return {
      success: true,
      sessionId: session._id.toString(),
      maxDuration: PLAN_CONFIG[plan].maxMinutesPerSession * 60,
    };
  } catch (error) {
    console.error("Failed to start session:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function endSession(sessionId: string) {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    const session = await VoiceSession.findById(sessionId);
    if (!session) throw new Error("Session not found");

    // Safety check: ensure the user owns this session
    if (session.clerkId !== user.id) throw new Error("Forbidden");

    const endedAt = new Date();
    const durationSeconds = Math.floor(
      (endedAt.getTime() - session.startedAt.getTime()) / 1000,
    );

    await VoiceSession.findByIdAndUpdate(sessionId, {
      endedAt,
      durationSeconds,
    });

    // revalidatePath("/dashboard");
    return { success: true, duration: durationSeconds };
  } catch (error) {
    console.error("Failed to end session:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function checkPlanLimits(clerkId: string, plan: PlanLevel) {
  const config = PLAN_CONFIG[plan];

  // 1. Unlimited check
  if (config.maxSessionsPerMonth === Infinity) {
    return { allowed: true };
  }

  const bookCount = await Book.countDocuments({
    clerkId,
  });

  if (bookCount >= config.maxBooks) {
    console.error("Max books reached....");
    return {
      allowed: false,
      message: `Monthly limit reached (${config.maxBooks} books). Please upgrade your plan.`,
    };
  }

  // 2. Aggregate current month's sessions
  const now = new Date();
  const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const sessionCount = await VoiceSession.countDocuments({
    clerkId,
    billingPeriodStart,
  });

  if (sessionCount >= config.maxSessionsPerMonth) {
    console.error("Max session per month crossed.");
    return {
      allowed: false,
      message: `Monthly limit reached (${config.maxSessionsPerMonth} sessions). Please upgrade your plan.`,
    };
  }

  return { allowed: true };
}
