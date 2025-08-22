// Color scheme constants
export const colors = {
  // Primary color scheme
  primary: {
    main: '#6a5bcd',
    light: '#7c6fd8',
    dark: '#5a4bbd',
    contrast: '#ffffff'
  },
  // Secondary color scheme
  secondary: {
    main: '#8a2ce2',
    light: '#9d4edd',
    dark: '#7a1cd2',
    contrast: '#ffffff'
  },
  // Text colors
  text: {
    primary: '#1a1a1a',
    secondary: '#6c757d',
    disabled: '#a1a1aa',
    inverse: '#ffffff'
  },
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    dark: '#0f0f23',
    card: '#ffffff',
    cardDark: '#1a1a2e'
  },
  // Border colors
  border: {
    light: '#e9ecef',
    dark: '#2d2d44',
    primary: '#6a5bcd',
    secondary: '#8a2ce2'
  }
} as const;

export const models = [
  // Gemini
  {
    title: "Gemini 2.5 Flash",
    name: "gemini-2.5-flash",
    active: true,
    provider: "gemini",
  },
  {
    title: "Gemini 2.5 Pro",
    name: "gemini-2.5-pro",
    active: true,
    provider: "gemini",
  },

  // OpenAI
  {
    title: "GPT-4o",
    name: "gpt-4o",
    active: false,
    provider: "openai",
  },
  {
    title: "GPT-4 Turbo",
    name: "gpt-4-turbo",
    active: false,
    provider: "openai",
  },
  {
    title: "GPT-4",
    name: "gpt-4",
    active: false,
    provider: "openai",
  },
  {
    title: "GPT-3.5 Turbo",
    name: "gpt-3.5-turbo",
    active: false,
    provider: "openai",
  },
  {
    title: "GPT ImageGen",
    name: "gpt-image-gen",
    active: false,
    provider: "openai",
  },

  // Claude
  {
    title: "Claude 3 Opus",
    name: "claude-3-opus",
    active: false,
    provider: "claude",
  },
  {
    title: "Claude 3 Sonnet",
    name: "claude-3-sonnet",
    active: false,
    provider: "claude",
  },
  {
    title: "Claude 3 Haiku",
    name: "claude-3-haiku",
    active: false,
    provider: "claude",
  },

  // DeepSeek
  {
    title: "DeepSeek-V2",
    name: "deepseek-v2",
    active: false,
    provider: "deepseek",
  },
  {
    title: "DeepSeek-Coder V1.5",
    name: "deepseek-coder-1.5",
    active: false,
    provider: "deepseek",
  },
  {
    title: "DeepSeek R1 (Llama Distilled)",
    name: "deepseek-r1-llama-distilled",
    active: false,
    provider: "deepseek",
  },

  // Mistral
  {
    title: "Mistral 7B",
    name: "mistral-7b",
    active: false,
    provider: "mistral",
  },
  {
    title: "Mixtral 8x7B",
    name: "mixtral-8x7b",
    active: false,
    provider: "mistral",
  },

  // Qwen
  {
    title: "Qwen1.5-72B",
    name: "qwen1.5-72b",
    active: false,
    provider: "qwen",
  },
  {
    title: "Qwen1.5-14B",
    name: "qwen1.5-14b",
    active: false,
    provider: "qwen",
  },
  {
    title: "Qwen1.5-7B",
    name: "qwen1.5-7b",
    active: false,
    provider: "qwen",
  },

  // Others (add more as needed)
  {
    title: "Command R+",
    name: "command-r-plus",
    active: false,
    provider: "cohere",
  },
  {
    title: "LLaMA 3 70B",
    name: "llama3-70b",
    active: false,
    provider: "meta",
  },
  {
    title: "LLaMA 3 8B",
    name: "llama3-8b",
    active: false,
    provider: "meta",
  },
];
