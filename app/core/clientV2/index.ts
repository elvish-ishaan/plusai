import { generateText, LanguageModel, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { WebSearchTool } from './tools/webSearch';
import { AddMemoryTool, GetMemoryTool } from './tools/memory';
import { systemPrompt } from '@/libs/systemPrompt';

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
          system: systemPrompt,
          prompt: userParams.finalPrompt,
          tools: {
            searchWeb: WebSearchTool,
            addMemory: AddMemoryTool,
            getMemory: GetMemoryTool,
          },
          toolChoice: "auto",
          stopWhen: stepCountIs(5),
        });
        
        return result
    } catch (error) {
        console.log(error,'error while generating response from llm.')
    }
}