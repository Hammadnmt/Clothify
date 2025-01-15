import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import AppSidebar from "@/components/admin/AppSidebar";
import DevelopmentBanner from "@/components/DevelopmentBanner";

export default function AdminLayout() {
  return (
    <>
      {/* <DevelopmentBanner /> */}
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-slate-100">
          <SidebarTrigger />
          <div className="py-4 px-4">
            <Outlet />
          </div>
        </main>
        <Toaster />
      </SidebarProvider>
    </>
  );
}
