import { NextResponse } from "next/server";
import { recommendedModels } from "@/libs/constants";

interface OpenRouterModel {
    id: string;
    name: string;
    description?: string;
    context_length?: number;
    architecture?: {
        modality?: string;
        input_modalities?: string[];
    };
}

let cachedModels: OpenRouterModel[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
    if (cachedModels && Date.now() < cacheExpiry) {
        return cachedModels;
    }
    const res = await fetch("https://openrouter.ai/api/v1/models");
    const data = await res.json() as { data: OpenRouterModel[] };
    cachedModels = data.data ?? [];
    cacheExpiry = Date.now() + CACHE_TTL_MS;
    return cachedModels;
}

export async function GET() {
    try {
        const allModels = await fetchOpenRouterModels();
        const recommendedIds = new Set(recommendedModels.map((m) => m.name));

        const rest = allModels
            .filter((m) => !recommendedIds.has(m.id))
            .map((m) => ({
                title: m.name,
                name: m.id,
                active: true,
                provider: m.id.split("/")[0] ?? "unknown",
                description: m.description ?? "",
                contextLength: m.context_length,
                modality: m.architecture?.modality,
            }))
            .sort((a, b) => a.title.localeCompare(b.title));

        return NextResponse.json({ recommended: recommendedModels, all: rest });
    } catch (error) {
        console.error(error, "Failed to fetch OpenRouter models");
        return NextResponse.json({ recommended: recommendedModels, all: [] });
    }
}
