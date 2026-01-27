import { NextRequest, NextResponse } from 'next/server';
import { searchFactions, getFaction } from '@/lib/data';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchFactions(q);
    return NextResponse.json({ results: results.slice(0, 50) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
