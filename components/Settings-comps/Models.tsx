"use client";

import { useState } from "react";
import { Link } from "lucide-react";
import { Input } from "../ui/input";

const initialModels = [
  {
    name: "Gemini 2.5 Flash",
    active: true,
    provider: "gemini",
    desc: "Google's latest fast model, known for speed and accuracy (and also web search!).",
    tags: ["Vision", "PDFs", "Search"],
  },
  {
    name: "Gemini 2.5 Pro",
    active: false,
    provider: "gemini",
    desc: "Advanced reasoning model by Google, ideal for complex tasks.",
    tags: ["Vision", "PDFs", "Search"],
  },
  {
    name: "GPT ImageGen",
    active: false,
    provider: "GPT",
    desc: "OpenAI's image generation model with high-quality visual output.",
    tags: ["ImageGen", "Vision"],
  },
  {
    name: "o4-mini",
    active: false,
    provider: "o4",
    desc: "OpenAI’s lightweight model designed for cost-effective general use.",
    tags: ["Fast", "Text"],
  },
  {
    name: "Claude 4 Sonnet",
    active: false,
    provider: "claude",
    desc: "Anthropic's creative and helpful model, good with long-form tasks.",
    tags: ["Reasoning", "Text"],
  },
  {
    name: "DeepSeek R1 (Llama Distilled)",
    active: false,
    provider: "deepseek",
    desc: "Open-source model optimized for performance and speed.",
    tags: ["Open-source", "Fast", "Coding"],
  },
];

export default function Models() {
  const [models, setModels] = useState(initialModels);

  const toggleModel = (index: number) => {
    const updated = [...models];
    updated[index].active = !updated[index].active;
    setModels(updated);
  };

  return (
    <section className="text-[#77347c] dark:text-white mb-6">
      <h2 className="text-xl font-bold mb-1">Available Models</h2>
      <p className="text-sm mb-4">
        Choose which models appear in your model selector. This won&apos;t
        affect existing conversations.
      </p>

      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-md text-sm hover:bg-[#e5c2dc] dark:hover:bg-[#32212d] cursor-pointer">
            Filter by features
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded-md text-sm hover:bg-[#e5c2dc] dark:hover:bg-[#32212d] cursor-pointer"
            onClick={() =>
              setModels(models.map((m) => ({ ...m, active: true })))
            }
          >
            Select Recommended Models
          </button>
          <button
            className="px-3 py-1 border rounded-md text-sm hover:bg-[#e5c2dc] dark:hover:bg-[#32212d] cursor-pointer"
            onClick={() =>
              setModels(models.map((m) => ({ ...m, active: false })))
            }
          >
            Unselect All
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {models.map((model, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border bg-[#f1dff4] border-[#e6b0d4] dark:border-[#3a2937] rounded-lg px-4 py-3 dark:bg-black/20 relative"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-base font-semibold">{model.name}</h3>
                <p className="text-sm text-[#77347c] dark:text-[#caa9c4]">
                  {model.desc}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs rounded-full bg-[#ded6eb] dark:bg-[#332635] text-[#4d3b57] dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button className="flex items-center gap-1 text-sm text-[#a74576] dark:text-pink-400 hover:underline cursor-pointer">
                  <Link size={14} /> Search URL
                </button>
                <label className="inline-flex items-center cursor-pointer">
                  <Input
                    type="checkbox"
                    checked={model.active}
                    onChange={() => toggleModel(i)}
                    className="form-checkbox accent-pink-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
