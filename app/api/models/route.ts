import { NextResponse } from "next/server";
import { recommendedModels } from "@/libs/constants";

export const revalidate = 300;

interface OpenRouterModel {
    id: string;
    name: string;
    description?: string;
    context_length?: number;
    architecture?: {
        modality?: string;
        input_modalities?: string[];
        output_modalities?: string[];
    };
}

function deriveCapabilities(m: OpenRouterModel): string[] {
    const caps: string[] = [];
    const inputMods = m.architecture?.input_modalities ?? [];
    const outputMods = m.architecture?.output_modalities ?? [];
    const modality = m.architecture?.modality ?? "";
    const id = m.id.toLowerCase();

    if (inputMods.includes("image") || modality.includes("+image") || modality.startsWith("image")) {
        caps.push("vision");
    }
    if (outputMods.includes("image") || modality.includes("->image")) {
        caps.push("image-gen");
    }
    if (id.includes("code") || id.includes("coder")) {
        caps.push("code");
    }
    if (id.includes("-r1") || id.includes("reasoning") || id.includes("thinking") || id.includes(":thinking")) {
        caps.push("reasoning");
    }
    if ((m.context_length ?? 0) >= 100000) {
        caps.push("long-context");
    }

    return caps;
}

async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
        next: { revalidate: 300 },
    });
    const data = (await res.json()) as { data: OpenRouterModel[] };
    return data.data ?? [];
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
                capabilities: deriveCapabilities(m),
            }))
            .sort((a, b) => a.title.localeCompare(b.title));

        return NextResponse.json({ recommended: recommendedModels, all: rest });
    } catch (error) {
        console.error(error, "Failed to fetch OpenRouter models");
        return NextResponse.json({ recommended: recommendedModels, all: [] });
    }
}
