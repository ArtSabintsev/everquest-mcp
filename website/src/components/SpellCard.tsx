import Link from 'next/link';
import type { SpellData } from '@/lib/data';
import { ResistBadge, ClassBadge, ExpansionBadge } from './Badge';

export function SpellCard({ spell }: { spell: SpellData }) {
  const classEntries = spell.classes
    ? Object.entries(spell.classes).sort((a, b) => a[1] - b[1])
    : [];

  return (
    <Link
      href={`/spells/${spell.id}`}
      className="block p-4 bg-[#141824] border border-[#2A3347] rounded-lg hover:border-[#C9A554]/30 hover:bg-[#1a2030] transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-[#e2e8f0] font-medium">{spell.name}</h3>
        <span className="text-xs text-[#64748b] shrink-0">#{spell.id}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {spell.resist && spell.resist !== 'Unresistable' && (
          <ResistBadge type={spell.resist} />
        )}
        {spell.expansion && <ExpansionBadge name={spell.expansion} />}
        {spell.beneficial !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded ${spell.beneficial ? 'bg-[#67B23D]/15 text-[#67B23D]' : 'bg-[#FF4444]/15 text-[#FF4444]'}`}>
            {spell.beneficial ? 'Beneficial' : 'Detrimental'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#94a3b8] mb-3">
        {spell.mana !== undefined && spell.mana > 0 && (
          <div>Mana: <span className="text-[#8BA4B8]">{spell.mana}</span></div>
        )}
        {spell.castTime && (
          <div>Cast: <span className="text-[#8BA4B8]">{spell.castTime}</span></div>
        )}
        {spell.duration && (
          <div>Duration: <span className="text-[#8BA4B8]">{spell.duration}</span></div>
        )}
        {spell.target && (
          <div>Target: <span className="text-[#8BA4B8]">{spell.target}</span></div>
        )}
        {spell.range && spell.range !== '0' && (
          <div>Range: <span className="text-[#8BA4B8]">{spell.range}</span></div>
        )}
      </div>

      {spell.effects && spell.effects.length > 0 && (
        <div className="text-xs text-[#94a3b8] mb-2">
          {spell.effects.slice(0, 3).map((e, i) => (
            <div key={i} className="truncate">{e}</div>
          ))}
          {spell.effects.length > 3 && (
            <div className="text-[#64748b]">+{spell.effects.length - 3} more effects</div>
          )}
        </div>
      )}

      {classEntries.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {classEntries.slice(0, 6).map(([cls, lvl]) => (
            <span key={cls} className="text-xs text-[#64748b]">
              <ClassBadge name={cls} /> {lvl}
            </span>
          ))}
          {classEntries.length > 6 && (
            <span className="text-xs text-[#64748b]">+{classEntries.length - 6} more</span>
          )}
        </div>
      )}
    </Link>
  );
}
