'use client';

import { Tabs } from '@/components/Tabs';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface ClassDetailTabsProps {
  className: string;
  overview: string | null;
  spellSummary: string | null;
  skills: string | null;
  endgame: string | null;
  roleAnalysis: string | null;
}

function Section({ content }: { content: string | null }) {
  if (!content) return <div className="text-[#64748b] py-8 text-center">Data not available.</div>;
  return (
    <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
      <MarkdownRenderer content={content} />
    </div>
  );
}

export function ClassDetailTabs({ overview, spellSummary, skills, endgame, roleAnalysis }: ClassDetailTabsProps) {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <Section content={overview} />,
    },
    {
      id: 'spells',
      label: 'Spell Book',
      content: <Section content={spellSummary} />,
    },
    {
      id: 'skills',
      label: 'Skills',
      content: <Section content={skills} />,
    },
    {
      id: 'endgame',
      label: 'Endgame Profile',
      content: <Section content={endgame} />,
    },
    {
      id: 'analysis',
      label: 'Role Analysis',
      content: <Section content={roleAnalysis} />,
    },
  ];

  return <Tabs tabs={tabs} />;
}
