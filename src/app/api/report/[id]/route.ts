import { NextResponse } from "next/server";

import { getPublicReportAnalyticsById } from "@/lib/public-report-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReportRouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: ReportRouteContext) {
  const report = await getPublicReportAnalyticsById(params.id);

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json(report);
}
