"use client";
import { useState } from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Switch({
  checked = false,
  onChange,
  disabled = false,
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const toggleSwitch = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <button
      onClick={toggleSwitch}
      className={`w-11 h-6 rounded-full flex items-center transition-colors duration-300 ease-in-out
        ${isChecked ? "bg-[#a74576]" : "bg-gray-700/60"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      role="switch"
      aria-checked={isChecked}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ml-1
          ${isChecked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}
