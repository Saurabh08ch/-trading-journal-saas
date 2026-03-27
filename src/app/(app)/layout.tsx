import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import { getCurrentUser } from "@/lib/auth";
import { hasMentorStudents } from "@/lib/mentor-service";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const showMentorDashboard = await hasMentorStudents(user.id);

  return (
    <div className="min-h-screen">
      <AppSidebar
        userName={user.name}
        userEmail={user.email}
        showMentorDashboard={showMentorDashboard}
      />
      <main className="lg:pl-72">
        <div className="section-shell py-6 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
