export const CLASS_LIST = [
  'Warrior', 'Cleric', 'Paladin', 'Ranger', 'Shadow Knight', 'Druid',
  'Monk', 'Bard', 'Rogue', 'Shaman', 'Necromancer', 'Wizard',
  'Magician', 'Enchanter', 'Beastlord', 'Berserker',
] as const;

export type ClassName = typeof CLASS_LIST[number];

export const CLASS_COLORS: Record<string, string> = {
  'Warrior': 'var(--color-class-warrior)',
  'Cleric': 'var(--color-class-cleric)',
  'Paladin': 'var(--color-class-paladin)',
  'Ranger': 'var(--color-class-ranger)',
  'Shadow Knight': 'var(--color-class-shadowknight)',
  'Druid': 'var(--color-class-druid)',
  'Monk': 'var(--color-class-monk)',
  'Bard': 'var(--color-class-bard)',
  'Rogue': 'var(--color-class-rogue)',
  'Shaman': 'var(--color-class-shaman)',
  'Necromancer': 'var(--color-class-necromancer)',
  'Wizard': 'var(--color-class-wizard)',
  'Magician': 'var(--color-class-magician)',
  'Enchanter': 'var(--color-class-enchanter)',
  'Beastlord': 'var(--color-class-beastlord)',
  'Berserker': 'var(--color-class-berserker)',
};

// Tailwind-compatible class color classes (for use in className strings)
export const CLASS_COLOR_CLASSES: Record<string, string> = {
  'Warrior': 'text-[#C69B6D]',
  'Cleric': 'text-[#F5E6CA]',
  'Paladin': 'text-[#F48CBA]',
  'Ranger': 'text-[#67B23D]',
  'Shadow Knight': 'text-[#C41E3A]',
  'Druid': 'text-[#FF7C0A]',
  'Monk': 'text-[#00FF98]',
  'Bard': 'text-[#3FC7EB]',
  'Rogue': 'text-[#FFF468]',
  'Shaman': 'text-[#0070DD]',
  'Necromancer': 'text-[#9482C9]',
  'Wizard': 'text-[#6959CD]',
  'Magician': 'text-[#B44CD4]',
  'Enchanter': 'text-[#E6CC80]',
  'Beastlord': 'text-[#D4A017]',
  'Berserker': 'text-[#E25822]',
};

export const CLASS_BG_CLASSES: Record<string, string> = {
  'Warrior': 'bg-[#C69B6D]/15 border-[#C69B6D]/30',
  'Cleric': 'bg-[#F5E6CA]/15 border-[#F5E6CA]/30',
  'Paladin': 'bg-[#F48CBA]/15 border-[#F48CBA]/30',
  'Ranger': 'bg-[#67B23D]/15 border-[#67B23D]/30',
  'Shadow Knight': 'bg-[#C41E3A]/15 border-[#C41E3A]/30',
  'Druid': 'bg-[#FF7C0A]/15 border-[#FF7C0A]/30',
  'Monk': 'bg-[#00FF98]/15 border-[#00FF98]/30',
  'Bard': 'bg-[#3FC7EB]/15 border-[#3FC7EB]/30',
  'Rogue': 'bg-[#FFF468]/15 border-[#FFF468]/30',
  'Shaman': 'bg-[#0070DD]/15 border-[#0070DD]/30',
  'Necromancer': 'bg-[#9482C9]/15 border-[#9482C9]/30',
  'Wizard': 'bg-[#6959CD]/15 border-[#6959CD]/30',
  'Magician': 'bg-[#B44CD4]/15 border-[#B44CD4]/30',
  'Enchanter': 'bg-[#E6CC80]/15 border-[#E6CC80]/30',
  'Beastlord': 'bg-[#D4A017]/15 border-[#D4A017]/30',
  'Berserker': 'bg-[#E25822]/15 border-[#E25822]/30',
};

export const RACE_LIST = [
  'Human', 'Barbarian', 'Erudite', 'Wood Elf', 'High Elf', 'Dark Elf',
  'Half Elf', 'Dwarf', 'Troll', 'Ogre', 'Halfling', 'Gnome',
  'Iksar', 'Vah Shir', 'Froglok', 'Drakkin',
] as const;

export const DEITY_LIST = [
  'Agnostic', 'Bertoxxulous', 'Brell Serilis', 'Bristlebane',
  'Cazic-Thule', 'Erollisi Marr', 'Innoruuk', 'Karana',
  'Mithaniel Marr', 'Prexus', 'Quellious', 'Rallos Zek',
  'Rodcet Nife', 'Solusek Ro', 'The Tribunal', 'Tunare',
  'Veeshan',
] as const;

