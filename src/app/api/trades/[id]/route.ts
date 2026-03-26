import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeTrade } from "@/lib/trade-service";
import { buildTradeWriteInput } from "@/lib/trade-write-service";
import { deleteUploadByUrl } from "@/lib/uploads";

export const runtime = "nodejs";

type TradeRouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: TradeRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trade = await prisma.trade.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!trade) {
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }

  return NextResponse.json({ trade: serializeTrade(trade) });
}

export async function PUT(request: Request, { params }: TradeRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingTrade = await prisma.trade.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existingTrade) {
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const payload = await buildTradeWriteInput(
      formData,
      session.user.id,
      existingTrade.screenshotUrl,
    );

    if (!payload.success) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    const trade = await prisma.trade.update({
      where: { id: existingTrade.id },
      data: payload.data,
    });

    return NextResponse.json({ trade: serializeTrade(trade) });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update this trade right now.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: TradeRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingTrade = await prisma.trade.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existingTrade) {
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }

  await deleteUploadByUrl(existingTrade.screenshotUrl);
  await prisma.trade.delete({
    where: { id: existingTrade.id },
  });

  return NextResponse.json({ success: true });
}
