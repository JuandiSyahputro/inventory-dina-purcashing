"use client";

import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PackageSearch, PieChart, Settings2, Store } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/navbar-side/nav-main";
import { NavProjects } from "@/components/navbar-side/nav-projects";
import { NavUser } from "@/components/navbar-side/nav-user";
import { TeamSwitcher } from "@/components/navbar-side/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  dataStores: {
    name: string;
    id: string;
  }[];
}
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Store",
      url: "#",
      icon: Store,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Store",
      url: "/dashboard/store",
      icon: Store,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ dataStores, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher stores={dataStores} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
