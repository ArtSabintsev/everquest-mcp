// EQInterface - UI mods, maps, and tools
import {
  EQDataSource,
  SearchResult,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://www.eqinterface.com/downloads';

export class EQInterfaceSource extends EQDataSource {
  name = 'EQInterface';
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Common UI/mod categories
    const categories = [
      { keywords: ['map', 'maps', 'brewall', 'good'], name: "Brewall's Maps", url: '/fileinfo.php?id=5463', description: 'Updated zone maps with POIs' },
      { keywords: ['map', 'maps', 'goods'], name: "Good's Maps", url: '/fileinfo.php?id=6330', description: 'Detailed zone maps' },
      { keywords: ['ui', 'interface', 'custom', 'sparxx'], name: 'Sparxx UI', url: '/fileinfo.php?id=6429', description: 'Popular custom UI' },
      { keywords: ['ui', 'interface', 'nillipuss'], name: 'Nillipuss UI', url: '/fileinfo.php?id=6326', description: 'Clean modern UI' },
      { keywords: ['gina', 'trigger', 'audio', 'alert'], name: 'GINA Triggers', url: 'https://eq.gimasgames.com/gina/', description: 'Audio/visual trigger system' },
      { keywords: ['gamparse', 'parse', 'parser', 'dps'], name: 'GamParse', url: '/fileinfo.php?id=5765', description: 'Log parser for DPS/healing' },
      { keywords: ['spell', 'timer', 'spellset'], name: 'Spell Timers', url: '/fileinfo.php?id=4846', description: 'Spell timer window' },
      { keywords: ['target', 'ring', 'indicator'], name: 'Target Ring', url: '/fileinfo.php?id=5208', description: 'Target ring indicator' },
      { keywords: ['buff', 'window', 'extended'], name: 'Extended Buff Window', url: '/fileinfo.php?id=5147', description: 'Expanded buff display' },
      { keywords: ['audio', 'sound', 'trigger', 'eq audio'], name: 'EQ Audio Triggers', url: '/fileinfo.php?id=5851', description: 'Audio trigger system' },
    ];

    for (const cat of categories) {
      if (cat.keywords.some(kw => lowerQuery.includes(kw))) {
        const isExternal = cat.url.startsWith('http');
        results.push({
          name: cat.name,
          type: 'guide',
          id: cat.url.replace(/[^\w]/g, '-'),
          url: isExternal ? cat.url : `${BASE_URL}${cat.url}`,
          source: this.name,
          description: cat.description,
        });
      }
    }

    // Generic UI search
    if (results.length === 0 && (lowerQuery.includes('ui') || lowerQuery.includes('mod') || lowerQuery.includes('interface'))) {
      results.push({
        name: 'EQInterface Downloads',
        type: 'guide',
        id: 'eqinterface-main',
        url: 'https://www.eqinterface.com/downloads/index.php',
        source: this.name,
        description: 'Browse all EQ UI mods and tools',
      });
    }

    return results.slice(0, 10);
  }
}

export const eqinterface = new EQInterfaceSource();
