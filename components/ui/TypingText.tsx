"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type TypingTextProps = {
  text: string;
  isPaused?: boolean;
};

const TypingText = ({ text, isPaused = false }: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear interval safely
  const clearTypingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Reset on new text
    setDisplayedText("");
    indexRef.current = 0;
    clearTypingInterval();
  }, [text]);

  useEffect(() => {
    if (isPaused) {
      clearTypingInterval();
      return;
    }

    if (indexRef.current >= text.length) return;

    intervalRef.current = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(indexRef.current));
      indexRef.current += 1;

      if (indexRef.current >= text.length) {
        clearTypingInterval();
      }
    }, 10);

    return () => clearTypingInterval();
  }, [isPaused, text]);

  return (
    <motion.div
      className="p-3 max-w-xs md:max-w-md lg:max-w-2xl prose prose-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </motion.div>
  );
};

export default TypingText;

