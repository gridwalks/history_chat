# History Research App

A Next.js application that helps history students perform research and identify primary sources from the U.S. National Archives. Built with Next.js, Neon PostgreSQL (RAG), and Groq AI.

## Features

- **Hybrid Interface**: Search bar + chat interface for questions
- **Collection Browsing**: Browse National Archives collections with filters
- **AI Analysis**: Groq AI provides context and analysis of primary sources
- **RAG System**: Semantic search using vector embeddings stored in Neon PostgreSQL

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Database**: Neon PostgreSQL with pgvector extension
- **AI**: Groq API for document analysis and chat
- **Data Source**: National Archives Catalog API
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database
- Groq API key
- OpenAI API key (for embeddings - Groq doesn't provide embeddings)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gridwalks/history_chat.git
cd history_chat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEON_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ARCHIVES_API_KEY=your_archives_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Initialize the database:
```bash
# Run the SQL schema in your Neon database
# Or use the init script (requires tsx):
npx tsx scripts/init-db.ts
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/
├── app/
│   ├── api/              # API routes
│   │   ├── archives/     # National Archives API
│   │   ├── chat/         # Groq chat endpoint
│   │   ├── embeddings/   # RAG embedding endpoints
│   │   └── search/       # Vector search endpoint
│   ├── chat/             # Chat interface page
│   └── document/[id]     # Document detail page
├── lib/
│   ├── neon.ts           # Neon database client
│   ├── groq.ts           # Groq API client
│   ├── archives.ts       # National Archives API client
│   ├── embeddings.ts     # Embedding generation
│   └── rag.ts            # RAG retrieval logic
└── components/           # React components
```

## API Endpoints

- `GET /api/archives` - Search National Archives
- `GET /api/archives?id=...` - Get document by ID
- `POST /api/chat` - Chat with AI about documents
- `POST /api/embeddings` - Generate embeddings
- `GET /api/search?q=...` - Vector similarity search

## Deploy on Netlify

The easiest way to deploy this Next.js app is using [Netlify](https://www.netlify.com/):

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

The `netlify.toml` file is already configured for Next.js.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Neon PostgreSQL](https://neon.tech)
- [Groq API](https://console.groq.com)
- [National Archives API](https://www.archives.gov/developer)
