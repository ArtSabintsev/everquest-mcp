# EverQuest MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with comprehensive access to EverQuest game data. Search across 9 online databases and a local game data installation with 326 tools covering spells, items, NPCs, zones, quests, factions, achievements, overseer, mercenaries, and more.

## Features

- **326 tools** for querying EverQuest data
- **Multi-source search** - Query 9 online EQ databases in parallel
- **Local game data** - Parse 70K+ spells, 1600+ factions, 2700+ AAs, 800+ overseer quests, and more directly from game files
- **Spell analysis** - Effects, categories, stacking groups, class lists, effect/resist/target/description search, recourse links, teleport zones, cast messages, endurance costs, timer groups, and resolved descriptions
- **Character data** - Race/class info with starting city lore and Drakkin heritages, skill caps, base stats, AC mitigation, deities
- **Creature encyclopedia** - 980+ NPC/monster race types searchable by name
- **Overseer system** - Agents with archetypes/traits/jobs, quests with slot details and success/failure outcomes
- **Zone maps** - 34K+ points of interest from Brewall map files, zone search by name/level, teleport spell lookup
- **Patch diff detection** - Snapshot game data before a patch, then compare after to see exactly what changed (new spells, modified zones, added achievements, etc.)
- **Quest guides** - Epic quest walkthroughs, leveling guides, farming guides

## Data Sources

