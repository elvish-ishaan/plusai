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
        "border-border text-foreground placeholder:text-muted-foreground",

        // Dark mode
        "dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground dark:bg-input",

        // Focus styles
        "focus-visible:ring-[0.6px] focus-visible:ring-ring focus-visible:border-ring",
        "dark:focus-visible:ring-ring dark:focus-visible:border-ring",

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
