import { NextRequest, NextResponse } from 'next/server';
import { searchArchives, getDocumentById, ArchivesSearchParams } from '@/lib/archives';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // If ID is provided, fetch single document
    if (id) {
      const document = await getDocumentById(id);
      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(document);
    }
    
    // Otherwise, perform search
    const params: ArchivesSearchParams = {
      q: searchParams.get('q') || undefined,
      rows: parseInt(searchParams.get('rows') || '20'),
      start: parseInt(searchParams.get('start') || '0'),
      sort: searchParams.get('sort') || undefined,
    };
    
    const results = await searchArchives(params);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Archives API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Archives API' },
      { status: 500 }
    );
  }
}

