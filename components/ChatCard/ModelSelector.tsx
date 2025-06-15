"use client";
import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/libs/utils";

const models = [
  { name: "Gemini 2.5 Flash", active: true, family: "gemini" },
  { name: "Gemini 2.5 Pro", active: false, family: "gemini" },
  { name: "GPT ImageGen", active: false , family: "gpt" },
  { name: "o4-mini", active: false, family: "openai" },
  { name: "Claude 4 Sonnet", active: false, family: "claude" },
  { name: "DeepSeek R1 (Llama Distilled)", active: false, family: "deepseek" },
];

export default function ModelSelector({
  setModel,
  setProvider,
}: {
  setModel: React.Dispatch<React.SetStateAction<string>>;
  setProvider: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Gemini 2.5 Flash");

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center  gap-1 text-[#ac1668] dark:text-[#f9f8fb] font-normal text-sm  px-3 py-1.5 rounded-lg hover:bg-[#f4d6e7 dark:hover:bg-[#322c38]"
      >
        {selectedModel}
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 z-50 w-72 bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden"
          >
            <div className="px-3 py-2">
              <input
                placeholder="Search models..."
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg outline-none placeholder:text-pink-400"
              />
            </div>

            <div className="px-3 pb-2">
              <div className="bg-gradient-to-r from-[#ffb0de] to-[#ffd0eb] text-[#b4005c] p-3 rounded-lg text-sm font-semibold shadow-sm mb-2">
                <div className="text-lg font-bold">$8</div>
                <div className="text-xs">/month</div>
                <p className="mt-1">Unlock all models + higher limits</p>
                <button className="mt-2 w-full py-1.5 bg-[#a4005a] text-white rounded-lg text-sm">
                  Upgrade now
                </button>
              </div>

              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {models.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => {
                      if (model.active) {
                        setModel(model.name);
                        setProvider(model.family);
                        setSelectedModel(model.name);
                        setIsOpen(false);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm",
                      model.active
                        ? "hover:bg-pink-100 text-pink-900"
                        : "text-pink-300 cursor-not-allowed"
                    )}
                    disabled={!model.active}
                  >
                    <span>{model.name}</span>
                    {!model.active && <Lock className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
