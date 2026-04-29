// RaidLoot - Raid drop and loot tracking
import {
  EQDataSource,
  SearchResult,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://www.raidloot.com';

export class RaidLootSource extends EQDataSource {
  name = 'RaidLoot';
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    const indexResults = await this.searchRaidIndex(query).catch((error) => {
      console.error('[RaidLoot] Raid index search failed:', error instanceof Error ? error.message : error);
      return [] as SearchResult[];
    });
    if (indexResults.length > 0) {
      return indexResults.slice(0, 15);
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Fallback aliases for common shorthand and raid names not present in page labels.
    const fallbackPages = [
      { keywords: ['ssra', 'ssratemple', 'ssraeshza'], name: 'Ssraeshza Temple', url: '/raid/ssra' },
      { keywords: ['vt', 'vex thal'], name: 'Vex Thal', url: '/raid/vexthal' },
      { keywords: ['anguish', 'omm', 'fallen palace'], name: 'Citadel of Anguish', url: '/raid/citadel' },
      { keywords: ['tacvi'], name: 'Tacvi', url: '/raid/tacvi' },
      { keywords: ['txevu'], name: 'Txevu', url: '/raid/txevu' },
      { keywords: ['demiplane', 'demi', 'bloodmoon'], name: 'Demi-Plane of Blood', url: '/raid/demiplane' },
      { keywords: ['solteris', 'mayong'], name: 'Solteris', url: '/raid/solteris' },
      { keywords: ['theater', 'theatre', 'blood'], name: 'Theater of Blood', url: '/raid/theater' },
    ];

    for (const page of fallbackPages) {
      if (page.keywords.some(kw => lowerQuery.includes(kw))) {
        results.push({
          name: `${page.name} Loot Tables`,
          type: 'guide',
          id: page.url.slice(1).replace(/\//g, '-'),
          url: `${BASE_URL}${page.url}`,
          source: this.name,
          description: `Raid loot tables and drops for ${page.name}`,
        });
      }
    }

    // Generic raid loot search
    if (lowerQuery.includes('raid') || lowerQuery.includes('loot') || lowerQuery.includes('drop')) {
      results.push({
        name: 'Raid Loot Index',
        type: 'guide',
        id: 'raidloot-main',
        url: `${BASE_URL}/raid/`,
        source: this.name,
        description: 'Browse all raid loot tables by expansion',
      });
    }

    return results.slice(0, 10);
  }

  private async searchRaidIndex(query: string): Promise<SearchResult[]> {
    const html = await fetchPage(`${BASE_URL}/raid/`);
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];

    const queryWords = lowerQuery.split(/\s+/).filter(Boolean);
    const results: SearchResult[] = [];
    const seenUrls = new Set<string>();
    let currentExpansion = '';
    let currentExpansionAbbr = '';

    for (const line of html.split('\n')) {
      const sectionMatch = line.match(/<li class="section exp" data-exp="([^"]+)">([\s\S]*?)<\/li>/i);
      if (sectionMatch) {
        currentExpansionAbbr = stripHtml(sectionMatch[1]);
        currentExpansion = stripHtml(sectionMatch[2].replace(/<small>[\s\S]*?<\/small>/gi, ''));
        continue;
      }

      const linkPattern = /<a id="([^"]+)" href="([^"]+)">([\s\S]*?)<\/a>/gi;
      let linkMatch;
      while ((linkMatch = linkPattern.exec(line)) !== null) {
        const id = stripHtml(linkMatch[1]);
        const href = linkMatch[2];
        const label = stripHtml(linkMatch[3]);
        const haystack = `${currentExpansion} ${currentExpansionAbbr} ${label} ${id}`.toLowerCase();

        const matches =
          haystack.includes(lowerQuery) ||
          queryWords.every(word => haystack.includes(word));
        if (!matches) continue;

        const url = `${BASE_URL}${href}`;
        if (seenUrls.has(url)) continue;
        seenUrls.add(url);

        const name = currentExpansion ? `${currentExpansion}: ${label}` : label;
        results.push({
          name,
          type: 'guide',
          id: id || href.replace(/[^\w]/g, '-'),
          url,
          source: this.name,
          description: currentExpansion
            ? `${label} raid loot for ${currentExpansion}`
            : `${label} raid loot`,
        });
      }
    }

    return results;
  }

  async searchItems(query: string): Promise<SearchResult[]> {
    // RaidLoot doesn't have a direct search API, return empty
    // Items are organized by raid zone
    return [];
  }
}

export const raidloot = new RaidLootSource();
