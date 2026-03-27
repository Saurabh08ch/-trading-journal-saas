import { notFound, redirect } from "next/navigation";

import { TradeForm } from "@/components/trades/trade-form";
import { getCurrentUser } from "@/lib/auth";
import { getTradeForUser } from "@/lib/trade-service";

type EditTradePageProps = {
  params: {
    id: string;
  };
};

export default async function EditTradePage({ params }: EditTradePageProps) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const trade = await getTradeForUser(user.id, params.id);

  if (!trade) {
    notFound();
  }

  return <TradeForm mode="edit" trade={trade} />;
}
