"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/libs/utils";
import { Input } from "../ui/input";
import type { ModelEntry } from "@/libs/constants";

interface ModelSelectorProps {
  setModel: React.Dispatch<React.SetStateAction<string>>;
  selectedModel: string;
  setProvider?: React.Dispatch<React.SetStateAction<string>>;
}

interface ModelsResponse {
  recommended: ModelEntry[];
  all: ModelEntry[];
}

export default function ModelSelector({ setModel, selectedModel, setProvider }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recommended, setRecommended] = useState<ModelEntry[]>([]);
  const [allModels, setAllModels] = useState<ModelEntry[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || recommended.length > 0) return;
    setIsLoadingModels(true);
    fetch("/api/models")
      .then((r) => r.json() as Promise<ModelsResponse>)
      .then((data) => {
        setRecommended(data.recommended ?? []);
        setAllModels(data.all ?? []);
      })
      .catch(console.error)
      .finally(() => setIsLoadingModels(false));
  }, [isOpen, recommended.length]);

  const filterModels = (list: ModelEntry[]) =>
    search
      ? list.filter(
          (m) =>
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.name.toLowerCase().includes(search.toLowerCase())
        )
      : list;

  const handleSelect = (modelItem: ModelEntry) => {
    setProvider?.(modelItem.provider);
    setModel(modelItem.name);
    setIsOpen(false);
    setSearch("");
  };

  const displayName = recommended.find((m) => m.name === selectedModel)?.title ?? selectedModel;

  const filteredRecommended = filterModels(recommended);
  const filteredAll = filterModels(allModels);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-primary dark:text-primary-foreground font-normal text-sm px-3 py-1.5 rounded-lg hover:bg-accent dark:hover:bg-accent"
      >
        {displayName}
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 z-50 w-80 bg-card dark:bg-card rounded-xl shadow-lg border border-border dark:border-border overflow-hidden"
          >
            <div className="px-3 py-2">
              <Input
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-border dark:border-border rounded-lg outline-none placeholder:text-muted-foreground bg-card dark:bg-card text-foreground dark:text-foreground"
              />
            </div>

            <div className="px-3 pb-2 max-h-80 overflow-y-auto custom-scrollbar flex flex-col gap-1">
              {isLoadingModels ? (
                <div className="flex flex-col gap-1 py-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 rounded-lg bg-accent animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  {filteredRecommended.length > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground font-medium px-1 py-1 uppercase tracking-wide">
                        Recommended
                      </p>
                      {filteredRecommended.map((modelItem) => (
                        <ModelRow
                          key={modelItem.name}
                          modelItem={modelItem}
                          isSelected={selectedModel === modelItem.name}
                          onSelect={handleSelect}
                        />
                      ))}
                    </>
                  )}

                  {filteredAll.length > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground font-medium px-1 py-1 mt-1 uppercase tracking-wide">
                        All Models
                      </p>
                      {filteredAll.map((modelItem) => (
                        <ModelRow
                          key={modelItem.name}
                          modelItem={modelItem}
                          isSelected={selectedModel === modelItem.name}
                          onSelect={handleSelect}
                        />
                      ))}
                    </>
                  )}

                  {filteredRecommended.length === 0 && filteredAll.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No models found</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelRow({
  modelItem,
  isSelected,
  onSelect,
}: {
  modelItem: ModelEntry;
  isSelected: boolean;
  onSelect: (m: ModelEntry) => void;
}) {
  return (
    <button
      onClick={() => onSelect(modelItem)}
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-left",
        isSelected
          ? "bg-primary/10 text-primary"
          : "hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{modelItem.title}</span>
        <span className="text-xs text-muted-foreground">{modelItem.name}</span>
      </div>
    </button>
  );
}
