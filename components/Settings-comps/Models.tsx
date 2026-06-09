"use client";

import { useState, useEffect } from "react";
import type { ModelEntry } from "@/libs/constants";

interface ModelsResponse {
  recommended: ModelEntry[];
  all: ModelEntry[];
}

export default function Models() {
  const [recommended, setRecommended] = useState<ModelEntry[]>([]);
  const [allModels, setAllModels] = useState<ModelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json() as Promise<ModelsResponse>)
      .then((data) => {
        setRecommended(data.recommended ?? []);
        setAllModels(data.all ?? []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const allVisible = [...recommended, ...allModels];

  return (
    <section className="text-foreground dark:text-foreground mb-6">
      <h2 className="text-xl font-bold mb-1">Available Models</h2>
      <p className="text-sm mb-4">
        All 300+ models supported by OpenRouter are available. Recommended models are shown first in the model selector.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-accent animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {recommended.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Recommended
              </h3>
              <div className="flex flex-col gap-3">
                {recommended.map((model) => (
                  <ModelCard key={model.name} model={model} />
                ))}
              </div>
            </div>
          )}

          {allModels.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                All Models ({allVisible.length} total)
              </h3>
              <div className="flex flex-col gap-3">
                {allModels.map((model) => (
                  <ModelCard key={model.name} model={model} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ModelCard({ model }: { model: ModelEntry }) {
  return (
    <div className="flex flex-col gap-2 border bg-accent border-border dark:border-border rounded-lg px-4 py-3 dark:bg-black/20">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-base font-semibold">{model.title}</h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{model.name}</p>
          {model.description && (
            <p className="text-sm text-foreground dark:text-muted-foreground mt-1">
              {model.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {model.provider}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
