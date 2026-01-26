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
  // Local game data functions
  isGameDataAvailable,
  searchLocalSpells,
  getLocalSpell,
  getLocalSpellByName,
  searchLocalZones,
  getLocalZone,
  getSkillCaps,
  getBaseStats,
  searchAchievements,
  getAchievement,
  getACMitigation,
  getSpellStackingInfo,
  getSpellsByClass,
  getLocalDataStatus,
  searchFactions,
  getFaction,
  searchAAAbilities,
  getAAAbility,
  searchLore,
  getLore,
  searchGameStrings,
  getGameString,
  searchOverseerMinions,
  getOverseerMinion,
  searchOverseerQuests,
  getOverseerQuest,
  searchCombatAbilities,
  searchMercenaries,
  getMercenary,
  getMercenaryStances,
  getOverseerIncapacitations,
  getHotZoneBonuses,
  searchAugmentGroups,
  getRaceInfo,
  getClassInfo,
  getDeityInfo,
  getStatInfo,
  searchAltCurrencies,
  listAltCurrencies,
  searchTributes,
  getTribute,
  searchItemEffects,
  getItemEffect,
  getZoneMapPOIs,
  getBannerCategories,
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
  // === LOCAL GAME DATA TOOLS ===
  {
    name: 'get_spell_data',
    description: 'Get detailed spell data from local EQ game files (authoritative, offline). Includes cast time, mana, duration, target type, resist type, class levels, effects, and spell stacking info. Use spell ID or search by name.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Spell ID number'
        },
        name: {
          type: 'string',
          description: 'Spell name to look up (if ID not known)'
        }
      },
    }
  },
  {
    name: 'get_spells_by_class',
    description: 'List all spells available to a specific class, optionally filtered by level. Uses local game data for complete, authoritative spell lists.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "CLR", "Wizard", "WIZ")'
        },
        level: {
          type: 'number',
          description: 'Optional: filter to spells gained at this specific level'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_skill_caps',
    description: 'Get skill caps for a class by level from local game data. Shows maximum skill values per class/level/skill combination.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Warrior", "WAR", "Cleric", "CLR")'
        },
        level: {
          type: 'number',
          description: 'Optional: specific level to look up'
        },
        skill: {
          type: 'string',
          description: 'Optional: specific skill name (e.g., "Dodge", "1H Slashing", "Meditate")'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_base_stats',
    description: 'Get class base stats (HP, Mana, Endurance, regen rates) by class and level from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Warrior", "WAR")'
        },
        level: {
          type: 'number',
          description: 'Optional: specific level to look up'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'search_achievements',
    description: 'Search EverQuest achievements by name or description from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Achievement name or description to search for'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_achievement',
    description: 'Get detailed information about a specific achievement by ID from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Achievement ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_ac_mitigation',
    description: 'Get AC soft cap and mitigation data for a class by level from local game data. Shows the AC cap where diminishing returns begin.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Warrior", "WAR")'
        },
        level: {
          type: 'number',
          description: 'Optional: specific level to look up'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_spell_stacking',
    description: 'Get spell stacking group information for a spell. Shows which stacking group a spell belongs to and other spells in the same group (which won\'t stack with it).',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Spell ID to look up stacking info for'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_factions',
    description: 'Search EverQuest factions by name from local game data. Returns faction names, IDs, and value ranges.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Faction name to search for (e.g., "Qeynos", "Firiona Vie", "Claws of Veeshan")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_faction',
    description: 'Get detailed information about a specific faction by ID, including faction standing thresholds.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Faction ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_aa',
    description: 'Search EverQuest Alternate Advancement (AA) abilities by name or description from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'AA ability name or keyword (e.g., "Combat Agility", "Spell Casting Subtlety", "Origin")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_aa',
    description: 'Get detailed information about a specific AA ability by ID, including full description and effects.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'AA ability ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_lore',
    description: 'Search EverQuest storyline and lore entries from local game data. Returns narrative stories about game events, expansions, and world history.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "Firiona Vie", "Plane of Time", "Grozmok Stone", "discord")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_lore',
    description: 'Get a specific EverQuest lore/storyline entry by filename or title.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Lore entry filename (e.g., "storyabysmal.txt") or title (e.g., "Abysmal Words")'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_game_strings',
    description: 'Search EverQuest system messages and game text from local data. Includes combat messages, UI text, error messages, and other game strings.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Text to search for in game strings (e.g., "experience", "stunned", "range")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_overseer_agents',
    description: 'Search Overseer system agents (minions) by name from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Agent name to search for (e.g., "Firiona", "Mayong", "Phinigel")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_overseer_agent',
    description: 'Get detailed information about an Overseer agent by ID, including rarity and traits.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Agent/minion ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_overseer_quests',
    description: 'Search Overseer quests by name or description from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Quest name or keyword (e.g., "recruitment", "recovery", "conversion")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_overseer_quest',
    description: 'Get detailed information about an Overseer quest by ID, including description, difficulty, and duration.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Overseer quest ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_combat_abilities',
    description: 'Search EverQuest combat abilities and disciplines by name from local game data. Includes warrior disciplines, monk techniques, rogue abilities, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Ability name to search for (e.g., "Whirlwind", "Discipline", "Second Wind", "Provoke")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_mercenaries',
    description: 'Search EverQuest mercenary types by race, role (Tank/Healer), or proficiency from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "Tank", "Healer", "Journeyman", "Dark Elf")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_mercenary',
    description: 'Get detailed information about a mercenary type by ID, including full description, proficiency, and confidence level.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Mercenary ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_mercenary_stances',
    description: 'Get all EverQuest mercenary stances (Passive, Balanced, Efficient, Reactive, Aggressive, Assist, Burn, etc.) with descriptions, mercenary types, and mercenary abilities.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_overseer_incapacitations',
    description: 'Get all Overseer incapacitation types (Wounded, Captured, Shaken, etc.) with descriptions of duration and quest category associations.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_race_info',
    description: 'Get detailed information about an EverQuest playable race, including lore description, available classes, and available deities.',
    inputSchema: {
      type: 'object',
      properties: {
        race: {
          type: 'string',
          description: 'Race name (e.g., "Human", "Dark Elf", "Iksar", "Drakkin", "Vah Shir")'
        }
      },
      required: ['race']
    }
  },
  {
    name: 'get_class_info',
    description: 'Get detailed information about an EverQuest class, including description, playstyle, and available races.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name or abbreviation (e.g., "Warrior", "WAR", "Shadow Knight", "SHD")'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_deity_info',
    description: 'Get information about an EverQuest deity and which races can worship them.',
    inputSchema: {
      type: 'object',
      properties: {
        deity: {
          type: 'string',
          description: 'Deity name (e.g., "Tunare", "Innoruuk", "Cazic-Thule", "Agnostic")'
        }
      },
      required: ['deity']
    }
  },
  {
    name: 'get_stat_info',
    description: 'Get description of what EverQuest stats do (Strength, Stamina, Agility, Dexterity, Wisdom, Intelligence, Charisma). Shows how each stat affects gameplay.',
    inputSchema: {
      type: 'object',
      properties: {
        stat: {
          type: 'string',
          description: 'Optional: specific stat name (e.g., "Strength", "Wisdom"). Omit to see all stats.'
        }
      },
    }
  },
  {
    name: 'search_alt_currencies',
    description: 'Search EverQuest alternate currencies by name (e.g., "Chronobine", "Noble", "Doubloon"). Shows all known alternate/special currencies.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Currency name to search for. Use "*" or leave empty to list all currencies.'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_tributes',
    description: 'Search EverQuest tribute abilities (personal and guild). Tributes provide passive bonuses like mana regen, attack, stats, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Tribute name or keyword (e.g., "mana", "attack", "health", "armor")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_tribute',
    description: 'Get detailed information about an EverQuest tribute ability by ID. Use search_tributes first to find the ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The tribute ID (from search results)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_hot_zone_bonuses',
    description: 'Get all EverQuest hot zone / bonus zone effect types. Shows what bonuses zones can have (XP bonus, loot multiplier, rare spawns, etc.).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'search_augment_groups',
    description: 'Search for augmentation slot groups by name. Shows which augmentations can be placed in which equipment slots.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Augment group name to search for'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_item_effects',
    description: 'Search for EverQuest item click/proc effect descriptions. Find what items do when clicked or when their proc triggers (cure, title grant, summon, snare, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search text (e.g., "cure disease", "title", "summon", "snare")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_item_effect',
    description: 'Get a specific item click/proc effect description by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The item effect ID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_zone_map',
    description: 'Get map points of interest (POIs) for an EverQuest zone. Shows labeled locations with coordinates from Brewall/standard map files. Optionally filter by a search term.',
    inputSchema: {
      type: 'object',
      properties: {
        zone: {
          type: 'string',
          description: 'Zone name (e.g., "Plane of Knowledge", "East Commonlands", "poknowledge")'
        },
        query: {
          type: 'string',
          description: 'Optional: filter POIs by label (e.g., "bank", "merchant", "portal")'
        }
      },
      required: ['zone']
    }
  },
  {
    name: 'get_banner_categories',
    description: 'Get guild banner and fellowship campsite category types. Shows what types of banners and campsites are available.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_local_data_status',
    description: 'Show status of local EverQuest game data integration - which data files are loaded and available.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
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

  // Show description if available
  if (spell.description) {
    lines.push(spell.description, '');
  }

  // Show effects first if available
  if (spell.effects && spell.effects.length > 0) {
    lines.push('## Effects');
    for (const effect of spell.effects) {
      lines.push(`- ${effect}`);
    }
    lines.push('');
  }

  // Category
  if (spell.category) {
    const catLine = spell.subcategory
      ? `**Category:** ${spell.category} > ${spell.subcategory}`
      : `**Category:** ${spell.category}`;
    lines.push(catLine);
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
    { name: 'Local Game Data', specialty: 'Authoritative offline data from EQ game files: spells (70K+ with 500+ effect types), zones, skill caps, class stats, achievements, factions (1600+), AA abilities (2700+), combat abilities (950), mercenaries (4200+ with stances & abilities), AC mitigation, spell stacking, map POIs (34K+), lore (50 stories), game strings (7K), Overseer agents (300+ with jobs & traits) & quests (800+ with slots & incapacitations), race/class info (16/16), deities (17 with lore), stats, tributes (266), alt currencies (54), item effects (1100+), banner/campsite categories', url: isGameDataAvailable() ? 'Available' : 'Not found (set EQ_GAME_PATH env var)' },
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
        // Search local data in parallel with web sources
        const [localSpells, localZones, loreResults, overseerAgents, overseerQsts, aaResults, factionResults, combatResults, tributeResults, webResults] = await Promise.all([
          searchLocalSpells(query).catch(() => [] as SearchResult[]),
          searchLocalZones(query).catch(() => [] as SearchResult[]),
          searchLore(query).catch(() => [] as SearchResult[]),
          searchOverseerMinions(query).catch(() => [] as SearchResult[]),
          searchOverseerQuests(query).catch(() => [] as SearchResult[]),
          searchAAAbilities(query).catch(() => [] as SearchResult[]),
          searchFactions(query).catch(() => [] as SearchResult[]),
          searchCombatAbilities(query).catch(() => [] as SearchResult[]),
          searchTributes(query).catch(() => [] as SearchResult[]),
          searchAll(query).catch(() => [] as SearchResult[]),
        ]);
        const localResults = [
          ...localSpells.slice(0, 5),
          ...localZones.slice(0, 5),
          ...loreResults.slice(0, 3),
          ...overseerAgents.slice(0, 3),
          ...overseerQsts.slice(0, 3),
          ...aaResults.slice(0, 3),
          ...factionResults.slice(0, 3),
          ...combatResults.slice(0, 3),
          ...tributeResults.slice(0, 2),
        ];
        const seen = new Set(localResults.map(r => r.name.toLowerCase()));
        const merged = [...localResults, ...webResults.filter(r => !seen.has(r.name.toLowerCase()))];
        return formatSearchResults(merged.slice(0, 30), query);
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
        // Search both local and web sources
        const [localResults, webResults] = await Promise.all([
          searchLocalSpells(query).catch(() => [] as SearchResult[]),
          allakhazam.searchSpells(query).catch(() => [] as SearchResult[]),
        ]);
        // Merge: local results first, then web results (deduped by name)
        const seen = new Set(localResults.map(r => r.name.toLowerCase()));
        const merged = [...localResults, ...webResults.filter(r => !seen.has(r.name.toLowerCase()))];
        return formatSearchResults(merged.slice(0, 30), query);
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
        const [localResults, webResults] = await Promise.all([
          searchLocalZones(query).catch(() => [] as SearchResult[]),
          allakhazam.searchZones(query).catch(() => [] as SearchResult[]),
        ]);
        const seen = new Set(localResults.map(r => r.name.toLowerCase()));
        const merged = [...localResults, ...webResults.filter(r => !seen.has(r.name.toLowerCase()))];
        return formatSearchResults(merged.slice(0, 30), query);
      }

      case 'get_spell': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        // Try local data first (authoritative), fall back to web
        const localSpell = await getLocalSpell(id).catch(() => null);
        if (localSpell) {
          // Also try web for supplementary info (effects descriptions, etc.)
          const webSpell = await allakhazam.getSpell(id).catch(() => null);
          if (webSpell) {
            // Merge: prefer local data but add web-only fields
            if (!localSpell.effects?.length && webSpell.effects?.length) {
              localSpell.effects = webSpell.effects;
            }
            if (!localSpell.expansion && webSpell.expansion) {
              localSpell.expansion = webSpell.expansion;
            }
            if (webSpell.raw && !localSpell.raw) {
              localSpell.raw = webSpell.raw;
            }
          }
          return formatSpell(localSpell);
        }
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
        // Try both local and web data
        const [localZone, rawWebZone] = await Promise.all([
          getLocalZone(id).catch(() => null),
          allakhazam.getZone(id).catch(() => null),
        ]);
        // Filter out invalid web results (e.g., "Not Found" placeholder pages)
        const webZone = rawWebZone && rawWebZone.name && !rawWebZone.name.toLowerCase().includes('not found') ? rawWebZone : null;
        if (localZone && webZone) {
          // Merge: prefer web for rich data, add local level range and POIs
          if (!webZone.levelRange && localZone.levelRange) {
            webZone.levelRange = localZone.levelRange;
          }
          if (localZone.notableLocations?.length) {
            webZone.notableLocations = [
              ...(webZone.notableLocations || []),
              ...localZone.notableLocations,
            ];
          }
          return formatZone(webZone);
        }
        if (localZone) return formatZone(localZone);
        if (webZone) return formatZone(webZone);
        return `Zone with ID ${id} not found`;
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

      // === LOCAL GAME DATA TOOLS ===
      case 'get_spell_data': {
        const id = typeof args.id === 'string' ? args.id.trim() : '';
        const name = typeof args.name === 'string' ? args.name.trim() : '';
        if (!id && !name) {
          return 'Error: Either "id" or "name" parameter is required';
        }
        let spell: SpellData | null = null;
        if (id) {
          spell = await getLocalSpell(id);
        } else if (name) {
          spell = await getLocalSpellByName(name);
        }
        if (!spell) {
          return `Spell not found${id ? ` (ID: ${id})` : ''}${name ? ` (name: "${name}")` : ''}. Make sure local game data is available.`;
        }
        return formatSpell(spell);
      }

      case 'get_spells_by_class': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        return getSpellsByClass(className, level);
      }

      case 'get_skill_caps': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        const skill = typeof args.skill === 'string' ? args.skill.trim() : undefined;
        return getSkillCaps(className, level, skill);
      }

      case 'get_base_stats': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        return getBaseStats(className, level);
      }

      case 'search_achievements': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchAchievements(query);
        return formatSearchResults(results, query);
      }

      case 'get_achievement': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getAchievement(id);
      }

      case 'get_ac_mitigation': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        return getACMitigation(className, level);
      }

      case 'get_spell_stacking': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getSpellStackingInfo(id);
      }

      case 'search_factions': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchFactions(query);
        return formatSearchResults(results, query);
      }

      case 'get_faction': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getFaction(id);
      }

      case 'search_aa': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchAAAbilities(query);
        return formatSearchResults(results, query);
      }

      case 'get_aa': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getAAAbility(id);
      }

      case 'search_lore': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchLore(query);
        return formatSearchResults(results, query);
      }

      case 'get_lore': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getLore(id);
      }

      case 'search_game_strings': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchGameStrings(query);
        return formatSearchResults(results, query);
      }

      case 'search_overseer_agents': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchOverseerMinions(query);
        return formatSearchResults(results, query);
      }

      case 'get_overseer_agent': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getOverseerMinion(id);
      }

      case 'search_overseer_quests': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchOverseerQuests(query);
        return formatSearchResults(results, query);
      }

      case 'get_overseer_quest': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getOverseerQuest(id);
      }

      case 'search_combat_abilities': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchCombatAbilities(query);
        return formatSearchResults(results, query);
      }

      case 'search_mercenaries': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchMercenaries(query);
        return formatSearchResults(results, query);
      }

      case 'get_mercenary': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getMercenary(id);
      }

      case 'get_mercenary_stances': {
        return getMercenaryStances();
      }

      case 'get_overseer_incapacitations': {
        return getOverseerIncapacitations();
      }

      case 'get_race_info': {
        const race = typeof args.race === 'string' ? args.race.trim() : '';
        if (!race) return 'Error: "race" parameter is required';
        return getRaceInfo(race);
      }

      case 'get_class_info': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        return getClassInfo(className);
      }

      case 'get_deity_info': {
        const deity = typeof args.deity === 'string' ? args.deity.trim() : '';
        if (!deity) return 'Error: "deity" parameter is required';
        return getDeityInfo(deity);
      }

      case 'get_stat_info': {
        const stat = typeof args.stat === 'string' ? args.stat.trim() : undefined;
        return getStatInfo(stat);
      }

      case 'search_alt_currencies': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query || query === '*') return listAltCurrencies();
        const results = await searchAltCurrencies(query);
        return formatSearchResults(results, query);
      }

      case 'search_tributes': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query) return 'Error: "query" parameter is required';
        const results = await searchTributes(query);
        return formatSearchResults(results, query);
      }

      case 'get_tribute': {
        const id = typeof args.id === 'string' ? args.id.trim() : '';
        if (!id) return 'Error: "id" parameter is required';
        return getTribute(id);
      }

      case 'get_hot_zone_bonuses': {
        return getHotZoneBonuses();
      }

      case 'search_augment_groups': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query) return 'Error: "query" parameter is required';
        const results = await searchAugmentGroups(query);
        return results.length > 0 ? formatSearchResults(results, query) : `No augment groups found for "${query}"`;
      }

      case 'search_item_effects': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchItemEffects(query);
        return formatSearchResults(results, query);
      }

      case 'get_item_effect': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getItemEffect(id);
      }

      case 'get_zone_map': {
        const zone = typeof args.zone === 'string' ? args.zone.trim() : '';
        if (!zone) return 'Error: "zone" parameter is required';
        const query = typeof args.query === 'string' ? args.query.trim() : undefined;
        return getZoneMapPOIs(zone, query);
      }

      case 'get_banner_categories': {
        return getBannerCategories();
      }

      case 'get_local_data_status': {
        return getLocalDataStatus();
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
