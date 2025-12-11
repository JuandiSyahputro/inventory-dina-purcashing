import { Role } from "@prisma/client";
import { ArrowDownCircle, ArrowUpCircle, Boxes, FileText, Handshake, Layers, Package, RefreshCcw, Ruler, ShoppingCart, UsersRound } from "lucide-react";

export const dataSideBar = {
  navMain: [
    {
      title: "Product",
      url: "#",
      icon: Boxes,
      isActive: false,
      roles: ["SUPERADMIN", "USER"] as Role[],
      items: [
        {
          title: "Overview",
          url: "/dashboard/product/overview",
          icon: Package,
          roles: ["SUPERADMIN", "USER"] as Role[],
        },
        {
          title: "Categories",
          url: "/dashboard/product/categories",
          icon: Layers,
          roles: ["SUPERADMIN"] as Role[],
        },
        {
          title: "Units of Measure",
          url: "/dashboard/product/units",
          icon: Ruler,
          roles: ["SUPERADMIN"] as Role[],
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: RefreshCcw,
      isActive: false,
      roles: ["SUPERADMIN", "USER"] as Role[],
      items: [
        {
          title: "Inbound",
          url: "/dashboard/operations/inbound",
          icon: ArrowDownCircle,
          roles: ["SUPERADMIN", "USER"] as Role[],
        },
        {
          title: "Outbound",
          url: "/dashboard/operations/outbound",
          icon: ArrowUpCircle,
          roles: ["SUPERADMIN", "USER"] as Role[],
        },
      ],
    },
    {
      title: "Purchasing",
      url: "#",
      icon: ShoppingCart,
      isActive: false,
      roles: ["SUPERADMIN", "USER"] as Role[],
      items: [
        {
          title: "Orders",
          url: "/dashboard/purchasing/po",
          icon: FileText,
          roles: ["SUPERADMIN", "USER"] as Role[],
        },
        {
          title: "Vendor",
          url: "/dashboard/purchasing/vendor",
          icon: Handshake,
          roles: ["SUPERADMIN"] as Role[],
        },
      ],
    },
  ],
  projects: [
    {
      name: "Users",
      url: "/dashboard/users",
      icon: UsersRound,
      roles: ["SUPERADMIN"] as Role[],
    },
  ],
};