export const RESIST_TYPES = [
  'Magic', 'Fire', 'Cold', 'Poison', 'Disease',
  'Chromatic', 'Prismatic', 'Physical', 'Corruption', 'Unresistable',
] as const;

export const RESIST_COLOR_CLASSES: Record<string, string> = {
  'Magic': 'bg-[#6B8AFF]/20 text-[#6B8AFF] border-[#6B8AFF]/30',
  'Fire': 'bg-[#FF4444]/20 text-[#FF4444] border-[#FF4444]/30',
  'Cold': 'bg-[#44DDFF]/20 text-[#44DDFF] border-[#44DDFF]/30',
  'Poison': 'bg-[#44FF44]/20 text-[#44FF44] border-[#44FF44]/30',
  'Disease': 'bg-[#AAAA44]/20 text-[#AAAA44] border-[#AAAA44]/30',
  'Chromatic': 'bg-[#FF44FF]/20 text-[#FF44FF] border-[#FF44FF]/30',
  'Prismatic': 'bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#FFFFFF]/30',
  'Physical': 'bg-[#CCAA88]/20 text-[#CCAA88] border-[#CCAA88]/30',
  'Corruption': 'bg-[#AA44AA]/20 text-[#AA44AA] border-[#AA44AA]/30',
  'Unresistable': 'bg-[#FF8800]/20 text-[#FF8800] border-[#FF8800]/30',
};

export const TARGET_TYPES = [
  'Self', 'Single', 'Group', 'AE', 'PB AE', 'Target AE',
  'Corpse', 'Pet', 'Targeted AE', 'Undead',
] as const;

export const NAV_LINKS = [
  { href: '/spells', label: 'Spells' },
  { href: '/classes', label: 'Classes' },
  { href: '/zones', label: 'Zones' },
  { href: '/factions', label: 'Factions' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/aa', label: 'AAs' },
  { href: '/overseer', label: 'Overseer' },
  { href: '/items', label: 'Items' },
] as const;

export const CLASS_ROLES: Record<string, string> = {
  'Warrior': 'Tank',
  'Cleric': 'Healer',
  'Paladin': 'Tank / Healer',
  'Ranger': 'DPS / Utility',
  'Shadow Knight': 'Tank / DPS',
  'Druid': 'Healer / Utility',
  'Monk': 'DPS',
  'Bard': 'Utility / CC',
  'Rogue': 'DPS',
  'Shaman': 'Healer / Debuffer',
  'Necromancer': 'DPS / Utility',
  'Wizard': 'DPS',
  'Magician': 'DPS / Pet',
  'Enchanter': 'CC / Utility',
  'Beastlord': 'DPS / Pet',
  'Berserker': 'DPS',
};

export const CLASS_DESCRIPTIONS: Record<string, string> = {
  'Warrior': 'Master of melee combat and the front line, warriors excel at taking damage and holding aggro.',
  'Cleric': 'The premier healer of Norrath, capable of resurrecting the dead and providing powerful buffs.',
  'Paladin': 'A holy warrior combining tanking ability with healing spells and undead-slaying power.',
  'Ranger': 'A wilderness fighter skilled with bow and blade, combining melee prowess with nature magic.',
  'Shadow Knight': 'A dark knight wielding necromantic magic alongside tanking ability and lifetap spells.',
  'Druid': 'A nature caster with healing, damage, and powerful utility including ports and tracking.',
  'Monk': 'A martial artist with high DPS, feign death, and pulling capability.',
  'Bard': 'A versatile jack-of-all-trades using songs for buffs, CC, pulling, and group utility.',
  'Rogue': 'A master of stealth and backstab, dealing massive burst damage from behind.',
  'Shaman': 'A tribal priest combining healing with powerful slows, buffs, and debuffs.',
  'Necromancer': 'A dark caster commanding undead pets, DoTs, and lifetap abilities.',
  'Wizard': 'The ultimate nuker, specializing in massive direct damage and teleportation.',
  'Magician': 'A summoner of elemental pets and conjured items, with strong DPS ability.',
  'Enchanter': 'Master of crowd control, illusions, and mana regeneration through clarity spells.',
  'Beastlord': 'A primal warrior bonded with a warder pet, combining melee and spiritual magic.',
  'Berserker': 'A frenzied melee combatant specializing in two-handed weapons and AE damage.',
};
