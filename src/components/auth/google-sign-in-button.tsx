"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { Chrome } from "lucide-react";

type GoogleSignInButtonProps = {
  callbackUrl?: string;
  className?: string;
};

export function GoogleSignInButton({
  callbackUrl = "/dashboard",
  className,
}: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={`secondary-button w-full gap-3 ${className ?? ""}`}
      onClick={() =>
        startTransition(() => {
          void signIn("google", { callbackUrl });
        })
      }
      disabled={isPending}
    >
      <Chrome className="h-4 w-4" />
      {isPending ? "Connecting..." : "Continue with Google"}
    </button>
  );
}
