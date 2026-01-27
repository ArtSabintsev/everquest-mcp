import { CLASS_LIST } from '@/lib/constants';
import { ClassCard } from '@/components/ClassCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classes',
  description: 'Browse all 16 EverQuest classes with spell books, skills, and detailed analysis.',
};

export default function ClassesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Classes of Norrath
        </h1>
        <p className="text-[#94a3b8]">
          Explore all 16 playable classes. Each class page includes a full spell book,
          skill caps, role analysis, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLASS_LIST.map(name => (
          <ClassCard key={name} name={name} />
        ))}
      </div>
    </div>
  );
}
