"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full absolute top-0 z-50"
    >
      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md">
        <div className="flex items-center justify-between px-3 py-2 text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span>
              Our chat platform can now <span className="font-bold">memorize things</span>. Just log in and take a look!
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVisible(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
