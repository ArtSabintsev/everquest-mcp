// Local EverQuest game data parser
// Reads data directly from installed EQ game files for authoritative, offline lookups

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { SearchResult, SpellData, ZoneData, fuzzyMatch, normalizeQuery } from './base.js';

// ============ CONFIGURATION ============

const DEFAULT_EQ_PATH = '/Users/arthur/Library/Application Support/CrossOver/Bottles/EverQuest/drive_c/users/Public/Daybreak Game Company/Installed Games/EverQuest';
const EQ_GAME_PATH = process.env.EQ_GAME_PATH || DEFAULT_EQ_PATH;

// ============ CLASS MAPPING ============

const CLASS_IDS: Record<number, string> = {
  1: 'Warrior', 2: 'Cleric', 3: 'Paladin', 4: 'Ranger',
  5: 'Shadow Knight', 6: 'Druid', 7: 'Monk', 8: 'Bard',
  9: 'Rogue', 10: 'Shaman', 11: 'Necromancer', 12: 'Wizard',
  13: 'Magician', 14: 'Enchanter', 15: 'Beastlord', 16: 'Berserker',
};

const CLASS_SHORT: Record<number, string> = {
  1: 'WAR', 2: 'CLR', 3: 'PAL', 4: 'RNG', 5: 'SHD', 6: 'DRU',
  7: 'MNK', 8: 'BRD', 9: 'ROG', 10: 'SHM', 11: 'NEC', 12: 'WIZ',
  13: 'MAG', 14: 'ENC', 15: 'BST', 16: 'BER',
};

// Reverse lookup: name -> ID
const CLASS_NAME_TO_ID: Record<string, number> = {};
for (const [id, name] of Object.entries(CLASS_IDS)) {
  CLASS_NAME_TO_ID[name.toLowerCase()] = parseInt(id);
}
for (const [id, short] of Object.entries(CLASS_SHORT)) {
  CLASS_NAME_TO_ID[short.toLowerCase()] = parseInt(id);
}

// ============ SPELL FIELD INDICES ============

// spells_us.txt is caret-delimited with 150+ fields per spell line
const SF = {
  ID: 0,
  NAME: 1,
  TELEPORT_ZONE: 3,
  RANGE: 4,
  AE_RANGE: 5,
  PUSH_BACK: 6,
  PUSH_UP: 7,
  CAST_TIME: 8,       // milliseconds
  RECOVERY_TIME: 9,   // milliseconds
  RECAST_TIME: 10,    // milliseconds
  DURATION_FORMULA: 11,
  DURATION_VALUE: 12,
  AE_DURATION: 13,
  MANA: 14,
  BENEFICIAL: 28,      // 1=beneficial, 0=detrimental
  RESIST_TYPE: 29,
  TARGET_TYPE: 30,
  // Class levels (fields 36-51): 255 = cannot use, else = minimum level
  CLASS_LEVEL_START: 36,
  CLASS_LEVEL_END: 51,
  // Class order: WAR(36), CLR(37), PAL(38), RNG(39), SHD(40), DRU(41),
  //              MNK(42), BRD(43), ROG(44), SHM(45), NEC(46), WIZ(47),
  //              MAG(48), ENC(49), BST(50), BER(51)
};

// ============ LOOKUP TABLES ============

const TARGET_TYPES: Record<number, string> = {
  1: 'Line of Sight', 2: 'AE (PC v1)', 3: 'Group v1', 4: 'PB AE',
  5: 'Single', 6: 'Self', 8: 'Targeted AE', 9: 'Animal', 10: 'Undead',
  13: 'Lifetap', 14: 'Pet', 15: 'Corpse', 36: 'Free Target',
  40: 'AE (PC v2)', 41: 'Group v2', 42: 'Directional AE', 44: 'Beam',
  46: 'Target Ring AE',
};

const RESIST_TYPES: Record<number, string> = {
  0: 'Unresistable', 1: 'Magic', 2: 'Fire', 3: 'Cold',
  4: 'Poison', 5: 'Disease', 6: 'Chromatic', 7: 'Prismatic',
  8: 'Physical', 9: 'Corruption',
};

const SPA_NAMES: Record<number, string> = {
  0: 'HP', 1: 'AC', 2: 'ATK', 3: 'Movement Speed',
  4: 'STR', 5: 'DEX', 6: 'AGI', 7: 'STA', 8: 'INT', 9: 'WIS', 10: 'CHA',
  11: 'Melee Haste', 12: 'Invisibility', 13: 'See Invisible',
  14: 'Water Breathing', 15: 'Mana', 18: 'Pacify', 19: 'Faction',
  20: 'Blind', 21: 'Stun', 22: 'Charm', 23: 'Fear', 24: 'Stamina/Endurance',
  25: 'Bind Affinity', 27: 'NPC Frenzy', 28: 'Ultravision', 29: 'Infravision',
  31: 'Snare', 32: 'Summon Item', 33: 'Summon Pet', 34: 'HP Regen',
  35: 'Mana Regen', 36: 'Dispel Magic', 46: 'Fire Resist', 47: 'Cold Resist',
  48: 'Poison Resist', 49: 'Disease Resist', 50: 'Magic Resist',
  55: 'Damage Absorb', 58: 'Spin Stun', 59: 'Infravision',
  69: 'Max HP', 71: 'Gate', 73: 'Bind Sight', 74: 'Mesmerize',
  79: 'HP Limit', 85: 'Spell Proc', 86: 'Illusion', 87: 'Damage Shield',
  91: 'Summon Corpse', 96: 'Intoxication', 97: 'Spell Shield',
  100: 'Teleport', 101: 'HP Change', 104: 'Max HP Change',
  111: 'Reverse Damage Shield', 114: 'Aggro', 116: 'Curse',
  119: 'Melee Proc', 120: 'Range Proc', 121: 'Illusion: Other',
  127: 'Spell Haste', 128: 'Spell Duration Increase',
  132: 'Mitigate Melee Damage', 148: 'Stacking Block',
  254: 'Placeholder',
  289: 'Improved Spell Effect', 311: 'Limit: Max Level',
  339: 'Trigger Spell', 340: 'Trigger Spell (Proc)',
  374: 'Critical Heal Chance', 375: 'Critical Heal Amount',
  385: 'Flurry Chance', 413: 'Spell Damage',
  461: 'HP Absorb % Max', 462: 'HP Absorb Total', 463: 'Melee Threshold',
  469: 'Mana Absorb', 471: 'DoT Crit Chance',
  483: 'Limit: Cast Time Max', 484: 'Limit: Cast Time Min',
  500: 'AC Limit', 501: 'Mana Limit', 507: 'Overshadow',
};

const SKILL_NAMES: Record<number, string> = {
  0: '1H Blunt', 1: '1H Slashing', 2: '2H Blunt', 3: '2H Slashing',
  4: 'Abjuration', 5: 'Alteration', 6: 'Apply Poison', 7: 'Archery',
  8: 'Backstab', 9: 'Bind Wound', 10: 'Bash', 11: 'Block',
  12: 'Brass Instruments', 13: 'Channeling', 14: 'Conjuration', 15: 'Defense',
  16: 'Disarm', 17: 'Disarm Traps', 18: 'Divination', 19: 'Dodge',
  20: 'Double Attack', 21: 'Dragon Punch', 22: 'Dual Wield', 23: 'Eagle Strike',
  24: 'Evocation', 25: 'Feign Death', 26: 'Flying Kick', 27: 'Forage',
  28: 'Hand to Hand', 29: 'Hide', 30: 'Kick', 31: 'Meditate',
  32: 'Mend', 33: 'Offense', 34: 'Parry', 35: 'Pick Lock',
  36: '1H Piercing', 37: 'Riposte', 38: 'Round Kick', 39: 'Safe Fall',
  40: 'Sense Heading', 41: 'Singing', 42: 'Sneak',
  43: 'Specialize Abjuration', 44: 'Specialize Alteration',
  45: 'Specialize Conjuration', 46: 'Specialize Divination',
  47: 'Specialize Evocation', 48: 'Pick Pockets', 49: 'Stringed Instruments',
  50: 'Swimming', 51: 'Throwing', 52: 'Tiger Claw', 53: 'Tracking',
  54: 'Wind Instruments', 55: 'Fishing', 56: 'Make Poison', 57: 'Tinkering',
  58: 'Research', 59: 'Alchemy', 60: 'Baking', 61: 'Tailoring',
  62: 'Sense Traps', 63: 'Blacksmithing', 64: 'Fletching', 65: 'Brewing',
  66: 'Alcohol Tolerance', 67: 'Begging', 68: 'Jewelry Making',
  69: 'Pottery', 70: 'Percussion Instruments', 71: 'Intimidation',
  72: 'Berserking', 73: 'Taunt', 74: 'Frenzy',
  75: 'Remove Traps', 76: 'Triple Attack', 77: '2H Piercing',
};

// ============ INTERNAL DATA TYPES ============

interface LocalSpell {
  id: number;
  name: string;
  fields: string[];
}

interface SpellStrings {
  casterMe: string;
  casterOther: string;
  castedMe: string;
  castedOther: string;
  spellGone: string;
}

interface LocalZone {
  id: number;
  name: string;
  levelMin: number;
  levelMax: number;
}

interface SkillCapEntry {
  classId: number;
  skillId: number;
  level: number;
  cap: number;
}

interface BaseStatEntry {
  level: number;
  classId: number;
  hp: number;
  mana: number;
  endurance: number;
  unknown1: number;
  unknown2: number;
  hpRegen: number;
  manaRegen: number;
  enduranceRegen: number;
}

interface AchievementEntry {
  id: number;
  name: string;
  description: string;
  rewardId: number;
  points: number;
}

