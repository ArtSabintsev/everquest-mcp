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

// ============ RACE MAPPING ============

const RACE_IDS: Record<number, string> = {
  1: 'Human', 2: 'Barbarian', 3: 'Erudite', 4: 'Wood Elf',
  5: 'High Elf', 6: 'Dark Elf', 7: 'Half Elf', 8: 'Dwarf',
  9: 'Troll', 10: 'Ogre', 11: 'Halfling', 12: 'Gnome',
  128: 'Iksar', 130: 'Vah Shir', 330: 'Froglok', 522: 'Drakkin',
};

// Race-class availability (which classes each race can play)
const RACE_CLASSES: Record<number, number[]> = {
  1:   [1,2,3,4,5,6,7,8,9,11,12,13,14],       // Human
  2:   [1,9,10,15,16],                          // Barbarian
  3:   [2,3,5,11,12,13,14],                     // Erudite
  4:   [1,4,6,8,9,15],                          // Wood Elf
  5:   [2,3,12,13,14],                          // High Elf
  6:   [1,2,5,9,11,12,13,14],                   // Dark Elf
  7:   [1,3,4,6,8,9],                           // Half Elf
  8:   [1,2,3,9,16],                            // Dwarf
  9:   [1,5,10,15,16],                          // Troll
  10:  [1,5,10,15,16],                          // Ogre
  11:  [1,2,3,4,6,9],                           // Halfling
  12:  [1,2,3,5,9,11,12,13,14],                 // Gnome
  128: [1,5,7,10,11,15],                        // Iksar
  130: [1,8,9,10,15,16],                        // Vah Shir
  330: [1,2,3,5,9,11,12],                       // Froglok
  522: [1,2,3,4,5,6,7,8,9,11,12,13,14],         // Drakkin
};

// Reverse lookup: name -> ID
const CLASS_NAME_TO_ID: Record<string, number> = {};
for (const [id, name] of Object.entries(CLASS_IDS)) {
  CLASS_NAME_TO_ID[name.toLowerCase()] = parseInt(id);
}
for (const [id, short] of Object.entries(CLASS_SHORT)) {
  CLASS_NAME_TO_ID[short.toLowerCase()] = parseInt(id);
}

const RACE_NAME_TO_ID: Record<string, number> = {};
for (const [id, name] of Object.entries(RACE_IDS)) {
  RACE_NAME_TO_ID[name.toLowerCase()] = parseInt(id);
}
// Common aliases
RACE_NAME_TO_ID['de'] = 6;
RACE_NAME_TO_ID['he'] = 5;
RACE_NAME_TO_ID['we'] = 4;
RACE_NAME_TO_ID['hef'] = 7;

// Faction modifier IDs for playable races (from dbstr type 45)
const PLAYABLE_RACE_MODIFIER_IDS = new Set([
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, // Human through Gnome
  178, // Iksar
  180, // Vah Shir
  661, // Froglok (Guktan)
  1106, // Drakkin
]);

// Map playable race names to faction modifier IDs
const RACE_TO_FACTION_MODIFIER: Record<string, number> = {
  'human': 51, 'barbarian': 52, 'erudite': 53, 'wood elf': 54,
  'high elf': 55, 'dark elf': 56, 'half elf': 57, 'dwarf': 58,
  'troll': 59, 'ogre': 60, 'halfling': 61, 'gnome': 62,
  'iksar': 178, 'vah shir': 180, 'froglok': 661, 'drakkin': 1106,
  // Short aliases
  'de': 56, 'he': 55, 'we': 54, 'hef': 57,
};

// Map deity names to faction modifier IDs (from dbstr type 45)
const DEITY_TO_FACTION_MODIFIER: Record<string, number> = {
  'bertoxxulous': 201, 'brell serilis': 202, 'brell': 202,
  'cazic-thule': 203, 'cazic thule': 203, 'cazic': 203,
  'erollisi marr': 204, 'erollisi': 204,
  'bristlebane': 205, 'fizzlethorp': 205,
  'innoruuk': 206, 'karana': 207,
  'mithaniel marr': 208, 'mithaniel': 208,
  'prexus': 209, 'quellious': 210,
  'rallos zek': 211, 'rallos': 211,
  'rodcet nife': 212, 'rodcet': 212,
  'solusek ro': 213, 'solusek': 213,
  'the tribunal': 214, 'tribunal': 214,
  'tunare': 215, 'veeshan': 216,
  'agnostic': 396,
};

const DEITY_MODIFIER_IDS = new Set(Object.values(DEITY_TO_FACTION_MODIFIER));

// Race starting base stats: [STR, STA, AGI, DEX, WIS, INT, CHA]
const RACE_BASE_STATS: Record<number, number[]> = {
  1:   [75, 75, 75, 75, 75, 75, 75],       // Human
  2:   [103, 95, 82, 70, 70, 60, 55],       // Barbarian
  3:   [60, 70, 70, 70, 83, 107, 70],       // Erudite
  4:   [65, 65, 95, 80, 80, 75, 75],        // Wood Elf
  5:   [55, 65, 85, 70, 95, 92, 80],        // High Elf
  6:   [60, 65, 90, 75, 83, 99, 60],        // Dark Elf
  7:   [70, 70, 90, 85, 60, 75, 75],        // Half Elf
  8:   [90, 90, 70, 90, 83, 60, 45],        // Dwarf
  9:   [108, 109, 83, 75, 60, 52, 40],      // Troll
  10:  [130, 127, 70, 70, 67, 60, 37],      // Ogre
  11:  [70, 75, 95, 90, 80, 67, 50],        // Halfling
  12:  [60, 70, 85, 85, 67, 98, 60],        // Gnome
  128: [70, 70, 90, 85, 80, 75, 55],        // Iksar
  130: [90, 75, 90, 70, 70, 65, 65],        // Vah Shir
  330: [70, 80, 100, 100, 75, 75, 50],      // Froglok
  522: [70, 80, 85, 75, 80, 85, 75],        // Drakkin
};
const STAT_NAMES = ['STR', 'STA', 'AGI', 'DEX', 'WIS', 'INT', 'CHA'];

// Race -> starting city dbstr type 15 IDs
const RACE_STARTING_CITY_IDS: Record<number, number[]> = {
  1: [1, 382],      // Human: Qeynos, Freeport
  2: [29],           // Barbarian: Halas
  3: [23],           // Erudite: Erudin/Paineel
  4: [54],           // Wood Elf: Kelethin
  5: [61],           // High Elf: Felwithe
  6: [40],           // Dark Elf: Neriak
  7: [382, 3],       // Half Elf: Freeport, Surefall Glade
  8: [60],           // Dwarf: Kaladim
  9: [52],           // Troll: Grobb
  10: [49],          // Ogre: Oggok
  11: [19],          // Halfling: Rivervale
  12: [55],          // Gnome: Ak'Anon
  128: [82],         // Iksar: Cabilis
  130: [155],        // Vah Shir: Shar Vahl
  330: [50],         // Froglok: Gukta
  522: [394],        // Drakkin: Crescent Reach
};

// Deity data from eqstr_us.txt (IDs 3250-3266)
const DEITY_IDS: Record<number, number> = {
  3250: 0, 3251: 201, 3252: 202, 3253: 203, 3254: 206,
  3255: 207, 3256: 204, 3257: 205, 3258: 208, 3259: 209,
  3260: 210, 3261: 213, 3262: 211, 3263: 214, 3264: 215,
  3265: 216, 3266: 212,
};

// Race-deity availability
const RACE_DEITIES: Record<number, string[]> = {
  1:   ['Agnostic', 'Bertoxxulous', 'Bristlebane', 'Cazic-Thule', 'Erollisi Marr', 'Innoruuk', 'Karana', 'Mithaniel Marr', 'Prexus', 'Quellious', 'Rallos Zek', 'Rodcet Nife', 'Solusek Ro', 'The Tribunal', 'Tunare'],
  2:   ['Agnostic', 'Bristlebane', 'Rallos Zek', 'The Tribunal', 'Tunare'],
  3:   ['Agnostic', 'Bristlebane', 'Cazic-Thule', 'Prexus', 'Quellious', 'Solusek Ro'],
  4:   ['Agnostic', 'Bristlebane', 'Karana', 'Tunare'],
  5:   ['Agnostic', 'Karana', 'Mithaniel Marr', 'Tunare'],
  6:   ['Agnostic', 'Cazic-Thule', 'Innoruuk', 'Solusek Ro'],
  7:   ['Agnostic', 'Bristlebane', 'Karana', 'Tunare'],
  8:   ['Agnostic', 'Bertoxxulous', 'Brell Serilis', 'Bristlebane', 'Innoruuk', 'The Tribunal', 'Tunare'],
  9:   ['Agnostic', 'Cazic-Thule', 'Innoruuk', 'Rallos Zek'],
  10:  ['Agnostic', 'Cazic-Thule', 'Rallos Zek'],
  11:  ['Agnostic', 'Brell Serilis', 'Bristlebane', 'Karana'],
  12:  ['Agnostic', 'Bertoxxulous', 'Brell Serilis', 'Bristlebane', 'Solusek Ro'],
  128: ['Cazic-Thule'],
  130: ['Agnostic', 'The Tribunal'],
  330: ['Mithaniel Marr'],
  522: ['Agnostic', 'Bertoxxulous', 'Bristlebane', 'Cazic-Thule', 'Erollisi Marr', 'Innoruuk', 'Karana', 'Mithaniel Marr', 'Prexus', 'Quellious', 'Rallos Zek', 'Rodcet Nife', 'Solusek Ro', 'The Tribunal', 'Tunare', 'Veeshan'],
};

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
  RECOURSE: 81,     // Recourse spell ID (spell cast on caster when landing on target)
  CATEGORY: 87,     // Spell category ID (maps to dbstr type 5)
  SUBCATEGORY: 88,  // Spell subcategory ID (maps to dbstr type 5)
  ENDURANCE: 96,    // Endurance cost (melee/hybrid combat abilities)
  TIMER_ID: 97,     // Reuse timer group (0 = default spell gem, >0 = shared timer)
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
  14: 'Water Breathing', 15: 'Mana', 16: 'NPC Enchant Immunity',
  17: 'Food/Water', 18: 'Pacify', 19: 'Faction',
  20: 'Blind', 21: 'Stun', 22: 'Charm', 23: 'Fear', 24: 'Stamina/Endurance',
  25: 'Bind Affinity', 26: 'Gate', 27: 'NPC Frenzy',
  28: 'Ultravision', 29: 'Infravision', 30: 'Identify',
  31: 'Snare', 32: 'Summon Item', 33: 'Summon Pet', 34: 'HP Regen',
  35: 'Mana Regen', 36: 'Dispel Magic', 37: 'NPC Buff',
  38: 'Shadow Step', 39: 'Berserk', 40: 'Lycanthropy',
  41: 'Vampirism', 42: 'Fire Resist (Mirrored)', 43: 'Transport',
  44: 'Antigate', 45: 'Summon BST Pet',
  46: 'Fire Resist', 47: 'Cold Resist',
  48: 'Poison Resist', 49: 'Disease Resist', 50: 'Magic Resist',
  51: 'Detect Undead', 52: 'Detect Summoned', 53: 'Detect Animals',
  54: 'Stoneskin', 55: 'Damage Absorb', 56: 'True North',
  57: 'Levitate', 58: 'Spin Stun', 59: 'Infravision',
  60: 'Undead Spell Resist', 61: 'Summoned Spell Resist',
  62: 'Animal Spell Resist', 63: 'Absorb Magic Damage',
  64: 'Sense Traps', 65: 'Disarm Traps', 66: 'Divination',
  67: 'Destroy Undead', 68: 'Feign Death',
  69: 'Max HP', 70: 'NPC Cannotmiss', 71: 'Gate',
  72: 'Summon Skeleton Pet', 73: 'Bind Sight', 74: 'Mesmerize',
  75: 'NPC Target', 76: 'Calm', 77: 'Dispel Detrimental',
  78: 'Shadowstep', 79: 'HP Limit',
  80: 'Resurrection', 81: 'Summon Player', 82: 'Teleport Zone',
  83: 'Throw Skill', 84: 'Restrict Spell School',
  85: 'Spell Proc', 86: 'Illusion', 87: 'Damage Shield',
  88: 'Transfer Mana', 89: 'Add Reverse DS',
  90: 'Spell Casting Level', 91: 'Summon Corpse',
  92: 'Adjust Aggro', 93: 'Resist Adj', 94: 'Spin Target',
  95: 'Amnesia', 96: 'Intoxication', 97: 'Spell Shield',
  98: 'Reduce Target HP %', 99: 'Mental Stamina',
  100: 'Teleport', 101: 'HP Change', 102: 'Stacking: Command',
  103: 'Stacking: Overwrite', 104: 'Max HP Change',
  105: 'Pet Shield', 106: 'Max Mana Change', 107: 'Endurance',
  108: 'Endurance Regen', 109: 'Familiarize', 110: 'Add Stun Resist',
  111: 'Reverse Damage Shield', 112: 'Screech', 113: 'Improved Spell Range',
  114: 'Aggro', 115: 'Mana/HP Return', 116: 'Curse',
  117: 'Make Vulnerable', 118: 'Timer Lockout',
  119: 'Melee Proc', 120: 'Range Proc', 121: 'Illusion: Other',
  122: 'Mass Group Buff', 123: 'Group Fear Immunity', 124: 'Rampage',
  125: 'AE Taunt', 126: 'Flesh to Bone', 127: 'Spell Haste',
  128: 'Spell Duration Increase', 129: 'Spell Duration Decrease',
  130: 'Strikethrough', 131: 'Stun Resist',
  132: 'Mitigate Melee Damage', 133: 'Mitigate Spell Damage',
  134: 'Shielding', 135: 'Revenge Spell', 136: 'Skill Damage',
  137: 'Endurance Regen', 138: 'Taunt', 139: 'Proc Rate Modifier',
  140: 'Twincast Chance', 141: 'NPC Assist Radius',
  142: 'Melee AE Range', 143: 'NPC Maxrange', 144: 'HP Regen Per Tick',
  145: 'Cure Corruption', 146: 'Corruption Resist',
  147: 'Slow', 148: 'Stacking Block', 149: 'Strip Buffs',
  150: 'Song DoT', 151: 'Song DoT2', 152: 'Shielding Duration',
  153: 'Shrink', 154: 'Gate Disabled',
  158: 'Hate', 159: 'Weather Control', 160: 'Fragile',
  161: 'Sacrifice', 162: 'Silence', 163: 'Max Mana',
  164: 'Bard AE DoT', 165: 'Max Endurance',
  167: 'Pet Haste', 168: 'Decrease Chance to Land',
  169: 'Crit HoT', 170: 'Absorb Rune', 171: 'AC Soft Cap',
  172: 'Corruption', 173: 'Primary Melee Double',
  174: 'Skill Damage Mod', 175: 'Skill Damage Mod2',
  176: 'Parry Chance', 177: 'Dodge Chance', 178: 'Riposte Chance',
  179: 'Absorb Damage', 180: 'Pet Crit Melee', 181: 'Pet Crit Spell',
  182: 'Pet Max HP', 183: 'Pet Avoidance', 184: 'Accuracy',
  185: 'Headshot', 186: 'Pet Crit Melee2', 187: 'Slay Undead',
  188: 'Increase Skill Damage', 189: 'Double Riposte',
  190: 'AE Stun Resist', 191: 'Stun Resist',
  192: 'Frontal Backstab Chance', 193: 'Chaotic Stab',
  194: 'Shield Block Chance', 195: 'Shroud of Stealth',
  196: 'Extended Pet Duration', 197: 'Pet Power Increase',
  198: 'Backstab from Front', 199: 'Chaotic Stab',
  200: 'Spell Crit Chance', 201: 'Shield Bash Stun',
  202: 'Melee Crit Chance', 203: 'Spell Crit Damage',
  204: 'Dodge Chance', 205: 'Mend Companion',
  206: 'Doppelganger', 207: 'Archery Damage Mod',
  208: 'Offhand Damage Mod', 209: 'Pet Melee Crit Damage',
  210: 'Triple Backstab', 211: 'Combat Stability',
  212: 'Add Singing Mod', 213: 'Song Mod Cap',
  214: 'Increase Trap Count', 215: 'Change Padder',
  216: 'Increase Archery', 217: 'Increase Singing',
  218: 'DoT Damage', 219: 'Heal Amount', 220: 'Heal Amount2',
  221: 'Nuke Damage', 222: 'All Avoidance',
  225: 'Pet Discipline', 226: 'Limit: Detrimental',
  227: 'Limit: Beneficial', 228: 'Limit: Spell Type',
  229: 'Limit: Min Mana', 230: 'Limit: Spell Class',
  231: 'Limit: Spell Subclass', 232: 'Limit: Combat Skills',
  233: 'Limit: Non-Combat Skills',
  250: 'Increase Damage', 251: 'Manaburn', 252: 'Endurance Burn',
  253: 'Limit: Spell Group',
  254: 'Placeholder',
  255: 'Triple Attack', 256: 'Spell Proc',
  258: 'Sympathetic Proc', 259: 'Raise Stats Cap',
  260: 'Reduce Timer Special', 261: 'No Break AE Sneak',
  262: 'Spell Slots', 263: 'Buff Slots', 264: 'Max Negative HP',
  265: 'DeathSave', 266: 'HP Regen from Spells',
  267: 'Mana Regen from Spells', 268: 'Endurance Regen from Spells',
  269: 'Max HP Mod', 270: 'Max Mana Mod',
  271: 'Max Endurance Mod', 272: 'AC vs Type',
  273: 'Max HP', 274: 'Max Mana', 275: 'Max Endurance',
  276: 'Pet Flurry', 277: 'Pet Crit', 278: 'Shield Specialist',
  279: 'Accuracy Mod', 280: 'Headshot Damage', 281: 'Assassinate Damage',
  282: 'Finishing Blow Damage',
  286: 'Limit: Min Level', 287: 'Limit: Max Level',
  288: 'Limit: Cast Time', 289: 'Improved Spell Effect',
  290: 'Limit: Spell', 291: 'Limit: Min Duration', 292: 'Limit: Effect',
  293: 'Limit: Combat Skills', 294: 'Limit: Target',
  295: 'Limit: Mana Min', 296: 'Limit: Mana Max',
  297: 'Skill Attack', 298: 'Skill Accuracy Mod',
  299: 'Change Height', 300: 'Wakethe Dead', 301: 'Doppelganger',
  302: 'Archery Damage', 303: 'Secondary Bash',
  304: 'Spell Damage Shield', 305: 'Reduce Weight', 306: 'Alchemist Mastery',
  307: 'Block Behind', 308: 'Double Melee Round',
  309: 'Limit: Mana Max', 310: 'Limit: Mana Min',
  311: 'Limit: Max Level', 312: 'Limit: Resist Min',
  313: 'Limit: Resist Max', 314: 'Cast if Cursed',
  315: 'Cast if Cured', 316: 'Summon All Corpses',
  317: 'Block DS', 318: 'Overheal', 319: 'Focus Pet',
  320: 'AE Melee', 321: 'Frenzied Devastation',
  322: 'Pet HP %', 323: 'Change Target', 324: 'AE Rampage',
  325: 'AE Flurry', 326: 'Pet Flurry',
  327: 'DS Mitigation', 328: 'Melee Damage Amt',
  329: 'Auto Attack', 330: 'Wake the Dead',
  331: 'Doppelganger', 332: 'Increase Range DS',
  333: 'Fake Death', 334: 'Improved Rune',
  335: 'Max HP Increase', 336: 'Max Mana Increase',
  337: 'Stun Resist', 338: 'Strikethrough2',
  339: 'Trigger Spell', 340: 'Trigger Spell (Proc)',
  341: 'Crit DoT Damage', 342: 'Crit Heal', 343: 'Crit HoT',
  344: 'Crit Mend', 345: 'Dual Wield', 346: 'Double Attack',
  347: 'Lifetap from Weapon', 348: 'Instrument Mod',
  349: 'Resist All', 350: 'Cast on Fade',
  351: 'Base Damage Adj', 352: 'Limit: HP Min',
  353: 'HP Change per Tick', 354: 'Skill Specialization',
  355: 'Incoming Damage Mod', 356: 'Worn Regen',
  357: 'Ban Trade', 358: 'Song Range', 359: 'Reduce Skill Timer',
  360: 'Song AOE', 361: 'Reduce Combat Skill Timer',
  362: 'Limit: Resist', 363: 'Limit: No Focus',
  364: 'Cast if Twincast', 365: 'AE Hate',
  366: 'Spell Hate', 367: 'Worn Endurance Regen',
  368: 'Limit: Min Cast Time', 369: 'Limit: No Detrimental',
  370: 'Worn Purity', 371: 'Bodily Inhibition',
  372: 'Crit Melee Damage', 373: 'Crit Spell Damage',
  374: 'Critical Heal Chance', 375: 'Critical Heal Amount',
  376: 'Crit HoT Chance', 377: 'Crit HoT Amount',
  378: 'Melee Crit Guard', 379: 'Spell Crit Guard',
  380: 'Melee Flurry', 381: 'Spell PB AE',
  382: 'Trigger on Crit', 383: 'Crit Melee2',
  384: 'Crit Spell2', 385: 'Flurry Chance',
  386: 'Pet Flurry Chance', 387: 'Limit: Beneficial',
  388: 'Improved Binding', 389: 'Feign Death Chance',
  390: 'Limit: Detrimental', 391: 'Limit: Spell',
  392: 'Limit: Target Type',
  399: 'Worn HP Regen Cap', 400: 'Worn Mana Regen Cap',
  401: 'Limit: Pet', 402: 'Skill Min Damage Mod',
  403: 'Heal Rate', 404: 'Mana Drain',
  405: 'Endurance Drain', 406: 'Limit: Class',
  407: 'Limit: Race', 408: 'Base Damage',
  409: 'Limit: Skill', 410: 'Limit: Item Class',
  411: 'AC2', 412: 'Mana2', 413: 'Spell Damage',
  414: 'Increase Healing', 415: 'Reverse DS Guard',
  416: 'DoT Guard', 417: 'Melee Threshold Guard',
  418: 'Spell Threshold Guard', 419: 'Trigger Spell on Kill',
  420: 'Trigger Spell on Death', 421: 'Potion Belt Slots',
  422: 'Bandolier Slots', 423: 'Triple Attack Chance',
  424: 'Worn Attack Cap', 425: 'Group Shielding',
  426: 'Trade Skill Mastery', 427: 'Reduce AA Timer',
  428: 'No Fizzle', 429: 'Add Procs',
  430: '2H Bash', 431: 'Reduce Falling Damage',
  432: 'Cast on Fly', 433: 'Add Extended Target Slots',
  434: 'Skill Base Damage Mod', 435: 'Limit: Skill',
  436: 'Limit: Item Type', 437: 'Spell Damage Resist',
  438: 'Shadow Knight Fear', 439: 'Fade',
  440: 'Stun Resist', 441: 'Strikethrough3',
  442: 'Skill Min Damage2', 443: 'Limit: HP %',
  444: 'Limit: Mana %', 445: 'Limit: Endurance %',
  446: 'Limit: Class2', 447: 'Limit: Race2',
  448: 'Limit: Caster Class', 449: 'Limit: Same Caster',
  450: 'Extend Tradeskill Cap', 451: 'Pushback',
  452: 'Luck Chance', 453: 'Luck Amount',
  454: 'Endurance Absorb', 455: 'Limit: SpellGroup',
  456: 'Doom on Fade', 457: 'No Remove',
  458: 'Spell Proc Guard', 459: 'Melee Proc Guard',
  460: 'Pet Power', 461: 'HP Absorb % Max',
  462: 'HP Absorb Total', 463: 'Melee Threshold',
  464: 'Spell Threshold', 465: 'Triple Backstab',
  466: 'Combat Agility', 467: 'Combat Stability',
  468: 'Worn Attack', 469: 'Mana Absorb',
  470: 'Endurance Absorb', 471: 'DoT Crit Chance',
  472: 'Heal Crit Chance', 473: 'Mend Crit Chance',
  474: 'Dual Wield Chance', 475: 'Double Attack Chance',
  476: 'Limit: Min Level', 477: 'Limit: Max Level',
  478: 'Limit: Min Cast Time', 479: 'Limit: Max Cast Time',
  480: 'Limit: Min Mana', 481: 'Limit: Max Mana',
  482: 'Limit: Spell Type', 483: 'Limit: Cast Time Max',
  484: 'Limit: Cast Time Min', 485: 'Improved Taunt',
  486: 'Add Melee Proc', 487: 'Add Range Proc',
  488: 'Illusion: Other', 489: 'Mass Group Buff',
  490: 'Group Stun Resist', 491: 'Rampage2',
  492: 'AE Taunt2', 493: 'Flesh to Bone2',
  494: 'HP/Tick', 495: 'Mana/Tick', 496: 'Endurance/Tick',
  497: 'Hate Mod', 498: 'Chance Best in Spell Group',
  499: 'Trigger Best in Spell Group',
  500: 'AC Limit', 501: 'Mana Limit', 502: 'HP Limit',
  503: 'Endurance Limit', 504: 'Add Hate %',
  505: 'Spell Damage Shield Amt', 506: 'Manaburn2',
  507: 'Overshadow', 508: 'Doom Dispeller',
  509: 'Doom Melee', 510: 'Doom Spell',
  511: 'Add Body Type', 512: 'Faction Mod',
  513: 'Corruption Resist', 514: 'Corruption Damage',
  515: 'Melee Delay', 516: 'Foraging',
  517: 'Doom Entity', 518: 'Limit: Combat Skills',
  519: 'Sanctuary', 520: 'DoT Damage Mod',
  521: 'Nuke Damage Mod',
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
  hidden: boolean;
  locked: boolean;
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
  category?: string;       // Expansion/category name
  startingValues?: { modifierId: number; value: number }[]; // Race/class starting faction adjustments
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
  traitIds: number[];
  jobs: { jobTypeId: number; level: number }[];
}

interface OverseerSlotDetail {
  slotId: number;
  jobTypeId: number;
  isRequired: boolean;
  bonusTraitIds: number[];
}

interface OverseerQuest {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  difficulty: number;
  duration: number;
  requiredSlots: number;
  optionalSlots: number;
  slotDetails: OverseerSlotDetail[];
}

