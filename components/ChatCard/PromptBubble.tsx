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
        className={`p-3 bg-[#f5dcf0] dark:bg-[#2c2633] dark:text-white text-[#492c61] rounded-lg max-w-xs md:max-w-md lg:max-w-lg cursor-pointer ${
          hovered ? "bg-[#f3cde8]" : ""
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
              className="py-2 px-2.5 hover:bg-[#f3cde8] dark:hover:bg-[#2e2833] rounded-sm transition cursor-pointer"
            >
              <RefreshCcw
                size={16}
                className="text-[#492c61] dark:text-[#f9f8fb]"
              />
            </button>
            <button
              title="Edit"
              onClick={() => console.log("Edit", prompt)}
              className="p-1 hover:bg-[#f3cde8] dark:hover:bg-[#2e2833]  rounded-md transition cursor-pointer"
            >
              <Pencil
                size={16}
                className="text-[#492c61] dark:text-[#f9f8fb]"
              />
            </button>
            <button
              title="Copy"
              onClick={() => navigator.clipboard.writeText(prompt)}
              className="p-1 hover:bg-[#f3cde8] dark:hover:bg-[#2e2833] rounded-md transition cursor-pointer"
            >
              <Copy size={16} className="text-[#492c61] dark:text-[#f9f8fb]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
    