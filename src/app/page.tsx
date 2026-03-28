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
  // ✅ Get the current logged-in user (server-side)
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
        {/* Hero section */}
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
              </div>

              {/* Dashboard preview mock */}
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
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
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

        {/* Pricing section */}
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
                  {index === 1 && (
                    <div className="rounded-full border border-accent/30 bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Popular
                    </div>
                  )}
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
      </main>
    </div>
  );
}