import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextRequest } from "next/server";
import { getRelevantContext } from "@/lib/pinecone";
import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Set maximum duration for the API route to handle long-running LLM requests
export const maxDuration = 60;

// Schema for validating the incoming request body
const SendMessageSchema = z.object({
  fileId: z.string(),
  messages: z.array(z.any()), // array of messages from the frontend
});

/**
 * POST handler for the chat API.
 * Implements a RAG (Retrieval-Augmented Generation) pipeline:
 * 1. Authenticates the user.
 * 2. Fetches relevant context from Pinecone based on the user's query.
 * 3. Sends the query + context to Gemini for a grounded response.
 * 4. Streams the response back to the client while saving messages to the database.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check using Clerk
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    // 2. Parse and validate the request body
    const body = await req.json();
    const { fileId, messages }: { fileId: string; messages: UIMessage[] } =
      SendMessageSchema.parse(body);

    // 3. Extract the text from the latest user message
    // Since AI SDK v6 uses a 'parts' array for multi-modal support,
    // we filter for text parts and join them.
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(" ");

    // 4. Verify the user actually owns the file they are chatting about
    const file = await prisma.userFile.findFirst({
      where: { id: fileId, userId },
    });
    if (!file) return new Response("Not Found", { status: 404 });

    // 5. Persist the user's message to the database for chat history
    await prisma.message.create({
      data: { text: userText, role: "user", fileId },
    });

    // 6. RAG: Retrieve contextually relevant "chunks" of text from Pinecone
    // This helper performs an embedding of 'userText' and finds matching vectors for 'fileId'.
    const context = await getRelevantContext(userText, fileId);

    // 7. Initialize streaming response from Gemini 1.5 Flash
    const result = streamText({
      model: google("gemini-2.5-flash"),
      // The system prompt instructs the AI to ground its answers in the provided context
      system: `You are a helpful assistant that answers questions about PDF documents.
                Answer ONLY using the context provided below. If the answer isn't in the context, say so clearly.
                When referencing specific content, ALWAYS cite the page and include the exact relevant text snippet in quotes like this: [Page 3: "the specific text snippet"]. 
                This is CRITICAL for the highlighting feature to work.
                CONTEXT:
                ${context}`,

      // Convert UI messages to the internal ModelMessage format expected by AI SDK core
      messages: await convertToModelMessages(messages),

      // On completion of the stream, save the assistant's full response to the database
      onFinish: async ({ text }) => {
        await prisma.message.create({
          data: { text, role: "assistant", fileId },
        });
      },
    });

    // 8. Return the stream in a format the frontend 'useChat' hook understands
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
