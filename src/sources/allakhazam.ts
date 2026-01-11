// Allakhazam (ZAM) - Primary EQ database
import {
  EQDataSource,
  SearchResult,
  SpellData,
  ItemData,
  NpcData,
  ZoneData,
  fetchPage,
  stripHtml,
  extractText,
} from './base.js';

const BASE_URL = 'https://everquest.allakhazam.com';

export class AllakhazamSource extends EQDataSource {
  name = 'Allakhazam';
  baseUrl = BASE_URL;

  private async searchByType(
    query: string,
    listUrl: string,
    pattern: RegExp,
    type: SearchResult['type']
  ): Promise<SearchResult[]> {
    const url = `${BASE_URL}${listUrl}${encodeURIComponent(query)}`;
    const html = await fetchPage(url);
    const results: SearchResult[] = [];
    const seenIds = new Set<string>();

    let match;
    while ((match = pattern.exec(html)) !== null) {
      const id = match[1];
      if (seenIds.has(id)) continue;
      seenIds.add(id);

      const name = stripHtml(match[2]);
      if (name && name.length > 1) {
        results.push({
          name,
          type,
          id,
          url: `${BASE_URL}/db/${type}.html?${type === 'npc' ? 'id' : type === 'zone' ? 'zstrat' : type}=${id}`,
          source: this.name,
        });
      }
    }

    return results.slice(0, 20);
  }

  async search(query: string): Promise<SearchResult[]> {
    const [spells, items, npcs] = await Promise.all([
      this.searchSpells(query),
      this.searchItems(query),
      this.searchNpcs(query),
    ]);

    return [...spells.slice(0, 10), ...items.slice(0, 10), ...npcs.slice(0, 10)];
  }

  async searchSpells(query: string): Promise<SearchResult[]> {
    return this.searchByType(
      query,
      '/db/spelllist.html?name=',
      /href="\/db\/spell\.html\?spell=(\d+)"[^>]*>([^<]+)/gi,
      'spell'
    );
  }

