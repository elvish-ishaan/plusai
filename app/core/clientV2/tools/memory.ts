import { client } from "@/app/configs/mem0";
import { tool } from "ai";
import z from "zod";

async function addMemory(memory: string, userId: string) {
    console.log("add memory got called................");

    const messages = [
    {"role": "user", "content": memory},
    {"role": "assistant", "content": "Got it, i will remember it for future use."},
]

    try {
      //@ts-expect-error message error should be fixed
        await client.add(messages, { user_id: userId });
        return "Memory has been successfully added";
    } catch (error) {
        console.error(error, "error in add memory function");
    }

    return "Sorry, can't add memory, something went wrong";
}

async function GetMemory(query: string, userId: string) {
    console.log('get memory got called.............')
    try {
      const results = await client.search(query, { user_id: userId});
      //map over all the memories and return them in arr
      const memories = results.map( x => x.memory)
      //return all in single string
      return `"${memories.join('", "')}"`

    } catch (error) {
      console.log(error,'error in fetchig memory')
    }
    return 'Sorry cant retrive memories right now'
}

export const AddMemoryTool = tool({
  description: "Add memory for future use",
  inputSchema: z.object({
        memory: z.string().describe('Memory to add'),
        userId: z.string().describe("user id for storing memories")
    }),
  execute: async ({memory, userId}) => {
    const result = await addMemory(memory, userId);
    return { result };
  },
});


//fetch memory
export const GetMemoryTool = tool({
  description: "Get saved memories ",
  inputSchema: z.object({
        query: z.string().describe("query for getting memory/memories"),
        userId: z.string().describe("user id for storing memories")
    }),
  execute: async ({query, userId}) => {
    const result = await GetMemory(query, userId);
    return { result };
  },
});