interface MercenaryEntry {
  id: number;
  tier: string;
  description: string;
  race: string;
  type: string;
  confidence: string;
  proficiency: string;
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
let spellGroupNames: Map<number, string> | null = null;
let bonusDescriptions: Map<number, string> | null = null;
let augmentGroups: Map<number, string> | null = null;
let acMitigation: ACMitigationEntry[] | null = null;
let spellRequirements: Map<number, { subId: number; reqId: number; failureStringId: number }[]> | null = null;
let mapCache: Map<string, MapPOI[]> = new Map();

// dbstr_us.txt parsed data
let dbStrings: Map<number, Map<number, string>> | null = null; // type -> id -> text
let factions: Map<number, FactionEntry> | null = null;
let factionNameIndex: Map<string, number[]> | null = null;
let factionCategories: Map<number, string> | null = null; // categoryId -> name (expansion)
let factionModifierNames: Map<number, string> | null = null; // modifierId -> name (Race: Human, etc.)
let aaAbilities: Map<number, AAEntry> | null = null;
let aaNameIndex: Map<string, number[]> | null = null;
let spellDescriptions: Map<number, string> | null = null;
let spellCategories: Map<number, string> | null = null;

// Lore/Storyline data
let loreEntries: LoreEntry[] | null = null;
let loreNameIndex: Map<string, number> | null = null; // lowercase title -> index in loreEntries

// Enhanced achievement data
let achievementCategories: Map<number, AchievementCategory> | null = null;
let achievementToCategories: Map<number, number[]> | null = null; // achievementId -> categoryIds
let categoryToAchievements: Map<number, number[]> | null = null; // categoryId -> achievementIds
let achievementComponents: Map<number, AchievementComponent[]> | null = null;

// Game strings (eqstr_us.txt)
let gameStrings: Map<number, string> | null = null;

// Overseer system
let overseerMinions: Map<number, OverseerMinion> | null = null;
let overseerMinionNameIndex: Map<string, number[]> | null = null;
let overseerQuests: Map<number, OverseerQuest> | null = null;
let overseerQuestNameIndex: Map<string, number[]> | null = null;

// Combat abilities / disciplines
let combatAbilities: Map<number, string> | null = null;
let combatAbilityNameIndex: Map<string, number[]> | null = null;

// Item effect descriptions (click/proc)
let itemEffectDescs: Map<number, string> | null = null;
let itemEffectIndex: Map<string, number[]> | null = null;

// Banner/campsite categories
let bannerCategories: Map<number, string> | null = null;
let campsiteCategories: Map<number, string> | null = null;

// Expansion names
let expansionNames: Map<number, string> | null = null;

// Game events (What's New system)
let gameEvents: Map<number, { banner: string; description: string }> | null = null;
let gameEventIndex: Map<string, number[]> | null = null;

// Mercenaries
let mercenaries: Map<number, MercenaryEntry> | null = null;
let mercenaryNameIndex: Map<string, number[]> | null = null;

// Mercenary stances and abilities
interface MercenaryStance {
  id: number;
  name: string;
  description: string;
  shortDesc: string;
}
interface MercenaryAbility {
  id: number;
  name: string;
  description: string;
}
let mercenaryStances: Map<number, MercenaryStance> | null = null;
let mercenaryTypes: Map<number, string> | null = null;
let mercenaryAbilities: Map<number, MercenaryAbility> | null = null;

// Race/class descriptions
let raceDescriptions: Map<number, { short: string; long: string }> | null = null;
let classDescriptions: Map<number, { short: string; long: string }> | null = null;
let statDescriptions: Map<string, string> | null = null;
let deityNames: Map<number, string> | null = null;
let deityDescriptions: Map<number, string> | null = null;

// Alternate currencies
let altCurrencies: Map<number, { name: string; description: string }> | null = null;

// Tributes
interface TributeEntry {
  id: number;
  name: string;
  description: string;
  isGuild: boolean;
}
let tributes: Map<number, TributeEntry> | null = null;
let tributeNameIndex: Map<string, number[]> | null = null;

// Overseer category/difficulty/incapacitation/trait/job names
let overseerCategories: Map<number, string> | null = null;
let overseerDifficulties: Map<number, string> | null = null;
let overseerTraitDescs: Map<number, string> | null = null;
let overseerIncapNames: Map<number, string> | null = null;
let overseerIncapDescs: Map<number, string> | null = null;
let overseerJobNames: Map<number, string> | null = null;
let overseerArchetypeNames: Map<number, string> | null = null;

// Creature race types (NPC/monster race names)
let creatureTypes: Map<number, string> | null = null;
let creatureTypeIndex: Map<string, number[]> | null = null;

// Starting city lore descriptions
let startingCityLore: Map<number, string> | null = null;

// Overseer job class descriptions
let overseerJobClassDescs: Map<number, string> | null = null;

// Overseer incapacitation durations: entry ID -> { jobType, duration in seconds }
let overseerIncapDurations: Map<number, { jobType: number; duration: number }> | null = null;

// Drakkin heritage data
interface DrakkinHeritage {
  id: number;
  name: string;
  classes: number[];
}
let drakkinHeritages: DrakkinHeritage[] | null = null;

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

function formatEffectValue(base1: number, suffix: string = ''): string {
  if (base1 > 0) return ` +${base1}${suffix}`;
  return ` ${base1}${suffix}`;
}

function resolveSpellDescription(desc: string, fields: string[], duration?: string): string {
  let resolved = desc;

  // Replace %z with duration
  if (duration) {
    resolved = resolved.replace(/%z/g, duration);
  }

  // Replace #N (base value of slot N) and @N (max value of slot N)
  // Effect data is in the last pipe-delimited field
  for (let i = fields.length - 1; i >= 0; i--) {
    if (fields[i].includes('|')) {
      const slots = fields[i].split('$');
      for (const slot of slots) {
        const parts = slot.split('|');
        if (parts.length >= 3) {
          const slotNum = parseInt(parts[0]);
          const base1 = parseInt(parts[2]);
          const max = parts.length > 4 ? parseInt(parts[4]) : 0;
          if (!isNaN(slotNum) && !isNaN(base1)) {
            const absBase = Math.abs(base1);
            resolved = resolved.replace(new RegExp(`#${slotNum}`, 'g'), absBase.toString());
            if (!isNaN(max) && max !== 0) {
              resolved = resolved.replace(new RegExp(`@${slotNum}`, 'g'), Math.abs(max).toString());
            }
          }
        }
      }
      break;
    }
  }

  return resolved;
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

          // HP effects (heal, nuke, limit)
          if (spa === 0 || spa === 79 || spa === 101 || spa === 502) {
            desc += formatEffectValue(base1);
            if (max > 0) desc += ` (max: ${max})`;
          }
          // Percentage-based effects
          else if (spa === 3 || spa === 31 || spa === 11 || spa === 130 ||
                   spa === 140 || spa === 173 || spa === 200 || spa === 202 ||
                   spa === 203 || spa === 218 || spa === 219 || spa === 220 ||
                   spa === 221 || spa === 250 || spa === 255 || spa === 345 ||
                   spa === 346 || spa === 372 || spa === 373 || spa === 374 ||
                   spa === 375 || spa === 376 || spa === 377 || spa === 380 ||
                   spa === 385 || spa === 386 || spa === 403 || spa === 423 ||
                   spa === 452 || spa === 471 || spa === 472 || spa === 474 ||
                   spa === 475 || spa === 520 || spa === 521) {
            desc += ` ${base1}%`;
            if (max > 0) desc += ` (max: ${max})`;
          }
          // Stat effects (STR, DEX, AGI, STA, INT, WIS, CHA, AC, ATK)
          else if ((spa >= 4 && spa <= 10) || spa === 1 || spa === 2) {
            desc += formatEffectValue(base1);
          }
          // Resist effects (fire, cold, poison, disease, magic, corruption)
          else if ((spa >= 46 && spa <= 50) || spa === 146 || spa === 349) {
            desc += formatEffectValue(base1);
          }
          // Regen/tick effects
          else if (spa === 34 || spa === 35 || spa === 108 || spa === 137 ||
                   spa === 144 || spa === 353 || spa === 494 || spa === 495 ||
                   spa === 496) {
            desc += ` ${base1}/tick`;
          }
          // Max stat effects
          else if (spa === 69 || spa === 106 || spa === 163 || spa === 165 ||
                   spa === 269 || spa === 270 || spa === 271 || spa === 273 ||
                   spa === 274 || spa === 275 || spa === 335 || spa === 336) {
            desc += formatEffectValue(base1);
          }
          // Duration-based effects
          else if (spa === 127 || spa === 128 || spa === 129) {
            desc += ` ${base1}%`;
          }
          // Illusion
          else if (spa === 86) {
            desc += `: ${base1}`;
          }
          // Damage shield
          else if (spa === 87 || spa === 111) {
            desc += ` ${base1}`;
          }
          // Summon item
          else if (spa === 32) {
            desc += ` (item ID: ${base1})`;
          }
          // Spell trigger/proc
          else if (spa === 85 || spa === 289 || spa === 339 || spa === 340 ||
                   spa === 350 || spa === 419 || spa === 420) {
            const refSpell = spells?.get(base1);
            desc += refSpell ? ` → ${refSpell.name} [${base1}]` : ` (spell ID: ${base1})`;
            if (base2 > 0) desc += ` (${base2}% chance)`;
          }
          // Melee/range procs
          else if (spa === 119 || spa === 120) {
            const refSpell = spells?.get(base1);
            desc += refSpell ? ` → ${refSpell.name} [${base1}]` : ` (spell ID: ${base1})`;
            if (base2 > 0) desc += ` +${base2} rate mod`;
          }
          // Damage mitigation
          else if (spa === 132 || spa === 133 || spa === 327 ||
                   spa === 461 || spa === 462 || spa === 463 || spa === 464) {
            desc += formatEffectValue(base1);
            if (max > 0) desc += ` (max: ${max})`;
          }
          // Aggro
          else if (spa === 114 || spa === 92 || spa === 158 || spa === 365 ||
                   spa === 366 || spa === 497 || spa === 504) {
            desc += formatEffectValue(base1);
          }
          // Skill damage
          else if (spa === 136 || spa === 174 || spa === 175 || spa === 188 ||
                   spa === 297 || spa === 328 || spa === 434) {
            desc += formatEffectValue(base1);
            if (base2 > 0) {
              const skillName = SKILL_NAMES[base2] || `Skill ${base2}`;
              desc += ` (${skillName})`;
            }
          }
          // Absorb effects
          else if (spa === 55 || spa === 54 || spa === 170 || spa === 179) {
            desc += ` ${base1}`;
            if (max > 0) desc += ` (max: ${max})`;
          }
          // Stacking/limit effects - show value
          else if (spa === 148 || spa === 102 || spa === 103) {
            desc += ` (${base1})`;
          }
          // Limit SPAs - show the limit value
          else if (spaName.startsWith('Limit:')) {
            desc += ` ${base1}`;
          }
          // Default: show numeric value if non-zero
          else if (base1 !== 0) {
            desc += formatEffectValue(base1);
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

  const endurance = parseInt(f[SF.ENDURANCE]);
  if (!isNaN(endurance) && endurance > 0) spellData.endurance = endurance;

  if (!isNaN(castTime) && castTime > 0) {
    spellData.castTime = `${(castTime / 1000).toFixed(1)}s`;
  }

  if (!isNaN(recoveryTime) && recoveryTime > 0) {
    spellData.recoveryTime = `${(recoveryTime / 1000).toFixed(1)}s`;
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

  if (!isNaN(aeRange) && aeRange > 0) {
    spellData.aeRange = `${aeRange}`;
  }

  if (!isNaN(targetType)) {
    spellData.target = TARGET_TYPES[targetType] || `Type ${targetType}`;
  }

  if (!isNaN(resistType) && resistType > 0) {
    spellData.resist = RESIST_TYPES[resistType] || `Type ${resistType}`;
  }

  spellData.beneficial = beneficial;

  const pushBack = parseInt(f[SF.PUSH_BACK]);
  const pushUp = parseInt(f[SF.PUSH_UP]);
  if (!isNaN(pushBack) && pushBack > 0) spellData.pushBack = pushBack;
  if (!isNaN(pushUp) && pushUp > 0) spellData.pushUp = pushUp;

  // Reuse timer group
  const timerId = parseInt(f[SF.TIMER_ID]);
  if (!isNaN(timerId) && timerId > 0) spellData.timerId = timerId;

  // Spell category/subcategory
  const catId = parseInt(f[SF.CATEGORY]);
  const subCatId = parseInt(f[SF.SUBCATEGORY]);
  if (!isNaN(catId) && catId > 0 && spellCategories) {
    spellData.category = spellCategories.get(catId) || undefined;
  }
  if (!isNaN(subCatId) && subCatId > 0 && subCatId !== catId && spellCategories) {
    spellData.subcategory = spellCategories.get(subCatId) || undefined;
  }

  // Recourse spell (cast on caster when spell lands on target)
  const recourseId = parseInt(f[SF.RECOURSE]);
  if (!isNaN(recourseId) && recourseId > 0 && recourseId !== parseInt(f[SF.ID])) {
    spellData.recourseId = recourseId;
    const recourseSpell = spells?.get(recourseId);
    if (recourseSpell) {
      spellData.recourseName = recourseSpell.name;
    }
  }

  // Teleport zone (for teleport/translocate spells; filter out pet model names)
  const teleportZone = f[SF.TELEPORT_ZONE]?.trim();
  if (teleportZone && /^[a-z_]+[a-z0-9_]*$/.test(teleportZone)) {
    spellData.teleportZone = teleportZone;
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
    const hidden = fields[5] === '1';
    const locked = fields[6] === '1';
    if (isNaN(id) || !name) continue;

    achievements.set(id, { id, name, description, rewardId, points, hidden, locked });

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

  // Load spell group names from dbstr
  await loadDbStrings([DBSTR_TYPES.SPELL_GROUP_NAME]);
  spellGroupNames = dbStrings?.get(DBSTR_TYPES.SPELL_GROUP_NAME) || new Map();
  console.error(`[LocalData] Loaded ${spellGroupNames.size} spell group names`);
}

async function loadBonusAndAugmentData(): Promise<void> {
  if (bonusDescriptions !== null) return;

  bonusDescriptions = new Map();
  augmentGroups = new Map();
  if (!isGameDataAvailable()) return;

  await loadDbStrings([DBSTR_TYPES.BONUS_DESCRIPTION, DBSTR_TYPES.AUGMENT_GROUP]);
  const bonuses = dbStrings?.get(DBSTR_TYPES.BONUS_DESCRIPTION) || new Map();
  const augs = dbStrings?.get(DBSTR_TYPES.AUGMENT_GROUP) || new Map();

  for (const [id, desc] of bonuses) bonusDescriptions.set(id, desc);
  for (const [id, name] of augs) augmentGroups.set(id, name);

  console.error(`[LocalData] Loaded ${bonusDescriptions.size} bonus descriptions, ${augmentGroups.size} augment groups`);
}

// ============ ITEM EFFECT DESCRIPTION LOADER ============

async function loadItemEffects(): Promise<void> {
  if (itemEffectDescs !== null) return;

  itemEffectDescs = new Map();
  itemEffectIndex = new Map();
  if (!isGameDataAvailable()) return;

  await loadDbStrings([DBSTR_TYPES.ITEM_EFFECT_DESC]);
  const descs = dbStrings?.get(DBSTR_TYPES.ITEM_EFFECT_DESC) || new Map();

  for (const [id, rawDesc] of descs) {
    const desc = stripHtmlTags(rawDesc);
    itemEffectDescs.set(id, desc);

    // Build word index for searching
    const words = desc.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word.length < 3) continue;
      const existing = itemEffectIndex!.get(word) || [];
      if (existing.length < 50) { // Limit index entries per word
        existing.push(id);
        itemEffectIndex!.set(word, existing);
      }
    }
  }

  console.error(`[LocalData] Loaded ${itemEffectDescs.size} item effect descriptions`);
}

// ============ BANNER/CAMPSITE CATEGORY LOADER ============

async function loadBannerCategories(): Promise<void> {
  if (bannerCategories !== null) return;

  bannerCategories = new Map();
  campsiteCategories = new Map();
  if (!isGameDataAvailable()) return;

  try {
    const bannerData = await readGameFile(join('Resources', 'bannercategories.txt'));
    for (const line of bannerData.split('\n')) {
      if (!line.trim() || line.startsWith('#') || line.startsWith('CATEGORY_ID')) continue;
      const fields = line.split('^');
      if (fields.length < 2) continue;
      const id = parseInt(fields[0]);
      const desc = fields[1].trim();
      if (!isNaN(id) && desc) bannerCategories.set(id, desc);
    }
  } catch { /* ignore */ }

  try {
    const campsiteData = await readGameFile(join('Resources', 'campsitecategories.txt'));
    for (const line of campsiteData.split('\n')) {
      if (!line.trim() || line.startsWith('#') || line.startsWith('CATEGORY_ID')) continue;
      const fields = line.split('^');
      if (fields.length < 2) continue;
      const id = parseInt(fields[0]);
      const desc = fields[1].trim();
      if (!isNaN(id) && desc) campsiteCategories.set(id, desc);
    }
  } catch { /* ignore */ }

  console.error(`[LocalData] Loaded ${bannerCategories.size} banner categories, ${campsiteCategories.size} campsite categories`);
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
  BONUS_DESCRIPTION: 34,
  SPELL_GROUP_NAME: 40,
  FACTION_NAME: 45,
  AUGMENT_GROUP: 46,
  OVERSEER_MINION_SHORT: 52,
  OVERSEER_MINION_FULL: 53,
  OVERSEER_TRAIT: 54,
  OVERSEER_QUEST_NAME: 56,
  OVERSEER_QUEST_DESC: 57,
  OVERSEER_MINION_BIO: 61,
  MERCENARY_TIER: 22,
  MERCENARY_DESC: 23,
  MERCENARY_STANCE_NAME: 24,
  MERCENARY_STANCE_DESC: 25,
  MERCENARY_STANCE_SHORT: 26,
  MERCENARY_TYPE: 36,
  MERCENARY_ABILITY_NAME: 37,
  MERCENARY_ABILITY_DESC: 38,
  RACE_NAME: 11,
  RACE_DESCRIPTION: 8,
  CLASS_DESCRIPTION: 9,
  DEITY_DESCRIPTION: 14,
  ALT_CURRENCY: 17,
  ALT_CURRENCY_DESC: 47,
  TRIBUTE_NAME: 48,
  TRIBUTE_DESC: 49,
  GUILD_TRIBUTE_NAME: 50,
  GUILD_TRIBUTE_DESC: 51,
  OVERSEER_TRAIT_DESC: 55,
  OVERSEER_JOB_NAME: 62,
  OVERSEER_JOB_DESC: 63,
  OVERSEER_ARCHETYPE_NAME: 64,
  OVERSEER_INCAP_NAME: 58,
  OVERSEER_INCAP_DESC: 59,
  OVERSEER_DIFFICULTY: 66,
  OVERSEER_QUEST_CATEGORY: 67,
  ITEM_EFFECT_DESC: 43,
  RESIST_TYPE: 39,
  CURRENCY_NAME: 44,
  BANNER_CATEGORY: 32,
  EXPANSION_NAME: 20,
  EVENT_BANNER: 30,
  EVENT_DESCRIPTION: 31,
  OVERSEER_SUCCESS: 68,
  OVERSEER_FAILURE: 69,
  CREATURE_RACE: 12,
  STARTING_CITY: 15,
  OVERSEER_JOB_CLASS_DESC: 65,
  AUGMENT_SLOT_TYPE: 16,
  ITEM_LORE_GROUP: 7,
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

  await loadDbStrings([DBSTR_TYPES.SPELL_DESCRIPTION, DBSTR_TYPES.SPELL_CATEGORY]);
  spellDescriptions = dbStrings?.get(DBSTR_TYPES.SPELL_DESCRIPTION) || new Map();
  spellCategories = dbStrings?.get(DBSTR_TYPES.SPELL_CATEGORY) || new Map();
  console.error(`[LocalData] ${spellDescriptions.size} spell descriptions, ${spellCategories.size} spell categories available`);
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

  // Load faction window categories (expansion groupings)
  factionCategories = new Map();
  try {
    const catData = await readGameFile(join('Resources', 'Faction', 'FactionWindowCategories.txt'));
    for (const line of catData.split('\n')) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 2) continue;
      const id = parseInt(fields[0]);
      const name = fields[1];
      if (!isNaN(id) && name) factionCategories.set(id, name);
    }

    // Load category-to-faction associations
    const assocData = await readGameFile(join('Resources', 'Faction', 'FactionWindowCategoryAssociations.txt'));
    for (const line of assocData.split('\n')) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 2) continue;
      const catId = parseInt(fields[0]);
      const factionId = parseInt(fields[1]);
      if (isNaN(catId) || isNaN(factionId)) continue;

      const faction = factions.get(factionId);
      if (faction && factionCategories.has(catId)) {
        faction.category = factionCategories.get(catId);
      }
    }
    console.error(`[LocalData] Loaded ${factionCategories.size} faction categories`);
  } catch {
    console.error('[LocalData] Could not load faction categories');
  }

  // Load faction associations (starting faction values by race/class)
  factionModifierNames = new Map();
  // Modifier names come from type 45: IDs 1-16 = classes, 51+ = races
  for (const [id, name] of factionNames) {
    if (id <= 16 || (id >= 51 && id <= 62) || name.startsWith('Race:') || name.startsWith('Class:')) {
      factionModifierNames.set(id, name);
    }
  }

  try {
    const assocData = await readGameFile(join('Resources', 'Faction', 'FactionAssociations.txt'));
    for (const line of assocData.split('\n')) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 3) continue;
      const factionId = parseInt(fields[0]);
      const modifierId = parseInt(fields[1]);
      const value = parseInt(fields[2]);
      if (isNaN(factionId) || isNaN(modifierId) || isNaN(value)) continue;

      const faction = factions.get(factionId);
      if (faction) {
        if (!faction.startingValues) faction.startingValues = [];
        faction.startingValues.push({ modifierId, value });
      }
    }
    const withStarting = [...factions.values()].filter(f => f.startingValues && f.startingValues.length > 0).length;
    console.error(`[LocalData] Loaded faction starting values (${withStarting} factions with race/class adjustments)`);
  } catch {
    console.error('[LocalData] Could not load faction associations');
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
    categoryToAchievements = new Map();
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

      const parentId = fields[0] ? parseInt(fields[0]) : 0; // 0 = top-level
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
  categoryToAchievements = new Map();

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

      // achievement -> categories (existing)
      const existing = achievementToCategories.get(achievementId) || [];
      existing.push(categoryId);
      achievementToCategories.set(achievementId, existing);

      // category -> achievements (reverse map)
      const catAchs = categoryToAchievements.get(categoryId) || [];
      catAchs.push(achievementId);
      categoryToAchievements.set(categoryId, catAchs);
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

      overseerMinions.set(id, { id, rarity, shortName, fullName, bio, traits: [], traitIds: [], jobs: [] });

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
          minion.traitIds.push(traitId);
        }
      }
    } catch {
      console.error('[LocalData] Could not load OvrMiniTraitClient.txt');
    }

    // Load agent jobs from OvrJobClient.txt
    try {
      const jobData = await readGameFile(join('Resources', 'OvrJobClient.txt'));
      const jobLines = jobData.split('\n');

      for (const line of jobLines) {
        if (!line.trim() || line.startsWith('#')) continue;
        const fields = line.split('^');
        if (fields.length < 7) continue;

        const jobTypeId = parseInt(fields[0]);
        const minionId = parseInt(fields[1]);
        const level = parseInt(fields[5]);
        if (isNaN(jobTypeId) || isNaN(minionId)) continue;

        const minion = overseerMinions.get(minionId);
        if (minion) {
          // Only add if not already present
          if (!minion.jobs.some(j => j.jobTypeId === jobTypeId)) {
            minion.jobs.push({ jobTypeId, level: isNaN(level) ? 1 : level });
          }
        }
      }
    } catch {
      console.error('[LocalData] Could not load OvrJobClient.txt');
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

      overseerQuests.set(id, { id, categoryId, name, description, difficulty, duration, requiredSlots: 0, optionalSlots: 0, slotDetails: [] });

      const lowerName = name.toLowerCase();
      const existing = overseerQuestNameIndex!.get(lowerName) || [];
      existing.push(id);
      overseerQuestNameIndex!.set(lowerName, existing);
    }

    // Load slot data: slot definitions, quest-slot associations, slot-trait mappings, trait groups
    try {
      // 1. Parse slot definitions: slotId -> { jobTypeId, isRequired }
      const slotData = await readGameFile(join('Resources', 'OvrQstMinionSlotClient.txt'));
      const slotInfo = new Map<number, { jobTypeId: number; isRequired: boolean }>();

      for (const line of slotData.split('\n')) {
        if (!line.trim() || line.startsWith('#')) continue;
        const fields = line.split('^');
        if (fields.length < 5) continue;
        const slotId = parseInt(fields[0]);
        const jobTypeId = parseInt(fields[1]);
        const required = fields[4] === '1';
        if (!isNaN(slotId)) slotInfo.set(slotId, { jobTypeId, isRequired: required });
      }

      // 2. Parse trait groups: traitGroupId -> traitId[] (bonus traits)
      const traitGroupData = await readGameFile(join('Resources', 'OvrQstTraitClient.txt'));
      const traitGroups = new Map<number, number[]>();
      for (const line of traitGroupData.split('\n')) {
        if (!line.trim() || line.startsWith('#')) continue;
        const fields = line.split('^');
        if (fields.length < 3) continue;
        const groupId = parseInt(fields[0]);
        const traitId = parseInt(fields[1]);
        if (isNaN(groupId) || isNaN(traitId)) continue;
        const existing = traitGroups.get(groupId) || [];
        if (!existing.includes(traitId)) existing.push(traitId);
        traitGroups.set(groupId, existing);
      }

      // 3. Parse slot -> trait group mappings
      const slotTraitData = await readGameFile(join('Resources', 'OvrQstSlotTraitGroup.txt'));
      const slotTraits = new Map<number, number[]>(); // slotId -> traitId[]
      for (const line of slotTraitData.split('\n')) {
        if (!line.trim() || line.startsWith('#')) continue;
        const fields = line.split('^');
        if (fields.length < 2) continue;
        const slotId = parseInt(fields[0]);
        const traitGroupId = parseInt(fields[1]);
        if (isNaN(slotId) || isNaN(traitGroupId)) continue;
        const traits = traitGroups.get(traitGroupId) || [];
        const existing = slotTraits.get(slotId) || [];
        for (const t of traits) {
          if (!existing.includes(t)) existing.push(t);
        }
        slotTraits.set(slotId, existing);
      }

      // 4. Associate slots to quests
      const assocData = await readGameFile(join('Resources', 'OvrQstMinionSlotAssoc.txt'));
      for (const line of assocData.split('\n')) {
        if (!line.trim() || line.startsWith('#')) continue;
        const fields = line.split('^');
        if (fields.length < 3) continue;
        const questId = parseInt(fields[0]);
        const slotId = parseInt(fields[1]);
        if (isNaN(questId) || isNaN(slotId)) continue;

        const quest = overseerQuests.get(questId);
        const slot = slotInfo.get(slotId);
        if (quest && slot) {
          if (slot.isRequired) {
            quest.requiredSlots++;
          } else {
            quest.optionalSlots++;
          }
          quest.slotDetails.push({
            slotId,
            jobTypeId: slot.jobTypeId,
            isRequired: slot.isRequired,
            bonusTraitIds: slotTraits.get(slotId) || [],
          });
        }
      }
    } catch {
      console.error('[LocalData] Could not load Overseer slot data');
    }

    console.error(`[LocalData] Loaded ${overseerQuests.size} Overseer quests`);
  } catch {
    console.error('[LocalData] Could not load OvrQstClient.txt');
  }
}

// ============ COMBAT ABILITIES PARSER ============

async function loadCombatAbilities(): Promise<void> {
  if (combatAbilities !== null) return;

  if (!isGameDataAvailable()) {
    combatAbilities = new Map();
    combatAbilityNameIndex = new Map();
    return;
  }

  await loadDbStrings([DBSTR_TYPES.COMBAT_ABILITY]);
  const abilityNames = dbStrings?.get(DBSTR_TYPES.COMBAT_ABILITY) || new Map();

  console.error('[LocalData] Loading combat abilities...');
  combatAbilities = new Map();
  combatAbilityNameIndex = new Map();

  for (const [id, name] of abilityNames) {
    combatAbilities.set(id, name);

    const lowerName = name.toLowerCase();
    const existing = combatAbilityNameIndex.get(lowerName) || [];
    existing.push(id);
    combatAbilityNameIndex.set(lowerName, existing);
  }

  console.error(`[LocalData] Loaded ${combatAbilities.size} combat abilities`);
}

// ============ MERCENARY PARSER ============

async function loadMercenaries(): Promise<void> {
  if (mercenaries !== null) return;

  if (!isGameDataAvailable()) {
    mercenaries = new Map();
    mercenaryNameIndex = new Map();
    return;
  }

  await loadDbStrings([DBSTR_TYPES.MERCENARY_TIER, DBSTR_TYPES.MERCENARY_DESC]);
  const tiers = dbStrings?.get(DBSTR_TYPES.MERCENARY_TIER) || new Map();
  const descs = dbStrings?.get(DBSTR_TYPES.MERCENARY_DESC) || new Map();

  console.error('[LocalData] Loading mercenary data...');
  mercenaries = new Map();
  mercenaryNameIndex = new Map();

  for (const [id, rawDesc] of descs) {
    const tier = tiers.get(id) || '';
    const cleanDesc = stripHtmlTags(rawDesc);

    // Parse structured fields from description
    const raceMatch = cleanDesc.match(/Race:\s*([^\n]+)/);
    const typeMatch = cleanDesc.match(/Type:\s*([^\n]+)/);
    const confMatch = cleanDesc.match(/Confidence:\s*([^\n]+)/);
    const profMatch = cleanDesc.match(/Proficiency:\s*([^\n,]+)/);

    const race = raceMatch?.[1]?.trim() || 'Unknown';
    const type = typeMatch?.[1]?.trim() || 'Unknown';
    const confidence = confMatch?.[1]?.trim() || '';
    const proficiency = profMatch?.[1]?.trim() || '';

    const entry: MercenaryEntry = { id, tier, description: cleanDesc, race, type, confidence, proficiency };
    mercenaries.set(id, entry);

    // Index by race and type for searching
    const searchKey = `${race} ${type}`.toLowerCase();
    const existing = mercenaryNameIndex.get(searchKey) || [];
    existing.push(id);
    mercenaryNameIndex.set(searchKey, existing);
  }

  console.error(`[LocalData] Loaded ${mercenaries.size} mercenary types`);
}

