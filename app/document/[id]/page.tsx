import { notFound } from 'next/navigation';
import DocumentViewer from '@/components/DocumentViewer';
import { ArchivesDocument } from '@/lib/archives';
import Link from 'next/link';

async function getDocument(id: string): Promise<ArchivesDocument | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/archives?id=${id}`,
      { cache: 'no-store' }
    );
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await getDocument(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Search
          </Link>
        </div>
      </header>
      <main className="py-8">
        <DocumentViewer document={document} />
      </main>
    </div>
  );
}

