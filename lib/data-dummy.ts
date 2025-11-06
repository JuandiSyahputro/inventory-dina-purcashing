import { AudioWaveform, Command, Handshake, PackageSearch, Store, UsersRound } from "lucide-react";

export const dataSideBar = {
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
    {
      title: "Vendor",
      url: "/dashboard/vendor",
      icon: Handshake,
      isActive: false,
      items: [],
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
