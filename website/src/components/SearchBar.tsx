'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  name: string;
  type: string;
  id: string;
  description?: string;
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      setResults(data.results || []);
      setOpen(true);
      setSelectedIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const navigate = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    const type = result.type;
    if (type === 'spell') router.push(`/spells/${result.id}`);
    else if (type === 'zone') router.push(`/zones/${result.id}`);
    else router.push(`/search?q=${encodeURIComponent(result.name)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      navigate(results[selectedIndex]);
    } else if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typeColors: Record<string, string> = {
    spell: 'text-[#6B8AFF]',
    zone: 'text-[#67B23D]',
    item: 'text-[#C9A554]',
    npc: 'text-[#FF7C0A]',
    quest: 'text-[#F48CBA]',
    faction: 'text-[#9482C9]',
    achievement: 'text-[#3FC7EB]',
    aa: 'text-[#E6CC80]',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search spells, zones, classes..."
            className={cn(
              'w-full pl-10 pr-4 bg-[#1a1f2e] border border-[#2A3347] rounded-lg',
              'text-[#e2e8f0] placeholder-[#64748b]',
              'focus:outline-none focus:border-[#C9A554]/50 focus:ring-1 focus:ring-[#C9A554]/25',
              'transition-colors',
              compact ? 'py-1.5 text-sm' : 'py-2.5 text-base'
            )}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-[#141824] border border-[#2A3347] rounded-lg shadow-xl overflow-hidden">
          {results.map((result, i) => (
            <button
              key={`${result.type}-${result.id}`}
              className={cn(
                'w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors',
                i === selectedIndex ? 'bg-[#1a2030]' : 'hover:bg-[#1a2030]'
              )}
              onClick={() => navigate(result)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className={cn('text-xs font-medium uppercase tracking-wider w-14 shrink-0', typeColors[result.type] || 'text-[#64748b]')}>
                {result.type}
              </span>
              <div className="min-w-0">
                <div className="text-sm text-[#e2e8f0] truncate">{result.name}</div>
                {result.description && (
                  <div className="text-xs text-[#64748b] truncate">{result.description}</div>
                )}
              </div>
            </button>
          ))}
          <div className="px-4 py-2 border-t border-[#2A3347] text-xs text-[#64748b]">
            Press Enter to search all results
          </div>
        </div>
      )}
    </div>
  );
}
