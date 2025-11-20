import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, generateEmbeddings } from '@/lib/embeddings';
import { storeDocumentWithEmbedding } from '@/lib/rag';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, document } = body;
    
    // Generate single embedding
    if (text) {
      const embedding = await generateEmbedding(text);
      return NextResponse.json({ embedding });
    }
    
    // Generate multiple embeddings
    if (texts && Array.isArray(texts)) {
      const embeddings = await generateEmbeddings(texts);
      return NextResponse.json({ embeddings });
    }
    
    // Store document with embedding
    if (document) {
      const { id, title, content, metadata } = document;
      await storeDocumentWithEmbedding(id, title, content, metadata);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Embeddings API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process embeddings' },
      { status: 500 }
    );
  }
}

