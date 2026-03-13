import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return (
  //   <SidebarProvider>
  //     <div className="min-h-screen flex w-full bg-background">
  //       <DashboardSidebar />
  //       <div className="flex-1 flex flex-col min-w-0">
  //         <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 shrink-0">
  //           <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
  //           <div className="flex items-center gap-3">
  //             <UserButton />
  //           </div>
  //         </header>
  //         <main className="flex-1 overflow-auto p-6">{children}</main>
  //       </div>
  //     </div>
  //   </SidebarProvider>
  // );

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <DashboardHeader />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
