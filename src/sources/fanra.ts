// Fanra's EverQuest Wiki - General information wiki
import {
  EQDataSource,
  SearchResult,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://everquest.fanra.info';

export class FanraSource extends EQDataSource {
  name = "Fanra's Wiki";
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    try {
      // Use MediaWiki search API
      const url = `${BASE_URL}/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=15&format=json`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EQ-MCP/1.0)',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[Fanra] API returned ${response.status}: ${response.statusText}`);
        return this.searchFallback(query);
      }

      const data = await response.json();

      // Validate OpenSearch response format: [query, [titles], [descriptions], [urls]]
      if (!Array.isArray(data) || data.length < 4) {
        console.error('[Fanra] Unexpected API response format:', typeof data);
        return this.searchFallback(query);
      }

      const titles = Array.isArray(data[1]) ? data[1] : [];
      const descriptions = Array.isArray(data[2]) ? data[2] : [];
      const urls = Array.isArray(data[3]) ? data[3] : [];

      const results: SearchResult[] = [];
      for (let i = 0; i < titles.length; i++) {
        if (typeof titles[i] !== 'string') continue;
        results.push({
          name: titles[i],
          type: 'guide',
          id: encodeURIComponent(titles[i]),
          url: (typeof urls[i] === 'string' ? urls[i] : null) || `${BASE_URL}/wiki/${encodeURIComponent(titles[i])}`,
          source: this.name,
          description: typeof descriptions[i] === 'string' ? descriptions[i] : undefined,
        });
      }

      return results;
    } catch (error) {
      console.error('[Fanra] Search failed:', error instanceof Error ? error.message : error);
      return this.searchFallback(query);
    }
  }

  private searchFallback(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    const queryWords = new Set(lowerQuery.split(/[^a-z0-9]+/).filter(Boolean));

    const knownPages = [
      { keywords: ['agent', 'change', 'instance'], name: 'Agent of Change', url: '/wiki/Agent_of_Change' },
      { keywords: ['heroic', 'adventure', 'ha'], name: 'Heroic Adventures', url: '/wiki/Heroic_Adventures' },
      { keywords: ['mercenary', 'merc'], name: 'Mercenaries', url: '/wiki/Mercenaries' },
      { keywords: ['aa', 'ability', 'alternate'], name: 'Alternate Advancement', url: '/wiki/Alternate_Advancement' },
      { keywords: ['mount', 'riding'], name: 'Mounts', url: '/wiki/Mounts' },
      { keywords: ['familiar'], name: 'Familiars', url: '/wiki/Familiars' },
      { keywords: ['illusion'], name: 'Illusions', url: '/wiki/Illusions' },
      { keywords: ['augment', 'aug'], name: 'Augmentations', url: '/wiki/Augmentations' },
      { keywords: ['tribute'], name: 'Tribute', url: '/wiki/Tribute' },
      { keywords: ['fellowship'], name: 'Fellowships', url: '/wiki/Fellowships' },
      { keywords: ['guild', 'hall'], name: 'Guild Hall', url: '/wiki/Guild_Hall' },
      { keywords: ['housing', 'house'], name: 'Player Housing', url: '/wiki/Player_Housing' },
      { keywords: ['pok', 'knowledge', 'plane of knowledge'], name: 'Plane of Knowledge', url: '/wiki/Plane_of_Knowledge' },
      { keywords: ['hot', 'thule', 'house of thule'], name: 'House of Thule', url: '/wiki/House_of_Thule' },
      { keywords: ['cotf', 'forsaken', 'call of the forsaken'], name: 'Call of the Forsaken', url: '/wiki/Call_of_the_Forsaken' },
      { keywords: ['tds', 'darkened', 'darkened sea'], name: 'The Darkened Sea', url: '/wiki/The_Darkened_Sea' },
      { keywords: ['tbm', 'broken mirror', 'the broken mirror'], name: 'The Broken Mirror', url: '/wiki/The_Broken_Mirror' },
      { keywords: ['eok', 'kunark', 'empires of kunark'], name: 'Empires of Kunark', url: '/wiki/Empires_of_Kunark' },
      { keywords: ['ros', 'ring of scale'], name: 'Ring of Scale', url: '/wiki/Ring_of_Scale' },
      { keywords: ['tbl', 'burning lands', 'the burning lands'], name: 'The Burning Lands', url: '/wiki/The_Burning_Lands' },
      { keywords: ['tov', 'torment of velious'], name: 'Torment of Velious', url: '/wiki/Torment_of_Velious' },
      { keywords: ['cov', 'claws of veeshan'], name: 'Claws of Veeshan', url: '/wiki/Claws_of_Veeshan' },
      { keywords: ['tol', 'terror of luclin'], name: 'Terror of Luclin', url: '/wiki/Terror_of_Luclin' },
      { keywords: ['nos', 'night of shadows'], name: 'Night of Shadows', url: '/wiki/Night_of_Shadows' },
      { keywords: ['ls', 'laurion', 'laurion song'], name: "Laurion's Song", url: '/wiki/Laurion%27s_Song' },
      { keywords: ['tob', 'outer brood', 'the outer brood'], name: 'The Outer Brood', url: '/wiki/The_Outer_Brood' },
      { keywords: ['sor', 'shattering of ro'], name: 'Shattering of Ro', url: '/wiki/Shattering_of_Ro' },
      { keywords: ['conflagrant'], name: 'Conflagrant Gear', url: '/wiki/Conflagrant' },
      { keywords: ['tradeskill', 'craft'], name: 'Tradeskills', url: '/wiki/Tradeskills' },
    ];

    const matchesKeyword = (keyword: string): boolean => {
      const lowerKeyword = keyword.toLowerCase();
      if (lowerKeyword.length <= 3 && !lowerKeyword.includes(' ')) {
        return queryWords.has(lowerKeyword);
      }
      return lowerQuery.includes(lowerKeyword);
    };

    for (const page of knownPages) {
      if (page.keywords.some(matchesKeyword)) {
        results.push({
          name: page.name,
          type: 'guide',
          id: page.name.replace(/\s+/g, '_'),
          url: `${BASE_URL}${page.url}`,
          source: this.name,
        });
      }
    }

    return results;
  }

  async searchQuests(query: string): Promise<SearchResult[]> {
    return this.search(query);
  }
}

export const fanra = new FanraSource();
