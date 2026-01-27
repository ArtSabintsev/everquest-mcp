'use client';

import { useState, useCallback } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ZoneCard } from '@/components/ZoneCard';
import type { ZoneData } from '@/lib/data';

export default function ZonesPage() {
  const [query, setQuery] = useState('');
  const [levelMin, setLevelMin] = useState('');
  const [levelMax, setLevelMax] = useState('');
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    setMarkdown(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (levelMin) params.set('levelMin', levelMin);
      if (levelMax) params.set('levelMax', levelMax);

      const res = await fetch(`/api/zones?${params.toString()}`);
      const data = await res.json();

      if (data.format === 'markdown') {
        setMarkdown(data.data);
        setZones([]);
      } else {
        setZones(data.zones || []);
        setMarkdown(null);
      }
    } catch {
      setZones([]);
    } finally {
      setLoading(false);
    }
  }, [query, levelMin, levelMax]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Zone Browser
        </h1>
        <p className="text-[#94a3b8]">Search zones by name or filter by level range.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search zones by name..."
          className="flex-1 px-4 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={levelMin}
            onChange={e => setLevelMin(e.target.value)}
            placeholder="Min lvl"
            min="1"
            max="125"
            className="w-24 px-3 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
          />
          <input
            type="number"
            value={levelMax}
            onChange={e => setLevelMax(e.target.value)}
            placeholder="Max lvl"
            min="1"
            max="125"
            className="w-24 px-3 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#C9A554] text-[#0C0E14] font-medium rounded-lg hover:bg-[#e6c366] transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#64748b]">Searching zones...</div>
        </div>
      ) : markdown ? (
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <MarkdownRenderer content={markdown} />
        </div>
      ) : zones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map(zone => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#64748b]">
          Enter a zone name or level range to search.
        </div>
      )}
    </div>
  );
}