async function loadMercenaryStances(): Promise<void> {
  if (mercenaryStances !== null) return;

  if (!isGameDataAvailable()) {
    mercenaryStances = new Map();
    mercenaryTypes = new Map();
    mercenaryAbilities = new Map();
    return;
  }

  await loadDbStrings([
    DBSTR_TYPES.MERCENARY_STANCE_NAME,
    DBSTR_TYPES.MERCENARY_STANCE_DESC,
    DBSTR_TYPES.MERCENARY_STANCE_SHORT,
    DBSTR_TYPES.MERCENARY_TYPE,
    DBSTR_TYPES.MERCENARY_ABILITY_NAME,
    DBSTR_TYPES.MERCENARY_ABILITY_DESC,
  ]);

  const stanceNames = dbStrings?.get(DBSTR_TYPES.MERCENARY_STANCE_NAME) || new Map();
  const stanceDescs = dbStrings?.get(DBSTR_TYPES.MERCENARY_STANCE_DESC) || new Map();
  const stanceShorts = dbStrings?.get(DBSTR_TYPES.MERCENARY_STANCE_SHORT) || new Map();
  const types = dbStrings?.get(DBSTR_TYPES.MERCENARY_TYPE) || new Map();
  const abilNames = dbStrings?.get(DBSTR_TYPES.MERCENARY_ABILITY_NAME) || new Map();
  const abilDescs = dbStrings?.get(DBSTR_TYPES.MERCENARY_ABILITY_DESC) || new Map();

  mercenaryStances = new Map();
  for (const [id, name] of stanceNames) {
    mercenaryStances.set(id, {
      id,
      name,
      description: stanceDescs.get(id) || '',
      shortDesc: stanceShorts.get(id) || '',
    });
  }

  mercenaryTypes = new Map();
  for (const [id, name] of types) {
    mercenaryTypes.set(id, name);
  }

  mercenaryAbilities = new Map();
  for (const [id, name] of abilNames) {
    mercenaryAbilities.set(id, {
      id,
      name,
      description: stripHtmlTags(abilDescs.get(id) || ''),
    });
  }

  console.error(`[LocalData] Loaded ${mercenaryStances.size} mercenary stances, ${mercenaryTypes.size} types, ${mercenaryAbilities.size} abilities`);
}

// ============ RACE & CLASS INFO PARSER ============

// eqstr_us.txt IDs for race descriptions (longer, lore-rich)
const EQSTR_RACE_DESC: Record<number, number> = {
  2: 3239,   // Barbarian
  6: 3240,   // Dark Elf
  8: 3241,   // Dwarf
  3: 3242,   // Erudite
  7: 3243,   // Half Elf
  11: 3244,  // Halfling
  5: 3245,   // High Elf
  1: 3246,   // Human
  128: 3247, // Iksar
  10: 3248,  // Ogre
  9: 3249,   // Troll
  130: 3273, // Vah Shir
  4: 3274,   // Wood Elf
  330: 3316, // Froglok
  12: 3339,  // Gnome
};

// eqstr_us.txt IDs for class descriptions (longer)
const EQSTR_CLASS_DESC: Record<number, number> = {
  8: 3317,   // Bard
  15: 3318,  // Beastlord
  2: 3319,   // Cleric
  6: 3320,   // Druid
  14: 3321,  // Enchanter
  13: 3322,  // Magician
  7: 3323,   // Monk
  11: 3324,  // Necromancer
  3: 3325,   // Paladin
  4: 3326,   // Ranger
  9: 3327,   // Rogue
  5: 3328,   // Shadow Knight
  10: 3329,  // Shaman
  1: 3330,   // Warrior
  12: 3331,  // Wizard
};

// eqstr_us.txt IDs for stat descriptions
const EQSTR_STAT_DESC: Record<string, number> = {
  'Strength': 3332,
  'Stamina': 3333,
  'Agility': 3334,
  'Dexterity': 3335,
  'Wisdom': 3336,
  'Intelligence': 3337,
  'Charisma': 3338,
};

async function loadRaceClassInfo(): Promise<void> {
  if (raceDescriptions !== null) return;

  raceDescriptions = new Map();
  classDescriptions = new Map();
  statDescriptions = new Map();
  deityNames = new Map();

  if (!isGameDataAvailable()) return;

  console.error('[LocalData] Loading race/class info...');

  deityDescriptions = new Map();

  // Load short descriptions from dbstr_us.txt (types 8, 9, and 14 for deities)
  await loadDbStrings([DBSTR_TYPES.RACE_DESCRIPTION, DBSTR_TYPES.CLASS_DESCRIPTION, DBSTR_TYPES.DEITY_DESCRIPTION]);
  const shortRaceDescs = dbStrings?.get(DBSTR_TYPES.RACE_DESCRIPTION) || new Map();
  const shortClassDescs = dbStrings?.get(DBSTR_TYPES.CLASS_DESCRIPTION) || new Map();

  // Load long descriptions and other data from eqstr_us.txt
  await loadGameStrings();

  // Build race descriptions
  for (const [raceId, raceName] of Object.entries(RACE_IDS)) {
    const id = parseInt(raceId);
    const shortRaw = shortRaceDescs.get(id) || '';
    const short = stripHtmlTags(shortRaw);

    let long = '';
    const eqstrId = EQSTR_RACE_DESC[id];
    if (eqstrId && gameStrings) {
      const raw = gameStrings.get(eqstrId) || '';
      long = stripHtmlTags(raw);
    }

    raceDescriptions.set(id, { short: short || long, long: long || short });
  }

  // Build class descriptions
  for (const [classId, className] of Object.entries(CLASS_IDS)) {
    const id = parseInt(classId);
    const shortRaw = shortClassDescs.get(id) || '';
    const short = stripHtmlTags(shortRaw);

    let long = '';
    const eqstrId = EQSTR_CLASS_DESC[id];
    if (eqstrId && gameStrings) {
      const raw = gameStrings.get(eqstrId) || '';
      long = stripHtmlTags(raw);
    }

    classDescriptions.set(id, { short: short || long, long: long || short });
  }

  // Load stat descriptions
  if (gameStrings) {
    for (const [statName, eqstrId] of Object.entries(EQSTR_STAT_DESC)) {
      const raw = gameStrings.get(eqstrId) || '';
      statDescriptions.set(statName, stripHtmlTags(raw));
    }
  }

  // Load deity names
  if (gameStrings) {
    for (const [eqstrId, deityId] of Object.entries(DEITY_IDS)) {
      const name = gameStrings.get(parseInt(eqstrId));
      if (name) {
        deityNames.set(deityId, name);
      }
    }
  }

  // Load deity descriptions from dbstr type 14
  const deityDescs = dbStrings?.get(DBSTR_TYPES.DEITY_DESCRIPTION) || new Map();
  for (const [deityId, rawDesc] of deityDescs) {
    deityDescriptions!.set(deityId, stripHtmlTags(rawDesc));
  }

  console.error(`[LocalData] Loaded ${raceDescriptions.size} races, ${classDescriptions.size} classes, ${deityDescriptions!.size} deities`);
}

// ============ ALTERNATE CURRENCY PARSER ============

async function loadAltCurrencies(): Promise<void> {
  if (altCurrencies !== null) return;

  altCurrencies = new Map();
  if (!isGameDataAvailable()) return;

  await loadDbStrings([DBSTR_TYPES.ALT_CURRENCY, DBSTR_TYPES.ALT_CURRENCY_DESC]);
  const names = dbStrings?.get(DBSTR_TYPES.ALT_CURRENCY) || new Map();
  const descs = dbStrings?.get(DBSTR_TYPES.ALT_CURRENCY_DESC) || new Map();

  for (const [id, name] of names) {
    altCurrencies.set(id, {
      name,
      description: stripHtmlTags(descs.get(id) || ''),
    });
  }

  console.error(`[LocalData] Loaded ${altCurrencies.size} alternate currencies`);
}

// ============ TRIBUTE PARSER ============

async function loadTributes(): Promise<void> {
  if (tributes !== null) return;

  tributes = new Map();
  tributeNameIndex = new Map();
  if (!isGameDataAvailable()) return;

  await loadDbStrings([
    DBSTR_TYPES.TRIBUTE_NAME, DBSTR_TYPES.TRIBUTE_DESC,
    DBSTR_TYPES.GUILD_TRIBUTE_NAME, DBSTR_TYPES.GUILD_TRIBUTE_DESC,
  ]);
  const personalNames = dbStrings?.get(DBSTR_TYPES.TRIBUTE_NAME) || new Map();
  const personalDescs = dbStrings?.get(DBSTR_TYPES.TRIBUTE_DESC) || new Map();
  const guildNames = dbStrings?.get(DBSTR_TYPES.GUILD_TRIBUTE_NAME) || new Map();
  const guildDescs = dbStrings?.get(DBSTR_TYPES.GUILD_TRIBUTE_DESC) || new Map();

  // Personal tributes (use IDs as-is)
  for (const [id, name] of personalNames) {
    const desc = stripHtmlTags(personalDescs.get(id) || '');
    tributes.set(id, { id, name, description: desc, isGuild: false });
    const lower = name.toLowerCase();
    const existing = tributeNameIndex.get(lower) || [];
    existing.push(id);
    tributeNameIndex.set(lower, existing);
  }

  // Guild tributes (offset IDs by 100000 to avoid collisions)
  for (const [id, name] of guildNames) {
    const offsetId = 100000 + id;
    const desc = stripHtmlTags(guildDescs.get(id) || '');
    tributes.set(offsetId, { id: offsetId, name, description: desc, isGuild: true });
    const lower = name.toLowerCase();
    const existing = tributeNameIndex.get(lower) || [];
    existing.push(offsetId);
    tributeNameIndex.set(lower, existing);
  }

  console.error(`[LocalData] Loaded ${tributes.size} tributes (${personalNames.size} personal, ${guildNames.size} guild)`);
}

// ============ OVERSEER ENHANCEMENT LOADER ============

