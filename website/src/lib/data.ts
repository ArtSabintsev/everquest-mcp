// Data layer - imports from parent project's compiled output
// Types are defined locally to avoid cross-project resolution issues.
// Runtime imports use webpack aliases configured in next.config.mjs.

export interface SearchResult {
  name: string;
  type: 'spell' | 'item' | 'npc' | 'zone' | 'quest' | 'guide' | 'tradeskill' | 'event' | 'unknown';
  id: string;
  url: string;
  source: string;
  description?: string;
}

export interface Coordinates {
  x: number;
  y: number;
  z?: number;
}

export interface ZoneLocation {
  name: string;
  coordinates?: Coordinates;
  description?: string;
  destination?: string;
}

export interface SpellData {
  name: string;
  id: string;
  source: string;
  description?: string;
  mana?: number;
  castTime?: string;
  recastTime?: string;
  recoveryTime?: string;
  duration?: string;
  range?: string;
  aeRange?: string;
  target?: string;
  resist?: string;
  skill?: string;
  beneficial?: boolean;
  pushBack?: number;
  pushUp?: number;
  classes?: Record<string, number>;
  effects?: string[];
  expansion?: string;
  category?: string;
  subcategory?: string;
  recourseId?: number;
  recourseName?: string;
  teleportZone?: string;
  endurance?: number;
  timerId?: number;
  raw?: string;
}

export interface ItemData {
  name: string;
  id: string;
  source: string;
  slot?: string;
  ac?: number;
  damage?: number;
  delay?: number;
  ratio?: number;
  stats?: Record<string, number>;
  heroicStats?: Record<string, number>;
  effects?: string[];
  classes?: string[];
  races?: string[];
  weight?: number;
  dropsFrom?: string[];
  expansion?: string;
  required?: number;
  recommended?: number;
  raw?: string;
}

export interface NpcData {
  name: string;
  id: string;
  source: string;
  level?: string;
  zone?: string;
  race?: string;
  class?: string;
  faction?: string;
  loot?: string[];
  location?: string;
  spawnPoint?: Coordinates;
  raw?: string;
}

export interface ZoneData {
  name: string;
  id: string;
  source: string;
  levelRange?: string;
  continent?: string;
  expansion?: string;
  npcs?: string[];
  connectedZones?: string[];
  portalStones?: ZoneLocation[];
  books?: ZoneLocation[];
  notableLocations?: ZoneLocation[];
  raw?: string;
}

export interface QuestData {
  name: string;
  url: string;
  source: string;
  description?: string;
  raw?: string;
}

// Runtime imports via webpack aliases (next.config.mjs)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const localdata = require('@eq/sources/localdata.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sourcesIndex = require('@eq/sources/index.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const toolsModule = require('@eq/tools');

