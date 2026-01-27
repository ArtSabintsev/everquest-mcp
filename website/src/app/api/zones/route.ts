import { NextRequest, NextResponse } from 'next/server';
import { searchZonesByName, searchLocalZonesByLevel, searchLocalZones, getLocalZone } from '@/lib/data';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get('q')?.trim();
  const levelMin = params.get('levelMin') ? parseInt(params.get('levelMin')!, 10) : undefined;
  const levelMax = params.get('levelMax') ? parseInt(params.get('levelMax')!, 10) : undefined;

  try {
    if (levelMin !== undefined && levelMax !== undefined) {
      const result = await searchLocalZonesByLevel(levelMin, levelMax);
      return NextResponse.json({ data: result, format: 'markdown' });
    }

    if (q) {
      const results = await searchLocalZones(q);
      const zones = await Promise.all(
        results.slice(0, 30).map(r => getLocalZone(r.id).catch(() => null))
      );
      return NextResponse.json({ zones: zones.filter(Boolean) });
    }

    // Default: return zone name search for browsing
    const result = await searchZonesByName('', levelMin, levelMax);
    return NextResponse.json({ data: result, format: 'markdown' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
