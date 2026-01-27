import { NextRequest, NextResponse } from 'next/server';
import { searchLocalSpells, searchLocalZones, searchFactions, searchAchievements, searchAAAbilities, searchOverseerMinions, searchOverseerQuests } from '@/lib/data';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  const limitParam = request.nextUrl.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [spells, zones, factions, achievements, aas, overseerMinions, overseerQuests] = await Promise.all([
      searchLocalSpells(q).catch(() => []),
      searchLocalZones(q).catch(() => []),
      searchFactions(q).catch(() => []),
      searchAchievements(q).catch(() => []),
      searchAAAbilities(q).catch(() => []),
      searchOverseerMinions(q).catch(() => []),
      searchOverseerQuests(q).catch(() => []),
    ]);

    const results = [
      ...spells.map(r => ({ ...r, type: 'spell' as const })),
      ...zones.map(r => ({ ...r, type: 'zone' as const })),
      ...factions.map(r => ({ ...r, type: 'faction' as const })),
      ...achievements.map(r => ({ ...r, type: 'achievement' as const })),
      ...aas.map(r => ({ ...r, type: 'aa' as const })),
      ...overseerMinions.map(r => ({ ...r, type: 'overseer' as const })),
      ...overseerQuests.map(r => ({ ...r, type: 'overseer' as const })),
    ].slice(0, limit);

    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
