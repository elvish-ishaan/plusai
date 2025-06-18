"use client";

import { ArrowDown } from "lucide-react";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export default function ScrollToBottomButton({
  onClick,
  isVisible,
}: ScrollToBottomButtonProps) {
  return isVisible ? (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-50 bg-[#d68bd0] hover:bg-[#c06fbb] text-white p-2 rounded-full shadow-lg transition"
    >
      <ArrowDown className="w-5 h-5" />
    </button>
  ) : null;
}
