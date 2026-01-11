// Almar's Guides - Quest guides, leveling guides, farming guides
import {
  EQDataSource,
  SearchResult,
  QuestData,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://www.almarsguides.com/eq';

export class AlmarsSource extends EQDataSource {
  name = "Almar's Guides";
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    // Almar's doesn't have a search API, so we search Google with site restriction
    // For now, return known guide categories
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Epic quest guides
    const epicClasses = [
      'bard', 'beastlord', 'berserker', 'cleric', 'druid', 'enchanter',
      'magician', 'monk', 'necromancer', 'paladin', 'ranger', 'rogue',
      'shadowknight', 'shaman', 'warrior', 'wizard'
    ];

    for (const cls of epicClasses) {
      if (lowerQuery.includes(cls) || lowerQuery.includes('epic')) {
        results.push({
          name: `${cls.charAt(0).toUpperCase() + cls.slice(1)} Epic 1.0 Guide`,
          type: 'guide',
          id: `${cls}-epic-1.0`,
          url: `${BASE_URL}/epics/${cls}1.0.cfm`,
          source: this.name,
          description: `Complete walkthrough for the ${cls} epic 1.0 quest`,
        });
        results.push({
          name: `${cls.charAt(0).toUpperCase() + cls.slice(1)} Epic 1.5 Guide`,
          type: 'guide',
          id: `${cls}-epic-1.5`,
          url: `${BASE_URL}/epics/${cls}1.5.cfm`,
          source: this.name,
          description: `Complete walkthrough for the ${cls} epic 1.5 quest`,
        });
        results.push({
          name: `${cls.charAt(0).toUpperCase() + cls.slice(1)} Epic 2.0 Guide`,
          type: 'guide',
          id: `${cls}-epic-2.0`,
          url: `${BASE_URL}/epics/${cls}2.0.cfm`,
          source: this.name,
          description: `Complete walkthrough for the ${cls} epic 2.0 quest`,
        });
      }
    }

    // Leveling guides by expansion
    if (lowerQuery.includes('level') || lowerQuery.includes('leveling') || lowerQuery.includes('xp')) {
      results.push({
        name: 'Leveling Guide Overview',
        type: 'guide',
        id: 'leveling-overview',
        url: `${BASE_URL}/leveling/`,
        source: this.name,
        description: 'Overview of leveling options by level range',
      });
    }

    // Heroic Adventures
    if (lowerQuery.includes('ha') || lowerQuery.includes('heroic') || lowerQuery.includes('gribble')) {
      results.push({
        name: 'Dead Hills Gribble HAs Guide',
        type: 'guide',
        id: 'gribble-ha',
        url: `${BASE_URL}/leveling/CoTF/Locations/DeadHillsGribbleHAs.cfm`,
        source: this.name,
        description: 'Guide to farming Gribble Heroic Adventures in Dead Hills',
      });
    }

    // Farming guides
    if (lowerQuery.includes('farm') || lowerQuery.includes('plat') || lowerQuery.includes('money')) {
      results.push({
        name: 'Farming Guides Overview',
        type: 'guide',
        id: 'farming-overview',
        url: `${BASE_URL}/Farming/`,
        source: this.name,
        description: 'Plat farming and item farming guides',
      });
    }

    // Tradeskill guides
    if (lowerQuery.includes('tradeskill') || lowerQuery.includes('craft')) {
      results.push({
        name: 'Tradeskill Guides',
        type: 'guide',
        id: 'tradeskill-overview',
        url: `${BASE_URL}/Tradeskills/`,
        source: this.name,
        description: 'Tradeskill leveling and recipe guides',
      });
    }

    // Gear guides
    if (lowerQuery.includes('gear') || lowerQuery.includes('equipment') || lowerQuery.includes('armor')) {
      results.push({
        name: 'Gear Guide',
        type: 'guide',
        id: 'gear-guide',
        url: `${BASE_URL}/general/gear.cfm`,
        source: this.name,
        description: 'Gear progression and equipment guides',
      });
    }

    return results.slice(0, 10);
  }

  async searchQuests(query: string): Promise<SearchResult[]> {
    return this.search(query);
  }

  async getQuest(id: string): Promise<QuestData | null> {
    // Map common quest IDs to URLs
    const questUrls: Record<string, string> = {
      'bard-epic-1.0': `${BASE_URL}/epics/bard1.0.cfm`,
      'bard-epic-1.5': `${BASE_URL}/epics/bard1.5.cfm`,
      'bard-epic-2.0': `${BASE_URL}/epics/bard2.0.cfm`,
      'gribble-ha': `${BASE_URL}/leveling/CoTF/Locations/DeadHillsGribbleHAs.cfm`,
    };

    const url = questUrls[id];
    if (!url) {
      return null;
    }

    try {
      const html = await fetchPage(url);
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const name = titleMatch ? stripHtml(titleMatch[1]) : id;

      // Extract main content
      const contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                          html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

      const raw = contentMatch ? stripHtml(contentMatch[1]).slice(0, 2000) : '';

      return {
        name,
        url,
        source: this.name,
        raw,
      };
    } catch (error) {
      console.error("[Almar's] Get quest failed:", error instanceof Error ? error.message : error);
      return null;
    }
  }
}

export const almars = new AlmarsSource();
