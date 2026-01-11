// RaidLoot - Raid drop and loot tracking
import {
  EQDataSource,
  SearchResult,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://raidloot.com/EQ';

export class RaidLootSource extends EQDataSource {
  name = 'RaidLoot';
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Known raid expansions and zones
    const raidZones = [
      { keywords: ['ssra', 'ssratemple', 'temple'], name: 'Ssraeshza Temple', url: '/Ssraeshza' },
      { keywords: ['vt', 'vex thal'], name: 'Vex Thal', url: '/VexThal' },
      { keywords: ['anguish', 'omm'], name: 'Anguish, the Fallen Palace', url: '/Anguish' },
      { keywords: ['tacvi', 'txevu'], name: 'Tacvi', url: '/Tacvi' },
      { keywords: ['demiplane', 'demi', 'bloodmoon'], name: 'Demiplane of Blood', url: '/Demiplane' },
      { keywords: ['solteris', 'mayong'], name: 'Solteris', url: '/Solteris' },
      { keywords: ['crystallos', 'kerafyrm'], name: 'Crystallos', url: '/Crystallos' },
      { keywords: ['theater', 'theatre', 'blood'], name: 'Theater of Blood', url: '/Theater' },
      { keywords: ['underfoot', 'convorteum'], name: 'Underfoot', url: '/Underfoot' },
      { keywords: ['veil of alaris', 'voa', 'resplendent'], name: 'Veil of Alaris', url: '/VoA' },
      { keywords: ['rain of fear', 'rof', 'heart of fear'], name: 'Rain of Fear', url: '/RoF' },
      { keywords: ['cotf', 'call of the forsaken', 'argin'], name: 'Call of the Forsaken', url: '/CotF' },
      { keywords: ['tds', 'darkened sea', 'combine'], name: 'The Darkened Sea', url: '/TDS' },
      { keywords: ['tbm', 'broken mirror', 'anashti'], name: 'The Broken Mirror', url: '/TBM' },
      { keywords: ['eok', 'empires of kunark', 'lceanium'], name: 'Empires of Kunark', url: '/EoK' },
      { keywords: ['ros', 'ring of scale', 'vp'], name: 'Ring of Scale', url: '/RoS' },
      { keywords: ['tbl', 'burning lands', 'mearatas'], name: 'The Burning Lands', url: '/TBL' },
      { keywords: ['tov', 'torment of velious', 'velious'], name: 'Torment of Velious', url: '/ToV' },
      { keywords: ['cov', 'claws of veeshan'], name: 'Claws of Veeshan', url: '/CoV' },
      { keywords: ['tol', 'terror of luclin', 'luclin'], name: 'Terror of Luclin', url: '/ToL' },
      { keywords: ['nos', 'night of shadows', 'shadow'], name: 'Night of Shadows', url: '/NoS' },
      { keywords: ['ls', 'laurion song'], name: "Laurion's Song", url: '/LS' },
    ];

    for (const zone of raidZones) {
      if (zone.keywords.some(kw => lowerQuery.includes(kw))) {
        results.push({
          name: `${zone.name} Loot Tables`,
          type: 'guide',
          id: zone.url.slice(1).toLowerCase(),
          url: `${BASE_URL}${zone.url}`,
          source: this.name,
          description: `Raid loot tables and drops for ${zone.name}`,
        });
      }
    }

    // Generic raid loot search
    if (lowerQuery.includes('raid') || lowerQuery.includes('loot') || lowerQuery.includes('drop')) {
      results.push({
        name: 'Raid Loot Database',
        type: 'guide',
        id: 'raidloot-main',
        url: BASE_URL,
        source: this.name,
        description: 'Browse all raid loot tables by expansion',
      });
    }

    return results.slice(0, 10);
  }

  async searchItems(query: string): Promise<SearchResult[]> {
    // RaidLoot doesn't have a direct search API, return empty
    // Items are organized by raid zone
    return [];
  }
}

export const raidloot = new RaidLootSource();
