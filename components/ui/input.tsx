import { cn } from "@/libs/utils";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Core layout & spacing
        "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

        // Light theme styles
        "border-[#e7c1dc] text-[#ac1668] placeholder:text-[#ac1668]",

        // Dark theme styles
        "dark:border-[#e7c1dc] dark:text-[#e7d0dd] dark:placeholder:text-[#e7d0dd] dark:bg-input/30",

        // Focus styles
        "focus-visible:ring-[0.5px] focus-visible:ring-[#db2777] focus-visible:border-[#db2777]",
        "dark:focus-visible:ring-[#db2777] dark:focus-visible:border-[#db2777]",

        // Validation (optional accessibility)
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        className
      )}
      {...props}
    />
  );
}

export { Input };
