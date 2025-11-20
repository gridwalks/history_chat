'use client';

import { ArchivesDocument } from '@/lib/archives';
import Link from 'next/link';

interface DocumentCardProps {
  document: ArchivesDocument;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link href={`/document/${document.id}`}>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
        {document.thumbnail && (
          <div className="mb-3">
            <img
              src={document.thumbnail}
              alt={document.title}
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900">{document.title}</h3>
        {document.description && (
          <p className="text-sm text-gray-800 line-clamp-3 mb-2">{document.description}</p>
        )}
        <div className="flex flex-wrap gap-2 text-xs text-gray-700">
          {document.date && <span>📅 {document.date}</span>}
          {document.creator && <span>👤 {document.creator}</span>}
          {document.type && <span>📄 {document.type}</span>}
        </div>
      </div>
    </Link>
  );
}

