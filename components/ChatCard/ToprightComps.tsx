"use client";

import Image from "next/image"; 
import {  Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function TopRightIconHolder({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();
  const {data : session} = useSession();

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newTheme = html.classList.contains("dark") ? "light" : "dark";
    html.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    setIsDark(newTheme === "dark");
  };

  const lightFilter =
    "brightness(0.2) saturate(100%) invert(19%) sepia(47%) saturate(3761%) hue-rotate(309deg) brightness(95%) contrast(88%)"; // dark pink
  const darkFilter =
    "brightness(0.9) saturate(200%) invert(85%) sepia(5%) saturate(120%) hue-rotate(300deg) contrast(105%)"; // light pink

  
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const applyDark = storedTheme === "dark" || (!storedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", applyDark);
    setIsDark(applyDark);
  }, []);


  return (
    <div className="absolute top-0 right-0 z-10">
      <svg
        viewBox="0 0 160 64"
        preserveAspectRatio="none"
        className="absolute top-0 right-0 w-full h-full text-accent"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 Q40,60 80,20 T160,0 L160,64 L0,64 Z" fill="var(--background)" />
      </svg>

      <div
        className={`absolute top-3 right-3 flex space-x-2 z-10 rounded-md p-1 transition-colors ${
          isCollapsed ? "bg-accent dark:bg-accent" : "bg-transparent"
        }`}
      >
        <button
          className="flex items-center justify-center w-7 h-7 rounded-md text-primary hover:text-primary/80 hover:bg-accent transition cursor-pointer dark:hover:text-primary-foreground dark:text-primary-foreground dark:hover:bg-accent"
          aria-label="Settings"
          onClick={() => {
            if (!session?.user) {
              router.push("/auth");
            } else {
              router.push("/settings/customization");
            }
          }}
        >
          <Image
            src="/setting.png"
            alt="Settings"
            width={24}
            height={24}
            style={{ filter: isDark ? darkFilter : lightFilter }}
          />
        </button>

        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-7 h-7 rounded-md text-primary hover:text-primary/80 dark:hover:text-primary-foreground dark:text-primary-foreground dark:hover:bg-accent hover:bg-accent transition cursor-pointer"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