  async searchItems(query: string): Promise<SearchResult[]> {
    return this.searchByType(
      query,
      '/db/searchdb.html?iname=',
      /href="[^"]*item\.html\?item=(\d+)"[^>]*>([^<]+)/gi,
      'item'
    );
  }

  async searchNpcs(query: string): Promise<SearchResult[]> {
    return this.searchByType(
      query,
      '/db/npclist.html?name=',
      /href="\/db\/npc\.html\?id=(\d+)"[^>]*>([^<]+)/gi,
      'npc'
    );
  }

  async searchZones(query: string): Promise<SearchResult[]> {
    return this.searchByType(
      query,
      '/db/zone.html?zlist=1&zname=',
      /href="\/db\/zone\.html\?zstrat=(\d+)"[^>]*>([^<]+)/gi,
      'zone'
    );
  }

  async searchQuests(query: string): Promise<SearchResult[]> {
    return this.searchByType(
      query,
      '/db/quest.html?qlist=1&quest=',
      /href="\/db\/quest\.html\?quest=(\d+)"[^>]*>([^<]+)/gi,
      'quest'
    );
  }

  async getSpell(id: string): Promise<SpellData | null> {
    const url = `${BASE_URL}/db/spell.html?spell=${id}`;
    const html = await fetchPage(url);

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const name = titleMatch
      ? stripHtml(titleMatch[1]).replace(' :: Spells :: EverQuest :: ZAM', '').trim()
      : 'Unknown';

    const data: SpellData = { name, id, source: this.name };

    const tableFields: [keyof SpellData, string][] = [
      ['mana', 'Mana'],
      ['castTime', 'Casting Time'],
      ['recastTime', 'Recast Time'],
      ['duration', 'Duration'],
      ['range', 'Range'],
      ['target', 'Target Type'],
      ['resist', 'Resist Type'],
      ['skill', 'Skill'],
    ];

    for (const [field, label] of tableFields) {
      const regex = new RegExp(`<strong>${label}:</strong>\\s*</td>\\s*<td[^>]*>([^<]+)`, 'i');
      const match = html.match(regex);
      if (match) {
        data[field] = stripHtml(match[1]);
      }
    }

    const classMatch = html.match(/Classes that can use[^:]*:([^<]*(?:<[^>]+>[^<]*)*?)(?=<\/tr>|<\/table>)/is);
    if (classMatch) {
      data.classes = stripHtml(classMatch[1]);
    } else {
      const altClassMatch = html.match(/<strong>Classes?:<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
      if (altClassMatch) {
        data.classes = stripHtml(altClassMatch[1]);
      }
    }

    const effectMatch = html.match(/Slot \d+:[^<]*<a[^>]*>([^<]+)/i) ||
                        html.match(/<td[^>]*><i>([^<]{10,200})<\/i>/);
    if (effectMatch) {
      data.effect = effectMatch[1].trim();
    }

    return data;
  }

  async getItem(id: string): Promise<ItemData | null> {
    const url = `${BASE_URL}/db/item.html?item=${id}`;
    const html = await fetchPage(url);

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const name = titleMatch
      ? stripHtml(titleMatch[1]).replace(' :: Items :: EverQuest :: ZAM', '').trim()
      : 'Unknown';

    const data: ItemData = { name, id, source: this.name };

    const tableFields: [keyof ItemData, string][] = [
      ['slot', 'Slot'],
      ['ac', 'AC'],
      ['damage', 'Damage'],
      ['delay', 'Delay'],
      ['weight', 'Weight'],
    ];

    for (const [field, label] of tableFields) {
      const regex = new RegExp(`<strong>${label}:</strong>\\s*</td>\\s*<td[^>]*>([^<]+)`, 'i');
      const match = html.match(regex);
      if (match) {
        data[field] = stripHtml(match[1]);
      }
    }

    const simpleFields: [keyof ItemData, RegExp][] = [
      ['slot', /Slot:\s*([A-Z, ]+)/i],
      ['ac', /\bAC:\s*(\d+)/i],
      ['damage', /\bDMG:\s*(\d+)/i],
      ['delay', /\bDelay:\s*(\d+)/i],
      ['weight', /\bWT:\s*([\d.]+)/i],
    ];

    for (const [field, regex] of simpleFields) {
      if (!data[field]) {
        const match = html.match(regex);
        if (match) {
          data[field] = match[1].trim();
        }
      }
    }

    const statsMatch = html.match(/((?:STR|STA|AGI|DEX|WIS|INT|CHA|HP|MANA|END|AC)[:\s]+[+-]?\d+[^<]*)/gi);
    if (statsMatch) {
      data.stats = statsMatch.map(s => stripHtml(s)).join(' ');
    }

    const classMatch = html.match(/Class:\s*([A-Z, ]+)/i);
    if (classMatch) {
      data.classes = classMatch[1].trim();
    }

    const raceMatch = html.match(/Race:\s*([A-Z, ]+)/i);
    if (raceMatch) {
      data.races = raceMatch[1].trim();
    }

    const effectMatch = html.match(/Effect:\s*<a[^>]*>([^<]+)/i);
    if (effectMatch) {
      data.effect = effectMatch[1].trim();
    }

    const dropMatches = html.matchAll(/Dropped[^:]*:[^<]*<a[^>]*href="\/db\/npc[^"]*"[^>]*>([^<]+)/gi);
    const drops: string[] = [];
    for (const match of dropMatches) {
      drops.push(stripHtml(match[1]));
    }
    if (drops.length > 0) {
      data.dropsFrom = drops.slice(0, 5).join(', ');
    }

    return data;
  }

  async getNpc(id: string): Promise<NpcData | null> {
    const url = `${BASE_URL}/db/npc.html?id=${id}`;
    const html = await fetchPage(url);

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const name = titleMatch
      ? stripHtml(titleMatch[1]).replace(' :: Bestiary :: EverQuest :: ZAM', '').trim()
      : 'Unknown';

    const content = extractText(html, '<div class="nobgrd">', '</div>');
    const raw = stripHtml(content);

    const data: NpcData = { name, id, source: this.name, raw };

    const fields: [keyof NpcData, RegExp][] = [
      ['level', /Level:\s*(\d+(?:\s*-\s*\d+)?)/i],
      ['zone', /Zone:\s*([^\n<]+)/i],
      ['race', /Race:\s*([^\n<]+)/i],
      ['class', /Class:\s*([^\n<]+)/i],
    ];

    for (const [field, regex] of fields) {
      const match = html.match(regex);
      if (match) {
        (data as unknown as Record<string, string>)[field] = match[1].trim();
      }
    }

    const lootMatches = html.matchAll(/href="\/db\/item\.html\?item=\d+"[^>]*>([^<]+)/gi);
    const seenLoot = new Set<string>();
    const loot: string[] = [];
    for (const match of lootMatches) {
      const item = stripHtml(match[1]);
      if (item && !seenLoot.has(item)) {
        seenLoot.add(item);
        loot.push(item);
        if (loot.length >= 20) break;
      }
    }
    if (loot.length > 0) {
      data.loot = loot;
    }

    return data;
  }

  async getZone(id: string): Promise<ZoneData | null> {
    const url = `${BASE_URL}/db/zone.html?zstrat=${id}`;
    const html = await fetchPage(url);

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const name = titleMatch
      ? stripHtml(titleMatch[1]).replace(' :: Zones :: EverQuest :: ZAM', '').trim()
      : 'Unknown';

    const content = extractText(html, '<div class="nobgrd">', '</div>');
    const raw = stripHtml(content);

    const data: ZoneData = { name, id, source: this.name, raw };

    const fields: [keyof ZoneData, RegExp][] = [
      ['levelRange', /Level(?:\s+Range)?:\s*(\d+\s*-\s*\d+)/i],
      ['continent', /Continent:\s*([^\n<]+)/i],
      ['expansion', /Expansion:\s*([^\n<]+)/i],
    ];

    for (const [field, regex] of fields) {
      const match = html.match(regex);
      if (match) {
        (data as unknown as Record<string, string>)[field] = match[1].trim();
      }
    }

    const npcMatches = html.matchAll(/href="\/db\/npc\.html\?id=\d+"[^>]*>([^<]+)/gi);
    const seenNpcs = new Set<string>();
    const npcs: string[] = [];
    for (const match of npcMatches) {
      const npc = stripHtml(match[1]);
      if (npc && !seenNpcs.has(npc)) {
        seenNpcs.add(npc);
        npcs.push(npc);
        if (npcs.length >= 30) break;
      }
    }
    if (npcs.length > 0) {
      data.npcs = npcs;
    }

    return data;
  }
}

export const allakhazam = new AllakhazamSource();
