"use client";

import { useState } from "react";
import { Sparkles, Newspaper, Code, GraduationCap } from "lucide-react";
import { cn } from "@/libs/utils";
import { useSession } from "next-auth/react";

interface WelcomeScreenProps {
  onPromptSelect: (prompt: string) => void;
}

const categories = [
  {
    id: "default",
    name: "Suggestions",
    icon: Sparkles,
    selected: false,
    prompts: [
      "How does AI work?",
      "Are black holes real?",
      'How many Rs are in the word "strawberry"?',
      "What is the meaning of life?",
    ],
  },
  {
    id: "create",
    name: "Create",
    icon: Sparkles,
    selected: true,
    prompts: [
      "Write a short story about a robot discovering emotions",
      "Help me brainstorm ideas for a creative marketing campaign",
      "Create a compelling character backstory for my novel",
      "Generate creative names for a new tech startup",
    ],
  },
  {
    id: "explore",
    name: "Explore",
    icon: Newspaper,
    selected: false,
    prompts: [
      "Explain the latest developments in quantum computing",
      "What are the current trends in sustainable technology?",
      "Help me understand the basics of cryptocurrency",
      "Explore the potential impact of AI on healthcare",
    ],
  },
  {
    id: "code",
    name: "Code",
    icon: Code,
    selected: false,
    prompts: [
      "Help me debug this JavaScript function",
      "Explain the best practices for React component design",
      "Review my code and suggest improvements",
      "Create a simple REST API using Node.js",
    ],
  },
  {
    id: "learn",
    name: "Learn",
    icon: GraduationCap,
    selected: false,
    prompts: [
      "Teach me the fundamentals of machine learning",
      "Explain complex physics concepts in simple terms",
      "Help me create a study plan for learning Python",
      "Break down the history of the Renaissance period",
    ],
  },
];

export default function WelcomeScreen({ onPromptSelect }: WelcomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {data: session} = useSession();

  const currentCategory = categories.find(
    (cat) => cat.id === (selectedCategory ?? "default")
  );

  return (
    <div className="flex h-full w-full justify-center items-center text-center px-4 mt-10">
      <div className="w-full max-w-3xl space-y-8">
        <h2 className="text-3xl font-bold text-start text-primary dark:text-[#f9f8fb]">
          How can I help you, { session?.user?.name || 'Anonymous'}?
        </h2>

        {/* Category Buttons */}
        <div className="flex gap-4 flex-wrap">
          {categories
            .filter((category) => category.id !== "default")
            .map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory((prev) =>
                      prev === category.id ? null : category.id
                    )
                  }
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-semibold cursor-pointer shadow-sm transition-colors bg-[#f7e4f3] hover:bg-[#f1c4e6] dark:bg-[#211c26] dark:hover:bg-[#362d3d] dark:border-none ",
                    isSelected
                      ? "bg-[#a44370] border-transparent hover:bg-[#d56b9e]  dark:bg-[#451a33] dark:hover:bg-[#6b2c4c] dark:text-[#eebed8] dark:hover:text-[#efbfd9]"
                      : "text-[#7a375b] border-[#f2d9e5] dark:text-[#c2b6cf] "
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
        </div>

        {/* Prompt Suggestions */}
        <div className="mx-auto space-y-1 text-primary divide-y divide-[#f5e0f1] dark:divide-[#2a232f] divide-solid">
          {currentCategory?.prompts.map((prompt, index) => (
            <div key={index}>
              <button
                onClick={() => onPromptSelect(prompt)}
                className="w-full text-left text-primary p-2.5 hover:bg-[#f5dcf0] dark:text-[#d4c7e1] dark:hover:bg-[#2c2633] transition-colors rounded-lg my-1 cursor-pointer"
              >
                {prompt}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