async function loadOverseerEnhancements(): Promise<void> {
  if (overseerCategories !== null) return;

  overseerCategories = new Map();
  overseerDifficulties = new Map();
  overseerTraitDescs = new Map();
  overseerIncapNames = new Map();
  overseerIncapDescs = new Map();
  overseerJobNames = new Map();
  overseerArchetypeNames = new Map();
  overseerJobClassDescs = new Map();
  if (!isGameDataAvailable()) return;

  await loadDbStrings([
    DBSTR_TYPES.OVERSEER_QUEST_CATEGORY, DBSTR_TYPES.OVERSEER_DIFFICULTY,
    DBSTR_TYPES.OVERSEER_TRAIT_DESC, DBSTR_TYPES.OVERSEER_INCAP_NAME,
    DBSTR_TYPES.OVERSEER_INCAP_DESC, DBSTR_TYPES.OVERSEER_JOB_NAME,
    DBSTR_TYPES.OVERSEER_SUCCESS, DBSTR_TYPES.OVERSEER_FAILURE,
    DBSTR_TYPES.OVERSEER_ARCHETYPE_NAME, DBSTR_TYPES.OVERSEER_JOB_CLASS_DESC,
  ]);
  const cats = dbStrings?.get(DBSTR_TYPES.OVERSEER_QUEST_CATEGORY) || new Map();
  const diffs = dbStrings?.get(DBSTR_TYPES.OVERSEER_DIFFICULTY) || new Map();
  const traitDs = dbStrings?.get(DBSTR_TYPES.OVERSEER_TRAIT_DESC) || new Map();
  const incapNs = dbStrings?.get(DBSTR_TYPES.OVERSEER_INCAP_NAME) || new Map();
  const incapDs = dbStrings?.get(DBSTR_TYPES.OVERSEER_INCAP_DESC) || new Map();
  const jobNs = dbStrings?.get(DBSTR_TYPES.OVERSEER_JOB_NAME) || new Map();
  const archNs = dbStrings?.get(DBSTR_TYPES.OVERSEER_ARCHETYPE_NAME) || new Map();
  const jobCDs = dbStrings?.get(DBSTR_TYPES.OVERSEER_JOB_CLASS_DESC) || new Map();

  for (const [id, name] of cats) overseerCategories.set(id, name);
  for (const [id, name] of diffs) overseerDifficulties.set(id, name);
  for (const [id, desc] of traitDs) overseerTraitDescs.set(id, desc);
  for (const [id, name] of incapNs) overseerIncapNames.set(id, name);
  for (const [id, desc] of incapDs) overseerIncapDescs.set(id, desc);
  for (const [id, name] of jobNs) overseerJobNames.set(id, name);
  for (const [id, name] of archNs) overseerArchetypeNames.set(id, name);
  for (const [id, desc] of jobCDs) overseerJobClassDescs.set(id, desc);

  // Load incapacitation durations from OvrQstIncapClient.txt
  overseerIncapDurations = new Map();
  try {
    const incapPath = join(EQ_GAME_PATH, 'Resources', 'OvrQstIncapClient.txt');
    const incapData = await readFile(incapPath, 'latin1');
    for (const line of incapData.split('\n')) {
      const parts = line.trim().split('^');
      if (parts.length >= 3) {
        const entryId = parseInt(parts[0]);
        const jobType = parseInt(parts[1]);
        const duration = parseInt(parts[2]);
        if (!isNaN(entryId) && !isNaN(jobType) && !isNaN(duration)) {
          overseerIncapDurations.set(entryId, { jobType, duration });
        }
      }
    }
  } catch {
    // File may not exist
  }

  console.error(`[LocalData] Loaded ${overseerCategories.size} categories, ${overseerDifficulties.size} difficulties, ${overseerIncapNames.size} incapacitations, ${overseerJobNames.size} job types, ${overseerArchetypeNames.size} archetypes`);
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

export async function searchSpellsByName(query: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const normalized = query.toLowerCase();
  const matches: { id: number; name: string; level: number; classes: string[] }[] = [];

  // Search by name
  for (const [id, spell] of spells) {
    const f = spell.fields;
    const spellName = spell.name;
    const lowerName = spellName.toLowerCase();

    let match = false;
    if (lowerName === normalized) match = true;
    else if (lowerName.startsWith(normalized)) match = true;
    else if (lowerName.includes(normalized)) match = true;

    if (match) {
      // Get class info
      const classes: string[] = [];
      let minLevel = 255;
      const CLASS_NAMES_SHORT = ['WAR','CLR','PAL','RNG','SHD','DRU','MNK','BRD','ROG','SHM','NEC','WIZ','MAG','ENC','BST','BER'];
      for (let c = 0; c < 16; c++) {
        const lvl = parseInt(f[SF.CLASS_LEVEL_START + c]);
        if (!isNaN(lvl) && lvl > 0 && lvl < 255) {
          classes.push(`${CLASS_NAMES_SHORT[c]}(${lvl})`);
          if (lvl < minLevel) minLevel = lvl;
        }
      }
      matches.push({ id, name: spellName, level: minLevel < 255 ? minLevel : 0, classes });
    }

    if (matches.length >= 50) break;
  }

  if (matches.length === 0) {
    return `No spells found matching "${query}".`;
  }

  // Sort: exact match first, then by name, then by ID
  matches.sort((a, b) => {
    const aExact = a.name.toLowerCase() === normalized ? 0 : 1;
    const bExact = b.name.toLowerCase() === normalized ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;
    return a.name.localeCompare(b.name) || a.id - b.id;
  });

  const lines = [`## Spells matching "${query}"`, '', `**Found:** ${matches.length} spell${matches.length !== 1 ? 's' : ''}`, ''];

  for (const m of matches) {
    const classStr = m.classes.length > 0 ? m.classes.join(', ') : 'No class';
    lines.push(`- **${m.name}** [ID: ${m.id}] - ${classStr}`);
  }

  if (matches.length >= 50) {
    lines.push('', '*Results limited to 50. Use a more specific search term.*');
  }

  return lines.join('\n');
}

export async function searchSpellsByResist(resistType: string, className?: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  // Resolve resist type
  const lowerResist = resistType.toLowerCase();
  let resistTypeId: number | undefined;
  for (const [id, name] of Object.entries(RESIST_TYPES)) {
    if (name.toLowerCase() === lowerResist || name.toLowerCase().startsWith(lowerResist)) {
      resistTypeId = parseInt(id);
      break;
    }
  }
  if (resistTypeId === undefined) {
    const validResists = Object.values(RESIST_TYPES).join(', ');
    return `Unknown resist type: "${resistType}". Valid types: ${validResists}`;
  }

  // Optional class filter
  let classId: number | undefined;
  let classIndex: number | undefined;
  if (className) {
    classId = CLASS_NAME_TO_ID[className.toLowerCase()];
    if (!classId) {
      return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
    }
    classIndex = classId - 1;
  }

  const CLASS_NAMES_SHORT = ['WAR','CLR','PAL','RNG','SHD','DRU','MNK','BRD','ROG','SHM','NEC','WIZ','MAG','ENC','BST','BER'];
  const matches: { id: number; name: string; level: number; classes: string[]; category?: string; beneficial: boolean }[] = [];

  for (const [id, spell] of spells) {
    const f = spell.fields;

    // Resist type filter
    const spellResist = parseInt(f[SF.RESIST_TYPE]);
    if (spellResist !== resistTypeId) continue;

    // Class filter
    let classLevel = 0;
    if (classIndex !== undefined) {
      const lvl = parseInt(f[SF.CLASS_LEVEL_START + classIndex]);
      if (isNaN(lvl) || lvl === 255 || lvl <= 0) continue;
      classLevel = lvl;
    }

    // Get class info
    const classes: string[] = [];
    let minLevel = 255;
    for (let c = 0; c < 16; c++) {
      const lvl = parseInt(f[SF.CLASS_LEVEL_START + c]);
      if (!isNaN(lvl) && lvl > 0 && lvl < 255) {
        classes.push(`${CLASS_NAMES_SHORT[c]}(${lvl})`);
        if (lvl < minLevel) minLevel = lvl;
      }
    }

    let category: string | undefined;
    if (spellCategories) {
      const catId = parseInt(f[SF.CATEGORY]);
      if (!isNaN(catId) && catId > 0) category = spellCategories.get(catId);
    }

    matches.push({
      id,
      name: spell.name,
      level: classLevel || (minLevel < 255 ? minLevel : 0),
      classes,
      category,
      beneficial: f[SF.BENEFICIAL] === '1',
    });

    if (matches.length >= 100) break;
  }

  if (matches.length === 0) {
    const classLabel = classId ? ` for ${CLASS_IDS[classId]}` : '';
    return `No ${RESIST_TYPES[resistTypeId]} spells found${classLabel}.`;
  }

  // Sort by level then name
  matches.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const classLabel = classId ? ` - ${CLASS_IDS[classId]}` : '';
  const lines = [
    `## ${RESIST_TYPES[resistTypeId]} Spells${classLabel}`,
    `*${matches.length} spells found${matches.length >= 100 ? ' (limited to 100)' : ''}*`,
    '',
  ];

  for (const m of matches) {
    const catStr = m.category ? ` [${m.category}]` : '';
    const classStr = !classId && m.classes.length > 0 ? ` - ${m.classes.join(', ')}` : '';
    lines.push(`- **${m.name}** (ID: ${m.id})${catStr}${classStr}`);
  }

  return lines.join('\n');
}

export async function searchSpellsByTarget(targetType: string, className?: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  // Resolve target type - support common aliases
  const lowerTarget = targetType.toLowerCase();
  const TARGET_ALIASES: Record<string, number[]> = {
    'single': [5],
    'self': [6],
    'group': [3, 41],
    'ae': [4, 8, 2, 40, 42, 44, 46],
    'pb ae': [4], 'pbae': [4], 'pbaoe': [4],
    'targeted ae': [8], 'target ae': [8], 'rain': [8],
    'directional': [42], 'cone': [42],
    'beam': [44],
    'target ring': [46], 'ring': [46],
    'pet': [14],
    'corpse': [15],
    'undead': [10],
    'animal': [9],
    'lifetap': [13],
    'free target': [36],
    'los': [1], 'line of sight': [1],
  };

  let targetIds: number[] | undefined;
  // Check aliases first
  for (const [alias, ids] of Object.entries(TARGET_ALIASES)) {
    if (alias === lowerTarget || alias.startsWith(lowerTarget)) {
      targetIds = ids;
      break;
    }
  }
  // Also check TARGET_TYPES names directly
  if (!targetIds) {
    for (const [id, name] of Object.entries(TARGET_TYPES)) {
      if (name.toLowerCase().includes(lowerTarget)) {
        targetIds = targetIds || [];
        targetIds.push(parseInt(id));
      }
    }
  }
  if (!targetIds || targetIds.length === 0) {
    const validTypes = ['Single', 'Self', 'Group', 'AE (all AE types)', 'PB AE', 'Targeted AE', 'Directional/Cone', 'Beam', 'Target Ring', 'Pet', 'Corpse', 'Undead', 'Animal', 'Lifetap'];
    return `Unknown target type: "${targetType}". Valid types: ${validTypes.join(', ')}`;
  }

  const targetIdSet = new Set(targetIds);

  // Optional class filter
  let classId: number | undefined;
  let classIndex: number | undefined;
  if (className) {
    classId = CLASS_NAME_TO_ID[className.toLowerCase()];
    if (!classId) {
      return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
    }
    classIndex = classId - 1;
  }

  const CLASS_NAMES_SHORT = ['WAR','CLR','PAL','RNG','SHD','DRU','MNK','BRD','ROG','SHM','NEC','WIZ','MAG','ENC','BST','BER'];
  const matches: { id: number; name: string; level: number; classes: string[]; category?: string; targetName: string }[] = [];

  for (const [id, spell] of spells) {
    const f = spell.fields;

    // Target type filter
    const spellTarget = parseInt(f[SF.TARGET_TYPE]);
    if (!targetIdSet.has(spellTarget)) continue;

    // Class filter
    let classLevel = 0;
    if (classIndex !== undefined) {
      const lvl = parseInt(f[SF.CLASS_LEVEL_START + classIndex]);
      if (isNaN(lvl) || lvl === 255 || lvl <= 0) continue;
      classLevel = lvl;
    }

    // Get class info
    const classes: string[] = [];
    let minLevel = 255;
    for (let c = 0; c < 16; c++) {
      const lvl = parseInt(f[SF.CLASS_LEVEL_START + c]);
      if (!isNaN(lvl) && lvl > 0 && lvl < 255) {
        classes.push(`${CLASS_NAMES_SHORT[c]}(${lvl})`);
        if (lvl < minLevel) minLevel = lvl;
      }
    }

    let category: string | undefined;
    if (spellCategories) {
      const catId = parseInt(f[SF.CATEGORY]);
      if (!isNaN(catId) && catId > 0) category = spellCategories.get(catId);
    }

    matches.push({
      id,
      name: spell.name,
      level: classLevel || (minLevel < 255 ? minLevel : 0),
      classes,
      category,
      targetName: TARGET_TYPES[spellTarget] || `Type ${spellTarget}`,
    });

    if (matches.length >= 100) break;
  }

  if (matches.length === 0) {
    const classLabel = classId ? ` for ${CLASS_IDS[classId]}` : '';
    return `No spells found with target type "${targetType}"${classLabel}.`;
  }

  // Sort by level then name
  matches.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const classLabel = classId ? ` - ${CLASS_IDS[classId]}` : '';
  const targetLabel = targetIds.length === 1
    ? (TARGET_TYPES[targetIds[0]] || targetType)
    : targetType.charAt(0).toUpperCase() + targetType.slice(1);
  const lines = [
    `## ${targetLabel} Spells${classLabel}`,
    `*${matches.length} spells found${matches.length >= 100 ? ' (limited to 100)' : ''}*`,
    '',
  ];

  for (const m of matches) {
    const catStr = m.category ? ` [${m.category}]` : '';
    const targetStr = targetIds.length > 1 ? ` {${m.targetName}}` : '';
    const classStr = !classId && m.classes.length > 0 ? ` - ${m.classes.join(', ')}` : '';
    lines.push(`- **${m.name}** (ID: ${m.id})${catStr}${targetStr}${classStr}`);
  }

  return lines.join('\n');
}

export async function searchSpellsByDescription(query: string, className?: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';
  if (!spellDescriptions || spellDescriptions.size === 0) return 'Spell descriptions not available.';

  const normalized = query.toLowerCase();

  // Optional class filter
  let classId: number | undefined;
  let classIndex: number | undefined;
  if (className) {
    classId = CLASS_NAME_TO_ID[className.toLowerCase()];
    if (!classId) {
      return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
    }
    classIndex = classId - 1;
  }

  const CLASS_NAMES_SHORT = ['WAR','CLR','PAL','RNG','SHD','DRU','MNK','BRD','ROG','SHM','NEC','WIZ','MAG','ENC','BST','BER'];
  const matches: { id: number; name: string; desc: string; classes: string[] }[] = [];

  for (const [spellId, desc] of spellDescriptions) {
    if (!desc.toLowerCase().includes(normalized)) continue;

    const spell = spells.get(spellId);
    if (!spell) continue;

    // Class filter
    if (classIndex !== undefined) {
      const lvl = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
      if (isNaN(lvl) || lvl === 255 || lvl <= 0) continue;
    }

    // Get class info
    const classes: string[] = [];
    for (let c = 0; c < 16; c++) {
      const lvl = parseInt(spell.fields[SF.CLASS_LEVEL_START + c]);
      if (!isNaN(lvl) && lvl > 0 && lvl < 255) {
        classes.push(`${CLASS_NAMES_SHORT[c]}(${lvl})`);
      }
    }

    // Truncate description for display
    const shortDesc = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;

    matches.push({ id: spellId, name: spell.name, desc: shortDesc, classes });
    if (matches.length >= 50) break;
  }

  if (matches.length === 0) {
    const classLabel = classId ? ` for ${CLASS_IDS[classId]}` : '';
    return `No spells found with description matching "${query}"${classLabel}.`;
  }

  matches.sort((a, b) => a.name.localeCompare(b.name));

  const classLabel = classId ? ` - ${CLASS_IDS[classId]}` : '';
  const lines = [
    `## Spells with description matching "${query}"${classLabel}`,
    `*${matches.length} spells found${matches.length >= 50 ? ' (limited to 50)' : ''}*`,
    '',
  ];

  for (const m of matches) {
    const classStr = !classId && m.classes.length > 0 ? ` - ${m.classes.join(', ')}` : '';
    lines.push(`- **${m.name}** (ID: ${m.id})${classStr}`);
    lines.push(`  *${m.desc}*`);
  }

  return lines.join('\n');
}

export async function searchTimerGroup(timerGroupOrSpell: string, className?: string): Promise<string> {
  await loadSpells();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  let timerId: number;

  // Try parsing as a number first
  const parsed = parseInt(timerGroupOrSpell);
  if (!isNaN(parsed) && parsed > 0) {
    timerId = parsed;
  } else {
    // Try finding the spell by name and getting its timer group
    const normalized = timerGroupOrSpell.toLowerCase();
    let foundTimer: number | undefined;
    for (const [, spell] of spells) {
      if (spell.name.toLowerCase() === normalized) {
        const t = parseInt(spell.fields[SF.TIMER_ID]);
        if (!isNaN(t) && t > 0) {
          foundTimer = t;
          break;
        }
      }
    }
    if (!foundTimer) {
      // Fuzzy search
      for (const [, spell] of spells) {
        if (spell.name.toLowerCase().includes(normalized)) {
          const t = parseInt(spell.fields[SF.TIMER_ID]);
          if (!isNaN(t) && t > 0) {
            foundTimer = t;
            break;
          }
        }
      }
    }
    if (!foundTimer) {
      return `No timer group found for "${timerGroupOrSpell}". Provide a timer group number (1-22) or a spell/discipline name that uses a timer group.`;
    }
    timerId = foundTimer;
  }

  // Optional class filter
  let classId: number | undefined;
  let classIndex: number | undefined;
  if (className) {
    classId = CLASS_NAME_TO_ID[className.toLowerCase()];
    if (!classId) {
      return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
    }
    classIndex = classId - 1;
  }

  const CLASS_NAMES_SHORT = ['WAR','CLR','PAL','RNG','SHD','DRU','MNK','BRD','ROG','SHM','NEC','WIZ','MAG','ENC','BST','BER'];
  const matches: { id: number; name: string; level: number; recast: number; classes: string[] }[] = [];

  for (const [spellId, spell] of spells) {
    const t = parseInt(spell.fields[SF.TIMER_ID]);
    if (t !== timerId) continue;

    // Class filter
    if (classIndex !== undefined) {
      const lvl = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
      if (isNaN(lvl) || lvl === 255 || lvl <= 0) continue;
    }

    // Get class info and min level
    const classes: string[] = [];
    let minLevel = 999;
    for (let c = 0; c < 16; c++) {
      const lvl = parseInt(spell.fields[SF.CLASS_LEVEL_START + c]);
      if (!isNaN(lvl) && lvl > 0 && lvl < 255) {
        classes.push(`${CLASS_NAMES_SHORT[c]}(${lvl})`);
        if (lvl < minLevel) minLevel = lvl;
      }
    }

    const recast = parseInt(spell.fields[SF.RECAST_TIME]) || 0;

    matches.push({ id: spellId, name: spell.name, level: minLevel, recast, classes });
  }

  if (matches.length === 0) {
    const classLabel = classId ? ` for ${CLASS_IDS[classId]}` : '';
    return `No spells found on timer group ${timerId}${classLabel}.`;
  }

  // Sort by level then name
  matches.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const classLabel = classId ? ` - ${CLASS_IDS[classId]}` : '';
  const lines = [
    `## Timer Group ${timerId}${classLabel}`,
    `*${matches.length} spells/abilities share this reuse timer*`,
    '',
  ];

  const shown = matches.slice(0, 100);
  for (const m of shown) {
    const recastStr = m.recast > 0 ? ` — recast ${(m.recast / 1000).toFixed(0)}s` : '';
    const classStr = !classId && m.classes.length > 0 && m.classes.length <= 8 ? ` — ${m.classes.join(', ')}` : '';
    lines.push(`- **${m.name}** (ID: ${m.id})${recastStr}${classStr}`);
  }

  if (matches.length > 100) {
    lines.push(`*...and ${matches.length - 100} more*`);
  }

  return lines.join('\n');
}

export async function compareSpells(spell1: string, spell2: string): Promise<string> {
  await loadSpells();
  await loadSpellStrings();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  // Resolve both spells (by ID or name)
  const resolve = (input: string): LocalSpell | null => {
    const id = parseInt(input);
    if (!isNaN(id) && spells!.has(id)) return spells!.get(id) || null;
    // Search by name (exact first, then case-insensitive)
    const lower = input.toLowerCase();
    for (const [, sp] of spells!) {
      if (sp.name === input) return sp;
    }
    for (const [, sp] of spells!) {
      if (sp.name.toLowerCase() === lower) return sp;
    }
    return null;
  };

  const s1 = resolve(spell1);
  const s2 = resolve(spell2);

  if (!s1) return `Spell not found: "${spell1}"`;
  if (!s2) return `Spell not found: "${spell2}"`;

  const d1 = buildLocalSpellData(s1);
  const d2 = buildLocalSpellData(s2);

  // Collect spell strings
  const str1 = spellStrings?.get(s1.id);
  const str2 = spellStrings?.get(s2.id);

  // Spell descriptions
  const desc1 = spellDescriptions?.get(s1.id) || '';
  const desc2 = spellDescriptions?.get(s2.id) || '';

  const lines = [
    `## Spell Comparison`,
    '',
    `| Property | ${d1.name} | ${d2.name} |`,
    '|----------|' + '-'.repeat(d1.name.length + 2) + '|' + '-'.repeat(d2.name.length + 2) + '|',
    `| **ID** | ${d1.id} | ${d2.id} |`,
  ];

  // Helper to add comparison row with diff marking
  const addRow = (label: string, v1: string | number | undefined, v2: string | number | undefined) => {
    const s1v = v1 !== undefined ? String(v1) : '—';
    const s2v = v2 !== undefined ? String(v2) : '—';
    const marker = s1v !== s2v ? ' ⚡' : '';
    lines.push(`| **${label}** | ${s1v} | ${s2v}${marker} |`);
  };

  addRow('Mana', d1.mana, d2.mana);
  addRow('Endurance', d1.endurance, d2.endurance);
  addRow('Cast Time', d1.castTime, d2.castTime);
  addRow('Recast', d1.recastTime, d2.recastTime);
  addRow('Recovery', d1.recoveryTime, d2.recoveryTime);
  addRow('Duration', d1.duration, d2.duration);
  addRow('Range', d1.range, d2.range);
  addRow('AE Range', d1.aeRange, d2.aeRange);
  addRow('Target', d1.target, d2.target);
  addRow('Resist', d1.resist, d2.resist);
  addRow('Beneficial', d1.beneficial ? 'Yes' : 'No', d2.beneficial ? 'Yes' : 'No');
  addRow('Category', d1.category, d2.category);
  addRow('Timer Group', d1.timerId, d2.timerId);
  if (d1.pushBack || d2.pushBack) addRow('Push Back', d1.pushBack, d2.pushBack);
  if (d1.recourseId || d2.recourseId) {
    addRow('Recourse', d1.recourseName ? `${d1.recourseName} [${d1.recourseId}]` : d1.recourseId, d2.recourseName ? `${d2.recourseName} [${d2.recourseId}]` : d2.recourseId);
  }
  if (d1.teleportZone || d2.teleportZone) addRow('Teleport Zone', d1.teleportZone, d2.teleportZone);

  // Classes comparison
  const allClasses = new Set<string>();
  if (d1.classes) Object.keys(d1.classes).forEach(c => allClasses.add(c));
  if (d2.classes) Object.keys(d2.classes).forEach(c => allClasses.add(c));

  if (allClasses.size > 0) {
    lines.push('', '### Class Levels');
    lines.push(`| Class | ${d1.name} | ${d2.name} |`);
    lines.push('|-------|' + '-'.repeat(d1.name.length + 2) + '|' + '-'.repeat(d2.name.length + 2) + '|');
    for (const cls of [...allClasses].sort()) {
      const l1 = d1.classes?.[cls];
      const l2 = d2.classes?.[cls];
      const diff = (l1 || 0) !== (l2 || 0) ? ' ⚡' : '';
      lines.push(`| ${cls} | ${l1 || '—'} | ${l2 || '—'}${diff} |`);
    }
  }

  // Effects comparison
  if (d1.effects || d2.effects) {
    lines.push('', '### Effects');
    const e1 = d1.effects || [];
    const e2 = d2.effects || [];
    const maxLen = Math.max(e1.length, e2.length);
    for (let i = 0; i < maxLen; i++) {
      const eff1 = e1[i] || '—';
      const eff2 = e2[i] || '—';
      const diff = eff1 !== eff2 ? ' ⚡' : '';
      lines.push(`- **${d1.name}:** ${eff1}`);
      lines.push(`  **${d2.name}:** ${eff2}${diff}`);
      if (i < maxLen - 1) lines.push('');
    }
  }

  // Descriptions
  if (desc1 || desc2) {
    lines.push('', '### Descriptions');
    if (desc1) lines.push(`**${d1.name}:** ${desc1}`);
    if (desc2) lines.push(`**${d2.name}:** ${desc2}`);
  }

  // Cast messages
  if (str1 || str2) {
    const msgs1 = str1 ? [str1.casterMe, str1.castedMe].filter(Boolean) : [];
    const msgs2 = str2 ? [str2.casterMe, str2.castedMe].filter(Boolean) : [];
    if (msgs1.length > 0 || msgs2.length > 0) {
      lines.push('', '### Cast Messages');
      if (msgs1.length > 0) lines.push(`**${d1.name}:** ${msgs1.join(' / ')}`);
      if (msgs2.length > 0) lines.push(`**${d2.name}:** ${msgs2.join(' / ')}`);
    }
  }

  return lines.join('\n');
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

  // Add spell description from dbstr_us.txt with placeholder resolution
  const desc = spellDescriptions?.get(spellId);
  if (desc) {
    data.description = resolveSpellDescription(desc, spell.fields, data.duration);
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
    const stackEffects = stackInfo.map(s => {
      const groupName = spellGroupNames?.get(s.stackingGroup);
      const groupLabel = groupName ? `${groupName} (Group ${s.stackingGroup})` : `Group ${s.stackingGroup}`;
      return `${groupLabel}, Rank ${s.rank}, Type ${s.stackingType}`;
    });
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

export async function searchAchievements(query: string, category?: string): Promise<SearchResult[]> {
  await loadAchievements();
  await loadAchievementCategories();
  if (!achievements || achievements.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  // If category filter specified, find matching category IDs
  let filterCategoryIds: Set<number> | null = null;
  if (category && achievementCategories && categoryToAchievements) {
    const catNorm = category.toLowerCase();
    filterCategoryIds = new Set<number>();
    for (const [catId, cat] of achievementCategories) {
      if (cat.name.toLowerCase().includes(catNorm) || cat.description.toLowerCase().includes(catNorm)) {
        // Add this category's achievements
        const achIds = categoryToAchievements.get(catId);
        if (achIds) achIds.forEach(id => filterCategoryIds!.add(id));
        // Also add achievements from child categories
        for (const [childId, childCat] of achievementCategories) {
          if (childCat.parentId === catId) {
            const childAchIds = categoryToAchievements.get(childId);
            if (childAchIds) childAchIds.forEach(id => filterCategoryIds!.add(id));
          }
        }
      }
    }
  }

  for (const [id, ach] of achievements) {
    if (results.length >= 25) break;
    // Apply category filter if specified
    if (filterCategoryIds && !filterCategoryIds.has(id)) continue;
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

  if (ach.hidden) lines.push(`**Hidden:** Yes`);
  if (ach.locked) lines.push(`**Locked:** Yes`);

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

export async function listAchievementCategories(): Promise<string> {
  await loadAchievementCategories();
  await loadAchievements();
  if (!achievementCategories || achievementCategories.size === 0) return 'Achievement category data not available.';

  // Build top-level -> subcategory tree
  const topLevel: AchievementCategory[] = [];
  const children: Map<number, AchievementCategory[]> = new Map();

  for (const [, cat] of achievementCategories) {
    if (!cat.parentId) {
      topLevel.push(cat);
    } else {
      const existing = children.get(cat.parentId) || [];
      existing.push(cat);
      children.set(cat.parentId, existing);
    }
  }

  // Sort top-level by order
  topLevel.sort((a, b) => a.order - b.order);

  const lines = ['## Achievement Categories', ''];

  for (const top of topLevel) {
    // Count achievements in this top-level category (sum of all subcategories)
    let totalCount = 0;
    const subs = children.get(top.id) || [];
    subs.sort((a, b) => a.order - b.order);

    // Count direct achievements in top-level category
    const directCount = categoryToAchievements?.get(top.id)?.length || 0;
    totalCount += directCount;
    for (const sub of subs) {
      totalCount += categoryToAchievements?.get(sub.id)?.length || 0;
    }

    lines.push(`### ${top.name} (ID: ${top.id}) — ${totalCount} achievements`);
    if (subs.length > 0) {
      for (const sub of subs) {
        const count = categoryToAchievements?.get(sub.id)?.length || 0;
        lines.push(`  - ${sub.name} (ID: ${sub.id}) — ${count} achievements`);
      }
    }
    lines.push('');
  }

  lines.push(`*${achievementCategories.size} total categories, ${achievements?.size || 0} total achievements*`);
  return lines.join('\n');
}

export async function getAchievementsByCategory(categoryId: string): Promise<string> {
  await loadAchievementCategories();
  await loadAchievements();
  if (!achievementCategories || !achievements) return 'Achievement data not available.';

  const catId = parseInt(categoryId);
  const cat = achievementCategories.get(catId);
  if (!cat) return `Achievement category with ID ${categoryId} not found.`;

  const lines = [`## ${cat.name}`];
  if (cat.description && cat.description !== cat.name) {
    lines.push(`*${cat.description}*`);
  }
  lines.push('');

  // Check if this is a top-level category with subcategories
  const subs: AchievementCategory[] = [];
  for (const [, c] of achievementCategories) {
    if (c.parentId === catId) subs.push(c);
  }

  if (subs.length > 0) {
    // Top-level category: show subcategories with their achievements
    subs.sort((a, b) => a.order - b.order);
    for (const sub of subs) {
      const achIds = categoryToAchievements?.get(sub.id) || [];
      lines.push(`### ${sub.name} (ID: ${sub.id}) — ${achIds.length} achievements`);
      // Show first 15 achievements per subcategory
      const shown = achIds.slice(0, 15);
      for (const achId of shown) {
        const ach = achievements.get(achId);
        if (ach) {
          lines.push(`- **${ach.name}** (ID: ${achId}) — ${ach.points} pts`);
        }
      }
      if (achIds.length > 15) {
        lines.push(`  *...and ${achIds.length - 15} more*`);
      }
      lines.push('');
    }
  }

  // Also show direct achievements in this category
  const directAchIds = categoryToAchievements?.get(catId) || [];
  if (directAchIds.length > 0) {
    if (subs.length > 0) {
      lines.push('### Direct Achievements');
    }
    lines.push(`*${directAchIds.length} achievements*`, '');
    const shown = directAchIds.slice(0, 50);
    for (const achId of shown) {
      const ach = achievements.get(achId);
      if (ach) {
        const desc = ach.description.length > 80 ? ach.description.substring(0, 80) + '...' : ach.description;
        lines.push(`- **${ach.name}** (ID: ${achId}) — ${ach.points} pts — ${desc}`);
      }
    }
    if (directAchIds.length > 50) {
      lines.push(`*...and ${directAchIds.length - 50} more*`);
    }
  }

  if (subs.length === 0 && directAchIds.length === 0) {
    lines.push('No achievements found in this category.');
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

    const groupName = spellGroupNames?.get(entry.stackingGroup);
    const groupTitle = groupName
      ? `${groupName} (Group ${entry.stackingGroup})`
      : `Stacking Group ${entry.stackingGroup}`;
    lines.push(`### ${groupTitle}`);
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

export async function searchSpellStackingGroups(query: string): Promise<string> {
  await loadSpellStacking();
  await loadSpells();
  if (!spellStacking || !spellGroupNames || spellGroupNames.size === 0) return 'Spell stacking data not available.';

  const normalized = query.toLowerCase();
  const matchingGroups: { groupId: number; name: string; spells: { id: number; name: string; rank: number }[] }[] = [];

  // Find matching group names
  for (const [groupId, groupName] of spellGroupNames) {
    if (groupName.toLowerCase().includes(normalized)) {
      // Find all spells in this group
      const groupSpells: { id: number; name: string; rank: number }[] = [];
      if (spellStacking && spells) {
        for (const [spellId, entries] of spellStacking) {
          for (const entry of entries) {
            if (entry.stackingGroup === groupId) {
              const spell = spells.get(spellId);
              if (spell) {
                groupSpells.push({ id: spellId, name: spell.name, rank: entry.rank });
              }
            }
          }
        }
      }
      groupSpells.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
      matchingGroups.push({ groupId, name: groupName, spells: groupSpells });
    }
  }

  if (matchingGroups.length === 0) {
    return `No spell stacking groups match "${query}". Use list_spell_categories for spell category names.`;
  }

  matchingGroups.sort((a, b) => a.name.localeCompare(b.name));

  const lines = [`## Spell Stacking Groups matching "${query}"`, '', `*${matchingGroups.length} group${matchingGroups.length !== 1 ? 's' : ''} found*`, ''];

  for (const group of matchingGroups.slice(0, 10)) {
    lines.push(`### ${group.name} (Group ${group.groupId})`);
    lines.push(`*${group.spells.length} spells in group*`);
    for (const s of group.spells.slice(0, 20)) {
      lines.push(`- ${s.name} (ID: ${s.id}, Rank: ${s.rank})`);
    }
    if (group.spells.length > 20) {
      lines.push(`*... and ${group.spells.length - 20} more spells*`);
    }
    lines.push('');
  }

  if (matchingGroups.length > 10) {
    lines.push(`*... and ${matchingGroups.length - 10} more groups*`);
  }

  return lines.join('\n');
}

export async function getSpellsByClass(className: string, level?: number, category?: string, resistType?: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions(); // For category data
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  // Resolve resist type filter
  let resistTypeId: number | undefined;
  if (resistType) {
    const lowerResist = resistType.toLowerCase();
    for (const [id, name] of Object.entries(RESIST_TYPES)) {
      if (name.toLowerCase() === lowerResist || name.toLowerCase().startsWith(lowerResist)) {
        resistTypeId = parseInt(id);
        break;
      }
    }
    if (resistTypeId === undefined) {
      const validResists = Object.values(RESIST_TYPES).filter(r => r !== 'Unresistable').join(', ');
      return `Unknown resist type: "${resistType}". Valid types: ${validResists}`;
    }
  }

  const classIndex = classId - 1; // 0-based index into class level fields
  const matchingSpells: { id: number; name: string; level: number; category?: string }[] = [];

  // Normalize category filter
  const lowerCategory = category?.toLowerCase();

  for (const [id, spell] of spells) {
    const classLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
    if (isNaN(classLevel) || classLevel === 255 || classLevel <= 0) continue;

    if (level !== undefined && classLevel !== level) continue;

    // Resist type filter
    if (resistTypeId !== undefined) {
      const spellResist = parseInt(spell.fields[SF.RESIST_TYPE]);
      if (spellResist !== resistTypeId) continue;
    }

    // Category filter
    let spellCat: string | undefined;
    let spellSubCat: string | undefined;
    if (spellCategories) {
      const catId = parseInt(spell.fields[SF.CATEGORY]);
      const subCatId = parseInt(spell.fields[SF.SUBCATEGORY]);
      if (!isNaN(catId) && catId > 0) spellCat = spellCategories.get(catId);
      if (!isNaN(subCatId) && subCatId > 0 && subCatId !== catId) spellSubCat = spellCategories.get(subCatId);
    }

    if (lowerCategory) {
      const catMatch = spellCat?.toLowerCase().includes(lowerCategory) || spellSubCat?.toLowerCase().includes(lowerCategory);
      if (!catMatch) continue;
    }

    matchingSpells.push({ id, name: spell.name, level: classLevel, category: spellCat });
  }

  matchingSpells.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const resistLabel = resistType ? ` - ${RESIST_TYPES[resistTypeId!] || resistType}` : '';
  if (matchingSpells.length === 0) {
    return `No spells found for ${CLASS_IDS[classId]}${level ? ` at level ${level}` : ''}${category ? ` in category "${category}"` : ''}${resistLabel}.`;
  }

  const catLabel = category ? ` - ${category}` : '';
  const lines = [
    `## ${CLASS_IDS[classId]} Spells${level ? ` (Level ${level})` : ''}${catLabel}${resistLabel}`,
    `*${matchingSpells.length} spells found*`,
    '',
  ];

  if (level) {
    // Show all spells at that level
    for (const s of matchingSpells) {
      const catSuffix = s.category && !category ? ` [${s.category}]` : '';
      lines.push(`- **${s.name}** (ID: ${s.id})${catSuffix}`);
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
      const catSuffix = s.category && !category ? ` [${s.category}]` : '';
      lines.push(`- ${s.name} (ID: ${s.id})${catSuffix}`);
      count++;
    }
  }

  return lines.join('\n');
}

// ============ PUBLIC API: SPELLS BY EFFECT ============

export async function searchSpellsByEffect(effectName: string, className?: string, maxResults: number = 50): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions(); // For category matching
  if (!spells || spells.size === 0) return 'Spell data not available.';

  // Find matching SPA codes
  const lowerEffect = effectName.toLowerCase();
  const matchingSPAs: number[] = [];
  for (const [spa, name] of Object.entries(SPA_NAMES)) {
    if (name.toLowerCase().includes(lowerEffect)) {
      matchingSPAs.push(parseInt(spa));
    }
  }

  // Also check spell categories as fallback/supplement
  const matchingCategoryIds: number[] = [];
  if (spellCategories) {
    for (const [catId, catName] of spellCategories) {
      if (catName.toLowerCase().includes(lowerEffect)) {
        matchingCategoryIds.push(catId);
      }
    }
  }

  if (matchingSPAs.length === 0 && matchingCategoryIds.length === 0) {
    const commonEffects = ['HP', 'Haste', 'Stun', 'Charm', 'Fear', 'Mesmerize', 'Root', 'Snare',
      'Slow', 'Levitate', 'Invisibility', 'Gate', 'Resurrection', 'Heal', 'Damage Shield',
      'Fire Resist', 'Cold Resist', 'Poison Resist', 'Disease Resist', 'Magic Resist',
      'Melee Haste', 'Spell Crit', 'Melee Crit', 'Regen', 'Mana Regen'];
    return `No spell effects or categories match "${effectName}".\n\nCommon effect names: ${commonEffects.join(', ')}`;
  }

  const spaSet = new Set(matchingSPAs);
  const catIdSet = new Set(matchingCategoryIds);

  // Optional class filter
  let classId: number | undefined;
  let classIndex: number | undefined;
  if (className) {
    classId = CLASS_NAME_TO_ID[className.toLowerCase()];
    if (classId) classIndex = classId - 1;
  }

  const results: { id: number; name: string; level?: number; effectDesc: string }[] = [];

  for (const [id, spell] of spells) {
    // Class filter
    if (classIndex !== undefined) {
      const classLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
      if (isNaN(classLevel) || classLevel === 255 || classLevel <= 0) continue;
    }

    // Check effects by SPA code - scan backward to find the effect data field
    let matched = false;
    let effectDesc = '';

    if (spaSet.size > 0) {
      let effectField = '';
      for (let i = spell.fields.length - 1; i >= 0; i--) {
        if (spell.fields[i].includes('|')) {
          effectField = spell.fields[i];
          break;
        }
      }
      if (effectField) {
        const slots = effectField.split('$');
        for (const slot of slots) {
          const parts = slot.split('|');
          if (parts.length < 3) continue;
          const spa = parseInt(parts[1]);
          if (spaSet.has(spa)) {
            matched = true;
            const spaName = SPA_NAMES[spa] || `SPA ${spa}`;
            const base1 = parseInt(parts[2]);
            effectDesc = `${spaName}${!isNaN(base1) && base1 !== 0 ? ` ${base1 > 0 ? '+' : ''}${base1}` : ''}`;
            break;
          }
        }
      }
    }

    // Also check spell category/subcategory as fallback
    if (!matched && catIdSet.size > 0) {
      const catId = parseInt(spell.fields[SF.CATEGORY]);
      const subCatId = parseInt(spell.fields[SF.SUBCATEGORY]);
      if (catIdSet.has(catId) || catIdSet.has(subCatId)) {
        matched = true;
        const catName = spellCategories?.get(catId) || '';
        const subCatName = spellCategories?.get(subCatId) || '';
        effectDesc = subCatName && subCatName !== catName ? `${catName} > ${subCatName}` : catName;
      }
    }

    if (!matched) continue;

    let level: number | undefined;
    if (classIndex !== undefined) {
      level = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
    }

    results.push({ id, name: spell.name, level, effectDesc });
    if (results.length >= maxResults) break;
  }

  if (results.length === 0) {
    const spaNames = matchingSPAs.map(s => SPA_NAMES[s]).join(', ');
    const catNames = matchingCategoryIds.map(id => spellCategories?.get(id) || `${id}`).join(', ');
    const matchInfo = [spaNames, catNames].filter(Boolean).join('; categories: ');
    return `No spells found with "${effectName}" (matched: ${matchInfo})${className ? ` for class ${className}` : ''}.`;
  }

  const spaNames = matchingSPAs.map(s => SPA_NAMES[s]);
  const catNames = matchingCategoryIds.map(id => spellCategories?.get(id) || '').filter(Boolean);
  // Deduplicate names across SPA and categories
  const allNames = [...new Set([...spaNames, ...catNames])];
  const label = allNames.join(', ');
  const classLabel = classId ? ` for ${CLASS_IDS[classId]}` : '';
  const lines = [
    `## Spells with ${label}${classLabel}`,
    `*${results.length}${results.length >= maxResults ? '+' : ''} spells found*`,
    '',
  ];

  if (classIndex !== undefined) {
    results.sort((a, b) => (a.level || 0) - (b.level || 0));
    for (const r of results) {
      lines.push(`- **${r.name}** (Lv${r.level}, ID: ${r.id}) — ${r.effectDesc}`);
    }
  } else {
    for (const r of results) {
      lines.push(`- **${r.name}** (ID: ${r.id}) — ${r.effectDesc}`);
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
    if (faction.name.toLowerCase().includes(normalized) ||
        (faction.category && faction.category.toLowerCase().includes(normalized))) {
      const catInfo = faction.category ? ` [${faction.category}]` : '';
      results.push({
        name: faction.name,
        type: 'unknown' as const,
        id: id.toString(),
        url: `local://faction/${id}`,
        source: 'Local Game Data',
        description: `Range: ${faction.minValue} to ${faction.maxValue}${catInfo}${faction.startingValues ? `, ${faction.startingValues.length} race/class modifiers` : ''}`,
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
  ];

  if (faction.category) {
    lines.push(`**Expansion:** ${faction.category}`);
  }

  lines.push(
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
  );

  // Show starting faction values by race/class
  if (faction.startingValues && faction.startingValues.length > 0) {
    const raceEntries = faction.startingValues.filter(sv =>
      factionModifierNames?.get(sv.modifierId)?.startsWith('Race:') ||
      PLAYABLE_RACE_MODIFIER_IDS.has(sv.modifierId)
    );
    const classEntries = faction.startingValues.filter(sv =>
      sv.modifierId >= 1 && sv.modifierId <= 16 &&
      !factionModifierNames?.get(sv.modifierId)?.startsWith('Race:')
    );

    if (raceEntries.length > 0) {
      lines.push('', '### Starting Faction by Race');

      // Sort by value (most friendly first)
      const sorted = [...raceEntries].sort((a, b) => b.value - a.value);
      for (const sv of sorted) {
        const name = factionModifierNames?.get(sv.modifierId) || `Modifier ${sv.modifierId}`;
        const raceName = name.replace(/^Race:\s*/, '');
        const standing = sv.value >= 1100 ? 'Ally' :
          sv.value >= 750 ? 'Warmly' :
          sv.value >= 500 ? 'Kindly' :
          sv.value >= 100 ? 'Amiable' :
          sv.value >= 0 ? 'Indifferent' :
          sv.value >= -100 ? 'Apprehensive' :
          sv.value >= -500 ? 'Dubious' :
          sv.value >= -750 ? 'Threatening' : 'Scowling';
        lines.push(`- **${raceName}:** ${sv.value} (${standing})`);
      }
    }

    if (classEntries.length > 0) {
      lines.push('', '### Starting Faction by Class');
      const sorted = [...classEntries].sort((a, b) => b.value - a.value);
      for (const sv of sorted) {
        const name = factionModifierNames?.get(sv.modifierId) || `Class ${sv.modifierId}`;
        const standing = sv.value >= 1100 ? 'Ally' :
          sv.value >= 750 ? 'Warmly' :
          sv.value >= 500 ? 'Kindly' :
          sv.value >= 100 ? 'Amiable' :
          sv.value >= 0 ? 'Indifferent' :
          sv.value >= -100 ? 'Apprehensive' :
          sv.value >= -500 ? 'Dubious' :
          sv.value >= -750 ? 'Threatening' : 'Scowling';
        lines.push(`- **${name}:** ${sv.value} (${standing})`);
      }
    }

    // Deity adjustments
    const deityEntries = faction.startingValues.filter(sv => DEITY_MODIFIER_IDS.has(sv.modifierId));
    if (deityEntries.length > 0) {
      lines.push('', '### Starting Faction by Deity');
      const sorted = [...deityEntries].sort((a, b) => b.value - a.value);
      for (const sv of sorted) {
        const name = factionModifierNames?.get(sv.modifierId) || `Deity ${sv.modifierId}`;
        const standing = sv.value >= 1100 ? 'Ally' :
          sv.value >= 750 ? 'Warmly' :
          sv.value >= 500 ? 'Kindly' :
          sv.value >= 100 ? 'Amiable' :
          sv.value >= 0 ? 'Indifferent' :
          sv.value >= -100 ? 'Apprehensive' :
          sv.value >= -500 ? 'Dubious' :
          sv.value >= -750 ? 'Threatening' : 'Scowling';
        lines.push(`- **${name}:** ${sv.value} (${standing})`);
      }
    }
  }

  return lines.join('\n');
}

export async function getFactionsByRace(raceName: string): Promise<string> {
  await loadFactions();
  if (!factions || factions.size === 0) return 'Faction data not available.';

  const modId = RACE_TO_FACTION_MODIFIER[raceName.toLowerCase()];
  if (!modId) {
    return `Unknown race: "${raceName}". Valid races: ${Object.keys(RACE_IDS).map(id => RACE_IDS[parseInt(id)]).join(', ')}`;
  }

  // Find the display name
  const displayRace = factionModifierNames?.get(modId)?.replace(/^Race:\s*/, '') || raceName;

  // Collect all factions with starting values for this race
  const factionStandings: { id: number; name: string; value: number; standing: string; category?: string }[] = [];

  for (const [id, faction] of factions) {
    if (!faction.startingValues) continue;
    for (const sv of faction.startingValues) {
      if (sv.modifierId === modId) {
        const standing = sv.value >= 1100 ? 'Ally' :
          sv.value >= 750 ? 'Warmly' :
          sv.value >= 500 ? 'Kindly' :
          sv.value >= 100 ? 'Amiable' :
          sv.value >= 0 ? 'Indifferent' :
          sv.value >= -100 ? 'Apprehensive' :
          sv.value >= -500 ? 'Dubious' :
          sv.value >= -750 ? 'Threatening' : 'Scowling';
        factionStandings.push({ id, name: faction.name, value: sv.value, standing, category: faction.category });
        break;
      }
    }
  }

  if (factionStandings.length === 0) {
    return `No faction starting values found for ${displayRace}.`;
  }

  // Sort: most hostile first (lowest value)
  factionStandings.sort((a, b) => a.value - b.value);

  const hostile = factionStandings.filter(f => f.value < 0);
  const friendly = factionStandings.filter(f => f.value >= 0);

  const lines = [
    `## Faction Standings for ${displayRace}`,
    `*${factionStandings.length} factions with starting values*`,
    '',
  ];

  if (hostile.length > 0) {
    lines.push(`### Hostile Factions (${hostile.length})`);
    for (const f of hostile) {
      const cat = f.category ? ` [${f.category}]` : '';
      lines.push(`- **${f.name}** (ID: ${f.id}) — ${f.value} (${f.standing})${cat}`);
    }
    lines.push('');
  }

  if (friendly.length > 0) {
    lines.push(`### Friendly Factions (${friendly.length})`);
    // Sort friendly highest first
    friendly.sort((a, b) => b.value - a.value);
    for (const f of friendly) {
      const cat = f.category ? ` [${f.category}]` : '';
      lines.push(`- **${f.name}** (ID: ${f.id}) — ${f.value} (${f.standing})${cat}`);
    }
  }

  return lines.join('\n');
}

export async function getFactionsByDeity(deityName: string): Promise<string> {
  await loadFactions();
  if (!factions || factions.size === 0) return 'Faction data not available.';

  const modId = DEITY_TO_FACTION_MODIFIER[deityName.toLowerCase()];
  if (!modId) {
    const deities = [...new Set(Object.values(DEITY_TO_FACTION_MODIFIER))];
    const deityNames = Object.entries(DEITY_TO_FACTION_MODIFIER)
      .filter(([, v]) => deities.includes(v))
      .map(([k]) => k)
      .filter(k => k.length > 4) // skip short aliases
      .sort();
    return `Unknown deity: "${deityName}". Valid deities: ${deityNames.join(', ')}`;
  }

  const displayDeity = factionModifierNames?.get(modId) || deityName;

  const factionStandings: { id: number; name: string; value: number; standing: string; category?: string }[] = [];

  for (const [id, faction] of factions) {
    if (!faction.startingValues) continue;
    for (const sv of faction.startingValues) {
      if (sv.modifierId === modId) {
        const standing = sv.value >= 1100 ? 'Ally' :
          sv.value >= 750 ? 'Warmly' :
          sv.value >= 500 ? 'Kindly' :
          sv.value >= 100 ? 'Amiable' :
          sv.value >= 0 ? 'Indifferent' :
          sv.value >= -100 ? 'Apprehensive' :
          sv.value >= -500 ? 'Dubious' :
          sv.value >= -750 ? 'Threatening' : 'Scowling';
        factionStandings.push({ id, name: faction.name, value: sv.value, standing, category: faction.category });
        break;
      }
    }
  }

  if (factionStandings.length === 0) {
    return `No faction starting values found for followers of ${displayDeity}.`;
  }

  factionStandings.sort((a, b) => a.value - b.value);

  const hostile = factionStandings.filter(f => f.value < 0);
  const friendly = factionStandings.filter(f => f.value >= 0);

  const lines = [
    `## Faction Standings for followers of ${displayDeity}`,
    `*${factionStandings.length} factions affected by deity choice*`,
    '',
  ];

  if (hostile.length > 0) {
    lines.push(`### Hostile Factions (${hostile.length})`);
    for (const f of hostile) {
      const cat = f.category ? ` [${f.category}]` : '';
      lines.push(`- **${f.name}** (ID: ${f.id}) — ${f.value} (${f.standing})${cat}`);
    }
    lines.push('');
  }

  if (friendly.length > 0) {
    lines.push(`### Friendly Factions (${friendly.length})`);
    friendly.sort((a, b) => b.value - a.value);
    for (const f of friendly) {
      const cat = f.category ? ` [${f.category}]` : '';
      lines.push(`- **${f.name}** (ID: ${f.id}) — ${f.value} (${f.standing})${cat}`);
    }
  }

  return lines.join('\n');
}

export async function getFactionsByClass(className: string): Promise<string> {
  await loadFactions();
  if (!factions || factions.size === 0) return 'Faction data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId || classId < 1 || classId > 16) {
    const validClasses = Object.values(CLASS_IDS).sort();
    return `Unknown class: "${className}". Valid classes: ${validClasses.join(', ')}`;
  }

  const displayClass = CLASS_IDS[classId];
  const modId = classId; // Class modifier IDs are same as class IDs (1-16)

  const factionStandings: { id: number; name: string; value: number; standing: string; category?: string }[] = [];

  for (const [id, faction] of factions) {
    if (!faction.startingValues) continue;
    for (const sv of faction.startingValues) {
      if (sv.modifierId === modId) {
        const standing = sv.value >= 1100 ? 'Ally' :
          sv.value >= 750 ? 'Warmly' :
          sv.value >= 500 ? 'Kindly' :
          sv.value >= 100 ? 'Amiable' :
          sv.value >= 0 ? 'Indifferent' :
          sv.value >= -100 ? 'Apprehensive' :
          sv.value >= -500 ? 'Dubious' :
          sv.value >= -750 ? 'Threatening' : 'Scowling';
        factionStandings.push({ id, name: faction.name, value: sv.value, standing, category: faction.category });
        break;
      }
    }
  }

  if (factionStandings.length === 0) {
    return `No faction starting values found for ${displayClass} class.`;
  }

  factionStandings.sort((a, b) => a.value - b.value);

  const hostile = factionStandings.filter(f => f.value < 0);
  const friendly = factionStandings.filter(f => f.value >= 0);

  const lines = [
    `## Faction Standings for ${displayClass} class`,
    `*${factionStandings.length} factions affected by class choice*`,
    '',
  ];

  if (hostile.length > 0) {
    lines.push(`### Hostile Factions (${hostile.length})`);
    for (const f of hostile) {
      const cat = f.category ? ` [${f.category}]` : '';
      lines.push(`- **${f.name}** (ID: ${f.id}) — ${f.value} (${f.standing})${cat}`);
    }
    lines.push('');
  }

  if (friendly.length > 0) {
    lines.push(`### Friendly Factions (${friendly.length})`);
    friendly.sort((a, b) => b.value - a.value);
    for (const f of friendly) {
      const cat = f.category ? ` [${f.category}]` : '';
      lines.push(`- **${f.name}** (ID: ${f.id}) — ${f.value} (${f.standing})${cat}`);
    }
  }

  return lines.join('\n');
}

export async function getCharacterFactions(race: string, deity?: string, className?: string): Promise<string> {
  await loadFactions();
  if (!factions || factions.size === 0) return 'Faction data not available.';

  // Resolve race
  const raceModId = RACE_TO_FACTION_MODIFIER[race.toLowerCase()];
  if (!raceModId) {
    const raceNames = Object.keys(RACE_TO_FACTION_MODIFIER)
      .filter(k => k.length > 3)
      .sort();
    return `Unknown race: "${race}". Valid races: ${raceNames.join(', ')}`;
  }
  const displayRace = factionModifierNames?.get(raceModId) || race;

  // Resolve deity (optional)
  let deityModId: number | undefined;
  let displayDeity: string | undefined;
  if (deity) {
    deityModId = DEITY_TO_FACTION_MODIFIER[deity.toLowerCase()];
    if (!deityModId) {
      const deityNames = Object.entries(DEITY_TO_FACTION_MODIFIER)
        .map(([k]) => k)
        .filter(k => k.length > 4)
        .sort();
      return `Unknown deity: "${deity}". Valid deities: ${deityNames.join(', ')}`;
    }
    displayDeity = factionModifierNames?.get(deityModId) || deity;
  }

  // Resolve class (optional)
  let classModId: number | undefined;
  let displayClass: string | undefined;
  if (className) {
    const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
    if (!classId || classId < 1 || classId > 16) {
      return `Unknown class: "${className}". Valid: ${Object.values(CLASS_IDS).sort().join(', ')}`;
    }
    classModId = classId;
    displayClass = CLASS_IDS[classId];
  }

  // Collect modifier IDs to sum
  const modIds = [raceModId];
  if (deityModId) modIds.push(deityModId);
  if (classModId) modIds.push(classModId);

  // Aggregate faction values across all modifiers
  const factionTotals = new Map<number, { name: string; total: number; breakdown: { source: string; value: number }[]; category?: string }>();

  for (const [id, faction] of factions) {
    if (!faction.startingValues) continue;
    for (const sv of faction.startingValues) {
      if (modIds.includes(sv.modifierId)) {
        let entry = factionTotals.get(id);
        if (!entry) {
          entry = { name: faction.name, total: 0, breakdown: [], category: faction.category };
          factionTotals.set(id, entry);
        }
        entry.total += sv.value;
        const source = sv.modifierId === raceModId ? displayRace :
          sv.modifierId === deityModId ? (displayDeity || '') :
          sv.modifierId === classModId ? (displayClass || '') : `Mod ${sv.modifierId}`;
        entry.breakdown.push({ source, value: sv.value });
      }
    }
  }

  if (factionTotals.size === 0) {
    return 'No faction starting values found for this combination.';
  }

  // Build title
  const titleParts = [displayRace];
  if (displayClass) titleParts.push(displayClass);
  if (displayDeity) titleParts.push(`follower of ${displayDeity}`);
  const title = titleParts.join(' ');

  const entries = [...factionTotals.entries()].map(([id, e]) => {
    const standing = e.total >= 1100 ? 'Ally' :
      e.total >= 750 ? 'Warmly' :
      e.total >= 500 ? 'Kindly' :
      e.total >= 100 ? 'Amiable' :
      e.total >= 0 ? 'Indifferent' :
      e.total >= -100 ? 'Apprehensive' :
      e.total >= -500 ? 'Dubious' :
      e.total >= -750 ? 'Threatening' : 'Scowling';
    return { id, ...e, standing };
  });

  entries.sort((a, b) => a.total - b.total);

  const hostile = entries.filter(f => f.total < 0);
  const friendly = entries.filter(f => f.total >= 0);

  const lines = [
    `## Combined Faction Standings: ${title}`,
    `*${entries.length} factions affected*`,
    '',
  ];

  const showBreakdown = modIds.length > 1;

  if (hostile.length > 0) {
    lines.push(`### Hostile Factions (${hostile.length})`);
    for (const f of hostile) {
      const cat = f.category ? ` [${f.category}]` : '';
      let line = `- **${f.name}** (ID: ${f.id}) — ${f.total} (${f.standing})${cat}`;
      if (showBreakdown && f.breakdown.length > 1) {
        line += ` [${f.breakdown.map(b => `${b.source}: ${b.value >= 0 ? '+' : ''}${b.value}`).join(', ')}]`;
      }
      lines.push(line);
    }
    lines.push('');
  }

  if (friendly.length > 0) {
    lines.push(`### Friendly Factions (${friendly.length})`);
    friendly.sort((a, b) => b.total - a.total);
    for (const f of friendly) {
      const cat = f.category ? ` [${f.category}]` : '';
      let line = `- **${f.name}** (ID: ${f.id}) — ${f.total} (${f.standing})${cat}`;
      if (showBreakdown && f.breakdown.length > 1) {
        line += ` [${f.breakdown.map(b => `${b.source}: ${b.value >= 0 ? '+' : ''}${b.value}`).join(', ')}]`;
      }
      lines.push(line);
    }
  }

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
  await loadOverseerEnhancements();
  if (!overseerMinions) return 'Overseer minion data not available.';

  const minionId = parseInt(id);
  const minion = overseerMinions.get(minionId);
  if (!minion) return `Overseer minion with ID ${id} not found.`;

  const lines = [
    `## ${minion.fullName}`,
    '',
    `**Rarity:** ${OVERSEER_RARITIES[minion.rarity] || 'Unknown'}`,
  ];

  // Determine archetype from first job (jobs 1-3=Fighter, 4-6=Worker, 7-9=Traveler)
  if (minion.jobs.length > 0) {
    const firstJobId = minion.jobs[0].jobTypeId;
    if (firstJobId >= 1 && firstJobId <= 9) {
      const archetypeId = Math.ceil(firstJobId / 3);
      const archetypeName = overseerArchetypeNames?.get(archetypeId);
      if (archetypeName) {
        lines.push(`**Archetype:** ${archetypeName}`);
        const classDesc = overseerJobClassDescs?.get(archetypeId);
        if (classDesc) lines.push(`*${classDesc}*`);
      }
    }
  }

  // Show jobs this agent can perform
  if (minion.jobs.length > 0) {
    const jobNames = minion.jobs
      .map(j => {
        const name = overseerJobNames?.get(j.jobTypeId) || `Job ${j.jobTypeId}`;
        return `${name} (Lv${j.level})`;
      })
      .join(', ');
    lines.push(`**Jobs:** ${jobNames}`);
  }

  if (minion.traits.length > 0) {
    lines.push('', '### Traits');
    for (let i = 0; i < minion.traits.length; i++) {
      const traitName = minion.traits[i];
      const traitId = minion.traitIds[i];
      const traitDesc = traitId !== undefined ? overseerTraitDescs?.get(traitId) : undefined;
      if (traitDesc) {
        lines.push(`- **${traitName}** - ${stripHtmlTags(traitDesc)}`);
      } else {
        lines.push(`- **${traitName}**`);
      }
    }
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
  await loadOverseerEnhancements();
  await loadOverseerMinions(); // for trait names
  if (!overseerQuests) return 'Overseer quest data not available.';

  const questId = parseInt(id);
  const quest = overseerQuests.get(questId);
  if (!quest) return `Overseer quest with ID ${id} not found.`;

  const categoryName = overseerCategories?.get(quest.categoryId) || `Category ${quest.categoryId}`;
  const difficultyName = overseerDifficulties?.get(quest.difficulty) || `${quest.difficulty}`;

  // Get trait names from dbstr
  const traitNames = dbStrings?.get(DBSTR_TYPES.OVERSEER_TRAIT) || new Map<number, string>();

  const lines = [
    `## ${quest.name}`,
    '',
    quest.description,
    '',
    `**Category:** ${categoryName}`,
    `**Difficulty:** ${difficultyName}`,
    `**Duration:** ${quest.duration}h`,
    `**Agent Slots:** ${quest.requiredSlots} required${quest.optionalSlots > 0 ? `, ${quest.optionalSlots} optional` : ''}`,
  ];

  // Show slot details with job types and bonus traits
  if (quest.slotDetails.length > 0) {
    lines.push('', '### Agent Slot Details');
    let slotNum = 1;
    for (const slot of quest.slotDetails) {
      const jobName = overseerJobNames?.get(slot.jobTypeId) || `Job ${slot.jobTypeId}`;
      const reqLabel = slot.isRequired ? 'Required' : 'Optional';
      let slotLine = `${slotNum}. **${jobName}** (${reqLabel})`;

      if (slot.bonusTraitIds.length > 0) {
        const traitNamesList = slot.bonusTraitIds
          .map(tid => traitNames.get(tid) || `Trait ${tid}`)
          .slice(0, 5);
        slotLine += ` — Bonus: ${traitNamesList.join(', ')}`;
        if (slot.bonusTraitIds.length > 5) {
          slotLine += ` +${slot.bonusTraitIds.length - 5} more`;
        }
      }

      lines.push(slotLine);
      slotNum++;
    }
  }

  // Show primary incapacitation risk based on quest category
  const categoryIncapMap: Record<string, string> = {
    'Plunder': 'Wounded', 'Stealth': 'Captured', 'Military': 'Shaken',
    'Crafting': 'Discouraged', 'Harvesting': 'Exhausted', 'Research': 'Discredited',
    'Diplomacy': 'Banished', 'Merchant': 'Blacklisted', 'Exploration': 'Missing',
  };
  const primaryIncap = categoryIncapMap[categoryName];
  if (primaryIncap && overseerIncapNames) {
    // Find the description for this incapacitation type
    for (const [incapId, incapName] of overseerIncapNames) {
      if (incapName === primaryIncap) {
        const incapDesc = overseerIncapDescs?.get(incapId) || '';
        lines.push('', `**Primary Risk:** ${primaryIncap} — ${stripHtmlTags(incapDesc)}`);
        break;
      }
    }
  }

  // Success/failure outcome messages
  const successMsgs = dbStrings?.get(DBSTR_TYPES.OVERSEER_SUCCESS);
  const failureMsgs = dbStrings?.get(DBSTR_TYPES.OVERSEER_FAILURE);
  const rawSuccess = successMsgs?.get(questId);
  const rawFailure = failureMsgs?.get(questId);
  if (rawSuccess || rawFailure) {
    lines.push('', '### Outcomes');
    if (rawSuccess) {
      const success = stripHtmlTags(rawSuccess.replace(/<c\s+"[^"]*">/gi, '').replace(/<\/c>/gi, ''));
      lines.push(`**Success:** ${success}`);
    }
    if (rawFailure) {
      const failure = stripHtmlTags(rawFailure.replace(/<c\s+"[^"]*">/gi, '').replace(/<\/c>/gi, ''));
      lines.push(`**Failure:** ${failure}`);
    }
  }

  return lines.join('\n');
}

export async function getOverseerIncapacitations(): Promise<string> {
  await loadOverseerEnhancements();
  if (!overseerIncapNames || overseerIncapNames.size === 0) return 'Overseer incapacitation data not available.';

  const JOB_TYPE_NAMES: Record<number, string> = {
    1: 'Marauder (Plunder)', 2: 'Spy (Stealth)', 3: 'Soldier (Military)',
    4: 'Artisan (Crafting)', 5: 'Harvester (Harvesting)', 6: 'Scholar (Research)',
    7: 'Diplomat (Diplomacy)', 8: 'Merchant (Merchant)', 9: 'Explorer (Exploration)',
  };

  const lines = ['## Overseer Incapacitation Types', ''];

  // Group incapacitations by job type (1-9), showing unique types with durations
  const seen = new Set<number>();
  for (let jobType = 1; jobType <= 9; jobType++) {
    if (seen.has(jobType)) continue;
    seen.add(jobType);

    // Find the first entry with this job type
    const firstId = jobType; // IDs 1-9 are the first tier
    const name = overseerIncapNames.get(firstId);
    if (!name) continue;

    const desc = overseerIncapDescs?.get(firstId) || '';
    const jobName = JOB_TYPE_NAMES[jobType] || `Job ${jobType}`;

    lines.push(`### ${name}`);
    lines.push(`**Job Type:** ${jobName}`);
    lines.push(stripHtmlTags(desc));

    // Show durations across tiers
    if (overseerIncapDurations && overseerIncapDurations.size > 0) {
      const durations: number[] = [];
      for (const [, entry] of overseerIncapDurations) {
        if (entry.jobType === jobType && entry.duration > 0) {
          durations.push(entry.duration);
        }
      }
      if (durations.length > 0) {
        const uniqueDurations = [...new Set(durations)].sort((a, b) => a - b);
        const formatted = uniqueDurations.map(d => {
          const hours = d / 3600;
          if (hours >= 24) return `${(hours / 24).toFixed(1)}d`;
          return `${hours.toFixed(1)}h`;
        });
        lines.push(`**Durations:** ${formatted.join(', ')}`);
      }
    }
    lines.push('');
  }

  // Show "Released" if it exists (job type 10)
  const releasedName = overseerIncapNames.get(10);
  if (releasedName) {
    const releasedDesc = overseerIncapDescs?.get(10) || '';
    lines.push(`### ${releasedName}`);
    lines.push(stripHtmlTags(releasedDesc));
    lines.push('**Duration:** Instant (0)');
    lines.push('');
  }

  return lines.join('\n');
}

// ============ PUBLIC API: BONUS DESCRIPTIONS & AUGMENT GROUPS ============

export async function getHotZoneBonuses(): Promise<string> {
  await loadBonusAndAugmentData();
  if (!bonusDescriptions || bonusDescriptions.size === 0) return 'Bonus description data not available.';

  const lines = ['## Hot Zone / Bonus Effects', ''];

  const bonusTypes = [
    { id: 0, label: 'General Description' },
    { id: 1, label: 'Experience Bonus' },
    { id: 2, label: 'Loot Multiplier' },
    { id: 3, label: 'Faction Bonus' },
    { id: 4, label: 'Ability Experience' },
    { id: 5, label: 'Coin Multiplier' },
    { id: 6, label: 'Increased Spawns' },
    { id: 7, label: 'Currency Multiplier' },
    { id: 8, label: 'Tribute Potency' },
    { id: 9, label: 'Rare Spawns' },
    { id: 10, label: 'Item Experience' },
    { id: 11, label: 'Proficiency Rate' },
    { id: 12, label: 'Enhanced Tribute' },
    { id: 13, label: 'Collection Multiplier' },
    { id: 14, label: 'Mercenary Experience' },
    { id: 15, label: 'Fortune Bonus' },
  ];

  for (const bt of bonusTypes) {
    const desc = bonusDescriptions.get(bt.id);
    if (desc) {
      lines.push(`### ${bt.label}`);
      lines.push(desc);
      lines.push('');
    }
  }

  return lines.join('\n');
}

export async function searchAugmentGroups(query: string): Promise<SearchResult[]> {
  await loadBonusAndAugmentData();
  if (!augmentGroups || augmentGroups.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, name] of augmentGroups) {
    if (results.length >= 25) break;
    if (name.toLowerCase().includes(normalized)) {
      results.push({
        name,
        type: 'unknown' as const,
        id: id.toString(),
        url: `local://auggroup/${id}`,
        source: 'Local Game Data',
        description: `Augmentation group ID: ${id}`,
      });
    }
  }

  return results;
}

// ============ PUBLIC API: COMBAT ABILITIES ============

export async function searchCombatAbilities(query: string): Promise<SearchResult[]> {
  await loadCombatAbilities();
  if (!combatAbilities || combatAbilities.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, name] of combatAbilities) {
    if (results.length >= 25) break;
    if (name.toLowerCase().includes(normalized)) {
      results.push({
        name,
        type: 'spell' as const,
        id: id.toString(),
        url: `local://combat_ability/${id}`,
        source: 'Local Game Data',
        description: 'Combat Ability / Discipline',
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

// ============ PUBLIC API: MERCENARIES ============

export async function searchMercenaries(query: string): Promise<SearchResult[]> {
  await loadMercenaries();
  if (!mercenaries || mercenaries.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const [id, merc] of mercenaries) {
    if (results.length >= 25) break;
    if (merc.race.toLowerCase().includes(normalized) ||
        merc.type.toLowerCase().includes(normalized) ||
        merc.proficiency.toLowerCase().includes(normalized) ||
        merc.description.toLowerCase().includes(normalized)) {
      // Deduplicate by race+type+proficiency+tier combo
      const key = `${merc.race}|${merc.type}|${merc.proficiency}|${merc.tier}`;
      if (seen.has(key)) continue;
      seen.add(key);

      results.push({
        name: `${merc.race} ${merc.type} (${merc.proficiency}, ${merc.tier})`,
        type: 'npc' as const,
        id: id.toString(),
        url: `local://mercenary/${id}`,
        source: 'Local Game Data',
        description: `Confidence: ${merc.confidence}`,
      });
    }
  }

  return results;
}

export async function getMercenary(id: string): Promise<string> {
  await loadMercenaries();
  await loadMercenaryStances();
  if (!mercenaries) return 'Mercenary data not available.';

  const mercId = parseInt(id);
  const merc = mercenaries.get(mercId);
  if (!merc) return `Mercenary with ID ${id} not found.`;

  const lines = [
    `## ${merc.race} ${merc.type}`,
    '',
    `**Tier:** ${merc.tier}`,
    `**Proficiency:** ${merc.proficiency}`,
    `**Confidence:** ${merc.confidence}`,
    '',
    merc.description,
  ];

  // Add available stances
  if (mercenaryStances && mercenaryStances.size > 0) {
    lines.push('', '### Available Stances');
    for (const [, stance] of mercenaryStances) {
      lines.push(`- **${stance.name}:** ${stance.shortDesc}`);
    }
  }

  return lines.join('\n');
}

export async function getMercenaryStances(): Promise<string> {
  await loadMercenaryStances();
  if (!mercenaryStances || mercenaryStances.size === 0) return 'Mercenary stance data not available.';

  const lines = ['## Mercenary Stances', ''];

  for (const [, stance] of mercenaryStances) {
    lines.push(`### ${stance.name}`);
    lines.push(stance.description);
    lines.push('');
  }

  if (mercenaryTypes && mercenaryTypes.size > 0) {
    lines.push('## Mercenary Types', '');
    for (const [, name] of mercenaryTypes) {
      lines.push(`- ${name}`);
    }
    lines.push('');
  }

  if (mercenaryAbilities && mercenaryAbilities.size > 0) {
    lines.push('## Mercenary Abilities', '');
    for (const [, ability] of mercenaryAbilities) {
      lines.push(`### ${ability.name}`);
      if (ability.description) lines.push(ability.description);
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ============ PUBLIC API: RACE & CLASS INFO ============

export async function getRaceInfo(raceName: string): Promise<string> {
  await loadRaceClassInfo();
  await loadStartingCityLore();
  if (!raceDescriptions) return 'Race data not available.';

  // Resolve race ID
  const raceId = RACE_NAME_TO_ID[raceName.toLowerCase()];
  if (!raceId && raceId !== 0) {
    return `Unknown race: "${raceName}". Valid races: ${Object.values(RACE_IDS).join(', ')}`;
  }

  const name = RACE_IDS[raceId];
  const desc = raceDescriptions.get(raceId);
  if (!desc) return `No data found for race: ${name}`;

  const lines = [
    `## ${name}`,
    '',
    desc.long || desc.short,
    '',
  ];

  // Available classes
  const availableClasses = RACE_CLASSES[raceId];
  if (availableClasses) {
    lines.push(`**Available Classes:** ${availableClasses.map(id => CLASS_IDS[id]).join(', ')}`);
  }

  // Starting base stats
  const stats = RACE_BASE_STATS[raceId];
  if (stats) {
    const statStr = STAT_NAMES.map((name, i) => `${name}: ${stats[i]}`).join(', ');
    lines.push(`**Base Stats:** ${statStr}`);
  }

  // Available deities
  const deities = RACE_DEITIES[raceId];
  if (deities) {
    lines.push(`**Available Deities:** ${deities.join(', ')}`);
  }

  // Starting city lore
  const cityIds = RACE_STARTING_CITY_IDS[raceId];
  if (cityIds && startingCityLore) {
    const uniqueLore = new Set<string>();
    for (const cityId of cityIds) {
      const lore = startingCityLore.get(cityId);
      if (lore) uniqueLore.add(lore);
    }
    if (uniqueLore.size > 0) {
      lines.push('', '### Starting City');
      for (const lore of uniqueLore) {
        lines.push(lore);
      }
    }
  }

  // Drakkin heritages
  if (raceId === 522) {
    await loadDrakkinHeritages();
    if (drakkinHeritages && drakkinHeritages.length > 0) {
      lines.push('', '### Dragon Heritages');
      for (const h of drakkinHeritages) {
        const classNames = h.classes.map(c => CLASS_IDS[c]).filter(Boolean).join(', ');
        lines.push(`- **${h.name}** (Heritage ${h.id}) — Classes: ${classNames}`);
      }
    }
  }

  return lines.join('\n');
}

export async function compareRaces(race1: string, race2: string): Promise<string> {
  await loadRaceClassInfo();
  if (!raceDescriptions) return 'Race data not available.';

  const raceId1 = RACE_NAME_TO_ID[race1.toLowerCase()];
  const raceId2 = RACE_NAME_TO_ID[race2.toLowerCase()];

  if (!raceId1 && raceId1 !== 0) {
    return `Unknown race: "${race1}". Valid: ${Object.values(RACE_IDS).join(', ')}`;
  }
  if (!raceId2 && raceId2 !== 0) {
    return `Unknown race: "${race2}". Valid: ${Object.values(RACE_IDS).join(', ')}`;
  }

  const name1 = RACE_IDS[raceId1];
  const name2 = RACE_IDS[raceId2];
  const stats1 = RACE_BASE_STATS[raceId1];
  const stats2 = RACE_BASE_STATS[raceId2];
  const classes1 = new Set(RACE_CLASSES[raceId1] || []);
  const classes2 = new Set(RACE_CLASSES[raceId2] || []);
  const deities1 = new Set(RACE_DEITIES[raceId1] || []);
  const deities2 = new Set(RACE_DEITIES[raceId2] || []);

  const lines = [
    `## Race Comparison: ${name1} vs ${name2}`,
    '',
  ];

  // Stats comparison
  if (stats1 && stats2) {
    lines.push('### Base Stats');
    lines.push(`| Stat | ${name1} | ${name2} | Diff |`);
    lines.push('|------|' + '-'.repeat(name1.length + 2) + '|' + '-'.repeat(name2.length + 2) + '|------|');
    let total1 = 0, total2 = 0;
    for (let i = 0; i < STAT_NAMES.length; i++) {
      const v1 = stats1[i];
      const v2 = stats2[i];
      const diff = v1 - v2;
      const diffStr = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '—';
      lines.push(`| **${STAT_NAMES[i]}** | ${v1} | ${v2} | ${diffStr} |`);
      total1 += v1;
      total2 += v2;
    }
    const totalDiff = total1 - total2;
    const totalDiffStr = totalDiff > 0 ? `+${totalDiff}` : totalDiff < 0 ? `${totalDiff}` : '—';
    lines.push(`| **Total** | **${total1}** | **${total2}** | **${totalDiffStr}** |`);
    lines.push('');
  }

  // Classes comparison
  const allClasses = new Set([...classes1, ...classes2]);
  const sharedClasses: string[] = [];
  const only1Classes: string[] = [];
  const only2Classes: string[] = [];

  for (const cid of [...allClasses].sort()) {
    const cname = CLASS_IDS[cid];
    if (classes1.has(cid) && classes2.has(cid)) {
      sharedClasses.push(cname);
    } else if (classes1.has(cid)) {
      only1Classes.push(cname);
    } else {
      only2Classes.push(cname);
    }
  }

  lines.push('### Available Classes');
  if (sharedClasses.length > 0) {
    lines.push(`**Both:** ${sharedClasses.join(', ')}`);
  }
  if (only1Classes.length > 0) {
    lines.push(`**${name1} only:** ${only1Classes.join(', ')}`);
  }
  if (only2Classes.length > 0) {
    lines.push(`**${name2} only:** ${only2Classes.join(', ')}`);
  }
  lines.push('');

  // Deities comparison
  const allDeities = new Set([...deities1, ...deities2]);
  const sharedDeities: string[] = [];
  const only1Deities: string[] = [];
  const only2Deities: string[] = [];

  for (const deity of [...allDeities].sort()) {
    if (deities1.has(deity) && deities2.has(deity)) {
      sharedDeities.push(deity);
    } else if (deities1.has(deity)) {
      only1Deities.push(deity);
    } else {
      only2Deities.push(deity);
    }
  }

  lines.push('### Available Deities');
  if (sharedDeities.length > 0) {
    lines.push(`**Both:** ${sharedDeities.join(', ')}`);
  }
  if (only1Deities.length > 0) {
    lines.push(`**${name1} only:** ${only1Deities.join(', ')}`);
  }
  if (only2Deities.length > 0) {
    lines.push(`**${name2} only:** ${only2Deities.join(', ')}`);
  }

  return lines.join('\n');
}

export async function getClassInfo(className: string): Promise<string> {
  await loadRaceClassInfo();
  if (!classDescriptions) return 'Class data not available.';

  // Resolve class ID
  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  const name = CLASS_IDS[classId];
  const desc = classDescriptions.get(classId);
  if (!desc) return `No data found for class: ${name}`;

  const lines = [
    `## ${name} (${CLASS_SHORT[classId]})`,
    '',
    desc.long || desc.short,
    '',
  ];

  // Available races
  const availableRaces: string[] = [];
  for (const [raceId, classIds] of Object.entries(RACE_CLASSES)) {
    if (classIds.includes(classId)) {
      const raceName = RACE_IDS[parseInt(raceId)];
      if (raceName) availableRaces.push(raceName);
    }
  }
  if (availableRaces.length > 0) {
    lines.push(`**Available Races:** ${availableRaces.join(', ')}`);
  }

  return lines.join('\n');
}

export async function getDeityInfo(deityName: string): Promise<string> {
  await loadRaceClassInfo();

  const normalized = deityName.toLowerCase();

  // Find which races can worship this deity
  const racesForDeity: string[] = [];
  for (const [raceId, deities] of Object.entries(RACE_DEITIES)) {
    for (const d of deities) {
      if (d.toLowerCase().includes(normalized)) {
        const raceName = RACE_IDS[parseInt(raceId)];
        if (raceName) racesForDeity.push(raceName);
        break;
      }
    }
  }

  if (racesForDeity.length === 0) {
    // List all deities
    const allDeities = new Set<string>();
    for (const deities of Object.values(RACE_DEITIES)) {
      for (const d of deities) allDeities.add(d);
    }
    return `Unknown deity: "${deityName}". Valid deities: ${[...allDeities].sort().join(', ')}`;
  }

  // Find the actual deity name (properly cased)
  let properName = deityName;
  for (const deities of Object.values(RACE_DEITIES)) {
    for (const d of deities) {
      if (d.toLowerCase().includes(normalized)) {
        properName = d;
        break;
      }
    }
    if (properName !== deityName) break;
  }

  const lines = [
    `## ${properName}`,
    '',
  ];

  // Find deity lore description from dbstr type 14
  if (deityDescriptions) {
    for (const [deityId, desc] of deityDescriptions) {
      if (desc.toLowerCase().includes(properName.toLowerCase())) {
        lines.push(desc, '');
        break;
      }
    }
  }

  lines.push(`**Races that can worship ${properName}:** ${racesForDeity.join(', ')}`);

  return lines.join('\n');
}

export async function getStatInfo(statName?: string): Promise<string> {
  await loadRaceClassInfo();
  if (!statDescriptions || statDescriptions.size === 0) return 'Stat data not available.';

  if (statName) {
    // Find matching stat
    const normalized = statName.toLowerCase();
    for (const [name, desc] of statDescriptions) {
      if (name.toLowerCase().startsWith(normalized)) {
        return `## ${name}\n\n${desc}`;
      }
    }
    return `Unknown stat: "${statName}". Valid stats: ${[...statDescriptions.keys()].join(', ')}`;
  }

  // Show all stats
  const lines = ['## EverQuest Stats', ''];
  for (const [name, desc] of statDescriptions) {
    lines.push(`### ${name}`, desc, '');
  }
  return lines.join('\n');
}

// ============ PUBLIC API: ALTERNATE CURRENCIES ============

export async function searchAltCurrencies(query: string): Promise<SearchResult[]> {
  await loadAltCurrencies();
  if (!altCurrencies || altCurrencies.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, currency] of altCurrencies) {
    if (results.length >= 25) break;
    if (currency.name.toLowerCase().includes(normalized) ||
        currency.description.toLowerCase().includes(normalized)) {
      results.push({
        name: currency.name,
        type: 'unknown' as const,
        id: id.toString(),
        url: `local://currency/${id}`,
        source: 'Local Game Data',
        description: currency.description ? currency.description.substring(0, 120) + '...' : `Currency ID: ${id}`,
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

export async function listAltCurrencies(): Promise<string> {
  await loadAltCurrencies();
  if (!altCurrencies || altCurrencies.size === 0) return 'Alternate currency data not available.';

  const lines = ['## EverQuest Alternate Currencies', ''];
  const sorted = [...altCurrencies.entries()].sort((a, b) => a[0] - b[0]);
  for (const [id, currency] of sorted) {
    lines.push(`- **${currency.name}** (ID: ${id})${currency.description ? ` - ${currency.description}` : ''}`);
  }
  lines.push('', `*${altCurrencies.size} currencies total*`);
  return lines.join('\n');
}

// ============ PUBLIC API: TRIBUTES ============

export async function searchTributes(query: string): Promise<SearchResult[]> {
  await loadTributes();
  if (!tributes || tributes.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [id, tribute] of tributes) {
    if (results.length >= 25) break;
    if (tribute.name.toLowerCase().includes(normalized) ||
        tribute.description.toLowerCase().includes(normalized)) {
      results.push({
        name: `${tribute.name}${tribute.isGuild ? ' (Guild)' : ''}`,
        type: 'unknown' as const,
        id: id.toString(),
        url: `local://tribute/${id}`,
        source: 'Local Game Data',
        description: tribute.description.substring(0, 120) + (tribute.description.length > 120 ? '...' : ''),
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

export async function getTribute(id: string): Promise<string> {
  await loadTributes();
  if (!tributes) return 'Tribute data not available.';

  const tributeId = parseInt(id);
  const tribute = tributes.get(tributeId);
  if (!tribute) return `Tribute with ID ${id} not found.`;

  const lines = [
    `## ${tribute.name}`,
    '',
    `**Type:** ${tribute.isGuild ? 'Guild Tribute' : 'Personal Tribute'}`,
    '',
    tribute.description,
  ];

  return lines.join('\n');
}

// ============ PUBLIC API: ITEM EFFECTS ============

export async function searchItemEffects(query: string): Promise<SearchResult[]> {
  await loadItemEffects();
  if (!itemEffectDescs || itemEffectDescs.size === 0) return [];

  const normalized = query.toLowerCase();
  const results: SearchResult[] = [];
  const seen = new Set<number>();

  // First check word index for quick matches
  const queryWords = normalized.split(/\s+/).filter(w => w.length >= 3);
  if (queryWords.length > 0 && itemEffectIndex) {
    for (const word of queryWords) {
      const ids = itemEffectIndex.get(word) || [];
      for (const id of ids) {
        if (seen.has(id)) continue;
        seen.add(id);
        const desc = itemEffectDescs.get(id)!;
        if (desc.toLowerCase().includes(normalized)) {
          results.push({
            name: `Item Effect ${id}`,
            type: 'item' as const,
            id: id.toString(),
            url: `local://item-effect/${id}`,
            source: 'Local Game Data',
            description: desc.substring(0, 150) + (desc.length > 150 ? '...' : ''),
          });
        }
      }
    }
  }

  // Fall back to full scan if no index matches or too few results
  if (results.length < 10) {
    for (const [id, desc] of itemEffectDescs) {
      if (results.length >= 25) break;
      if (seen.has(id)) continue;
      if (desc.toLowerCase().includes(normalized)) {
        results.push({
          name: `Item Effect ${id}`,
          type: 'item' as const,
          id: id.toString(),
          url: `local://item-effect/${id}`,
          source: 'Local Game Data',
          description: desc.substring(0, 150) + (desc.length > 150 ? '...' : ''),
        });
      }
    }
  }

  return results.slice(0, 25);
}

export async function getItemEffect(id: string): Promise<string> {
  await loadItemEffects();
  if (!itemEffectDescs) return 'Item effect data not available.';

  const effectId = parseInt(id);
  const desc = itemEffectDescs.get(effectId);
  if (!desc) return `Item effect with ID ${id} not found.`;

  return [
    `## Item Effect ${id}`,
    '',
    desc,
  ].join('\n');
}

// ============ PUBLIC API: ZONE MAP POIs ============

export async function getZoneMapPOIs(zoneName: string, query?: string): Promise<string> {
  const pois = await loadMapPOIs(zoneName);

  if (pois.length === 0) {
    return `No map data found for "${zoneName}". Make sure Brewall or standard map files are installed.`;
  }

  let filtered = pois;
  if (query) {
    const lower = query.toLowerCase();
    filtered = pois.filter(p => p.label.toLowerCase().includes(lower));
    if (filtered.length === 0) {
      return `No POIs matching "${query}" found in ${zoneName} (${pois.length} total POIs available).`;
    }
  }

  const lines = [
    `## Map POIs: ${zoneName}`,
    query ? `*Filtered by: "${query}"*` : '',
    '',
    `**Total POIs:** ${query ? `${filtered.length} matching / ${pois.length} total` : pois.length}`,
    '',
  ];

  // Group by label prefix (first word) for organization
  const sorted = [...filtered].sort((a, b) => a.label.localeCompare(b.label));

  for (const poi of sorted.slice(0, 100)) {
    const coords = `(${poi.x.toFixed(0)}, ${poi.y.toFixed(0)}${poi.z ? `, ${poi.z.toFixed(0)}` : ''})`;
    lines.push(`- **${poi.label}** ${coords}`);
  }

  if (sorted.length > 100) {
    lines.push(``, `*... and ${sorted.length - 100} more POIs. Use a search query to filter.*`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: LOCAL ZONE SEARCH ============

export async function searchZonesByName(query: string, levelMin?: number, levelMax?: number): Promise<string> {
  await loadZones();
  if (!zones || zones.size === 0) return 'Zone data not available.';

  const normalized = query.toLowerCase();
  const matches: LocalZone[] = [];

  for (const [, zone] of zones) {
    const nameMatch = zone.name.toLowerCase().includes(normalized);
    if (!nameMatch) continue;

    // Optional level range filter
    if (levelMin !== undefined && zone.levelMax > 0 && zone.levelMax < levelMin) continue;
    if (levelMax !== undefined && zone.levelMin > 0 && zone.levelMin > levelMax) continue;

    matches.push(zone);
  }

  if (matches.length === 0) {
    return `No zones matching "${query}"${levelMin || levelMax ? ` in level range ${levelMin || 1}-${levelMax || 'max'}` : ''}.`;
  }

  // Sort by level range, then name
  matches.sort((a, b) => (a.levelMin || 0) - (b.levelMin || 0) || a.name.localeCompare(b.name));

  const lines = [`## Zones matching "${query}"`, ''];
  if (levelMin || levelMax) {
    lines.push(`*Level filter: ${levelMin || 1}-${levelMax || 'max'}*`, '');
  }
  lines.push(`**Found:** ${matches.length} zone${matches.length !== 1 ? 's' : ''}`, '');

  for (const zone of matches.slice(0, 50)) {
    const levelStr = zone.levelMin > 0 || zone.levelMax > 0
      ? ` (${zone.levelMin}-${zone.levelMax})`
      : '';
    lines.push(`- **${zone.name}**${levelStr} [ID: ${zone.id}]`);
  }

  if (matches.length > 50) {
    lines.push('', `*... and ${matches.length - 50} more zones. Refine your search.*`);
  }

  return lines.join('\n');
}

export async function searchLocalZonesByLevel(levelMin: number, levelMax: number): Promise<string> {
  await loadZones();
  if (!zones || zones.size === 0) return 'Zone data not available.';

  const matches: LocalZone[] = [];

  for (const [, zone] of zones) {
    if (zone.levelMin === 0 && zone.levelMax === 0) continue; // Skip zones without level data
    if (zone.levelMax < levelMin) continue;
    if (zone.levelMin > levelMax) continue;
    matches.push(zone);
  }

  if (matches.length === 0) {
    return `No zones found for level range ${levelMin}-${levelMax}.`;
  }

  matches.sort((a, b) => (a.levelMin || 0) - (b.levelMin || 0) || a.name.localeCompare(b.name));

  const lines = [`## Zones for Level ${levelMin}-${levelMax}`, '', `**Found:** ${matches.length} zone${matches.length !== 1 ? 's' : ''}`, ''];

  for (const zone of matches.slice(0, 50)) {
    lines.push(`- **${zone.name}** (${zone.levelMin}-${zone.levelMax}) [ID: ${zone.id}]`);
  }

  if (matches.length > 50) {
    lines.push('', `*... and ${matches.length - 50} more zones.*`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: TELEPORT SPELL SEARCH ============

export async function searchTeleportSpells(zoneName: string): Promise<string> {
  await loadSpells();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const normalized = zoneName.toLowerCase();
  const matches: { id: number; name: string; zone: string }[] = [];

  for (const [id, spell] of spells) {
    const f = spell.fields;
    if (f.length <= 3) continue;
    const tz = f[SF.TELEPORT_ZONE]?.trim();
    if (!tz || !/^[a-z_]+[a-z0-9_]*$/.test(tz)) continue;
    if (tz.includes(normalized) || spell.name.toLowerCase().includes(normalized)) {
      matches.push({ id, name: spell.name, zone: tz });
    }
  }

  if (matches.length === 0) {
    return `No teleport spells found for "${zoneName}".`;
  }

  // Sort by zone then name
  matches.sort((a, b) => a.zone.localeCompare(b.zone) || a.name.localeCompare(b.name));

  const lines = [`## Teleport Spells: "${zoneName}"`, '', `**Found:** ${matches.length} spell${matches.length !== 1 ? 's' : ''}`, ''];

  // Group by zone
  let currentZone = '';
  for (const m of matches.slice(0, 100)) {
    if (m.zone !== currentZone) {
      currentZone = m.zone;
      lines.push(`### ${currentZone}`);
    }
    lines.push(`- ${m.name} [ID: ${m.id}]`);
  }

  if (matches.length > 100) {
    lines.push('', `*... and ${matches.length - 100} more spells.*`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: BANNER/CAMPSITE CATEGORIES ============

export async function getBannerCategories(): Promise<string> {
  await loadBannerCategories();

  const lines = ['## Guild Banner & Campsite Categories', ''];

  if (bannerCategories && bannerCategories.size > 0) {
    lines.push('### Guild Banner Categories');
    for (const [id, desc] of bannerCategories) {
      lines.push(`- ${desc} (ID: ${id})`);
    }
    lines.push('');
  }

  if (campsiteCategories && campsiteCategories.size > 0) {
    lines.push('### Fellowship Campsite Categories');
    for (const [id, desc] of campsiteCategories) {
      lines.push(`- ${desc} (ID: ${id})`);
    }
    lines.push('');
  }

  if ((!bannerCategories || bannerCategories.size === 0) && (!campsiteCategories || campsiteCategories.size === 0)) {
    return 'Banner/campsite category data not available.';
  }

  return lines.join('\n');
}

// ============ PUBLIC API: SPELL CATEGORIES ============

export async function listSpellCategories(): Promise<string> {
  await loadSpellDescriptions();
  if (!spellCategories || spellCategories.size === 0) return 'Spell category data not available.';

  const lines = ['## Spell Categories', ''];
  const sorted = [...spellCategories.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  for (const [id, name] of sorted) {
    lines.push(`- ${name} (ID: ${id})`);
  }
  lines.push('', `*${sorted.length} categories total — use with get_spells_by_class category filter*`);
  return lines.join('\n');
}

// ============ PUBLIC API: EXPANSION LIST ============

async function loadExpansions(): Promise<void> {
  if (expansionNames !== null) return;
  await loadDbStrings([DBSTR_TYPES.EXPANSION_NAME]);
  expansionNames = dbStrings?.get(DBSTR_TYPES.EXPANSION_NAME) || new Map();
  console.error(`[LocalData] Loaded ${expansionNames.size} expansion names`);
}

export async function listExpansions(): Promise<string> {
  await loadExpansions();
  if (!expansionNames || expansionNames.size === 0) return 'Expansion data not available.';

  const lines = ['## EverQuest Expansions', ''];
  const sorted = [...expansionNames.entries()].sort((a, b) => a[0] - b[0]);
  for (const [id, name] of sorted) {
    lines.push(`${id}. ${name}`);
  }
  lines.push('', `*${sorted.length} expansions total*`);
  return lines.join('\n');
}

export function getExpansionName(id: number): string | undefined {
  return expansionNames?.get(id);
}

export async function getExpansionContent(expansionQuery: string): Promise<string> {
  await loadExpansions();
  await loadFactions();
  await loadAchievementCategories();

  if (!expansionNames || expansionNames.size === 0) return 'Expansion data not available.';

  // Find matching expansion
  const normalized = expansionQuery.toLowerCase();
  let matchedExpansion: { id: number; name: string } | null = null;

  // Try exact match first
  for (const [id, name] of expansionNames) {
    if (name.toLowerCase() === normalized) {
      matchedExpansion = { id, name };
      break;
    }
  }

  // Try partial match
  if (!matchedExpansion) {
    for (const [id, name] of expansionNames) {
      if (name.toLowerCase().includes(normalized)) {
        matchedExpansion = { id, name };
        break;
      }
    }
  }

  // Try by number
  if (!matchedExpansion) {
    const num = parseInt(expansionQuery);
    if (!isNaN(num) && expansionNames.has(num)) {
      matchedExpansion = { id: num, name: expansionNames.get(num)! };
    }
  }

  if (!matchedExpansion) {
    return `Expansion not found: "${expansionQuery}". Use list_expansions to see all expansions.`;
  }

  const lines = [
    `## ${matchedExpansion.name} (Expansion ${matchedExpansion.id})`,
    '',
  ];

  // Factions for this expansion
  if (factions && factions.size > 0) {
    const expansionFactions: { id: number; name: string }[] = [];
    for (const [id, faction] of factions) {
      if (faction.category && faction.category.toLowerCase() === matchedExpansion.name.toLowerCase()) {
        expansionFactions.push({ id, name: faction.name });
      }
    }
    if (expansionFactions.length > 0) {
      expansionFactions.sort((a, b) => a.name.localeCompare(b.name));
      lines.push(`### Factions (${expansionFactions.length})`);
      for (const f of expansionFactions) {
        lines.push(`- ${f.name} (ID: ${f.id})`);
      }
      lines.push('');
    }
  }

  // Achievement categories for this expansion
  if (achievementCategories && categoryToAchievements) {
    // Find top-level category matching this expansion
    const matchingCats: AchievementCategory[] = [];
    for (const [, cat] of achievementCategories) {
      if (cat.parentId === 0 && cat.name.toLowerCase() === matchedExpansion.name.toLowerCase()) {
        matchingCats.push(cat);
      }
    }

    if (matchingCats.length > 0) {
      for (const topCat of matchingCats) {
        // Find subcategories
        const subcats: { cat: AchievementCategory; count: number }[] = [];
        let totalAchievements = 0;

        for (const [, cat] of achievementCategories) {
          if (cat.parentId === topCat.id) {
            const achievementIds = categoryToAchievements.get(cat.id) || [];
            subcats.push({ cat, count: achievementIds.length });
            totalAchievements += achievementIds.length;
          }
        }

        // Also count achievements directly in top-level category
        const directIds = categoryToAchievements.get(topCat.id) || [];
        totalAchievements += directIds.length;

        lines.push(`### Achievements (${totalAchievements})`);
        if (subcats.length > 0) {
          subcats.sort((a, b) => a.cat.order - b.cat.order);
          for (const { cat, count } of subcats) {
            lines.push(`- **${cat.name}** — ${count} achievements`);
          }
        }
        if (directIds.length > 0) {
          lines.push(`- *(${directIds.length} uncategorized)*`);
        }
        lines.push('');
      }
    }
  }

  if (lines.length <= 2) {
    lines.push('*No faction or achievement data found for this expansion.*');
  }

  return lines.join('\n');
}

// ============ PUBLIC API: GAME EVENTS ============

async function loadGameEvents(): Promise<void> {
  if (gameEvents !== null) return;
  await loadDbStrings([DBSTR_TYPES.EVENT_BANNER, DBSTR_TYPES.EVENT_DESCRIPTION]);
  const banners = dbStrings?.get(DBSTR_TYPES.EVENT_BANNER) || new Map<number, string>();
  const descriptions = dbStrings?.get(DBSTR_TYPES.EVENT_DESCRIPTION) || new Map<number, string>();

  gameEvents = new Map();
  gameEventIndex = new Map();

  const allIds = new Set([...banners.keys(), ...descriptions.keys()]);
  for (const id of allIds) {
    const banner = banners.get(id) || '';
    const rawDesc = descriptions.get(id) || '';
    const description = stripHtmlTags(rawDesc.replace(/<c\s+"[^"]*">/gi, '').replace(/<\/c>/gi, ''));
    if (!banner && !description) continue;
    gameEvents.set(id, { banner, description });

    // Build word index
    const text = `${banner} ${description}`.toLowerCase();
    const words = text.split(/\W+/).filter(w => w.length > 2);
    for (const word of new Set(words)) {
      const existing = gameEventIndex!.get(word) || [];
      existing.push(id);
      gameEventIndex!.set(word, existing);
    }
  }
  console.error(`[LocalData] Loaded ${gameEvents.size} game events`);
}

export async function searchGameEvents(query: string): Promise<SearchResult[]> {
  await loadGameEvents();
  if (!gameEvents || !gameEventIndex) return [];

  const results: SearchResult[] = [];
  const normalizedQuery = normalizeQuery(query);
  const lowerQuery = normalizedQuery.toLowerCase();
  const queryWords = lowerQuery.split(/\W+/).filter(w => w.length > 2);

  // Word index search
  const idScores = new Map<number, number>();
  for (const word of queryWords) {
    for (const [indexWord, ids] of gameEventIndex) {
      if (indexWord.includes(word) || word.includes(indexWord)) {
        for (const id of ids) {
          idScores.set(id, (idScores.get(id) || 0) + 1);
        }
      }
    }
  }

  // Substring fallback
  if (idScores.size === 0) {
    for (const [id, event] of gameEvents) {
      const text = `${event.banner} ${event.description}`.toLowerCase();
      if (text.includes(lowerQuery)) {
        idScores.set(id, 1);
      }
    }
  }

  const sorted = [...idScores.entries()].sort((a, b) => b[1] - a[1]);
  for (const [id] of sorted.slice(0, 20)) {
    const event = gameEvents.get(id);
    if (!event) continue;
    results.push({
      name: event.banner || `Event ${id}`,
      type: 'event',
      id: String(id),
      source: 'Local Game Data',
      url: '',
    });
  }

  return results;
}

export async function getGameEvent(id: string): Promise<string> {
  await loadGameEvents();
  if (!gameEvents) return 'Game event data not available.';

  const eventId = parseInt(id);
  const event = gameEvents.get(eventId);
  if (!event) return `Game event with ID ${id} not found.`;

  const lines = [`## ${event.banner || `Event ${eventId}`}`, ''];
  if (event.description) {
    lines.push(event.description.trim());
  }
  lines.push('', `*Event ID: ${eventId}*`);
  return lines.join('\n');
}

// ============ CREATURE RACE TYPES ============

async function loadCreatureTypes(): Promise<void> {
  if (creatureTypes !== null) return;

  creatureTypes = new Map();
  creatureTypeIndex = new Map();
  if (!isGameDataAvailable()) return;

  await loadDbStrings([DBSTR_TYPES.CREATURE_RACE]);
  const races: Map<number, string> = dbStrings?.get(DBSTR_TYPES.CREATURE_RACE) || new Map();

  for (const [id, name] of races) {
    if (!name || name === 'UNKNOWN RACE') continue;
    creatureTypes.set(id, name);

    // Build word index
    const words = name.toLowerCase().split(/\W+/).filter((w: string) => w.length > 2);
    for (const word of new Set(words)) {
      const existing = creatureTypeIndex!.get(word) || [];
      existing.push(id);
      creatureTypeIndex!.set(word, existing);
    }
  }
  console.error(`[LocalData] Loaded ${creatureTypes.size} creature race types`);
}

export async function searchCreatureTypes(query: string): Promise<string> {
  await loadCreatureTypes();
  if (!creatureTypes || creatureTypes.size === 0) return 'Creature type data not available.';

  const lowerQuery = query.toLowerCase().trim();
  const matches: { id: number; name: string; score: number }[] = [];

  // Word index search
  const queryWords = lowerQuery.split(/\W+/).filter(w => w.length > 2);
  const idScores = new Map<number, number>();

  if (queryWords.length > 0 && creatureTypeIndex) {
    for (const word of queryWords) {
      for (const [indexWord, ids] of creatureTypeIndex) {
        if (indexWord.includes(word) || word.includes(indexWord)) {
          for (const id of ids) {
            idScores.set(id, (idScores.get(id) || 0) + 1);
          }
        }
      }
    }
  }

  // Also do direct substring matching on full names
  for (const [id, name] of creatureTypes) {
    const lowerName = name.toLowerCase();
    let score = idScores.get(id) || 0;
    if (lowerName === lowerQuery) score += 10;
    else if (lowerName.startsWith(lowerQuery)) score += 5;
    else if (lowerName.includes(lowerQuery)) score += 3;
    if (score > 0) matches.push({ id, name, score });
  }

  if (matches.length === 0) {
    // Fuzzy fallback
    for (const [id, name] of creatureTypes) {
      if (fuzzyMatch(name, query)) {
        matches.push({ id, name, score: 1 });
      }
    }
  }

  matches.sort((a, b) => b.score - a.score);
  const limited = matches.slice(0, 50);

  if (limited.length === 0) return `No creature types found matching "${query}".`;

  const lines = [`## Creature/NPC Race Types matching "${query}"`, '', `Found ${limited.length} of ${matches.length} matches:`, ''];
  for (const m of limited) {
    lines.push(`- **${m.name}** (Race ID: ${m.id})`);
  }

  lines.push('', `*${creatureTypes.size} total creature types available*`);
  return lines.join('\n');
}

// ============ STARTING CITY LORE ============

async function loadStartingCityLore(): Promise<void> {
  if (startingCityLore !== null) return;

  startingCityLore = new Map();
  if (!isGameDataAvailable()) return;

  await loadDbStrings([DBSTR_TYPES.STARTING_CITY]);
  const cities = dbStrings?.get(DBSTR_TYPES.STARTING_CITY) || new Map();
  for (const [id, text] of cities) {
    if (text) startingCityLore.set(id, text);
  }
  console.error(`[LocalData] Loaded ${startingCityLore.size} starting city descriptions`);
}

// ============ DRAKKIN HERITAGES ============

async function loadDrakkinHeritages(): Promise<void> {
  if (drakkinHeritages !== null) return;

  drakkinHeritages = [];
  if (!isGameDataAvailable()) return;

  try {
    const data = await readGameFile(join('Resources', 'playercustomization.txt'));
    const seen = new Set<number>();

    for (const line of data.split('\n')) {
      if (!line.trim() || line.startsWith('#')) continue;
      const fields = line.split('^');
      if (fields.length < 5) continue;

      const raceId = parseInt(fields[0]);
      if (raceId !== 522) continue; // Drakkin only

      const heritageId = parseInt(fields[1]);
      if (isNaN(heritageId) || seen.has(heritageId)) continue;
      seen.add(heritageId);

      const name = fields[2] || '';
      if (!name) continue;

      // Parse class list
      const classStr = fields[4] || '';
      const classes = classStr.split(',').map(c => parseInt(c.trim())).filter(c => !isNaN(c));

      drakkinHeritages.push({ id: heritageId, name, classes });
    }
  } catch {
    // playercustomization.txt not available
  }
  console.error(`[LocalData] Loaded ${drakkinHeritages.length} Drakkin heritages`);
}



// ============ PUBLIC API: HELP TOPICS ============

let helpTopics: Map<string, { title: string; filename: string }> | null = null;

async function loadHelpTopics(): Promise<void> {
  if (helpTopics !== null) return;
  helpTopics = new Map();

  if (!isGameDataAvailable()) return;

  const helpDir = join(EQ_GAME_PATH, 'Help');
  if (!existsSync(helpDir)) return;

  try {
    const files = await readdir(helpDir);
    for (const file of files) {
      if (!file.endsWith('.html')) continue;
      const topic = file.replace('.html', '');
      try {
        const content = await readFile(join(helpDir, file), 'utf8');
        // Extract title from <c "#ffff00"> Title </c>
        const titleMatch = content.match(/<c\s+"#ffff00">\s*(.+?)\s*<\/c>/i);
        const title = titleMatch ? titleMatch[1].trim() : topic;
        helpTopics!.set(topic, { title, filename: file });
      } catch {
        helpTopics!.set(topic, { title: topic, filename: file });
      }
    }
    console.error(`[LocalData] Loaded ${helpTopics.size} help topics`);
  } catch (error) {
    console.error('[LocalData] Failed to load help topics:', error instanceof Error ? error.message : error);
  }
}

function stripHelpHtml(html: string): string {
  return html
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<c\s+"#ffff00">\s*(.+?)\s*<\/c>/gi, '## $1')
    .replace(/<c\s+"#66CCFF">\s*(.+?)\s*<\/c>/gi, '**$1**')
    .replace(/<c\s+"[^"]*">\s*(.+?)\s*<\/c>/gi, '$1')
    .replace(/<a\s+href="file:\/\/\/help\/([^"]+)">\s*(.+?)\s*<\/a>/gi, '$2 [→ $1]')
    .replace(/<a\s+href="[^"]*">\s*(.+?)\s*<\/a>/gi, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function searchHelpTopics(query?: string): Promise<string> {
  await loadHelpTopics();
  if (!helpTopics || helpTopics.size === 0) return 'Help topics not available.';

  if (!query || query.trim() === '') {
    // List all topics
    const sorted = [...helpTopics.entries()].sort((a, b) => a[1].title.localeCompare(b[1].title));
    const lines = [
      `## EverQuest Help Topics (${sorted.length})`,
      '',
      ...sorted.map(([topic, { title }]) => `- **${title}** → \`${topic}\``),
    ];
    return lines.join('\n');
  }

  const normalized = query.toLowerCase();
  const matches: { topic: string; title: string; relevance: number }[] = [];

  for (const [topic, { title }] of helpTopics) {
    const lTitle = title.toLowerCase();
    const lTopic = topic.toLowerCase();
    if (lTitle === normalized || lTopic === normalized) {
      matches.push({ topic, title, relevance: 3 });
    } else if (lTitle.startsWith(normalized) || lTopic.startsWith(normalized)) {
      matches.push({ topic, title, relevance: 2 });
    } else if (lTitle.includes(normalized) || lTopic.includes(normalized)) {
      matches.push({ topic, title, relevance: 1 });
    }
  }

  if (matches.length === 0) {
    // Search within help file content
    const helpDir = join(EQ_GAME_PATH, 'Help');
    const contentMatches: { topic: string; title: string }[] = [];
    for (const [topic, { title, filename }] of helpTopics) {
      try {
        const content = await readFile(join(helpDir, filename), 'utf8');
        if (content.toLowerCase().includes(normalized)) {
          contentMatches.push({ topic, title });
        }
      } catch { /* skip */ }
    }
    if (contentMatches.length > 0) {
      const lines = [
        `## Help Topics mentioning "${query}" (${contentMatches.length})`,
        '',
        ...contentMatches.map(m => `- **${m.title}** → \`${m.topic}\``),
      ];
      return lines.join('\n');
    }
    return `No help topics found matching "${query}". Use search_help_topics without a query to list all topics.`;
  }

  matches.sort((a, b) => b.relevance - a.relevance);
  const lines = [
    `## Help Topics matching "${query}" (${matches.length})`,
    '',
    ...matches.map(m => `- **${m.title}** → \`${m.topic}\``),
  ];
  return lines.join('\n');
}

export async function getHelpTopic(topic: string): Promise<string> {
  await loadHelpTopics();
  if (!helpTopics || helpTopics.size === 0) return 'Help topics not available.';

  // Try exact match first
  const normalized = topic.toLowerCase().replace('.html', '');
  let entry = helpTopics.get(normalized);

  // Try fuzzy match
  if (!entry) {
    for (const [key, val] of helpTopics) {
      if (key.toLowerCase() === normalized || val.title.toLowerCase() === normalized) {
        entry = val;
        break;
      }
    }
  }

  // Try partial match
  if (!entry) {
    for (const [key, val] of helpTopics) {
      if (key.toLowerCase().includes(normalized) || val.title.toLowerCase().includes(normalized)) {
        entry = val;
        break;
      }
    }
  }

  if (!entry) {
    return `Help topic "${topic}" not found. Use search_help_topics to list available topics.`;
  }

  const helpDir = join(EQ_GAME_PATH, 'Help');
  try {
    const content = await readFile(join(helpDir, entry.filename), 'utf8');
    return stripHelpHtml(content);
  } catch (error) {
    return `Failed to read help topic: ${error instanceof Error ? error.message : error}`;
  }
}

// ============ PUBLIC API: SHARED SPELLS ============

export async function getSharedSpells(class1: string, class2: string, level?: number): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId1 = CLASS_NAME_TO_ID[class1.toLowerCase()];
  const classId2 = CLASS_NAME_TO_ID[class2.toLowerCase()];
  if (!classId1) return `Unknown class: "${class1}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  if (!classId2) return `Unknown class: "${class2}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  if (classId1 === classId2) return `Please specify two different classes to compare.`;

  const idx1 = classId1 - 1;
  const idx2 = classId2 - 1;
  const name1 = CLASS_IDS[classId1];
  const name2 = CLASS_IDS[classId2];

  const shared: { id: number; name: string; level1: number; level2: number; category?: string }[] = [];

  for (const [id, spell] of spells) {
    const lv1 = parseInt(spell.fields[SF.CLASS_LEVEL_START + idx1]);
    const lv2 = parseInt(spell.fields[SF.CLASS_LEVEL_START + idx2]);
    if (isNaN(lv1) || lv1 === 255 || lv1 <= 0) continue;
    if (isNaN(lv2) || lv2 === 255 || lv2 <= 0) continue;

    if (level !== undefined && (lv1 > level || lv2 > level)) continue;

    let cat: string | undefined;
    if (spellCategories) {
      const catId = parseInt(spell.fields[SF.CATEGORY]);
      if (!isNaN(catId) && catId > 0) cat = spellCategories.get(catId);
    }

    shared.push({ id, name: spell.name, level1: lv1, level2: lv2, category: cat });
  }

  shared.sort((a, b) => Math.min(a.level1, a.level2) - Math.min(b.level1, b.level2) || a.name.localeCompare(b.name));

  if (shared.length === 0) {
    return `No shared spells found between ${name1} and ${name2}${level ? ` at or below level ${level}` : ''}.`;
  }

  const lines = [
    `## Shared Spells: ${name1} & ${name2}${level ? ` (≤ Level ${level})` : ''}`,
    `*${shared.length} spells shared*`,
    '',
    `| Spell | ${name1} Lvl | ${name2} Lvl | Category |`,
    `|-------|------------|------------|----------|`,
  ];

  const limit = 150;
  for (let i = 0; i < Math.min(shared.length, limit); i++) {
    const s = shared[i];
    const lvDiff = s.level1 !== s.level2 ? ' ⚡' : '';
    lines.push(`| ${s.name} (${s.id}) | ${s.level1} | ${s.level2}${lvDiff} | ${s.category || '-'} |`);
  }

  if (shared.length > limit) {
    lines.push(`\n*...and ${shared.length - limit} more shared spells*`);
  }

  const sameLevelCount = shared.filter(s => s.level1 === s.level2).length;
  const class1Earlier = shared.filter(s => s.level1 < s.level2).length;
  const class2Earlier = shared.filter(s => s.level2 < s.level1).length;
  lines.push('');
  lines.push(`### Summary`);
  lines.push(`- Same level: ${sameLevelCount}`);
  lines.push(`- ${name1} gets earlier: ${class1Earlier}`);
  lines.push(`- ${name2} gets earlier: ${class2Earlier}`);

  return lines.join('\n');
}

// ============ PUBLIC API: SPELL LINE PROGRESSION ============

export async function getSpellLine(spellName: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  // Strip rank suffixes to find base name
  const baseName = spellName
    .replace(/\s+Rk\.\s*(II|III|IV|V|VI|VII|VIII|IX|X)\s*$/i, '')
    .replace(/\s+(II|III|IV|V|VI|VII|VIII|IX|X)\s*$/i, '')
    .trim();

  const lowerBase = baseName.toLowerCase();

  // Find all spells whose name starts with the base name + rank/version pattern
  const exactMatches: { id: number; name: string; classes: { className: string; level: number }[] }[] = [];

  for (const [id, spell] of spells) {
    const lowerName = spell.name.toLowerCase();
    if (lowerName === lowerBase ||
        lowerName.startsWith(lowerBase + ' rk.') ||
        (lowerName.startsWith(lowerBase + ' ') && /^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(spell.name.substring(baseName.length + 1).trim()))) {
      const classes: { className: string; level: number }[] = [];
      for (let i = 0; i < 16; i++) {
        const lv = parseInt(spell.fields[SF.CLASS_LEVEL_START + i]);
        if (!isNaN(lv) && lv !== 255 && lv > 0) {
          classes.push({ className: CLASS_IDS[i + 1], level: lv });
        }
      }
      if (classes.length > 0) {
        exactMatches.push({ id, name: spell.name, classes });
      }
    }
  }

  // If no exact matches, try broader substring search
  let results = exactMatches;
  if (results.length === 0) {
    for (const [id, spell] of spells) {
      if (spell.name.toLowerCase().includes(lowerBase)) {
        const classes: { className: string; level: number }[] = [];
        for (let i = 0; i < 16; i++) {
          const lv = parseInt(spell.fields[SF.CLASS_LEVEL_START + i]);
          if (!isNaN(lv) && lv !== 255 && lv > 0) {
            classes.push({ className: CLASS_IDS[i + 1], level: lv });
          }
        }
        if (classes.length > 0) {
          results.push({ id, name: spell.name, classes });
        }
      }
    }
  }

  if (results.length === 0) {
    return `No spell line found for "${spellName}".`;
  }

  // Sort by minimum class level
  results.sort((a, b) => {
    const minA = Math.min(...a.classes.map(c => c.level));
    const minB = Math.min(...b.classes.map(c => c.level));
    return minA - minB || a.name.localeCompare(b.name);
  });

  // Cap results
  if (results.length > 100) results = results.slice(0, 100);

  const lines = [
    `## Spell Line: ${baseName}`,
    `*${results.length} versions found*`,
    '',
  ];

  // Collect all classes that use this spell line
  const allClasses = new Set<string>();
  for (const r of results) {
    for (const c of r.classes) allClasses.add(c.className);
  }
  const classOrder = Object.values(CLASS_IDS).filter(c => allClasses.has(c));

  // Build table
  const classHeaders = classOrder.map(c => c.substring(0, 3)).join(' | ');
  const classDashes = classOrder.map(() => '---').join(' | ');
  lines.push(`| Spell | ${classHeaders} |`);
  lines.push(`|-------|${classDashes}|`);

  for (const r of results) {
    const classMap = new Map(r.classes.map(c => [c.className, c.level]));
    const classLevels = classOrder.map(c => {
      const lv = classMap.get(c);
      return lv !== undefined ? String(lv) : '-';
    }).join(' | ');
    lines.push(`| ${r.name} (${r.id}) | ${classLevels} |`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: BENEFICIAL/DETRIMENTAL SPELL SEARCH ============

export async function searchSpellsByBeneficial(className: string, beneficial: boolean, level?: number): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;

  const classIndex = classId - 1;
  const typeLabel = beneficial ? 'Beneficial (Buff)' : 'Detrimental (Debuff)';
  const matching: { id: number; name: string; level: number; category?: string; target: string }[] = [];

  for (const [id, spell] of spells) {
    const classLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
    if (isNaN(classLevel) || classLevel === 255 || classLevel <= 0) continue;
    if (level !== undefined && classLevel > level) continue;

    const isBeneficial = spell.fields[SF.BENEFICIAL] === '1';
    if (isBeneficial !== beneficial) continue;

    let cat: string | undefined;
    if (spellCategories) {
      const catId = parseInt(spell.fields[SF.CATEGORY]);
      if (!isNaN(catId) && catId > 0) cat = spellCategories.get(catId);
    }

    const targetId = parseInt(spell.fields[SF.TARGET_TYPE]);
    const target = TARGET_TYPES[targetId] || `Type ${targetId}`;

    matching.push({ id, name: spell.name, level: classLevel, category: cat, target });
  }

  matching.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  if (matching.length === 0) {
    return `No ${typeLabel.toLowerCase()} spells found for ${CLASS_IDS[classId]}${level ? ` at or below level ${level}` : ''}.`;
  }

  const lines = [
    `## ${CLASS_IDS[classId]} — ${typeLabel} Spells${level ? ` (≤ Level ${level})` : ''}`,
    `*${matching.length} spells found*`,
    '',
  ];

  // Group by category for summary
  const byCategory = new Map<string, number>();
  for (const s of matching) {
    const cat = s.category || 'Uncategorized';
    byCategory.set(cat, (byCategory.get(cat) || 0) + 1);
  }

  const sortedCats = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  lines.push('### By Category');
  for (const [cat, count] of sortedCats) {
    lines.push(`- **${cat}**: ${count}`);
  }
  lines.push('');

  // Show spells grouped by level
  let currentLevel = -1;
  let count = 0;
  for (const s of matching) {
    if (count >= 200) {
      lines.push(`\n*... and ${matching.length - count} more*`);
      break;
    }
    if (s.level !== currentLevel) {
      currentLevel = s.level;
      lines.push(`\n### Level ${currentLevel}`);
    }
    lines.push(`- **${s.name}** (${s.id}) — ${s.target}${s.category ? ` [${s.category}]` : ''}`);
    count++;
  }

  return lines.join('\n');
}

// ============ PUBLIC API: EXCLUSIVE SPELLS ============

export async function getExclusiveSpells(className: string, level?: number): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;

  const classIndex = classId - 1;
  const exclusive: { id: number; name: string; level: number; category?: string }[] = [];

  for (const [id, spell] of spells) {
    const classLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
    if (isNaN(classLevel) || classLevel === 255 || classLevel <= 0) continue;
    if (level !== undefined && classLevel > level) continue;

    // Check if no other class can use this spell
    let otherClassHas = false;
    for (let i = 0; i < 16; i++) {
      if (i === classIndex) continue;
      const lv = parseInt(spell.fields[SF.CLASS_LEVEL_START + i]);
      if (!isNaN(lv) && lv !== 255 && lv > 0) {
        otherClassHas = true;
        break;
      }
    }

    if (!otherClassHas) {
      let cat: string | undefined;
      if (spellCategories) {
        const catId = parseInt(spell.fields[SF.CATEGORY]);
        if (!isNaN(catId) && catId > 0) cat = spellCategories.get(catId);
      }
      exclusive.push({ id, name: spell.name, level: classLevel, category: cat });
    }
  }

  exclusive.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  if (exclusive.length === 0) {
    return `No exclusive spells found for ${CLASS_IDS[classId]}${level ? ` at or below level ${level}` : ''}.`;
  }

  const lines = [
    `## ${CLASS_IDS[classId]} — Exclusive Spells${level ? ` (≤ Level ${level})` : ''}`,
    `*${exclusive.length} spells only ${CLASS_IDS[classId]} can cast*`,
    '',
  ];

  // Category summary
  const byCategory = new Map<string, number>();
  for (const s of exclusive) {
    const cat = s.category || 'Uncategorized';
    byCategory.set(cat, (byCategory.get(cat) || 0) + 1);
  }
  const sortedCats = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  lines.push('### By Category');
  for (const [cat, count] of sortedCats) {
    lines.push(`- **${cat}**: ${count}`);
  }
  lines.push('');

  let currentLevel = -1;
  let count = 0;
  for (const s of exclusive) {
    if (count >= 200) {
      lines.push(`\n*... and ${exclusive.length - count} more*`);
      break;
    }
    if (s.level !== currentLevel) {
      currentLevel = s.level;
      lines.push(`\n### Level ${currentLevel}`);
    }
    lines.push(`- **${s.name}** (${s.id})${s.category ? ` [${s.category}]` : ''}`);
    count++;
  }

  return lines.join('\n');
}

// ============ PUBLIC API: CLASS COMPARISON ============

export async function compareClasses(class1: string, class2: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  await loadRaceClassInfo();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId1 = CLASS_NAME_TO_ID[class1.toLowerCase()];
  const classId2 = CLASS_NAME_TO_ID[class2.toLowerCase()];
  if (!classId1) return `Unknown class: "${class1}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  if (!classId2) return `Unknown class: "${class2}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  if (classId1 === classId2) return `Please specify two different classes to compare.`;

  const name1 = CLASS_IDS[classId1];
  const name2 = CLASS_IDS[classId2];
  const idx1 = classId1 - 1;
  const idx2 = classId2 - 1;

  // Races
  const races1 = new Set<string>();
  const races2 = new Set<string>();
  for (const [raceId, classIds] of Object.entries(RACE_CLASSES)) {
    const raceName = RACE_IDS[parseInt(raceId)];
    if (!raceName) continue;
    if (classIds.includes(classId1)) races1.add(raceName);
    if (classIds.includes(classId2)) races2.add(raceName);
  }

  const sharedRaces = [...races1].filter(r => races2.has(r));
  const uniqueRaces1 = [...races1].filter(r => !races2.has(r));
  const uniqueRaces2 = [...races2].filter(r => !races1.has(r));

  // Spell analysis
  let total1 = 0, total2 = 0, shared = 0;
  const cats1 = new Map<string, number>();
  const cats2 = new Map<string, number>();
  const catsShared = new Map<string, number>();

  for (const [, spell] of spells) {
    const lv1 = parseInt(spell.fields[SF.CLASS_LEVEL_START + idx1]);
    const lv2 = parseInt(spell.fields[SF.CLASS_LEVEL_START + idx2]);
    const has1 = !isNaN(lv1) && lv1 !== 255 && lv1 > 0;
    const has2 = !isNaN(lv2) && lv2 !== 255 && lv2 > 0;

    let cat = 'Uncategorized';
    if (spellCategories) {
      const catId = parseInt(spell.fields[SF.CATEGORY]);
      if (!isNaN(catId) && catId > 0) {
        cat = spellCategories.get(catId) || 'Uncategorized';
      }
    }

    if (has1) { total1++; cats1.set(cat, (cats1.get(cat) || 0) + 1); }
    if (has2) { total2++; cats2.set(cat, (cats2.get(cat) || 0) + 1); }
    if (has1 && has2) { shared++; catsShared.set(cat, (catsShared.get(cat) || 0) + 1); }
  }

  const lines = [
    `## Class Comparison: ${name1} vs ${name2}`,
    '',
    '### Races',
    `| | ${name1} | ${name2} |`,
    `|---|---|---|`,
    `| Total | ${races1.size} | ${races2.size} |`,
    `| Shared | ${sharedRaces.length} | ${sharedRaces.length} |`,
    '',
    `**Shared:** ${sharedRaces.join(', ') || 'None'}`,
    `**${name1} only:** ${uniqueRaces1.join(', ') || 'None'}`,
    `**${name2} only:** ${uniqueRaces2.join(', ') || 'None'}`,
    '',
    '### Spells',
    `| | ${name1} | ${name2} |`,
    `|---|---|---|`,
    `| Total spells | ${total1} | ${total2} |`,
    `| Shared spells | ${shared} | ${shared} |`,
    `| Exclusive spells | ${total1 - shared} | ${total2 - shared} |`,
    '',
  ];

  // Category comparison
  const allCats = new Set([...cats1.keys(), ...cats2.keys()]);
  const catComparison: { cat: string; c1: number; c2: number; s: number }[] = [];
  for (const cat of allCats) {
    catComparison.push({
      cat,
      c1: cats1.get(cat) || 0,
      c2: cats2.get(cat) || 0,
      s: catsShared.get(cat) || 0,
    });
  }
  catComparison.sort((a, b) => (b.c1 + b.c2) - (a.c1 + a.c2));

  lines.push('### Spell Categories');
  lines.push(`| Category | ${name1} | ${name2} | Shared |`);
  lines.push(`|----------|---|---|---|`);
  for (const c of catComparison.slice(0, 30)) {
    lines.push(`| ${c.cat} | ${c.c1} | ${c.c2} | ${c.s} |`);
  }
  if (catComparison.length > 30) {
    lines.push(`*...and ${catComparison.length - 30} more categories*`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: ADVANCED SPELL SEARCH ============

export async function searchSpellsAdvanced(criteria: {
  class?: string;
  minLevel?: number;
  maxLevel?: number;
  beneficial?: boolean;
  targetType?: string;
  resistType?: string;
  category?: string;
  nameContains?: string;
  hasEffect?: string;
}): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  // Resolve class
  let classId: number | undefined;
  let classIndex: number | undefined;
  if (criteria.class) {
    classId = CLASS_NAME_TO_ID[criteria.class.toLowerCase()];
    if (!classId) return `Unknown class: "${criteria.class}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
    classIndex = classId - 1;
  }

  // Resolve target type
  let targetTypeId: number | undefined;
  if (criteria.targetType) {
    const lowerTarget = criteria.targetType.toLowerCase();
    for (const [id, name] of Object.entries(TARGET_TYPES)) {
      if (name.toLowerCase().includes(lowerTarget)) {
        targetTypeId = parseInt(id);
        break;
      }
    }
    if (targetTypeId === undefined) {
      return `Unknown target type: "${criteria.targetType}". Valid: ${Object.values(TARGET_TYPES).join(', ')}`;
    }
  }

  // Resolve resist type
  let resistTypeId: number | undefined;
  if (criteria.resistType) {
    const lowerResist = criteria.resistType.toLowerCase();
    for (const [id, name] of Object.entries(RESIST_TYPES)) {
      if (name.toLowerCase() === lowerResist || name.toLowerCase().startsWith(lowerResist)) {
        resistTypeId = parseInt(id);
        break;
      }
    }
    if (resistTypeId === undefined) {
      return `Unknown resist type: "${criteria.resistType}". Valid: ${Object.values(RESIST_TYPES).join(', ')}`;
    }
  }

  // Resolve effect SPA
  let effectSPA: number | undefined;
  if (criteria.hasEffect) {
    const lowerEffect = criteria.hasEffect.toLowerCase();
    for (const [id, name] of Object.entries(SPA_NAMES)) {
      if (name.toLowerCase().includes(lowerEffect)) {
        effectSPA = parseInt(id);
        break;
      }
    }
  }

  const lowerCategory = criteria.category?.toLowerCase();
  const lowerName = criteria.nameContains?.toLowerCase();

  const matching: { id: number; name: string; level: number; category?: string; target: string; resist: string }[] = [];

  for (const [id, spell] of spells) {
    // Class filter
    let classLevel: number | undefined;
    if (classIndex !== undefined) {
      classLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
      if (isNaN(classLevel) || classLevel === 255 || classLevel <= 0) continue;
      if (criteria.minLevel !== undefined && classLevel < criteria.minLevel) continue;
      if (criteria.maxLevel !== undefined && classLevel > criteria.maxLevel) continue;
    }

    // Beneficial/detrimental
    if (criteria.beneficial !== undefined) {
      const isBeneficial = spell.fields[SF.BENEFICIAL] === '1';
      if (isBeneficial !== criteria.beneficial) continue;
    }

    // Target type
    if (targetTypeId !== undefined) {
      const spellTarget = parseInt(spell.fields[SF.TARGET_TYPE]);
      if (spellTarget !== targetTypeId) continue;
    }

    // Resist type
    if (resistTypeId !== undefined) {
      const spellResist = parseInt(spell.fields[SF.RESIST_TYPE]);
      if (spellResist !== resistTypeId) continue;
    }

    // Name filter
    if (lowerName && !spell.name.toLowerCase().includes(lowerName)) continue;

    // Category filter
    let cat: string | undefined;
    if (spellCategories) {
      const catId = parseInt(spell.fields[SF.CATEGORY]);
      if (!isNaN(catId) && catId > 0) cat = spellCategories.get(catId);
    }
    if (lowerCategory && !(cat?.toLowerCase().includes(lowerCategory))) continue;

    // Effect filter
    if (effectSPA !== undefined) {
      let hasEffect = false;
      for (let i = spell.fields.length - 1; i >= 0; i--) {
        if (spell.fields[i] === String(effectSPA)) {
          hasEffect = true;
          break;
        }
      }
      if (!hasEffect) continue;
    }

    const targetId = parseInt(spell.fields[SF.TARGET_TYPE]);
    const target = TARGET_TYPES[targetId] || `Type ${targetId}`;
    const resistId = parseInt(spell.fields[SF.RESIST_TYPE]);
    const resist = RESIST_TYPES[resistId] || `Type ${resistId}`;

    matching.push({
      id,
      name: spell.name,
      level: classLevel || 0,
      category: cat,
      target,
      resist,
    });
  }

  matching.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  // Build filter description
  const filters: string[] = [];
  if (classId) filters.push(`Class: ${CLASS_IDS[classId]}`);
  if (criteria.minLevel !== undefined) filters.push(`Min Level: ${criteria.minLevel}`);
  if (criteria.maxLevel !== undefined) filters.push(`Max Level: ${criteria.maxLevel}`);
  if (criteria.beneficial !== undefined) filters.push(criteria.beneficial ? 'Beneficial' : 'Detrimental');
  if (criteria.targetType) filters.push(`Target: ${TARGET_TYPES[targetTypeId!] || criteria.targetType}`);
  if (criteria.resistType) filters.push(`Resist: ${RESIST_TYPES[resistTypeId!] || criteria.resistType}`);
  if (criteria.category) filters.push(`Category: ${criteria.category}`);
  if (criteria.nameContains) filters.push(`Name: "${criteria.nameContains}"`);
  if (criteria.hasEffect) filters.push(`Effect: ${criteria.hasEffect}`);

  if (matching.length === 0) {
    return `No spells found matching: ${filters.join(', ')}.`;
  }

  const lines = [
    `## Advanced Spell Search`,
    `*Filters: ${filters.join(' | ')}*`,
    `*${matching.length} spells found*`,
    '',
  ];

  let count = 0;
  let currentLevel = -1;
  for (const s of matching) {
    if (count >= 150) {
      lines.push(`\n*... and ${matching.length - count} more*`);
      break;
    }
    if (classId && s.level !== currentLevel) {
      currentLevel = s.level;
      lines.push(`\n### Level ${currentLevel}`);
    }
    lines.push(`- **${s.name}** (${s.id}) — ${s.target} | ${s.resist}${s.category ? ` [${s.category}]` : ''}`);
    count++;
  }

  return lines.join('\n');
}

// ============ PUBLIC API: CLASS SPELL SUMMARY ============

export async function getClassSpellSummary(className: string): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;

  const classIndex = classId - 1;

  // Collect stats
  const byCategory = new Map<string, number>();
  const byTarget = new Map<string, number>();
  const byTier = new Map<string, number>(); // "1-10", "11-20", etc.
  let totalSpells = 0;
  let beneficialCount = 0;
  let detrimentalCount = 0;
  let maxLevel = 0;

  for (const [, spell] of spells) {
    const classLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]);
    if (isNaN(classLevel) || classLevel === 255 || classLevel <= 0) continue;

    totalSpells++;
    if (classLevel > maxLevel) maxLevel = classLevel;

    // Beneficial/detrimental
    if (spell.fields[SF.BENEFICIAL] === '1') beneficialCount++;
    else detrimentalCount++;

    // Category
    let cat = 'Uncategorized';
    if (spellCategories) {
      const catId = parseInt(spell.fields[SF.CATEGORY]);
      if (!isNaN(catId) && catId > 0) cat = spellCategories.get(catId) || 'Uncategorized';
    }
    byCategory.set(cat, (byCategory.get(cat) || 0) + 1);

    // Target
    const targetId = parseInt(spell.fields[SF.TARGET_TYPE]);
    const target = TARGET_TYPES[targetId] || `Type ${targetId}`;
    byTarget.set(target, (byTarget.get(target) || 0) + 1);

    // Level tier
    const tier = `${Math.floor((classLevel - 1) / 10) * 10 + 1}-${Math.floor((classLevel - 1) / 10) * 10 + 10}`;
    byTier.set(tier, (byTier.get(tier) || 0) + 1);
  }

  const lines = [
    `## ${CLASS_IDS[classId]} — Spell Book Summary`,
    '',
    `**Total Spells:** ${totalSpells}`,
    `**Beneficial (Buffs):** ${beneficialCount}`,
    `**Detrimental (Debuffs):** ${detrimentalCount}`,
    `**Max Spell Level:** ${maxLevel}`,
    '',
  ];

  // Level tiers
  const sortedTiers = [...byTier.entries()].sort((a, b) => {
    const aNum = parseInt(a[0]);
    const bNum = parseInt(b[0]);
    return aNum - bNum;
  });
  lines.push('### Spells by Level Range');
  lines.push('| Level Range | Count |');
  lines.push('|-------------|-------|');
  for (const [tier, count] of sortedTiers) {
    lines.push(`| ${tier} | ${count} |`);
  }
  lines.push('');

  // Top categories
  const sortedCats = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  lines.push('### Top Spell Categories');
  lines.push('| Category | Count |');
  lines.push('|----------|-------|');
  for (const [cat, count] of sortedCats.slice(0, 25)) {
    lines.push(`| ${cat} | ${count} |`);
  }
  if (sortedCats.length > 25) {
    lines.push(`*...and ${sortedCats.length - 25} more categories*`);
  }
  lines.push('');

  // Target types
  const sortedTargets = [...byTarget.entries()].sort((a, b) => b[1] - a[1]);
  lines.push('### By Target Type');
  lines.push('| Target | Count |');
  lines.push('|--------|-------|');
  for (const [target, count] of sortedTargets) {
    lines.push(`| ${target} | ${count} |`);
  }

  return lines.join('\n');
}

// ============ PUBLIC API: DEITY COMPARISON ============

export async function compareDeities(deity1: string, deity2: string): Promise<string> {
  await loadRaceClassInfo();
  await loadFactions(); // for faction data

  // Resolve deity names
  const allDeityNames = new Set<string>();
  for (const deities of Object.values(RACE_DEITIES)) {
    for (const d of deities) allDeityNames.add(d);
  }

  function findDeity(name: string): string | null {
    const lower = name.toLowerCase();
    for (const d of allDeityNames) {
      if (d.toLowerCase() === lower) return d;
    }
    for (const d of allDeityNames) {
      if (d.toLowerCase().includes(lower)) return d;
    }
    return null;
  }

  const name1 = findDeity(deity1);
  const name2 = findDeity(deity2);
  if (!name1) return `Unknown deity: "${deity1}". Valid: ${[...allDeityNames].sort().join(', ')}`;
  if (!name2) return `Unknown deity: "${deity2}". Valid: ${[...allDeityNames].sort().join(', ')}`;
  if (name1 === name2) return `Please specify two different deities to compare.`;

  // Find follower races
  const races1 = new Set<string>();
  const races2 = new Set<string>();
  for (const [raceId, deities] of Object.entries(RACE_DEITIES)) {
    const raceName = RACE_IDS[parseInt(raceId)];
    if (!raceName) continue;
    if (deities.includes(name1)) races1.add(raceName);
    if (deities.includes(name2)) races2.add(raceName);
  }

  const sharedRaces = [...races1].filter(r => races2.has(r));
  const uniqueRaces1 = [...races1].filter(r => !races2.has(r));
  const uniqueRaces2 = [...races2].filter(r => !races1.has(r));

  // Find available classes through races
  const classes1 = new Set<string>();
  const classes2 = new Set<string>();
  for (const [raceId, classIds] of Object.entries(RACE_CLASSES)) {
    const raceName = RACE_IDS[parseInt(raceId)];
    if (!raceName) continue;
    for (const cid of classIds) {
      if (races1.has(raceName)) classes1.add(CLASS_IDS[cid]);
      if (races2.has(raceName)) classes2.add(CLASS_IDS[cid]);
    }
  }

  const sharedClasses = [...classes1].filter(c => classes2.has(c));
  const uniqueClasses1 = [...classes1].filter(c => !classes2.has(c));
  const uniqueClasses2 = [...classes2].filter(c => !classes1.has(c));

  const lines = [
    `## Deity Comparison: ${name1} vs ${name2}`,
    '',
    '### Follower Races',
    `| | ${name1} | ${name2} |`,
    `|---|---|---|`,
    `| Total | ${races1.size} | ${races2.size} |`,
    `| Shared | ${sharedRaces.length} | ${sharedRaces.length} |`,
    '',
    `**Shared:** ${sharedRaces.join(', ') || 'None'}`,
    `**${name1} only:** ${uniqueRaces1.join(', ') || 'None'}`,
    `**${name2} only:** ${uniqueRaces2.join(', ') || 'None'}`,
    '',
    '### Available Classes (via follower races)',
    `| | ${name1} | ${name2} |`,
    `|---|---|---|`,
    `| Total | ${classes1.size} | ${classes2.size} |`,
    `| Shared | ${sharedClasses.length} | ${sharedClasses.length} |`,
    '',
    `**Shared:** ${sharedClasses.join(', ') || 'None'}`,
    `**${name1} only:** ${uniqueClasses1.join(', ') || 'None'}`,
    `**${name2} only:** ${uniqueClasses2.join(', ') || 'None'}`,
  ];

  // Lore descriptions
  if (deityDescriptions) {
    for (const [, desc] of deityDescriptions) {
      if (desc.toLowerCase().includes(name1.toLowerCase())) {
        lines.push('', `### ${name1} — Lore`, desc);
        break;
      }
    }
    for (const [, desc] of deityDescriptions) {
      if (desc.toLowerCase().includes(name2.toLowerCase())) {
        lines.push('', `### ${name2} — Lore`, desc);
        break;
      }
    }
  }

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
  lines.push(`- **Factions:** ${factions ? factions.size.toLocaleString() : 'Not loaded'}${factionCategories ? ` (${factionCategories.size} expansion categories)` : ''}`);
  lines.push(`- **AA Abilities:** ${aaAbilities ? aaAbilities.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Spell Stacking:** ${spellStacking ? spellStacking.size.toLocaleString() + ' spells' : 'Not loaded'}`);
  lines.push(`- **Spell Group Names:** ${spellGroupNames ? spellGroupNames.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Bonus Descriptions:** ${bonusDescriptions ? bonusDescriptions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Augment Groups:** ${augmentGroups ? augmentGroups.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **AC Mitigation:** ${acMitigation ? acMitigation.length.toLocaleString() + ' entries' : 'Not loaded'}`);
  lines.push(`- **Lore Stories:** ${loreEntries ? loreEntries.length.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Game Strings:** ${gameStrings ? gameStrings.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Overseer Minions:** ${overseerMinions ? overseerMinions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Overseer Quests:** ${overseerQuests ? overseerQuests.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Overseer Incapacitations:** ${overseerIncapNames ? overseerIncapNames.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Achievement Categories:** ${achievementCategories ? achievementCategories.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Achievement Components:** ${achievementComponents ? achievementComponents.size.toLocaleString() + ' achievements' : 'Not loaded'}`);
  lines.push(`- **Combat Abilities:** ${combatAbilities ? combatAbilities.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Mercenaries:** ${mercenaries ? mercenaries.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Mercenary Stances:** ${mercenaryStances ? mercenaryStances.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Mercenary Abilities:** ${mercenaryAbilities ? mercenaryAbilities.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Race Descriptions:** ${raceDescriptions ? raceDescriptions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Class Descriptions:** ${classDescriptions ? classDescriptions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Deity Descriptions:** ${deityDescriptions ? deityDescriptions.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Alternate Currencies:** ${altCurrencies ? altCurrencies.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Tributes:** ${tributes ? tributes.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Item Effects:** ${itemEffectDescs ? itemEffectDescs.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Banner Categories:** ${bannerCategories ? bannerCategories.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Expansions:** ${expansionNames ? expansionNames.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Game Events:** ${gameEvents ? gameEvents.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Creature Types:** ${creatureTypes ? creatureTypes.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Starting City Lore:** ${startingCityLore ? startingCityLore.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Drakkin Heritages:** ${drakkinHeritages ? drakkinHeritages.length.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Overseer Archetypes:** ${overseerArchetypeNames ? overseerArchetypeNames.size.toLocaleString() : 'Not loaded'}`);
  lines.push(`- **Map Cache:** ${mapCache.size} zones loaded`);

  return lines.join('\n');
}

// ============ LISTING TOOLS ============

export async function listAllRaces(): Promise<string> {
  await loadRaceClassInfo();

  const lines = ['# All Playable Races (16)', ''];
  lines.push('| Race | Classes | Deities | Base Stats (STR/STA/AGI/DEX/WIS/INT/CHA) |');
  lines.push('|------|---------|---------|------------------------------------------|');

  for (const [raceId, raceName] of Object.entries(RACE_IDS)) {
    const id = parseInt(raceId);
    const classes = (RACE_CLASSES[id] || []).map(cid => CLASS_IDS[cid] || '?');
    const deities = RACE_DEITIES[id] || [];
    const stats = RACE_BASE_STATS[id] || [];
    const statStr = stats.join('/');

    lines.push(`| **${raceName}** | ${classes.join(', ')} | ${deities.length} | ${statStr} |`);
  }

  lines.push('');
  lines.push('## Race Details');
  lines.push('');

  for (const [raceId, raceName] of Object.entries(RACE_IDS)) {
    const id = parseInt(raceId);
    const desc = raceDescriptions?.get(id);
    const classes = (RACE_CLASSES[id] || []).map(cid => CLASS_IDS[cid] || '?');
    const deities = RACE_DEITIES[id] || [];
    const stats = RACE_BASE_STATS[id] || [];

    lines.push(`### ${raceName}`);
    if (desc?.short) lines.push(desc.short);
    lines.push(`- **Classes (${classes.length}):** ${classes.join(', ')}`);
    lines.push(`- **Deities (${deities.length}):** ${deities.join(', ')}`);
    lines.push(`- **Base Stats:** STR ${stats[0]}, STA ${stats[1]}, AGI ${stats[2]}, DEX ${stats[3]}, WIS ${stats[4]}, INT ${stats[5]}, CHA ${stats[6]}`);
    lines.push('');
  }

  return lines.join('\n');
}

export async function listAllClasses(): Promise<string> {
  await loadRaceClassInfo();
  await loadSpells();

  const lines = ['# All Classes (16)', ''];
  lines.push('| Class | Short | Races | Spells | Type |');
  lines.push('|-------|-------|-------|--------|------|');

  // Count spells per class
  const spellCounts: Record<number, number> = {};
  if (spells) {
    for (const spell of spells.values()) {
      for (let i = 0; i < 16; i++) {
        const level = parseInt(spell.fields[SF.CLASS_LEVEL_START + i]) || 255;
        if (level > 0 && level < 255) {
          const classId = i + 1;
          spellCounts[classId] = (spellCounts[classId] || 0) + 1;
        }
      }
    }
  }

  // Classify as melee/hybrid/caster
  const meleeClasses = new Set([1, 7, 9, 16]); // WAR, MNK, ROG, BER
  const hybridClasses = new Set([3, 4, 5, 8, 10, 15]); // PAL, RNG, SHD, BRD, SHM, BST
  const casterClasses = new Set([2, 6, 11, 12, 13, 14]); // CLR, DRU, NEC, WIZ, MAG, ENC

  for (const [classId, className] of Object.entries(CLASS_IDS)) {
    const id = parseInt(classId);
    const short = CLASS_SHORT[id] || '???';
    const races: string[] = [];
    for (const [raceId, raceClasses] of Object.entries(RACE_CLASSES)) {
      if (raceClasses.includes(id)) {
        races.push(RACE_IDS[parseInt(raceId)] || '?');
      }
    }
    const count = spellCounts[id] || 0;
    const type = meleeClasses.has(id) ? 'Melee' : hybridClasses.has(id) ? 'Hybrid' : casterClasses.has(id) ? 'Caster' : '?';

    lines.push(`| **${className}** | ${short} | ${races.length} | ${count.toLocaleString()} | ${type} |`);
  }

  lines.push('');
  lines.push('## Class Details');
  lines.push('');

  for (const [classId, className] of Object.entries(CLASS_IDS)) {
    const id = parseInt(classId);
    const desc = classDescriptions?.get(id);
    const races: string[] = [];
    for (const [raceId, raceClasses] of Object.entries(RACE_CLASSES)) {
      if (raceClasses.includes(id)) {
        races.push(RACE_IDS[parseInt(raceId)] || '?');
      }
    }
    const count = spellCounts[id] || 0;

    lines.push(`### ${className} (${CLASS_SHORT[id]})`);
    if (desc?.short) lines.push(desc.short);
    lines.push(`- **Races (${races.length}):** ${races.join(', ')}`);
    lines.push(`- **Spells:** ${count.toLocaleString()}`);
    lines.push('');
  }

  return lines.join('\n');
}

export async function listAllDeities(): Promise<string> {
  await loadRaceClassInfo();

  const lines = ['# All EverQuest Deities', ''];

  // Collect unique deity names from all races
  const allDeities = new Set<string>();
  for (const deityList of Object.values(RACE_DEITIES)) {
    for (const d of deityList) allDeities.add(d);
  }

  // Sort alphabetically but put Agnostic first
  const sorted = Array.from(allDeities).sort((a, b) => {
    if (a === 'Agnostic') return -1;
    if (b === 'Agnostic') return 1;
    return a.localeCompare(b);
  });

  lines.push(`| Deity | Follower Races | Classes Available |`);
  lines.push(`|-------|---------------|-------------------|`);

  for (const deity of sorted) {
    const followerRaces: string[] = [];
    for (const [raceId, deities] of Object.entries(RACE_DEITIES)) {
      if (deities.includes(deity)) {
        followerRaces.push(RACE_IDS[parseInt(raceId)] || '?');
      }
    }
    // Derive unique classes from follower races
    const classSet = new Set<number>();
    for (const [raceId, deities] of Object.entries(RACE_DEITIES)) {
      if (deities.includes(deity)) {
        const raceClasses = RACE_CLASSES[parseInt(raceId)] || [];
        for (const c of raceClasses) classSet.add(c);
      }
    }

    lines.push(`| **${deity}** | ${followerRaces.join(', ')} | ${classSet.size} |`);
  }

  lines.push('');
  lines.push('## Deity Details');
  lines.push('');

  for (const deity of sorted) {
    const followerRaces: string[] = [];
    for (const [raceId, deities] of Object.entries(RACE_DEITIES)) {
      if (deities.includes(deity)) {
        followerRaces.push(RACE_IDS[parseInt(raceId)] || '?');
      }
    }
    const classSet = new Set<number>();
    for (const [raceId, deities] of Object.entries(RACE_DEITIES)) {
      if (deities.includes(deity)) {
        const raceClasses = RACE_CLASSES[parseInt(raceId)] || [];
        for (const c of raceClasses) classSet.add(c);
      }
    }
    const classNames = Array.from(classSet).sort((a, b) => a - b).map(c => CLASS_IDS[c] || '?');

    // Get deity lore from deityDescriptions (match by text content like getDeityInfo)
    let lore = '';
    if (deityDescriptions) {
      for (const [, desc] of deityDescriptions) {
        if (desc.toLowerCase().includes(deity.toLowerCase())) {
          lore = desc;
          break;
        }
      }
    }

    lines.push(`### ${deity}`);
    if (lore) lines.push(lore);
    lines.push(`- **Follower Races (${followerRaces.length}):** ${followerRaces.join(', ')}`);
    lines.push(`- **Available Classes (${classNames.length}):** ${classNames.join(', ')}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ============ AUGMENT SLOT TYPES ============

export async function listAugmentSlotTypes(): Promise<string> {
  await loadDbStrings([DBSTR_TYPES.AUGMENT_SLOT_TYPE]);
  const slotTypes = dbStrings?.get(DBSTR_TYPES.AUGMENT_SLOT_TYPE) || new Map();

  if (slotTypes.size === 0) return 'Augment slot type data not available.';

  const lines = [`# Augmentation Slot Types (${slotTypes.size})`, ''];
  lines.push('| ID | Slot Type |');
  lines.push('|----|-----------|');

  const sorted = Array.from(slotTypes.entries()).sort((a, b) => a[0] - b[0]);
  for (const [id, name] of sorted) {
    lines.push(`| ${id} | ${name} |`);
  }

  return lines.join('\n');
}

// ============ ITEM LORE GROUPS ============

export async function searchItemLoreGroups(query?: string): Promise<string> {
  await loadDbStrings([DBSTR_TYPES.ITEM_LORE_GROUP]);
  const loreGroups = dbStrings?.get(DBSTR_TYPES.ITEM_LORE_GROUP) || new Map();

  if (loreGroups.size === 0) return 'Item lore group data not available.';

  const lines: string[] = [];

  if (!query) {
    lines.push(`# Item Lore Groups (${loreGroups.size})`, '');
    lines.push('Item lore groups define which items are considered "LORE" duplicates — you can only carry one item from each lore group. Use a search query to filter.', '');
    lines.push('| ID | Lore Group |');
    lines.push('|----|------------|');
    const sorted = Array.from(loreGroups.entries()).sort((a, b) => a[0] - b[0]);
    for (const [id, name] of sorted.slice(0, 50)) {
      lines.push(`| ${id} | ${name} |`);
    }
    if (sorted.length > 50) {
      lines.push('', `*Showing first 50 of ${sorted.length}. Use a search query to filter.*`);
    }
  } else {
    const lowerQuery = query.toLowerCase();
    const matches: [number, string][] = [];
    for (const [id, name] of loreGroups) {
      if (name.toLowerCase().includes(lowerQuery)) {
        matches.push([id, name]);
      }
    }

    if (matches.length === 0) {
      return `No item lore groups matching "${query}".`;
    }

    lines.push(`# Item Lore Groups matching "${query}" (${matches.length})`, '');
    lines.push('| ID | Lore Group |');
    lines.push('|----|------------|');
    matches.sort((a, b) => a[1].localeCompare(b[1]));
    for (const [id, name] of matches) {
      lines.push(`| ${id} | ${name} |`);
    }
  }

  return lines.join('\n');
}

// ============ CLASS ABILITIES AT LEVEL ============

export async function getClassAbilitiesAtLevel(className: string, level: number): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  const classIndex = classId - 1;
  const classFullName = CLASS_IDS[classId];

  // Find spells at this exact level
  const spellsAtLevel: { name: string; category: string; beneficial: boolean; targetType: string }[] = [];

  for (const spell of spells.values()) {
    const spellLevel = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]) || 255;
    if (spellLevel !== level) continue;

    const name = spell.fields[SF.NAME];
    const categoryId = parseInt(spell.fields[SF.CATEGORY]) || 0;
    const category = spellCategories?.get(categoryId) || 'Unknown';
    const beneficial = spell.fields[SF.BENEFICIAL] === '1';
    const targetTypeId = parseInt(spell.fields[SF.TARGET_TYPE]) || 0;
    const targetType = TARGET_TYPES[targetTypeId] || 'Unknown';

    spellsAtLevel.push({ name, category, beneficial, targetType });
  }

  const lines = [`# ${classFullName} — Level ${level} Spells`, ''];

  if (spellsAtLevel.length === 0) {
    lines.push(`No spells available at exactly level ${level} for ${classFullName}.`);
    return lines.join('\n');
  }

  lines.push(`**${spellsAtLevel.length} spells obtained at level ${level}:**`, '');

  // Group by category
  const byCategory: Record<string, typeof spellsAtLevel> = {};
  for (const s of spellsAtLevel) {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(s);
  }

  const sortedCategories = Object.keys(byCategory).sort();
  for (const cat of sortedCategories) {
    const catSpells = byCategory[cat];
    lines.push(`### ${cat} (${catSpells.length})`);
    for (const s of catSpells.sort((a, b) => a.name.localeCompare(b.name))) {
      const type = s.beneficial ? 'buff' : 'debuff';
      lines.push(`- ${s.name} (${type}, ${s.targetType})`);
    }
    lines.push('');
  }

  // Summary
  const buffCount = spellsAtLevel.filter(s => s.beneficial).length;
  const debuffCount = spellsAtLevel.length - buffCount;
  lines.push(`**Summary:** ${buffCount} buffs, ${debuffCount} debuffs across ${sortedCategories.length} categories`);

  return lines.join('\n');
}

// ============ SPELL EFFECT TYPES REFERENCE ============

export function listSpellEffectTypes(): string {
  const lines = [`# Spell Effect Types (SPA) — ${Object.keys(SPA_NAMES).length} types`, ''];
  lines.push('Use these effect names with `search_spells_by_effect` to find spells by their effect type.', '');
  lines.push('| SPA ID | Effect Name |');
  lines.push('|--------|-------------|');

  // Filter out "Limit:" types which are focus/AA modifiers, not direct spell effects
  const directEffects: [number, string][] = [];
  const limitEffects: [number, string][] = [];

  for (const [id, name] of Object.entries(SPA_NAMES)) {
    if (name.startsWith('Limit:')) {
      limitEffects.push([parseInt(id), name]);
    } else {
      directEffects.push([parseInt(id), name]);
    }
  }

  lines.push('### Direct Spell Effects');
  lines.push('');
  for (const [id, name] of directEffects.sort((a, b) => a[0] - b[0])) {
    lines.push(`| ${id} | ${name} |`);
  }

  lines.push('');
  lines.push(`### Focus/AA Limit Effects (${limitEffects.length})`);
  lines.push('These are used in focus effects and AA abilities to restrict which spells they apply to.');
  lines.push('');
  for (const [id, name] of limitEffects.sort((a, b) => a[0] - b[0])) {
    lines.push(`| ${id} | ${name} |`);
  }

  return lines.join('\n');
}

// ============ CAST TIME SEARCH ============

export async function searchSpellsByCastTime(className: string, maxCastMs?: number, minCastMs?: number): Promise<string> {
  await loadSpells();
  await loadSpellDescriptions();
  if (!spells || spells.size === 0) return 'Spell data not available.';

  const classId = CLASS_NAME_TO_ID[className.toLowerCase()];
  if (!classId) {
    return `Unknown class: "${className}". Valid classes: ${Object.values(CLASS_IDS).join(', ')}`;
  }

  const classIndex = classId - 1;
  const classFullName = CLASS_IDS[classId];

  const matches: { name: string; level: number; castTime: number; category: string; beneficial: boolean }[] = [];

  for (const spell of spells.values()) {
    const level = parseInt(spell.fields[SF.CLASS_LEVEL_START + classIndex]) || 255;
    if (level <= 0 || level >= 255) continue;

    const castTime = parseInt(spell.fields[SF.CAST_TIME]) || 0; // in milliseconds
    if (maxCastMs !== undefined && castTime > maxCastMs) continue;
    if (minCastMs !== undefined && castTime < minCastMs) continue;

    const name = spell.fields[SF.NAME];
    const categoryId = parseInt(spell.fields[SF.CATEGORY]) || 0;
    const category = spellCategories?.get(categoryId) || 'Unknown';
    const beneficial = spell.fields[SF.BENEFICIAL] === '1';

    matches.push({ name, level, castTime, category, beneficial });
  }

  if (matches.length === 0) {
    const range = maxCastMs !== undefined && minCastMs !== undefined
      ? `${minCastMs}-${maxCastMs}ms`
      : maxCastMs !== undefined ? `≤${maxCastMs}ms` : `≥${minCastMs}ms`;
    return `No ${classFullName} spells with cast time ${range}.`;
  }

  // Sort by cast time, then level
  matches.sort((a, b) => a.castTime - b.castTime || a.level - b.level);

  const rangeDesc = maxCastMs !== undefined && minCastMs !== undefined
    ? `${minCastMs}-${maxCastMs}ms`
    : maxCastMs !== undefined ? `≤${maxCastMs}ms` : minCastMs !== undefined ? `≥${minCastMs}ms` : 'all';

  const lines = [`# ${classFullName} Spells — Cast Time ${rangeDesc}`, ''];
  lines.push(`**${matches.length} spells found**`, '');

  // Cap output at 100
  const shown = matches.slice(0, 100);
  lines.push('| Cast Time | Level | Spell | Category | Type |');
  lines.push('|-----------|-------|-------|----------|------|');

  for (const s of shown) {
    const timeStr = s.castTime === 0 ? 'Instant' : `${(s.castTime / 1000).toFixed(1)}s`;
    const type = s.beneficial ? 'Buff' : 'Debuff';
    lines.push(`| ${timeStr} | ${s.level} | ${s.name} | ${s.category} | ${type} |`);
  }

  if (matches.length > 100) {
    lines.push('', `*Showing first 100 of ${matches.length}. Narrow your search with level or cast time filters.*`);
  }

  return lines.join('\n');
}

// ============ RACE-CLASS MATRIX ============

export function getRaceClassMatrix(): string {
  const lines = ['# Race-Class Availability Matrix', ''];

  // Build header: Race | WAR | CLR | PAL | ...
  const classIds = Object.keys(CLASS_IDS).map(Number).sort((a, b) => a - b);
  const header = ['Race', ...classIds.map(id => CLASS_SHORT[id])];
  lines.push('| ' + header.join(' | ') + ' |');
  lines.push('|' + header.map(() => '---').join('|') + '|');

  for (const [raceId, raceName] of Object.entries(RACE_IDS)) {
    const id = parseInt(raceId);
    const raceClasses = RACE_CLASSES[id] || [];
    const cells = classIds.map(cid => raceClasses.includes(cid) ? 'X' : '-');
    lines.push(`| **${raceName}** | ${cells.join(' | ')} |`);
  }

  lines.push('');

  // Summary: count per class
  lines.push('### Races per Class');
  lines.push('');
  for (const cid of classIds) {
    let count = 0;
    for (const raceClasses of Object.values(RACE_CLASSES)) {
      if (raceClasses.includes(cid)) count++;
    }
    lines.push(`- **${CLASS_IDS[cid]}** (${CLASS_SHORT[cid]}): ${count} races`);
  }

  lines.push('');
  lines.push('### Classes per Race');
  lines.push('');
  for (const [raceId, raceName] of Object.entries(RACE_IDS)) {
    const count = (RACE_CLASSES[parseInt(raceId)] || []).length;
    lines.push(`- **${raceName}**: ${count} classes`);
  }

  return lines.join('\n');
}