| Source | Specialty |
|--------|-----------|
| **Local Game Data** | Authoritative offline data from EQ installation (70K+ spells, zones, factions, AAs, overseer, mercenaries, achievements, lore, and more) |
| [Allakhazam](https://everquest.allakhazam.com) | Primary online database - spells, items, NPCs, zones |
| [Almar's Guides](https://www.almarsguides.com/eq) | Quest walkthroughs, epic guides, leveling |
| [EQResource](https://eqresource.com) | Modern expansion content, progression |
| [Fanra's Wiki](https://everquest.fanra.info) | General game information, mechanics |
| [EQ Traders](https://www.eqtraders.com) | Tradeskill recipes and guides |
| [Zliz's Compendium](https://www.zlizeq.com) | Comprehensive EQ encyclopedia |
| [Lucy](https://lucy.allakhazam.com) | Classic EQ spell and item data (historical) |
| [RaidLoot](https://raidloot.com/EQ) | Raid loot tables by expansion |
| [EQInterface](https://www.eqinterface.com) | UI mods, maps, parsers, and tools |

## Installation

```bash
git clone https://github.com/ArtSabintsev/everquest-mcp.git
cd everquest-mcp
npm install
npm run build
```

### Local Game Data (Optional)

For offline access to comprehensive game data, set the `EQ_GAME_PATH` environment variable to your EverQuest installation directory. On macOS with CrossOver:

```json
{
  "mcpServers": {
    "everquest": {
      "command": "node",
      "args": ["/absolute/path/to/everquest-mcp/dist/index.js"],
      "env": {
        "EQ_GAME_PATH": "/path/to/EverQuest"
      }
    }
  }
}
```

Without this, only online database tools are available.

## Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "everquest": {
      "command": "node",
      "args": ["/absolute/path/to/everquest-mcp/dist/index.js"]
    }
  }
}
```

Then restart Claude Desktop.

## Available Tools (122)

### Multi-Source Search
| Tool | Description |
|------|-------------|
| `search_all` | Search ALL online databases simultaneously |
| `search_quests` | Search for quests and quest guides across all sources |
| `search_tradeskills` | Search for tradeskill recipes and guides |
| `list_sources` | List all available data sources and cache stats |

### Allakhazam (Primary Online Database)
| Tool | Description |
|------|-------------|
| `search_eq` | General search across all categories |
| `search_spells` | Search for spells by name |
| `search_items` | Search for items by name |
| `search_npcs` | Search for NPCs by name |
| `search_zones` | Search for zones by name |
| `get_spell` | Get detailed spell info by ID |
| `get_item` | Get detailed item stats by ID |
| `get_npc` | Get NPC info and loot table by ID |
| `get_zone` | Get zone info by ID |
| `get_quest` | Get detailed quest info by ID |

### Source-Specific Search
| Tool | Description |
|------|-------------|
| `search_almars` | Almar's Guides - epics, leveling, farming |
| `search_eqresource` | EQResource - modern expansions, progression |
| `search_fanra` | Fanra's Wiki - game mechanics |
| `search_eqtraders` | EQ Traders - tradeskill recipes |
| `search_lucy` | Lucy - classic EQ spell/item data |
| `search_raidloot` | RaidLoot - raid drop tables by expansion |
| `search_ui` | EQInterface - UI mods, maps, parsers |

### Local Data - Spells
| Tool | Description |
|------|-------------|
| `get_spell_data` | Get complete spell data from game files (effects, classes, duration, resist, recourse links, teleport zone, cast messages, endurance cost, timer group) |
| `get_spells_by_class` | List spells by class, optionally filtered by level, category, and/or resist type |
| `search_spells_by_effect` | Search spells by effect type (Stun, Haste, Charm, Root, etc.) |
| `search_spells_by_resist` | Search spells by resist type (Fire, Cold, Magic, Poison, etc.) with optional class filter |
| `search_spells_by_target` | Search spells by target type (Single, Self, Group, AE, Beam, etc.) with optional class filter |
| `search_spells_by_description` | Search spells by description text (e.g., "immune", "resurrect", "teleport") with optional class filter |
| `get_spell_stacking` | Check spell stacking conflicts and overwrite rules |
| `search_stacking_groups` | Search spell stacking groups by name to find conflicting buffs/debuffs |
| `list_spell_categories` | List all 176 spell categories for filtering |
| `search_spells_by_name` | Search spells by name, find all ranks/versions of a spell line |
| `search_combat_abilities` | Search combat abilities (disciplines) by name |
| `get_combat_ability_overview` | Combat ability/discipline overview — total count, rank distribution, common name words and prefixes |
| `search_timer_group` | Find all spells/disciplines sharing a reuse timer group (cooldown conflicts) |
| `compare_spells` | Compare two spells side by side showing differences in stats, effects, classes |
| `get_shared_spells` | Find spells shared between two classes with level comparison and overlap summary |
| `get_spell_line` | Find all versions and ranks of a spell line across levels and classes |
| `search_beneficial_spells` | Search for beneficial (buff) or detrimental (debuff) spells by class with category breakdown |
| `get_exclusive_spells` | Find spells only one class can cast — shows what makes each class unique |
| `search_spells_advanced` | Multi-criteria spell search combining class, level range, buff/debuff, target, resist, category, name, and effect |
| `get_class_spell_summary` | High-level overview of a class's spell book (buff/debuff ratio, categories, level distribution, target types) |
| `get_class_abilities_at_level` | Show all spells a class obtains at a specific level, grouped by category |
| `list_spell_effect_types` | List all 490 spell effect types (SPA IDs) for use with effect searches |
| `search_spells_by_cast_time` | Search spells by cast time (find instant casts, fast heals, etc.) |
| `search_spells_by_recast_time` | Search spells by recast/cooldown time (find long-cooldown disciplines, short-recast nukes, etc.) |
| `search_spells_by_range` | Search spells by casting range or AE range (find long-range nukes, close-range AE spells) |
| `search_spells_by_mana_cost` | Search spells by mana or endurance cost (find cheap efficient spells or expensive high-impact ones) |
| `search_spells_by_endurance` | Search endurance-cost abilities (combat abilities, disciplines) by endurance cost range for melee/hybrid classes |
| `search_spells_by_duration` | Search spells by buff/debuff duration (find short emergency spells or long-lasting buffs) |
| `search_spells_by_pushback` | Search spells with knockback/pushback effects (push back and push up values) |
| `search_spells_by_recovery_time` | Search spells by recovery time (delay after casting before next action) |
| `search_spells_by_subcategory` | Search spells by subcategory (Twincast, Undead, etc.) with auto-list of available subcategories |
| `search_spells_with_recourse` | Find spells with recourse (follow-up) effects — automatic cast on caster when spell lands |
| `get_spell_effect_overview` | Overview of all 419 spell effect types (SPAs) — most common effects, category breakdown, rarest effects |
| `get_spell_growth_curve` | Spell progression curve per class — new spells per level bracket, top spell-gain levels, dry spell analysis |
| `get_spell_resist_overview` | Breakdown of spells by resist type (Magic, Fire, Cold, etc.) with beneficial/detrimental counts — optionally per class |
| `get_spell_target_overview` | Breakdown of spells by target type (Single, Self, Group, AoE, etc.) with category analysis — optionally per class |
| `get_spell_timer_overview` | Spell reuse timer group analysis per class — shared lockout timers, timer group sizes, unique timers |
| `get_spell_category_breakdown` | Spell category breakdown per class — count, beneficial/detrimental, level ranges per category |
| `get_shared_spells_overview` | Cross-class spell availability — sharing distribution, most widely shared spells, exclusive vs shared counts per class |
| `get_spell_duration_overview` | Spell duration analysis — formula breakdown, duration distribution buckets with bar graph, optionally per class |
| `get_resist_type_comparison` | Resist type distribution matrix across all 16 classes — detrimental spell counts per resist type, dominant resist per class |
| `get_spell_requirement_overview` | Spell casting requirement associations — prerequisite counts, most common requirement IDs, complexity analysis, sample spell-requirement mappings |
| `get_spell_level_distribution` | Spell level distribution for a class — spells per bracket, level-by-level counts, peak levels, gaps |
| `get_spell_cast_time_analysis` | Cast time, recovery, and recast analysis — timing distributions, instant cast %, longest cast/recast spells |
| `get_spell_mana_cost_overview` | Mana cost distribution — cost brackets, average by level, most expensive spells, endurance-only abilities |
| `get_spell_subcategory_overview` | Category and subcategory tree — hierarchical breakdown with beneficial/detrimental split |
| `get_class_unique_spell_analysis` | Class-exclusive spell analysis — exclusive vs shared counts, categories, level distribution |
| `get_teleport_spell_overview` | All teleport spells — unique destinations, most-served zones, class availability, rare destinations |
| `get_spell_stacking_overview` | Spell stacking group overview — group size distribution, stacking type breakdown, class coverage, largest groups |
| `get_spell_ae_analysis` | AE spell analysis — AE type breakdown (PB AE, targeted, directional, beam, ring), radius distribution, largest AE spells, class comparison |
| `get_spell_pushback_overview` | Spell pushback/positioning overview — pushback and pushup value distributions, highest knockback spells, spells with both effects, class comparison |
| `get_spell_recourse_overview` | Spell recourse system overview — recourse statistics, multi-step chains, most common recourse targets, category and class distributions |
| `get_spell_duration_formula_analysis` | Duration formula × value interactions — value ranges per formula, most common values, constant-value anomalies, beneficial vs detrimental patterns |
| `get_spell_effect_combination_analysis` | Spell effect co-occurrence — most common SPA pairs, effects per spell distribution, dominant effect by slot position |
| `get_spell_progression_analysis` | Class spell progression across levels — new SPA effects per bracket, key effect milestones, peak spell levels, progression timeline |
| `get_resist_type_by_level_analysis` | Resist type distribution by level bracket — which resists dominate with gearing priority recommendations |
| `get_spell_cost_efficiency_analysis` | Spell cost efficiency — mana/endurance costs vs resource pools per level bracket, casts per pool, efficiency trends |
| `get_spell_target_type_matrix` | Spell target type matrix — class specialization by target type (Self, Single, Group, AE) with above-average highlights |
| `get_spell_scaling_analysis` | Spell scaling analysis — find all versions/ranks of a spell line and show how effects, mana cost, and power scale across ranks |
| `get_spell_effect_rarity_index` | Spell effect rarity index — exclusive, rare, and universal effects per class, identifying what makes each class irreplaceable |
| `get_spell_effect_encyclopedia` | Spell effect encyclopedia — deep dive into a specific SPA effect type showing all spells, class distribution, value ranges, slot positions, and examples |
| `get_spell_debuff_comparison_by_class` | Spell debuff comparison — compare all 16 classes' debuff arsenals (Slow, Root, Stun, Mez, Charm, Snare, DoT, etc.) with rankings and diversity |
| `get_spell_buff_duration_tier_list` | Spell buff duration tier list — beneficial spells grouped by duration tier (Instant, Short, Medium, Long, Very Long, Permanent) per class |
| `get_spell_damage_efficiency` | Spell damage efficiency — rank a class's damage spells by damage-per-mana (DPM), DD vs DoT comparison, level bracket analysis |
| `get_spell_resist_bar_chart` | Spell resist analysis — detailed breakdown of a specific resist type across classes with level distribution and comparison to other resists |
| `get_spell_name_pattern_analysis` | Spell name pattern analysis — rank patterns (Rk. II/III distribution), most common first words (spell line indicators), roman numeral suffixes, name length distribution |
| `get_spell_school_analysis` | Spell school analysis — group spells by resist type × beneficial/detrimental "school", class dominance per school, class specialization matrix |
| `get_spell_category_cooccurrence` | Spell category co-occurrence — which categories appear together in class spell books, universal vs specialized pairs, class-exclusive categories |
| `get_spell_target_effect_matrix` | Spell target type × effect matrix — how spell effects distribute across target types (Self, Single, Group, AE), AE-specific effects |
| `get_spell_level_milestone_guide` | Spell level milestone guide — key spell milestones per class (first heal, nuke, mez, port, pet, rez, etc.) by level |
| `get_spell_duration_analysis` | Spell duration analysis — duration formula distribution, average durations by category, instant vs timed vs permanent, longest spells |
| `get_spell_recast_timer_analysis` | Spell recast timer analysis — recast distributions, shared timer groups, cooldown patterns by category, longest recasts |

### Local Data - Character
| Tool | Description |
|------|-------------|
| `get_race_info` | Race details: classes, deities, starting city lore, Drakkin heritages |
| `get_class_info` | Class details: description, available races |
| `get_deity_info` | Deity lore and follower races |
| `get_stat_info` | Base stat descriptions and effects |
| `get_skill_caps` | Skill caps by class and level |
| `get_base_stats` | Base stats progression by class and level |
| `get_ac_mitigation` | AC mitigation values by class and level |
| `get_ac_mitigation_comparison` | Compare AC soft caps and multipliers across all 16 classes — armor tier groupings and rankings |
| `search_creature_types` | Search 980+ creature/NPC race types (Aviaks, Werewolves, Giants, etc.) |
| `get_creature_type_overview` | Overview of all 973 creature/NPC race types — alphabetical breakdown, common name words, and statistics |
| `get_creature_type_faction_correlation` | Creature type-faction correlation — cross-reference 973 creature types with factions for lore connections |
| `compare_races` | Compare two races side by side (stats, classes, deities) |
| `compare_classes` | Compare two classes side by side (races, spell counts, category breakdown) |
| `compare_deities` | Compare two deities side by side (follower races, classes, lore) |
| `list_all_races` | List all 16 playable races with base stats, classes, deities, descriptions |
| `list_all_classes` | List all 16 classes with type (melee/hybrid/caster), races, spell counts |
| `list_all_deities` | List all deities with follower races, available classes, and lore |
| `get_race_class_matrix` | Visual matrix of all race-class combinations with counts |
| `get_character_creation_guide` | Role-based character creation advisor with class/race recommendations |
| `get_deity_class_matrix` | Visual matrix of deity-class availability (which classes can worship each deity) |
| `list_drakkin_heritages` | List all Drakkin dragon heritages with heritage IDs and available classes |
| `compare_base_stats` | Compare HP, mana, endurance, and regen progression between two classes |
| `compare_skill_caps` | Compare skill caps between two classes — shared skills, unique skills, cap differences |
| `get_base_stat_overview` | All 16 classes' base HP/mana/endurance/regen at a specific level, ranked |
| `get_skill_overview` | Skill-class matrix — which classes can use each combat/magic skill at level 125 |
| `get_race_stat_comparison` | All 16 races' starting stats compared — sorted by total, per-stat rankings, stat spreads |
| `get_deity_overview` | All 17 deities with race/class availability counts and accessibility rankings |
| `get_class_comparison_matrix` | All 16 classes compared — spell count, beneficial %, skills, base stats, pet availability |
| `get_class_spell_diversity_index` | Class spell diversity — distinct SPA effects per class, class-exclusive effects, universal effects, overlap matrix |
| `get_class_power_milestone_timeline` | Unified class power progression — spells, stats, and skill unlocks by level bracket with stat growth curve |
| `get_class_role_analysis` | Class role analysis — each class classified by role (Tank/Healer/DPS/CC/Utility) based on spell effects and stat profile |
| `get_class_comparison_radar` | Class comparison radar — all 16 classes scored 0-100 across 8 dimensions (Heal, Tank, Nuke, CC, Utility, Buff, Pets, Mobility) |
| `get_group_composition_advisor` | Group composition advisor — optimal 6-person group compositions (Classic Trinity, Max DPS, Survival, Balanced) with class role scores and synergy notes |
| `get_class_endgame_profile` | Class endgame profile at level 125 — base stats, AC mitigation, skill caps, spell book summary, role assessment, and resource profile |
| `get_class_group_buff_contribution` | Class group buff contribution — what unique group/raid buffs each class brings, exclusive buff categories, and synergy value |
| `get_class_synergy_matrix` | Class synergy matrix — 16×16 class pair synergy scored by exclusive buff category coverage, best/worst partners, and redundancy analysis |
| `get_class_healing_comparison_matrix` | Class healing comparison — compare healing capabilities across all 16 classes (Direct, HoT, Group, Cure, Resurrect) with role classification |
| `get_class_pet_comparison_matrix` | Class pet comparison — compare pet capabilities across all 16 classes (Summon, Charm, Swarm, Pet Buffs) with tier classification |
| `get_class_identity_profile` | Class identity profile — comprehensive class card showing exclusive spells, spell categories, base stats at 125, role identity, and what makes the class unique |
| `get_class_defensive_profile` | Class defensive profile — runes, heals, AC buffs, resist buffs, damage shields, crowd control, aggro management with defensive rating summary |
| `get_class_mana_profile` | Class mana/endurance profile — resource cost vs pool at various levels, most expensive spells, cost by category, resource milestones |
| `get_class_offensive_profile` | Class offensive profile — nukes, DoTs, debuffs, AE damage, procs, crowd control with offensive rating summary |
| `get_skill_cap_progression_analysis` | Skill cap progression analysis — all skills per class with max caps, growth curves, category breakdown (Combat, Casting, Utility, Tradeskill) |
| `get_base_stat_growth_curve_analysis` | Base stat growth curves — HP, Mana, Endurance, Regen at milestone levels with growth rates and cross-class comparison |
| `get_player_customization_overview` | Player customization overview — character creation appearance options (faces, hair, eyes, beards, tattoos, colors) by race and sex |
| `get_race_appearance_options` | Race appearance options — detailed character creation customization for a specific race |
| `get_combat_ability_class_analysis` | Combat ability / discipline analysis — abilities per class, name patterns, keyword themes, spell cross-references |
| `get_spell_requirement_class_breakdown` | Spell requirement class breakdown — spells with requirements per class, exclusive requirement IDs, multi-class density, level distribution |
| `get_ac_mitigation_progression_analysis` | AC mitigation progression for a class — soft cap and multiplier across all levels, key breakpoints, comparison to all-class average |
| `get_spell_stacking_conflict_analysis` | Spell stacking conflict analysis — multi-class stacking groups, class pair conflict frequency, per-class conflict exposure |
| `get_mercenary_ability_spell_analysis` | Cross-references mercenary abilities with the spell database — matched abilities by category, beneficial/detrimental breakdown |
| `get_overseer_trait_synergy_analysis` | Overseer trait synergy — trait co-occurrence in quest slots, most requested traits, best agents by trait coverage, difficulty diversity |
| `get_class_spell_level_gap_analysis` | Class spell level gap analysis — level ranges with no new spells, spell density by decade, busiest levels, category distribution |
| `get_drakkin_heritage_class_analysis` | Drakkin heritage class analysis — available classes per heritage, class heritage availability, exclusivity analysis, heritage overlap matrix |
| `get_spell_subcategory_depth_analysis` | Spell subcategory depth analysis — subcategory distribution, class-exclusive subcategories, category-subcategory hierarchies, class specialization |
| `get_skill_cap_cross_class_comparison` | Skill cap cross-class comparison — compares a specific skill across all 16 classes with progression, growth analysis, and proficiency tiers |
| `get_spell_mana_efficiency_analysis` | Spell mana efficiency analysis — mana cost distribution, most/least expensive spells, mana trends by level, cost by category, cast time correlation |
| `get_faction_category_analysis` | Faction category analysis — distribution across expansion categories, value range statistics, starting value modifiers, widest/narrowest ranges |
| `get_overseer_quest_slot_job_analysis` | Overseer quest slot and job requirement analysis — job type demand, required vs optional ratios, slot distributions, bonus trait counts |
| `get_class_buff_debuff_ratio` | Cross-class beneficial vs detrimental spell ratio — buff/debuff balance, offensive vs supportive class tendencies, target type breakdown |
| `get_spell_recourse_chain_analysis` | Spell recourse chain analysis — spells triggering secondary recourse spells, chain depths, class distribution, most common recourse targets |
| `get_achievement_completion_complexity` | Achievement complexity analysis — component counts, highest requirements, simplest vs hardest achievements, component type distribution |
| `get_spell_endurance_cost_analysis` | Endurance cost analysis for a class — distribution, most expensive abilities, cost trends by level, category breakdown, dual-resource abilities |
| `get_class_spell_book_size_comparison` | Cross-class spell book size comparison — total spells, beneficial/detrimental counts, category diversity, peak spell levels |
| `get_zone_level_overlap_analysis` | Zone level overlap analysis — zone choices per level, leveling bottlenecks, most overlapping zone pairs, widest level ranges |
| `get_class_crowd_control_profile` | CC spell profile for a class — stun, mez, charm, fear, root, snare, calm counts, AE vs single target, resist types, level availability |
| `get_class_emergency_ability_analysis` | Emergency/survival ability analysis for a class — FD, gate, invis, runes, cures, aggro drops, instant-cast abilities, first-available levels |
| `get_class_utility_spell_comparison` | Cross-class utility spell matrix — resurrect, gate, summon, bind, invis, levitate, dispel, cure, illusion, FD, pacify, regen, haste across all 16 classes |
| `get_class_dot_profile` | DoT spell profile for a class — highest total damage, mana efficiency, duration distribution, resist types, target types, level scaling |
| `get_class_direct_damage_profile` | Direct damage (nuke) profile for a class — highest damage, DPS, mana efficiency, AE nukes, resist types, level scaling |
| `get_spell_proc_effect_analysis` | Proc effect analysis for a class — spell procs, melee procs, range procs, buff/debuff breakdown, referenced proc effects |
| `get_class_debuff_profile` | Debuff profile for a class — slow, resist/stat/AC/ATK debuffs, snare, blind, silence, fragility with resist types and durations |
| `get_class_self_buff_profile` | Self-only buff analysis for a class — most common effects, categories, duration breakdown, highest level and most complex self-buffs |
| `get_spell_slow_haste_comparison` | Cross-class slow and haste comparison — spell counts, max slow/haste %, strongest spells across all 16 classes |
| `get_class_taunt_aggro_profile` | Taunt and aggro management profile — hate generation, aggro reduction, AE taunts, instant-cast aggro abilities, hate values |
| `get_spell_illusion_analysis` | Illusion spell analysis for a class — unique forms, self vs other targeting, form IDs, duration distribution |
| `get_spell_cast_time_distribution` | Cast time distribution for a class — instant vs slow casts, averages by type and level, slowest spells, longest recasts |
| `get_spell_summon_analysis` | Summoning spell analysis for a class — pets, items, players, corpses, familiars with cast times and first-available levels |
| `get_class_regen_profile` | HP, mana, and endurance regen profile — strongest regens, multi-regen spells, self vs group targeting |
| `get_spell_damage_shield_profile` | Damage shield analysis for a class — regular and reverse DS, strongest shields, DS value scaling by level |
| `get_class_resurrection_comparison` | Cross-class resurrection spell comparison — rez counts, earliest level, cast times, fastest rezzes, unique spells |
| `get_spell_rune_absorb_profile` | Rune and absorb profile for a class — stoneskin, damage absorb, magic absorb, rune values, self vs group targeting |
| `get_class_spell_effect_diversity` | Spell effect diversity analysis — unique SPAs used, most common and rarest effects, frequency distribution, category coverage |
| `get_class_group_buff_profile` | Group buff profile for a class — group v1/v2 targeting, most common effects, categories, duration tiers, most complex group buffs |
| `get_class_heal_breakdown` | Detailed heal breakdown for a class — direct heals, HoTs, group heals, mana efficiency, strongest heals by type |
| `get_class_melee_discipline_profile` | Melee discipline (endurance) profile for a class — category distribution, most expensive, longest cooldowns, shared timer groups |
| `get_class_pet_spell_profile` | Pet spell profile for a class — summon pets, charm, pet buffs/heals/shields, familiars, first-available levels |
| `get_class_cure_spell_profile` | Cure and dispel profile for a class — dispel magic, dispel detrimental, cure corruption, beneficial vs detrimental, group cures, instant cures |
| `get_class_transport_profile` | Transport and travel profile for a class — teleport destinations, gate, bind, speed, levitate, invisibility, water breathing |
| `get_class_resist_debuff_profile` | Resist debuff/buff profile for a class — fire/cold/poison/disease/magic/corruption resist modifiers, strongest debuffs, multi-resist spells |
| `get_class_mana_recovery_profile` | Mana recovery profile for a class — regen buffs, mana drain/tap, mana transfer, max mana buffs, target types |
| `get_class_spell_focus_profile` | Spell focus profile for a class — twincast, spell crit chance/damage, spell haste, damage/heal modifiers, multi-focus spells |
| `get_class_ae_spell_profile` | AE spell profile for a class — PB AE, Targeted AE, Directional, Beam, Ring AE; radius, resist types, beneficial vs detrimental |
| `get_class_instant_cast_profile` | Instant-cast spell profile for a class — zero cast time spells, categories, effects, emergency tools, endurance vs mana |
| `get_class_buff_duration_analysis` | Buff duration tier analysis for a class — instant/short/medium/long tiers, average by category, longest buffs |
| `get_class_melee_combat_profile` | Melee combat enhancement profile — crit, double/triple attack, flurry, riposte, parry, dodge, backstab, headshot, strikethrough |
| `get_class_stat_buff_profile` | Stat buff/debuff profile — STR, DEX, AGI, STA, INT, WIS, CHA modifiers, strongest buffs/debuffs, multi-stat spells |
| `get_class_lifetap_profile` | Lifetap and HP profile — lifetap spells, HP drain, max HP buffs, HP change effects, HP percent reduction |
| `get_class_aggro_management_profile` | Aggro management profile — hate generation, aggro reduction, taunt, AE taunt, spell hate, improved taunt |
| `get_class_endurance_profile` | Endurance profile — endurance regen, max endurance buffs, endurance drain, burn, absorb effects |
| `get_class_skill_modifier_profile` | Skill modifier profile — skill damage, archery damage, offhand damage, skill attack, accuracy, timer reduction |
| `get_class_song_modifier_profile` | Song modifier profile — song DoT, singing mods, instrument mods, song range, song AOE, bard AE DoT |
| `get_class_ac_attack_profile` | AC and Attack rating profile — armor class buffs/debuffs, attack rating, AC soft cap, melee damage, worn attack |
| `get_class_haste_slow_profile` | Haste and slow profile — melee haste buffs, slow debuffs, pet haste effects with percentages |
| `get_class_spell_resist_type_profile` | Spell resist type distribution — breakdown across Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, Corruption |
| `get_class_death_save_profile` | Death save and escape profile — feign death, fade, death save, max negative HP, shroud of stealth |
| `get_class_spell_line_progression` | Spell line progression — tracks spell families across levels with ranks, mana scaling, level brackets |
| `get_class_resist_buff_profile` | Resist buff/debuff profile — analyzes Magic, Fire, Cold, Poison, Disease, Chromatic, Prismatic, Physical, Corruption resistance modifiers |
| `get_class_hp_regen_profile` | HP regeneration profile — HP regen, enhanced regen, out-of-combat regen, regen caps with level progression |
| `get_class_spell_range_profile` | Spell range profile — range distributions, range extension effects, AE radius patterns |
| `get_class_spell_acquisition_curve` | Spell acquisition curve — new spells per level bracket, peak levels, drought gaps, cumulative progression |
| `get_class_movement_profile` | Movement and mobility profile — speed buffs, snares, levitate, teleport, transport, water breathing, shrink |
| `get_class_damage_shield_profile` | Damage shield profile — regular DS, reverse DS, spell DS, DS blocking with damage values |
| `get_class_stun_mez_profile` | Stun and mesmerize profile — stun, mez, calm, stun resist, AE stun resist, shield bash stun |
| `get_class_spell_focus_limit_profile` | Spell focus and limit profile — focus effects (haste, crit, damage mods) with limiting conditions |
| `get_class_charm_fear_profile` | Charm and fear profile — charm, fear, charm immunity, group fear immunity with durations |

### Local Data - Zones & Maps
| Tool | Description |
|------|-------------|
| `get_zone_map` | Zone map POIs with coordinates (34K+ locations) |
| `get_hot_zone_bonuses` | Current Hot Zone XP bonus information |
| `search_zones_by_name` | Search zones by name with optional level range filter |
| `search_zones_by_level` | Find zones appropriate for a character level range |
| `search_teleport_spells` | Find all spells that teleport to a specific zone |
| `get_leveling_zones_guide` | Complete leveling guide — all zones grouped by level tier |
| `get_zone_level_statistics` | Zone count statistics by level band with bar chart and peak level analysis |
| `get_map_statistics` | Map POI statistics — zones with map data, total POI counts, density distribution |
| `get_map_poi_label_analysis` | Map POI label analysis — common label words, prefix categories, color distribution, zones with most/fewest POIs |
| `get_teleport_network_analysis` | Teleport network topology — hub zones, class teleport rankings, level-range coverage, class-exclusive destinations |
| `get_zone_content_density_ranking` | Zone content density ranking — zones scored by map POIs, teleport accessibility, and level range |
| `get_map_poi_functional_classification` | Map POI functional classification — classify POIs into categories (Merchant, Zone Line, Bank, Guard, Temple, Camp, Craft, Transport) |
| `get_zone_level_gap_analysis` | Zone level gap analysis — find level ranges with no zones (gaps), sparse coverage (1-3 zones), and peak levels with most zone options |
| `get_map_poi_zone_detail` | Map POI zone detail — all points of interest for a specific zone, categorized (Merchants, Zone Lines, Camps, etc.) with coordinates |

### Local Data - Factions & Currencies
| Tool | Description |
|------|-------------|
| `search_factions` | Search 1600+ factions with expansion filter |
| `get_faction` | Faction details with starting values by race/class |
| `get_factions_by_race` | Show all hostile/friendly factions for a playable race |
| `get_factions_by_deity` | Show all hostile/friendly factions for followers of a deity |
| `get_factions_by_class` | Show all hostile/friendly factions for a specific class |
| `get_character_factions` | Combined faction calculator for race + deity + class character creation |
| `search_alt_currencies` | Search alternate currencies |
| `search_tributes` | Search tribute items |
| `get_tribute` | Get tribute item details |
| `get_tribute_overview` | Tribute system overview — personal vs guild tributes, full listing, and common themes |
| `get_tribute_benefit_analysis` | Tribute benefit analysis — keyword frequency (HP, mana, haste, resist), personal vs guild split, name patterns |
| `get_tribute_role_analysis` | Tribute role analysis — classify tributes by benefitting role (Tank, Healer, Melee DPS, Caster DPS, Utility) with keyword matching |
| `get_tribute_efficiency_analysis` | Tribute efficiency analysis — personal vs guild comparison, benefit type classification, coverage gaps, name pattern analysis |
| `get_faction_overview` | Faction system overview with counts by expansion, value ranges, starting modifier stats |
| `compare_factions` | Compare two factions side by side (expansion, value ranges, starting values by race) |
| `get_currency_overview` | Alternate currency overview — total count, description stats, keyword analysis, complete listing |
| `get_faction_modifier_overview` | All faction modifiers (race, class, deity) — modifier IDs, usage frequency across factions, starting value distribution |
| `get_faction_starting_value_analysis` | Faction starting value analysis — race/class/deity impact tables with positive/negative counts and net balance, most modified factions |
| `get_faction_network_analysis` | Faction relationship network — factions connected through shared race/class/deity modifiers, most connected nodes, faction pairs |
| `get_deity_faction_impact_analysis` | Deity faction impact — how each deity affects faction standing, best/worst factions per deity, accessibility ranking |
| `get_race_deity_optimizer` | Race-deity optimizer — for each of 16 playable races, rank deities by net faction benefit with best/worst per race |
| `get_zone_faction_web_analysis` | Zone-faction web analysis — cross-reference zone names with faction names to discover zone-faction relationships |
| `get_expansion_faction_timeline` | Expansion faction timeline — faction count growth across expansions, visual distribution, starting value profiles per expansion |

### Local Data - Achievements & AA
| Tool | Description |
|------|-------------|
| `search_achievements` | Search achievements by name, optionally filter by category/expansion |
| `get_achievement` | Get achievement details with components |
| `list_achievement_categories` | List all achievement categories by expansion with subcategories and counts |
| `get_achievement_category` | Browse achievements in a specific category |
| `search_aa` | Search 2700+ AA abilities |
| `get_aa` | Get AA ability details |
| `get_achievement_overview` | Achievement system overview with point distribution and category counts |
| `get_achievement_component_overview` | Achievement component/step analysis — step distribution, component types, most complex achievements |
| `get_achievement_requirement_analysis` | Achievement requirement value analysis — value distributions by type, highest requirements, most demanding achievements |
| `get_aa_overview` | AA system overview with keyword analysis, description stats, and rank distribution |
| `get_aa_name_group_analysis` | AA name grouping — rank distribution, longest AA lines, common prefixes, keyword themes, name length stats |
| `get_aa_role_theme_analysis` | AA role theme analysis — classify 2700+ AAs by role (Tank, Healer, DPS, CC, Buff, Pet, Utility) from descriptions |
| `get_achievement_category_depth_analysis` | Achievement category hierarchy — tree depth, subcategory counts, point density, most complex trees |
| `get_achievement_point_optimizer` | Achievement point optimizer — most efficient achievements by points per component, efficiency tiers, complexity analysis |
| `search_aa_by_description` | Search 2700+ AA abilities by description text (e.g., "haste", "critical hit", "mana regeneration", "pet") |
| `get_aa_spell_correlation` | AA-spell category correlation — cross-reference AA descriptions with spell effect keywords and category names, multi-effect AAs, coverage statistics |
| `get_achievement_expansion_timeline` | Achievement expansion timeline — achievement growth, point density, complexity analysis, and cumulative trends across all expansion categories |
| `get_aa_ability_rank_analysis` | AA ability rank analysis — rank progression patterns (I-XXX), deepest progressions, name word frequency, description theme classification |

### Local Data - Overseer System
| Tool | Description |
|------|-------------|
| `search_overseer_agents` | Search 300+ overseer agents |
| `get_overseer_agent` | Agent details: traits, jobs, rarity, bio |
| `search_overseer_quests` | Search 800+ overseer quests |
| `get_overseer_quest` | Quest details: slots, traits, risks, success/failure outcomes |
| `get_overseer_incapacitations` | List incapacitation types and durations |
| `get_overseer_quest_summary` | Overseer system overview with categories, difficulties, durations, agent stats |
| `get_overseer_job_overview` | Complete overseer system overview — jobs, archetypes, categories, difficulties, traits, incapacitations, minion rarity breakdown |
| `search_overseer_agents_by_trait` | Search overseer agents by trait (race/creature type) with auto-list of available traits |
| `get_overseer_slot_analysis` | Overseer quest slot patterns — job type demand, required vs optional ratios, bonus trait frequency, slots by difficulty, most demanding quests |
| `get_overseer_minion_rarity_analysis` | Overseer agent rarity analysis — rarity distribution, traits/jobs per rarity tier, job levels by rarity, most common traits and jobs at each tier |
| `get_overseer_quest_efficiency_analysis` | Overseer quest efficiency analysis — difficulty-to-slot ratios, category efficiency, most/least demanding quests, job diversity |
| `get_overseer_agent_trait_job_matrix` | Overseer agent trait-job matrix — cross-reference traits with jobs, trait+job rarity, most versatile agents, and optimal selection |
| `get_overseer_quest_category_guide` | Overseer quest category guide — practical guide for each category with difficulty, top jobs needed, slot requirements, and sample quests |
| `get_overseer_agent_job_coverage_optimizer` | Overseer agent job coverage optimizer — rank agents by quest slot coverage, job demand analysis, coverage gaps, most versatile agents |
| `get_overseer_quest_difficulty_analysis` | Overseer quest difficulty analysis — difficulty distribution, duration patterns, slot requirements by difficulty, most demanded job types |

### Local Data - Mercenaries
| Tool | Description |
|------|-------------|
| `search_mercenaries` | Search 4209+ mercenary templates |
| `get_mercenary` | Get mercenary details with abilities |
| `get_mercenary_stances` | List mercenary stances and descriptions |
| `get_mercenary_overview` | Mercenary system overview with types, tiers, races, and stances |
| `get_mercenary_ability_overview` | Overview of all 14 mercenary abilities with descriptions, themes, and type listing |
| `get_mercenary_tier_analysis` | Mercenary tier and proficiency analysis — confidence/proficiency distributions, type-by-tier matrix, cross-tab, top races per type |
| `get_mercenary_class_synergy` | Mercenary-class synergy guide — recommended mercenary type for each of 16 classes based on role gap analysis |

### Local Data - Items & Effects
| Tool | Description |
|------|-------------|
| `search_item_effects` | Search 1100+ item click/proc effect descriptions |
| `get_item_effect` | Get specific item effect description |
| `get_item_effect_overview` | Item effect overview — keyword frequency, description stats, common words, sample effects by category |
| `get_item_effect_spell_correlation` | Item effect-spell correlation — cross-reference item click/proc effects with spell names and keywords, effect category classification |
| `get_item_effect_category_breakdown` | Item effect category breakdown — classify 1100+ item click/proc effects into functional categories (Offensive, Healing, Defensive, Travel, etc.) |
| `search_augment_groups` | Search augmentation slot groups |
| `list_augment_slot_types` | List all 31 augmentation slot types |
| `search_item_lore_groups` | Search item lore groups (LORE duplicate definitions) |
| `get_augmentation_system_analysis` | Augmentation system analysis — all 31 slot types, 81 augmentation groups classified by category (Stat, Combat, Defensive, Spell, etc.) |

### Local Data - Lore & Reference
| Tool | Description |
|------|-------------|
| `search_lore` | Search 50+ in-game lore stories |
| `get_lore` | Read a lore story |
| `get_lore_overview` | Lore overview — story count, word count stats, longest/shortest stories, complete listing |
| `get_lore_theme_analysis` | Lore theme analysis — recurring themes (War, Magic, Gods, Death, Nature), proper nouns, word frequency, story statistics |
| `get_starting_city_lore` | Browse all 29 starting city lore descriptions from character creation |
| `search_game_strings` | Search 7000+ game UI strings |
| `search_game_events` | Search 550+ in-game event announcements |
| `get_game_event` | Get event announcement details |
| `list_expansions` | List all 33 EverQuest expansions |
| `compare_expansions` | Compare two expansions side by side (factions, achievements, faction lists) |
| `get_game_event_overview` | Game event overview with category breakdown (seasonal, expansion, double XP, etc.) |
| `get_game_event_calendar_analysis` | Game event calendar analysis — classify 573 events by type (Server, Double XP, Expansion, Seasonal, etc.) with scheduling patterns |
| `get_expansion_timeline` | Timeline of all 33 expansions with faction and achievement counts per expansion |
| `get_expansion_content_density` | Cross-system content density — factions by expansion, achievements by category, zones by level range, content ratios |
| `get_expansion_impact_score` | Expansion impact score — each of 33 expansions scored by content volume (factions, achievements, achievement points, event mentions) |
| `get_expansion` | Expansion content summary with factions and achievements |
| `get_banner_categories` | Guild banner and fellowship campsite types |
| `search_help_topics` | Search 75 official in-game help topics on game mechanics |
| `get_help_topic` | Read a specific help topic (augments, combat, mercenaries, etc.) |
| `get_local_data_status` | Show which local data files are loaded |
| `get_level_content_guide` | Content guide for a specific level — matching zones, new spells per class, nearby spell activity |
| `get_content_progression_pathway` | Content progression pathway — milestone levels (1-125) showing new spells, zones, and cumulative content at each tier with spell density chart |
| `get_game_data_summary_dashboard` | One-stop summary dashboard of ALL loaded EQ data — entry counts for all 19 data systems with key metrics |
| `search_all_local_data` | Unified search across ALL local data systems (spells, zones, factions, achievements, AAs, tributes, creatures, overseer, events, lore, item effects) |
| `get_db_string_type_overview` | Meta overview of all 68 string data types in dbstr_us.txt with entry counts, names, and samples |
| `get_game_string_category_analysis` | Game string category analysis — classify 7000+ game UI strings by topic (Combat, Spells, Items, Trading, Group, Guild, etc.) |
| `get_help_topic_content_analysis` | Help topic content analysis — analyze 75+ in-game help topics by content length, cross-references between topics, and category distribution |
| `get_cross_system_name_overlap` | Cross-system name overlap — find names appearing across 3+ game systems (zones, factions, achievements, AAs, lore, overseer agents) revealing lore connections |
| `save_data_snapshot` | Save a snapshot of current game data state (file sizes, entry counts, ID→name maps) as a baseline for detecting changes after patches |
| `get_data_update_summary` | Compare current game data against saved snapshot — shows file changes, entry count deltas, additions/removals/modifications per system |
| `get_data_update_detail` | Detailed diff for a specific data system (spells, zones, factions, etc.) — lists exactly which entries were added, removed, or renamed |

## Example Queries

Once configured, you can ask your AI assistant things like:

- "What does the spell Complete Heal do?"
- "Show me all Cleric resurrection spells"
- "What are the Wizard fire spells at level 65?"
- "Find all spells with a stun effect for Enchanter"
- "How do I start the bard epic 1.0 quest?"
- "What are the best leveling spots for level 70-80?"
- "Tell me about the faction Wolves of the North"
- "What overseer quests are available for plunder?"
- "Show me map locations in Plane of Knowledge near the bank"
- "What AA abilities are available for Shaman?"
- "List all expansions from EverQuest"
- "What are Gribble HAs?"
- "Show me blacksmithing recipes for 250-300 skill"

## Development

```bash
npm run dev    # Build and run
npm run build  # Build only
npm run test   # Run tests
npm start      # Run built version
```

## Architecture

```
src/
├── index.ts          # MCP server entry point
├── tools.ts          # Tool definitions and handlers (326 tools)
├── sources/          # Data source implementations
│   ├── base.ts       # Shared interfaces and fetch utilities
│   ├── index.ts      # Source aggregation
│   ├── localdata.ts  # Local EQ game file parser (4500+ lines)
│   ├── allakhazam.ts # Allakhazam scraper
│   ├── almars.ts     # Almar's Guides
│   ├── eqresource.ts # EQResource
│   ├── fanra.ts      # Fanra's Wiki (MediaWiki API)
│   ├── eqtraders.ts  # EQ Traders
│   ├── zliz.ts       # Zliz's Compendium
│   ├── lucy.ts       # Lucy spell/item database
│   ├── raidloot.ts   # RaidLoot raid drops
│   └── eqinterface.ts # EQInterface UI mods
└── tests/            # Test suite
    └── tools.test.ts
```

## Local Game Data Files Parsed

When `EQ_GAME_PATH` is set, the server parses these game files on demand:

| File | Data |
|------|------|
| `spells_us.txt` | 70K+ spells with effects, classes, categories |
| `spells_us_str.txt` | Spell cast messages |
| `dbstr_us.txt` | AA names, spell descriptions, faction names, overseer data, events, expansions, creature types (980+), starting city lore, and 40+ other string types |
| `eqstr_us.txt` | Game UI strings, deity lore |
| `Resources/skillcaps.txt` | Skill cap data by class/level |
| `Resources/basedata.txt` | Base stat progression |
| `Resources/ACMitigation.txt` | AC mitigation tables |
| `Resources/SpellStackingGroups.txt` | Spell stacking rules |
| `Resources/ZoneNames.txt` | Zone names and short names |
| `Resources/Achievements/` | Achievement definitions, categories, components |
| `Resources/Faction/` | Faction data, categories, starting values |
| `Resources/OvrMini*` | Overseer agent data, traits, images |
| `Resources/OvrQst*` | Overseer quest data, slots, trait groups |
| `Resources/OvrJobClient.txt` | Overseer job types |
| `Resources/bannercategories.txt` | Guild banner categories |
| `Resources/campsitecategories.txt` | Fellowship campsite categories |
| `Resources/playercustomization.txt` | Drakkin heritage data (6 dragon lineages) |
| `maps/` | Brewall/standard zone map files (34K+ POIs) |
| `Help/` | 75 official in-game help topic HTML files |

## Adding New Sources

1. Create a new file in `src/sources/` implementing the `EQDataSource` interface
2. Export it from `src/sources/index.ts`
3. Add to the `sources` array for multi-source search
4. Optionally add source-specific tools in `src/tools.ts`

## License

MIT
