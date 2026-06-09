// Color scheme constants
export const colors = {
  primary: {
    main: 'var(--primary)',
    light: 'var(--primary)',
    dark: 'var(--primary)',
    contrast: 'var(--primary-foreground)'
  },
  secondary: {
    main: 'var(--secondary)',
    light: 'var(--secondary)',
    dark: 'var(--secondary)',
    contrast: 'var(--secondary-foreground)'
  },
  text: {
    primary: 'var(--foreground)',
    secondary: 'var(--muted-foreground)',
    disabled: 'var(--muted-foreground)',
    inverse: 'var(--background)'
  },
  background: {
    primary: 'var(--background)',
    secondary: 'var(--muted)',
    dark: 'var(--background)',
    card: 'var(--card)',
    cardDark: 'var(--card)'
  },
  border: {
    light: 'var(--border)',
    dark: 'var(--border)',
    primary: 'var(--primary)',
    secondary: 'var(--secondary)'
  }
};

export interface ModelEntry {
  title: string;
  name: string;       // OpenRouter model ID, e.g. "google/gemini-2.5-flash"
  active: boolean;
  provider: string;
  description?: string;
  capabilities?: string[];  // e.g. ["vision", "fast", "long-context", "reasoning", "code", "image-gen"]
  contextLength?: number;
}

// Recommended models shown at the top of the model selector
export const recommendedModels: ModelEntry[] = [
  {
    title: "Gemini 2.5 Flash",
    name: "google/gemini-2.5-flash",
    active: true,
    provider: "google",
    description: "Google's fast multimodal model with web search support.",
    capabilities: ["vision", "fast", "long-context"],
    contextLength: 1048576,
  },
  {
    title: "Gemini 2.5 Pro",
    name: "google/gemini-2.5-pro",
    active: true,
    provider: "google",
    description: "Google's most capable model for complex reasoning tasks.",
    capabilities: ["vision", "long-context", "reasoning"],
    contextLength: 2097152,
  },
  {
    title: "GPT-4o",
    name: "openai/gpt-4o",
    active: true,
    provider: "openai",
    description: "OpenAI's flagship multimodal model.",
    capabilities: ["vision", "long-context"],
    contextLength: 128000,
  },
  {
    title: "GPT-4 Turbo",
    name: "openai/gpt-4-turbo",
    active: true,
    provider: "openai",
    description: "Fast and capable GPT-4 variant.",
    capabilities: ["vision", "long-context"],
    contextLength: 128000,
  },
  {
    title: "Claude 3.5 Sonnet",
    name: "anthropic/claude-3-5-sonnet",
    active: true,
    provider: "anthropic",
    description: "Anthropic's balanced model for complex tasks.",
    capabilities: ["vision", "long-context"],
    contextLength: 200000,
  },
  {
    title: "Claude 3 Haiku",
    name: "anthropic/claude-3-haiku",
    active: true,
    provider: "anthropic",
    description: "Anthropic's fast and compact model.",
    capabilities: ["vision", "fast"],
    contextLength: 200000,
  },
  {
    title: "DeepSeek Chat",
    name: "deepseek/deepseek-chat",
    active: true,
    provider: "deepseek",
    description: "DeepSeek's general-purpose chat model.",
    capabilities: ["code", "long-context"],
    contextLength: 163840,
  },
  {
    title: "Mistral 7B Instruct",
    name: "mistralai/mistral-7b-instruct",
    active: true,
    provider: "mistralai",
    description: "Fast and efficient open-source model by Mistral.",
    capabilities: ["fast"],
    contextLength: 32768,
  },
  {
    title: "LLaMA 3 70B",
    name: "meta-llama/llama-3-70b-instruct",
    active: true,
    provider: "meta-llama",
    description: "Meta's powerful open-source large language model.",
    capabilities: [],
    contextLength: 8192,
  },
  {
    title: "LLaMA 3 8B",
    name: "meta-llama/llama-3-8b-instruct",
    active: true,
    provider: "meta-llama",
    description: "Meta's lightweight open-source model.",
    capabilities: ["fast"],
    contextLength: 8192,
  },
];

// Kept for backwards compatibility — use recommendedModels directly
export const models = recommendedModels;