interface SpellStackEntry {
  spellId: number;
  stackingGroup: number;
  rank: number;
  stackingType: number;
}

interface ACMitigationEntry {
  classId: number;
  level: number;
  acCap: number;
  softCapMultiplier: number;
}

interface MapPOI {
  x: number;
  y: number;
  z: number;
  label: string;
  r: number;
  g: number;
  b: number;
}

interface FactionEntry {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
}

interface AAEntry {
  id: number;
  name: string;
  description: string;
}

interface LoreEntry {
  filename: string;
  title: string;
  content: string;
}

interface AchievementCategory {
  id: number;
  parentId: number;
  order: number;
  name: string;
  description: string;
}

interface AchievementComponent {
  achievementId: number;
  componentNum: number;
  type: number;
  requirement: number;
  description: string;
}

interface OverseerMinion {
  id: number;
  rarity: number;
  shortName: string;
  fullName: string;
  bio: string;
  traits: string[];
}

interface OverseerQuest {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  difficulty: number;
  duration: number;
}

// ============ LAZY-LOADED DATA STORES ============

let spells: Map<number, LocalSpell> | null = null;
let spellNameIndex: Map<string, number[]> | null = null;
let spellStrings: Map<number, SpellStrings> | null = null;
let zones: Map<number, LocalZone> | null = null;
let zoneNameIndex: Map<string, number[]> | null = null;
let skillCaps: SkillCapEntry[] | null = null;
let baseStats: BaseStatEntry[] | null = null;
let achievements: Map<number, AchievementEntry> | null = null;
let achievementNameIndex: Map<string, number[]> | null = null;
let spellStacking: Map<number, SpellStackEntry[]> | null = null;
let acMitigation: ACMitigationEntry[] | null = null;
let spellRequirements: Map<number, { subId: number; reqId: number; failureStringId: number }[]> | null = null;
let mapCache: Map<string, MapPOI[]> = new Map();

// dbstr_us.txt parsed data
let dbStrings: Map<number, Map<number, string>> | null = null; // type -> id -> text
let factions: Map<number, FactionEntry> | null = null;
let factionNameIndex: Map<string, number[]> | null = null;
let aaAbilities: Map<number, AAEntry> | null = null;
let aaNameIndex: Map<string, number[]> | null = null;
let spellDescriptions: Map<number, string> | null = null;

// Lore/Storyline data
let loreEntries: LoreEntry[] | null = null;
let loreNameIndex: Map<string, number> | null = null; // lowercase title -> index in loreEntries

// Enhanced achievement data
let achievementCategories: Map<number, AchievementCategory> | null = null;
let achievementToCategories: Map<number, number[]> | null = null; // achievementId -> categoryIds
let achievementComponents: Map<number, AchievementComponent[]> | null = null;

// Game strings (eqstr_us.txt)
let gameStrings: Map<number, string> | null = null;

// Overseer system
let overseerMinions: Map<number, OverseerMinion> | null = null;
let overseerMinionNameIndex: Map<string, number[]> | null = null;
let overseerQuests: Map<number, OverseerQuest> | null = null;
let overseerQuestNameIndex: Map<string, number[]> | null = null;

let dataAvailable: boolean | null = null;

// ============ PATH HELPERS ============

function gamePath(...parts: string[]): string {
  return join(EQ_GAME_PATH, ...parts);
}

export function isGameDataAvailable(): boolean {
  if (dataAvailable !== null) return dataAvailable;
  dataAvailable = existsSync(gamePath('spells_us.txt'));
  if (dataAvailable) {
    console.error(`[LocalData] EQ game files found at: ${EQ_GAME_PATH}`);
  } else {
    console.error(`[LocalData] EQ game files NOT found at: ${EQ_GAME_PATH}`);
  }
  return dataAvailable;
}

async function readGameFile(path: string): Promise<string> {
  return readFile(gamePath(path), 'utf-8');
}

// ============ SPELL PARSER ============

async function loadSpells(): Promise<void> {
  if (spells !== null) return;

  if (!isGameDataAvailable()) {
    spells = new Map();
    spellNameIndex = new Map();
    return;
  }

  console.error('[LocalData] Loading spells_us.txt...');
  const data = await readGameFile('spells_us.txt');
  const lines = data.split('\n');

  spells = new Map();
  spellNameIndex = new Map();

  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 52) continue;

    const id = parseInt(fields[SF.ID]);
    const name = fields[SF.NAME];
    if (isNaN(id) || !name) continue;

    spells.set(id, { id, name, fields });

    // Build name index for search (lowercase words -> spell IDs)
    const lowerName = name.toLowerCase();
    const existing = spellNameIndex.get(lowerName) || [];
    existing.push(id);
    spellNameIndex.set(lowerName, existing);
  }

  console.error(`[LocalData] Loaded ${spells.size} spells`);
}

async function loadSpellStrings(): Promise<void> {
  if (spellStrings !== null) return;

  if (!isGameDataAvailable()) {
    spellStrings = new Map();
    return;
  }

  try {
    console.error('[LocalData] Loading spells_us_str.txt...');
    const data = await readGameFile('spells_us_str.txt');
    const lines = data.split('\n');
    spellStrings = new Map();

    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      const fields = line.split('^');
      if (fields.length < 6) continue;

      const id = parseInt(fields[0]);
      if (isNaN(id)) continue;

      spellStrings.set(id, {
        casterMe: fields[1] || '',
        casterOther: fields[2] || '',
        castedMe: fields[3] || '',
        castedOther: fields[4] || '',
        spellGone: fields[5] || '',
      });
    }

    console.error(`[LocalData] Loaded ${spellStrings.size} spell strings`);
  } catch {
    console.error('[LocalData] Could not load spells_us_str.txt');
    spellStrings = new Map();
  }
}

function parseSpellEffects(fields: string[]): string[] {
  const effects: string[] = [];

  // Find the last field containing pipe characters (effect data)
  for (let i = fields.length - 1; i >= 0; i--) {
    if (fields[i].includes('|')) {
      const slots = fields[i].split('$');
      for (const slot of slots) {
        const parts = slot.split('|');
        if (parts.length >= 3) {
          const slotNum = parseInt(parts[0]);
          const spa = parseInt(parts[1]);
          const base1 = parseInt(parts[2]);
          const base2 = parts.length > 3 ? parseInt(parts[3]) : 0;
          const max = parts.length > 4 ? parseInt(parts[4]) : 0;

          if (isNaN(spa) || (base1 === 0 && spa === 254)) continue;

          const spaName = SPA_NAMES[spa] || `SPA ${spa}`;
          let desc = `Slot ${slotNum}: ${spaName}`;

          if (spa === 0 || spa === 79 || spa === 101) {
            // HP effects
            if (base1 > 0) desc += ` +${base1}`;
            else desc += ` ${base1}`;
            if (max > 0) desc += ` (max: ${max})`;
          } else if (spa === 3 || spa === 31) {
            // Movement speed / snare
            desc += ` ${base1}%`;
          } else if (spa >= 4 && spa <= 10) {
            // Stats
            if (base1 > 0) desc += ` +${base1}`;
            else desc += ` ${base1}`;
          } else if (spa === 11) {
            // Haste
            desc += ` ${base1}%`;
          } else if (spa === 34 || spa === 35) {
            // Regen
            desc += ` ${base1}/tick`;
          } else if (spa >= 46 && spa <= 50) {
            // Resists
            if (base1 > 0) desc += ` +${base1}`;
            else desc += ` ${base1}`;
          } else if (spa === 86) {
            desc += `: ${base1}`;
          } else if (spa === 87) {
            desc += ` ${base1}`;
          } else if (spa === 32) {
            desc += ` (item ID: ${base1})`;
          } else if (base1 !== 0) {
            if (base1 > 0) desc += ` +${base1}`;
            else desc += ` ${base1}`;
          }

          effects.push(desc);
        }
      }
      break;
    }
  }

  return effects;
}

function formatDuration(formula: number, value: number): string {
  if (formula === 0 && value === 0) return 'Instant';

  const ticks = calculateDurationTicks(formula, value);
  if (ticks === -1) return `Formula ${formula}, Base ${value} ticks`;
  if (ticks === 0) return 'Instant';

  const seconds = ticks * 6;
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60 > 0 ? (seconds % 60) + 's' : ''}`.trim();
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins > 0 ? mins + 'm' : ''}`.trim();
}

function calculateDurationTicks(formula: number, value: number): number {
  // Returns duration in ticks (1 tick = 6 seconds)
  // Some formulas depend on caster level, so we use max level (125) as estimate
  const level = 125;
  switch (formula) {
    case 0: return 0;
    case 1: return Math.min(Math.ceil(level / 2), value || 999);
    case 2: return Math.min(Math.ceil(level * 0.6), value || 999);
    case 3: return Math.min(level * 30, value || 999);
    case 4: return value || 50;
    case 5: return value || 2;
    case 6: return Math.min(Math.ceil(level / 2) + 2, value || 999);
    case 7: return Math.min(level, value || 999);
    case 8: return Math.min(level + 10, value || 999);
    case 9: return Math.min(2 * level + 10, value || 999);
    case 10: return Math.min(3 * level + 10, value || 999);
    case 11: return Math.min(Math.ceil(level / 4), value || 999);
    case 12: return value;
    case 15: return value;
    case 50: return 72000; // permanent (effectively)
    case 51: return 72000; // permanent
    default: return value || -1;
  }
}

