"use client";

import { NavMain } from "@/components/navbar-side/nav-main";
import { NavProjects } from "@/components/navbar-side/nav-projects";
import { NavUser } from "@/components/navbar-side/nav-user";
import StoreSwitcher from "@/components/navbar-side/store-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { dataSideBar } from "@/lib/data-dummy";
import { filterSidebarByRole } from "@/lib/utils";
import { memo, useMemo } from "react";

export const AppSidebar = memo(function ({ dataStores, user, ...props }: AppSidebarProps) {
  const filteredMenu = useMemo(() => filterSidebarByRole(dataSideBar, user.role), [user.role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <StoreSwitcher stores={dataStores} user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMenu.navMain} />
        <NavProjects projects={filteredMenu.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AppSidebar.displayName = "AppSidebar";
