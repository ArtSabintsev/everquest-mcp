import { NextRequest, NextResponse } from 'next/server';
import { getLocalSpell, getSpellStackingInfo } from '@/lib/data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [spell, stacking] = await Promise.all([
      getLocalSpell(id),
      getSpellStackingInfo(id).catch(() => null),
    ]);

    if (!spell) {
      return NextResponse.json({ error: 'Spell not found' }, { status: 404 });
    }

    return NextResponse.json({ spell, stacking });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load spell';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
