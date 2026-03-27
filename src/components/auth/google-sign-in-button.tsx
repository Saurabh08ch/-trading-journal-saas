"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { Chrome } from "lucide-react";

type GoogleSignInButtonProps = {
  callbackUrl?: string;
  className?: string;
  disabled?: boolean;
};

export function GoogleSignInButton({
  callbackUrl = "/dashboard",
  className,
  disabled = false,
}: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();
  const isDisabled = disabled || isPending;

  return (
    <button
      type="button"
      className={`secondary-button w-full gap-3 ${isDisabled ? "cursor-not-allowed opacity-60" : ""} ${className ?? ""}`}
      onClick={() =>
        startTransition(() => {
          void signIn("google", { callbackUrl });
        })
      }
      disabled={isDisabled}
    >
      <Chrome className="h-4 w-4" />
      {disabled ? "Google OAuth not configured" : isPending ? "Connecting..." : "Continue with Google"}
    </button>
  );
}
