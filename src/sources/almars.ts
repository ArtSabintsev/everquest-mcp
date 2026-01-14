// Almar's Guides - Quest guides, leveling guides, farming guides
import {
  EQDataSource,
  SearchResult,
  QuestData,
  QuestStep,
  QuestNpc,
  QuestItem,
  DialogEntry,
  fetchPage,
  stripHtml,
  extractCoordinates,
} from './base.js';

const BASE_URL = 'https://www.almarsguides.com/eq';

// Known EQ zone names for extraction
const KNOWN_ZONES = [
  'Plane of Knowledge', 'East Karana', 'West Karana', 'South Karana', 'North Karana',
  'Rathe Mountains', 'Lake Rathetear', 'Ocean of Tears', 'Oasis of Marr',
  'Upper Guk', 'Lower Guk', 'Solusek', 'Nagafen', 'Permafrost', 'Kedge Keep',
  'Plane of Fear', 'Plane of Hate', 'Plane of Sky', 'Plane of Growth',
  'Emerald Jungle', 'City of Mist', 'Burning Woods', 'Skyfire Mountains',
  'Chardok', 'Sebilis', 'Howling Stones', 'Kael Drakkel', 'Wakening Land',
  'Eastern Wastes', 'Western Wastes', 'Great Divide', 'Cobalt Scar',
  'Temple of Veeshan', 'Sleepers Tomb', 'Dragon Necropolis', 'Siren Grotto',
  'Veeshan Peak', 'Plane of Time', 'Plane of Fire', 'Plane of Air',
  'Plane of Water', 'Plane of Earth', 'Plane of Valor', 'Plane of Justice',
  'Plane of Nightmare', 'Plane of Disease', 'Plane of Innovation',
  'Dead Hills', 'Ethernere', 'Arcstone', 'Devastation', 'Rage of Fire',
  'Feerrott', 'Innothule', 'Crushbone', 'Unrest', 'Mistmoore', 'Kaladim',
  'Butcherblock', 'Dagnor', 'Steamfont', 'Lesser Faydark', 'Greater Faydark',
  'Felwithe', 'Kelethin', 'Neriak', 'Nektulos', 'Lavastorm', 'Everfrost',
  'Blackburrow', 'Qeynos Hills', 'West Freeport', 'East Freeport', 'North Freeport',
  'Commonlands', 'Kithicor', 'Highpass', 'Gorge of King Xorbb', 'Runnyeye',
];

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
    const questUrls: Record<string, string> = {};

    // Generate URLs for all epic classes
    const epicClasses = [
      'bard', 'beastlord', 'berserker', 'cleric', 'druid', 'enchanter',
      'magician', 'monk', 'necromancer', 'paladin', 'ranger', 'rogue',
      'shadowknight', 'shaman', 'warrior', 'wizard'
    ];

    for (const cls of epicClasses) {
      questUrls[`${cls}-epic-1.0`] = `${BASE_URL}/epics/${cls}1.0.cfm`;
      questUrls[`${cls}-epic-1.5`] = `${BASE_URL}/epics/${cls}1.5.cfm`;
      questUrls[`${cls}-epic-2.0`] = `${BASE_URL}/epics/${cls}2.0.cfm`;
    }

    // Add other known guides
    questUrls['gribble-ha'] = `${BASE_URL}/leveling/CoTF/Locations/DeadHillsGribbleHAs.cfm`;
    questUrls['leveling-overview'] = `${BASE_URL}/leveling/`;

    const url = questUrls[id];
    if (!url) {
      return null;
    }

    try {
      const html = await fetchPage(url);
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const name = titleMatch ? stripHtml(titleMatch[1]).replace(' - Almar\'s Guides', '').trim() : id;

      const data: QuestData = { name, url, source: this.name };

      // Extract main content area (preserve structure for parsing)
      const contentMatch = html.match(/<div[^>]*class="[^"]*(?:content|article|main)[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                          html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                          html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

      if (!contentMatch) {
        data.raw = stripHtml(html).slice(0, 4000);
        return data;
      }

      const content = contentMatch[1];

      // Parse structured quest steps
      data.steps = this.parseQuestSteps(content);

      // Parse NPCs with locations
      data.npcs = this.parseQuestNpcs(content);

      // Parse required items
      data.items = this.parseQuestItems(content);

      // Parse zones involved
      data.zones = this.parseQuestZones(content);

      // Extract dialog
      data.dialog = this.parseDialog(content);

      // Store cleaned raw for fallback (increased limit)
      data.raw = this.cleanContent(content);

      return data;
    } catch (error) {
      console.error("[Almar's] Get quest failed:", error instanceof Error ? error.message : error);
      return null;
    }
  }

  private parseQuestSteps(html: string): QuestStep[] {
    const steps: QuestStep[] = [];
    const text = this.cleanContentPreserveStructure(html);

    // Pattern 1: Checkbox format "( ) Kill X" or "[ ] Kill X" or "- Kill X"
    const checkboxPattern = /(?:[(\[]\s*[)\]]|^-)\s*(.+?)(?=\n[(\[-]|\n\n|$)/gim;
    let stepNum = 1;
    let match;

    while ((match = checkboxPattern.exec(text)) !== null) {
      const stepText = match[1].trim();
      const step = this.parseStepText(stepText, stepNum++);
      if (step) steps.push(step);
    }

    // Pattern 2: Numbered steps "1. Kill X" or "Step 1: Kill X" or "1) Kill X"
    if (steps.length === 0) {
      const numberedPattern = /(?:step\s*)?(\d+)[.):\s]+\s*(.+?)(?=(?:step\s*)?\d+[.):\s]|$)/gis;
      while ((match = numberedPattern.exec(text)) !== null) {
        const num = parseInt(match[1]);
        const stepText = match[2].trim();
        const step = this.parseStepText(stepText, num);
        if (step) steps.push(step);
      }
    }

    // Pattern 3: Action-based parsing (Kill, Loot, Give, Talk to, Hail)
    if (steps.length === 0) {
      const actionPattern = /(Kill|Loot|Give|Talk to|Hail|Speak to|Hand in|Turn in|Go to|Travel to|Return to|Find|Farm|Get)\s+([^.!?\n]+)/gi;
      while ((match = actionPattern.exec(text)) !== null) {
        steps.push({
          number: steps.length + 1,
          action: match[1],
          target: match[2].trim(),
        });
        if (steps.length >= 50) break; // Limit
      }
    }

    return steps;
  }

  private parseStepText(text: string, num: number): QuestStep | null {
    if (!text || text.length < 3) return null;

    const step: QuestStep = { number: num, action: 'do' };

    // Extract action verb at the start
    const actionMatch = text.match(/^(Kill|Loot|Give|Talk to|Hail|Speak|Hand in|Turn in|Farm|Get|Find|Go to|Travel to|Return to|Combine|Head to|Locate)/i);
    if (actionMatch) {
      step.action = actionMatch[1];
      text = text.slice(actionMatch[0].length).trim();
    }

    // Extract location with coordinates: "in Zone at loc(x, y)" or "at (+x, -y)"
    const coords = extractCoordinates(text);
    if (coords) {
      step.coordinates = coords;
    }

    // Extract location: "in Zone Name" or "at Zone Name"
    const locMatch = text.match(/\s+(?:in|at)\s+([A-Z][a-zA-Z\s']+?)(?:\s+at\s+loc|\s*[,.]|$)/);
    if (locMatch) {
      step.location = locMatch[1].trim();
    }

    // Extract result: "receive X" or "to receive X" or "to get X"
    const resultMatch = text.match(/(?:to\s+)?(?:receive|get|obtain)\s+(.+?)(?:\s*[,.]|$)/i);
    if (resultMatch) {
      step.result = resultMatch[1].trim();
    }

    // The remaining text is the target
    let target = text
      .replace(/(?:to\s+)?(?:receive|get|obtain)\s+.+$/i, '')
      .replace(/\s+(?:in|at)\s+[A-Z][a-zA-Z\s']+$/i, '')
      .trim();

    if (target) {
      step.target = target;
    }

    return step;
  }

  private parseQuestNpcs(html: string): QuestNpc[] {
    const npcs: QuestNpc[] = [];
    const seenNames = new Set<string>();
    const text = this.cleanContentPreserveStructure(html);

    // Pattern 1: "NPC Name (Zone Name)" or "NPC Name in Zone Name"
    const npcPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+the\s+[A-Z][a-z]+)?)\s*(?:\(([^)]+)\)|in\s+([A-Z][a-zA-Z\s']+))/g;
    let match;

    while ((match = npcPattern.exec(text)) !== null) {
      const name = match[1].trim();
      const zone = (match[2] || match[3] || '').trim();

      if (this.isLikelyNpcName(name) && !seenNames.has(name.toLowerCase())) {
        seenNames.add(name.toLowerCase());
        npcs.push({ name, zone: zone || undefined });
        if (npcs.length >= 30) break;
      }
    }

    // Pattern 2: "NPC Name at loc(x, y)" or "NPC Name at (+x, -y)"
    const locNpcPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|near|around)\s+(loc\s*\([^)]+\)|[+-]\d+\s*,\s*[+-]\d+)/gi;
    while ((match = locNpcPattern.exec(text)) !== null) {
      const name = match[1].trim();
      if (this.isLikelyNpcName(name) && !seenNames.has(name.toLowerCase())) {
        seenNames.add(name.toLowerCase());
        const coords = extractCoordinates(match[2]);
        npcs.push({
          name,
          coordinates: coords || undefined,
        });
        if (npcs.length >= 30) break;
      }
    }

    // Pattern 3: Names that appear after action verbs
    const actionNpcPattern = /(?:hail|talk to|speak to|find|kill|give to|hand to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
    while ((match = actionNpcPattern.exec(text)) !== null) {
      const name = match[1].trim();
      if (this.isLikelyNpcName(name) && !seenNames.has(name.toLowerCase())) {
        seenNames.add(name.toLowerCase());
        npcs.push({ name });
        if (npcs.length >= 30) break;
      }
    }

    return npcs;
  }

  private parseQuestItems(html: string): QuestItem[] {
    const items: QuestItem[] = [];
    const seenItems = new Set<string>();
    const text = this.cleanContentPreserveStructure(html);

    // Pattern 1: Items after action verbs (loot, give, receive, need, etc.)
    const itemContextPattern = /(?:loot|give|receive|hand in|turn in|drops?|need|require|get|obtain|collect)\s+(?:the\s+)?(?:a\s+)?([A-Z][a-zA-Z\s']+?)(?:\s+(?:to|from|in|at|x\d+|\d+x)|\s*[,.]|$)/gi;
    let match;

    while ((match = itemContextPattern.exec(text)) !== null) {
      const itemName = match[1].trim();
      if (itemName.length > 2 && itemName.length < 60 && !seenItems.has(itemName.toLowerCase())) {
        // Filter out zone names and common false positives
        if (!KNOWN_ZONES.some(z => z.toLowerCase() === itemName.toLowerCase()) &&
            !this.isCommonFalsePositive(itemName)) {
          seenItems.add(itemName.toLowerCase());

          const item: QuestItem = { name: itemName };

          // Check quantity patterns like "x4" or "4x"
          const qtyMatch = text.slice(match.index).match(/(?:x(\d+)|(\d+)x)/i);
          if (qtyMatch) {
            item.quantity = parseInt(qtyMatch[1] || qtyMatch[2]);
          }

          items.push(item);
          if (items.length >= 30) break;
        }
      }
    }

    return items;
  }

  private parseQuestZones(html: string): string[] {
    const zones: string[] = [];
    const seenZones = new Set<string>();
    const text = this.cleanContentPreserveStructure(html);

    for (const zone of KNOWN_ZONES) {
      // Create a regex that handles the zone name (escape special chars)
      const regex = new RegExp(`\\b${zone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(text) && !seenZones.has(zone.toLowerCase())) {
        seenZones.add(zone.toLowerCase());
        zones.push(zone);
      }
    }

    return zones;
  }

  private parseDialog(html: string): DialogEntry[] {
    const dialog: DialogEntry[] = [];
    const seenTexts = new Set<string>();
    const text = this.cleanContentPreserveStructure(html);

    // Pattern 1: "say 'text'" or "hail" triggers
    const sayPattern = /(?:say|hail)\s*'([^']+)'/gi;
    let match;
    while ((match = sayPattern.exec(text)) !== null) {
      const dialogText = match[1].trim();
      if (!seenTexts.has(dialogText.toLowerCase())) {
        seenTexts.add(dialogText.toLowerCase());
        dialog.push({
          speaker: 'player',
          text: dialogText,
          trigger: dialogText,
        });
      }
    }

    // Pattern 2: Bracketed keywords [keyword]
    const keywordPattern = /\[([^\]]+)\]/g;
    while ((match = keywordPattern.exec(text)) !== null) {
      const keyword = match[1].trim().toLowerCase();
      if (!seenTexts.has(keyword) && keyword.length > 1 && keyword.length < 50) {
        seenTexts.add(keyword);
        dialog.push({
          speaker: 'player',
          text: keyword,
          trigger: keyword,
        });
      }
    }

    // Pattern 3: "You say, 'text'"
    const youSayPattern = /You say,?\s*'([^']+)'/gi;
    while ((match = youSayPattern.exec(text)) !== null) {
      const dialogText = match[1].trim();
      if (!seenTexts.has(dialogText.toLowerCase())) {
        seenTexts.add(dialogText.toLowerCase());
        dialog.push({
          speaker: 'player',
          text: dialogText,
          trigger: dialogText,
        });
      }
    }

    return dialog;
  }

  private isLikelyNpcName(name: string): boolean {
    // Filter common false positives
    const blacklist = [
      'The', 'You', 'Your', 'This', 'That', 'Item', 'Quest', 'Step', 'Note',
      'Kill', 'Loot', 'Give', 'Find', 'Get', 'Talk', 'Hail', 'Go', 'Return',
      'Head', 'Travel', 'Click', 'Zone', 'Area', 'Location', 'Place', 'NPC',
      'Epic', 'Guide', 'Part', 'Section', 'Chapter', 'Phase', 'Stage',
    ];
    return !blacklist.includes(name) &&
           name.length > 2 &&
           name.length < 40 &&
           /^[A-Z]/.test(name); // Must start with capital
  }

  private isCommonFalsePositive(text: string): boolean {
    const falsePositives = [
      'note', 'step', 'part', 'section', 'guide', 'epic', 'quest',
      'zone', 'area', 'location', 'place', 'click', 'head', 'go',
    ];
    return falsePositives.some(fp => text.toLowerCase() === fp);
  }

  private cleanContentPreserveStructure(html: string): string {
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  private cleanContent(html: string): string {
    return stripHtml(html)
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 4000); // Increased limit for more context
  }
}

export const almars = new AlmarsSource();
