import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Camera,
  CandlestickChart,
  Check,
  IndianRupee,
  LineChart,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const featureCards = [
  {
    title: "Track every trade",
    copy: "Capture entry, exit, risk, size, notes, screenshots, and emotional state in one clean workflow.",
    icon: CandlestickChart,
  },
  {
    title: "Automatic PnL analytics",
    copy: "PnL, reward-to-risk, win rate, monthly summaries, and average RR update automatically after each entry.",
    icon: LineChart,
  },
  {
    title: "Strategy performance insights",
    copy: "See which setups actually create expectancy and which ones quietly erode your edge.",
    icon: BrainCircuit,
  },
  {
    title: "Screenshot storage",
    copy: "Attach chart screenshots to review execution quality and context before, during, and after each trade.",
    icon: Camera,
  },
] as const;

const pricingPlans = [
  {
    name: "Free Plan",
    price: "₹0",
    description: "For traders starting their review process.",
    features: ["Up to 50 trades", "Dashboard metrics", "Basic trade history"],
  },
  {
    name: "Pro Plan",
    price: "₹499/month",
    description: "For serious traders who review every edge.",
    features: [
      "Unlimited trades",
      "Full analytics suite",
      "Screenshot storage",
      "Emotional pattern tracking",
    ],
  },
] as const;

export default async function HomePage() {
  const user = await getCurrentUser();
  const primaryHref = user?.id ? "/dashboard" : "/login";
  const primaryLabel = user?.id ? "Open dashboard" : "Start journaling";

  return (
    <div className="pb-20">
      <header className="section-shell flex items-center justify-between py-6">
        <div>
          <div className="text-xl font-semibold text-white">TradePilot</div>
          <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
            Trading journal SaaS
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#pricing" className="secondary-button hidden sm:inline-flex">
            Pricing
          </Link>
          <Link href={primaryHref} className="primary-button">
            {primaryLabel}
          </Link>
        </div>
      </header>

      <main className="space-y-20">
        <section className="section-shell pt-8">
          <div className="panel relative overflow-hidden px-6 py-14 md:px-10 md:py-16">
            <div className="absolute inset-0 bg-hero-grid bg-[length:72px_72px] opacity-20" />
            <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
              <div>
                <span className="eyebrow">Built for disciplined review</span>
                <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
                  The Smart Trading Journal for Serious Traders
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  A modern dark-mode trading journal that captures execution, emotions, and
                  screenshots while turning every trade into actionable analytics.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href={primaryHref} className="primary-button gap-2">
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="#features" className="secondary-button">
                    Explore features
                  </Link>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl font-semibold text-white">PnL</div>
                    <div className="mt-2 text-sm text-slate-400">Auto-calculated on every trade</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl font-semibold text-white">RR</div>
                    <div className="mt-2 text-sm text-slate-400">Reward-to-risk tracked by default</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl font-semibold text-white">Emotion</div>
                    <div className="mt-2 text-sm text-slate-400">Fear, FOMO, revenge, confidence</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="panel-strong animate-float p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Monthly profit</div>
                      <div className="mt-2 text-3xl font-semibold text-white">₹84,350</div>
                    </div>
                    <div className="rounded-2xl bg-accent/15 p-3 text-accent">
                      <IndianRupee className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[72, 88, 64, 96, 82, 108].map((height, index) => (
                      <div key={height} className="flex items-center gap-3">
                        <div className="w-12 text-xs text-slate-500">
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}
                        </div>
                        <div className="h-2 flex-1 rounded-full bg-white/5">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-accent to-gold"
                            style={{ width: `${height}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-slate-400">Win rate</div>
                      <div className="mt-2 text-2xl font-semibold text-white">61.2%</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-slate-400">Avg RR</div>
                      <div className="mt-2 text-2xl font-semibold text-white">2.14</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 hidden rounded-3xl border border-white/10 bg-slate-950/85 p-4 shadow-card md:block">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Emotion tag</div>
                  <div className="mt-2 text-lg font-semibold text-white">Discipline</div>
                  <div className="mt-1 text-sm text-slate-400">Most common on winning days</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section-shell">
          <div className="mb-10">
            <span className="eyebrow">Features</span>
            <h2 className="mt-4 page-title">Everything needed for a serious review process</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="panel p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{card.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section-shell">
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="mt-4 page-title">From raw execution to repeatable edge</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Log the trade",
                  copy: "Capture setup, pricing, stop, risk, notes, and chart screenshot in under a minute.",
                },
                {
                  title: "Tag the emotion",
                  copy: "Mark fear, FOMO, revenge trading, confidence, or discipline on every trade.",
                },
                {
                  title: "Review the analytics",
                  copy: "See monthly PnL, strategy performance, win rate, and emotional tendencies in one view.",
                },
              ].map((step, index) => (
                <div key={step.title} className="panel p-6">
                  <div className="text-sm font-semibold text-accent">0{index + 1}</div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="panel overflow-hidden p-6 md:p-8">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-center">
              <div>
                <span className="eyebrow">Dashboard preview</span>
                <h2 className="mt-4 page-title">A clean modern dark UI built like a real SaaS tool</h2>
                <p className="mt-4 page-copy">
                  The dashboard combines summary metrics, performance charts, strategy insights,
                  and trade history in a layout designed for daily review.
                </p>

                <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80">
                  <div className="grid gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-4 md:grid-cols-4">
                    {[
                      ["Total Profit", "₹84,350"],
                      ["Win Rate", "61.2%"],
                      ["Avg RR", "2.14"],
                      ["Trades", "142"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
                        <div className="mt-2 text-xl font-semibold text-white">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 px-5 py-6 xl:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <div className="flex items-end gap-3">
                        {[54, 62, 48, 78, 64, 92, 86].map((height) => (
                          <div key={height} className="flex-1 rounded-full bg-white/5 p-1">
                            <div
                              className="w-full rounded-full bg-gradient-to-t from-accent to-gold"
                              style={{ height: `${height}px` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        ["ORB + pullback", "₹21,450"],
                        ["VWAP reclaim", "₹13,800"],
                        ["Gap fade", "₹9,320"],
                      ].map(([strategy, pnl]) => (
                        <div
                          key={strategy}
                          className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4"
                        >
                          <div className="text-sm text-slate-400">{strategy}</div>
                          <div className="mt-2 text-lg font-semibold text-white">{pnl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Private dashboards for each trader",
                  "Google OAuth onboarding",
                  "Editable trade history",
                  "PostgreSQL-backed analytics",
                ].map((item) => (
                  <div key={item} className="panel-strong flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                      <Check className="h-5 w-5" />
                    </div>
                    <span className="text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section-shell">
          <div className="mb-10">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 page-title">Simple plans for disciplined traders</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`panel p-6 ${index === 1 ? "ring-1 ring-accent/30" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{plan.description}</p>
                  </div>
                  {index === 1 ? (
                    <div className="rounded-full border border-accent/30 bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Popular
                    </div>
                  ) : null}
                </div>
                <div className="mt-8 text-4xl font-semibold text-white">{plan.price}</div>
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                      <Check className="h-4 w-4 text-accent" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link href={primaryHref} className="primary-button mt-8 w-full justify-center">
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <div className="panel overflow-hidden bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-accent/10 px-6 py-12 text-center md:px-10">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Journal every trade like it matters, because it does.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Build the review habit, find the strategies that scale, and identify the emotions
              that damage execution.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={primaryHref} className="primary-button gap-2">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="secondary-button">
                Sign in with Google
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