// Local data functions
export const isGameDataAvailable: () => boolean = localdata.isGameDataAvailable;
export const searchLocalSpells: (query: string) => Promise<SearchResult[]> = localdata.searchLocalSpells;
export const searchSpellsByName: (query: string) => Promise<string> = localdata.searchSpellsByName;
export const searchSpellsByResist: (resistType: string, className?: string) => Promise<string> = localdata.searchSpellsByResist;
export const searchSpellsByTarget: (targetType: string, className?: string) => Promise<string> = localdata.searchSpellsByTarget;
export const searchSpellsByDescription: (query: string, className?: string) => Promise<string> = localdata.searchSpellsByDescription;
export const searchTimerGroup: (timerGroupOrSpell: string, className?: string) => Promise<string> = localdata.searchTimerGroup;
export const compareSpells: (spell1: string, spell2: string) => Promise<string> = localdata.compareSpells;
export const getLocalSpell: (id: string) => Promise<SpellData | null> = localdata.getLocalSpell;
export const getLocalSpellByName: (name: string) => Promise<SpellData | null> = localdata.getLocalSpellByName;
export const searchLocalZones: (query: string) => Promise<SearchResult[]> = localdata.searchLocalZones;
export const getLocalZone: (id: string) => Promise<ZoneData | null> = localdata.getLocalZone;
export const getSkillCaps: (className: string, level?: number, skillName?: string) => Promise<string> = localdata.getSkillCaps;
export const getBaseStats: (className: string, level?: number) => Promise<string> = localdata.getBaseStats;
export const searchAchievements: (query: string, category?: string) => Promise<SearchResult[]> = localdata.searchAchievements;
export const getAchievement: (id: string) => Promise<string> = localdata.getAchievement;
export const listAchievementCategories: () => Promise<string> = localdata.listAchievementCategories;
export const getAchievementsByCategory: (categoryId: string) => Promise<string> = localdata.getAchievementsByCategory;
export const getACMitigation: (className: string, level?: number) => Promise<string> = localdata.getACMitigation;
export const getSpellStackingInfo: (spellId: string) => Promise<string> = localdata.getSpellStackingInfo;
export const searchSpellStackingGroups: (query: string) => Promise<string> = localdata.searchSpellStackingGroups;
export const getSpellsByClass: (className: string, level?: number, category?: string, resistType?: string) => Promise<string> = localdata.getSpellsByClass;
export const searchSpellsByEffect: (effectName: string, className?: string, maxResults?: number) => Promise<string> = localdata.searchSpellsByEffect;
export const searchFactions: (query: string) => Promise<SearchResult[]> = localdata.searchFactions;
export const getFaction: (id: string) => Promise<string> = localdata.getFaction;
export const getFactionsByRace: (raceName: string) => Promise<string> = localdata.getFactionsByRace;
export const getFactionsByDeity: (deityName: string) => Promise<string> = localdata.getFactionsByDeity;
export const getFactionsByClass: (className: string) => Promise<string> = localdata.getFactionsByClass;
export const getCharacterFactions: (race: string, deity?: string, className?: string) => Promise<string> = localdata.getCharacterFactions;
export const searchAAAbilities: (query: string) => Promise<SearchResult[]> = localdata.searchAAAbilities;
export const getAAAbility: (id: string) => Promise<string> = localdata.getAAAbility;
export const searchLore: (query: string) => Promise<SearchResult[]> = localdata.searchLore;
export const getLore: (filenameOrTitle: string) => Promise<string> = localdata.getLore;
export const searchGameStrings: (query: string) => Promise<SearchResult[]> = localdata.searchGameStrings;
export const searchOverseerMinions: (query: string) => Promise<SearchResult[]> = localdata.searchOverseerMinions;
export const getOverseerMinion: (id: string) => Promise<string> = localdata.getOverseerMinion;
export const searchOverseerQuests: (query: string) => Promise<SearchResult[]> = localdata.searchOverseerQuests;
export const getOverseerQuest: (id: string) => Promise<string> = localdata.getOverseerQuest;
export const getOverseerIncapacitations: () => Promise<string> = localdata.getOverseerIncapacitations;
export const searchAugmentGroups: (query: string) => Promise<SearchResult[]> = localdata.searchAugmentGroups;
export const searchCombatAbilities: (query: string) => Promise<SearchResult[]> = localdata.searchCombatAbilities;
export const searchMercenaries: (query: string) => Promise<SearchResult[]> = localdata.searchMercenaries;
export const getMercenary: (id: string) => Promise<string> = localdata.getMercenary;
export const getMercenaryStances: () => Promise<string> = localdata.getMercenaryStances;
export const getRaceInfo: (raceName: string) => Promise<string> = localdata.getRaceInfo;
export const compareRaces: (race1: string, race2: string) => Promise<string> = localdata.compareRaces;
export const getClassInfo: (className: string) => Promise<string> = localdata.getClassInfo;
export const getDeityInfo: (deityName: string) => Promise<string> = localdata.getDeityInfo;
export const getStatInfo: (statName?: string) => Promise<string> = localdata.getStatInfo;
export const searchAltCurrencies: (query: string) => Promise<SearchResult[]> = localdata.searchAltCurrencies;
export const searchTributes: (query: string) => Promise<SearchResult[]> = localdata.searchTributes;
export const getTribute: (id: string) => Promise<string> = localdata.getTribute;
export const searchItemEffects: (query: string) => Promise<SearchResult[]> = localdata.searchItemEffects;
export const getItemEffect: (id: string) => Promise<string> = localdata.getItemEffect;
export const getZoneMapPOIs: (zoneName: string, query?: string) => Promise<string> = localdata.getZoneMapPOIs;
export const searchZonesByName: (query: string, levelMin?: number, levelMax?: number) => Promise<string> = localdata.searchZonesByName;
export const searchLocalZonesByLevel: (levelMin: number, levelMax: number) => Promise<string> = localdata.searchLocalZonesByLevel;
export const searchTeleportSpells: (zoneName: string) => Promise<string> = localdata.searchTeleportSpells;
export const listSpellCategories: () => Promise<string> = localdata.listSpellCategories;
export const listExpansions: () => Promise<string> = localdata.listExpansions;
export const getExpansionContent: (expansionQuery: string) => Promise<string> = localdata.getExpansionContent;
export const searchGameEvents: (query: string) => Promise<SearchResult[]> = localdata.searchGameEvents;
export const getGameEvent: (id: string) => Promise<string> = localdata.getGameEvent;
export const searchCreatureTypes: (query: string) => Promise<string> = localdata.searchCreatureTypes;
export const searchHelpTopics: (query?: string) => Promise<string> = localdata.searchHelpTopics;
export const getHelpTopic: (topic: string) => Promise<string> = localdata.getHelpTopic;
export const getSharedSpells: (class1: string, class2: string, level?: number) => Promise<string> = localdata.getSharedSpells;
export const getSpellLine: (spellName: string) => Promise<string> = localdata.getSpellLine;
export const searchSpellsByBeneficial: (className: string, beneficial: boolean, level?: number) => Promise<string> = localdata.searchSpellsByBeneficial;
export const getExclusiveSpells: (className: string, level?: number) => Promise<string> = localdata.getExclusiveSpells;
export const compareClasses: (class1: string, class2: string) => Promise<string> = localdata.compareClasses;
export const searchSpellsAdvanced: (criteria: {
  class?: string;
  minLevel?: number;
  maxLevel?: number;
  beneficial?: boolean;
  targetType?: string;
  resistType?: string;
  category?: string;
  nameContains?: string;
  hasEffect?: string;
}) => Promise<string> = localdata.searchSpellsAdvanced;
export const getClassSpellSummary: (className: string) => Promise<string> = localdata.getClassSpellSummary;
export const compareDeities: (deity1: string, deity2: string) => Promise<string> = localdata.compareDeities;
export const getLocalDataStatus: () => Promise<string> = localdata.getLocalDataStatus;
export const listAllRaces: () => Promise<string> = localdata.listAllRaces;
export const listAllClasses: () => Promise<string> = localdata.listAllClasses;
export const listAllDeities: () => Promise<string> = localdata.listAllDeities;
export const listAugmentSlotTypes: () => Promise<string> = localdata.listAugmentSlotTypes;
export const getClassAbilitiesAtLevel: (className: string, level: number) => Promise<string> = localdata.getClassAbilitiesAtLevel;
export const listSpellEffectTypes: () => string = localdata.listSpellEffectTypes;
export const getRaceClassMatrix: () => string = localdata.getRaceClassMatrix;
export const getLevelingZonesGuide: () => Promise<string> = localdata.getLevelingZonesGuide;
export const getOverseerQuestSummary: () => Promise<string> = localdata.getOverseerQuestSummary;
export const getMercenaryOverview: () => Promise<string> = localdata.getMercenaryOverview;
export const getCharacterCreationGuide: (role?: string) => Promise<string> = localdata.getCharacterCreationGuide;
export const getFactionOverview: () => Promise<string> = localdata.getFactionOverview;
export const getDeityClassMatrix: () => string = localdata.getDeityClassMatrix;
export const getZoneLevelStatistics: () => Promise<string> = localdata.getZoneLevelStatistics;
export const getAchievementOverview: () => Promise<string> = localdata.getAchievementOverview;
export const getAAOverview: () => Promise<string> = localdata.getAAOverview;
export const searchOverseerAgentsByTrait: (trait: string) => Promise<string> = localdata.searchOverseerAgentsByTrait;
export const getGameEventOverview: () => Promise<string> = localdata.getGameEventOverview;
export const getLoreOverview: () => Promise<string> = localdata.getLoreOverview;
export const getCurrencyOverview: () => Promise<string> = localdata.getCurrencyOverview;
export const getMapStatistics: () => Promise<string> = localdata.getMapStatistics;
export const getRaceStatComparison: () => Promise<string> = localdata.getRaceStatComparison;
export const getDeityOverview: () => Promise<string> = localdata.getDeityOverview;
export const getClassComparisonMatrix: () => Promise<string> = localdata.getClassComparisonMatrix;
export const getExpansionTimeline: () => Promise<string> = localdata.getExpansionTimeline;
export const getGameDataSummaryDashboard: () => Promise<string> = localdata.getGameDataSummaryDashboard;
export const getClassRoleAnalysis: () => Promise<string> = localdata.getClassRoleAnalysis;
export const getGroupCompositionAdvisor: () => Promise<string> = localdata.getGroupCompositionAdvisor;
export const getClassEndgameProfile: (className: string) => Promise<string> = localdata.getClassEndgameProfile;
export const getMercenaryClassSynergy: () => Promise<string> = localdata.getMercenaryClassSynergy;
export const getClassIdentityProfile: (className: string) => Promise<string> = localdata.getClassIdentityProfile;
export const getHotZoneBonuses: () => Promise<string> = localdata.getHotZoneBonuses;
export const getStartingCityLore: () => Promise<string> = localdata.getStartingCityLore;
export const getCreatureTypeOverview: () => Promise<string> = localdata.getCreatureTypeOverview;

// Multi-source search
export const searchAll: (query: string) => Promise<SearchResult[]> = sourcesIndex.searchAll;
export const searchQuests: (query: string) => Promise<SearchResult[]> = sourcesIndex.searchQuests;
export const searchTradeskills: (query: string) => Promise<SearchResult[]> = sourcesIndex.searchTradeskills;

// Tool handler
export const handleToolCall: (name: string, args: Record<string, unknown>) => Promise<unknown> = toolsModule.handleToolCall;
export const tools: Array<{ name: string; description: string; inputSchema: unknown }> = toolsModule.tools;
