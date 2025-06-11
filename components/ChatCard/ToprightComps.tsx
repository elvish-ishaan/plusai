"use client";


import { Settings, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopRightIconHolder({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

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

      {/* Background for icon container changes based on sidebar state */}
      <div
        className={`absolute top-3 right-3 flex space-x-2 z-10 rounded-md p-1 transition-colors ${
          isCollapsed ? "bg-[#f1e1f3]" : "bg-transparent"
        }`}
      >
        <button
          className="flex items-center justify-center w-8 h-8 rounded-md text-[#ac1668] hover:text-[#501854] hover:bg-[#f0cde4] transition"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-md text-[#ac1668] hover:text-[#501854] hover:bg-[#f0cde4] transition"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
