'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TypeBadge } from '@/components/Badge';

interface SearchResult {
  name: string;
  type: string;
  id: string;
  description?: string;
  source?: string;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[#64748b]">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50`)
      .then(r => r.json())
      .then(data => setResults(data.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const type = r.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(r);
    return acc;
  }, {});

  const typeOrder = ['spell', 'zone', 'faction', 'achievement', 'aa', 'overseer', 'item', 'npc', 'quest', 'other'];
  const sortedTypes = Object.keys(grouped).sort((a, b) => {
    const ai = typeOrder.indexOf(a);
    const bi = typeOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  function getLink(result: SearchResult): string {
    if (result.type === 'spell') return `/spells/${result.id}`;
    if (result.type === 'zone') return `/zones/${result.id}`;
    return '#';
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Search Results
        </h1>
        {q && (
          <p className="text-[#94a3b8]">
            Showing results for &ldquo;<span className="text-[#e2e8f0]">{q}</span>&rdquo;
            {!loading && <span className="ml-2 text-[#64748b]">({results.length} results)</span>}
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#64748b]">Searching...</div>
        </div>
      ) : sortedTypes.length > 0 ? (
        <div className="space-y-8">
          {sortedTypes.map(type => (
            <section key={type}>
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-3 capitalize">
                {type === 'aa' ? 'Alternate Advancement' : type + 's'}
                <span className="text-[#64748b] text-sm ml-2">({grouped[type].length})</span>
              </h2>
              <div className="space-y-2">
                {grouped[type].map(r => {
                  const href = getLink(r);
                  const inner = (
                    <>
                      <TypeBadge type={r.type} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-[#e2e8f0]">{r.name}</div>
                        {r.description && (
                          <div className="text-xs text-[#64748b] truncate">{r.description}</div>
                        )}
                      </div>
                      {r.source && (
                        <span className="text-xs text-[#64748b] shrink-0">{r.source}</span>
                      )}
                    </>
                  );
                  const cls = "flex items-center gap-3 p-3 bg-[#141824] border border-[#2A3347] rounded-lg hover:border-[#C9A554]/30 hover:bg-[#1a2030] transition-colors";
                  return href !== '#' ? (
                    <Link key={`${r.type}-${r.id}`} href={href} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={`${r.type}-${r.id}`} className={cls}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-12 text-[#64748b]">
          No results found for &ldquo;{q}&rdquo;. Try a different search term.
        </div>
      ) : (
        <div className="text-center py-12 text-[#64748b]">
          Enter a search term in the search bar above.
        </div>
      )}
    </div>
  );
}
