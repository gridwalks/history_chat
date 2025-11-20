'use client';

import { ArchivesDocument } from '@/lib/archives';

interface DocumentViewerProps {
  document: ArchivesDocument;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{document.title}</h1>
      
      {document.thumbnail && (
        <div className="mb-6">
          <img
            src={document.thumbnail}
            alt={document.title}
            className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
          />
        </div>
      )}

      <div className="space-y-4">
        {document.description && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Description</h2>
            <p className="text-gray-900">{document.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {document.date && (
            <div>
              <h3 className="font-semibold text-gray-800">Date</h3>
              <p className="text-gray-900">{document.date}</p>
            </div>
          )}
          {document.creator && (
            <div>
              <h3 className="font-semibold text-gray-800">Creator</h3>
              <p className="text-gray-900">{document.creator}</p>
            </div>
          )}
          {document.type && (
            <div>
              <h3 className="font-semibold text-gray-800">Type</h3>
              <p className="text-gray-900">{document.type}</p>
            </div>
          )}
        </div>

        {document.url && (
          <div>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Full Document →
            </a>
          </div>
        )}

        {document.metadata && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Metadata</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-900">
              {JSON.stringify(document.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

