import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { ArrowLeftFromLine, LogOut } from "lucide-react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  // Optional: don't render until session status is known
  if (status === "loading") return null;

  return (
    <div className="p-4 border-[#e6c4de] mb-3">
      <div className="flex items-center space-x-3 hover:bg-white px-2 py-3 rounded-lg cursor-pointer">
        {status === "authenticated" && session?.user ? (
          <div className="flex items-center space-x-2">
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
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center text-[#a74576] text-md font-medium gap-2 cursor-pointer ml-2"
          >
            <Image
              src="/login.png" // use a pink-tinted version of login.png
              alt="Login Icon"
              width={18}
              height={18}
            />
            <LogOut className="w-4 h-4  text-[#a74576]" />
            <span className="pl-4"> Login</span>
          </button>
        )}
      </div>
      <Button onClick={() => signOut()} className="w-full mt-2 bg-[#a74576] hover:bg-[#d56698] text-white">
        <ArrowLeftFromLine className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
