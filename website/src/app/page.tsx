export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getGameDataSummaryDashboard } from '@/lib/data';
import { CLASS_LIST } from '@/lib/constants';
import { ClassCard } from '@/components/ClassCard';
import { SearchBar } from '@/components/SearchBar';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default async function HomePage() {
  let dashboard: string | null = null;
  try {
    dashboard = await getGameDataSummaryDashboard();
  } catch {
    // Data not available
  }

  const sections = [
    { href: '/spells', label: 'Spells', desc: 'Browse 70,000+ spells with filters and detailed breakdowns', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { href: '/classes', label: 'Classes', desc: 'Explore all 16 classes with spell books, skills, and analysis', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { href: '/zones', label: 'Zones', desc: 'Discover zones by level range with map POIs and connections', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { href: '/factions', label: 'Factions', desc: 'Search factions and calculate starting standings', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm0 0h18' },
    { href: '/achievements', label: 'Achievements', desc: 'Browse the achievement tree with categories and requirements', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { href: '/aa', label: 'AAs', desc: 'Search alternate advancement abilities by name', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { href: '/overseer', label: 'Overseer', desc: 'Browse Overseer agents and quests with trait analysis', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { href: '/items', label: 'Items', desc: 'Search items across multiple EverQuest databases', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#C9A554] mb-4">
          EverQuest Encyclopedia
        </h1>
        <p className="text-lg text-[#94a3b8] mb-8 max-w-2xl mx-auto">
          Your complete reference for EverQuest game data. Search spells, classes,
          zones, factions, and more from the game files.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Section Links */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="group p-4 bg-[#141824] border border-[#2A3347] rounded-lg hover:border-[#C9A554]/30 hover:bg-[#1a2030] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-[#C9A554]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                </svg>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#e2e8f0] group-hover:text-[#C9A554] transition-colors">
                  {s.label}
                </h2>
              </div>
              <p className="text-sm text-[#94a3b8]">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Class Grid */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#C9A554] mb-6">
          Classes of Norrath
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CLASS_LIST.map(name => (
            <ClassCard key={name} name={name} />
          ))}
        </div>
      </section>

      {/* Data Dashboard */}
      {dashboard && (
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#C9A554] mb-6">
            Game Data Summary
          </h2>
          <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
            <MarkdownRenderer content={dashboard} />
          </div>
        </section>
      )}
    </div>
  );
}