function buildLocalSpellData(spell: LocalSpell): SpellData {
  const f = spell.fields;

  // Parse class levels
  const classes: Record<string, number> = {};
  for (let i = 0; i < 16; i++) {
    const level = parseInt(f[SF.CLASS_LEVEL_START + i]);
    if (!isNaN(level) && level !== 255 && level > 0) {
      classes[CLASS_IDS[i + 1]] = level;
    }
  }

  // Parse basic fields
  const mana = parseInt(f[SF.MANA]);
  const castTime = parseInt(f[SF.CAST_TIME]);
  const recoveryTime = parseInt(f[SF.RECOVERY_TIME]);
  const recastTime = parseInt(f[SF.RECAST_TIME]);
  const range = parseInt(f[SF.RANGE]);
  const aeRange = parseInt(f[SF.AE_RANGE]);
  const targetType = parseInt(f[SF.TARGET_TYPE]);
  const resistType = parseInt(f[SF.RESIST_TYPE]);
  const durationFormula = parseInt(f[SF.DURATION_FORMULA]);
  const durationValue = parseInt(f[SF.DURATION_VALUE]);
  const beneficial = f[SF.BENEFICIAL] === '1';

  // Parse effects
  const effects = parseSpellEffects(f);

  const spellData: SpellData = {
    name: spell.name,
    id: spell.id.toString(),
    source: 'Local Game Data',
    classes: Object.keys(classes).length > 0 ? classes : undefined,
    effects: effects.length > 0 ? effects : undefined,
  };

  if (!isNaN(mana) && mana > 0) spellData.mana = mana;

  if (!isNaN(castTime) && castTime > 0) {
    spellData.castTime = `${(castTime / 1000).toFixed(1)}s`;
  }

  if (!isNaN(recastTime) && recastTime > 0) {
    spellData.recastTime = `${(recastTime / 1000).toFixed(1)}s`;
  }

  if (durationFormula > 0 || durationValue > 0) {
    spellData.duration = formatDuration(durationFormula, durationValue);
  }

  if (!isNaN(range) && range > 0) {
    spellData.range = `${range}`;
  }

  if (!isNaN(targetType)) {
    spellData.target = TARGET_TYPES[targetType] || `Type ${targetType}`;
  }

  if (!isNaN(resistType) && resistType > 0) {
    spellData.resist = RESIST_TYPES[resistType] || `Type ${resistType}`;
  }

  return spellData;
}

// ============ ZONE PARSER ============

async function loadZones(): Promise<void> {
  if (zones !== null) return;

  if (!isGameDataAvailable()) {
    zones = new Map();
    zoneNameIndex = new Map();
    return;
  }

  console.error('[LocalData] Loading ZoneNames.txt...');
  const data = await readGameFile(join('Resources', 'ZoneNames.txt'));
  const lines = data.split('\n');

  zones = new Map();
  zoneNameIndex = new Map();

  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 4) continue;

    const id = parseInt(fields[0]);
    const name = fields[1];
    const levelMin = parseInt(fields[2]) || 0;
    const levelMax = parseInt(fields[3]) || 0;
    if (isNaN(id) || !name) continue;

    zones.set(id, { id, name, levelMin, levelMax });

    const lowerName = name.toLowerCase();
    const existing = zoneNameIndex.get(lowerName) || [];
    existing.push(id);
    zoneNameIndex.set(lowerName, existing);
  }

  console.error(`[LocalData] Loaded ${zones.size} zones`);
}

// ============ SKILL CAPS PARSER ============

async function loadSkillCaps(): Promise<void> {
  if (skillCaps !== null) return;

  if (!isGameDataAvailable()) {
    skillCaps = [];
    return;
  }

  console.error('[LocalData] Loading skillcaps.txt...');
  const data = await readGameFile(join('Resources', 'skillcaps.txt'));
  const lines = data.split('\n');

  skillCaps = [];

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 4) continue;

    const classId = parseInt(fields[0]);
    const skillId = parseInt(fields[1]);
    const level = parseInt(fields[2]);
    const cap = parseInt(fields[3]);
    if (isNaN(classId) || isNaN(skillId) || isNaN(level) || isNaN(cap)) continue;

    skillCaps.push({ classId, skillId, level, cap });
  }

  console.error(`[LocalData] Loaded ${skillCaps.length} skill cap entries`);
}

// ============ BASE STATS PARSER ============

async function loadBaseStats(): Promise<void> {
  if (baseStats !== null) return;

  if (!isGameDataAvailable()) {
    baseStats = [];
    return;
  }

  console.error('[LocalData] Loading basedata.txt...');
  const data = await readGameFile(join('Resources', 'basedata.txt'));
  const lines = data.split('\n');

  baseStats = [];

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 10) continue;

    const level = parseInt(fields[0]);
    const classId = parseInt(fields[1]);
    const hp = parseInt(fields[2]);
    const mana = parseInt(fields[3]);
    const endurance = parseInt(fields[4]);
    const unknown1 = parseInt(fields[5]);
    const unknown2 = parseInt(fields[6]);
    const hpRegen = parseFloat(fields[7]);
    const manaRegen = parseFloat(fields[8]);
    const enduranceRegen = parseFloat(fields[9]);

    if (isNaN(level) || isNaN(classId)) continue;

    baseStats.push({
      level, classId, hp, mana, endurance,
      unknown1, unknown2, hpRegen, manaRegen, enduranceRegen,
    });
  }

  console.error(`[LocalData] Loaded ${baseStats.length} base stat entries`);
}

// ============ ACHIEVEMENT PARSER ============

async function loadAchievements(): Promise<void> {
  if (achievements !== null) return;

  if (!isGameDataAvailable()) {
    achievements = new Map();
    achievementNameIndex = new Map();
    return;
  }

  console.error('[LocalData] Loading AchievementsClient.txt...');
  const data = await readGameFile(join('Resources', 'Achievements', 'AchievementsClient.txt'));
  const lines = data.split('\n');

  achievements = new Map();
  achievementNameIndex = new Map();

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 5) continue;

    const id = parseInt(fields[0]);
    const name = fields[1];
    const description = fields[2];
    const rewardId = parseInt(fields[3]) || 0;
    const points = parseInt(fields[4]) || 0;
    if (isNaN(id) || !name) continue;

    achievements.set(id, { id, name, description, rewardId, points });

    const lowerName = name.toLowerCase();
    const existing = achievementNameIndex.get(lowerName) || [];
    existing.push(id);
    achievementNameIndex.set(lowerName, existing);
  }

  console.error(`[LocalData] Loaded ${achievements.size} achievements`);
}

// ============ SPELL STACKING PARSER ============

async function loadSpellStacking(): Promise<void> {
  if (spellStacking !== null) return;

  if (!isGameDataAvailable()) {
    spellStacking = new Map();
    return;
  }

  console.error('[LocalData] Loading SpellStackingGroups.txt...');
  const data = await readGameFile(join('Resources', 'SpellStackingGroups.txt'));
  const lines = data.split('\n');

  spellStacking = new Map();

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 4) continue;

    const spellId = parseInt(fields[0]);
    const stackingGroup = parseInt(fields[1]);
    const rank = parseInt(fields[2]);
    const stackingType = parseInt(fields[3]);
    if (isNaN(spellId)) continue;

    const entry: SpellStackEntry = { spellId, stackingGroup, rank, stackingType };
    const existing = spellStacking.get(spellId) || [];
    existing.push(entry);
    spellStacking.set(spellId, existing);
  }

  console.error(`[LocalData] Loaded stacking data for ${spellStacking.size} spells`);
}

// ============ AC MITIGATION PARSER ============

async function loadACMitigation(): Promise<void> {
  if (acMitigation !== null) return;

  if (!isGameDataAvailable()) {
    acMitigation = [];
    return;
  }

  console.error('[LocalData] Loading ACMitigation.txt...');
  const data = await readGameFile(join('Resources', 'ACMitigation.txt'));
  const lines = data.split('\n');

  acMitigation = [];

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 4) continue;

    const classId = parseInt(fields[0]);
    const level = parseInt(fields[1]);
    const acCap = parseInt(fields[2]);
    const softCapMultiplier = parseFloat(fields[3]);
    if (isNaN(classId) || isNaN(level)) continue;

    acMitigation.push({ classId, level, acCap, softCapMultiplier });
  }

  console.error(`[LocalData] Loaded ${acMitigation.length} AC mitigation entries`);
}

// ============ SPELL REQUIREMENTS PARSER ============

async function loadSpellRequirements(): Promise<void> {
  if (spellRequirements !== null) return;

  if (!isGameDataAvailable()) {
    spellRequirements = new Map();
    return;
  }

  console.error('[LocalData] Loading spellrequirementassociations.txt...');
  const data = await readGameFile(join('Resources', 'spellrequirementassociations.txt'));
  const lines = data.split('\n');

  spellRequirements = new Map();

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const fields = line.split('^');
    if (fields.length < 4) continue;

    const spellAssocId = parseInt(fields[0]);
    const subId = parseInt(fields[1]);
    const reqId = parseInt(fields[2]);
    const failureStringId = parseInt(fields[3]);
    if (isNaN(spellAssocId)) continue;

    const existing = spellRequirements.get(spellAssocId) || [];
    existing.push({ subId, reqId, failureStringId });
    spellRequirements.set(spellAssocId, existing);
  }

  console.error(`[LocalData] Loaded requirements for ${spellRequirements.size} spell associations`);
}

// ============ DBSTR_US.TXT PARSER ============

// String types in dbstr_us.txt: object_id^string_type^text^extra^
const DBSTR_TYPES = {
  AA_NAME: 1,
  AA_DESCRIPTION: 4,
  SPELL_CATEGORY: 5,
  SPELL_DESCRIPTION: 6,
  COMBAT_ABILITY: 27,
  FACTION_NAME: 45,
  OVERSEER_MINION_SHORT: 52,
  OVERSEER_MINION_FULL: 53,
  OVERSEER_TRAIT: 54,
  OVERSEER_QUEST_NAME: 56,
  OVERSEER_QUEST_DESC: 57,
  OVERSEER_MINION_BIO: 61,
};

