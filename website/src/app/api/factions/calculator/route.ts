import { NextRequest, NextResponse } from 'next/server';
import { getCharacterFactions } from '@/lib/data';

export async function GET(request: NextRequest) {
  const race = request.nextUrl.searchParams.get('race');
  const deity = request.nextUrl.searchParams.get('deity') || undefined;
  const className = request.nextUrl.searchParams.get('class') || undefined;

  if (!race) {
    return NextResponse.json({ error: 'Race parameter required' }, { status: 400 });
  }

  try {
    const result = await getCharacterFactions(race, deity, className);
    return NextResponse.json({ data: result, format: 'markdown' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Calculation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
