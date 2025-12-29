"use client";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({ items }: NavMainTypes) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;

          if (!hasSubItems) return <RenderNotCollapse items={item.items} key={item.title} title={item.title} url={item.url} isActive={item.isActive} icon={item.icon} roles={[]} />;

          return <RenderCollapse items={item.items} key={item.title} title={item.title} url={item.url} icon={item.icon} isActive={item.isActive} roles={[]} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const RenderNotCollapse = (item: NavMainTypes["items"][number]) => {
  const pathname = usePathname();
  const splitPath = pathname.split("/");

  return (
    <SidebarMenuSubItem>
      <Link href={item.url}>
        <SidebarMenuButton
          tooltip={item.title}
          className={cn(
            "hover:cursor-pointer hover:bg-custom-primary-dark/80 hover:text-white active:bg-custom-primary active:text-white! [&>svg]:size-5",
            splitPath.includes(item.title.toLowerCase()) && "bg-custom-primary hover:bg-custom-primary-dark/80! text-white"
          )}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuSubItem>
  );
};

const RenderCollapse = (item: NavMainTypes["items"][number]) => {
  const pathname = usePathname();
  const splitPath = pathname.split("/");
  const isOpen = !item.isActive ? splitPath.includes(item.title.toLowerCase()) : item.isActive;

  return (
    <Collapsible key={item.title} asChild defaultOpen={isOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger
          asChild
          className={cn(
            "hover:cursor-pointer hover:bg-custom-primary-dark/80 hover:text-white",
            splitPath.includes(item.title.toLowerCase()) && "bg-custom-primary data-[state=closed]:text-white data-[state=open]:text-white data-[state=open]:hover:bg-custom-primary-dark/80 data-[state=open]:hover:text-white"
          )}>
          <SidebarMenuButton tooltip={item.title} className="[&>svg]:size-5">
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  className={cn(
                    "hover:cursor-pointer hover:bg-custom-primary-dark/80 hover:text-white hover:[&>svg]:text-white",
                    pathname === subItem.url && "bg-custom-primary text-white hover:bg-custom-primary-dark/80! [&>svg]:text-white"
                  )}>
                  <Link href={subItem.url}>
                    <subItem.icon size={18} />
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
