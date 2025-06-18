"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type TypingTextProps = {
  text: string;
};

const TypingText = ({ text }: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10); // Speed of typing

    return () => clearInterval(interval);
  }, [text]);

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
