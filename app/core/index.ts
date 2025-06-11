import { GoogleClient } from "./clients/google";
import { OpenAIClient } from "./clients/openai";

export function initClient(model: string) {
  switch (model) {
    case "gemini":
      return new GoogleClient();
    case "openai":
        return new OpenAIClient();
    default:
        console.log("Invalid model");
      return null
  }
}

