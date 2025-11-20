import { NextRequest, NextResponse } from 'next/server';
import { getRelevantContext } from '@/lib/rag';
import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured. Please set it in your environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: 'Each message must have "role" and "content" fields' },
          { status: 400 }
        );
      }
    }
    
    // Initialize Groq model (must be done inside the function for edge runtime)
    const groqModel = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
    // Get relevant context from RAG system using the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const searchQuery = lastUserMessage?.content || '';
    
    let context = '';
    try {
      // Only try to get context if we have OpenAI API key for embeddings
      if (process.env.OPENAI_API_KEY) {
        context = await getRelevantContext(searchQuery);
      }
    } catch (error) {
      console.error('RAG context error (continuing without context):', error);
      // Continue without context if RAG fails
    }
    
    // Build system prompt with context
    const systemPrompt = `You are a helpful assistant for history students researching primary sources from the U.S. National Archives. 
    
${context ? `Use the following context from primary source documents to answer questions:

${context}

` : ''}Provide accurate, well-sourced answers based on the primary sources. If the context doesn't contain relevant information, say so. Always cite specific documents when possible.`;

    // Prepare messages for the AI - ensure proper format
    const aiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: String(msg.content),
      })),
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
    const errorMessage = error?.message || error?.toString() || 'Failed to process chat request';
    console.error('Error details:', {
      message: errorMessage,
      stack: error?.stack,
      cause: error?.cause,
    });
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

