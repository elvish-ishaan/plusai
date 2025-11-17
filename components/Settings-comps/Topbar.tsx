"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Topbar() {
    const router = useRouter();
    const {theme, setTheme} = useTheme()

  return (
    <header className="flex items-center justify-between pb-8 px-4 pt-4">
      {/* Back to Chat */}
      <button
        onClick={() => router.push("/")}
        className="h-9 px-4 py-2 flex items-center cursor-pointer hover:bg-accent text-foreground dark:text-foreground dark:hover:bg-accent justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Chat
      </button>

      {/* Theme Toggle + Sign Out */}
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={ () => theme == "dark" ? setTheme("light") : setTheme("dark")}
          className="flex items-center justify-center w-8 h-8 rounded-md text-primary hover:text-primary/80 dark:hover:text-primary-foreground dark:text-foreground dark:hover:bg-accent hover:bg-accent transition cursor-pointer"
          aria-label={theme == "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme == "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={() => signOut()}
          className="h-9 px-4 py-2 cursor-pointer dark:text-foreground dark:hover:bg-accent inline-flex items-center justify-center gap-2 rounded-md hover:bg-accent text-foreground  text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
