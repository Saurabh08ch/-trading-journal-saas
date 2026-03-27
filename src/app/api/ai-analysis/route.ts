import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getAITradeAnalysis } from "@/lib/ai-analysis-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const analysis = await getAITradeAnalysis(session.user.id);
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate AI trade analysis right now.",
      },
      { status: 500 },
    );
  }
}
