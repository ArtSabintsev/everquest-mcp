// EQResource - Modern content, spells database, progression guides
import {
  EQDataSource,
  SearchResult,
  SpellData,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://eqresource.com';
const SPELLS_URL = 'https://spells.eqresource.com';

export class EQResourceSource extends EQDataSource {
  name = 'EQResource';
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Expansion-specific content
    const expansions = [
      { abbr: 'cotf', name: 'Call of the Forsaken', url: 'https://cotf.eqresource.com' },
      { abbr: 'tds', name: 'The Darkened Sea', url: 'https://tds.eqresource.com' },
      { abbr: 'tbm', name: 'The Broken Mirror', url: 'https://tbm.eqresource.com' },
      { abbr: 'eok', name: 'Empires of Kunark', url: 'https://eok.eqresource.com' },
      { abbr: 'ros', name: 'Ring of Scale', url: 'https://ros.eqresource.com' },
      { abbr: 'tbl', name: 'The Burning Lands', url: 'https://tbl.eqresource.com' },
      { abbr: 'tov', name: 'Torment of Velious', url: 'https://tov.eqresource.com' },
      { abbr: 'cov', name: 'Claws of Veeshan', url: 'https://cov.eqresource.com' },
      { abbr: 'tol', name: 'Terror of Luclin', url: 'https://tol.eqresource.com' },
      { abbr: 'nos', name: 'Night of Shadows', url: 'https://nos.eqresource.com' },
      { abbr: 'ls', name: 'Laurion\'s Song', url: 'https://ls.eqresource.com' },
      { abbr: 'hot', name: 'House of Thule', url: 'https://hot.eqresource.com' },
    ];

    for (const exp of expansions) {
      if (lowerQuery.includes(exp.abbr) || lowerQuery.includes(exp.name.toLowerCase())) {
        results.push({
          name: `${exp.name} Overview`,
          type: 'guide',
          id: `${exp.abbr}-overview`,
          url: exp.url,
          source: this.name,
          description: `${exp.name} expansion guides and information`,
        });
        results.push({
          name: `${exp.name} Progression`,
          type: 'guide',
          id: `${exp.abbr}-progression`,
          url: `${exp.url}/progression.php`,
          source: this.name,
          description: `${exp.name} progression/flagging guide`,
        });
      }
    }

    // Spell search
    if (lowerQuery.includes('spell') || results.length === 0) {
      const spellResults = await this.searchSpells(query);
      results.push(...spellResults);
    }

    // Progression guides
    if (lowerQuery.includes('progression') || lowerQuery.includes('flag')) {
      results.push({
        name: 'Progression Guides Index',
        type: 'guide',
        id: 'progression-index',
        url: `${BASE_URL}/progression.php`,
        source: this.name,
        description: 'Index of all expansion progression guides',
      });
    }

    // Hunter achievements
    if (lowerQuery.includes('hunter') || lowerQuery.includes('achievement')) {
      results.push({
        name: 'Hunter Achievement Guides',
        type: 'guide',
        id: 'hunter-guides',
        url: `${BASE_URL}/hunters.php`,
        source: this.name,
        description: 'Hunter achievement guides by expansion',
      });
    }

    return results.slice(0, 15);
  }

  async searchSpells(query: string): Promise<SearchResult[]> {
    try {
      const url = `${SPELLS_URL}/spellsearch.php?name=${encodeURIComponent(query)}`;
      const html = await fetchPage(url);
      const results: SearchResult[] = [];
      const seenIds = new Set<string>();

      // Parse spell results from the table
      const spellPattern = /href="spells\.php\?id=(\d+)"[^>]*>([^<]+)/gi;
      let match;
      while ((match = spellPattern.exec(html)) !== null) {
        const id = match[1];
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const name = stripHtml(match[2]);
        if (name) {
          results.push({
            name,
            type: 'spell',
            id,
            url: `${SPELLS_URL}/spells.php?id=${id}`,
            source: this.name,
          });
        }
      }

      return results.slice(0, 20);
    } catch (error) {
      console.error('[EQResource] Spell search failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  async getSpell(id: string): Promise<SpellData | null> {
    try {
      const url = `${SPELLS_URL}/spells.php?id=${id}`;
      const html = await fetchPage(url);

      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const name = titleMatch ? stripHtml(titleMatch[1]).replace(' - EQ Resource', '').trim() : 'Unknown';

      const data: SpellData = { name, id, source: this.name };

      // Parse spell details from the page
      const fields: [keyof SpellData, RegExp][] = [
        ['mana', /Mana:\s*(\d+)/i],
        ['castTime', /Cast(?:ing)?\s*Time:\s*([\d.]+)/i],
        ['recastTime', /Recast\s*Time:\s*([\d.]+)/i],
        ['duration', /Duration:\s*([^\n<]+)/i],
        ['range', /Range:\s*(\d+)/i],
        ['target', /Target(?:\s*Type)?:\s*([^\n<]+)/i],
        ['resist', /Resist(?:\s*Type)?:\s*([^\n<]+)/i],
        ['classes', /Classes?:\s*([^\n<]+)/i],
      ];

      for (const [field, regex] of fields) {
        const match = html.match(regex);
        if (match) {
          data[field] = match[1].trim();
        }
      }

      return data;
    } catch (error) {
      console.error('[EQResource] Get spell failed:', error instanceof Error ? error.message : error);
      return null;
    }
  }
}

export const eqresource = new EQResourceSource();
