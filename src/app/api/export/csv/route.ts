import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { buildTradesCsv } from "@/lib/exports/trades-csv";
import { listTradesForUser } from "@/lib/trade-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trades = await listTradesForUser(session.user.id);

  // Keep CSV generation on the server so the download always reflects the
  // authenticated user's journal data and never exposes another user's trades.
  const csv = buildTradesCsv(trades);

  return new Response(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="trades.csv"',
      "Cache-Control": "no-store",
    },
  });
}
