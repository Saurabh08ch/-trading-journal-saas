import { redirect } from "next/navigation";

import { TradeForm } from "@/components/trades/trade-form";
import { getCurrentUser } from "@/lib/auth";

export default async function AddTradePage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  return <TradeForm mode="create" />;
}
