'use client';

import { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function AchievementsPage() {
  const [categories, setCategories] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryContent, setCategoryContent] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; id: string; description?: string }>>([]);
  const [achievementDetail, setAchievementDetail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'list_achievement_categories', args: {} }),
    })
      .then(r => r.json())
      .then(data => setCategories(data.data?.[0]?.text || null))
      .catch(() => {});
  }, []);

  const loadCategory = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setAchievementDetail(null);
    setLoading(true);
    try {
      const res = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'get_achievement_category', args: { category_id: categoryId } }),
      });
      const data = await res.json();
      setCategoryContent(data.data?.[0]?.text || null);
    } catch {
      setCategoryContent(null);
    } finally {
      setLoading(false);
    }
  };

  const searchAchievements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setAchievementDetail(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`);
      const data = await res.json();
      setSearchResults((data.results || []).filter((r: { type: string }) => r.type === 'achievement'));
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAchievement = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'get_achievement', args: { id } }),
      });
      const data = await res.json();
      setAchievementDetail(data.data?.[0]?.text || null);
    } catch {
      setAchievementDetail(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-2">
          Achievements
        </h1>
        <p className="text-[#94a3b8]">Browse the achievement system by category or search by name.</p>
      </div>

      {/* Search */}
      <form onSubmit={searchAchievements} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search achievements..."
          className="flex-1 px-4 py-2.5 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
        />
        <button type="submit" className="px-6 py-2.5 bg-[#C9A554] text-[#0C0E14] font-medium rounded-lg hover:bg-[#e6c366] transition-colors">
          Search
        </button>
      </form>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map(r => (
            <button
              key={r.id}
              onClick={() => loadAchievement(r.id)}
              className="w-full text-left p-3 bg-[#141824] border border-[#2A3347] rounded-lg hover:border-[#C9A554]/30 hover:bg-[#1a2030] transition-colors"
            >
              <div className="text-sm text-[#e2e8f0]">{r.name}</div>
              {r.description && <div className="text-xs text-[#64748b]">{r.description}</div>}
            </button>
          ))}
        </div>
      )}

      {/* Achievement detail */}
      {achievementDetail && (
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <MarkdownRenderer content={achievementDetail} />
        </div>
      )}

      {/* Categories */}
      {categories && (
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#C9A554] mb-4">
            Categories
          </h2>
          <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
            <MarkdownRenderer content={categories} />
          </div>
        </section>
      )}

      {/* Category content */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-[#C9A554]/30 border-t-[#C9A554] rounded-full animate-spin mx-auto" />
        </div>
      )}
      {categoryContent && !loading && (
        <div className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <MarkdownRenderer content={categoryContent} />
        </div>
      )}
    </div>
  );
}
