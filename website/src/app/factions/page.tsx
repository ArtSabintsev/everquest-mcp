'use client';

import { useState } from 'react';
import { RACE_LIST, DEITY_LIST, CLASS_LIST } from '@/lib/constants';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TypeBadge } from '@/components/Badge';

export default function FactionsPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ name: string; type: string; id: string; description?: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Calculator state
  const [race, setRace] = useState('');
  const [deity, setDeity] = useState('');
  const [className, setClassName] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const searchFactions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/factions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const calculate = async () => {
    if (!race) return;
    setCalcLoading(true);
    try {
      const params = new URLSearchParams({ race });
      if (deity) params.set('deity', deity);
      if (className) params.set('class', className);
      const res = await fetch(`/api/factions/calculator?${params.toString()}`);
      const data = await res.json();
      setCalcResult(data.data || null);
    } catch {
      setCalcResult(null);
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Factions
        </h1>
        <p className="text-[#94a3b8]">Search factions and calculate starting standings for your character.</p>
      </div>

      {/* Search */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#C9A554] mb-4">
          Search Factions
        </h2>
        <form onSubmit={searchFactions} className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search factions by name..."
            className="flex-1 px-4 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
          />
          <button type="submit" className="px-6 py-2.5 bg-[#C9A554] text-[#0C0E14] font-medium rounded-lg hover:bg-[#e6c366] transition-colors">
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin mx-auto" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="p-3 bg-[#141824] border border-[#2A3347] rounded-lg flex items-center gap-3">
                <TypeBadge type="faction" />
                <div>
                  <div className="text-sm text-[#e2e8f0]">{r.name}</div>
                  {r.description && <div className="text-xs text-[#64748b]">{r.description}</div>}
                </div>
                <span className="ml-auto text-xs text-[#64748b]">#{r.id}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Calculator */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#C9A554] mb-4">
          Starting Faction Calculator
        </h2>
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Race *</label>
              <select
                value={race}
                onChange={e => setRace(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-sm text-[#e2e8f0] focus:outline-none focus:border-[#C9A554]/50"
              >
                <option value="">Select race</option>
                {RACE_LIST.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Deity</label>
              <select
                value={deity}
                onChange={e => setDeity(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-sm text-[#e2e8f0] focus:outline-none focus:border-[#C9A554]/50"
              >
                <option value="">Select deity</option>
                {DEITY_LIST.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Class</label>
              <select
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-sm text-[#e2e8f0] focus:outline-none focus:border-[#C9A554]/50"
              >
                <option value="">Select class</option>
                {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={calculate}
            disabled={!race || calcLoading}
            className="px-6 py-2 bg-[#C9A554] text-[#0C0E14] font-medium rounded-lg hover:bg-[#e6c366] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {calcLoading ? 'Calculating...' : 'Calculate'}
          </button>

          {calcResult && (
            <div className="mt-6">
              <MarkdownRenderer content={calcResult} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
