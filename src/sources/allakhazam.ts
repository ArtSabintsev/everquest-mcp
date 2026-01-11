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
  parseNumber,
  normalizeQuery,
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
    const normalizedQuery = normalizeQuery(query);
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

    // Parse mana as number
    const manaMatch = html.match(/Mana:\s*(\d+)/i);
    if (manaMatch) {
      data.mana = parseInt(manaMatch[1], 10);
    }

    // Parse other fields
    const stringFields: [keyof SpellData, string][] = [
      ['castTime', 'Casting Time'],
      ['recastTime', 'Recast Time'],
      ['duration', 'Duration'],
      ['range', 'Range'],
      ['target', 'Target Type'],
      ['resist', 'Resist Type'],
      ['skill', 'Skill'],
    ];

    for (const [field, label] of stringFields) {
      const regex = new RegExp(`${label}[:\\s]*</td>\\s*<td[^>]*>([^<]+)`, 'i');
      const match = html.match(regex);
      if (match) {
        (data as unknown as Record<string, unknown>)[field] = stripHtml(match[1]);
      }
    }

    // Parse classes with levels: "Cleric(1) Druid(5) Shaman(3)"
    const classMatch = html.match(/Classes?[^:]*:[^<]*(?:<[^>]+>)?([^<]+(?:<[^>]+>[^<]*)*?)(?=<\/tr>|<\/table>)/is);
    if (classMatch) {
      const classText = stripHtml(classMatch[1]);
      const classes: Record<string, number> = {};
      const classPattern = /(\w+)\s*\((\d+)\)/g;
      let cm;
      while ((cm = classPattern.exec(classText)) !== null) {
        classes[cm[1]] = parseInt(cm[2], 10);
      }
      if (Object.keys(classes).length > 0) {
        data.classes = classes;
      }
    }

    // Parse spell effects
    const effects: string[] = [];
    const slotPattern = /Slot\s*(\d+):\s*([^<\n]+)/gi;
    let slotMatch;
    while ((slotMatch = slotPattern.exec(html)) !== null) {
      const effect = stripHtml(slotMatch[2]).trim();
      if (effect && effect.length > 2) {
        effects.push(effect);
      }
    }
    if (effects.length > 0) {
      data.effects = effects;
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

    // Parse slot
    const slotMatch = html.match(/Slot:\s*([A-Z, ]+)/i);
    if (slotMatch) {
      data.slot = slotMatch[1].trim();
    }

    // Parse numeric fields
    const acMatch = html.match(/\bAC:\s*(\d+)/i);
    if (acMatch) data.ac = parseInt(acMatch[1], 10);

    const dmgMatch = html.match(/\bDMG:\s*(\d+)/i);
    if (dmgMatch) data.damage = parseInt(dmgMatch[1], 10);

    const delayMatch = html.match(/\bDelay:\s*(\d+)/i);
    if (delayMatch) data.delay = parseInt(delayMatch[1], 10);

    // Calculate ratio
    if (data.damage && data.delay) {
      data.ratio = Math.round((data.damage / data.delay) * 100) / 100;
    }

    const wtMatch = html.match(/\bWT:\s*([\d.]+)/i);
    if (wtMatch) data.weight = parseFloat(wtMatch[1]);

    // Parse required/recommended level
    const reqMatch = html.match(/Required\s*Level:\s*(\d+)/i);
    if (reqMatch) data.required = parseInt(reqMatch[1], 10);

    const recMatch = html.match(/Recommended\s*Level:\s*(\d+)/i);
    if (recMatch) data.recommended = parseInt(recMatch[1], 10);

    // Parse stats into structured object
    const stats: Record<string, number> = {};
    const heroicStats: Record<string, number> = {};

    const statPatterns = [
      { pattern: /\bSTR:\s*([+-]?\d+)/gi, name: 'STR' },
      { pattern: /\bSTA:\s*([+-]?\d+)/gi, name: 'STA' },
      { pattern: /\bAGI:\s*([+-]?\d+)/gi, name: 'AGI' },
      { pattern: /\bDEX:\s*([+-]?\d+)/gi, name: 'DEX' },
      { pattern: /\bWIS:\s*([+-]?\d+)/gi, name: 'WIS' },
      { pattern: /\bINT:\s*([+-]?\d+)/gi, name: 'INT' },
      { pattern: /\bCHA:\s*([+-]?\d+)/gi, name: 'CHA' },
      { pattern: /\bHP:\s*([+-]?\d+)/gi, name: 'HP' },
      { pattern: /\bMANA:\s*([+-]?\d+)/gi, name: 'MANA' },
      { pattern: /\bEND(?:URANCE)?:\s*([+-]?\d+)/gi, name: 'END' },
    ];

    for (const { pattern, name } of statPatterns) {
      const match = pattern.exec(html);
      if (match) {
        stats[name] = parseInt(match[1], 10);
      }
    }

    // Heroic stats
    const heroicPatterns = [
      { pattern: /Heroic\s*STR:\s*([+-]?\d+)/gi, name: 'STR' },
      { pattern: /Heroic\s*STA:\s*([+-]?\d+)/gi, name: 'STA' },
      { pattern: /Heroic\s*AGI:\s*([+-]?\d+)/gi, name: 'AGI' },
      { pattern: /Heroic\s*DEX:\s*([+-]?\d+)/gi, name: 'DEX' },
      { pattern: /Heroic\s*WIS:\s*([+-]?\d+)/gi, name: 'WIS' },
      { pattern: /Heroic\s*INT:\s*([+-]?\d+)/gi, name: 'INT' },
      { pattern: /Heroic\s*CHA:\s*([+-]?\d+)/gi, name: 'CHA' },
    ];

    for (const { pattern, name } of heroicPatterns) {
      const match = pattern.exec(html);
      if (match) {
        heroicStats[name] = parseInt(match[1], 10);
      }
    }

    if (Object.keys(stats).length > 0) data.stats = stats;
    if (Object.keys(heroicStats).length > 0) data.heroicStats = heroicStats;

    // Parse classes as array
    const classMatch = html.match(/Class:\s*([A-Z, ]+)/i);
    if (classMatch) {
      data.classes = classMatch[1].split(/\s*,\s*/).map(c => c.trim()).filter(c => c);
    }

    // Parse races as array
    const raceMatch = html.match(/Race:\s*([A-Z, ]+)/i);
    if (raceMatch) {
      data.races = raceMatch[1].split(/\s*,\s*/).map(r => r.trim()).filter(r => r);
    }

    // Parse effects
    const effects: string[] = [];
    const effectPattern = /Effect:\s*<a[^>]*>([^<]+)/gi;
    let effectMatch;
    while ((effectMatch = effectPattern.exec(html)) !== null) {
      effects.push(effectMatch[1].trim());
    }
    if (effects.length > 0) data.effects = effects;

    // Parse drops from (as array)
    const dropMatches = html.matchAll(/Dropped[^:]*:[^<]*<a[^>]*href="\/db\/npc[^"]*"[^>]*>([^<]+)/gi);
    const drops: string[] = [];
    const seenDrops = new Set<string>();
    for (const match of dropMatches) {
      const npc = stripHtml(match[1]);
      if (npc && !seenDrops.has(npc)) {
        seenDrops.add(npc);
        drops.push(npc);
        if (drops.length >= 10) break;
      }
    }
    if (drops.length > 0) data.dropsFrom = drops;

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

    // Parse connected zones
    const connectedMatches = html.matchAll(/(?:Connects? to|Adjacent)[^<]*<a[^>]*href="\/db\/zone[^"]*"[^>]*>([^<]+)/gi);
    const connected: string[] = [];
    const seenZones = new Set<string>();
    for (const match of connectedMatches) {
      const zone = stripHtml(match[1]);
      if (zone && !seenZones.has(zone)) {
        seenZones.add(zone);
        connected.push(zone);
      }
    }
    if (connected.length > 0) {
      data.connectedZones = connected;
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
