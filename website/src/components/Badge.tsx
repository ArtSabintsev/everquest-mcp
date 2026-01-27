import { cn } from '@/lib/utils';
import { RESIST_COLOR_CLASSES, CLASS_COLOR_CLASSES, CLASS_BG_CLASSES } from '@/lib/constants';

export function ResistBadge({ type }: { type: string }) {
  const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const colorClass = RESIST_COLOR_CLASSES[normalized] || 'bg-[#2A3347] text-[#94a3b8] border-[#3a4560]';

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', colorClass)}>
      {type}
    </span>
  );
}

export function ClassBadge({ name }: { name: string }) {
  const colorClass = CLASS_COLOR_CLASSES[name] || 'text-[#94a3b8]';
  const bgClass = CLASS_BG_CLASSES[name] || 'bg-[#2A3347]/50 border-[#3a4560]';

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', bgClass, colorClass)}>
      {name}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    spell: 'bg-[#6B8AFF]/15 text-[#6B8AFF] border-[#6B8AFF]/30',
    zone: 'bg-[#67B23D]/15 text-[#67B23D] border-[#67B23D]/30',
    item: 'bg-[#C9A554]/15 text-[#C9A554] border-[#C9A554]/30',
    npc: 'bg-[#FF7C0A]/15 text-[#FF7C0A] border-[#FF7C0A]/30',
    quest: 'bg-[#F48CBA]/15 text-[#F48CBA] border-[#F48CBA]/30',
    guide: 'bg-[#3FC7EB]/15 text-[#3FC7EB] border-[#3FC7EB]/30',
    faction: 'bg-[#9482C9]/15 text-[#9482C9] border-[#9482C9]/30',
    achievement: 'bg-[#E6CC80]/15 text-[#E6CC80] border-[#E6CC80]/30',
    aa: 'bg-[#00FF98]/15 text-[#00FF98] border-[#00FF98]/30',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
      colors[type] || 'bg-[#2A3347] text-[#94a3b8] border-[#3a4560]'
    )}>
      {type}
    </span>
  );
}

export function ExpansionBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#C9A554]/10 text-[#C9A554] border border-[#C9A554]/25">
      {name}
    </span>
  );
}
