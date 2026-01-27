import Link from 'next/link';
import { CLASS_COLOR_CLASSES, CLASS_BG_CLASSES, CLASS_ROLES, CLASS_DESCRIPTIONS } from '@/lib/constants';
import { classNameToSlug, cn } from '@/lib/utils';

export function ClassCard({ name }: { name: string }) {
  const colorClass = CLASS_COLOR_CLASSES[name] || 'text-[#94a3b8]';
  const bgClass = CLASS_BG_CLASSES[name] || 'bg-[#2A3347]/50 border-[#3a4560]';
  const role = CLASS_ROLES[name] || '';
  const desc = CLASS_DESCRIPTIONS[name] || '';

  return (
    <Link
      href={`/classes/${classNameToSlug(name)}`}
      className={cn(
        'block p-4 rounded-lg border transition-all hover:scale-[1.02]',
        bgClass
      )}
    >
      <h3 className={cn('font-[family-name:var(--font-heading)] text-lg font-semibold mb-1', colorClass)}>
        {name}
      </h3>
      <div className="text-xs text-[#C9A554] mb-2">{role}</div>
      <p className="text-xs text-[#94a3b8] line-clamp-2">{desc}</p>
    </Link>
  );
}
