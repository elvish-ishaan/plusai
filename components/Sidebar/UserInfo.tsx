import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {  useSession } from "next-auth/react";
import {  LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (status === "authenticated" && session?.user) {
    return (
      <div 
      onClick={() => router.push("/settings/account")}
      className="p-4 border-sidebar-border mb-3">
        <div className="flex items-center space-x-3 hover:bg-sidebar-accent px-2 py-3 rounded-lg cursor-pointer">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {session.user.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="text-xs text-sidebar-foreground block truncate">
              {session.user.email}
            </span>
            <p className="text-xs text-sidebar-foreground">Free</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated
  return (
    <div
      onClick={() => router.push("/auth")}
      className="p-4 border-sidebar-border hover:bg-sidebar-accent m-3 rounded-lg cursor-pointer bg-primary"
    >
      <button className="flex items-center text-sidebar-foreground text-md font-medium gap-2 cursor-pointer ml-2">
        <LogOut className="w-4 h-4 text-sidebar-foreground" />
        <span className="pl-4">Login</span>
      </button>
    </div>
  );
}
