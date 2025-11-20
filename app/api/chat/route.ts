import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@/lib/groq';
import { getRelevantContext } from '@/lib/rag';
import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export const runtime = 'edge';

const groqModel = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, query } = await request.json();
    
    if (!query && (!messages || messages.length === 0)) {
      return NextResponse.json(
        { error: 'Query or messages are required' },
        { status: 400 }
      );
    }
    
    // Get relevant context from RAG system
    const searchQuery = query || messages[messages.length - 1]?.content || '';
    const context = await getRelevantContext(searchQuery);
    
    // Build system prompt with context
    const systemPrompt = `You are a helpful assistant for history students researching primary sources from the U.S. National Archives. 
    
Use the following context from primary source documents to answer questions:

${context}

Provide accurate, well-sourced answers based on the primary sources. If the context doesn't contain relevant information, say so. Always cite specific documents when possible.`;

    // Prepare messages for the AI
    const aiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...(messages || [{ role: 'user' as const, content: searchQuery }]),
    ];
    
    // Stream response from Groq
    const result = await streamText({
      model: groqModel('llama-3.1-70b-versatile'),
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });
    
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

