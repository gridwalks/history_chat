'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ChatInterface from '@/components/ChatInterface';
import DocumentCard from '@/components/DocumentCard';
import { ArchivesDocument } from '@/lib/archives';

export default function Home() {
  const [searchResults, setSearchResults] = useState<ArchivesDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    try {
      const response = await fetch(`/api/archives?q=${encodeURIComponent(query)}&rows=20`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      const docs = data.response?.docs || [];
      setSearchResults(docs);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">History Research App</h1>
          <p className="text-gray-600 mt-2">
            Explore primary sources from the U.S. National Archives
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Search and Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Search National Archives</h2>
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>

            {searchQuery && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Search Results {searchResults.length > 0 && `(${searchResults.length})`}
                </h2>
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No results found. Try a different search query.</p>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Welcome to the History Research App! This tool helps you discover and analyze
                    primary sources from the U.S. National Archives.
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">Features:</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Search millions of historical documents</li>
                      <li>Get AI-powered analysis and context</li>
                      <li>Browse collections by topic, date, or creator</li>
                      <li>Access primary source materials for research</li>
                    </ul>
                  </div>
                  <p className="pt-4">
                    Start by searching for a topic, historical event, or document type in the search
                    bar above, or ask a question in the chat panel.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Powered by National Archives API, Neon PostgreSQL, and Groq AI
          </p>
        </div>
      </footer>
    </div>
  );
}
