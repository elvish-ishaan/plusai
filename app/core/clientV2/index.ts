import { generateText, LanguageModel } from 'ai';
import { google } from '@ai-sdk/google';
import { WebSearchTool } from './tools/webSearch';

interface UserParams {
    finalPrompt: string
    maxOutputTokens?: number
    temperature?: number
    llmProvider: string
    model: string
    isWebSearchEnabled: boolean
    attachmentUrl?: string

}

function parseChoosenLlm(llmProvider: string, model: string){
    switch (llmProvider){
        case 'google':
            return google(`${model}`)
        default:
            return google(`${model}`)
    }
}

export const generateResponse = async ( userParams: UserParams) => {
    try {
        const result = await generateText({
          model: parseChoosenLlm(userParams.llmProvider, userParams.model) as LanguageModel,
          prompt: userParams.finalPrompt,
          tools: {
            searchWeb: WebSearchTool
          },
          toolChoice: "auto"
        });
        return result
    } catch (error) {
        console.log(error,'error while generating response from llm.')
    }
}