import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {  signOut, useSession } from "next-auth/react";
import { ArrowLeftFromLine, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (status === "authenticated" && session?.user) {
    return (
      <div className="p-4 border-[#e6c4de] mb-3">
        <div className="flex items-center space-x-3 hover:bg-white dark:hover:bg-[#261922] px-2 py-3 rounded-lg cursor-pointer">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              {session.user.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="text-xs text-[#a74576] block truncate">
              {session.user.email}
            </span>
            <p className="text-xs text-[#a74576]">Free</p>
          </div>
        </div>
        <Button
          onClick={() => signOut()}
          className="w-full mt-2 bg-[#a74576] hover:bg-[#d56698] text-white"
        >
          <ArrowLeftFromLine className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  // If not authenticated
  return (
    <div className="p-4 border-[#e6c4de] hover:bg-white dark:hover:bg-[#261922] m-3 rounded-lg cursor-pointer">
      <button
        onClick={() =>router.push("/auth")}
        className="flex items-center text-[#a74576] text-md font-medium gap-2 cursor-pointer ml-2"
      >
        <LogOut className="w-4 h-4 text-[#a74576]" />
        <span className="pl-4">Login</span>
      </button>
    </div>
  );
}
