"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  BookOpenText,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Users2,
} from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/trades/new",
    label: "Add Trade",
    icon: PlusCircle,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: FileSpreadsheet,
  },
] as const;

type AppSidebarProps = {
  userName?: string | null;
  userEmail?: string | null;
  showMentorDashboard?: boolean;
};

export function AppSidebar({
  userName,
  userEmail,
  showMentorDashboard = false,
}: AppSidebarProps) {
  const pathname = usePathname();
  const items = showMentorDashboard
    ? [
        ...navItems,
        {
          href: "/mentor/dashboard",
          label: "Mentor",
          icon: Users2,
        },
      ]
    : navItems;

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-slate-950/70 px-6 py-8 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-glow">
            <BookOpenText className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{APP_NAME}</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Trading journal
            </div>
          </div>
        </Link>

        <nav className="mt-10 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : item.href === "/mentor/dashboard"
                  ? pathname === item.href || pathname.startsWith("/mentor/")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto panel p-4">
          <div className="text-sm font-semibold text-white">{userName ?? "Trader"}</div>
          <div className="mt-1 text-xs text-slate-400">{userEmail}</div>
          <button
            type="button"
            className="secondary-button mt-4 w-full gap-2"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl lg:hidden">
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{APP_NAME}</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Journal
              </div>
            </div>
          </Link>
          <button
            type="button"
            className="secondary-button h-10 px-4 text-xs"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
        <div className="section-shell flex gap-2 overflow-x-auto pb-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : item.href === "/mentor/dashboard"
                  ? pathname === item.href || pathname.startsWith("/mentor/")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                  isActive
                    ? "border-accent/40 bg-accent/12 text-white"
                    : "border-white/10 bg-white/5 text-slate-300",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
