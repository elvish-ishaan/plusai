import { cn } from "@/libs/utils";
import * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Layout & spacing
        "flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm",

        // Light mode
        "border-[#e7c1dc] text-[#ac1668] placeholder:text-[#ac1668]",

        // Dark mode
        "dark:border-[#e7c1dc] dark:text-[#e7d0dd] dark:placeholder:text-[#e7d0dd] dark:bg-input/30",

        // Focus styles
        "focus-visible:ring-[0.6px] focus-visible:ring-[#db2777] focus-visible:border-[#db2777]",
        "dark:focus-visible:ring-[#db2777] dark:focus-visible:border-[#db2777]",

        // Accessibility & disabled states
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        className
      )}
      {...props}
    />
  );
}

export { Textarea };
