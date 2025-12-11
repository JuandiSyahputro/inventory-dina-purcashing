import { Sidebar } from "@/components/ui/sidebar";
import { Role } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export {};
declare global {
  interface NavMainTypes {
    items: {
      title: string;
      url: string;
      icon: LucideIcon;
      isActive?: boolean;
      roles: Role[];
      items?: {
        title: string;
        url: string;
        icon: LucideIcon;
        roles: Role[];
      }[];
    }[];
  }

  interface NavFillterTypes {
    navMain: {
      title: string;
      url: string;
      icon: LucideIcon;
      isActive: boolean;
      roles: Role[];
      items: NavMainTypes["items"];
    }[];
    projects: {
      name: string;
      url: string;
      icon: LucideIcon;
      roles: Role[];
    }[];
  }

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
}
