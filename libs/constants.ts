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
}

// Recommended models shown at the top of the model selector
export const recommendedModels: ModelEntry[] = [
  {
    title: "Gemini 2.5 Flash",
    name: "google/gemini-2.5-flash",
    active: true,
    provider: "google",
    description: "Google's fast multimodal model with web search support.",
  },
  {
    title: "Gemini 2.5 Pro",
    name: "google/gemini-2.5-pro",
    active: true,
    provider: "google",
    description: "Google's most capable model for complex reasoning tasks.",
  },
  {
    title: "GPT-4o",
    name: "openai/gpt-4o",
    active: true,
    provider: "openai",
    description: "OpenAI's flagship multimodal model.",
  },
  {
    title: "GPT-4 Turbo",
    name: "openai/gpt-4-turbo",
    active: true,
    provider: "openai",
    description: "Fast and capable GPT-4 variant.",
  },
  {
    title: "Claude 3.5 Sonnet",
    name: "anthropic/claude-3-5-sonnet",
    active: true,
    provider: "anthropic",
    description: "Anthropic's balanced model for complex tasks.",
  },
  {
    title: "Claude 3 Haiku",
    name: "anthropic/claude-3-haiku",
    active: true,
    provider: "anthropic",
    description: "Anthropic's fast and compact model.",
  },
  {
    title: "DeepSeek Chat",
    name: "deepseek/deepseek-chat",
    active: true,
    provider: "deepseek",
    description: "DeepSeek's general-purpose chat model.",
  },
  {
    title: "Mistral 7B Instruct",
    name: "mistralai/mistral-7b-instruct",
    active: true,
    provider: "mistral",
    description: "Fast and efficient open-source model by Mistral.",
  },
  {
    title: "LLaMA 3 70B",
    name: "meta-llama/llama-3-70b-instruct",
    active: true,
    provider: "meta",
    description: "Meta's powerful open-source large language model.",
  },
  {
    title: "LLaMA 3 8B",
    name: "meta-llama/llama-3-8b-instruct",
    active: true,
    provider: "meta",
    description: "Meta's lightweight open-source model.",
  },
];

// Kept for backwards compatibility — use recommendedModels directly
export const models = recommendedModels;
