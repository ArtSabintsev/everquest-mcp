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
  getStartingCityLore,
  getCreatureTypeOverview,
  getOverseerJobOverview,
  getSpellResistOverview,
  getSpellTargetOverview,
  getAchievementComponentOverview,
  getMercenaryAbilityOverview,
  getSpellTimerOverview,
  getSpellCategoryBreakdown,
  getSharedSpellsOverview,
  getSpellDurationOverview,
  getResistTypeComparison,
  getSpellRequirementOverview,
  getFactionModifierOverview,
  getOverseerSlotAnalysis,
  getDbStringTypeOverview,
  getSpellLevelDistribution,
  getSpellCastTimeAnalysis,
  getSpellManaCostOverview,
  getSpellSubcategoryOverview,
  getClassUniqueSpellAnalysis,
  getTeleportSpellOverview,
  getCombatAbilityOverview,
  getItemEffectOverview,
  getSpellStackingOverview,
  getSpellAEAnalysis,
  getOverseerMinionRarityAnalysis,
  getSpellPushbackOverview,
  getAchievementRequirementAnalysis,
  getFactionStartingValueAnalysis,
  getMercenaryTierAnalysis,
  getSpellRecourseOverview,
  getTributeBenefitAnalysis,
  getSpellDurationFormulaAnalysis,
  getMapPOILabelAnalysis,
  getAANameGroupAnalysis,
  getSpellEffectCombinationAnalysis,
  getExpansionContentDensity,
  getClassSpellDiversityIndex,
  getGameDataSummaryDashboard,
  getFactionNetworkAnalysis,
  getSpellProgressionAnalysis,
  getTeleportNetworkAnalysis,
  getZoneContentDensityRanking,
  getClassPowerMilestoneTimeline,
  getResistTypeByLevelAnalysis,
  getClassRoleAnalysis,
  getSpellCostEfficiencyAnalysis,
  getDeityFactionImpactAnalysis,
  getSpellTargetTypeMatrix,
  getLevelContentGuide,
  getSpellScalingAnalysis,
  getRaceDeityOptimizer,
  getClassComparisonRadar,
  getExpansionImpactScore,
  getGroupCompositionAdvisor,
  getClassEndgameProfile,
  getSpellEffectRarityIndex,
  getMercenaryClassSynergy,
  getOverseerQuestEfficiencyAnalysis,
  getTributeRoleAnalysis,
  getItemEffectSpellCorrelation,
  getCreatureTypeFactionCorrelation,
  getAARoleThemeAnalysis,
  getAchievementCategoryDepthAnalysis,
  getMapPOIFunctionalClassification,
  searchAllLocalData,
  getGameEventCalendarAnalysis,
  getClassGroupBuffContribution,
  getClassSynergyMatrix,
  getSpellEffectEncyclopedia,
  getAchievementPointOptimizer,
  getOverseerAgentTraitJobMatrix,
  getSpellDebuffComparisonByClass,
  getContentProgressionPathway,
  getSpellBuffDurationTierList,
  getClassHealingComparisonMatrix,
  getZoneFactionWebAnalysis,
  getSpellDamageEfficiency,
  searchAAByDescription,
  getExpansionFactionTimeline,
  getClassPetComparisonMatrix,
  getSpellResistBarChart,
  getOverseerQuestCategoryGuide,
  getSpellNamePatternAnalysis,
  getZoneLevelGapAnalysis,
  getClassIdentityProfile,
  getSpellSchoolAnalysis,
  getAASpellCorrelation,
  getClassDefensiveProfile,
  getSpellCategoryCooccurrence,
  getClassManaProfile,
  getOverseerAgentJobCoverageOptimizer,
  getClassOffensiveProfile,
  getSpellTargetEffectMatrix,
  getAchievementExpansionTimeline,
  getItemEffectCategoryBreakdown,
  getTributeEfficiencyAnalysis,
  getGameStringCategoryAnalysis,
  getLoreThemeAnalysis,
  getAugmentationSystemAnalysis,
  getMapPOIZoneDetail,
  getHelpTopicContentAnalysis,
  getSpellLevelMilestoneGuide,
  getCrossSystemNameOverlap,
  getSpellDurationAnalysis,
  getAAAbilityRankAnalysis,
  getSpellRecastTimerAnalysis,
  getSkillCapProgressionAnalysis,
  getBaseStatGrowthCurveAnalysis,
  getOverseerQuestDifficultyAnalysis,
  saveDataSnapshot,
  getDataUpdateSummary,
  getDataUpdateDetail,
  getPlayerCustomizationOverview,
  getRaceAppearanceOptions,
  getCombatAbilityClassAnalysis,
  getSpellRequirementClassBreakdown,
  getACMitigationProgressionAnalysis,
  getSpellStackingConflictAnalysis,
  getMercenaryAbilitySpellAnalysis,
  getOverseerTraitSynergyAnalysis,
  getClassSpellLevelGapAnalysis,
  getDrakkinHeritageClassAnalysis,
  getSpellSubcategoryDepthAnalysis,
  getSkillCapCrossClassComparison,
  getSpellManaEfficiencyAnalysis,
  getFactionCategoryAnalysis,
  getOverseerQuestSlotJobAnalysis,
  getClassBuffDebuffRatio,
  getSpellRecourseChainAnalysis,
  getAchievementCompletionComplexity,
  getSpellEnduranceCostAnalysis,
  getClassSpellBookSizeComparison,
  getZoneLevelOverlapAnalysis,
  getClassCrowdControlProfile,
  getClassEmergencyAbilityAnalysis,
  getClassUtilitySpellComparison,
  getClassDoTProfile,
  getClassDirectDamageProfile,
  getSpellProcEffectAnalysis,
  getClassDebuffProfile,
  getClassSelfBuffProfile,
  getSpellSlowHasteComparison,
  getClassTauntAggroProfile,
  getSpellIllusionAnalysis,
  getSpellCastTimeDistribution,
  getSpellSummonAnalysis,
  getClassRegenProfile,
  getSpellDamageShieldProfile,
  getClassResurrectionComparison,
  getSpellRuneAbsorbProfile,
  getClassSpellEffectDiversity,
  getClassGroupBuffProfile,
  getClassHealBreakdown,
  getClassMeleeDisciplineProfile,
  getClassPetSpellProfile,
  getClassCureSpellProfile,
  getClassTransportProfile,
  getClassResistDebuffProfile,
  getClassManaRecoveryProfile,
  getClassSpellFocusProfile,
  getClassAESpellProfile,
  getClassInstantCastProfile,
  getClassBuffDurationAnalysis,
  getClassMeleeCombatProfile,
  getClassStatBuffProfile,
  getClassLifetapProfile,
  getClassAggroManagementProfile,
  getClassEnduranceProfile,
  getClassSkillModifierProfile,
  getClassSongModifierProfile,
  getClassACAttackProfile,
  getClassHasteSlowProfile,
  getClassSpellResistTypeProfile,
  getClassDeathSaveProfile,
  getClassSpellLineProgression,
  getClassResistBuffProfile,
  getClassHPRegenProfile,
  getClassSpellRangeProfile,
  getClassSpellAcquisitionCurve,
  getClassMovementProfile,
  getClassDamageShieldProfile,
  getClassStunMezProfile,
  getClassSpellFocusLimitProfile,
  getClassCharmFearProfile,
  getClassCritProfile,
  getClassAvoidanceProfile,
  getClassSpecialAttackProfile,
  getClassVisibilityProfile,
  getClassSilenceAmnesiaProfile,
  getClassProcProfile,
  getClassMaxHPManaProfile,
  getClassSpellBeneficialRatio,
  getClassPetEnhancementProfile,
  getClassTimerGroupProfile,
  getClassManaEfficiencyByLevel,
  getClassSpellCategoryProfile,
  getClassCastTimeDistribution,
  getClassRecastTimeProfile,
  getClassTargetTypeProfile,
  getClassRecourseProfile,
  getClassPushbackProfile,
  getClassSpellRecoveryProfile,
  getClassSpellOverlap,
  getClassAERangeProfile,
  getClassSpellDensityMap,
  getClassSpellUpgradeChains,
  getClassLevelCapProgression,
  getClassMultiEffectProfile,
  getClassSignatureSpells,
  getClassSPABreadth,
  getClassSpellScalingAnalysis,
  getClassDamagePerMana,
  getClassEnduranceVsManaProfile,
  getClassSpellNamePatterns,
  getClassHealPerMana,
  getClassIllusionProfile,
  getClassSummonProfile,
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
    name: 'get_starting_city_lore',
    description: 'Browse all starting city lore descriptions from EverQuest character creation, showing the flavor text for each starting city.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_creature_type_overview',
    description: 'Overview of all creature/NPC race types in EverQuest — alphabetical breakdown, common name words, name statistics, and ID range analysis.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_overseer_job_overview',
    description: 'Complete overview of the EverQuest Overseer system — all jobs, archetypes, quest categories, difficulty levels, traits, incapacitations, and minion rarity breakdown.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_resist_overview',
    description: 'Breakdown of spells by resist type (Magic, Fire, Cold, Poison, Disease, etc.) with beneficial/detrimental counts. Optionally filter by class.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name to filter by (optional — omit for all spells)' }
      },
      required: []
    }
  },
  {
    name: 'get_spell_target_overview',
    description: 'Breakdown of spells by target type (Single, Self, Group, AoE, etc.) with beneficial/detrimental counts and category analysis. Optionally filter by class.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name to filter by (optional — omit for all spells)' }
      },
      required: []
    }
  },
  {
    name: 'get_achievement_component_overview',
    description: 'Overview of achievement components/steps — step count distribution, component types, most complex achievements, and complexity breakdown.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_mercenary_ability_overview',
    description: 'Overview of all mercenary abilities with descriptions, common themes, and mercenary type listing.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_timer_overview',
    description: 'Analyze spell reuse timer groups for a class — shows shared lockout timers, which spells share cooldowns, and timer group sizes.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g., "Warrior", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_category_breakdown',
    description: 'Breakdown of all spells for a class by spell category — count, beneficial/detrimental split, level ranges, and top categories.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g., "Necromancer", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_shared_spells_overview',
    description: 'Cross-class spell availability analysis — which spells are shared by the most classes, sharing distribution, and per-class exclusive/shared counts.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_duration_overview',
    description: 'Spell duration analysis — duration formula breakdown, duration distribution buckets (instant to permanent), optionally filtered by class.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name to filter by (optional — omit for all spells)' }
      },
      required: []
    }
  },
  {
    name: 'get_resist_type_comparison',
    description: 'Resist type distribution matrix across all 16 classes — shows how many detrimental spells each class has per resist type, with dominant resist type per class.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_requirement_overview',
    description: 'Overview of spell casting requirement associations — shows which spells have prerequisites, most common requirement IDs, requirement complexity per spell, and sample spell-requirement mappings.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_faction_modifier_overview',
    description: 'Overview of all faction modifiers (race, class, deity) — lists all modifier IDs and names, shows which modifiers affect the most factions, starting value distribution, and modifier usage statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_overseer_slot_analysis',
    description: 'Analysis of Overseer quest agent slot patterns — job type demand, required vs optional slot ratios, bonus trait frequency, slots by difficulty level, and most/least agent-demanding quests.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_db_string_type_overview',
    description: 'Meta overview of all string data types in dbstr_us.txt — lists every type ID with entry counts, known names, sample values, and largest types. Shows the data dictionary of available game string data.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_level_distribution',
    description: 'Spell level distribution for a class — spells per level bracket, level-by-level counts (beneficial vs detrimental), peak spell levels, and gaps.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g., "Wizard", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_cast_time_analysis',
    description: 'Spell cast time, recovery time, and recast cooldown analysis — timing distributions, instant vs slow cast percentages, longest cast/recast spells. Optionally filtered by class.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name to filter by (optional — omit for all spells)' }
      },
      required: []
    }
  },
  {
    name: 'get_spell_mana_cost_overview',
    description: 'Mana cost distribution analysis — cost brackets, average mana by level, zero-mana vs mana-costed, endurance-only abilities, most expensive spells. Optionally filtered by class.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name to filter by (optional — omit for all spells)' }
      },
      required: []
    }
  },
  {
    name: 'get_spell_subcategory_overview',
    description: 'Spell category and subcategory tree — hierarchical breakdown showing spell counts, beneficial/detrimental split per category and subcategory. Optionally filtered by class.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name to filter by (optional — omit for all spells)' }
      },
      required: []
    }
  },
  {
    name: 'get_class_unique_spell_analysis',
    description: 'Analyze spells exclusive to a specific class — exclusive vs shared spell counts, exclusive spells by category, level distribution, and sharing distribution showing how many other classes share each spell.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g., "Wizard", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_teleport_spell_overview',
    description: 'Overview of all teleport spells — unique destinations, most-served zones, teleport availability by class, unique/rare destinations, and full destination list.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_combat_ability_overview',
    description: 'Overview of all combat abilities and disciplines — total count, rank distribution, most common name words and prefixes, name statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_item_effect_overview',
    description: 'Overview of item effect descriptions — keyword frequency (healing, damage, stats, haste, focus, proc), description statistics, most common words, and sample effects by category.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_stacking_overview',
    description: 'Overview of spell stacking groups — group size distribution, stacking type breakdown (buff/song/short duration/etc.), class coverage analysis, largest groups, and groups with the most spells.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_ae_analysis',
    description: 'Analysis of AE (area effect) spells — AE type breakdown (PB AE, targeted AE, rain, cone, beam, etc.), radius distribution by size category, largest radius spells, class comparison, and beneficial vs detrimental AE split.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Optional class name to filter (e.g., "Wizard", "Druid"). Omit for all classes.' }
      },
      required: []
    }
  },
  {
    name: 'get_overseer_minion_rarity_analysis',
    description: 'Analysis of Overseer agents by rarity tier — Common through Iconic distribution, traits per rarity, jobs per rarity, job level ranges by rarity, most common traits/jobs at each tier.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_pushback_overview',
    description: 'Overview of spell pushback and launch (pushup) positioning effects — value distributions, highest pushback/pushup spells, spells with both effects, beneficial vs detrimental, and class comparison.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Optional class name to filter (e.g., "Wizard", "Druid"). Omit for all classes.' }
      },
      required: []
    }
  },
  {
    name: 'get_achievement_requirement_analysis',
    description: 'Analysis of achievement component requirement values — value distributions, statistics by component type, highest requirements, most demanding achievements by total requirement sum.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_faction_starting_value_analysis',
    description: 'Analysis of faction starting value modifiers by race, class, and deity — positive vs negative distributions, race/class/deity impact tables with net balance, most modified factions.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_mercenary_tier_analysis',
    description: 'Mercenary tier and proficiency analysis — confidence/proficiency distributions, type-by-tier matrix, confidence-proficiency cross-tab, top races per mercenary type.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_recourse_overview',
    description: 'Spell recourse system overview — recourse spell statistics, multi-step chains, most common recourse targets, category and class distributions.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_tribute_benefit_analysis',
    description: 'Tribute system analysis — personal vs guild tributes, benefit keyword frequency (HP, mana, haste, resist, etc.), name patterns, sample tributes.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_duration_formula_analysis',
    description: 'Deep analysis of spell duration formula × value interactions — value ranges and statistics per formula type, most common values, constant-value anomalies, beneficial vs detrimental patterns.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_map_poi_label_analysis',
    description: 'Analysis of map POI labels — most common words, label prefix categories, color distribution, zones with most/fewest POIs, label coverage statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_aa_name_group_analysis',
    description: 'AA ability name grouping analysis — rank distribution (single vs multi-rank lines), longest AA lines, common name prefixes, keyword themes, name length statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_effect_combination_analysis',
    description: 'Analysis of which spell effects (SPA types) most often appear together — top co-occurring effect pairs, effects per spell distribution, dominant effect by slot position.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_expansion_content_density',
    description: 'Cross-system content density analysis — factions by expansion, achievements by category, zones by level range, and content ratio metrics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_spell_diversity_index',
    description: 'Class spell diversity ranking — distinct SPA effect types per class, class-exclusive effects, universal effects, and effect overlap matrix between top classes.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_game_data_summary_dashboard',
    description: 'One-stop summary dashboard of ALL loaded EverQuest data — entry counts for all 19 data systems (spells, items, AAs, factions, achievements, mercenaries, zones, maps, lore, overseer, tributes, help topics, etc.) with key metrics and highlights.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_faction_network_analysis',
    description: 'Faction network connectivity analysis — which factions share modifiers (races, classes, deities), most connected modifier nodes, faction pairs linked through shared modifiers, and connection density metrics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_progression_analysis',
    description: 'Analyze how a class\'s spell arsenal evolves across level brackets — new SPA effects introduced per bracket, key effect milestones, peak spell levels, and progression timeline.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class short name (WAR, CLR, PAL, RNG, SHD, DRU, MNK, BRD, ROG, SHM, NEC, WIZ, MAG, ENC, BST, BER)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_teleport_network_analysis',
    description: 'Teleport network topology — hub zones with most teleport access, class teleport rankings, level-range coverage, class-exclusive destinations.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_zone_content_density_ranking',
    description: 'Zone content density ranking — zones scored by map POIs, teleport accessibility, and level range. Shows most/least content-rich zones and POI distribution.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_power_milestone_timeline',
    description: 'Unified class power progression timeline — spells, stats (HP/mana/endurance), and skill unlocks across level brackets. Shows when new spell categories appear and stat growth curve.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class short name (WAR, CLR, PAL, RNG, SHD, DRU, MNK, BRD, ROG, SHM, NEC, WIZ, MAG, ENC, BST, BER)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_resist_type_by_level_analysis',
    description: 'Resist type distribution by level bracket — which resists (Magic, Fire, Cold, etc.) dominate at each level range with gearing priority recommendations.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_role_analysis',
    description: 'Class role analysis — each class classified by role (Tank/Healer/DPS/CC/Utility) based on spell effect distribution and base stat profile.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_cost_efficiency_analysis',
    description: 'Spell cost efficiency analysis — mana/endurance costs vs resource pools per level bracket, casts per pool, efficiency trends, most expensive spells.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class short name (WAR, CLR, PAL, RNG, SHD, DRU, MNK, BRD, ROG, SHM, NEC, WIZ, MAG, ENC, BST, BER)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_deity_faction_impact_analysis',
    description: 'Deity faction impact analysis — how each deity choice affects faction standing across all factions, best/worst factions per deity, accessibility ranking.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_target_type_matrix',
    description: 'Spell target type matrix — class specialization patterns based on target type distribution (Self, Single, Group, AE, etc.) with above-average highlights.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_level_content_guide',
    description: 'Content guide for a specific level — matching zones, new spells per class, and nearby level spell activity. One-stop view of what content is available.',
    inputSchema: {
      type: 'object',
      properties: {
        level: {
          type: 'number',
          description: 'Character level (1-125)'
        }
      },
      required: ['level']
    }
  },
  {
    name: 'get_spell_scaling_analysis',
    description: 'Spell scaling analysis — find all versions/ranks of a spell line and show how effects, mana cost, and power scale across levels.',
    inputSchema: {
      type: 'object',
      properties: {
        spell_name: {
          type: 'string',
          description: 'Base spell name (e.g., "Complete Heal", "Ice Comet", "Chloroplast")'
        }
      },
      required: ['spell_name']
    }
  },
  {
    name: 'get_race_deity_optimizer',
    description: 'Race-deity faction optimizer — for each playable race, ranks deities by net faction benefit. Shows best/worst deity per race and overall deity rankings.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_comparison_radar',
    description: 'Class comparison radar — all 16 classes scored 0-100 across 8 dimensions (Heal, Tank, Nuke, CC, Utility, Buff, Pets, Mobility) with top class per dimension and archetype summaries.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_expansion_impact_score',
    description: 'Expansion impact score — each of 33 expansions scored by content volume (factions, achievements, achievement points, event mentions) with category leaders and aggregate totals.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_group_composition_advisor',
    description: 'Group composition advisor — optimal 6-person group compositions (Classic Trinity, Max DPS, Survival, Balanced) with class role scores and synergy notes.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_endgame_profile',
    description: 'Class endgame profile at level 125 — base stats, AC mitigation, all skill caps, spell book summary (categories, level distribution, unique SPAs), role assessment, and resource profile.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name or short code (e.g., "WAR", "Warrior", "CLR", "Cleric")'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_effect_rarity_index',
    description: 'Spell effect rarity index — which spell effects (SPAs) are exclusive, rare, or universal per class. Identifies what makes each class irreplaceable in a group.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_mercenary_class_synergy',
    description: 'Mercenary-class synergy guide — recommended mercenary type for each of 16 classes based on role gaps (heal/tank/DPS weakness analysis).',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_overseer_quest_efficiency_analysis',
    description: 'Overseer quest efficiency analysis — difficulty-to-slot ratios, category efficiency, most efficient quests, least demanding quests, job diversity, and bonus trait statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_tribute_role_analysis',
    description: 'Tribute role analysis — classify 266 tributes by benefitting role (Tank, Healer, Melee DPS, Caster DPS, Utility) with keyword matching and personal/guild breakdown.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_item_effect_spell_correlation',
    description: 'Item effect-spell correlation — cross-reference 1100+ item click/proc effects with 70K+ spells by keyword and name matching, effect category classification.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_creature_type_faction_correlation',
    description: 'Creature type-faction correlation — cross-reference 973 creature types with 1600+ factions to find lore connections, expansion distribution, most connected creatures.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_aa_role_theme_analysis',
    description: 'AA role theme analysis — classify 2700+ AA abilities by role (Tank, Healer, Melee DPS, Spell DPS, CC, Buff, Pet, Utility, Resource, Resist) from description keywords.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_achievement_category_depth_analysis',
    description: 'Achievement category hierarchy analysis — tree depth, subcategory counts, point density per category, most complex achievement trees.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_map_poi_functional_classification',
    description: 'Map POI functional classification — classify 34K+ POIs into categories (Merchant, Zone Line, Quest NPC, Bank, Guard, Temple, Camp, Craft, Transport, Landmark).',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'search_all_local_data',
    description: 'Unified search across ALL local EQ data systems at once — spells, zones, factions, achievements, AAs, combat abilities, tributes, creature types, overseer agents/quests, game events, lore, item effects. Returns matches from every system.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term (e.g., "fire", "cleric", "velious", "dragon")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_game_event_calendar_analysis',
    description: 'Game event calendar analysis — classify 573 events by type (Double XP, Expansion Launch, Seasonal, Content Update, Marketplace, etc.) with expansion mentions and word frequency.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_group_buff_contribution',
    description: 'Class group buff contribution — what unique group/raid buffs each class brings, exclusive buff categories, rare and universal group buffs.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_synergy_matrix',
    description: 'Class synergy matrix — 16×16 class pair synergy scored by exclusive buff category coverage, best/worst partners, and redundancy analysis.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_effect_encyclopedia',
    description: 'Spell effect encyclopedia — deep dive into a specific SPA effect type showing all spells, class distribution, value ranges, slot positions, categories, and examples.',
    inputSchema: {
      type: 'object',
      properties: {
        spa_id: {
          type: 'string',
          description: 'The SPA (Spell Effect) ID number to analyze (e.g., "0" for HP, "11" for Attack Speed, "85" for Stun). Use list_spell_effect_types to find IDs.'
        }
      },
      required: ['spa_id']
    }
  },
  {
    name: 'get_achievement_point_optimizer',
    description: 'Achievement point optimizer — most efficient achievements ranked by points per component, efficiency tiers, complexity analysis, and hidden vs visible comparison.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_overseer_agent_trait_job_matrix',
    description: 'Overseer agent trait-job matrix — cross-reference traits with jobs, trait+job rarity, most versatile agents, and optimal selection strategy.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_debuff_comparison_by_class',
    description: 'Spell debuff comparison — compare all 16 classes\' debuff arsenals (Slow, Root, Stun, Mez, Charm, Snare, DoT, Mana Drain, Fear, Blind, Silence, Dispel) with rankings and diversity.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_content_progression_pathway',
    description: 'Content progression pathway — milestone levels (1-125) showing new spells, zones, and cumulative content at each tier with spell density chart.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_buff_duration_tier_list',
    description: 'Spell buff duration tier list — beneficial spells grouped by duration tier (Instant, Short, Medium, Long, Very Long, Permanent) per class with upkeep profile rankings.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_healing_comparison_matrix',
    description: 'Class healing comparison — compare healing capabilities across all 16 classes (Direct, HoT, Group, Cure, Resurrect) with role classification.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_zone_faction_web_analysis',
    description: 'Zone-faction web analysis — cross-reference zone names with faction names to discover which factions are associated with which zones.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_damage_efficiency',
    description: 'Spell damage efficiency — rank a class\'s damage spells by damage-per-mana (DPM) efficiency, DD vs DoT comparison, level bracket analysis.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (3-letter code like WIZ, NEC, DRU or full name like Wizard)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'search_aa_by_description',
    description: 'Search 2700+ AA abilities by description text (e.g., "haste", "critical hit", "mana regeneration", "pet", "resist").',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Text to search for in AA descriptions'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_expansion_faction_timeline',
    description: 'Expansion faction timeline — faction count growth across expansions, visual distribution, starting value profiles per expansion.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_pet_comparison_matrix',
    description: 'Class pet comparison — compare pet capabilities across all 16 classes (Summon, Charm, Swarm, Pet Buffs) with tier classification.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_resist_bar_chart',
    description: 'Spell resist analysis — detailed breakdown of a specific resist type across classes with level distribution, beneficial/detrimental split, and comparison to other resist types.',
    inputSchema: {
      type: 'object',
      properties: {
        resist_type: {
          type: 'string',
          description: 'Resist type name (Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, Corruption, Unresistable)'
        }
      },
      required: ['resist_type']
    }
  },
  {
    name: 'get_overseer_quest_category_guide',
    description: 'Overseer quest category guide — practical guide for each category with difficulty distribution, top jobs needed, slot requirements, and sample quests.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spell_name_pattern_analysis',
    description: 'Spell name pattern analysis — naming conventions, rank patterns (Rk. II/III), common prefixes (spell lines), name length and word count distribution.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_zone_level_gap_analysis',
    description: 'Zone level gap analysis — find level ranges with no zones (gaps) or sparse coverage (1-3 zones), plus peak levels with most content.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_identity_profile',
    description: 'Class identity profile — comprehensive class identity card showing exclusive spells, top categories, base stats, role identity, and what makes this class unique.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (3-letter code like ENC, BRD or full name like Enchanter)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_school_analysis',
    description: 'Spell school analysis — group spells by resist type × beneficial/detrimental "school", class dominance per school, class specialization matrix.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_aa_spell_correlation',
    description: 'AA-spell category correlation — cross-reference 2700+ AA descriptions with spell effect keywords and category names, multi-effect AAs, and coverage statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_defensive_profile',
    description: 'Class defensive profile — runes, heals, AC buffs, resist buffs, damage shields, crowd control, aggro management with defensive rating summary.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (3-letter code like WAR, PAL or full name like Warrior, Paladin)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_category_cooccurrence',
    description: 'Spell category co-occurrence — which categories appear together in class spell books, universal vs specialized pairs, class-exclusive categories.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_mana_profile',
    description: 'Class mana/endurance profile — resource cost vs pool analysis at various levels, most expensive spells, cost by category, resource milestones.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (3-letter code like WIZ, CLR or full name like Wizard, Cleric)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_overseer_agent_job_coverage_optimizer',
    description: 'Overseer agent job coverage optimizer — rank agents by quest slot coverage, job demand analysis, coverage gaps, most versatile agents.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_class_offensive_profile',
    description: 'Class offensive profile — nukes, DoTs, debuffs, AE damage, procs, crowd control with offensive rating summary.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (3-letter code like WIZ, NEC or full name like Wizard, Necromancer)'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_target_effect_matrix',
    description: 'Spell target type × effect matrix — how spell effects distribute across target types (Self, Single, Group, AE), AE-specific effects analysis.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_achievement_expansion_timeline',
    description: 'Achievement expansion timeline — achievement growth, point density, complexity analysis, and cumulative trends across all expansion categories.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_item_effect_category_breakdown',
    description: 'Item effect category breakdown — classify 1100+ item click/proc effects into functional categories (Offensive, Healing, Defensive, Travel, etc.) with keyword analysis.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_tribute_efficiency_analysis',
    description: 'Tribute efficiency analysis — personal vs guild tribute comparison, benefit type classification (HP, Mana, AC, Haste, Resist, etc.), coverage gaps.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_game_string_category_analysis',
    description: 'Game string category analysis — classify 7000+ game UI strings by topic (Combat, Spells, Items, Trading, Group, Guild, Chat, Navigation, etc.).',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_lore_theme_analysis',
    description: 'Lore theme analysis — analyze 50+ in-game lore stories for recurring themes (War, Magic, Gods, Death, Nature), proper nouns, word frequency, and story statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_augmentation_system_analysis',
    description: 'Augmentation system analysis — all 31 slot types, 81 augmentation groups classified by category (Stat, Combat, Defensive, Spell, Skill, Special).',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_map_poi_zone_detail',
    description: 'Map POI zone detail — get all points of interest for a specific zone, categorized (Merchants, Zone Lines, Camps, Landmarks, etc.) with coordinates.',
    inputSchema: {
      type: 'object',
      properties: {
        zone_name: {
          type: 'string',
          description: 'Zone name to look up (e.g., "Plane of Knowledge", "South Karana", "Crushbone")'
        }
      },
      required: ['zone_name']
    }
  },
  {
    name: 'get_help_topic_content_analysis',
    description: 'Help topic content analysis — analyze 75+ in-game help topics by content length, cross-references between topics, and category distribution.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_level_milestone_guide',
    description: 'Spell level milestone guide — key spell milestones per class showing first heal, nuke, mez, port, pet, rez, buff, debuff, etc. by level.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "Wizard", "Enchanter")'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_cross_system_name_overlap',
    description: 'Cross-system name overlap — find names/words appearing across 3+ game systems (zones, factions, achievements, AAs, lore, overseer agents) revealing lore connections.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_duration_analysis',
    description: 'Spell duration analysis — duration formula distribution, average durations by category, instant vs timed vs permanent, longest spells.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_aa_ability_rank_analysis',
    description: 'AA ability rank analysis — rank progression patterns (I, II, III...), deepest progressions, name word frequency, description theme classification.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_recast_timer_analysis',
    description: 'Spell recast timer analysis — recast distributions, shared timer groups, cooldown patterns by category, longest recasts.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_skill_cap_progression_analysis',
    description: 'Skill cap progression analysis — all skills available to a class with max caps, growth curves, and category breakdown (Combat, Casting, Utility, Tradeskill).',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (e.g., "Warrior", "Wizard", "Bard")'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_base_stat_growth_curve_analysis',
    description: 'Base stat growth curve analysis — HP, Mana, Endurance, and Regen growth by level for a class with milestone tables and cross-class comparison.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: {
          type: 'string',
          description: 'Class name (e.g., "Cleric", "Monk", "Necromancer")'
        }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_overseer_quest_difficulty_analysis',
    description: 'Overseer quest difficulty analysis — difficulty distribution, duration patterns, slot requirements by difficulty, most demanded job types, category breakdown.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'save_data_snapshot',
    description: 'Save a snapshot of current EQ game data state (file sizes, entry counts, names). Use before a game patch to establish a baseline for comparison.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_data_update_summary',
    description: 'Compare current EQ game data against saved snapshot to detect changes after a patch — shows file changes, entry counts, additions, removals, and modifications per system.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_data_update_detail',
    description: 'Detailed diff for a specific data system (spells, zones, factions, achievements, etc.) — shows exactly which entries were added, removed, or renamed.',
    inputSchema: {
      type: 'object',
      properties: {
        system_name: {
          type: 'string',
          description: 'System name (e.g., "spells", "zones", "factions", "achievements", "aaAbilities", "overseerQuests", "mercenaries", "tributes", "combatAbilities")'
        }
      },
      required: ['system_name']
    }
  },
  {
    name: 'get_player_customization_overview',
    description: 'Player customization overview — character creation appearance options (faces, hair, eyes, beards, tattoos, colors) by race and sex.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_race_appearance_options',
    description: 'Race appearance options — detailed character creation customization for a specific race (faces, hair, eyes, beards, tattoos, available classes).',
    inputSchema: {
      type: 'object',
      properties: {
        race_name: {
          type: 'string',
          description: 'Race name (e.g., "Human", "Dark Elf", "Drakkin", "Iksar")'
        }
      },
      required: ['race_name']
    }
  },
  {
    name: 'get_combat_ability_class_analysis',
    description: 'Combat ability / discipline analysis — abilities per class, name patterns, keyword themes (melee, defense, buffs), spell cross-references.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_requirement_class_breakdown',
    description: 'Spell requirement class breakdown — shows which classes have the most spells with requirements, exclusive requirement IDs per class, multi-class requirement density, and level distribution.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_ac_mitigation_progression_analysis',
    description: 'AC mitigation progression analysis for a specific class — shows AC soft cap and multiplier changes across all levels, key breakpoints with biggest jumps, and comparison to all-class average at max level.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_stacking_conflict_analysis',
    description: 'Spell stacking conflict analysis — identifies stacking groups shared by multiple classes (potential buff conflicts), class pair conflict frequency, per-class conflict exposure, and stacking type breakdown.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_mercenary_ability_spell_analysis',
    description: 'Cross-references mercenary abilities with the spell database — shows which abilities match known spells, spell categories, beneficial/detrimental breakdown, and common ability name patterns.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_overseer_trait_synergy_analysis',
    description: 'Overseer trait synergy analysis — identifies which traits co-occur as bonus traits in quest slots, most requested traits, best agents by trait coverage, and trait diversity by difficulty.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_class_spell_level_gap_analysis',
    description: 'Class spell level gap analysis — finds level ranges where a class receives few or no new spells ("dry spells"), spell density by decade, busiest levels, and category distribution.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_drakkin_heritage_class_analysis',
    description: 'Drakkin heritage class analysis — available classes per heritage, heritage availability per class, missing classes, exclusivity analysis, and heritage overlap matrix.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_subcategory_depth_analysis',
    description: 'Spell subcategory depth analysis — subcategory distribution, class-exclusive subcategories, category-subcategory hierarchies, and per-class specialization.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_skill_cap_cross_class_comparison',
    description: 'Skill cap cross-class comparison — compares a specific skill (e.g. "Defense", "Dodge", "Backstab") across all 16 classes with progression, growth analysis, and proficiency tiers.',
    inputSchema: {
      type: 'object',
      properties: {
        skill_name: { type: 'string', description: 'Skill name (e.g. "Defense", "Dodge", "1H Slashing")' }
      },
      required: ['skill_name']
    }
  },
  {
    name: 'get_spell_mana_efficiency_analysis',
    description: 'Spell mana efficiency analysis for a class — mana cost distribution, most/least expensive spells, mana trends by level, cost by category, and cast time vs mana correlation.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_faction_category_analysis',
    description: 'Faction category analysis — faction distribution across expansion categories, value range statistics, starting value modifier analysis, widest and narrowest faction ranges.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_overseer_quest_slot_job_analysis',
    description: 'Overseer quest slot and job requirement analysis — job type demand, required vs optional ratios, slot count distributions, bonus trait counts, and quests with the most slots.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_class_buff_debuff_ratio',
    description: 'Cross-class beneficial vs detrimental spell ratio — compares buff/debuff balance, identifies most offensive and supportive classes, and breaks down by target type.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_recourse_chain_analysis',
    description: 'Spell recourse chain analysis — traces spells that trigger secondary recourse spells, chain depths, class distribution, and most common recourse targets.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_achievement_completion_complexity',
    description: 'Achievement completion complexity analysis — component counts, highest requirements, simplest vs hardest achievements, component type distribution, and requirement value ranges.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_endurance_cost_analysis',
    description: 'Endurance cost analysis for a class — distribution, most expensive abilities, cost trends by level, category breakdown, and dual-resource (mana+endurance) abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Monk")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_book_size_comparison',
    description: 'Cross-class spell book size comparison — total spells, beneficial/detrimental counts, category diversity, peak spell levels, and spell-per-category density.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_zone_level_overlap_analysis',
    description: 'Zone level overlap analysis — zone choices per level, leveling bottlenecks (fewest choices), most overlapping zone pairs, and widest level ranges.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_class_crowd_control_profile',
    description: 'Crowd control spell profile for a class — stun, mesmerize, charm, fear, root, snare, calm/pacify counts, AE vs single target CC, resist types, and level availability.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Bard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_emergency_ability_analysis',
    description: 'Emergency and survival ability analysis for a class — feign death, gate/teleport, invisibility, runes/absorb, cures/dispels, aggro drops, instant-cast abilities, and first-available levels.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Monk", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_utility_spell_comparison',
    description: 'Cross-class utility spell comparison matrix — resurrect, gate, summon, bind, invis, levitate, water breathing, dispel, cure, illusion, FD, pacify, regen, damage shield, haste availability across all 16 classes with diversity ranking.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_class_dot_profile',
    description: 'DoT (damage over time) spell profile for a class — highest total damage, mana efficiency, duration distribution, resist types, target types, level scaling.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Necromancer", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_direct_damage_profile',
    description: 'Direct damage (nuke) spell profile for a class — highest damage, DPS (damage/cast time), mana efficiency, AE nukes, resist types, target types, level scaling.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Magician")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_proc_effect_analysis',
    description: 'Proc effect analysis for a class — spell procs, melee procs, range procs, proc rate modifiers, buff/debuff breakdown, target types, referenced proc effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Ranger", "Rogue")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_debuff_profile',
    description: 'Debuff spell profile for a class — slow, resist debuffs, stat debuffs, AC/ATK debuffs, snare, blind, silence, fragility debuffs with resist types and durations.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_self_buff_profile',
    description: 'Self-only buff analysis for a class — most common effects, category distribution, duration breakdown, highest level and most complex self-buffs.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Monk", "Shadow Knight")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_slow_haste_comparison',
    description: 'Cross-class slow and haste spell comparison — spell counts, max slow/haste percentages, strongest slow/haste spells across all 16 classes.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_class_taunt_aggro_profile',
    description: 'Taunt and aggro management profile for a class — hate generation, aggro reduction, AE taunts, instant-cast aggro abilities, hate values.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Paladin")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_illusion_analysis',
    description: 'Illusion spell analysis for a class — unique forms, self vs other targeting, form IDs, duration distribution, category breakdown.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Bard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_cast_time_distribution',
    description: 'Cast time distribution analysis for a class — instant vs slow casts, averages by spell type and level range, slowest spells, longest recasts.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Wizard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_summon_analysis',
    description: 'Summoning spell analysis for a class — pets, items, players, corpses, familiars with cast times, mana costs, and first-available levels.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Magician", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_regen_profile',
    description: 'HP, mana, and endurance regen spell profile for a class — strongest regens, multi-regen spells, self vs group vs single targeting.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Druid", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_spell_damage_shield_profile',
    description: 'Damage shield analysis for a class — regular and reverse DS, strongest shields, DS value scaling by level, target types.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Druid", "Magician")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_resurrection_comparison',
    description: 'Cross-class resurrection spell comparison — rez spell counts, earliest level, cast times, unique rez spells, fastest resurrections.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_spell_rune_absorb_profile',
    description: 'Rune and absorb spell profile for a class — stoneskin, damage absorb, magic absorb, rune values, self vs group targeting.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_effect_diversity',
    description: 'Spell effect diversity analysis for a class — unique SPAs used, most common and rarest effects, frequency distribution, effect category coverage.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Druid", "Beastlord")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_group_buff_profile',
    description: 'Group buff analysis for a class — most common effects, categories, highest level buffs, most complex buffs, longest duration group buffs.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_heal_breakdown',
    description: 'Detailed heal spell breakdown for a class — direct heals, HoTs, group heals, mana efficiency, strongest heals, category distribution.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_melee_discipline_profile',
    description: 'Melee discipline profile for a class — endurance-based combat abilities, categories, cooldowns, shared timer groups, most common effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Berserker")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_pet_spell_profile',
    description: 'Pet spell profile for a class — summon pets, charm, pet buffs/heals/shields, familiars, first-available levels, pet effect distribution.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Magician", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_cure_spell_profile',
    description: 'Cure and dispel spell profile for a class — dispel magic, dispel detrimental, cure corruption, beneficial cures vs detrimental dispels, group cures, instant cures.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_transport_profile',
    description: 'Transport and travel spell profile for a class — teleport destinations, gate, bind, movement speed, levitate, invis, water breathing, shadowstep.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_resist_debuff_profile',
    description: 'Resist debuff/buff profile for a class — fire/cold/poison/disease/magic/corruption resist modifiers, strongest debuffs and buffs, multi-resist spells.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_mana_recovery_profile',
    description: 'Mana recovery profile for a class — regen buffs, mana drain/tap, mana transfer, max mana buffs, mana absorb.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_focus_profile',
    description: 'Spell focus profile for a class — twincast, spell crit chance/damage, spell haste, nuke/DoT damage, heal amount modifiers.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_ae_spell_profile',
    description: 'AE spell profile for a class — PB AE, Targeted AE, Directional, Beam, Ring AE; radius distribution, resist types, beneficial vs detrimental.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Magician")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_instant_cast_profile',
    description: 'Instant-cast spell profile for a class — zero cast time spells, categories, effects, endurance vs mana, emergency tools.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Warrior")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_buff_duration_analysis',
    description: 'Buff duration tier analysis for a class — instant/short/medium/long/permanent tiers, average by category, longest buffs, target type duration profile.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Bard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_melee_combat_profile',
    description: 'Melee combat enhancement profile — crit, double/triple attack, flurry, riposte, parry, dodge, backstab, headshot, strikethrough.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Rogue")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_stat_buff_profile',
    description: 'Stat buff/debuff profile for a class — STR, DEX, AGI, STA, INT, WIS, CHA modifiers, strongest buffs/debuffs, multi-stat spells.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_lifetap_profile',
    description: 'Lifetap and HP profile for a class — lifetap spells, HP drain, max HP buffs, HP change effects, HP percent reduction.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Necromancer", "Shadow Knight")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_aggro_management_profile',
    description: 'Aggro management profile for a class — hate generation, aggro reduction, taunt, AE taunt, spell hate, improved taunt abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Shadow Knight")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_endurance_profile',
    description: 'Endurance profile for a class — endurance regen, max endurance buffs, endurance drain, endurance burn, endurance absorb effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Berserker", "Monk")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_skill_modifier_profile',
    description: 'Skill modifier profile for a class — skill damage, archery damage, offhand damage, skill attack, accuracy, timer reduction effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Rogue", "Ranger")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_song_modifier_profile',
    description: 'Song modifier profile for a class — song DoT, singing mods, instrument mods, song range, song AOE, bard AE DoT effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Bard", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_ac_attack_profile',
    description: 'AC and Attack rating profile for a class — armor class buffs/debuffs, attack rating, AC soft cap, melee damage amount, base damage, worn attack.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_haste_slow_profile',
    description: 'Haste and slow profile for a class — melee haste buffs, slow debuffs, pet haste effects with percentages and durations.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_resist_type_profile',
    description: 'Spell resist type distribution for a class — how spells break down across Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, Corruption resist types.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_death_save_profile',
    description: 'Death save and escape profile for a class — feign death, fade, death save, max negative HP, shroud of stealth, fake death abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Monk", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_line_progression',
    description: 'Spell line progression for a class — tracks spell families showing how they progress across levels with ranks, mana scaling, and level brackets.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_resist_buff_profile',
    description: 'Resist buff/debuff profile for a class — analyzes spells that modify Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, and Corruption resistances, categorized by resist type with buff vs debuff breakdown.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_hp_regen_profile',
    description: 'HP regeneration profile for a class — analyzes spells that provide HP regeneration, enhanced regen, out-of-combat regen, and regen caps, categorized by regen type with level progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_range_profile',
    description: 'Spell range profile for a class — analyzes spell range distributions, range extension effects, and AE range patterns showing how far class abilities can reach.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Ranger")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_acquisition_curve',
    description: 'Spell acquisition curve for a class — shows how many new spells are gained at each level bracket, peak acquisition levels, drought gaps, and cumulative progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Bard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_movement_profile',
    description: 'Movement and mobility profile for a class — analyzes movement speed, levitation, water breathing, snare, teleport, transport, and shrink spells with speed percentages and level progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Druid", "Wizard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_damage_shield_profile',
    description: 'Damage shield profile for a class — analyzes regular damage shields, reverse DS, spell DS, and DS blocking effects with damage values and level progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Druid", "Magician")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_stun_mez_profile',
    description: 'Stun and mesmerize profile for a class — analyzes stun, mesmerize, calm, stun resist, AE stun resist, and shield bash stun effects with level progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_focus_limit_profile',
    description: 'Spell focus and limit profile for a class — analyzes focus effects (spell haste, crit, damage mods, twincast) with their limiting conditions (spell type, level range, mana cost).',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_charm_fear_profile',
    description: 'Charm and fear profile for a class — analyzes charm, fear, charm immunity, and group fear immunity effects with durations and level progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_crit_profile',
    description: 'Critical hit profile for a class — analyzes spell crit chance/damage, melee crit chance, triple attack, pet crit, frenzied devastation, and crit HoT effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Berserker", "Wizard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_avoidance_profile',
    description: 'Avoidance and accuracy profile for a class — analyzes parry, dodge, riposte, block, strikethrough, accuracy, combat stability, and double melee effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Monk")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_special_attack_profile',
    description: 'Special attack profile for a class — analyzes rampage, headshot, slay undead, backstab variants, assassinate, finishing blow, and AE melee effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Rogue", "Ranger")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_visibility_profile',
    description: 'Visibility and detection profile for a class — analyzes invisibility, see invisible, ultravision, infravision, detect undead/summoned/animals, true north, divination, bind sight.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Rogue", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_silence_amnesia_profile',
    description: 'Silence and amnesia profile for a class — analyzes silence, amnesia, screech, and spell school restriction effects for disrupting enemy casters.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Bard", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_proc_profile',
    description: 'Proc effect profile for a class — analyzes spell procs, melee procs, range procs, proc rate modifiers, and sympathetic procs with values and level progression.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Ranger", "Paladin")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_max_hp_mana_profile',
    description: 'Max HP and mana modifier profile for a class — analyzes max HP, max mana, max endurance modifiers including flat increases, percentage mods, and caps.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_beneficial_ratio',
    description: 'Beneficial vs detrimental spell ratio for a class — shows the proportion of buffs/heals to nukes/debuffs across level brackets with target type breakdown.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_pet_enhancement_profile',
    description: 'Pet enhancement profile for a class — analyzes pet haste, pet crit, pet max HP, pet avoidance, pet flurry, pet power, mend companion, and focus pet effects.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Magician", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_timer_group_profile',
    description: 'Timer group profile for a class — analyzes spell timer groups (recast timers), showing which spells share lockout timers, timer distribution, and most contested timer groups.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_mana_efficiency_by_level',
    description: 'Mana efficiency profile for a class — analyzes mana cost distribution by level bracket, average mana cost trends, most expensive spells, zero-mana spells, and mana cost percentiles.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Enchanter")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_category_profile',
    description: 'Spell category profile for a class — analyzes spell distribution across official game categories and subcategories, showing category breadth, dominant themes, and category-level breakdowns.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Druid", "Beastlord")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_cast_time_distribution',
    description: 'Cast time distribution for a class — analyzes cast speed brackets (instant, <0.5s, 0.5-1s, 1-2s, etc.), average cast time by level bracket, and slowest-casting spells.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_recast_time_profile',
    description: 'Recast time profile for a class — analyzes cooldown distribution by bracket (none, <6s, 6-12s, 30s-1m, 1-5m, etc.) and identifies longest-cooldown abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Paladin", "Ranger")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_target_type_profile',
    description: 'Target type profile for a class — analyzes spell distribution across target types (single, self, AE, group, beam, etc.) with beneficial/detrimental breakdowns and examples.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_recourse_profile',
    description: 'Recourse spell profile for a class — analyzes spells that trigger secondary recourse effects, showing most common recourse targets and recourse chains.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Cleric")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_pushback_profile',
    description: 'Pushback profile for a class — analyzes spells with pushback and knockup effects, displacement forces, and strongest knockback abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Magician")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_recovery_profile',
    description: 'Spell recovery profile for a class — analyzes spell recovery times (global cooldown between casts), recovery time brackets, and slowest-recovery spells.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Necromancer", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_overlap',
    description: 'Compare spell overlap between two classes — shows shared spells, unique spells, overlap percentage, and which class gets shared spells at earlier levels.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name_1: { type: 'string', description: 'First class name (e.g. "Druid")' },
        class_name_2: { type: 'string', description: 'Second class name (e.g. "Shaman")' }
      },
      required: ['class_name_1', 'class_name_2']
    }
  },
  {
    name: 'get_class_ae_range_profile',
    description: 'AE range profile for a class — analyzes area-of-effect range distribution, range brackets, AE range by target type, and largest-radius abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Magician")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_density_map',
    description: 'Spell density heat map for a class — shows spell count per level in 5-level buckets, peak levels, densest levels, and level gaps with no spells.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Bard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_upgrade_chains',
    description: 'Spell upgrade chain analysis — identifies spell rank progressions (Rk. II/III, numbered suffixes), longest chains, chain length distribution, and level spans.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Wizard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_level_cap_progression',
    description: 'Level cap progression for a class — shows spell count growth at each historical EQ level cap (50, 60, 65, 70, ..., 125), expansion eras, and biggest growth jumps.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Ranger", "Beastlord")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_multi_effect_profile',
    description: 'Multi-effect profile for a class — analyzes spell complexity by counting distinct SPA effects per spell, most complex spells, and average complexity by level.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Shaman", "Paladin")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_signature_spells',
    description: 'Signature spells exclusive to a class — spells that no other class has access to, by level bracket, classic and modern eras.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Necromancer", "Bard")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spa_breadth',
    description: 'SPA breadth analysis for a class — counts unique spell effect types (SPAs), most common and rarest effects, with example spells.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_scaling_analysis',
    description: 'Spell scaling analysis for a class — shows how key effect values (HP, mana, AC) scale across level brackets with max/avg values.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Magician")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_damage_per_mana',
    description: 'Damage per mana analysis — ranks damage spells by mana efficiency (DPM), showing best DPM by level bracket and most efficient nukes.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Wizard", "Necromancer")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_endurance_vs_mana_profile',
    description: 'Endurance vs mana resource profile — split between mana-cost, endurance-cost, both, and free abilities with level bracket breakdown.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Warrior", "Berserker")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_spell_name_patterns',
    description: 'Spell naming pattern analysis — most common words, prefixes, and naming themes in spell names for a class.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Paladin", "Shadow Knight")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_heal_per_mana',
    description: 'Heal per mana analysis — ranks healing spells by mana efficiency (HPM), showing best HPM by level bracket and most efficient heals.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Cleric", "Druid")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_illusion_profile',
    description: 'Illusion profile for a class — analyzes illusion/form-change/polymorph spells and disguise abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Enchanter", "Shaman")' }
      },
      required: ['class_name']
    }
  },
  {
    name: 'get_class_summon_profile',
    description: 'Summon profile for a class — analyzes item summoning, pet summoning, corpse summoning, familiar summoning, and transport abilities.',
    inputSchema: {
      type: 'object',
      properties: {
        class_name: { type: 'string', description: 'Class name (e.g. "Magician", "Necromancer")' }
      },
      required: ['class_name']
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

      case 'get_starting_city_lore': {
        return getStartingCityLore();
      }

      case 'get_creature_type_overview': {
        return getCreatureTypeOverview();
      }

      case 'get_overseer_job_overview': {
        return getOverseerJobOverview();
      }

      case 'get_spell_resist_overview': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellResistOverview(className || undefined);
      }

      case 'get_spell_target_overview': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellTargetOverview(className || undefined);
      }

      case 'get_achievement_component_overview': {
        return getAchievementComponentOverview();
      }

      case 'get_mercenary_ability_overview': {
        return getMercenaryAbilityOverview();
      }

      case 'get_spell_timer_overview': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required';
        return getSpellTimerOverview(className);
      }

      case 'get_spell_category_breakdown': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required';
        return getSpellCategoryBreakdown(className);
      }

      case 'get_shared_spells_overview': {
        return getSharedSpellsOverview();
      }

      case 'get_spell_duration_overview': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellDurationOverview(className || undefined);
      }

      case 'get_resist_type_comparison': {
        return getResistTypeComparison();
      }

      case 'get_spell_requirement_overview': {
        return getSpellRequirementOverview();
      }

      case 'get_faction_modifier_overview': {
        return getFactionModifierOverview();
      }

      case 'get_overseer_slot_analysis': {
        return getOverseerSlotAnalysis();
      }

      case 'get_db_string_type_overview': {
        return getDbStringTypeOverview();
      }

      case 'get_spell_level_distribution': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required';
        return getSpellLevelDistribution(className);
      }

      case 'get_spell_cast_time_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellCastTimeAnalysis(className || undefined);
      }

      case 'get_spell_mana_cost_overview': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellManaCostOverview(className || undefined);
      }

      case 'get_spell_subcategory_overview': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellSubcategoryOverview(className || undefined);
      }

      case 'get_class_unique_spell_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required';
        return getClassUniqueSpellAnalysis(className);
      }

      case 'get_teleport_spell_overview': {
        return getTeleportSpellOverview();
      }

      case 'get_combat_ability_overview': {
        return getCombatAbilityOverview();
      }

      case 'get_item_effect_overview': {
        return getItemEffectOverview();
      }

      case 'get_spell_stacking_overview': {
        return getSpellStackingOverview();
      }

      case 'get_spell_ae_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellAEAnalysis(className || undefined);
      }

      case 'get_overseer_minion_rarity_analysis': {
        return getOverseerMinionRarityAnalysis();
      }

      case 'get_spell_pushback_overview': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : undefined;
        return getSpellPushbackOverview(className || undefined);
      }

      case 'get_achievement_requirement_analysis': {
        return getAchievementRequirementAnalysis();
      }

      case 'get_faction_starting_value_analysis': {
        return getFactionStartingValueAnalysis();
      }

      case 'get_mercenary_tier_analysis': {
        return getMercenaryTierAnalysis();
      }

      case 'get_spell_recourse_overview': {
        return getSpellRecourseOverview();
      }

      case 'get_tribute_benefit_analysis': {
        return getTributeBenefitAnalysis();
      }

      case 'get_spell_duration_formula_analysis': {
        return getSpellDurationFormulaAnalysis();
      }

      case 'get_map_poi_label_analysis': {
        return getMapPOILabelAnalysis();
      }

      case 'get_aa_name_group_analysis': {
        return getAANameGroupAnalysis();
      }

      case 'get_spell_effect_combination_analysis': {
        return getSpellEffectCombinationAnalysis();
      }

      case 'get_expansion_content_density': {
        return getExpansionContentDensity();
      }

      case 'get_class_spell_diversity_index': {
        return getClassSpellDiversityIndex();
      }

      case 'get_game_data_summary_dashboard': {
        return getGameDataSummaryDashboard();
      }

      case 'get_faction_network_analysis': {
        return getFactionNetworkAnalysis();
      }

      case 'get_spell_progression_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required (e.g., WAR, CLR, PAL, RNG, SHD, DRU, MNK, BRD, ROG, SHM, NEC, WIZ, MAG, ENC, BST, BER)';
        return getSpellProgressionAnalysis(className);
      }

      case 'get_teleport_network_analysis': {
        return getTeleportNetworkAnalysis();
      }

      case 'get_zone_content_density_ranking': {
        return getZoneContentDensityRanking();
      }

      case 'get_class_power_milestone_timeline': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required (e.g., WAR, CLR, PAL, RNG, SHD, DRU, MNK, BRD, ROG, SHM, NEC, WIZ, MAG, ENC, BST, BER)';
        return getClassPowerMilestoneTimeline(className);
      }

      case 'get_resist_type_by_level_analysis': {
        return getResistTypeByLevelAnalysis();
      }

      case 'get_class_role_analysis': {
        return getClassRoleAnalysis();
      }

      case 'get_spell_cost_efficiency_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required (e.g., WAR, CLR, PAL, RNG, SHD, DRU, MNK, BRD, ROG, SHM, NEC, WIZ, MAG, ENC, BST, BER)';
        return getSpellCostEfficiencyAnalysis(className);
      }

      case 'get_deity_faction_impact_analysis': {
        return getDeityFactionImpactAnalysis();
      }

      case 'get_spell_target_type_matrix': {
        return getSpellTargetTypeMatrix();
      }

      case 'get_level_content_guide': {
        const level = typeof args.level === 'number' ? args.level : parseInt(String(args.level));
        if (isNaN(level)) return 'Error: "level" parameter is required (1-125)';
        return getLevelContentGuide(level);
      }

      case 'get_spell_scaling_analysis': {
        const spellName = typeof args.spell_name === 'string' ? args.spell_name.trim() : '';
        if (!spellName) return 'Error: "spell_name" parameter is required (e.g., "Complete Heal", "Ice Comet")';
        return getSpellScalingAnalysis(spellName);
      }

      case 'get_race_deity_optimizer': {
        return getRaceDeityOptimizer();
      }

      case 'get_class_comparison_radar': {
        return getClassComparisonRadar();
      }

      case 'get_expansion_impact_score': {
        return getExpansionImpactScore();
      }

      case 'get_group_composition_advisor': {
        return getGroupCompositionAdvisor();
      }

      case 'get_class_endgame_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required. Use short codes (WAR, CLR, PAL, RNG, SHD, DRU, MNK, BRD, ROG, SHM, NEC, WIZ, MAG, ENC, BST, BER) or full names.';
        return getClassEndgameProfile(className);
      }

      case 'get_spell_effect_rarity_index': {
        return getSpellEffectRarityIndex();
      }

      case 'get_mercenary_class_synergy': {
        return getMercenaryClassSynergy();
      }

      case 'get_overseer_quest_efficiency_analysis': {
        return getOverseerQuestEfficiencyAnalysis();
      }

      case 'get_tribute_role_analysis': {
        return getTributeRoleAnalysis();
      }

      case 'get_item_effect_spell_correlation': {
        return getItemEffectSpellCorrelation();
      }

      case 'get_creature_type_faction_correlation': {
        return getCreatureTypeFactionCorrelation();
      }

      case 'get_aa_role_theme_analysis': {
        return getAARoleThemeAnalysis();
      }

      case 'get_achievement_category_depth_analysis': {
        return getAchievementCategoryDepthAnalysis();
      }

      case 'get_map_poi_functional_classification': {
        return getMapPOIFunctionalClassification();
      }

      case 'search_all_local_data': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query) return 'Error: "query" parameter is required.';
        return searchAllLocalData(query);
      }

      case 'get_game_event_calendar_analysis': {
        return getGameEventCalendarAnalysis();
      }

      case 'get_class_group_buff_contribution': {
        return getClassGroupBuffContribution();
      }

      case 'get_class_synergy_matrix': {
        return getClassSynergyMatrix();
      }

      case 'get_spell_effect_encyclopedia': {
        const spaId = typeof args.spa_id === 'string' ? args.spa_id.trim() : '';
        if (!spaId) return 'Error: "spa_id" parameter is required. Use list_spell_effect_types to find SPA IDs.';
        return getSpellEffectEncyclopedia(spaId);
      }

      case 'get_achievement_point_optimizer': {
        return getAchievementPointOptimizer();
      }

      case 'get_overseer_agent_trait_job_matrix': {
        return getOverseerAgentTraitJobMatrix();
      }

      case 'get_spell_debuff_comparison_by_class': {
        return getSpellDebuffComparisonByClass();
      }

      case 'get_content_progression_pathway': {
        return getContentProgressionPathway();
      }

      case 'get_spell_buff_duration_tier_list': {
        return getSpellBuffDurationTierList();
      }

      case 'get_class_healing_comparison_matrix': {
        return getClassHealingComparisonMatrix();
      }

      case 'get_zone_faction_web_analysis': {
        return getZoneFactionWebAnalysis();
      }

      case 'get_spell_damage_efficiency': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellDamageEfficiency(className);
      }

      case 'search_aa_by_description': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        if (!query) return 'Error: "query" parameter is required.';
        return searchAAByDescription(query);
      }

      case 'get_expansion_faction_timeline': {
        return getExpansionFactionTimeline();
      }

      case 'get_class_pet_comparison_matrix': {
        return getClassPetComparisonMatrix();
      }

      case 'get_spell_resist_bar_chart': {
        const resistType = typeof args.resist_type === 'string' ? args.resist_type.trim() : '';
        if (!resistType) return 'Error: "resist_type" parameter is required. Valid: Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, Corruption, Unresistable';
        return getSpellResistBarChart(resistType);
      }

      case 'get_overseer_quest_category_guide': {
        return getOverseerQuestCategoryGuide();
      }

      case 'get_spell_name_pattern_analysis': {
        return getSpellNamePatternAnalysis();
      }

      case 'get_zone_level_gap_analysis': {
        return getZoneLevelGapAnalysis();
      }

      case 'get_class_identity_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassIdentityProfile(className);
      }

      case 'get_spell_school_analysis': {
        return getSpellSchoolAnalysis();
      }

      case 'get_aa_spell_correlation': {
        return getAASpellCorrelation();
      }

      case 'get_class_defensive_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassDefensiveProfile(className);
      }

      case 'get_spell_category_cooccurrence': {
        return getSpellCategoryCooccurrence();
      }

      case 'get_class_mana_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassManaProfile(className);
      }

      case 'get_overseer_agent_job_coverage_optimizer': {
        return getOverseerAgentJobCoverageOptimizer();
      }

      case 'get_class_offensive_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassOffensiveProfile(className);
      }

      case 'get_spell_target_effect_matrix': {
        return getSpellTargetEffectMatrix();
      }

      case 'get_achievement_expansion_timeline': {
        return getAchievementExpansionTimeline();
      }

      case 'get_item_effect_category_breakdown': {
        return getItemEffectCategoryBreakdown();
      }

      case 'get_tribute_efficiency_analysis': {
        return getTributeEfficiencyAnalysis();
      }

      case 'get_game_string_category_analysis': {
        return getGameStringCategoryAnalysis();
      }

      case 'get_lore_theme_analysis': {
        return getLoreThemeAnalysis();
      }

      case 'get_augmentation_system_analysis': {
        return getAugmentationSystemAnalysis();
      }

      case 'get_map_poi_zone_detail': {
        const zoneName = typeof args.zone_name === 'string' ? args.zone_name.trim() : '';
        if (!zoneName) return 'Error: "zone_name" parameter is required.';
        return getMapPOIZoneDetail(zoneName);
      }

      case 'get_help_topic_content_analysis': {
        return getHelpTopicContentAnalysis();
      }

      case 'get_spell_level_milestone_guide': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellLevelMilestoneGuide(className);
      }

      case 'get_cross_system_name_overlap': {
        return getCrossSystemNameOverlap();
      }

      case 'get_spell_duration_analysis': {
        return getSpellDurationAnalysis();
      }

      case 'get_aa_ability_rank_analysis': {
        return getAAAbilityRankAnalysis();
      }

      case 'get_spell_recast_timer_analysis': {
        return getSpellRecastTimerAnalysis();
      }

      case 'get_skill_cap_progression_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSkillCapProgressionAnalysis(className);
      }

      case 'get_base_stat_growth_curve_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getBaseStatGrowthCurveAnalysis(className);
      }

      case 'get_overseer_quest_difficulty_analysis': {
        return getOverseerQuestDifficultyAnalysis();
      }

      case 'save_data_snapshot': {
        return saveDataSnapshot();
      }

      case 'get_data_update_summary': {
        return getDataUpdateSummary();
      }

      case 'get_data_update_detail': {
        const systemName = typeof args.system_name === 'string' ? args.system_name.trim() : '';
        if (!systemName) return 'Error: "system_name" parameter is required.';
        return getDataUpdateDetail(systemName);
      }

      case 'get_player_customization_overview': {
        return getPlayerCustomizationOverview();
      }

      case 'get_race_appearance_options': {
        const raceName = typeof args.race_name === 'string' ? args.race_name.trim() : '';
        if (!raceName) return 'Error: "race_name" parameter is required.';
        return getRaceAppearanceOptions(raceName);
      }

      case 'get_combat_ability_class_analysis': {
        return getCombatAbilityClassAnalysis();
      }

      case 'get_spell_requirement_class_breakdown': {
        return getSpellRequirementClassBreakdown();
      }

      case 'get_ac_mitigation_progression_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getACMitigationProgressionAnalysis(className);
      }

      case 'get_spell_stacking_conflict_analysis': {
        return getSpellStackingConflictAnalysis();
      }

      case 'get_mercenary_ability_spell_analysis': {
        return getMercenaryAbilitySpellAnalysis();
      }

      case 'get_overseer_trait_synergy_analysis': {
        return getOverseerTraitSynergyAnalysis();
      }

      case 'get_class_spell_level_gap_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellLevelGapAnalysis(className);
      }

      case 'get_drakkin_heritage_class_analysis': {
        return getDrakkinHeritageClassAnalysis();
      }

      case 'get_spell_subcategory_depth_analysis': {
        return getSpellSubcategoryDepthAnalysis();
      }

      case 'get_skill_cap_cross_class_comparison': {
        const skillName = typeof args.skill_name === 'string' ? args.skill_name.trim() : '';
        if (!skillName) return 'Error: "skill_name" parameter is required.';
        return getSkillCapCrossClassComparison(skillName);
      }

      case 'get_spell_mana_efficiency_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellManaEfficiencyAnalysis(className);
      }

      case 'get_faction_category_analysis': {
        return getFactionCategoryAnalysis();
      }

      case 'get_overseer_quest_slot_job_analysis': {
        return getOverseerQuestSlotJobAnalysis();
      }

      case 'get_class_buff_debuff_ratio': {
        return getClassBuffDebuffRatio();
      }

      case 'get_spell_recourse_chain_analysis': {
        return getSpellRecourseChainAnalysis();
      }

      case 'get_achievement_completion_complexity': {
        return getAchievementCompletionComplexity();
      }

      case 'get_spell_endurance_cost_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellEnduranceCostAnalysis(className);
      }

      case 'get_class_spell_book_size_comparison': {
        return getClassSpellBookSizeComparison();
      }

      case 'get_zone_level_overlap_analysis': {
        return getZoneLevelOverlapAnalysis();
      }

      case 'get_class_crowd_control_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassCrowdControlProfile(className);
      }

      case 'get_class_emergency_ability_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassEmergencyAbilityAnalysis(className);
      }

      case 'get_class_utility_spell_comparison': {
        return getClassUtilitySpellComparison();
      }

      case 'get_class_dot_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassDoTProfile(className);
      }

      case 'get_class_direct_damage_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassDirectDamageProfile(className);
      }

      case 'get_spell_proc_effect_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellProcEffectAnalysis(className);
      }

      case 'get_class_debuff_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassDebuffProfile(className);
      }

      case 'get_class_self_buff_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSelfBuffProfile(className);
      }

      case 'get_spell_slow_haste_comparison': {
        return getSpellSlowHasteComparison();
      }

      case 'get_class_taunt_aggro_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassTauntAggroProfile(className);
      }

      case 'get_spell_illusion_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellIllusionAnalysis(className);
      }

      case 'get_spell_cast_time_distribution': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellCastTimeDistribution(className);
      }

      case 'get_spell_summon_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellSummonAnalysis(className);
      }

      case 'get_class_regen_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassRegenProfile(className);
      }

      case 'get_spell_damage_shield_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellDamageShieldProfile(className);
      }

      case 'get_class_resurrection_comparison': {
        return getClassResurrectionComparison();
      }

      case 'get_spell_rune_absorb_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getSpellRuneAbsorbProfile(className);
      }

      case 'get_class_spell_effect_diversity': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellEffectDiversity(className);
      }

      case 'get_class_group_buff_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassGroupBuffProfile(className);
      }

      case 'get_class_heal_breakdown': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassHealBreakdown(className);
      }

      case 'get_class_melee_discipline_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassMeleeDisciplineProfile(className);
      }

      case 'get_class_pet_spell_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassPetSpellProfile(className);
      }

      case 'get_class_cure_spell_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassCureSpellProfile(className);
      }

      case 'get_class_transport_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassTransportProfile(className);
      }

      case 'get_class_resist_debuff_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassResistDebuffProfile(className);
      }

      case 'get_class_mana_recovery_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassManaRecoveryProfile(className);
      }

      case 'get_class_spell_focus_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellFocusProfile(className);
      }

      case 'get_class_ae_spell_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassAESpellProfile(className);
      }

      case 'get_class_instant_cast_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassInstantCastProfile(className);
      }

      case 'get_class_buff_duration_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassBuffDurationAnalysis(className);
      }

      case 'get_class_melee_combat_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassMeleeCombatProfile(className);
      }

      case 'get_class_stat_buff_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassStatBuffProfile(className);
      }

      case 'get_class_lifetap_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassLifetapProfile(className);
      }

      case 'get_class_aggro_management_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassAggroManagementProfile(className);
      }

      case 'get_class_endurance_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassEnduranceProfile(className);
      }

      case 'get_class_skill_modifier_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSkillModifierProfile(className);
      }

      case 'get_class_song_modifier_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSongModifierProfile(className);
      }

      case 'get_class_ac_attack_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassACAttackProfile(className);
      }

      case 'get_class_haste_slow_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassHasteSlowProfile(className);
      }

      case 'get_class_spell_resist_type_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellResistTypeProfile(className);
      }

      case 'get_class_death_save_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassDeathSaveProfile(className);
      }

      case 'get_class_spell_line_progression': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellLineProgression(className);
      }

      case 'get_class_resist_buff_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassResistBuffProfile(className);
      }

      case 'get_class_hp_regen_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassHPRegenProfile(className);
      }

      case 'get_class_spell_range_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellRangeProfile(className);
      }

      case 'get_class_spell_acquisition_curve': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellAcquisitionCurve(className);
      }

      case 'get_class_movement_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassMovementProfile(className);
      }

      case 'get_class_damage_shield_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassDamageShieldProfile(className);
      }

      case 'get_class_stun_mez_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassStunMezProfile(className);
      }

      case 'get_class_spell_focus_limit_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellFocusLimitProfile(className);
      }

      case 'get_class_charm_fear_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassCharmFearProfile(className);
      }

      case 'get_class_crit_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassCritProfile(className);
      }

      case 'get_class_avoidance_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassAvoidanceProfile(className);
      }

      case 'get_class_special_attack_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpecialAttackProfile(className);
      }

      case 'get_class_visibility_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassVisibilityProfile(className);
      }

      case 'get_class_silence_amnesia_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSilenceAmnesiaProfile(className);
      }

      case 'get_class_proc_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassProcProfile(className);
      }

      case 'get_class_max_hp_mana_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassMaxHPManaProfile(className);
      }

      case 'get_class_spell_beneficial_ratio': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellBeneficialRatio(className);
      }

      case 'get_class_pet_enhancement_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassPetEnhancementProfile(className);
      }

      case 'get_class_timer_group_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassTimerGroupProfile(className);
      }

      case 'get_class_mana_efficiency_by_level': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassManaEfficiencyByLevel(className);
      }

      case 'get_class_spell_category_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellCategoryProfile(className);
      }

      case 'get_class_cast_time_distribution': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassCastTimeDistribution(className);
      }

      case 'get_class_recast_time_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassRecastTimeProfile(className);
      }

      case 'get_class_target_type_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassTargetTypeProfile(className);
      }

      case 'get_class_recourse_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassRecourseProfile(className);
      }

      case 'get_class_pushback_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassPushbackProfile(className);
      }

      case 'get_class_spell_recovery_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellRecoveryProfile(className);
      }

      case 'get_class_spell_overlap': {
        const cn1 = typeof args.class_name_1 === 'string' ? args.class_name_1.trim() : '';
        const cn2 = typeof args.class_name_2 === 'string' ? args.class_name_2.trim() : '';
        if (!cn1 || !cn2) return 'Error: both "class_name_1" and "class_name_2" parameters are required.';
        return getClassSpellOverlap(cn1, cn2);
      }

      case 'get_class_ae_range_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassAERangeProfile(className);
      }

      case 'get_class_spell_density_map': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellDensityMap(className);
      }

      case 'get_class_spell_upgrade_chains': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellUpgradeChains(className);
      }

      case 'get_class_level_cap_progression': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassLevelCapProgression(className);
      }

      case 'get_class_multi_effect_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassMultiEffectProfile(className);
      }

      case 'get_class_signature_spells': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSignatureSpells(className);
      }

      case 'get_class_spa_breadth': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSPABreadth(className);
      }

      case 'get_class_spell_scaling_analysis': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellScalingAnalysis(className);
      }

      case 'get_class_damage_per_mana': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassDamagePerMana(className);
      }

      case 'get_class_endurance_vs_mana_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassEnduranceVsManaProfile(className);
      }

      case 'get_class_spell_name_patterns': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSpellNamePatterns(className);
      }

      case 'get_class_heal_per_mana': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassHealPerMana(className);
      }

      case 'get_class_illusion_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassIllusionProfile(className);
      }

      case 'get_class_summon_profile': {
        const className = typeof args.class_name === 'string' ? args.class_name.trim() : '';
        if (!className) return 'Error: "class_name" parameter is required.';
        return getClassSummonProfile(className);
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
