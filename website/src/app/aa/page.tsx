'use client';

import { useState } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function AAPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ name: string; id: string; description?: string }>>([]);
  const [detail, setDetail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=30`);
      const data = await res.json();
      setResults((data.results || []).filter((r: { type: string }) => r.type === 'aa'));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAA = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'get_aa', args: { id } }),
      });
      const data = await res.json();
      setDetail(data.data?.[0]?.text || null);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Alternate Advancement
        </h1>
        <p className="text-[#94a3b8]">Search AA abilities by name to view ranks, costs, and effects.</p>
      </div>

      <form onSubmit={search} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search AA abilities..."
          className="flex-1 px-4 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
        />
        <button type="submit" className="px-6 py-2.5 bg-[#C9A554] text-[#0C0E14] font-medium rounded-lg hover:bg-[#e6c366] transition-colors">
          Search
        </button>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {detail && (
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <button
            onClick={() => setDetail(null)}
            className="text-sm text-[#8BA4B8] hover:text-[#C9A554] mb-4"
          >
            &larr; Back to results
          </button>
          <MarkdownRenderer content={detail} />
        </div>
      )}

      {!detail && results.length > 0 && (
        <div className="space-y-2">
          {results.map(r => (
            <button
              key={r.id}
              onClick={() => loadAA(r.id)}
              className="w-full text-left p-3 bg-[#141824] border border-[#2A3347] rounded-lg hover:border-[#C9A554]/30 hover:bg-[#1a2030] transition-colors"
            >
              <div className="text-sm text-[#e2e8f0]">{r.name}</div>
              {r.description && <div className="text-xs text-[#64748b] mt-0.5">{r.description}</div>}
            </button>
          ))}
        </div>
      )}

      {!loading && !detail && results.length === 0 && query && (
        <div className="text-center py-12 text-[#64748b]">No AA abilities found.</div>
      )}
    </div>
  );
}
