"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search, Star, Sparkles, Eye, Zap, BookOpen, Brain, Code2, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/libs/utils";
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

const PROVIDER_DISPLAY: Record<string, string> = {
  google: "Google",
  openai: "OpenAI",
  anthropic: "Anthropic",
  "meta-llama": "Meta",
  mistralai: "Mistral",
  deepseek: "DeepSeek",
  cohere: "Cohere",
  perplexity: "Perplexity",
  qwen: "Qwen",
  nvidia: "NVIDIA",
  "x-ai": "xAI",
  microsoft: "Microsoft",
};

const CAPABILITY_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  vision:       { icon: <Eye       className="w-3.5 h-3.5" />, label: "Vision",       color: "text-blue-400"   },
  fast:         { icon: <Zap       className="w-3.5 h-3.5" />, label: "Fast",         color: "text-amber-400"  },
  "long-context":{ icon: <BookOpen className="w-3.5 h-3.5" />, label: "Long context", color: "text-emerald-400"},
  reasoning:    { icon: <Brain     className="w-3.5 h-3.5" />, label: "Reasoning",    color: "text-orange-400" },
  code:         { icon: <Code2     className="w-3.5 h-3.5" />, label: "Code",         color: "text-violet-400" },
  "image-gen":  { icon: <ImageIcon className="w-3.5 h-3.5" />, label: "Image gen",    color: "text-pink-400"   },
};

function displayProvider(provider: string): string {
  return PROVIDER_DISPLAY[provider] ?? provider.charAt(0).toUpperCase() + provider.slice(1);
}

function providerInitials(provider: string): string {
  const label = displayProvider(provider);
  const words = label.split(/[\s-]/);
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : label.slice(0, 2).toUpperCase();
}

export default function ModelSelector({ setModel, selectedModel, setProvider }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recommended, setRecommended] = useState<ModelEntry[]>([]);
  const [allModels, setAllModels] = useState<ModelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"recommended" | string>("recommended");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen || recommended.length > 0) return;
    setIsLoading(true);
    fetch("/api/models")
      .then((r) => r.json() as Promise<ModelsResponse>)
      .then((data) => {
        setRecommended(data.recommended ?? []);
        setAllModels(data.all ?? []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen, recommended.length]);

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 80);
    else { setSearch(""); setActiveTab("recommended"); }
  }, [isOpen]);

  const providers = useMemo(() => {
    const seen = new Set<string>();
    [...recommended, ...allModels].forEach((m) => seen.add(m.provider));
    return Array.from(seen).sort((a, b) => displayProvider(a).localeCompare(displayProvider(b)));
  }, [recommended, allModels]);

  const visibleModels = useMemo(() => {
    let base: ModelEntry[];
    if (activeTab === "recommended") {
      base = recommended;
    } else if (activeTab === "free") {
      base = [...recommended, ...allModels].filter((m) => m.name.endsWith(":free"));
    } else {
      base = [...recommended, ...allModels].filter((m) => m.provider === activeTab);
    }
    if (!search) return base;
    const q = search.toLowerCase();
    return base.filter((m) =>
      m.title.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    );
  }, [activeTab, search, recommended, allModels]);

  const handleSelect = (m: ModelEntry) => {
    setProvider?.(m.provider);
    setModel(m.name);
    setIsOpen(false);
  };

  const displayName =
    [...recommended, ...allModels].find((m) => m.name === selectedModel)?.title ??
    selectedModel.split("/").pop() ??
    selectedModel;

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-1 text-primary dark:text-primary-foreground font-normal text-sm px-3 py-1.5 rounded-lg hover:bg-accent dark:hover:bg-accent transition-colors"
      >
        <span className="max-w-[120px] truncate">{displayName}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-3 left-0 z-50 flex w-[500px] max-w-[calc(100vw-2rem)] bg-card dark:bg-card rounded-xl shadow-2xl border border-border dark:border-border overflow-hidden"
            style={{ height: 400 }}
          >
            {/* ── Provider sidebar ── */}
            <div className="w-[88px] flex-shrink-0 border-r border-border dark:border-border overflow-y-auto scrollbar-hide flex flex-col py-1.5">
              <SidebarTab
                label="Recommended"
                icon={<Star className="w-3.5 h-3.5" />}
                active={activeTab === "recommended"}
                onClick={() => setActiveTab("recommended")}
              />
              <SidebarTab
                label="Free"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                active={activeTab === "free"}
                onClick={() => setActiveTab("free")}
              />
              {providers.map((p) => (
                <SidebarTab
                  key={p}
                  label={displayProvider(p)}
                  active={activeTab === p}
                  onClick={() => setActiveTab(p)}
                />
              ))}
            </div>

            {/* ── Main panel ── */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Search */}
              <div className="px-3 pt-3 pb-2 flex-shrink-0">
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-background dark:bg-background border border-border dark:border-border">
                  <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <input
                    ref={searchRef}
                    placeholder="Search models..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Model list */}
              <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 scrollbar-hide">
                {isLoading ? (
                  <div className="space-y-2 p-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-[54px] rounded-lg bg-accent animate-pulse" />
                    ))}
                  </div>
                ) : visibleModels.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">No models found</p>
                ) : (
                  visibleModels.map((m) => (
                    <ModelRow
                      key={m.name}
                      model={m}
                      isSelected={selectedModel === m.name}
                      onSelect={handleSelect}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex flex-col items-center justify-center gap-1 px-1.5 py-2.5 text-[11px] font-medium transition-colors text-center border-r-2",
        active
          ? "bg-primary/10 text-primary border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-accent border-transparent"
      )}
    >
      {icon}
      <span className="leading-tight w-full truncate px-0.5">{label}</span>
    </button>
  );
}

function ModelRow({
  model,
  isSelected,
  onSelect,
}: {
  model: ModelEntry;
  isSelected: boolean;
  onSelect: (m: ModelEntry) => void;
}) {
  const caps = (model.capabilities ?? []).filter((c) => CAPABILITY_CONFIG[c]);

  return (
    <button
      onClick={() => onSelect(model)}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left transition-colors group",
        isSelected
          ? "bg-primary/10 text-primary"
          : "hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground"
      )}
    >
      {/* Provider badge */}
      <span
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold",
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-accent dark:bg-accent text-muted-foreground group-hover:bg-background dark:group-hover:bg-background"
        )}
      >
        {providerInitials(model.provider)}
      </span>

      {/* Name + description */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-semibold leading-tight truncate">{model.title}</span>
        {model.description && (
          <span
            className={cn(
              "text-xs leading-tight line-clamp-1",
              isSelected ? "text-primary/70" : "text-muted-foreground"
            )}
          >
            {model.description}
          </span>
        )}
      </div>

      {/* Capability icons */}
      {caps.length > 0 && (
        <div className="flex-shrink-0 flex items-center gap-1">
          {caps.map((cap) => {
            const cfg = CAPABILITY_CONFIG[cap];
            return (
              <span
                key={cap}
                title={cfg.label}
                className={cn(cfg.color, "opacity-70 group-hover:opacity-100 transition-opacity")}
              >
                {cfg.icon}
              </span>
            );
          })}
        </div>
      )}
    </button>
  );
}
