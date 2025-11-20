/**
 * Embedding generation for RAG system
 * Note: Groq doesn't provide embeddings, so we use OpenAI or another compatible service
 * Alternative options: Cohere, Hugging Face, or local models
 */

export async function generateEmbedding(text: string): Promise<number[]> {
  // Using OpenAI embeddings (requires OPENAI_API_KEY)
  // You can replace this with Cohere, Hugging Face, or another embedding service
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for embeddings. Groq does not provide embeddings.');
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to generate embedding: ${error}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(text => generateEmbedding(text)));
}

