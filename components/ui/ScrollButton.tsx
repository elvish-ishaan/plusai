import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToBottomButton({
  onClick,
  isVisible,
}: {
  onClick: () => void;
  isVisible: boolean;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          onClick={onClick}
          className="fixed bottom-28 right-6 z-50 bg-[#ecb3df] dark:bg-[#332230] text-black dark:text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          <ChevronDown size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
