import { NextRequest, NextResponse } from 'next/server';
import { searchSpellsAdvanced, searchLocalSpells, getLocalSpell } from '@/lib/data';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get('q')?.trim();
  const className = params.get('class') || undefined;
  const minLevel = params.get('minLevel') ? parseInt(params.get('minLevel')!, 10) : undefined;
  const maxLevel = params.get('maxLevel') ? parseInt(params.get('maxLevel')!, 10) : undefined;
  const resist = params.get('resist') || undefined;
  const target = params.get('target') || undefined;
  const beneficial = params.get('beneficial');
  const page = parseInt(params.get('page') || '1', 10);
  const limit = parseInt(params.get('limit') || '20', 10);

  try {
    // If we have filters, use advanced search
    const hasFilters = className || minLevel || maxLevel || resist || target || beneficial;

    if (hasFilters) {
      const criteria: Record<string, unknown> = {};
      if (className) criteria.class = className;
      if (minLevel) criteria.minLevel = minLevel;
      if (maxLevel) criteria.maxLevel = maxLevel;
      if (resist) criteria.resistType = resist;
      if (target) criteria.targetType = target;
      if (beneficial) criteria.beneficial = beneficial === 'Beneficial';
      if (q) criteria.nameContains = q;

      const markdownResult = await searchSpellsAdvanced(criteria as Parameters<typeof searchSpellsAdvanced>[0]);
      // Parse markdown to extract spell IDs (lines typically contain spell names and IDs)
      return NextResponse.json({ data: markdownResult, page, format: 'markdown' });
    }

    // Simple name search
    if (q) {
      const results = await searchLocalSpells(q);
      const total = results.length;
      const start = (page - 1) * limit;
      const pageResults = results.slice(start, start + limit);

      // Fetch full spell data for each result
      const spells = await Promise.all(
        pageResults.map(r => getLocalSpell(r.id).catch(() => null))
      );

      return NextResponse.json({
        spells: spells.filter(Boolean),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    return NextResponse.json({ spells: [], total: 0, page: 1, totalPages: 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
