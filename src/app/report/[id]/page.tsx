import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicReportView } from "@/components/reports/public-report-view";
import { getPublicReportAnalyticsById } from "@/lib/public-report-service";
import { formatCurrency, formatPercent } from "@/lib/utils";

type PublicReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicReportPageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getPublicReportAnalyticsById(id);

  if (!report) {
    return {
      title: "Report Not Found",
      description: "The requested public trading report could not be found.",
    };
  }

  const title = `${report.trader.displayName} - ${report.report.monthLabel} Report`;
  const description = `${formatCurrency(report.summary.monthlyPnL)} over ${report.summary.totalTrades} trades with a ${formatPercent(report.summary.winRate)} win rate in ${report.report.monthLabel}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicReportPage({ params }: PublicReportPageProps) {
  const { id } = await params;
  const report = await getPublicReportAnalyticsById(id);

  if (!report) {
    notFound();
  }

  return (
    <main className="section-shell">
      <PublicReportView report={report} />
    </main>
  );
}
