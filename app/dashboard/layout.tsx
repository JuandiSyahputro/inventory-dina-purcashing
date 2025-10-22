import { getStores } from "@/actions/store-action";
import { AppSidebar } from "@/components/navbar-side/app-sidebar";
import NavBreadcrumb from "@/components/navbar-side/nav-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function LayoutDashboard({ children }: Readonly<{ children: React.ReactNode }>) {
  const dataStores = (await getStores()) || [];

  return (
    <SidebarProvider>
      <AppSidebar dataStores={dataStores ?? []} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <NavBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
