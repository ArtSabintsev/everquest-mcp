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
  listAchievementCategories,
  getAchievementsByCategory,
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
  listExpansions,
  searchGameEvents,
  getGameEvent,
  listSpellCategories,
  searchSpellsByEffect,
  searchCreatureTypes,
  searchZonesByName,
  searchLocalZonesByLevel,
  searchTeleportSpells,
  searchSpellsByName,
  searchSpellsByResist,
  searchSpellsByTarget,
  searchSpellStackingGroups,
  searchSpellsByDescription,
  searchTimerGroup,
  getFactionsByRace,
  getFactionsByDeity,
  getFactionsByClass,
  getCharacterFactions,
  searchHelpTopics,
  getHelpTopic,
  compareSpells,
  compareRaces,
  getExpansionContent,
  getSharedSpells,
  getSpellLine,
  searchSpellsByBeneficial,
  getExclusiveSpells,
  compareClasses,
  searchSpellsAdvanced,
  getClassSpellSummary,
  compareDeities,
  listAllRaces,
  listAllClasses,
  listAllDeities,
  listAugmentSlotTypes,
  searchItemLoreGroups,
  getClassAbilitiesAtLevel,
  listSpellEffectTypes,
  searchSpellsByCastTime,
  getRaceClassMatrix,
  getLevelingZonesGuide,
  getOverseerQuestSummary,
  getMercenaryOverview,
  searchSpellsByRecastTime,
  getCharacterCreationGuide,
  searchSpellsByRange,
  searchSpellsByManaCost,
  searchSpellsByDuration,
  getFactionOverview,
  searchSpellsByPushback,
  getDeityClassMatrix,
  searchSpellsByRecoveryTime,
  compareFactions,
  getZoneLevelStatistics,
  getAchievementOverview,
  compareExpansions,
  searchSpellsBySubcategory,
  getAAOverview,
  searchOverseerAgentsByTrait,
  getGameEventOverview,
  getLoreOverview,
  getCurrencyOverview,
  getMapStatistics,
  listDrakkinHeritages,
  searchSpellsWithRecourse,
  compareBaseStats,
  compareSkillCaps,
  getBaseStatOverview,
  getSpellEffectOverview,
  getSkillOverview,
  getSpellGrowthCurve,
  getRaceStatComparison,
  getDeityOverview,
  getClassComparisonMatrix,
  getExpansionTimeline,
  searchSpellsByEndurance,
  getACMitigationComparison,
  getTributeOverview,
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
    description: 'List all spells available to a specific class, optionally filtered by level, spell category, and/or resist type. Uses local game data for complete, authoritative spell lists.',
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
        },
        category: {
          type: 'string',
          description: 'Optional: filter by spell category (e.g., "Heals", "Fire", "Cold", "Direct Damage", "DoT", "Charm", "Fear")'
        },
        resist_type: {
          type: 'string',
          description: 'Optional: filter by resist type (Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, Corruption)'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'search_spells_by_name',
    description: 'Search EverQuest spells by name from local game data. Returns multiple matches with class/level info. Useful for finding all ranks or versions of a spell line.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Spell name to search for (e.g., "Complete Heal", "Defensive Discipline", "Tash")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_spells_by_resist',
    description: 'Search EverQuest spells by resist type (Fire, Cold, Magic, Poison, Disease, Chromatic, Prismatic, Physical, Corruption). Optionally filter by class. Uses local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        resist_type: {
          type: 'string',
          description: 'Resist type to search for (Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, Corruption)'
        },
        class: {
          type: 'string',
          description: 'Optional: filter to a specific class (e.g., "Wizard", "WIZ", "Necromancer", "NEC")'
        }
      },
      required: ['resist_type']
    }
  },
  {
    name: 'search_spells_by_target',
    description: 'Search EverQuest spells by target type (Single, Self, Group, AE, PB AE, Targeted AE, Directional/Cone, Beam, Target Ring, Pet, Corpse, Undead, Animal). Optionally filter by class. Uses local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        target_type: {
          type: 'string',
          description: 'Target type to search for (Single, Self, Group, AE, PB AE, Targeted AE, Cone, Beam, Ring, Pet, Corpse, Undead, Animal)'
        },
        class: {
          type: 'string',
          description: 'Optional: filter to a specific class (e.g., "Wizard", "WIZ", "Enchanter", "ENC")'
        }
      },
      required: ['target_type']
    }
  },
  {
    name: 'search_spells_by_description',
    description: 'Search EverQuest spells by their description text. Find spells that mention specific keywords like "immune", "resurrect", "teleport", "charm animal", "resist". Optionally filter by class.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Text to search for in spell descriptions (e.g., "immune", "resurrect", "charm animal", "damage shield")'
        },
        class: {
          type: 'string',
          description: 'Optional: filter to a specific class (e.g., "Cleric", "CLR")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_timer_group',
    description: 'Find all spells/disciplines that share a reuse timer group. Spells on the same timer cannot be used simultaneously. Provide a timer group number (1-22) or a spell name to find its timer group.',
    inputSchema: {
      type: 'object',
      properties: {
        timer: {
          type: 'string',
          description: 'Timer group number (1-22) or spell/discipline name to look up its timer group'
        },
        class: {
          type: 'string',
          description: 'Optional: filter to a specific class (e.g., "Warrior", "WAR")'
        }
      },
      required: ['timer']
    }
  },
  {
    name: 'compare_spells',
    description: 'Compare two EverQuest spells side by side. Shows differences in mana, cast time, duration, effects, classes, and more. Useful for comparing spell ranks or similar spells from different classes.',
    inputSchema: {
      type: 'object',
      properties: {
        spell1: {
          type: 'string',
          description: 'First spell name or ID'
        },
        spell2: {
          type: 'string',
          description: 'Second spell name or ID'
        }
      },
      required: ['spell1', 'spell2']
    }
  },
  {
    name: 'get_shared_spells',
    description: 'Find spells shared between two EverQuest classes. Shows which spells both classes can use, with level comparison and category breakdown. Useful for understanding class overlap.',
    inputSchema: {
      type: 'object',
      properties: {
        class1: {
          type: 'string',
          description: 'First class name (e.g., "Druid", "DRU")'
        },
        class2: {
          type: 'string',
          description: 'Second class name (e.g., "Ranger", "RNG")'
        },
        level: {
          type: 'number',
          description: 'Optional: max level filter (only show spells obtainable at or below this level)'
        }
      },
      required: ['class1', 'class2']
    }
  },
  {
    name: 'get_spell_line',
    description: 'Find all versions and ranks of a spell line. Shows the complete progression of a spell across levels and classes (e.g., "Complete Heal" finds Complete Heal, Complete Heal Rk. II, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        spell: {
          type: 'string',
          description: 'Spell name (rank suffixes like "Rk. II" are automatically stripped to find the base line)'
        }
      },
      required: ['spell']
    }
  },
  {
    name: 'search_beneficial_spells',
    description: 'Search for beneficial (buff) or detrimental (debuff/nuke/DoT) spells for a class. Shows results grouped by category and level.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "CLR")'
        },
        beneficial: {
          type: 'boolean',
          description: 'true = buffs/heals (beneficial), false = debuffs/nukes/DoTs (detrimental)'
        },
        level: {
          type: 'number',
          description: 'Optional: max level filter (only show spells obtainable at or below this level)'
        }
      },
      required: ['class', 'beneficial']
    }
  },
  {
    name: 'get_exclusive_spells',
    description: 'Find spells that only one specific class can cast — no other class has access. Shows what makes each class unique in terms of spell abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Bard", "BRD", "Enchanter", "ENC")'
        },
        level: {
          type: 'number',
          description: 'Optional: max level filter (only show spells obtainable at or below this level)'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'compare_classes',
    description: 'Compare two EverQuest classes side by side. Shows available races, total/shared/exclusive spell counts, and spell category breakdown. Useful for choosing between classes or understanding class overlap.',
    inputSchema: {
      type: 'object',
      properties: {
        class1: {
          type: 'string',
          description: 'First class name (e.g., "Cleric", "CLR")'
        },
        class2: {
          type: 'string',
          description: 'Second class name (e.g., "Druid", "DRU")'
        }
      },
      required: ['class1', 'class2']
    }
  },
  {
    name: 'search_spells_advanced',
    description: 'Advanced multi-criteria spell search. Combine any filters: class, level range, beneficial/detrimental, target type, resist type, category, name, and effect type. More flexible than single-filter spell search tools.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Shaman", "SHM")'
        },
        min_level: {
          type: 'number',
          description: 'Minimum level (inclusive)'
        },
        max_level: {
          type: 'number',
          description: 'Maximum level (inclusive)'
        },
        beneficial: {
          type: 'boolean',
          description: 'true = buffs/heals, false = debuffs/nukes'
        },
        target_type: {
          type: 'string',
          description: 'Target type: Single, Self, Group, PB AE, Targeted AE, Beam, etc.'
        },
        resist_type: {
          type: 'string',
          description: 'Resist type: Fire, Cold, Magic, Poison, Disease, Chromatic, etc.'
        },
        category: {
          type: 'string',
          description: 'Spell category (e.g., "Heals", "Damage Shield", "Haste")'
        },
        name: {
          type: 'string',
          description: 'Spell name substring filter'
        },
        effect: {
          type: 'string',
          description: 'Spell effect type (e.g., "Stun", "Haste", "Charm", "Root", "HP")'
        }
      },
      required: []
    }
  },
  {
    name: 'get_class_spell_summary',
    description: 'Get a high-level overview of a class\'s entire spell book. Shows total spell count, buff vs debuff ratio, spells per level range, top spell categories, and target type distribution.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Wizard", "WIZ")'
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
    description: 'Search EverQuest achievements by name or description from local game data. Optionally filter by category (e.g., "Exploration", "Raids", "Ring of Scale").',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Achievement name or description to search for'
        },
        category: {
          type: 'string',
          description: 'Optional category filter (e.g., "Exploration", "Raids", "Ring of Scale", "Tradeskill")'
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
    name: 'list_achievement_categories',
    description: 'List all achievement categories organized by expansion and type (General, Tradeskill, Slayer, Hero\'s Journey, etc.) with subcategories and achievement counts.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_achievement_category',
    description: 'Get all achievements in a specific category by ID. For top-level categories, shows subcategories with achievement lists. Use list_achievement_categories to find category IDs.',
    inputSchema: {
      type: 'object',
      properties: {
        category_id: {
          type: 'string',
          description: 'Category ID (from list_achievement_categories)'
        }
      },
      required: ['category_id']
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
    name: 'search_stacking_groups',
    description: 'Search spell stacking groups by name. Shows all spells that belong to a named stacking group (spells in the same group won\'t stack). Useful for finding what buffs/debuffs conflict.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Stacking group name to search for (e.g., "Haste", "Regen", "Shield", "Frenzy")'
        }
      },
      required: ['query']
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
    name: 'get_factions_by_race',
    description: 'Show all faction standings for a specific playable race. Shows which factions start hostile or friendly for that race, useful for character creation decisions.',
    inputSchema: {
      type: 'object',
      properties: {
        race: {
          type: 'string',
          description: 'Race name (e.g., "Dark Elf", "Iksar", "Human", "Gnome")'
        }
      },
      required: ['race']
    }
  },
  {
    name: 'get_factions_by_deity',
    description: 'Show all faction standings for followers of a specific deity. Shows which factions start hostile or friendly based on deity choice, useful for character creation decisions.',
    inputSchema: {
      type: 'object',
      properties: {
        deity: {
          type: 'string',
          description: 'Deity name (e.g., "Tunare", "Innoruuk", "Cazic-Thule", "Bristlebane", "Agnostic")'
        }
      },
      required: ['deity']
    }
  },
  {
    name: 'get_factions_by_class',
    description: 'Show all faction standings for a specific class. Shows which factions start hostile or friendly based on class choice.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Necromancer", "Paladin", "Shadow Knight", "Rogue")'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_character_factions',
    description: 'Calculate combined starting faction standings for a character based on race, deity, and class choices. Shows the total faction value from all modifiers with breakdown. Essential for character creation planning.',
    inputSchema: {
      type: 'object',
      properties: {
        race: {
          type: 'string',
          description: 'Race name (e.g., "Dark Elf", "Iksar", "Human")'
        },
        deity: {
          type: 'string',
          description: 'Deity name (e.g., "Tunare", "Innoruuk", "Agnostic"). Optional.'
        },
        class: {
          type: 'string',
          description: 'Class name (e.g., "Necromancer", "Paladin"). Optional.'
        }
      },
      required: ['race']
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
    name: 'search_zones_by_name',
    description: 'Search EverQuest zones by name from local game data. Optionally filter by level range. Shows zone names, level ranges, and IDs.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Zone name to search for (e.g., "Plane of", "Kunark", "Temple")'
        },
        level_min: {
          type: 'number',
          description: 'Optional: minimum level filter'
        },
        level_max: {
          type: 'number',
          description: 'Optional: maximum level filter'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_zones_by_level',
    description: 'Search EverQuest zones by level range. Find zones appropriate for a character level from local game data.',
    inputSchema: {
      type: 'object',
      properties: {
        level_min: {
          type: 'number',
          description: 'Minimum level (e.g., 60)'
        },
        level_max: {
          type: 'number',
          description: 'Maximum level (e.g., 70)'
        }
      },
      required: ['level_min', 'level_max']
    }
  },
  {
    name: 'search_teleport_spells',
    description: 'Find all spells that teleport to a specific zone. Search by zone short name (e.g., "potranquility", "nexus") or spell name keyword.',
    inputSchema: {
      type: 'object',
      properties: {
        zone: {
          type: 'string',
          description: 'Zone short name or keyword (e.g., "potranquility", "nexus", "gate")'
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
    name: 'list_expansions',
    description: 'List all EverQuest expansions with their numeric IDs, from Classic EverQuest through the latest expansion.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_expansion',
    description: 'Get content summary for a specific EverQuest expansion. Shows factions and achievement categories with counts for that expansion.',
    inputSchema: {
      type: 'object',
      properties: {
        expansion: {
          type: 'string',
          description: 'Expansion name or number (e.g., "Ruins of Kunark", "1", "Planes of Power", "4")'
        }
      },
      required: ['expansion']
    }
  },
  {
    name: 'list_spell_categories',
    description: 'List all EverQuest spell categories (Heals, Fire, Cold, Direct Damage, DoT, Charm, Fear, etc.). Use these category names with get_spells_by_class for filtered spell lists.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'search_spells_by_effect',
    description: 'Search for EverQuest spells by their spell effect type (SPA). Find all spells with a specific effect like Stun, Haste, Charm, Fear, Root, Snare, Slow, Mesmerize, Gate, Resurrection, Damage Shield, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        effect: {
          type: 'string',
          description: 'Effect name to search for (e.g., "Stun", "Haste", "Charm", "Fear", "Root", "Snare", "Slow", "Mesmerize", "Gate", "Resurrection", "Damage Shield")'
        },
        class: {
          type: 'string',
          description: 'Optional: filter to spells usable by this class (e.g., "Enchanter", "ENC")'
        }
      },
      required: ['effect']
    }
  },
  {
    name: 'search_game_events',
    description: 'Search EverQuest in-game event announcements (Erollisi Day, Frostfell, bonus events, membership promotions, etc.). These are the "What\'s New" bulletin messages shown in the game client.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search text (e.g., "Erollisi", "bonus", "pirate", "Frostfell")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_game_event',
    description: 'Get details of a specific EverQuest in-game event announcement by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The event ID (from search results)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_creature_types',
    description: 'Search 980+ EverQuest creature/NPC race types (e.g., Aviaks, Werewolves, Giants, Golems, Centaurs). An encyclopedia of every creature type in the game.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Creature type to search for (e.g., "dragon", "undead", "golem", "elemental")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'compare_races',
    description: 'Compare two EverQuest races side by side. Shows stat differences, shared and unique classes, and deity availability. Useful for character creation decisions.',
    inputSchema: {
      type: 'object',
      properties: {
        race1: {
          type: 'string',
          description: 'First race name (e.g., "Dark Elf", "Human")'
        },
        race2: {
          type: 'string',
          description: 'Second race name (e.g., "High Elf", "Drakkin")'
        }
      },
      required: ['race1', 'race2']
    }
  },
  {
    name: 'compare_deities',
    description: 'Compare two EverQuest deities side by side. Shows follower races, available classes, and lore for each deity. Useful for character creation deity selection.',
    inputSchema: {
      type: 'object',
      properties: {
        deity1: {
          type: 'string',
          description: 'First deity name (e.g., "Tunare", "Innoruuk")'
        },
        deity2: {
          type: 'string',
          description: 'Second deity name (e.g., "Karana", "Cazic-Thule")'
        }
      },
      required: ['deity1', 'deity2']
    }
  },
  {
    name: 'list_all_races',
    description: 'List all 16 playable EverQuest races with base stats, available classes, deities, and descriptions. Quick reference for character creation.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_all_classes',
    description: 'List all 16 EverQuest classes with type (melee/hybrid/caster), available races, spell counts, and descriptions. Quick reference for character creation.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_all_deities',
    description: 'List all EverQuest deities with follower races, available classes, and lore. Quick reference for character creation deity selection.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_augment_slot_types',
    description: 'List all EverQuest augmentation slot types. Reference for understanding which augments fit in which equipment slots.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_item_lore_groups',
    description: 'Search item lore groups — groups that define which items are LORE duplicates (you can only carry one per group). Call without query to list first 50.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search text to filter lore groups (e.g., "earring", "charm", "seal"). Leave empty to list all.'
        }
      },
      required: []
    }
  },
  {
    name: 'get_class_abilities_at_level',
    description: 'Show all spells a class obtains at a specific level, grouped by category with buff/debuff type and target. Useful for leveling guides and understanding class progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "Wizard", "Shaman")'
        },
        level: {
          type: 'number',
          description: 'Character level to check (1-125)'
        }
      },
      required: ['class', 'level']
    }
  },
  {
    name: 'list_spell_effect_types',
    description: 'List all spell effect types (SPA IDs) that can be used with search_spells_by_effect. Shows direct effects and focus/AA limit effects separately.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_spells_by_cast_time',
    description: 'Search spells by cast time for a class. Find instant casts, fast heals, or slow nukes. Cast time is in milliseconds (1000 = 1 second).',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "Wizard")'
        },
        max_cast_ms: {
          type: 'number',
          description: 'Maximum cast time in milliseconds (e.g., 0 for instant, 1000 for ≤1s, 3000 for ≤3s)'
        },
        min_cast_ms: {
          type: 'number',
          description: 'Minimum cast time in milliseconds (e.g., 5000 for ≥5s casts)'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_race_class_matrix',
    description: 'Show a visual matrix of all race-class combinations in EverQuest. Shows which races can play which classes and counts per race/class.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_leveling_zones_guide',
    description: 'Complete EverQuest leveling zones guide — all zones grouped by 10-level brackets with level ranges. Quick reference for finding zones appropriate for any level.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_overseer_quest_summary',
    description: 'Overview of the Overseer system — quest categories, difficulties, durations, and agent statistics with rarity and job type breakdowns.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_mercenary_overview',
    description: 'Overview of the Mercenary system — mercenary types, tiers, races, and available stances with descriptions.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_spells_by_recast_time',
    description: 'Search spells by recast (cooldown) time for a class. Find long-cooldown disciplines, short-recast nukes, etc. Specify at least one of max or min recast seconds.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Warrior", "Cleric")'
        },
        max_recast_sec: {
          type: 'number',
          description: 'Maximum recast time in seconds (e.g., 60 for 1 minute or less)'
        },
        min_recast_sec: {
          type: 'number',
          description: 'Minimum recast time in seconds (e.g., 300 for 5+ minute cooldowns)'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_character_creation_guide',
    description: 'Role-based character creation advisor. Shows which classes fill each role (tank, healer, melee DPS, caster DPS, crowd control, utility) with race options, spell counts, and recommendations. Optionally filter by a specific role.',
    inputSchema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          description: 'Optional role to focus on: "tank", "healer", "melee dps", "caster dps", "crowd control", or "utility". Omit for overview of all roles.'
        }
      },
      required: []
    }
  },
  {
    name: 'search_spells_by_range',
    description: 'Search spells by casting range or AE (area effect) range for a class. Find long-range nukes, close-range AE spells, etc. Specify at least one of max or min range.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Wizard", "Cleric")'
        },
        max_range: {
          type: 'number',
          description: 'Maximum range value (e.g., 200 for close-range only)'
        },
        min_range: {
          type: 'number',
          description: 'Minimum range value (e.g., 200 for long-range spells)'
        },
        ae_only: {
          type: 'boolean',
          description: 'If true, search by AE range instead of casting range'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'search_spells_by_mana_cost',
    description: 'Search spells by mana or endurance cost for a class. Find cheap efficient spells or expensive high-impact ones. Specify at least one of max or min cost.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "Warrior")'
        },
        max_cost: {
          type: 'number',
          description: 'Maximum mana/endurance cost'
        },
        min_cost: {
          type: 'number',
          description: 'Minimum mana/endurance cost'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'search_spells_by_duration',
    description: 'Search spells by buff/debuff duration for a class. Find short-duration emergency spells or long-lasting buffs. Specify at least one of max or min duration in seconds.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Enchanter", "Shaman")'
        },
        max_duration_sec: {
          type: 'number',
          description: 'Maximum duration in seconds (e.g., 60 for ≤1 minute spells)'
        },
        min_duration_sec: {
          type: 'number',
          description: 'Minimum duration in seconds (e.g., 3600 for 1+ hour buffs)'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_faction_overview',
    description: 'Overview of the EverQuest faction system — total faction count, factions by expansion/category, value range distribution, and starting modifier statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_spells_by_pushback',
    description: 'Search spells with knockback/pushback effects for a class. Find spells that push targets backward or upward.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Wizard", "Druid")'
        },
        min_pushback: {
          type: 'number',
          description: 'Minimum pushback value to filter by (optional)'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_deity_class_matrix',
    description: 'Visual matrix showing which classes can worship each deity, derived from race-deity and race-class data. Shows X/- grid with totals.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_spells_by_recovery_time',
    description: 'Search spells by recovery time (delay after casting before next action) for a class. Shows cast time + recovery = total lockout. Specify at least one of max or min recovery in milliseconds.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Wizard", "Cleric")'
        },
        max_recovery_ms: {
          type: 'number',
          description: 'Maximum recovery time in milliseconds'
        },
        min_recovery_ms: {
          type: 'number',
          description: 'Minimum recovery time in milliseconds'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'compare_factions',
    description: 'Compare two EverQuest factions side by side — expansion, value ranges, starting values by race. Search by name or ID.',
    inputSchema: {
      type: 'object',
      properties: {
        faction1: {
          type: 'string',
          description: 'First faction name or ID'
        },
        faction2: {
          type: 'string',
          description: 'Second faction name or ID'
        }
      },
      required: ['faction1', 'faction2']
    }
  },
  {
    name: 'get_zone_level_statistics',
    description: 'Statistics on EverQuest zones by level — zone count per 10-level band with bar chart, peak levels with most zone options, widest level range zone.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_achievement_overview',
    description: 'Overview of the EverQuest achievement system — total count, point distribution, hidden/locked stats, and achievement counts by top-level category (expansion).',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'compare_expansions',
    description: 'Compare two EverQuest expansions side by side — faction counts, achievement counts, and faction lists. Search by name or number.',
    inputSchema: {
      type: 'object',
      properties: {
        expansion1: {
          type: 'string',
          description: 'First expansion name or number (e.g., "Kunark", "2")'
        },
        expansion2: {
          type: 'string',
          description: 'Second expansion name or number'
        }
      },
      required: ['expansion1', 'expansion2']
    }
  },
  {
    name: 'search_spells_by_subcategory',
    description: 'Search spells by subcategory (e.g., "Quick Heal", "Fire DD", "Haste"). Shows spells in a specific subcategory for a class. If subcategory not found, lists available subcategories.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "Enchanter")'
        },
        subcategory: {
          type: 'string',
          description: 'Spell subcategory name (e.g., "Quick Heal", "Stun", "Haste", "Root")'
        }
      },
      required: ['class', 'subcategory']
    }
  },
  {
    name: 'get_aa_overview',
    description: 'Overview of the EverQuest AA (Alternate Advancement) system — total AA count, description statistics, common keyword analysis, and rank distribution.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_overseer_agents_by_trait',
    description: 'Search overseer agents by trait name (e.g., "Diplomat", "Scholar", "Soldier"). Shows matching agents with rarity, all traits, and jobs. If trait not found, lists all available traits.',
    inputSchema: {
      type: 'object',
      properties: {
        trait: {
          type: 'string',
          description: 'Trait name to search for (e.g., "Diplomat", "Scholar")'
        }
      },
      required: ['trait']
    }
  },
  {
    name: 'get_game_event_overview',
    description: 'Overview of EverQuest game events and announcements — event count, categorized breakdown (seasonal, expansion, double XP, etc.), and banner statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_lore_overview',
    description: 'Overview of EverQuest lore stories from game files — total story count, word count statistics, longest/shortest stories, and complete listing with word counts.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_currency_overview',
    description: 'Overview of all EverQuest alternate currencies — total count, currencies with/without descriptions, keyword frequency analysis, and complete listing.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_map_statistics',
    description: 'Statistics on EverQuest zone maps and points of interest (POIs) — zones with map data, total POI counts, density distribution, and top zones by POI count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_drakkin_heritages',
    description: 'List all Drakkin dragon heritages — heritage names, IDs, and available classes for each bloodline.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_spells_with_recourse',
    description: 'Find spells that have recourse (follow-up) effects — spells that automatically cast a second spell on the caster when they land on a target. Optionally filter by class.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name to filter by (e.g., "Cleric", "Wizard"). Omit to search all classes.'
        }
      },
      required: []
    }
  },
  {
    name: 'compare_base_stats',
    description: 'Compare base HP, mana, endurance, and regen progression between two classes at all level milestones or a specific level.',
    inputSchema: {
      type: 'object',
      properties: {
        class1: {
          type: 'string',
          description: 'First class name (e.g., "Warrior")'
        },
        class2: {
          type: 'string',
          description: 'Second class name (e.g., "Cleric")'
        },
        level: {
          type: 'number',
          description: 'Optional specific level to compare at. Omit for milestone comparison.'
        }
      },
      required: ['class1', 'class2']
    }
  },
  {
    name: 'compare_skill_caps',
    description: 'Compare skill caps between two classes at a specific level — shows shared skills with cap differences, and skills unique to each class.',
    inputSchema: {
      type: 'object',
      properties: {
        class1: {
          type: 'string',
          description: 'First class name (e.g., "Warrior")'
        },
        class2: {
          type: 'string',
          description: 'Second class name (e.g., "Rogue")'
        },
        level: {
          type: 'number',
          description: 'Level to compare at (default: 125)'
        }
      },
      required: ['class1', 'class2']
    }
  },
  {
    name: 'get_base_stat_overview',
    description: 'Overview of all 16 classes\' base HP, mana, endurance, and regen at a specific level — ranked by HP with mana rankings.',
    inputSchema: {
      type: 'object',
      properties: {
        level: {
          type: 'number',
          description: 'Character level to show stats for (1-125)'
        }
      },
      required: ['level']
    }
  },
  {
    name: 'get_spell_effect_overview',
    description: 'Overview of all spell effect types (SPAs) in EverQuest — top 50 most common effects, effect category breakdown, and rarest effects.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_skill_overview',
    description: 'Overview of all EverQuest skills with a class-skill matrix — shows which classes can use each combat and magic skill at level 125, plus skills-per-class rankings.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_growth_curve',
    description: 'Spell progression curve for a class — new spells per level bracket, top spell-gain levels, cumulative growth chart, and longest dry spell analysis.',
    inputSchema: {
      type: 'object',
      properties: {
        class: {
          type: 'string',
          description: 'Class name (e.g., "Wizard", "Cleric")'
        }
      },
      required: ['class']
    }
  },
  {
    name: 'get_race_stat_comparison',
    description: 'All 16 playable races\' starting stats in one comparison table — sorted by total stats, per-stat rankings (best race for STR/STA/etc.), and stat spread analysis.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_deity_overview',
    description: 'Overview of all EverQuest deities — how many races and classes can worship each deity, race lists per deity, and accessibility rankings.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_comparison_matrix',
    description: 'Compare all 16 classes side by side — spell count, beneficial spell %, skill count, base HP/mana at 125, pet availability, and rankings.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_expansion_timeline',
    description: 'Timeline of all 33 EverQuest expansions with faction and achievement counts per expansion.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_spells_by_endurance',
    description: 'Search for class abilities that cost endurance (combat abilities, disciplines). Filter by endurance cost range. Complements mana cost search for melee/hybrid classes.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g., "Warrior", "Monk", "Berserker")' },
        max_endurance: { type: 'number', description: 'Maximum endurance cost (optional)' },
        min_endurance: { type: 'number', description: 'Minimum endurance cost (optional)' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_ac_mitigation_comparison',
    description: 'Compare AC soft caps and soft cap multipliers across all 16 classes at a given level. Shows armor tier groupings (Plate/Chain/Leather/Light) and rankings.',
    inputSchema: {
      type: 'object',
      properties: {
        level: { type: 'number', description: 'Character level to compare (default: 125)' }
      },
      required: []
    }
  },
  {
    name: 'get_tribute_overview',
    description: 'Overview of the EverQuest tribute system showing all personal and guild tributes with descriptions and common themes.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_help_topics',
    description: 'Search 70+ official EverQuest in-game help topics covering game mechanics: augments, combat, experience, fellowships, guilds, housing, mercenaries, overseer, skills, spells, tradeskills, and more. Call without query to list all topics.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Topic to search for (e.g., "augment", "combat", "mercenary", "guild"). Leave empty to list all topics.'
        }
      },
      required: []
    }
  },
  {
    name: 'get_help_topic',
    description: 'Read a specific EverQuest in-game help topic. Use search_help_topics to find available topics.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Help topic name (e.g., "augments", "combatsystems", "experience", "mercenaries", "overseer")'
        }
      },
      required: ['topic']
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
  if (spell.beneficial !== undefined) {
    lines.push(`**Type:** ${spell.beneficial ? 'Beneficial' : 'Detrimental'}`);
  }
  if (spell.mana) lines.push(`**Mana:** ${spell.mana}`);
  if (spell.endurance) lines.push(`**Endurance:** ${spell.endurance}`);
  if (spell.castTime) lines.push(`**Cast Time:** ${spell.castTime}`);
  if (spell.recoveryTime) lines.push(`**Recovery:** ${spell.recoveryTime}`);
  if (spell.recastTime) lines.push(`**Recast Time:** ${spell.recastTime}`);
  if (spell.duration) lines.push(`**Duration:** ${spell.duration}`);
  if (spell.range) lines.push(`**Range:** ${spell.range}`);
  if (spell.aeRange) lines.push(`**AE Range:** ${spell.aeRange}`);
  if (spell.target) lines.push(`**Target:** ${spell.target}`);
  if (spell.resist) lines.push(`**Resist:** ${spell.resist}`);
  if (spell.skill) lines.push(`**Skill:** ${spell.skill}`);
  if (spell.pushBack) lines.push(`**Push Back:** ${spell.pushBack}`);
  if (spell.pushUp) lines.push(`**Push Up:** ${spell.pushUp}`);
  if (spell.timerId) lines.push(`**Timer:** ${spell.timerId}`);
  if (spell.teleportZone) lines.push(`**Teleport Zone:** ${spell.teleportZone}`);
  if (spell.recourseName) {
    lines.push(`**Recourse:** ${spell.recourseName} (ID: ${spell.recourseId})`);
  }

  // Classes with levels
  if (spell.classes && typeof spell.classes === 'object') {
    const classEntries = Object.entries(spell.classes)
      .map(([cls, level]) => `${cls}(${level})`)
      .join(' ');
    lines.push(`**Classes:** ${classEntries}`);
  }

  // Cast messages
  if (spell.raw) {
    lines.push('', '## Cast Messages');
    for (const msg of spell.raw.split('\n')) {
      if (msg.trim()) lines.push(`- ${msg}`);
    }
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
    { name: 'Local Game Data', specialty: 'Authoritative offline data from EQ game files: spells (70K+ with 500+ effect types & categories), zones, skill caps, class stats, achievements, factions (1600+), AA abilities (2700+), combat abilities (950), mercenaries (4200+ with stances & abilities), AC mitigation, spell stacking, map POIs (34K+), lore (50 stories), game strings (7K), Overseer agents (300+ with archetypes, jobs & traits) & quests (800+ with slots, incapacitations & outcomes), race/class info (16/16 with starting city lore & Drakkin heritages), deities (17 with lore), stats, tributes (266), alt currencies (54), item effects (1100+), creature/NPC race types (980+), banner/campsite categories, expansion list (33), game events/bulletins (550+)', url: isGameDataAvailable() ? 'Available' : 'Not found (set EQ_GAME_PATH env var)' },
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

      case 'search_spells_by_name': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query) return 'Error: "query" parameter is required';
        return searchSpellsByName(query);
      }

      case 'search_spells_by_resist': {
        const resistType = typeof args.resist_type === 'string' ? args.resist_type.trim() : '';
        if (!resistType) return 'Error: "resist_type" parameter is required';
        const className = typeof args.class === 'string' ? args.class.trim() : undefined;
        return searchSpellsByResist(resistType, className);
      }

      case 'search_spells_by_target': {
        const targetType = typeof args.target_type === 'string' ? args.target_type.trim() : '';
        if (!targetType) return 'Error: "target_type" parameter is required';
        const className = typeof args.class === 'string' ? args.class.trim() : undefined;
        return searchSpellsByTarget(targetType, className);
      }

      case 'search_spells_by_description': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query) return 'Error: "query" parameter is required';
        const className = typeof args.class === 'string' ? args.class.trim() : undefined;
        return searchSpellsByDescription(query, className);
      }

      case 'search_timer_group': {
        const timer = typeof args.timer === 'string' ? args.timer.trim() : '';
        if (!timer) return 'Error: "timer" parameter is required';
        const className = typeof args.class === 'string' ? args.class.trim() : undefined;
        return searchTimerGroup(timer, className);
      }

      case 'compare_spells': {
        const spell1 = typeof args.spell1 === 'string' ? args.spell1.trim() : '';
        const spell2 = typeof args.spell2 === 'string' ? args.spell2.trim() : '';
        if (!spell1) return 'Error: "spell1" parameter is required';
        if (!spell2) return 'Error: "spell2" parameter is required';
        return compareSpells(spell1, spell2);
      }

      case 'get_shared_spells': {
        const class1 = typeof args.class1 === 'string' ? args.class1.trim() : '';
        const class2 = typeof args.class2 === 'string' ? args.class2.trim() : '';
        if (!class1) return 'Error: "class1" parameter is required';
        if (!class2) return 'Error: "class2" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        return getSharedSpells(class1, class2, level);
      }

      case 'get_spell_line': {
        const spell = typeof args.spell === 'string' ? args.spell.trim() : '';
        if (!spell) return 'Error: "spell" parameter is required';
        return getSpellLine(spell);
      }

      case 'search_beneficial_spells': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const beneficial = typeof args.beneficial === 'boolean' ? args.beneficial : true;
        const level = typeof args.level === 'number' ? args.level : undefined;
        return searchSpellsByBeneficial(className, beneficial, level);
      }

      case 'get_exclusive_spells': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        return getExclusiveSpells(className, level);
      }

      case 'compare_classes': {
        const class1 = typeof args.class1 === 'string' ? args.class1.trim() : '';
        const class2 = typeof args.class2 === 'string' ? args.class2.trim() : '';
        if (!class1) return 'Error: "class1" parameter is required';
        if (!class2) return 'Error: "class2" parameter is required';
        return compareClasses(class1, class2);
      }

      case 'search_spells_advanced': {
        return searchSpellsAdvanced({
          class: typeof args.class === 'string' ? args.class.trim() : undefined,
          minLevel: typeof args.min_level === 'number' ? args.min_level : undefined,
          maxLevel: typeof args.max_level === 'number' ? args.max_level : undefined,
          beneficial: typeof args.beneficial === 'boolean' ? args.beneficial : undefined,
          targetType: typeof args.target_type === 'string' ? args.target_type.trim() : undefined,
          resistType: typeof args.resist_type === 'string' ? args.resist_type.trim() : undefined,
          category: typeof args.category === 'string' ? args.category.trim() : undefined,
          nameContains: typeof args.name === 'string' ? args.name.trim() : undefined,
          hasEffect: typeof args.effect === 'string' ? args.effect.trim() : undefined,
        });
      }

      case 'get_class_spell_summary': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        return getClassSpellSummary(className);
      }

      case 'get_spells_by_class': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        const category = typeof args.category === 'string' ? args.category.trim() : undefined;
        const resistType = typeof args.resist_type === 'string' ? args.resist_type.trim() : undefined;
        return getSpellsByClass(className, level, category, resistType);
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
        const category = typeof args.category === 'string' ? args.category.trim() : undefined;
        const results = await searchAchievements(query, category);
        return formatSearchResults(results, query);
      }

      case 'get_achievement': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getAchievement(id);
      }

      case 'list_achievement_categories': {
        return listAchievementCategories();
      }

      case 'get_achievement_category': {
        const categoryId = typeof args.category_id === 'string' ? args.category_id.trim() : '';
        if (!categoryId) return 'Error: "category_id" parameter is required';
        return getAchievementsByCategory(categoryId);
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

      case 'search_stacking_groups': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        return searchSpellStackingGroups(query);
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

      case 'get_factions_by_race': {
        const race = typeof args.race === 'string' ? args.race.trim() : '';
        if (!race) return 'Error: "race" parameter is required';
        return getFactionsByRace(race);
      }

      case 'get_factions_by_deity': {
        const deity = typeof args.deity === 'string' ? args.deity.trim() : '';
        if (!deity) return 'Error: "deity" parameter is required';
        return getFactionsByDeity(deity);
      }

      case 'get_factions_by_class': {
        const cls = typeof args.class === 'string' ? args.class.trim() : '';
        if (!cls) return 'Error: "class" parameter is required';
        return getFactionsByClass(cls);
      }

      case 'get_character_factions': {
        const race = typeof args.race === 'string' ? args.race.trim() : '';
        if (!race) return 'Error: "race" parameter is required';
        const deity = typeof args.deity === 'string' ? args.deity.trim() : undefined;
        const cls = typeof args.class === 'string' ? args.class.trim() : undefined;
        return getCharacterFactions(race, deity, cls);
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

      case 'search_zones_by_name': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query) return 'Error: "query" parameter is required';
        const levelMin = typeof args.level_min === 'number' ? args.level_min : undefined;
        const levelMax = typeof args.level_max === 'number' ? args.level_max : undefined;
        return searchZonesByName(query, levelMin, levelMax);
      }

      case 'search_zones_by_level': {
        const levelMin = typeof args.level_min === 'number' ? args.level_min : 0;
        const levelMax = typeof args.level_max === 'number' ? args.level_max : 999;
        if (levelMin <= 0 && levelMax >= 999) return 'Error: provide a valid level range';
        return searchLocalZonesByLevel(levelMin, levelMax);
      }

      case 'search_teleport_spells': {
        const zone = typeof args.zone === 'string' ? args.zone.trim() : '';
        if (!zone) return 'Error: "zone" parameter is required';
        return searchTeleportSpells(zone);
      }

      case 'get_banner_categories': {
        return getBannerCategories();
      }

      case 'list_expansions': {
        return listExpansions();
      }

      case 'get_expansion': {
        const expansion = typeof args.expansion === 'string' ? args.expansion.trim() : '';
        if (!expansion) return 'Error: "expansion" parameter is required';
        return getExpansionContent(expansion);
      }

      case 'list_spell_categories': {
        return listSpellCategories();
      }

      case 'search_spells_by_effect': {
        const effect = typeof args.effect === 'string' ? args.effect.trim() : '';
        if (!effect) return 'Error: "effect" parameter is required';
        const className = typeof args.class === 'string' ? args.class.trim() : undefined;
        return searchSpellsByEffect(effect, className);
      }

      case 'search_game_events': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        const results = await searchGameEvents(query);
        return results.length > 0 ? formatSearchResults(results, query) : `No game events found for "${query}"`;
      }

      case 'get_game_event': {
        const error = validateId(args);
        if (error) return error;
        const id = (args.id as string).trim();
        return getGameEvent(id);
      }

      case 'search_creature_types': {
        const error = validateQuery(args);
        if (error) return error;
        const query = (args.query as string).trim();
        return searchCreatureTypes(query);
      }

      case 'compare_races': {
        const race1 = typeof args.race1 === 'string' ? args.race1.trim() : '';
        const race2 = typeof args.race2 === 'string' ? args.race2.trim() : '';
        if (!race1) return 'Error: "race1" parameter is required';
        if (!race2) return 'Error: "race2" parameter is required';
        return compareRaces(race1, race2);
      }

      case 'compare_deities': {
        const deity1 = typeof args.deity1 === 'string' ? args.deity1.trim() : '';
        const deity2 = typeof args.deity2 === 'string' ? args.deity2.trim() : '';
        if (!deity1) return 'Error: "deity1" parameter is required';
        if (!deity2) return 'Error: "deity2" parameter is required';
        return compareDeities(deity1, deity2);
      }

      case 'list_all_races': {
        return listAllRaces();
      }

      case 'list_all_classes': {
        return listAllClasses();
      }

      case 'list_all_deities': {
        return listAllDeities();
      }

      case 'list_augment_slot_types': {
        return listAugmentSlotTypes();
      }

      case 'search_item_lore_groups': {
        const query = typeof args.query === 'string' ? args.query.trim() : undefined;
        return searchItemLoreGroups(query);
      }

      case 'get_class_abilities_at_level': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        const level = typeof args.level === 'number' ? args.level : parseInt(String(args.level)) || 0;
        if (!className) return 'Error: "class" parameter is required';
        if (!level || level < 1) return 'Error: "level" parameter is required (1-125)';
        return getClassAbilitiesAtLevel(className, level);
      }

      case 'list_spell_effect_types': {
        return listSpellEffectTypes();
      }

      case 'search_spells_by_cast_time': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const maxCastMs = typeof args.max_cast_ms === 'number' ? args.max_cast_ms : undefined;
        const minCastMs = typeof args.min_cast_ms === 'number' ? args.min_cast_ms : undefined;
        if (maxCastMs === undefined && minCastMs === undefined) {
          return 'Error: Specify at least one of "max_cast_ms" or "min_cast_ms"';
        }
        return searchSpellsByCastTime(className, maxCastMs, minCastMs);
      }

      case 'get_race_class_matrix': {
        return getRaceClassMatrix();
      }

      case 'get_leveling_zones_guide': {
        return getLevelingZonesGuide();
      }

      case 'get_overseer_quest_summary': {
        return getOverseerQuestSummary();
      }

      case 'get_mercenary_overview': {
        return getMercenaryOverview();
      }

      case 'search_spells_by_recast_time': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const maxRecastSec = typeof args.max_recast_sec === 'number' ? args.max_recast_sec : undefined;
        const minRecastSec = typeof args.min_recast_sec === 'number' ? args.min_recast_sec : undefined;
        if (maxRecastSec === undefined && minRecastSec === undefined) {
          return 'Error: Specify at least one of "max_recast_sec" or "min_recast_sec"';
        }
        return searchSpellsByRecastTime(className, maxRecastSec, minRecastSec);
      }

      case 'get_character_creation_guide': {
        const role = typeof args.role === 'string' ? args.role.trim() : undefined;
        return getCharacterCreationGuide(role);
      }

      case 'search_spells_by_range': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const maxRange = typeof args.max_range === 'number' ? args.max_range : undefined;
        const minRange = typeof args.min_range === 'number' ? args.min_range : undefined;
        if (maxRange === undefined && minRange === undefined) {
          return 'Error: Specify at least one of "max_range" or "min_range"';
        }
        const aeOnly = args.ae_only === true;
        return searchSpellsByRange(className, maxRange, minRange, aeOnly);
      }

      case 'search_spells_by_mana_cost': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const maxCost = typeof args.max_cost === 'number' ? args.max_cost : undefined;
        const minCost = typeof args.min_cost === 'number' ? args.min_cost : undefined;
        if (maxCost === undefined && minCost === undefined) {
          return 'Error: Specify at least one of "max_cost" or "min_cost"';
        }
        return searchSpellsByManaCost(className, maxCost, minCost);
      }

      case 'search_spells_by_duration': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const maxDur = typeof args.max_duration_sec === 'number' ? args.max_duration_sec : undefined;
        const minDur = typeof args.min_duration_sec === 'number' ? args.min_duration_sec : undefined;
        if (maxDur === undefined && minDur === undefined) {
          return 'Error: Specify at least one of "max_duration_sec" or "min_duration_sec"';
        }
        return searchSpellsByDuration(className, maxDur, minDur);
      }

      case 'get_faction_overview': {
        return getFactionOverview();
      }

      case 'search_spells_by_pushback': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const minPushback = typeof args.min_pushback === 'number' ? args.min_pushback : undefined;
        return searchSpellsByPushback(className, minPushback);
      }

      case 'get_deity_class_matrix': {
        return getDeityClassMatrix();
      }

      case 'search_spells_by_recovery_time': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        const maxRec = typeof args.max_recovery_ms === 'number' ? args.max_recovery_ms : undefined;
        const minRec = typeof args.min_recovery_ms === 'number' ? args.min_recovery_ms : undefined;
        if (maxRec === undefined && minRec === undefined) {
          return 'Error: Specify at least one of "max_recovery_ms" or "min_recovery_ms"';
        }
        return searchSpellsByRecoveryTime(className, maxRec, minRec);
      }

      case 'compare_factions': {
        const faction1 = typeof args.faction1 === 'string' ? args.faction1.trim() : '';
        const faction2 = typeof args.faction2 === 'string' ? args.faction2.trim() : '';
        if (!faction1) return 'Error: "faction1" parameter is required';
        if (!faction2) return 'Error: "faction2" parameter is required';
        return compareFactions(faction1, faction2);
      }

      case 'get_zone_level_statistics': {
        return getZoneLevelStatistics();
      }

      case 'get_achievement_overview': {
        return getAchievementOverview();
      }

      case 'compare_expansions': {
        const exp1 = typeof args.expansion1 === 'string' ? args.expansion1.trim() : '';
        const exp2 = typeof args.expansion2 === 'string' ? args.expansion2.trim() : '';
        if (!exp1) return 'Error: "expansion1" parameter is required';
        if (!exp2) return 'Error: "expansion2" parameter is required';
        return compareExpansions(exp1, exp2);
      }

      case 'search_spells_by_subcategory': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        const subcategory = typeof args.subcategory === 'string' ? args.subcategory.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        if (!subcategory) return 'Error: "subcategory" parameter is required';
        return searchSpellsBySubcategory(className, subcategory);
      }

      case 'get_aa_overview': {
        return getAAOverview();
      }

      case 'search_overseer_agents_by_trait': {
        const trait = typeof args.trait === 'string' ? args.trait.trim() : '';
        if (!trait) return 'Error: "trait" parameter is required';
        return searchOverseerAgentsByTrait(trait);
      }

      case 'get_game_event_overview': {
        return getGameEventOverview();
      }

      case 'get_lore_overview': {
        return getLoreOverview();
      }

      case 'get_currency_overview': {
        return getCurrencyOverview();
      }

      case 'get_map_statistics': {
        return getMapStatistics();
      }

      case 'list_drakkin_heritages': {
        return listDrakkinHeritages();
      }

      case 'search_spells_with_recourse': {
        const className = typeof args.class === 'string' ? args.class.trim() : undefined;
        return searchSpellsWithRecourse(className);
      }

      case 'compare_base_stats': {
        const class1 = typeof args.class1 === 'string' ? args.class1.trim() : '';
        const class2 = typeof args.class2 === 'string' ? args.class2.trim() : '';
        if (!class1) return 'Error: "class1" parameter is required';
        if (!class2) return 'Error: "class2" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        return compareBaseStats(class1, class2, level);
      }

      case 'compare_skill_caps': {
        const class1 = typeof args.class1 === 'string' ? args.class1.trim() : '';
        const class2 = typeof args.class2 === 'string' ? args.class2.trim() : '';
        if (!class1) return 'Error: "class1" parameter is required';
        if (!class2) return 'Error: "class2" parameter is required';
        const level = typeof args.level === 'number' ? args.level : undefined;
        return compareSkillCaps(class1, class2, level);
      }

      case 'get_base_stat_overview': {
        const level = typeof args.level === 'number' ? args.level : 0;
        if (!level || level < 1) return 'Error: "level" parameter is required (1-125)';
        return getBaseStatOverview(level);
      }

      case 'get_spell_effect_overview': {
        return getSpellEffectOverview();
      }

      case 'get_skill_overview': {
        return getSkillOverview();
      }

      case 'get_spell_growth_curve': {
        const className = typeof args.class === 'string' ? args.class.trim() : '';
        if (!className) return 'Error: "class" parameter is required';
        return getSpellGrowthCurve(className);
      }

      case 'get_race_stat_comparison': {
        return getRaceStatComparison();
      }

      case 'get_deity_overview': {
        return getDeityOverview();
      }

      case 'get_class_comparison_matrix': {
        return getClassComparisonMatrix();
      }

      case 'get_expansion_timeline': {
        return getExpansionTimeline();
      }

      case 'search_spells_by_endurance': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required';
        const maxEndurance = typeof args.max_endurance === 'number' ? args.max_endurance : undefined;
        const minEndurance = typeof args.min_endurance === 'number' ? args.min_endurance : undefined;
        return searchSpellsByEndurance(className, maxEndurance, minEndurance);
      }

      case 'get_ac_mitigation_comparison': {
        const level = typeof args.level === 'number' ? args.level : undefined;
        return getACMitigationComparison(level);
      }

      case 'get_tribute_overview': {
        return getTributeOverview();
      }

      case 'search_help_topics': {
        const query = typeof args.query === 'string' ? args.query.trim() : undefined;
        return searchHelpTopics(query);
      }

      case 'get_help_topic': {
        const topic = typeof args.topic === 'string' ? args.topic.trim() : '';
        if (!topic) return 'Error: "topic" parameter is required';
        return getHelpTopic(topic);
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
