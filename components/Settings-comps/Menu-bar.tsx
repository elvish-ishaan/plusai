"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [active, setActive] = useState("");

  // Determine active tab from the URL
  useEffect(() => {
    const match = pathname?.split("/").pop(); // get last segment
    setActive(match || "account");
  }, [pathname]);

  const handleClick = (value: string) => {
    setActive(value);
    router.push(`/settings/${value}`);
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className="inline-flex h-9 items-center gap-1 rounded-lg bg-[#f2cbe9] p-1 text-[#77347c] no-scrollbar w-full md:w-fit overflow-auto"
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
                ? "bg-[#f2e1f4] text-[#77347c] shadow"
                : "hover:bg-[#f5ddef]"
            }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
