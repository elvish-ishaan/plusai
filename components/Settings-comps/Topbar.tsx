"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Topbar() {
    const router = useRouter();
  return (
    <header className="flex items-center justify-between pb-8 px-4 pt-4 ">
      {/* Back to Chat */}
      <button
        onClick={() => router.push("/")}
        className="h-9 px-4 py-2 flex items-center cursor-pointer hover:bg-[#f0cde4] text-[#501854] justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Chat
      </button>

      {/* Theme Toggle + Sign Out */}
      <div className="flex flex-row items-center gap-2">
        <button
          className="group relative size-8 cursor-pointer inline-flex items-center justify-center hover:bg-[#f0cde4] text-[#501854]  rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
          tabIndex={-1}
        >
          <Moon className="absolute size-4 rotate-0 scale-100 transition-all duration-200" />
          <Sun className="absolute size-4 rotate-90 scale-0 transition-all duration-200" />
          <span className="sr-only">Toggle theme</span>
        </button>

        <button 
        onClick={() => signOut()}
        className="h-9 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 rounded-md hover:bg-[#f0cde4] text-[#501854]  text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          Sign out
        </button>
      </div>
    </header>
  );
}
