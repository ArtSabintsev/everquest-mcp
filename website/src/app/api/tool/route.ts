import { NextRequest, NextResponse } from 'next/server';
import { handleToolCall } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const { name, args } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Missing tool name' }, { status: 400 });
    }
    const result = await handleToolCall(name, args || {});
    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
