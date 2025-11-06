import { Sidebar } from "@/components/ui/sidebar";
import { Role } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export {};
declare global {
  interface NavMainTypes {
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
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
