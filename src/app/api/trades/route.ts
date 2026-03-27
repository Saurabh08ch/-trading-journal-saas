import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listTradesForUser, serializeTrade } from "@/lib/trade-service";
import { buildTradeWriteInput } from "@/lib/trade-write-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trades = await listTradesForUser(session.user.id);
  return NextResponse.json({ trades });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const payload = await buildTradeWriteInput(formData, session.user.id);

    if (!payload.success) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    const trade = await prisma.trade.create({
      data: {
        ...payload.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ trade: serializeTrade(trade) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create this trade right now.",
      },
      { status: 500 },
    );
  }
}
