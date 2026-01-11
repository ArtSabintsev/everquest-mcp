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
  allakhazam,
  almars,
  eqresource,
  fanra,
  eqtraders,
  zliz,
} from './sources/index.js';

export const tools = [
  // === MULTI-SOURCE SEARCH ===
  {
    name: 'search_all',
    description: 'Search ALL EverQuest databases simultaneously (Allakhazam, Almar\'s Guides, EQResource, Fanra Wiki, EQ Traders, Zliz). Returns combined results from all sources.',
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
    description: 'Get information about an EverQuest zone by ID, including level range and notable NPCs.',
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

  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    const key = `${r.type}-${r.source}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
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

  // Group by source first
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

  if (spell.effect) {
    lines.push(`*${spell.effect}*`, '');
  }

  const fields = [
    ['Mana', spell.mana],
    ['Cast Time', spell.castTime ? `${spell.castTime}s` : undefined],
    ['Recast Time', spell.recastTime ? `${spell.recastTime}s` : undefined],
    ['Duration', spell.duration],
    ['Range', spell.range],
    ['Target', spell.target],
    ['Resist', spell.resist],
    ['Skill', spell.skill],
    ['Classes', spell.classes],
  ];

  for (const [label, value] of fields) {
    if (value) {
      lines.push(`**${label}:** ${value}`);
    }
  }

  if (spell.raw && lines.length < 5) {
    lines.push('', '---', spell.raw);
  }

  return lines.join('\n');
}

function formatItem(item: ItemData): string {
  const lines = [`# ${item.name}`, `*Source: ${item.source}*`, ''];

  const fields = [
    ['Slot', item.slot],
    ['AC', item.ac],
    ['Damage', item.damage],
    ['Delay', item.delay],
    ['Stats', item.stats],
    ['Effect', item.effect],
    ['Weight', item.weight],
    ['Classes', item.classes],
    ['Races', item.races],
    ['Drops From', item.dropsFrom],
  ];

  for (const [label, value] of fields) {
    if (value) {
      lines.push(`**${label}:** ${value}`);
    }
  }

  if (item.raw && lines.length < 5) {
    lines.push('', '---', item.raw);
  }

  return lines.join('\n');
}

function formatNpc(npc: NpcData): string {
  const lines = [`# ${npc.name}`, `*Source: ${npc.source}*`, ''];

  const fields = [
    ['Level', npc.level],
    ['Zone', npc.zone],
    ['Race', npc.race],
    ['Class', npc.class],
    ['Faction', npc.faction],
    ['Location', npc.location],
  ];

  for (const [label, value] of fields) {
    if (value) {
      lines.push(`**${label}:** ${value}`);
    }
  }

  if (npc.loot && npc.loot.length > 0) {
    lines.push('', '## Loot');
    for (const item of npc.loot) {
      lines.push(`- ${item}`);
    }
  }

  if (npc.raw && lines.length < 5) {
    lines.push('', '---', npc.raw);
  }

  return lines.join('\n');
}

function formatZone(zone: ZoneData): string {
  const lines = [`# ${zone.name}`, `*Source: ${zone.source}*`, ''];

  const fields = [
    ['Level Range', zone.levelRange],
    ['Continent', zone.continent],
    ['Expansion', zone.expansion],
  ];

  for (const [label, value] of fields) {
    if (value) {
      lines.push(`**${label}:** ${value}`);
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

  if (zone.raw && lines.length < 5) {
    lines.push('', '---', zone.raw);
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
  ];

  for (const src of sourceInfo) {
    lines.push(`## ${src.name}`);
    lines.push(`**Specialty:** ${src.specialty}`);
    lines.push(`**URL:** ${src.url}`);
    lines.push('');
  }

  lines.push('---');
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
