/**
 * National Archives Catalog API Client
 * Documentation: https://www.archives.gov/developer
 */

export interface ArchivesDocument {
  id: string;
  title: string;
  description?: string;
  date?: string;
  creator?: string;
  type?: string;
  url?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
}

export interface ArchivesSearchParams {
  q?: string;
  rows?: number;
  start?: number;
  sort?: string;
  f?: Record<string, string>; // filters
}

export interface ArchivesSearchResponse {
  response: {
    docs: ArchivesDocument[];
    numFound: number;
    start: number;
  };
}

const ARCHIVES_API_BASE = 'https://catalog.archives.gov/api/v1';

export async function searchArchives(
  params: ArchivesSearchParams
): Promise<ArchivesSearchResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.q) {
    searchParams.append('q', params.q);
  }
  if (params.rows) {
    searchParams.append('rows', params.rows.toString());
  }
  if (params.start) {
    searchParams.append('start', params.start.toString());
  }
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  const url = `${ARCHIVES_API_BASE}?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Archives API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getDocumentById(id: string): Promise<ArchivesDocument | null> {
  try {
    const response = await fetch(`${ARCHIVES_API_BASE}?naId=${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.opaResponse?.content || null;
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

