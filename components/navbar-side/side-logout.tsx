"use server";
import { signOut } from "@/auth";
import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const SideLogout = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/auth/login" });
      }}>
      <DropdownMenuItem>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </form>
  );
};

export default SideLogout;
