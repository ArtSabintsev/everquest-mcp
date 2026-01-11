// Zliz's EverQuest Compendium - Comprehensive EQ database
import {
  EQDataSource,
  SearchResult,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://www.zlizeq.com';

export class ZlizSource extends EQDataSource {
  name = "Zliz's Compendium";
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Known resource pages
    const resources = [
      { keywords: ['aa', 'ability', 'alternate'], name: 'AA Calculator', url: '/aa' },
      { keywords: ['spell', 'spells'], name: 'Spell Database', url: '/spells' },
      { keywords: ['item', 'items', 'gear'], name: 'Item Database', url: '/items' },
      { keywords: ['npc', 'mob', 'monster'], name: 'NPC Database', url: '/npcs' },
      { keywords: ['zone', 'zones'], name: 'Zone Guide', url: '/zones' },
      { keywords: ['quest', 'quests'], name: 'Quest Database', url: '/quests' },
      { keywords: ['faction', 'factions'], name: 'Faction Guide', url: '/factions' },
      { keywords: ['map', 'maps'], name: 'Zone Maps', url: '/maps' },
      { keywords: ['timeline', 'expansion', 'history'], name: 'EQ Timeline', url: '/timeline' },
      { keywords: ['class', 'classes'], name: 'Class Guides', url: '/classes' },
      { keywords: ['race', 'races'], name: 'Race Information', url: '/races' },
      { keywords: ['deity', 'god', 'religion'], name: 'Deity Guide', url: '/deities' },
      { keywords: ['skill', 'skills'], name: 'Skill Guide', url: '/skills' },
      { keywords: ['language', 'languages'], name: 'Language Guide', url: '/languages' },
    ];

    for (const resource of resources) {
      if (resource.keywords.some(kw => lowerQuery.includes(kw))) {
        results.push({
          name: resource.name,
          type: 'guide',
          id: resource.url.slice(1),
          url: `${BASE_URL}${resource.url}`,
          source: this.name,
        });
      }
    }

    // Try searching the site directly
    if (results.length < 5) {
      const searchResults = await this.searchSite(query);
      results.push(...searchResults);
    }

    return results.slice(0, 15);
  }

  private async searchSite(query: string): Promise<SearchResult[]> {
    try {
      // Try the spells search
      const url = `${BASE_URL}/spells?search=${encodeURIComponent(query)}`;
      const html = await fetchPage(url);
      const results: SearchResult[] = [];
      const seenIds = new Set<string>();

      // Parse spell results
      const spellPattern = /href="\/spells\/(\d+)[^"]*"[^>]*>([^<]+)/gi;
      let match;
      while ((match = spellPattern.exec(html)) !== null) {
        const id = match[1];
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const name = stripHtml(match[2]);
        if (name && name.length > 1) {
          results.push({
            name,
            type: 'spell',
            id,
            url: `${BASE_URL}/spells/${id}`,
            source: this.name,
          });
        }
      }

      return results.slice(0, 10);
    } catch (error) {
      console.error("[Zliz] Site search failed:", error instanceof Error ? error.message : error);
      return [];
    }
  }

  async searchSpells(query: string): Promise<SearchResult[]> {
    return this.searchSite(query);
  }
}

export const zliz = new ZlizSource();
