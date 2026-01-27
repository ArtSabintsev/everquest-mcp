export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getLocalSpell, getSpellStackingInfo, getSpellLine } from '@/lib/data';
import { ResistBadge, ClassBadge, ExpansionBadge } from '@/components/Badge';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import Link from 'next/link';
import { classNameToSlug } from '@/lib/utils';

export default async function SpellDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spell = await getLocalSpell(id).catch(() => null);

  if (!spell) {
    notFound();
  }

  const [stacking, spellLine] = await Promise.all([
    getSpellStackingInfo(id).catch(() => null),
    getSpellLine(spell.name).catch(() => null),
  ]);

  const classEntries = spell.classes
    ? Object.entries(spell.classes).sort((a, b) => a[1] - b[1])
    : [];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#64748b]">
        <Link href="/spells" className="hover:text-[#8BA4B8]">Spells</Link>
        <span className="mx-2">/</span>
        <span className="text-[#e2e8f0]">{spell.name}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
              {spell.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[#64748b]">ID: {spell.id}</span>
              {spell.resist && <ResistBadge type={spell.resist} />}
              {spell.expansion && <ExpansionBadge name={spell.expansion} />}
              {spell.beneficial !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded ${spell.beneficial ? 'bg-[#67B23D]/15 text-[#67B23D]' : 'bg-[#FF4444]/15 text-[#FF4444]'}`}>
                  {spell.beneficial ? 'Beneficial' : 'Detrimental'}
                </span>
              )}
              {spell.category && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#8BA4B8]/15 text-[#8BA4B8]">
                  {spell.category}{spell.subcategory ? ` / ${spell.subcategory}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {spell.description && (
          <p className="text-[#94a3b8] italic">{spell.description}</p>
        )}
      </div>

      {/* Cast Data */}
      <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
          Cast Information
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'Mana', value: spell.mana && spell.mana > 0 ? String(spell.mana) : null },
            { label: 'Endurance', value: spell.endurance && spell.endurance > 0 ? String(spell.endurance) : null },
            { label: 'Cast Time', value: spell.castTime },
            { label: 'Recast Time', value: spell.recastTime },
            { label: 'Recovery Time', value: spell.recoveryTime },
            { label: 'Duration', value: spell.duration },
            { label: 'Range', value: spell.range && spell.range !== '0' ? spell.range : null },
            { label: 'AE Range', value: spell.aeRange && spell.aeRange !== '0' ? spell.aeRange : null },
            { label: 'Target', value: spell.target },
            { label: 'Resist', value: spell.resist },
            { label: 'Skill', value: spell.skill },
            { label: 'Push Back', value: spell.pushBack ? String(spell.pushBack) : null },
            { label: 'Timer ID', value: spell.timerId ? String(spell.timerId) : null },
            { label: 'Teleport Zone', value: spell.teleportZone },
          ]
            .filter(f => f.value)
            .map(f => (
              <div key={f.label}>
                <div className="text-xs text-[#64748b] mb-0.5">{f.label}</div>
                <div className="text-sm text-[#e2e8f0]">{f.value}</div>
              </div>
            ))}
        </div>
      </section>

      {/* Effects */}
      {spell.effects && spell.effects.length > 0 && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Spell Effects
          </h2>
          <div className="space-y-2">
            {spell.effects.map((effect, i) => (
              <div key={i} className="text-sm text-[#94a3b8] pl-4 border-l-2 border-[#2A3347]">
                {effect}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Classes */}
      {classEntries.length > 0 && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Available to Classes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {classEntries.map(([cls, lvl]) => (
              <Link
                key={cls}
                href={`/classes/${classNameToSlug(cls)}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-[#1a2030] transition-colors"
              >
                <ClassBadge name={cls} />
                <span className="text-sm text-[#8BA4B8]">Lvl {lvl}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recourse */}
      {spell.recourseId && spell.recourseName && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Recourse Spell
          </h2>
          <Link
            href={`/spells/${spell.recourseId}`}
            className="text-[#8BA4B8] hover:text-[#C9A554] transition-colors"
          >
            {spell.recourseName} (#{spell.recourseId})
          </Link>
        </section>
      )}

      {/* Spell Line */}
      {spellLine && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Spell Line Progression
          </h2>
          <MarkdownRenderer content={spellLine} />
        </section>
      )}

      {/* Stacking */}
      {stacking && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Stacking Information
          </h2>
          <MarkdownRenderer content={stacking} />
        </section>
      )}
    </div>
  );
}
