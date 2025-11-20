/**
 * RAG (Retrieval-Augmented Generation) system
 * Handles vector similarity search and context retrieval
 */

import { sql } from './neon';
import { generateEmbedding } from './embeddings';

export interface DocumentContext {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  similarity?: number;
}

/**
 * Store document with embedding in the database
 */
export async function storeDocumentWithEmbedding(
  documentId: string,
  title: string,
  content: string,
  metadata?: Record<string, any>
): Promise<void> {
  // Generate embedding for the document content
  const embedding = await generateEmbedding(`${title}\n${content}`);
  
  // Store in database
  await sql`
    INSERT INTO documents (id, title, content, metadata, embedding)
    VALUES (${documentId}, ${title}, ${content}, ${JSON.stringify(metadata)}, ${JSON.stringify(embedding)}::vector)
    ON CONFLICT (id) DO UPDATE
    SET title = ${title}, content = ${content}, metadata = ${JSON.stringify(metadata)}, embedding = ${JSON.stringify(embedding)}::vector
  `;
}

/**
 * Search for similar documents using vector similarity
 */
export async function searchSimilarDocuments(
  query: string,
  limit: number = 5
): Promise<DocumentContext[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);
  
  // Search using cosine similarity
  const results = await sql`
    SELECT 
      id,
      title,
      content,
      metadata,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
    FROM documents
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${limit}
  ` as Array<{
    id: string;
    title: string;
    content: string;
    metadata: Record<string, any>;
    similarity: number;
  }>;
  
  return results.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    metadata: row.metadata,
    similarity: row.similarity,
  }));
}

/**
 * Get relevant context for a query
 */
export async function getRelevantContext(query: string, maxResults: number = 3): Promise<string> {
  try {
    // Check if we have the required environment variables
    if (!process.env.OPENAI_API_KEY || !process.env.NEON_DATABASE_URL) {
      return ''; // Return empty context if embeddings/DB not configured
    }
    
    const documents = await searchSimilarDocuments(query, maxResults);
    
    if (documents.length === 0) {
      return ''; // No documents found
    }
    
    return documents
      .map(doc => `Title: ${doc.title}\nContent: ${doc.content}`)
      .join('\n\n---\n\n');
  } catch (error) {
    console.error('Error getting RAG context:', error);
    return ''; // Return empty context on error
  }
}

