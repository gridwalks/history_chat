import { NextRequest, NextResponse } from 'next/server';
import { getRelevantContext } from '@/lib/rag';
import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export const runtime = 'edge';

const groqModel = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }
    
    // Get relevant context from RAG system using the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const searchQuery = lastUserMessage?.content || '';
    
    let context = '';
    try {
      context = await getRelevantContext(searchQuery);
    } catch (error) {
      console.error('RAG context error (continuing without context):', error);
      // Continue without context if RAG fails
    }
    
    // Build system prompt with context
    const systemPrompt = `You are a helpful assistant for history students researching primary sources from the U.S. National Archives. 
    
${context ? `Use the following context from primary source documents to answer questions:

${context}

` : ''}Provide accurate, well-sourced answers based on the primary sources. If the context doesn't contain relevant information, say so. Always cite specific documents when possible.`;

    // Prepare messages for the AI (useChat sends messages in the correct format)
    const aiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];
    
    // Stream response from Groq
    const result = await streamText({
      model: groqModel('llama-3.1-70b-versatile'),
      messages: aiMessages,
      temperature: 0.7,
      maxOutputTokens: 1000,
    });
    
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

