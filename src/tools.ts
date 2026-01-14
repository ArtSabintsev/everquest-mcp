import {
  SearchResult,
  SpellData,
  ItemData,
  NpcData,
  ZoneData,
  QuestData,
  sources,
  searchAll,
  searchQuests,
  searchTradeskills,
  searchRaidLoot,
  searchUI,
  allakhazam,
  almars,
  eqresource,
  fanra,
  eqtraders,
  lucy,
  raidloot,
  eqinterface,
  getCacheStats,
  clearCache,
} from './sources/index.js';

export const tools = [
  // === MULTI-SOURCE SEARCH ===
  {
    name: 'search_all',
    description: 'Search ALL EverQuest databases simultaneously (Allakhazam, Almar\'s Guides, EQResource, Fanra Wiki, EQ Traders, Zliz, Lucy, RaidLoot, EQInterface). Returns combined results from all sources.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (spell, item, NPC, zone, quest, guide, etc.)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_quests',
    description: 'Search for EverQuest quests and quest guides across all sources. Best for finding epic quests, progression quests, and quest walkthroughs.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Quest name or keywords (e.g., "bard epic", "HoT progression")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_tradeskills',
    description: 'Search for tradeskill recipes and guides from EQ Traders and other sources.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Tradeskill or recipe name (e.g., "blacksmithing", "cultural armor")'
        }
      },
      required: ['query']
    }
  },

  // === ALLAKHAZAM (Primary Database) ===
  {
    name: 'search_eq',
    description: 'Search the Allakhazam EverQuest database for spells, items, NPCs, zones, and quests. Returns matching results with IDs.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (item name, spell name, NPC name, zone name, etc.)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_spell',
    description: 'Get detailed information about an EverQuest spell by ID. Use search_eq first to find the spell ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The spell ID (from search results)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_item',
    description: 'Get detailed information about an EverQuest item by ID. Use search_eq first to find the item ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The item ID (from search results)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_npc',
    description: 'Get information about an EverQuest NPC by ID, including level, zone, and loot table.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The NPC ID (from search results)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_zone',
    description: 'Get information about an EverQuest zone by ID, including level range, portal stones, books, and notable NPCs.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The zone ID (from search results)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_quest',
    description: 'Get detailed quest information including steps, dialog, NPCs, and items. Use search_quests or search_almars first to find the quest ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The quest ID (from search results)'
        },
        source: {
          type: 'string',
          description: 'Source to fetch from: "allakhazam" or "almars" (default: tries both)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_spells',
    description: 'Search specifically for EverQuest spells by name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Spell name to search for'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_items',
    description: 'Search specifically for EverQuest items by name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Item name to search for'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_npcs',
    description: 'Search specifically for EverQuest NPCs by name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'NPC name to search for'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_zones',
    description: 'Search specifically for EverQuest zones by name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Zone name to search for'
        }
      },
      required: ['query']
    }
  },

  // === SOURCE-SPECIFIC TOOLS ===
  {
    name: 'search_almars',
    description: 'Search Almar\'s Guides for quest walkthroughs, epic guides, leveling guides, and farming guides.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "bard epic 1.0", "gribble ha", "leveling guide")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_eqresource',
    description: 'Search EQResource for modern expansion content, progression guides, and spell database.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "TBL progression", "CoV spells")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_fanra',
    description: 'Search Fanra\'s EverQuest Wiki for general game information and guides.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "agent of change", "heroic adventures")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_eqtraders',
    description: 'Search EQ Traders for tradeskill recipes, guides, and trophy information.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "blacksmithing recipes", "cultural armor")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_lucy',
    description: 'Search Lucy for classic EQ spell and item data (historical database).',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (spell or item name)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_raidloot',
    description: 'Search RaidLoot for raid drop tables and loot by expansion.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "anguish", "ToV raid", "CoV loot")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_ui',
    description: 'Search EQInterface for UI mods, maps, parsers, and tools.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "maps", "gina", "ui", "parser")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'list_sources',
    description: 'List all available EverQuest data sources and their specialties.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
];

// === FORMATTERS ===

function formatSearchResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `No results found for "${query}"`;
  }

  const lines = [`## Search Results for "${query}"`, ''];

  const typeLabels: Record<string, string> = {
    spell: 'Spells',
    item: 'Items',
    npc: 'NPCs',
    zone: 'Zones',
    quest: 'Quests',
    guide: 'Guides',
    tradeskill: 'Tradeskills',
    unknown: 'Other',
  };

  // Group by source
  const bySource: Record<string, SearchResult[]> = {};
  for (const r of results) {
    if (!bySource[r.source]) bySource[r.source] = [];
    bySource[r.source].push(r);
  }

  for (const [source, items] of Object.entries(bySource)) {
    lines.push(`### ${source}`);
    for (const item of items) {
      const typeLabel = typeLabels[item.type] || item.type;
      const desc = item.description ? ` - ${item.description}` : '';
      lines.push(`- **${item.name}** [${typeLabel}] (${item.url})${desc}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatSpell(spell: SpellData): string {
  const lines = [`# ${spell.name}`, `*Source: ${spell.source}*`, ''];

  // Show effects first if available
  if (spell.effects && spell.effects.length > 0) {
    lines.push('## Effects');
    for (const effect of spell.effects) {
      lines.push(`- ${effect}`);
    }
    lines.push('');
  }

  // Basic info
  if (spell.mana) lines.push(`**Mana:** ${spell.mana}`);
  if (spell.castTime) lines.push(`**Cast Time:** ${spell.castTime}`);
  if (spell.recastTime) lines.push(`**Recast Time:** ${spell.recastTime}`);
  if (spell.duration) lines.push(`**Duration:** ${spell.duration}`);
  if (spell.range) lines.push(`**Range:** ${spell.range}`);
  if (spell.target) lines.push(`**Target:** ${spell.target}`);
  if (spell.resist) lines.push(`**Resist:** ${spell.resist}`);
  if (spell.skill) lines.push(`**Skill:** ${spell.skill}`);

  // Classes with levels
  if (spell.classes && typeof spell.classes === 'object') {
    const classEntries = Object.entries(spell.classes)
      .map(([cls, level]) => `${cls}(${level})`)
      .join(' ');
    lines.push(`**Classes:** ${classEntries}`);
  }

  return lines.join('\n');
}

function formatItem(item: ItemData): string {
  const lines = [`# ${item.name}`, `*Source: ${item.source}*`, ''];

  // Slot and combat stats
  if (item.slot) lines.push(`**Slot:** ${item.slot}`);
  if (item.ac) lines.push(`**AC:** ${item.ac}`);
  if (item.damage && item.delay) {
    lines.push(`**DMG/Delay:** ${item.damage}/${item.delay} (Ratio: ${item.ratio?.toFixed(2) || 'N/A'})`);
  }

  // Stats
  if (item.stats && Object.keys(item.stats).length > 0) {
    const statStr = Object.entries(item.stats)
      .map(([stat, val]) => `${stat}: ${val >= 0 ? '+' : ''}${val}`)
      .join(' | ');
    lines.push(`**Stats:** ${statStr}`);
  }

  // Heroic stats
  if (item.heroicStats && Object.keys(item.heroicStats).length > 0) {
    const heroicStr = Object.entries(item.heroicStats)
      .map(([stat, val]) => `H${stat}: +${val}`)
      .join(' | ');
    lines.push(`**Heroic:** ${heroicStr}`);
  }

  // Effects
  if (item.effects && item.effects.length > 0) {
    lines.push(`**Effects:** ${item.effects.join(', ')}`);
  }

  // Level requirements
  if (item.required) lines.push(`**Required Level:** ${item.required}`);
  if (item.recommended) lines.push(`**Recommended Level:** ${item.recommended}`);

  // Weight
  if (item.weight) lines.push(`**Weight:** ${item.weight}`);

  // Classes and races
  if (item.classes && item.classes.length > 0) {
    lines.push(`**Classes:** ${item.classes.join(', ')}`);
  }
  if (item.races && item.races.length > 0) {
    lines.push(`**Races:** ${item.races.join(', ')}`);
  }

  // Drops from
  if (item.dropsFrom && item.dropsFrom.length > 0) {
    lines.push('', '## Drops From');
    for (const npc of item.dropsFrom) {
      lines.push(`- ${npc}`);
    }
  }

  return lines.join('\n');
}

function formatNpc(npc: NpcData): string {
  const lines = [`# ${npc.name}`, `*Source: ${npc.source}*`, ''];

  if (npc.level) lines.push(`**Level:** ${npc.level}`);
  if (npc.zone) lines.push(`**Zone:** ${npc.zone}`);
  if (npc.race) lines.push(`**Race:** ${npc.race}`);
  if (npc.class) lines.push(`**Class:** ${npc.class}`);
  if (npc.faction) lines.push(`**Faction:** ${npc.faction}`);

  // Spawn point coordinates
  if (npc.spawnPoint) {
    const z = npc.spawnPoint.z ? `, ${npc.spawnPoint.z}` : '';
    lines.push(`**Spawn Point:** (${npc.spawnPoint.x}, ${npc.spawnPoint.y}${z})`);
  }
  if (npc.location) lines.push(`**Location:** ${npc.location}`);

  // Quest involvement
  if (npc.questInvolvement && npc.questInvolvement.length > 0) {
    lines.push('', '## Quest Involvement');
    for (const quest of npc.questInvolvement) {
      lines.push(`- ${quest}`);
    }
  }

  // Dialog - this is the key addition to reduce hallucinations
  if (npc.dialog && npc.dialog.length > 0) {
    lines.push('', '## Dialog');
    for (const entry of npc.dialog) {
      if (entry.speaker === 'player') {
        lines.push(`> **You say:** '${entry.text}'`);
      } else {
        lines.push(`> **${npc.name} says:** '${entry.text}'`);
      }
    }
  }

  if (npc.loot && npc.loot.length > 0) {
    lines.push('', '## Loot');
    for (const item of npc.loot) {
      lines.push(`- ${item}`);
    }
  }

  return lines.join('\n');
}

function formatZone(zone: ZoneData): string {
  const lines = [`# ${zone.name}`, `*Source: ${zone.source}*`, ''];

  if (zone.levelRange) lines.push(`**Level Range:** ${zone.levelRange}`);
  if (zone.continent) lines.push(`**Continent:** ${zone.continent}`);
  if (zone.expansion) lines.push(`**Expansion:** ${zone.expansion}`);

  // Portal stones - key for reducing hallucinations about teleport locations
  if (zone.portalStones && zone.portalStones.length > 0) {
    lines.push('', '## Portal Stones / Teleports');
    for (const stone of zone.portalStones) {
      let line = `- **${stone.name}**`;
      if (stone.coordinates) {
        line += ` at (${stone.coordinates.x}, ${stone.coordinates.y})`;
      }
      if (stone.destination && stone.destination !== stone.name) {
        line += ` -> ${stone.destination}`;
      }
      lines.push(line);
    }
  }

  // Books / clickable teleports
  if (zone.books && zone.books.length > 0) {
    lines.push('', '## Clickable Books / Tomes');
    for (const book of zone.books) {
      let line = `- **${book.name}**`;
      if (book.coordinates) {
        line += ` at (${book.coordinates.x}, ${book.coordinates.y})`;
      }
      if (book.destination) {
        line += ` -> ${book.destination}`;
      }
      lines.push(line);
    }
  }

  // Notable locations (bank, guild, soulbinder, etc.)
  if (zone.notableLocations && zone.notableLocations.length > 0) {
    lines.push('', '## Notable Locations');
    for (const loc of zone.notableLocations) {
      let line = `- **${loc.name}**`;
      if (loc.coordinates) {
        line += ` at (${loc.coordinates.x}, ${loc.coordinates.y})`;
      }
      if (loc.description) {
        line += ` - ${loc.description}`;
      }
      lines.push(line);
    }
  }

  if (zone.connectedZones && zone.connectedZones.length > 0) {
    lines.push('', '## Connected Zones');
    for (const z of zone.connectedZones) {
      lines.push(`- ${z}`);
    }
  }

  if (zone.npcs && zone.npcs.length > 0) {
    lines.push('', '## Notable NPCs');
    for (const npc of zone.npcs.slice(0, 15)) {
      lines.push(`- ${npc}`);
    }
    if (zone.npcs.length > 15) {
      lines.push(`- ... and ${zone.npcs.length - 15} more`);
    }
  }

  return lines.join('\n');
}

function formatQuest(quest: QuestData): string {
  const lines = [`# ${quest.name}`, `*Source: ${quest.source}*`, ''];

  if (quest.level) lines.push(`**Level:** ${quest.level}`);
  if (quest.description) lines.push(`\n${quest.description}\n`);

  // Structured quest steps - key for reducing hallucinations
  if (quest.steps && quest.steps.length > 0) {
    lines.push('', '## Quest Steps');
    for (const step of quest.steps) {
      let stepLine = `${step.number}. **${step.action}**`;
      if (step.target) stepLine += ` ${step.target}`;
      if (step.location) stepLine += ` in ${step.location}`;
      if (step.coordinates) {
        stepLine += ` at (${step.coordinates.x}, ${step.coordinates.y})`;
      }
      if (step.result) stepLine += ` -> receive ${step.result}`;
      lines.push(stepLine);
    }
  }

  // Dialog - what to say to NPCs
  if (quest.dialog && quest.dialog.length > 0) {
    lines.push('', '## Dialog / Keywords');
    for (const entry of quest.dialog) {
      if (entry.speaker === 'player') {
        const trigger = entry.trigger ? ` (keyword: '${entry.trigger}')` : '';
        lines.push(`> **Say:** '${entry.text}'${trigger}`);
      } else {
        lines.push(`> **NPC:** '${entry.text}'`);
      }
    }
  }

  // NPCs involved
  if (quest.npcs && quest.npcs.length > 0) {
    lines.push('', '## NPCs');
    for (const npc of quest.npcs) {
      let npcLine = `- **${npc.name}**`;
      if (npc.zone) npcLine += ` (${npc.zone})`;
      if (npc.coordinates) {
        npcLine += ` at (${npc.coordinates.x}, ${npc.coordinates.y})`;
      }
      if (npc.role) npcLine += ` - ${npc.role}`;
      lines.push(npcLine);
    }
  }

  // Items needed
  if (quest.items && quest.items.length > 0) {
    lines.push('', '## Items Needed');
    for (const item of quest.items) {
      let itemLine = `- ${item.name}`;
      if (item.quantity && item.quantity > 1) itemLine += ` x${item.quantity}`;
      if (item.source) itemLine += ` (${item.source})`;
      lines.push(itemLine);
    }
  }

  // Zones involved
  if (quest.zones && quest.zones.length > 0) {
    lines.push('', '## Zones');
    for (const zone of quest.zones) {
      lines.push(`- ${zone}`);
    }
  }

  // Raw text fallback if no structured data
  if (quest.raw && (!quest.steps || quest.steps.length === 0) && (!quest.dialog || quest.dialog.length === 0)) {
    lines.push('', '## Guide Text');
    lines.push(quest.raw);
  }

  return lines.join('\n');
}

function formatSources(): string {
  const lines = ['# Available EverQuest Data Sources', ''];

  const sourceInfo = [
    { name: 'Allakhazam', specialty: 'Primary database - spells, items, NPCs, zones, quests', url: 'https://everquest.allakhazam.com' },
    { name: "Almar's Guides", specialty: 'Quest walkthroughs, epic guides, leveling guides', url: 'https://www.almarsguides.com/eq' },
    { name: 'EQResource', specialty: 'Modern expansion content, progression, spells database', url: 'https://eqresource.com' },
    { name: "Fanra's Wiki", specialty: 'General game information and mechanics', url: 'https://everquest.fanra.info' },
    { name: 'EQ Traders', specialty: 'Tradeskill recipes and guides', url: 'https://www.eqtraders.com' },
    { name: "Zliz's Compendium", specialty: 'Comprehensive EQ database and tools', url: 'https://www.zlizeq.com' },
    { name: 'Lucy', specialty: 'Classic EQ spell and item data (historical)', url: 'https://lucy.allakhazam.com' },
    { name: 'RaidLoot', specialty: 'Raid loot tables by expansion', url: 'https://raidloot.com/EQ' },
    { name: 'EQInterface', specialty: 'UI mods, maps, parsers, and tools', url: 'https://www.eqinterface.com' },
  ];

  for (const src of sourceInfo) {
    lines.push(`## ${src.name}`);
    lines.push(`**Specialty:** ${src.specialty}`);
    lines.push(`**URL:** ${src.url}`);
    lines.push('');
  }

  // Cache stats
  const stats = getCacheStats();
  lines.push('---');
  lines.push(`*Cache: ${stats.size}/${stats.maxSize} entries, ${stats.ttlMinutes} min TTL*`);
  lines.push('');
  lines.push('Use `search_all` to search all sources at once, or use source-specific tools for targeted searches.');

  return lines.join('\n');
}

// === VALIDATION HELPERS ===

function validateQuery(args: Record<string, unknown>): string | null {
  if (typeof args.query !== 'string' || args.query.trim() === '') {
    return 'Error: query parameter must be a non-empty string';
  }
  return null;
}

function validateId(args: Record<string, unknown>): string | null {
  if (typeof args.id !== 'string' || args.id.trim() === '') {
    return 'Error: id parameter must be a non-empty string';
  }
  return null;
}

// === TOOL HANDLER ===

export async function handleToolCall(name: string, args: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      // Multi-source searches
      case 'search_all': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchAll(query);
        return formatSearchResults(results, query);
      }

      case 'search_quests': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchQuests(query);
        return formatSearchResults(results, query);
      }

      case 'search_tradeskills': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchTradeskills(query);
        return formatSearchResults(results, query);
      }

      // Allakhazam (original tools)
      case 'search_eq': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await allakhazam.search(query);
        return formatSearchResults(results, query);
      }

      case 'search_spells': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await allakhazam.searchSpells(query);
        return formatSearchResults(results, query);
      }

      case 'search_items': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await allakhazam.searchItems(query);
        return formatSearchResults(results, query);
      }

      case 'search_npcs': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await allakhazam.searchNpcs(query);
        return formatSearchResults(results, query);
      }

      case 'search_zones': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await allakhazam.searchZones(query);
        return formatSearchResults(results, query);
      }

      case 'get_spell': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        const spell = await allakhazam.getSpell(id);
        if (!spell) {
          return `Spell with ID ${id} not found`;
        }
        return formatSpell(spell);
      }

      case 'get_item': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        const item = await allakhazam.getItem(id);
        if (!item) {
          return `Item with ID ${id} not found`;
        }
        return formatItem(item);
      }

      case 'get_npc': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        const npc = await allakhazam.getNpc(id);
        if (!npc) {
          return `NPC with ID ${id} not found`;
        }
        return formatNpc(npc);
      }

      case 'get_zone': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        const zone = await allakhazam.getZone(id);
        if (!zone) {
          return `Zone with ID ${id} not found`;
        }
        return formatZone(zone);
      }

      case 'get_quest': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        const source = typeof args.source === 'string' ? args.source.toLowerCase() : '';

        // Try specified source or both
        if (source === 'almars') {
          const quest = await almars.getQuest(id);
          if (quest) return formatQuest(quest);
          return `Quest with ID ${id} not found in Almar's Guides`;
        } else if (source === 'allakhazam') {
          const quest = await allakhazam.getQuest(id);
          if (quest) return formatQuest(quest);
          return `Quest with ID ${id} not found in Allakhazam`;
        } else {
          // Try both sources
          const almarQuest = await almars.getQuest(id);
          if (almarQuest) return formatQuest(almarQuest);

          const zakQuest = await allakhazam.getQuest(id);
          if (zakQuest) return formatQuest(zakQuest);

          return `Quest with ID ${id} not found in any source`;
        }
      }

      // Source-specific searches
      case 'search_almars': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await almars.search(query);
        return formatSearchResults(results, query);
      }

      case 'search_eqresource': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await eqresource.search(query);
        return formatSearchResults(results, query);
      }

      case 'search_fanra': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await fanra.search(query);
        return formatSearchResults(results, query);
      }

      case 'search_eqtraders': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await eqtraders.search(query);
        return formatSearchResults(results, query);
      }

      case 'search_lucy': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await lucy.search(query);
        return formatSearchResults(results, query);
      }

      case 'search_raidloot': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchRaidLoot(query);
        return formatSearchResults(results, query);
      }

      case 'search_ui': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchUI(query);
        return formatSearchResults(results, query);
      }

      case 'list_sources': {
        return formatSources();
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Tools] Error in ${name}:`, message);
    return `Error: ${message}`;
  }
}