const OVERSEER_RARITIES: Record<number, string> = {
  1: 'Common',
  2: 'Uncommon',
  3: 'Rare',
  4: 'Elite',
  5: 'Legendary',
};

async function loadDbStrings(types: number[]): Promise<void> {
  if (dbStrings === null) {
    dbStrings = new Map();
  }

  // Check which types still need loading
  const needed = types.filter(t => !dbStrings!.has(t));
  if (needed.length === 0) return;

  if (!isGameDataAvailable()) return;

  try {
    console.error(`[LocalData] Loading dbstr_us.txt for types: ${needed.join(', ')}...`);
    const data = await readGameFile('dbstr_us.txt');
    const lines = data.split('\n');

    // Initialize maps for needed types
    const neededSet = new Set(needed);
    for (const t of needed) {
      dbStrings.set(t, new Map());
    }

    for (const line of lines) {
      if (!line.trim()) continue;
      const fields = line.split('^');
      if (fields.length < 3) continue;

      const id = parseInt(fields[0]);
      const type = parseInt(fields[1]);
      const text = fields[2];

      if (isNaN(id) || isNaN(type) || !text) continue;
      if (!neededSet.has(type)) continue;

      dbStrings.get(type)!.set(id, text);
    }

    for (const t of needed) {
      console.error(`[LocalData] Loaded ${dbStrings.get(t)!.size} strings for type ${t}`);
    }
  } catch {
    console.error('[LocalData] Could not load dbstr_us.txt');
    for (const t of needed) {
      if (!dbStrings.has(t)) dbStrings.set(t, new Map());
    }
  }
}

// ============ SPELL DESCRIPTIONS PARSER ============

async function loadSpellDescriptions(): Promise<void> {
  if (spellDescriptions !== null) return;

  await loadDbStrings([DBSTR_TYPES.SPELL_DESCRIPTION]);
  spellDescriptions = dbStrings?.get(DBSTR_TYPES.SPELL_DESCRIPTION) || new Map();
  console.error(`[LocalData] ${spellDescriptions.size} spell descriptions available`);
}

// ============ FACTION PARSER ============

async function loadFactions(): Promise<void> {
  if (factions !== null) return;

  if (!isGameDataAvailable()) {
    factions = new Map();
    factionNameIndex = new Map();
    return;
  }

  // Load faction names from dbstr_us.txt
  await loadDbStrings([DBSTR_TYPES.FACTION_NAME]);
  const factionNames = dbStrings?.get(DBSTR_TYPES.FACTION_NAME) || new Map();

  // Load faction base data
  console.error('[LocalData] Loading FactionBaseData.txt...');
  factions = new Map();
  factionNameIndex = new Map();

  try {
    const data = await readGameFile(join('Resources', 'Faction', 'FactionBaseData.txt'));
    const lines = data.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 3) continue;

      const id = parseInt(fields[0]);
      const minValue = parseInt(fields[1]) || -2000;
      const maxValue = parseInt(fields[2]) || 2000;
      if (isNaN(id)) continue;

      const name = factionNames.get(id) || `Faction ${id}`;
      factions.set(id, { id, name, minValue, maxValue });

      // Build name index
      const lowerName = name.toLowerCase();
      const existing = factionNameIndex!.get(lowerName) || [];
      existing.push(id);
      factionNameIndex!.set(lowerName, existing);
    }

    console.error(`[LocalData] Loaded ${factions.size} factions (${factionNames.size} with names)`);
  } catch {
    console.error('[LocalData] Could not load FactionBaseData.txt');
  }
}

// ============ AA ABILITY PARSER ============

async function loadAAAbilities(): Promise<void> {
  if (aaAbilities !== null) return;

  if (!isGameDataAvailable()) {
    aaAbilities = new Map();
    aaNameIndex = new Map();
    return;
  }

  // Load AA names and descriptions from dbstr_us.txt
  await loadDbStrings([DBSTR_TYPES.AA_NAME, DBSTR_TYPES.AA_DESCRIPTION]);
  const aaNames = dbStrings?.get(DBSTR_TYPES.AA_NAME) || new Map();
  const aaDescs = dbStrings?.get(DBSTR_TYPES.AA_DESCRIPTION) || new Map();

  aaAbilities = new Map();
  aaNameIndex = new Map();

  for (const [id, name] of aaNames) {
    const description = aaDescs.get(id) || '';
    aaAbilities.set(id, { id, name, description });

    const lowerName = name.toLowerCase();
    const existing = aaNameIndex.get(lowerName) || [];
    existing.push(id);
    aaNameIndex.set(lowerName, existing);
  }

  console.error(`[LocalData] Loaded ${aaAbilities.size} AA abilities`);
}

// ============ LORE/STORYLINE PARSER ============

function stripHtmlTags(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function loadLore(): Promise<void> {
  if (loreEntries !== null) return;

  if (!isGameDataAvailable()) {
    loreEntries = [];
    loreNameIndex = new Map();
    return;
  }

  const storyDir = gamePath('Storyline');
  if (!existsSync(storyDir)) {
    console.error('[LocalData] Storyline directory not found');
    loreEntries = [];
    loreNameIndex = new Map();
    return;
  }

  console.error('[LocalData] Loading Storyline files...');
  loreEntries = [];
  loreNameIndex = new Map();

  try {
    const files = await readdir(storyDir);
    const storyFiles = files.filter(f => f.startsWith('story') && f.endsWith('.txt') && !f.endsWith('.txt:crc'));

    for (const file of storyFiles.sort()) {
      try {
        const content = await readFile(join(storyDir, file), 'utf-8');
        const lines = content.split('\n');
        const title = lines[0]?.trim() || file.replace('.txt', '');
        const body = stripHtmlTags(lines.slice(1).join('\n'));

        const index = loreEntries.length;
        loreEntries.push({ filename: file, title, content: body });
        loreNameIndex!.set(title.toLowerCase(), index);
      } catch {
        // Skip unreadable files
      }
    }

    console.error(`[LocalData] Loaded ${loreEntries.length} lore stories`);
  } catch {
    console.error('[LocalData] Could not read Storyline directory');
  }
}

// ============ ENHANCED ACHIEVEMENT DATA ============

async function loadAchievementCategories(): Promise<void> {
  if (achievementCategories !== null) return;

  if (!isGameDataAvailable()) {
    achievementCategories = new Map();
    achievementToCategories = new Map();
    return;
  }

  console.error('[LocalData] Loading AchievementCategories.txt...');
  achievementCategories = new Map();

  try {
    const data = await readGameFile(join('Resources', 'Achievements', 'AchievementCategories.txt'));
    const lines = data.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 6) continue;

      const parentId = parseInt(fields[0]);
      const order = parseInt(fields[1]);
      const id = parseInt(fields[2]);
      const name = fields[3] || '';
      const description = fields[4] || '';
      if (isNaN(id)) continue;

      achievementCategories.set(id, { id, parentId, order, name, description });
    }

    console.error(`[LocalData] Loaded ${achievementCategories.size} achievement categories`);
  } catch {
    console.error('[LocalData] Could not load AchievementCategories.txt');
  }

  // Load category-to-achievement associations
  console.error('[LocalData] Loading AchievementCategoryAssociationsClient.txt...');
  achievementToCategories = new Map();

  try {
    const data = await readGameFile(join('Resources', 'Achievements', 'AchievementCategoryAssociationsClient.txt'));
    const lines = data.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 3) continue;

      const categoryId = parseInt(fields[0]);
      const achievementId = parseInt(fields[2]);
      if (isNaN(categoryId) || isNaN(achievementId)) continue;

      const existing = achievementToCategories.get(achievementId) || [];
      existing.push(categoryId);
      achievementToCategories.set(achievementId, existing);
    }

    console.error(`[LocalData] Loaded category associations for ${achievementToCategories.size} achievements`);
  } catch {
    console.error('[LocalData] Could not load AchievementCategoryAssociationsClient.txt');
  }
}

async function loadAchievementComponents(): Promise<void> {
  if (achievementComponents !== null) return;

  if (!isGameDataAvailable()) {
    achievementComponents = new Map();
    return;
  }

  console.error('[LocalData] Loading AchievementComponentsClient.txt...');
  achievementComponents = new Map();

  try {
    const data = await readGameFile(join('Resources', 'Achievements', 'AchievementComponentsClient.txt'));
    const lines = data.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 5) continue;

      const achievementId = parseInt(fields[0]);
      const componentNum = parseInt(fields[1]);
      const type = parseInt(fields[2]);
      const requirement = parseInt(fields[3]);
      const description = fields[4] || '';
      if (isNaN(achievementId)) continue;

      const component: AchievementComponent = { achievementId, componentNum, type, requirement, description };
      const existing = achievementComponents.get(achievementId) || [];
      existing.push(component);
      achievementComponents.set(achievementId, existing);
    }

    console.error(`[LocalData] Loaded components for ${achievementComponents.size} achievements`);
  } catch {
    console.error('[LocalData] Could not load AchievementComponentsClient.txt');
  }
}

// ============ GAME STRINGS PARSER (eqstr_us.txt) ============

async function loadGameStrings(): Promise<void> {
  if (gameStrings !== null) return;

  if (!isGameDataAvailable()) {
    gameStrings = new Map();
    return;
  }

  console.error('[LocalData] Loading eqstr_us.txt...');
  gameStrings = new Map();

  try {
    const data = await readGameFile('eqstr_us.txt');
    const lines = data.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;
      // Format: ID SPACE TEXT (first space separates ID from text)
      const spaceIdx = line.indexOf(' ');
      if (spaceIdx === -1) continue;

      const id = parseInt(line.substring(0, spaceIdx));
      const text = line.substring(spaceIdx + 1).trim();
      if (isNaN(id) || !text) continue;

      gameStrings.set(id, text);
    }

    console.error(`[LocalData] Loaded ${gameStrings.size} game strings`);
  } catch {
    console.error('[LocalData] Could not load eqstr_us.txt');
  }
}

