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
        className="absolute top-0 right-0 w-full h-full text-[#f0cde4]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 Q40,60 80,20 T160,0 L160,64 L0,64 Z" fill="#f9f3f9" />
      </svg>

      <div
        className={`absolute top-3 right-3 flex space-x-2 z-10 rounded-md p-1 transition-colors ${
          isCollapsed ? "bg-[#f1e1f3] dark:bg-[#19171d]" : "bg-transparent"
        }`}
      >
        <button
          className="flex items-center justify-center w-7 h-7 rounded-md text-[#ac1668] hover:text-[#501854] hover:bg-[#f0cde4] transition cursor-pointer dark:hover:text-[#e7d0dd] dark:text-white dark:hover:bg-[#29252e]"
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
          className="flex items-center justify-center w-7 h-7 rounded-md text-[#ac1668] hover:text-[#501854] dark:hover:text-[#e7d0dd] dark:text-white dark:hover:bg-[#29252e] hover:bg-[#f0cde4] transition cursor-pointer"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
