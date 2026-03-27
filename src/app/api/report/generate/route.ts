import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createOrGetCurrentMonthPublicReport } from "@/lib/public-report-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await createOrGetCurrentMonthPublicReport(session.user.id);

    return NextResponse.json({
      report: {
        id: report.id,
        month: report.month,
      },
      publicPath: `/report/${report.id}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate a shareable report right now.",
      },
      { status: 400 },
    );
  }
}
