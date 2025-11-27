// app/(main)/layout.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar"; // MODIFICATION: Import SidebarRail
import { Sidebar } from "@/components/layout/sidebar";
import { HeaderMain } from "@/components/layout/header-main";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    // MODIFICATION: Added collapsible="icon" to enable the interactive collapse feature
    <SidebarProvider collapsible="icon"> 
      <div className="flex min-h-screen w-full"> {/* MODIFICATION: Added w-full */}
        <Sidebar user={session.user} />
        <SidebarRail /> {/* MODIFICATION: Added the rail component */}
        <SidebarInset>
          <HeaderMain user={session.user} />
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}