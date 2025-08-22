import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Pencil, Copy } from "lucide-react";
import { useState } from "react";

export default function PromptBubble({ prompt }: { prompt: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-end group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Prompt bubble */}
      <motion.div
        className={`p-3 bg-accent dark:bg-accent dark:text-foreground text-foreground rounded-lg max-w-xs md:max-w-md lg:max-w-lg cursor-pointer ${
          hovered ? "bg-accent/80" : ""
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {prompt}
      </motion.div>
      {/* Fixed space for icons to prevent layout shift */}
      <div className="h-8" /> {/* Reserve space even when icons not visible */}
      {/* Animated icons below */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -bottom-2 right-0 mt-1 flex space-x-2 "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              title="Retry"
              onClick={() => console.log("Retry", prompt)}
              className="py-2 px-2.5 hover:bg-accent/80 dark:hover:bg-accent/80 rounded-sm transition cursor-pointer"
            >
              <RefreshCcw
                size={16}
                className="text-foreground dark:text-foreground"
              />
            </button>
            <button
              title="Edit"
              onClick={() => console.log("Edit", prompt)}
              className="p-1 hover:bg-accent/80 dark:hover:bg-accent/80  rounded-md transition cursor-pointer"
            >
              <Pencil
                size={16}
                className="text-foreground dark:text-foreground"
              />
            </button>
            <button
              title="Copy"
              onClick={() => navigator.clipboard.writeText(prompt)}
              className="p-1 hover:bg-accent/80 dark:hover:bg-accent/80 rounded-md transition cursor-pointer"
            >
              <Copy size={16} className="text-foreground dark:text-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
    