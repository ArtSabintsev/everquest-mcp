'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SpellFilters, type SpellFilterValues } from '@/components/SpellFilters';
import { SpellCard } from '@/components/SpellCard';
import { Pagination } from '@/components/Pagination';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { SpellData } from '@/lib/data';

export default function SpellsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[#64748b]">Loading spells...</div>}>
      <SpellsPageContent />
    </Suspense>
  );
}

function SpellsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [query, setQuery] = useState(initialQ);
  const [filters, setFilters] = useState<SpellFilterValues>({});
  const [spells, setSpells] = useState<SpellData[]>([]);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchSpells = useCallback(async (q: string, f: SpellFilterValues, p: number) => {
    setLoading(true);
    setMarkdown(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (f.className) params.set('class', f.className);
      if (f.minLevel) params.set('minLevel', f.minLevel);
      if (f.maxLevel) params.set('maxLevel', f.maxLevel);
      if (f.resist) params.set('resist', f.resist);
      if (f.target) params.set('target', f.target);
      if (f.beneficial) params.set('beneficial', f.beneficial);
      params.set('page', String(p));
      params.set('limit', '20');

      const res = await fetch(`/api/spells?${params.toString()}`);
      const data = await res.json();

      if (data.format === 'markdown') {
        setMarkdown(data.data);
        setSpells([]);
        setTotalPages(0);
      } else {
        setSpells(data.spells || []);
        setTotalPages(data.totalPages || 0);
        setMarkdown(null);
      }
    } catch {
      setSpells([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSpells(query, filters, 1);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`/spells?${params.toString()}`, { scroll: false });
  };

  const handleFiltersChange = (newFilters: SpellFilterValues) => {
    setFilters(newFilters);
    setPage(1);
    fetchSpells(query, newFilters, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchSpells(query, filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial fetch if query is present
  useEffect(() => {
    if (initialQ) {
      fetchSpells(initialQ, {}, initialPage);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Spell Browser
        </h1>
        <p className="text-[#94a3b8]">Search and filter through over 70,000 EverQuest spells.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search spells by name..."
          className="flex-1 px-4 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50 focus:ring-1 focus:ring-[#C9A554]/25"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#C9A554] text-[#0C0E14] font-medium rounded-lg hover:bg-[#e6c366] transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <SpellFilters values={filters} onChange={handleFiltersChange} />

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#64748b]">Searching spells...</div>
        </div>
      ) : markdown ? (
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <MarkdownRenderer content={markdown} />
        </div>
      ) : spells.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spells.map(spell => (
              <SpellCard key={spell.id} spell={spell} />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </>
      ) : query || Object.values(filters).some(Boolean) ? (
        <div className="text-center py-12 text-[#64748b]">
          No spells found. Try a different search term or filters.
        </div>
      ) : (
        <div className="text-center py-12 text-[#64748b]">
          Enter a search term or select filters to browse spells.
        </div>
      )}
    </div>
  );
}
