// Lucy - Classic EQ spell/item database (historical data)
import {
  EQDataSource,
  SearchResult,
  SpellData,
  ItemData,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://lucy.allakhazam.com';

export class LucySource extends EQDataSource {
  name = 'Lucy';
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    const [spells, items] = await Promise.all([
      this.searchSpells(query),
      this.searchItems(query),
    ]);
    return [...spells, ...items].slice(0, 20);
  }

  async searchSpells(query: string): Promise<SearchResult[]> {
    const url = `${BASE_URL}/spells.html?Name=${encodeURIComponent(query)}&MaxRows=20`;
    try {
      const html = await fetchPage(url);
      const results: SearchResult[] = [];
      const seenIds = new Set<string>();

      const pattern = /href="spell\.html\?id=(\d+)&[^"]*"[^>]*>([^<]+)/gi;
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const id = match[1];
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const name = stripHtml(match[2]);
        if (name && name.length > 1) {
          results.push({
            name,
            type: 'spell',
            id,
            url: `${BASE_URL}/spell.html?id=${id}`,
            source: this.name,
            description: 'Classic EQ spell data',
          });
        }
      }

      return results.slice(0, 15);
    } catch (error) {
      console.error('[Lucy] Spell search failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  async searchItems(query: string): Promise<SearchResult[]> {
    const url = `${BASE_URL}/items.html?Name=${encodeURIComponent(query)}&MaxRows=20`;
    try {
      const html = await fetchPage(url);
      const results: SearchResult[] = [];
      const seenIds = new Set<string>();

      const pattern = /href="item\.html\?id=(\d+)"[^>]*>([^<]+)/gi;
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const id = match[1];
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const name = stripHtml(match[2]);
        if (name && name.length > 1) {
          results.push({
            name,
            type: 'item',
            id,
            url: `${BASE_URL}/item.html?id=${id}`,
            source: this.name,
            description: 'Classic EQ item data',
          });
        }
      }

      return results.slice(0, 15);
    } catch (error) {
      console.error('[Lucy] Item search failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  async getSpell(id: string): Promise<SpellData | null> {
    const url = `${BASE_URL}/spell.html?id=${id}`;
    try {
      const html = await fetchPage(url);

      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const name = titleMatch ? stripHtml(titleMatch[1]).replace('Lucy -', '').trim() : 'Unknown';

      const data: SpellData = { name, id, source: this.name };

      // Parse mana
      const manaMatch = html.match(/Mana:\s*(\d+)/i);
      if (manaMatch) data.mana = parseInt(manaMatch[1], 10);

      // Parse casting time
      const castMatch = html.match(/Casting\s*Time:\s*([\d.]+)/i);
      if (castMatch) data.castTime = `${castMatch[1]}s`;

      // Parse duration
      const durMatch = html.match(/Duration:\s*([^\n<]+)/i);
      if (durMatch) data.duration = stripHtml(durMatch[1]);

      // Parse effects
      const effects: string[] = [];
      const effectPattern = /Effect\s*\d*:\s*([^\n<]+)/gi;
      let effectMatch;
      while ((effectMatch = effectPattern.exec(html)) !== null) {
        const effect = stripHtml(effectMatch[1]).trim();
        if (effect && effect.length > 2) {
          effects.push(effect);
        }
      }
      if (effects.length > 0) data.effects = effects;

      // Parse classes
      const classMatch = html.match(/Classes?:\s*([^\n<]+)/i);
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

      return data;
    } catch (error) {
      console.error('[Lucy] Get spell failed:', error instanceof Error ? error.message : error);
      return null;
    }
  }

  async getItem(id: string): Promise<ItemData | null> {
    const url = `${BASE_URL}/item.html?id=${id}`;
    try {
      const html = await fetchPage(url);

      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const name = titleMatch ? stripHtml(titleMatch[1]).replace('Lucy -', '').trim() : 'Unknown';

      const data: ItemData = { name, id, source: this.name };

      // Parse basic stats
      const acMatch = html.match(/AC:\s*(\d+)/i);
      if (acMatch) data.ac = parseInt(acMatch[1], 10);

      const dmgMatch = html.match(/DMG:\s*(\d+)/i);
      if (dmgMatch) data.damage = parseInt(dmgMatch[1], 10);

      const delayMatch = html.match(/Delay:\s*(\d+)/i);
      if (delayMatch) data.delay = parseInt(delayMatch[1], 10);

      if (data.damage && data.delay) {
        data.ratio = Math.round((data.damage / data.delay) * 100) / 100;
      }

      // Parse slot
      const slotMatch = html.match(/Slot:\s*([A-Z, ]+)/i);
      if (slotMatch) data.slot = slotMatch[1].trim();

      return data;
    } catch (error) {
      console.error('[Lucy] Get item failed:', error instanceof Error ? error.message : error);
      return null;
    }
  }
}

export const lucy = new LucySource();
