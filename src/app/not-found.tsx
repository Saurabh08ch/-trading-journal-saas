import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-10">
      <div className="panel max-w-xl p-10 text-center">
        <div className="text-sm uppercase tracking-[0.24em] text-slate-500">404</div>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          The page you requested does not exist or may require a different route.
        </p>
        <Link href="/" className="primary-button mt-8">
          Return home
        </Link>
      </div>
    </div>
  );
}
