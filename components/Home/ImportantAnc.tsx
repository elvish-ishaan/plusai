"use client";

import { motion } from "framer-motion";

export default function AnnouncementBanner() {

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className=" mb-10 relative bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-2 border border-blue-500/20 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start gap-4">
            
            {/* Text content */}
            <div className="flex-1">
              <h3 className="text-sm font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                We Support Memory
              </h3>
              <p className="text-blue-200/80 text-xs leading-relaxed">
                So that you feel <span className="text-purple-400 font-semibold">personalized</span>
              </p>
            </div>
          </div>
          </div>
    </motion.div>
  );
}
