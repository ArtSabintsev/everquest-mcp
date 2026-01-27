import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getClassInfo, getClassSpellSummary, getSkillCaps, getClassEndgameProfile, getClassRoleAnalysis } from '@/lib/data';
import { CLASS_LIST, CLASS_COLOR_CLASSES, CLASS_ROLES, CLASS_DESCRIPTIONS } from '@/lib/constants';
import { slugToClassName, cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ClassDetailTabs } from './ClassDetailTabs';

// Dynamic rendering - avoid loading all 16 class data sets at build time
export const dynamic = 'force-dynamic';

export default async function ClassDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const className = slugToClassName(name);

  if (!CLASS_LIST.includes(className as typeof CLASS_LIST[number])) {
    notFound();
  }

  const [overview, spellSummary, skills, endgame, roleAnalysis] = await Promise.all([
    getClassInfo(className).catch(() => null),
    getClassSpellSummary(className).catch(() => null),
    getSkillCaps(className).catch(() => null),
    getClassEndgameProfile(className).catch(() => null),
    getClassRoleAnalysis().catch(() => null),
  ]);

  const colorClass = CLASS_COLOR_CLASSES[className] || 'text-[#94a3b8]';
  const role = CLASS_ROLES[className] || '';
  const desc = CLASS_DESCRIPTIONS[className] || '';

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#64748b]">
        <Link href="/classes" className="hover:text-[#8BA4B8]">Classes</Link>
        <span className="mx-2">/</span>
        <span className="text-[#e2e8f0]">{className}</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className={cn('font-[family-name:var(--font-heading)] text-4xl font-bold mb-2', colorClass)}>
          {className}
        </h1>
        <div className="text-[#C9A554] text-sm mb-3">{role}</div>
        <p className="text-[#94a3b8] max-w-3xl">{desc}</p>
      </div>

      {/* Tabs */}
      <ClassDetailTabs
        className={className}
        overview={overview}
        spellSummary={spellSummary}
        skills={skills}
        endgame={endgame}
        roleAnalysis={roleAnalysis}
      />
    </div>
  );
}
