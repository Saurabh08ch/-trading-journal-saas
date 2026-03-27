import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BrainCircuit,
  CandlestickChart,
  ShieldCheck,
} from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { getCurrentUser, isGoogleOAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="section-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="panel overflow-hidden p-8 md:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400">
            <ArrowLeft className="h-4 w-4" />
            Back to landing page
          </Link>

          <div className="mt-8 max-w-2xl">
            <span className="eyebrow">Google authentication</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Your private trading review desk starts here.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Sign in with Google to access a private dashboard for logging trades, tracking
              emotional patterns, and reviewing strategy performance.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Private dashboard",
                copy: "Every trader gets a protected personal workspace.",
                icon: ShieldCheck,
              },
              {
                title: "Automatic analytics",
                copy: "PnL, RR, and win rate update instantly.",
                icon: CandlestickChart,
              },
              {
                title: "Behavioral review",
                copy: "Emotion tags highlight recurring execution patterns.",
                icon: BrainCircuit,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel-strong p-8 md:p-10">
          <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Welcome back</div>
          <h2 className="mt-4 text-3xl font-semibold text-white">Continue with Google</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Secure OAuth login keeps onboarding simple and your journal private.
          </p>

          <div className="mt-8">
            <GoogleSignInButton disabled={!isGoogleOAuthConfigured} />
          </div>

          {!isGoogleOAuthConfigured ? (
            <div className="mt-4 rounded-[24px] border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  Google OAuth is not configured yet. Add `GOOGLE_CLIENT_ID` and
                  `GOOGLE_CLIENT_SECRET` to `.env`, then restart the dev server.
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Included after sign-in</div>
            <div className="mt-4 space-y-3">
              {[
                "Private trade dashboard",
                "Trade history with edit/delete",
                "Monthly and strategy analytics",
                "Screenshot-backed journaling",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
