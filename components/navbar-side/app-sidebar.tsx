"use client";

import { AudioWaveform, BookOpen, Command, Map, PackageSearch, PieChart, Settings2, Store, UsersRound } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/navbar-side/nav-main";
import { NavProjects } from "@/components/navbar-side/nav-projects";
import { NavUser } from "@/components/navbar-side/nav-user";
import { TeamSwitcher } from "@/components/navbar-side/store-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { Role, Users } from "@prisma/client";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  dataStores: {
    name: string;
    id: string;
  }[];
  user: {
    name: string;
    email: string;
    role: Role;
  };
}
// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Store,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Product",
      url: "#",
      icon: PackageSearch,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/product/overview",
        },
        {
          title: "Categories",
          url: "/dashboard/product/categories",
        },
        {
          title: "Units of Measure",
          url: "/dashboard/product/units",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Users",
      url: "/dashboard/users",
      icon: UsersRound,
    },
  ],
};

export function AppSidebar({ dataStores, user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher stores={dataStores} user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