// ============ OVERSEER SYSTEM PARSER ============

async function loadOverseerMinions(): Promise<void> {
  if (overseerMinions !== null) return;

  if (!isGameDataAvailable()) {
    overseerMinions = new Map();
    overseerMinionNameIndex = new Map();
    return;
  }

  // Load minion names and bios from dbstr_us.txt
  await loadDbStrings([DBSTR_TYPES.OVERSEER_MINION_SHORT, DBSTR_TYPES.OVERSEER_MINION_FULL, DBSTR_TYPES.OVERSEER_TRAIT, DBSTR_TYPES.OVERSEER_MINION_BIO]);
  const shortNames = dbStrings?.get(DBSTR_TYPES.OVERSEER_MINION_SHORT) || new Map();
  const fullNames = dbStrings?.get(DBSTR_TYPES.OVERSEER_MINION_FULL) || new Map();
  const traitNames = dbStrings?.get(DBSTR_TYPES.OVERSEER_TRAIT) || new Map();
  const bios = dbStrings?.get(DBSTR_TYPES.OVERSEER_MINION_BIO) || new Map();

  console.error('[LocalData] Loading OvrMiniClient.txt...');
  overseerMinions = new Map();
  overseerMinionNameIndex = new Map();

  try {
    const data = await readGameFile(join('Resources', 'OvrMiniClient.txt'));
    const lines = data.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 3) continue;

      const id = parseInt(fields[0]);
      const rarity = parseInt(fields[1]);
      if (isNaN(id)) continue;

      const shortName = shortNames.get(id) || `Minion ${id}`;
      const fullName = fullNames.get(id) || shortName;
      const bio = bios.get(id) || '';

      overseerMinions.set(id, { id, rarity, shortName, fullName, bio, traits: [] });

      const lowerName = fullName.toLowerCase();
      const existing = overseerMinionNameIndex!.get(lowerName) || [];
      existing.push(id);
      overseerMinionNameIndex!.set(lowerName, existing);
    }

    // Load minion traits from OvrMiniTraitClient.txt
    try {
      const traitData = await readGameFile(join('Resources', 'OvrMiniTraitClient.txt'));
      const traitLines = traitData.split('\n');

      for (const line of traitLines) {
        if (!line.trim() || line.startsWith('#')) continue;
        const fields = line.split('^');
        if (fields.length < 2) continue;

        const minionId = parseInt(fields[0]);
        const traitId = parseInt(fields[1]);
        if (isNaN(minionId) || isNaN(traitId)) continue;

        const minion = overseerMinions.get(minionId);
        const traitName = traitNames.get(traitId);
        if (minion && traitName && !minion.traits.includes(traitName)) {
          minion.traits.push(traitName);
        }
      }
    } catch {
      console.error('[LocalData] Could not load OvrMiniTraitClient.txt');
    }

    console.error(`[LocalData] Loaded ${overseerMinions.size} Overseer minions`);
  } catch {
    console.error('[LocalData] Could not load OvrMiniClient.txt');
  }
}

async function loadOverseerQuests(): Promise<void> {
  if (overseerQuests !== null) return;

  if (!isGameDataAvailable()) {
    overseerQuests = new Map();
    overseerQuestNameIndex = new Map();
    return;
  }

  // Load quest names from dbstr_us.txt
  await loadDbStrings([DBSTR_TYPES.OVERSEER_QUEST_NAME, DBSTR_TYPES.OVERSEER_QUEST_DESC]);
  const questNames = dbStrings?.get(DBSTR_TYPES.OVERSEER_QUEST_NAME) || new Map();
  const questDescs = dbStrings?.get(DBSTR_TYPES.OVERSEER_QUEST_DESC) || new Map();

  console.error('[LocalData] Loading OvrQstClient.txt...');
  overseerQuests = new Map();
  overseerQuestNameIndex = new Map();

  try {
    const data = await readGameFile(join('Resources', 'OvrQstClient.txt'));
    const lines = data.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 5) continue;

      const id = parseInt(fields[0]);
      const categoryId = parseInt(fields[1]);
      const difficulty = parseInt(fields[2]);
      const duration = parseInt(fields[3]);
      if (isNaN(id)) continue;

      const name = questNames.get(id) || '';
      if (!name) continue; // Skip quests without names (internal/system quests)

      const rawDesc = questDescs.get(id) || '';
      const description = stripHtmlTags(rawDesc.replace(/<c\s+"[^"]*">/gi, '').replace(/<\/c>/gi, ''));

      overseerQuests.set(id, { id, categoryId, name, description, difficulty, duration });

      const lowerName = name.toLowerCase();
      const existing = overseerQuestNameIndex!.get(lowerName) || [];
      existing.push(id);
      overseerQuestNameIndex!.set(lowerName, existing);
    }

    console.error(`[LocalData] Loaded ${overseerQuests.size} Overseer quests`);
  } catch {
    console.error('[LocalData] Could not load OvrQstClient.txt');
  }
}

// ============ MAP POI PARSER (On-Demand) ============

function parseMapFile(data: string): MapPOI[] {
  const lines = data.split('\n');
  const pois: MapPOI[] = [];

  for (const line of lines) {
    if (!line.startsWith('P ')) continue;
    // Format: P x, y, z, r, g, b, size, label
    const parts = line.substring(2).split(',').map(s => s.trim());
    if (parts.length < 8) continue;

    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    const z = parseFloat(parts[2]);
    const r = parseInt(parts[3]);
    const g = parseInt(parts[4]);
    const b = parseInt(parts[5]);
    // parts[6] is size
    const label = parts.slice(7).join(',').trim();

    if (!isNaN(x) && !isNaN(y) && label) {
      pois.push({ x, y, z: isNaN(z) ? 0 : z, label, r, g, b });
    }
  }

  return pois;
}

// Map directory index: shortname -> directory path
let mapDirIndex: Map<string, string> | null = null;

async function buildMapDirIndex(): Promise<void> {
  if (mapDirIndex !== null) return;
  mapDirIndex = new Map();

  const mapsDirs = [
    gamePath('maps', 'Brewall'),
    gamePath('maps'),
  ];

  for (const mapsDir of mapsDirs) {
    if (!existsSync(mapsDir)) continue;
    try {
      const files = await readdir(mapsDir);
      for (const f of files) {
        if (!f.endsWith('.txt')) continue;
        const shortName = f.replace(/(_\d+)?\.txt$/i, '').toLowerCase();
        // Prefer Brewall (first in list) - don't overwrite if already found
        if (!mapDirIndex.has(shortName)) {
          mapDirIndex.set(shortName, mapsDir);
        }
      }
    } catch {
      continue;
    }
  }
  console.error(`[LocalData] Map directory index: ${mapDirIndex.size} zones`);
}

// Try to find the zone short name from a display name
function deriveShortName(displayName: string): string[] {
  const candidates: string[] = [];
  const lower = displayName.toLowerCase();

  // Direct: remove non-alphanumeric, strip "the"
  const stripped = lower.replace(/[^a-z0-9]/g, '').replace(/^the/, '');
  candidates.push(stripped);

  // Common EQ abbreviations - order matters, more specific first
  const abbrevs: [RegExp, string][] = [
    [/^the plane of /i, 'po'],
    [/^plane of /i, 'po'],
    [/^the ruins of /i, ''],
    [/^ruins of /i, ''],
    [/^the tower of /i, 'tower'],
    [/^tower of /i, 'tower'],
    [/^the city of /i, ''],
    [/^city of /i, ''],
    [/^the temple of /i, 'temple'],
    [/^temple of /i, 'temple'],
    [/^the mines of /i, ''],
    [/^mines of /i, ''],
    [/^the crypt of /i, ''],
    [/^crypt of /i, ''],
    [/^the halls of /i, ''],
    [/^halls of /i, ''],
    [/^the caverns of /i, ''],
    [/^caverns of /i, ''],
    [/^the lair of /i, ''],
    [/^lair of /i, ''],
    [/^north /i, 'n'],
    [/^south /i, 's'],
    [/^east /i, 'e'],
    [/^west /i, 'w'],
    [/^the /i, ''],
  ];

  for (const [pattern, prefix] of abbrevs) {
    if (pattern.test(lower)) {
      const rest = lower.replace(pattern, '').replace(/[^a-z0-9]/g, '');
      candidates.push(prefix + rest);
    }
  }

  // Also try just the first significant word
  const words = lower.replace(/^the /, '').split(/\s+/);
  if (words.length > 0) {
    candidates.push(words[0].replace(/[^a-z0-9]/g, ''));
  }

  return [...new Set(candidates)];
}

