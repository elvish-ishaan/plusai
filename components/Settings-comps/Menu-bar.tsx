"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const MenuItems = [
  { name: "Account", value: "account" },
  { name: "Customization", value: "customization" },
  { name: "History & Sync", value: "history" },
  { name: "Models", value: "models" },
  { name: "API Keys", value: "api-keys" },
  { name: "Attachments", value: "attachments" },
  { name: "Contact Us", value: "contact" },
];

export default function Menubar() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("account");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const match = pathname?.split("/").pop();
    setActive(match || "account");
  }, [pathname]);

  const handleClick = (value: string) => {
    setActive(value);
    router.push(`/settings/${value}`);
    setIsOpen(false); // close menu on select (for small screen)
  };

  return (
    <div className="w-full">
      {/* Mobile Dropdown */}
      <div className="md:hidden w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full px-4 py-2 rounded-md bg-[#f2cbe9] dark:bg-[#302836] text-[#77347c] dark:text-white"
        >
          {MenuItems.find((i) => i.value === active)?.name || "Select"}
          <ChevronDown
            className={`ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 space-y-1 bg-[#f8e7f5] dark:bg-[#2b1f2a] rounded-md ">
            {MenuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleClick(item.value)}
                className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                  active === item.value
                    ? "bg-[#f2e1f4] text-[#77347c] dark:bg-[#21141e] dark:text-white"
                    : "hover:bg-[#f5ddef] dark:hover:bg-[#382733]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Horizontal Tabs */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="hidden md:inline-flex h-10 items-center gap-1 rounded-lg bg-[#f2cbe9] dark:bg-[#302836] p-1 dark:text-white text-[#77347c] w-fit"
      >
        {MenuItems.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active === item.value}
            onClick={() => handleClick(item.value)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2
              disabled:pointer-events-none disabled:opacity-50 cursor-pointer
              ${
                active === item.value
                  ? "bg-[#f2e1f4] text-[#77347c] shadow dark:bg-[#21141e] dark:text-white"
                  : "hover:bg-[#f5ddef] dark:hover:bg-[#2c222e]"
              }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
