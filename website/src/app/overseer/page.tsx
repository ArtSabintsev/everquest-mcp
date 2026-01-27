'use client';

import { useState } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function OverseerPage() {
  const [tab, setTab] = useState<'agents' | 'quests'>('agents');
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
      const toolName = tab === 'agents' ? 'search_overseer_agents' : 'search_overseer_quests';
      const res = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: toolName, args: { query } }),
      });
      const data = await res.json();
      // Tool returns text content
      const text = data.data?.[0]?.text;
      if (text) {
        setDetail(text);
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id: string) => {
    setLoading(true);
    try {
      const toolName = tab === 'agents' ? 'get_overseer_agent' : 'get_overseer_quest';
      const res = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: toolName, args: { id } }),
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
          Overseer System
        </h1>
        <p className="text-[#94a3b8]">Browse Overseer agents and quests. Search by name or trait.</p>
      </div>

      {/* Tab toggle */}
      <div className="flex border-b border-[#2A3347]">
        <button
          onClick={() => { setTab('agents'); setDetail(null); setResults([]); }}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'agents' ? 'text-[#C9A554] border-[#C9A554]' : 'text-[#94a3b8] border-transparent hover:text-[#e2e8f0]'
          }`}
        >
          Agents
        </button>
        <button
          onClick={() => { setTab('quests'); setDetail(null); setResults([]); }}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'quests' ? 'text-[#C9A554] border-[#C9A554]' : 'text-[#94a3b8] border-transparent hover:text-[#e2e8f0]'
          }`}
        >
          Quests
        </button>
      </div>

      <form onSubmit={search} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={tab === 'agents' ? 'Search agents by name or trait...' : 'Search quests...'}
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

      {detail && !loading && (
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <MarkdownRenderer content={detail} />
        </div>
      )}

      {!detail && results.length > 0 && !loading && (
        <div className="space-y-2">
          {results.map(r => (
            <button
              key={r.id}
              onClick={() => loadDetail(r.id)}
              className="w-full text-left p-3 bg-[#141824] border border-[#2A3347] rounded-lg hover:border-[#C9A554]/30 hover:bg-[#1a2030] transition-colors"
            >
              <div className="text-sm text-[#e2e8f0]">{r.name}</div>
              {r.description && <div className="text-xs text-[#64748b]">{r.description}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
