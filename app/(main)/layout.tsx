import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { HeaderMain } from "@/components/layout/header-main";
import { FinanceDataProvider } from "@/context/FinanceDataContext"; // Ensure this path is correct
import { ThemeProvider } from "@/context/ThemeContext";

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
    <ThemeProvider>
      {/* FinanceDataProvider must wrap SidebarProvider to allow Sidebar to access financial data (e.g. XP/Level) */}
      <FinanceDataProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar user={session.user} />
            <SidebarRail />
            <SidebarInset>
              <HeaderMain user={session.user} />
              <main className="flex-1 p-4 sm:px-6 sm:py-0 mt-4">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </FinanceDataProvider>
    </ThemeProvider>
  );
}