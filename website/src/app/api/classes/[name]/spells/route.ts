import { NextRequest, NextResponse } from 'next/server';
import { getSpellsByClass } from '@/lib/data';
import { slugToClassName } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const className = slugToClassName(name);
  const level = request.nextUrl.searchParams.get('level')
    ? parseInt(request.nextUrl.searchParams.get('level')!, 10)
    : undefined;
  const category = request.nextUrl.searchParams.get('category') || undefined;

  try {
    const result = await getSpellsByClass(className, level, category);
    return NextResponse.json({ data: result, className });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load spells';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