async function loadMapPOIs(zoneName: string): Promise<MapPOI[]> {
  const key = zoneName.toLowerCase();
  if (mapCache.has(key)) return mapCache.get(key)!;

  if (!isGameDataAvailable()) return [];

  await buildMapDirIndex();
  if (!mapDirIndex || mapDirIndex.size === 0) {
    mapCache.set(key, []);
    return [];
  }

  // Try to find the matching map shortname
  const candidates = deriveShortName(zoneName);
  let matchedShortName: string | null = null;
  let matchedDir: string | null = null;

  // First try exact matches
  for (const candidate of candidates) {
    if (mapDirIndex.has(candidate)) {
      matchedShortName = candidate;
      matchedDir = mapDirIndex.get(candidate)!;
      break;
    }
  }

  // If no exact match, try substring matching against index
  if (!matchedShortName) {
    for (const candidate of candidates) {
      if (candidate.length < 4) continue;
      for (const [shortName, dir] of mapDirIndex) {
        if (shortName.includes(candidate) || candidate.includes(shortName)) {
          matchedShortName = shortName;
          matchedDir = dir;
          break;
        }
      }
      if (matchedShortName) break;
    }
  }

  if (!matchedShortName || !matchedDir) {
    mapCache.set(key, []);
    return [];
  }

  // Load all matching map files (including layered files _1, _2, etc.)
  const allPois: MapPOI[] = [];
  try {
    const files = await readdir(matchedDir);
    const zoneFiles = files.filter(f => {
      const base = f.replace(/(_\d+)?\.txt$/i, '').toLowerCase();
      return base === matchedShortName;
    }).sort();

    for (const zoneFile of zoneFiles) {
      const data = await readFile(join(matchedDir, zoneFile), 'utf-8');
      allPois.push(...parseMapFile(data));
    }
  } catch {
    // ignore errors
  }

  // Deduplicate POIs by label (keep first occurrence)
  const seen = new Set<string>();
  const deduped = allPois.filter(poi => {
    const labelKey = poi.label.toLowerCase();
    if (seen.has(labelKey)) return false;
    seen.add(labelKey);
    return true;
  });

  mapCache.set(key, deduped);
  return deduped;
}

// ============ PUBLIC API: SPELL FUNCTIONS ============

export async function searchLocalSpells(query: string): Promise<SearchResult[]> {
  await loadSpells();
  if (!spells || spells.size === 0) return [];

  const normalized = normalizeQuery(query).toLowerCase();
  const results: SearchResult[] = [];
  const maxResults = 25;

  // First pass: exact name match
  for (const [id, spell] of spells) {
    if (spell.name.toLowerCase() === normalized) {
      results.push({
        name: spell.name,
        type: 'spell',
        id: id.toString(),
        url: `local://spell/${id}`,
        source: 'Local Game Data',
      });
    }
  }

  // Second pass: starts-with match
  if (results.length < maxResults) {
    for (const [id, spell] of spells) {
      if (results.length >= maxResults) break;
      if (results.some(r => r.id === id.toString())) continue;
      if (spell.name.toLowerCase().startsWith(normalized)) {
        results.push({
          name: spell.name,
          type: 'spell',
          id: id.toString(),
          url: `local://spell/${id}`,
          source: 'Local Game Data',
        });
      }
    }
  }

  // Third pass: contains match
  if (results.length < maxResults) {
    for (const [id, spell] of spells) {
      if (results.length >= maxResults) break;
      if (results.some(r => r.id === id.toString())) continue;
      if (spell.name.toLowerCase().includes(normalized)) {
        results.push({
          name: spell.name,
          type: 'spell',
          id: id.toString(),
          url: `local://spell/${id}`,
          source: 'Local Game Data',
        });
      }
    }
  }

  return results;
}

export async function getLocalSpell(id: string): Promise<SpellData | null> {
  await loadSpells();
  await loadSpellStrings();
  await loadSpellDescriptions();
  if (!spells) return null;

  const spellId = parseInt(id);
  const spell = spells.get(spellId);
  if (!spell) return null;

  const data = buildLocalSpellData(spell);

  // Add spell description from dbstr_us.txt
  const desc = spellDescriptions?.get(spellId);
  if (desc) {
    data.description = desc;
  }

  // Add spell strings if available
  const strings = spellStrings?.get(spellId);
  if (strings) {
    const msgs: string[] = [];
    if (strings.castedMe) msgs.push(`You: ${strings.castedMe}`);
    if (strings.castedOther) msgs.push(`Others see: ${strings.castedOther}`);
    if (strings.spellGone) msgs.push(`Fades: ${strings.spellGone}`);
    if (msgs.length > 0) {
      data.raw = msgs.join('\n');
    }
  }

  // Add stacking info if available
  await loadSpellStacking();
  const stackInfo = spellStacking?.get(spellId);
  if (stackInfo && stackInfo.length > 0) {
    const stackEffects = stackInfo.map(s =>
      `Stacking Group ${s.stackingGroup}, Rank ${s.rank}, Type ${s.stackingType}`
    );
    data.effects = [...(data.effects || []), ...stackEffects.map(s => `[Stacking] ${s}`)];
  }

  return data;
}

export async function getLocalSpellByName(name: string): Promise<SpellData | null> {
  await loadSpells();
  if (!spells || !spellNameIndex) return null;

  const lowerName = name.toLowerCase();
  const ids = spellNameIndex.get(lowerName);
  if (ids && ids.length > 0) {
    return getLocalSpell(ids[0].toString());
  }

  // Fuzzy fallback
  for (const [key, ids] of spellNameIndex) {
    if (fuzzyMatch(name, key)) {
      return getLocalSpell(ids[0].toString());
    }
  }

  return null;
}

// ============ PUBLIC API: ZONE FUNCTIONS ============

export async function searchLocalZones(query: string): Promise<SearchResult[]> {
  await loadZones();
  if (!zones || zones.size === 0) return [];

  const normalized = normalizeQuery(query).toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, zone] of zones) {
    if (results.length >= 20) break;
    if (zone.name.toLowerCase().includes(normalized) ||
        fuzzyMatch(query, zone.name)) {
      const levelStr = zone.levelMin > 0 || zone.levelMax > 0
        ? ` (${zone.levelMin}-${zone.levelMax})`
        : '';
      results.push({
        name: zone.name,
        type: 'zone',
        id: id.toString(),
        url: `local://zone/${id}`,
        source: 'Local Game Data',
        description: `Level${levelStr}`,
      });
    }
  }

  // Sort: exact > starts-with > contains
  const lower = normalized.toLowerCase();
  results.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aExact = aName === lower ? 3 : aName.startsWith(lower) ? 2 : 1;
    const bExact = bName === lower ? 3 : bName.startsWith(lower) ? 2 : 1;
    return bExact - aExact;
  });

  return results;
}

export async function getLocalZone(id: string): Promise<ZoneData | null> {
  await loadZones();
  if (!zones) return null;

  const zoneId = parseInt(id);
  const zone = zones.get(zoneId);
  if (!zone) return null;

  const levelRange = zone.levelMin > 0 || zone.levelMax > 0
    ? `${zone.levelMin}-${zone.levelMax}`
    : undefined;

  // Try to load map POIs for this zone (pass original display name for smart matching)
  const pois = await loadMapPOIs(zone.name);

  const data: ZoneData = {
    name: zone.name,
    id: zoneId.toString(),
    source: 'Local Game Data',
    levelRange,
  };

  if (pois.length > 0) {
    data.notableLocations = pois.map(poi => ({
      name: poi.label,
      coordinates: { x: poi.x, y: poi.y, z: poi.z },
    }));
  }

  return data;
}

// ============ PUBLIC API: SKILL CAPS ============

export async function getSkillCaps(className: string, level?: number, skillName?: string): Promise<string> {
  await loadSkillCaps();
  if (!skillCaps || skillCaps.length === 0) return 'Skill cap data not available.';

  // Resolve class ID
  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  // Resolve skill ID if provided
  let targetSkillId: number | undefined;
  if (skillName) {
    const lowerSkill = skillName.toLowerCase();
    for (const [id, name] of Object.entries(SKILL_NAMES)) {
      if (name.toLowerCase() === lowerSkill || name.toLowerCase().includes(lowerSkill)) {
        targetSkillId = parseInt(id);
        break;
      }
    }
    if (targetSkillId === undefined) {
      return `Unknown skill: "${skillName}". Some skills: ${Object.values(SKILL_NAMES).slice(0, 20).join(', ')}...`;
    }
  }

  // Filter entries
  let entries = skillCaps.filter(e => e.classId === classId);
  if (targetSkillId !== undefined) {
    entries = entries.filter(e => e.skillId === targetSkillId);
  }
  if (level !== undefined) {
    entries = entries.filter(e => e.level === level);
  }

  if (entries.length === 0) {
    return `No skill cap data found for ${CLASS_IDS[classId]}${level ? ` level ${level}` : ''}${skillName ? ` ${skillName}` : ''}.`;
  }

  const lines = [`## Skill Caps: ${CLASS_IDS[classId]}${level ? ` (Level ${level})` : ''}`, ''];

  if (targetSkillId !== undefined) {
    // Show all levels for one skill
    lines.push(`### ${SKILL_NAMES[targetSkillId] || `Skill ${targetSkillId}`}`);
    lines.push('| Level | Cap |');
    lines.push('|-------|-----|');
    for (const entry of entries.sort((a, b) => a.level - b.level)) {
      if (entry.cap > 0) {
        lines.push(`| ${entry.level} | ${entry.cap} |`);
      }
    }
  } else if (level !== undefined) {
    // Show all skills for one level
    lines.push('| Skill | Cap |');
    lines.push('|-------|-----|');
    for (const entry of entries.sort((a, b) => a.skillId - b.skillId)) {
      if (entry.cap > 0) {
        const sName = SKILL_NAMES[entry.skillId] || `Skill ${entry.skillId}`;
        lines.push(`| ${sName} | ${entry.cap} |`);
      }
    }
  } else {
    // Show summary: max cap for each skill
    const skillMaxes: Record<number, number> = {};
    for (const entry of entries) {
      if (!skillMaxes[entry.skillId] || entry.cap > skillMaxes[entry.skillId]) {
        skillMaxes[entry.skillId] = entry.cap;
      }
    }

    lines.push('| Skill | Max Cap |');
    lines.push('|-------|---------|');
    for (const [sid, cap] of Object.entries(skillMaxes).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))) {
      if (cap > 0) {
        const sName = SKILL_NAMES[parseInt(sid)] || `Skill ${sid}`;
        lines.push(`| ${sName} | ${cap} |`);
      }
    }
  }

  return lines.join('\n');
}

