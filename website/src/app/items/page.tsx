'use client';

import { useState } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function ItemsPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'search_all', args: { query } }),
      });
      const data = await res.json();
      const text = data.data?.[0]?.text;
      setResults(text || 'No results found.');
    } catch {
      setResults('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Item Search
        </h1>
        <p className="text-[#94a3b8]">
          Search for items across multiple EverQuest databases including Allakhazam, Lucy, and more.
        </p>
      </div>

      <form onSubmit={search} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search items by name..."
          className="flex-1 px-4 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
        />
        <button type="submit" className="px-6 py-2.5 bg-[#C9A554] text-[#0C0E14] font-medium rounded-lg hover:bg-[#e6c366] transition-colors">
          Search
        </button>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#64748b]">Searching across databases...</div>
        </div>
      )}

      {results && !loading && (
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <MarkdownRenderer content={results} />
        </div>
      )}
    </div>
  );
}