// ============ PUBLIC API: BASE STATS ============

export async function getBaseStats(className: string, level?: number): Promise<string> {
  await loadBaseStats();
  if (!baseStats || baseStats.length === 0) return 'Base stat data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  let entries = baseStats.filter(e => e.classId === classId);
  if (level !== undefined) {
    entries = entries.filter(e => e.level === level);
  }

  if (entries.length === 0) {
    return `No base stat data found for ${CLASS_IDS[classId]}${level ? ` level ${level}` : ''}.`;
  }

  const lines = [`## Base Stats: ${CLASS_IDS[classId]}${level ? ` (Level ${level})` : ''}`, ''];

  lines.push('| Level | HP | Mana | Endurance | HP Regen | Mana Regen | End Regen |');
  lines.push('|-------|-----|------|-----------|----------|------------|-----------|');

  const displayEntries = level ? entries : entries.filter((_, i) => i % 5 === 0 || i === entries.length - 1);
  for (const e of displayEntries.sort((a, b) => a.level - b.level)) {
    lines.push(`| ${e.level} | ${e.hp} | ${e.mana} | ${e.endurance} | ${e.hpRegen.toFixed(3)} | ${e.manaRegen.toFixed(3)} | ${e.enduranceRegen.toFixed(3)} |`);
  }

  if (!level) {
    lines.push('', `*Showing every 5th level. Total entries: ${entries.length}*`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: ACHIEVEMENTS ============

export async function searchAchievements(query: string): Promise<SearchResult[]> {
  await loadAchievements();
  if (!achievements || achievements.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, ach] of achievements) {
    if (results.length >= 25) break;
    if (ach.name.toLowerCase().includes(normalized) ||
        ach.description.toLowerCase().includes(normalized)) {
      results.push({
        name: ach.name,
        type: 'quest' as const,
        id: id.toString(),
        url: `local://achievement/${id}`,
        source: 'Local Game Data',
        description: ach.description.substring(0, 100) + (ach.description.length > 100 ? '...' : ''),
      });
    }
  }

  return results;
}

export async function getAchievement(id: string): Promise<string> {
  await loadAchievements();
  await loadAchievementCategories();
  await loadAchievementComponents();
  if (!achievements) return 'Achievement data not available.';

  const achId = parseInt(id);
  const ach = achievements.get(achId);
  if (!ach) return `Achievement with ID ${id} not found.`;

  const lines = [
    `## ${ach.name}`,
    '',
    ach.description,
    '',
    `**Points:** ${ach.points}`,
  ];

  if (ach.rewardId > 0) {
    lines.push(`**Reward ID:** ${ach.rewardId}`);
  }

  // Add category path
  const categoryIds = achievementToCategories?.get(achId);
  if (categoryIds && categoryIds.length > 0 && achievementCategories) {
    const categoryPaths: string[] = [];
    for (const catId of categoryIds) {
      const parts: string[] = [];
      let current = achievementCategories.get(catId);
      while (current) {
        parts.unshift(current.name);
        current = current.parentId ? achievementCategories.get(current.parentId) : undefined;
      }
      if (parts.length > 0) categoryPaths.push(parts.join(' > '));
    }
    if (categoryPaths.length > 0) {
      lines.push(`**Category:** ${categoryPaths.join('; ')}`);
    }
  }

  // Add components/steps
  const components = achievementComponents?.get(achId);
  if (components && components.length > 0) {
    lines.push('', '### Steps');
    for (const comp of components.sort((a, b) => a.componentNum - b.componentNum)) {
      lines.push(`${comp.componentNum}. ${comp.description}`);
    }
  }

  return lines.join('\n');
}

// ============ PUBLIC API: AC MITIGATION ============

export async function getACMitigation(className: string, level?: number): Promise<string> {
  await loadACMitigation();
  if (!acMitigation || acMitigation.length === 0) return 'AC mitigation data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  let entries = acMitigation.filter(e => e.classId === classId);
  if (level !== undefined) {
    entries = entries.filter(e => e.level === level);
  }

  if (entries.length === 0) {
    return `No AC mitigation data found for ${CLASS_IDS[classId]}${level ? ` level ${level}` : ''}.`;
  }

  const lines = [
    `## AC Mitigation: ${CLASS_IDS[classId]}${level ? ` (Level ${level})` : ''}`,
    '',
    'AC Soft Cap is where AC returns diminish. Above the cap, additional AC is multiplied by the soft cap multiplier.',
    '',
    '| Level | AC Soft Cap | Soft Cap Multiplier |',
    '|-------|-------------|---------------------|',
  ];

  const displayEntries = level ? entries : entries.filter((_, i) => i % 10 === 0 || i === entries.length - 1);
  for (const e of displayEntries.sort((a, b) => a.level - b.level)) {
    lines.push(`| ${e.level} | ${e.acCap} | ${(e.softCapMultiplier * 100).toFixed(0)}% |`);
  }

  if (!level) {
    lines.push('', `*Showing every 10th level. Total entries: ${entries.length}*`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: SPELL STACKING ============

export async function getSpellStackingInfo(spellId: string): Promise<string> {
  await loadSpellStacking();
  await loadSpells();
  if (!spellStacking) return 'Spell stacking data not available.';

  const id = parseInt(spellId);
  const entries = spellStacking.get(id);
  const spell = spells?.get(id);

  if (!entries || entries.length === 0) {
    return `No stacking data found for spell ID ${spellId}${spell ? ` (${spell.name})` : ''}.`;
  }

  const lines = [
    `## Spell Stacking: ${spell?.name || `Spell ${spellId}`}`,
    '',
  ];

  for (const entry of entries) {
    // Find other spells in the same stacking group
    const groupMembers: string[] = [];
    if (spellStacking && spells) {
      for (const [sid, sEntries] of spellStacking) {
        for (const se of sEntries) {
          if (se.stackingGroup === entry.stackingGroup && sid !== id) {
            const memberSpell = spells.get(sid);
            if (memberSpell) {
              groupMembers.push(`${memberSpell.name} (Rank ${se.rank})`);
            }
          }
        }
      }
    }

    lines.push(`### Stacking Group ${entry.stackingGroup}`);
    lines.push(`- **Rank:** ${entry.rank}`);
    lines.push(`- **Type:** ${entry.stackingType}`);

    if (groupMembers.length > 0) {
      lines.push(`- **Other spells in group:** ${groupMembers.slice(0, 10).join(', ')}${groupMembers.length > 10 ? ` ... and ${groupMembers.length - 10} more` : ''}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ============ PUBLIC API: SPELLS BY CLASS ============

export async function getSpellsByClass(className: string, level?: number): Promise<string> {
  await loadSpells();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  const classIndex = classId - 1; // 0-based index into class level fields
  const matchingSpells: { id: number; name: string; level: number }[] = [];

  for (const [id, spell] of spells) {
    const classLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
    if (isNaN(classLevel) || classLevel === 255 || classLevel <= 0) continue;

    if (level !== undefined && classLevel !== level) continue;

    matchingSpells.push({ id, name: spell.name, level: classLevel });
  }

  matchingSpells.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  if (matchingSpells.length === 0) {
    return `No spells found for ${CLASS_IDS[classId]}${level ? ` at level ${level}` : ''}.`;
  }

  const lines = [
    `## ${CLASS_IDS[classId]} Spells${level ? ` (Level ${level})` : ''}`,
    `*${matchingSpells.length} spells found*`,
    '',
  ];

  if (level) {
    // Show all spells at that level
    for (const s of matchingSpells) {
      lines.push(`- **${s.name}** (ID: ${s.id})`);
    }
  } else {
    // Group by level
    let currentLevel = -1;
    let count = 0;
    for (const s of matchingSpells) {
      if (count >= 200) {
        lines.push(`\n*... and ${matchingSpells.length - count} more spells*`);
        break;
      }
      if (s.level !== currentLevel) {
        currentLevel = s.level;
        lines.push(`\n### Level ${currentLevel}`);
      }
      lines.push(`- ${s.name} (ID: ${s.id})`);
      count++;
    }
  }

  return lines.join('\n');
}

// ============ PUBLIC API: FACTIONS ============

export async function searchFactions(query: string): Promise<SearchResult[]> {
  await loadFactions();
  if (!factions || factions.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, faction] of factions) {
    if (results.length >= 25) break;
    if (faction.name.toLowerCase().includes(normalized)) {
      results.push({
        name: faction.name,
        type: 'unknown' as const,
        id: id.toString(),
        url: `local://faction/${id}`,
        source: 'Local Game Data',
        description: `Faction range: ${faction.minValue} to ${faction.maxValue}`,
      });
    }
  }

  // Sort: exact > starts-with > contains
  const lower = normalized.toLowerCase();
  results.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aScore = aName === lower ? 3 : aName.startsWith(lower) ? 2 : 1;
    const bScore = bName === lower ? 3 : bName.startsWith(lower) ? 2 : 1;
    return bScore - aScore;
  });

  return results;
}

export async function getFaction(id: string): Promise<string> {
  await loadFactions();
  if (!factions) return 'Faction data not available.';

  const factionId = parseInt(id);
  const faction = factions.get(factionId);
  if (!faction) return `Faction with ID ${id} not found.`;

  const lines = [
    `## ${faction.name}`,
    '',
    `**Faction ID:** ${faction.id}`,
    `**Value Range:** ${faction.minValue} to ${faction.maxValue}`,
    '',
    '### Faction Standing Thresholds',
    '| Standing | Min Value |',
    '|----------|-----------|',
    '| Ally | 1100+ |',
    '| Warmly | 750 to 1099 |',
    '| Kindly | 500 to 749 |',
    '| Amiable | 100 to 499 |',
    '| Indifferent | 0 to 99 |',
    '| Apprehensive | -100 to -1 |',
    '| Dubious | -500 to -101 |',
    '| Threatening | -750 to -501 |',
    '| Scowling | Below -750 |',
  ];

  return lines.join('\n');
}

// ============ PUBLIC API: AA ABILITIES ============

export async function searchAAAbilities(query: string): Promise<SearchResult[]> {
  await loadAAAbilities();
  if (!aaAbilities || aaAbilities.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  // First pass: exact name match
  for (const [id, aa] of aaAbilities) {
    if (aa.name.toLowerCase() === normalized) {
      results.push({
        name: aa.name,
        type: 'spell' as const,
        id: id.toString(),
        url: `local://aa/${id}`,
        source: 'Local Game Data',
        description: aa.description.substring(0, 100) + (aa.description.length > 100 ? '...' : ''),
      });
    }
  }

  // Second pass: starts-with and contains
  if (results.length < 25) {
    for (const [id, aa] of aaAbilities) {
      if (results.length >= 25) break;
      if (results.some(r => r.id === id.toString())) continue;
      if (aa.name.toLowerCase().startsWith(normalized) ||
          aa.name.toLowerCase().includes(normalized) ||
          aa.description.toLowerCase().includes(normalized)) {
        results.push({
          name: aa.name,
          type: 'spell' as const,
          id: id.toString(),
          url: `local://aa/${id}`,
          source: 'Local Game Data',
          description: aa.description.substring(0, 100) + (aa.description.length > 100 ? '...' : ''),
        });
      }
    }
  }

  return results;
}

export async function getAAAbility(id: string): Promise<string> {
  await loadAAAbilities();
  if (!aaAbilities) return 'AA ability data not available.';

  const aaId = parseInt(id);
  const aa = aaAbilities.get(aaId);
  if (!aa) return `AA ability with ID ${id} not found.`;

  const lines = [
    `## ${aa.name}`,
    '',
    aa.description,
  ];

  return lines.join('\n');
}

// ============ PUBLIC API: LORE/STORYLINE ============

export async function searchLore(query: string): Promise<SearchResult[]> {
  await loadLore();
  if (!loreEntries || loreEntries.length === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (let i = 0; i < loreEntries.length; i++) {
    if (results.length >= 20) break;
    const entry = loreEntries[i];
    if (entry.title.toLowerCase().includes(normalized) ||
        entry.content.toLowerCase().includes(normalized)) {
      results.push({
        name: entry.title,
        type: 'guide' as const,
        id: entry.filename,
        url: `local://lore/${entry.filename}`,
        source: 'Local Game Data',
        description: entry.content.substring(0, 120).replace(/\n/g, ' ') + '...',
      });
    }
  }

  // Sort: title matches first
  results.sort((a, b) => {
    const aTitle = a.name.toLowerCase().includes(normalized) ? 1 : 0;
    const bTitle = b.name.toLowerCase().includes(normalized) ? 1 : 0;
    return bTitle - aTitle;
  });

  return results;
}

export async function getLore(filenameOrTitle: string): Promise<string> {
  await loadLore();
  if (!loreEntries || loreEntries.length === 0) return 'Lore data not available.';

  // Try exact filename match
  let entry = loreEntries.find(e => e.filename === filenameOrTitle);

  // Try title match
  if (!entry) {
    const lower = filenameOrTitle.toLowerCase();
    entry = loreEntries.find(e => e.title.toLowerCase() === lower);
  }

  // Try partial title match
  if (!entry) {
    const lower = filenameOrTitle.toLowerCase();
    entry = loreEntries.find(e => e.title.toLowerCase().includes(lower));
  }

  if (!entry) return `Lore entry "${filenameOrTitle}" not found.`;

  return `## ${entry.title}\n\n${entry.content}`;
}

// ============ PUBLIC API: GAME STRINGS ============

export async function searchGameStrings(query: string): Promise<SearchResult[]> {
  await loadGameStrings();
  if (!gameStrings || gameStrings.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, text] of gameStrings) {
    if (results.length >= 25) break;
    if (text.toLowerCase().includes(normalized)) {
      results.push({
        name: `String ${id}`,
        type: 'unknown' as const,
        id: id.toString(),
        url: `local://gamestring/${id}`,
        source: 'Local Game Data',
        description: text.substring(0, 120) + (text.length > 120 ? '...' : ''),
      });
    }
  }

  return results;
}

export async function getGameString(id: string): Promise<string> {
  await loadGameStrings();
  if (!gameStrings) return 'Game string data not available.';

  const stringId = parseInt(id);
  const text = gameStrings.get(stringId);
  if (!text) return `Game string with ID ${id} not found.`;

  return `## Game String #${id}\n\n${text}`;
}

// ============ PUBLIC API: OVERSEER SYSTEM ============

export async function searchOverseerMinions(query: string): Promise<SearchResult[]> {
  await loadOverseerMinions();
  if (!overseerMinions || overseerMinions.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, minion] of overseerMinions) {
    if (results.length >= 25) break;
    if (minion.fullName.toLowerCase().includes(normalized) ||
        minion.shortName.toLowerCase().includes(normalized)) {
      results.push({
        name: minion.fullName,
        type: 'npc' as const,
        id: id.toString(),
        url: `local://overseer/minion/${id}`,
        source: 'Local Game Data',
        description: `${OVERSEER_RARITIES[minion.rarity] || 'Unknown'} Agent`,
      });
    }
  }

  // Sort: exact > starts-with > contains
  results.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aScore = aName === normalized ? 3 : aName.startsWith(normalized) ? 2 : 1;
    const bScore = bName === normalized ? 3 : bName.startsWith(normalized) ? 2 : 1;
    return bScore - aScore;
  });

  return results;
}

export async function getOverseerMinion(id: string): Promise<string> {
  await loadOverseerMinions();
  if (!overseerMinions) return 'Overseer minion data not available.';

  const minionId = parseInt(id);
  const minion = overseerMinions.get(minionId);
  if (!minion) return `Overseer minion with ID ${id} not found.`;

  const lines = [
    `## ${minion.fullName}`,
    '',
    `**Rarity:** ${OVERSEER_RARITIES[minion.rarity] || 'Unknown'}`,
  ];

  if (minion.traits.length > 0) {
    lines.push(`**Traits:** ${minion.traits.join(', ')}`);
  }

  if (minion.bio) {
    lines.push('', minion.bio);
  }

  return lines.join('\n');
}

export async function searchOverseerQuests(query: string): Promise<SearchResult[]> {
  await loadOverseerQuests();
  if (!overseerQuests || overseerQuests.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, quest] of overseerQuests) {
    if (results.length >= 25) break;
    if (quest.name.toLowerCase().includes(normalized) ||
        quest.description.toLowerCase().includes(normalized)) {
      results.push({
        name: quest.name,
        type: 'quest' as const,
        id: id.toString(),
        url: `local://overseer/quest/${id}`,
        source: 'Local Game Data',
        description: quest.description.substring(0, 100) + (quest.description.length > 100 ? '...' : ''),
      });
    }
  }

  return results;
}

export async function getOverseerQuest(id: string): Promise<string> {
  await loadOverseerQuests();
  if (!overseerQuests) return 'Overseer quest data not available.';

  const questId = parseInt(id);
  const quest = overseerQuests.get(questId);
  if (!quest) return `Overseer quest with ID ${id} not found.`;

  const lines = [
    `## ${quest.name}`,
    '',
    quest.description,
    '',
    `**Difficulty:** ${quest.difficulty}`,
    `**Duration:** ${quest.duration}h`,
  ];

  return lines.join('\n');
}

// ============ DATA STATUS ============

export async function getLocalDataStatus(): Promise<string> {
  const available = isGameDataAvailable();
  const lines = [
    '## Local EverQuest Game Data',
    '',
    `**Game Path:** ${EQ_GAME_PATH}`,
    `**Data Available:** ${available ? 'Yes' : 'No'}`,
    '',
  ];

  if (!available) {
    lines.push('Set the `EQ_GAME_PATH` environment variable to your EQ installation directory.');
    return lines.join('\n');
  }

  // Report loaded data
  lines.push('### Loaded Data');
  lines.push(`- **Spells:** ${spells ? spells.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Spell Strings:** ${spellStrings ? spellStrings.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Spell Descriptions:** ${spellDescriptions ? spellDescriptions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Zones:** ${zones ? zones.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Skill Caps:** ${skillCaps ? skillCaps.length.toLocaleString() + ' entries' : 'Not loaded'}`);
  lines.push(`- **Base Stats:** ${baseStats ? baseStats.length.toLocaleString() + ' entries' : 'Not loaded'}`);
  lines.push(`- **Achievements:** ${achievements ? achievements.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Factions:** ${factions ? factions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **AA Abilities:** ${aaAbilities ? aaAbilities.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Spell Stacking:** ${spellStacking ? spellStacking.size.toLocaleString() + ' spells' : 'Not loaded'}`);
  lines.push(`- **AC Mitigation:** ${acMitigation ? acMitigation.length.toLocaleString() + ' entries' : 'Not loaded'}`);
  lines.push(`- **Lore Stories:** ${loreEntries ? loreEntries.length.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Game Strings:** ${gameStrings ? gameStrings.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Overseer Minions:** ${overseerMinions ? overseerMinions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Overseer Quests:** ${overseerQuests ? overseerQuests.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Achievement Categories:** ${achievementCategories ? achievementCategories.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Achievement Components:** ${achievementComponents ? achievementComponents.size.toLocaleString() + ' achievements' : 'Not loaded'}`);
  lines.push(`- **Map Cache:** ${mapCache.size} zones loaded`);

  return lines.join('\n');
}
