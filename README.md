# EverQuest MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with comprehensive access to EverQuest game data. Search across 9 online databases and a local game data installation with **407 tools** covering spells, items, NPCs, zones, quests, factions, achievements, overseer, mercenaries, and more.

## Features

- **407 tools** for querying EverQuest data
- **Multi-source search** — Query 9 online EQ databases in parallel
- **Local game data** — Parse 70K+ spells, 1600+ factions, 2700+ AAs, 800+ overseer quests, and more directly from game files
- **Deep spell analysis** — Effects, categories, stacking, class comparisons, efficiency rankings, burst/sustained DPS, flexible multi-parameter queries
- **Character data** — Race/class info, skill caps, base stats, AC mitigation, deities, Drakkin heritages
- **Creature encyclopedia** — 980+ NPC/monster race types searchable by name
- **Overseer system** — Agents with archetypes/traits/jobs, quests with slot details and success/failure outcomes
- **Zone maps** — 34K+ points of interest from Brewall map files, zone search by name/level, teleport spell lookup
- **Patch diff detection** — Snapshot game data before a patch, then compare after to see exactly what changed
- **Quest guides** — Epic quest walkthroughs, leveling guides, farming guides

## Data Sources

| Source | Specialty |
|--------|-----------|
| **Local Game Data** | Authoritative offline data from EQ installation (70K+ spells, zones, factions, AAs, overseer, mercenaries, achievements, lore, and more) |
| [Allakhazam](https://everquest.allakhazam.com) | Primary online database — spells, items, NPCs, zones |
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

## Available Tools (407)

### Online Search (21 tools)

#### Multi-Source Search
| Tool | Description |
|------|-------------|
| `search_all` | Search ALL online databases simultaneously |
| `search_quests` | Search for quests and quest guides across all sources |
| `search_tradeskills` | Search for tradeskill recipes and guides |
| `list_sources` | List all available data sources and cache stats |

#### Allakhazam (Primary Online Database)
| Tool | Description |
|------|-------------|
| `search_eq` | General search across all categories |
| `search_spells` / `search_items` / `search_npcs` / `search_zones` | Search by type |
| `get_spell` / `get_item` / `get_npc` / `get_zone` / `get_quest` | Get detailed info by ID |

#### Source-Specific Search
| Tool | Description |
|------|-------------|
| `search_almars` | Almar's Guides — epics, leveling, farming |
| `search_eqresource` | EQResource — modern expansions, progression |
| `search_fanra` | Fanra's Wiki — game mechanics |
| `search_eqtraders` | EQ Traders — tradeskill recipes |
| `search_lucy` | Lucy — classic EQ spell/item data |
| `search_raidloot` | RaidLoot — raid drop tables by expansion |
| `search_ui` | EQInterface — UI mods, maps, parsers |

---

### Local Data — Spells & Abilities (276 tools)

The spell system is the most deeply covered area, with tools ranging from basic lookups to sophisticated analysis. Tools are organized into categories below.

#### Spell Lookup & Search (30 tools)

Basic spell queries, search by various criteria, and individual spell details.

| Tool | Description |
|------|-------------|
| `get_spell_data` | Complete spell data from game files (effects, classes, duration, resist, recourse, teleport, etc.) |
| `get_spell_detail` | Detailed single-spell breakdown by name — properties, class levels, effects, description |
| `search_spells_by_name` | Search spells by name, find all ranks/versions |
| `search_spells_by_effect` | Search by effect type (Stun, Haste, Charm, Root, etc.) |
| `search_spells_by_resist` | Search by resist type (Fire, Cold, Magic, etc.) |
| `search_spells_by_target` | Search by target type (Single, Self, Group, AE, etc.) |
| `search_spells_by_description` | Search by description text (e.g., "immune", "resurrect") |
| `search_spells_advanced` | Multi-criteria search combining class, level, buff/debuff, target, resist, category, name, effect |
| `search_beneficial_spells` | Search beneficial (buff) or detrimental (debuff) spells |
| `search_combat_abilities` | Search combat abilities (disciplines) by name |
| `get_spell_stacking` | Check spell stacking conflicts and overwrite rules |
| `search_stacking_groups` | Search spell stacking groups by name |
| `compare_spells` | Compare two spells side by side |
| `get_shared_spells` | Find spells shared between two classes |
| `get_spell_line` | Find all versions and ranks of a spell line |
| `list_spell_categories` | List all 176 spell categories |
| `list_spell_effect_types` | List all 490 spell effect types (SPA IDs) |
| `search_spells_by_cast_time` | Search by cast time range |
| `search_spells_by_recast_time` | Search by recast/cooldown time |
| `search_spells_by_range` | Search by casting range or AE range |
| `search_spells_by_mana_cost` | Search by mana cost range |
| `search_spells_by_endurance` | Search by endurance cost range |
| `search_spells_by_duration` | Search by buff/debuff duration |
| `search_spells_by_pushback` | Search spells with knockback effects |
| `search_spells_by_recovery_time` | Search by recovery time |
| `search_spells_by_subcategory` | Search by subcategory (Twincast, Undead, etc.) |
| `search_spells_with_recourse` | Find spells with recourse (follow-up) effects |
| `search_timer_group` | Find all spells sharing a reuse timer group |
| `get_combat_ability_overview` | Combat ability/discipline overview |
| `get_exclusive_spells` | Find spells only one class can cast |

#### Flexible Spell Queries (13 tools)

Two- and three-parameter query tools for slicing spell data by any attribute.

| Tool | Description |
|------|-------------|
| `get_class_spell_search` | Search spells by name pattern within a class |
| `get_class_spell_by_spa` | Query spells by SPA effect ID |
| `get_class_spell_by_resist_type` | Filter by resist type (Magic, Fire, Cold, etc.) |
| `get_class_spell_by_target_type` | Filter by target type (Single, Group, AE, etc.) |
| `get_class_spell_by_level` | All spells gained at a specific level |
| `get_class_spell_by_level_range` | Spells in a level range with per-level breakdown |
| `get_class_spell_by_cast_time` | Filter by max cast time threshold |
| `get_class_spell_by_mana_cost` | Filter by minimum mana cost |
| `get_class_spell_by_duration` | Filter by minimum duration |
| `get_class_spell_by_recast_time` | Filter by minimum recast time |
| `get_class_spell_by_category` | Filter by spell category name or ID |
| `get_class_spell_by_range` | Filter by minimum range |
| `get_class_spell_by_endurance_cost` | Filter by minimum endurance cost |
| `get_class_spell_by_effect_value` | Filter by SPA effect ID and minimum base value |

#### Per-Class Spell Profiles (100+ tools)

Deep analysis of a single class's spell book. Each accepts a class name parameter.

<details>
<summary>Click to expand full list</summary>

| Tool | Description |
|------|-------------|
| `get_class_spell_summary` | High-level overview of a class's spell book |
| `get_class_abilities_at_level` | All spells a class obtains at a specific level |
| `get_class_offensive_profile` | Nukes, DoTs, debuffs, AE damage, procs with offensive rating |
| `get_class_defensive_profile` | Runes, heals, AC buffs, resist buffs, crowd control, damage shields |
| `get_class_mana_profile` | Resource cost vs pool, most expensive spells, resource milestones |
| `get_class_heal_breakdown` | Direct heals, HoTs, group heals, mana efficiency |
| `get_class_dot_profile` | DoT spells — total damage, mana efficiency, resist types |
| `get_class_direct_damage_profile` | Nukes — highest damage, DPS, AE nukes, mana efficiency |
| `get_class_debuff_profile` | Slow, resist/stat/AC debuffs, snare, silence |
| `get_class_self_buff_profile` | Self-only buff analysis |
| `get_class_group_buff_profile` | Group targeting buffs, effects, duration tiers |
| `get_class_crowd_control_profile` | Stun, mez, charm, fear, root, snare, calm |
| `get_class_pet_spell_profile` | Summon pets, charm, pet buffs/heals/shields |
| `get_class_cure_spell_profile` | Cure and dispel abilities |
| `get_class_transport_profile` | Teleport destinations, gate, bind, speed, levitate |
| `get_class_emergency_ability_analysis` | FD, gate, invis, runes, cures, aggro drops, instant-casts |
| `get_class_ae_spell_profile` | PB AE, Targeted AE, Directional, Beam, Ring AE |
| `get_class_instant_cast_profile` | Zero cast time spells |
| `get_class_taunt_aggro_profile` | Hate generation, aggro reduction, AE taunts |
| `get_class_regen_profile` | HP, mana, and endurance regen |
| `get_class_lifetap_profile` | Lifetap, HP drain, max HP buffs |
| `get_class_stat_buff_profile` | STR, DEX, AGI, STA, INT, WIS, CHA modifiers |
| `get_class_resist_buff_profile` | Resist modifiers per element |
| `get_class_resist_debuff_profile` | Resist debuffs per element |
| `get_class_haste_slow_profile` | Melee haste buffs, slow debuffs |
| `get_class_ac_attack_profile` | AC and attack rating buffs/debuffs |
| `get_class_melee_combat_profile` | Crit, double/triple attack, flurry, riposte, parry |
| `get_class_melee_discipline_profile` | Endurance-based disciplines |
| `get_class_endurance_profile` | Endurance regen, max endurance, drain |
| `get_class_skill_modifier_profile` | Skill damage, accuracy, timer reduction |
| `get_class_song_modifier_profile` | Song DoT, singing mods, instrument mods |
| `get_class_crit_profile` | Spell/melee crit chance, crit damage |
| `get_class_avoidance_profile` | Parry, dodge, riposte, block, strikethrough |
| `get_class_special_attack_profile` | Rampage, headshot, slay undead, assassinate |
| `get_class_visibility_profile` | Invisibility, see invis, ultravision |
| `get_class_silence_amnesia_profile` | Silence, amnesia, spell disruption |
| `get_class_proc_profile` | Spell procs, melee procs, range procs |
| `get_class_max_hp_mana_profile` | Max HP/mana modifiers |
| `get_class_pet_enhancement_profile` | Pet haste, crit, max HP, avoidance |
| `get_class_damage_shield_profile` | Regular and reverse damage shields |
| `get_class_death_save_profile` | Feign death, fade, death save |
| `get_class_charm_fear_profile` | Charm, fear, immunities |
| `get_class_stun_mez_profile` | Stun, mesmerize, calm |
| `get_class_root_snare_profile` | Root and snare spells |
| `get_class_dispel_profile` | Dispel and cure abilities |
| `get_class_illusion_profile` | Illusion/form-change spells |
| `get_class_summon_profile` | Summon items, pets, corpses, familiars |
| `get_class_movement_profile` | Speed, levitate, teleport, water breathing |
| `get_class_mana_recovery_profile` | Mana regen, drain/tap, transfer |
| `get_class_mana_drain_profile` | Offensive mana drain and mana regen |
| `get_class_spell_focus_profile` | Twincast, spell crit, spell haste, damage mods |
| `get_class_spell_focus_limit_profile` | Focus effects with limiting conditions |
| `get_class_resist_profile` | Resist modification profile (buffs and debuffs) |
| `get_class_teleport_profile` | Teleport destinations and transport |
| `get_class_buff_duration_analysis` | Duration tier analysis |
| `get_class_spell_range_profile` | Range distributions and patterns |
| `get_class_cast_time_distribution` | Cast time speed brackets |
| `get_class_recast_time_profile` | Cooldown brackets |
| `get_class_target_type_profile` | Target type distributions |
| `get_class_spell_category_profile` | Category and subcategory breadth |
| `get_class_recourse_profile` | Recourse spell chains |
| `get_class_pushback_profile` | Pushback/knockup effects |
| `get_class_spell_recovery_profile` | Recovery time brackets |
| `get_class_timer_group_profile` | Shared recast timers |
| `get_class_mana_efficiency_by_level` | Mana cost trends by level |
| `get_class_spell_beneficial_ratio` | Buff vs debuff proportions by level |
| `get_class_spell_effect_diversity` | Unique SPAs used, rarest effects |
| `get_class_spell_slot_profile` | SPA slot count distribution |
| `get_class_spell_rank_distribution` | Rk. I/II/III vs non-ranked by bracket |
| `get_class_combat_ability_profile` | Mana vs endurance vs free-cost |
| `get_class_ae_capacity_profile` | AE subtypes and ranges |
| `get_class_defensive_cooldown_profile` | 30s+ recast defensive abilities |
| `get_class_offensive_cooldown_profile` | 30s+ recast offensive burns |
| `get_class_spell_power_curve` | Max damage/heal/mana per 10-level bracket |
| `get_class_spells_by_expansion` | Spells by expansion era |
| `get_class_spell_timer_conflict_analysis` | Spells sharing timer IDs |
| `get_class_resource_cost_comparison` | Avg/max mana and endurance by level |
| `get_class_spell_duration_breakdown` | Duration bucket analysis |
| `get_class_beneficial_target_analysis` | Beneficial spell targeting patterns |
| `get_class_detrimental_analysis` | Detrimental resist types and top SPAs |
| `get_class_exclusive_spells` | Spells only this class has |
| `get_class_new_spells_by_level_bracket` | New spell lines vs upgrades per bracket |
| `get_class_obsolete_spell_analysis` | Spells superseded by better versions |
| `get_class_spell_line_progression` | Spell line families across levels |
| `get_class_spell_acquisition_curve` | New spells per bracket, peaks, gaps |
| `get_class_spell_density_map` | Spells per 5-level bucket |
| `get_class_spell_upgrade_chains` | Rank progressions and chain lengths |
| `get_class_level_cap_progression` | Spell counts at each EQ level cap |
| `get_class_spell_level_gap_analysis` | Level ranges with no new spells |
| `get_class_spell_name_patterns` | Common words, prefixes, naming themes |
| `get_class_multi_effect_profile` | SPA effect counts per spell |
| `get_class_signature_spells` | Exclusive spells not available to others |
| `get_class_spa_breadth` | Unique effect types used |
| `get_class_spell_scaling_analysis` | HP/AC/mana value scaling |
| `get_class_spell_shared_matrix` | Overlap with all other classes |
| `get_class_ae_range_profile` | AE range distribution |
| `get_class_endurance_vs_mana_profile` | Resource type split by level |
| `get_class_damage_per_mana` | DPM rankings by level |
| `get_class_heal_per_mana` | HPM rankings by level |
| `get_class_identity_profile` | Comprehensive class card — exclusive spells, stats, role identity |

</details>

#### Efficiency & DPS Analysis (6 tools)

Combat effectiveness rankings with mana efficiency metrics.

| Tool | Description |
|------|-------------|
| `get_class_nuke_efficiency` | Direct damage ranked by DPS and damage per mana |
| `get_class_heal_efficiency` | Direct heals ranked by HPS and heal per mana |
| `get_class_dot_efficiency` | DoTs ranked by total damage and damage per mana |
| `get_class_burst_damage_window` | Max damage in 6s, 12s, and 18s burst windows |
| `get_class_sustained_dps_profile` | Nukes ranked by damage per cycle time (cast + recast) |
| `get_class_spell_by_effect_value` | Filter spells by SPA and minimum base value |

#### Cross-Class Comparisons (30+ tools)

Tools comparing all 16 classes or specific class pairs.

<details>
<summary>Click to expand full list</summary>

| Tool | Description |
|------|-------------|
| `get_class_comparison_matrix` | All 16 classes compared — spell count, beneficial %, skills, stats |
| `get_class_spell_diversity_index` | Distinct SPA effects per class, exclusive effects, overlap matrix |
| `get_class_role_analysis` | Classes classified by role (Tank/Healer/DPS/CC/Utility) |
| `get_class_comparison_radar` | Classes scored 0-100 across 8 dimensions |
| `get_class_synergy_matrix` | 16×16 class pair synergy scores |
| `get_class_healing_comparison_matrix` | Healing capabilities across all classes |
| `get_class_pet_comparison_matrix` | Pet capabilities across all classes |
| `get_class_group_buff_contribution` | Unique group/raid buffs each class brings |
| `get_class_buff_debuff_ratio` | Beneficial vs detrimental ratio cross-class |
| `get_class_spell_book_size_comparison` | Spell book size comparison |
| `get_class_resurrection_comparison` | Resurrection spell comparison |
| `get_class_utility_spell_comparison` | Utility spells (rez, gate, summon, etc.) across classes |
| `get_class_spell_global_ranking` | Rank among 16 classes on spells, SPAs, damage, healing |
| `get_class_spell_overlap` | Compare two classes' spell overlap |
| `get_shared_spells_overview` | Cross-class spell sharing distribution |
| `get_resist_type_comparison` | Resist type matrix across all 16 classes |
| `get_spell_target_type_matrix` | Target type specialization per class |
| `get_spell_debuff_comparison_by_class` | Debuff arsenals across all 16 classes |
| `get_group_composition_advisor` | Optimal 6-person group compositions |

</details>

#### Global Spell Statistics (15+ tools)

Database-wide statistics not tied to any specific class.

<details>
<summary>Click to expand full list</summary>

| Tool | Description |
|------|-------------|
| `get_global_spell_statistics` | Total spells, per-class counts, resist/target types |
| `get_global_spa_distribution` | Top 50 most common SPAs across all 70K+ spells |
| `get_global_resist_type_distribution` | Resist type distribution across all spells |
| `get_global_target_type_distribution` | Target type distribution across all spells |
| `get_spa_class_matrix` | Which classes use a specific SPA |
| `get_spell_effect_overview` | Overview of all 419 SPAs |
| `get_spell_effect_encyclopedia` | Deep dive into a specific SPA effect type |
| `get_spell_effect_rarity_index` | Exclusive, rare, and universal effects per class |
| `get_spell_effect_combination_analysis` | SPA co-occurrence and effect slot patterns |
| `get_spell_growth_curve` | Spells per level bracket per class |
| `get_spell_resist_overview` | Resist type breakdown with beneficial/detrimental |
| `get_spell_target_overview` | Target type breakdown with category analysis |
| `get_spell_timer_overview` | Timer group analysis per class |
| `get_spell_category_breakdown` | Category breakdown per class |
| `get_spell_duration_overview` | Duration formula and distribution |
| `get_spell_stacking_overview` | Stacking group overview |
| `get_spell_ae_analysis` | AE type breakdown and radius distribution |
| `get_spell_pushback_overview` | Pushback/positioning overview |
| `get_spell_recourse_overview` | Recourse system overview |
| `get_spell_duration_formula_analysis` | Duration formula × value interactions |
| `get_spell_progression_analysis` | SPA effects per bracket per class |
| `get_resist_type_by_level_analysis` | Resist types by level bracket |
| `get_spell_cost_efficiency_analysis` | Cost vs resource pool analysis |
| `get_spell_scaling_analysis` | Spell line scaling across ranks |
| `get_spell_buff_duration_tier_list` | Buff duration tier list per class |
| `get_spell_damage_efficiency` | Damage-per-mana rankings |
| `get_spell_resist_bar_chart` | Resist type deep dive |
| `get_spell_name_pattern_analysis` | Name patterns and rank distributions |
| `get_spell_school_analysis` | Resist × beneficial/detrimental "school" analysis |
| `get_spell_category_cooccurrence` | Category co-occurrence patterns |
| `get_spell_target_effect_matrix` | Target type × effect matrix |
| `get_spell_level_milestone_guide` | Key spell milestones per class by level |
| `get_spell_duration_analysis` | Duration formula and bucket analysis |
| `get_spell_recast_timer_analysis` | Recast distributions and patterns |
| `get_spell_requirement_overview` | Casting requirement associations |
| `get_spell_level_distribution` | Level distribution for a class |
| `get_spell_cast_time_analysis` | Cast/recovery/recast timing analysis |
| `get_spell_mana_cost_overview` | Mana cost distribution and brackets |
| `get_spell_subcategory_overview` | Category/subcategory hierarchy |
| `get_class_unique_spell_analysis` | Exclusive vs shared spell analysis |
| `get_teleport_spell_overview` | All teleport destinations and class availability |
| `get_spell_recourse_chain_analysis` | Recourse chain depths and distributions |

</details>

---

### Local Data — Character & Classes (60 tools)

<details>
<summary>Click to expand full list</summary>

| Tool | Description |
|------|-------------|
| `get_class_info` / `get_race_info` / `get_deity_info` / `get_stat_info` | Basic lookup |
| `get_skill_caps` / `get_base_stats` / `get_ac_mitigation` | Progression data by class and level |
| `compare_races` / `compare_classes` / `compare_deities` | Side-by-side comparisons |
| `list_all_races` / `list_all_classes` / `list_all_deities` | Complete listings |
| `get_race_class_matrix` | Visual matrix of all race-class combinations |
| `get_deity_class_matrix` | Deity-class availability matrix |
| `get_character_creation_guide` | Role-based character creation advisor |
| `list_drakkin_heritages` | Drakkin dragon heritages |
| `compare_base_stats` / `compare_skill_caps` | Cross-class progression comparisons |
| `get_base_stat_overview` | All 16 classes' stats at a specific level |
| `get_skill_overview` | Skill-class matrix at level 125 |
| `get_race_stat_comparison` | All 16 races' starting stats compared |
| `get_deity_overview` | All 17 deities with availability rankings |
| `search_creature_types` | Search 980+ creature/NPC race types |
| `get_creature_type_overview` | All 973 creature types overview |
| `get_creature_type_faction_correlation` | Creature type-faction cross-reference |
| `get_class_power_milestone_timeline` | Spell/stat/skill unlocks by level bracket |
| `get_class_endgame_profile` | Class profile at level 125 |
| `get_class_spell_diversity_index` | SPA diversity per class |
| `get_skill_cap_progression_analysis` | Skill cap growth curves |
| `get_base_stat_growth_curve_analysis` | Base stat growth curves |
| `get_player_customization_overview` | Character creation appearance options |
| `get_race_appearance_options` | Detailed appearance options for a race |
| `get_combat_ability_class_analysis` | Combat ability analysis per class |
| `get_spell_requirement_class_breakdown` | Spell requirements per class |
| `get_ac_mitigation_comparison` | AC soft caps across all 16 classes |
| `get_ac_mitigation_progression_analysis` | AC progression for a class |
| `get_spell_stacking_conflict_analysis` | Multi-class stacking conflicts |
| `get_mercenary_ability_spell_analysis` | Mercenary ability-spell cross-reference |
| `get_overseer_trait_synergy_analysis` | Overseer trait synergy |
| `get_drakkin_heritage_class_analysis` | Drakkin heritage-class analysis |
| `get_spell_subcategory_depth_analysis` | Subcategory depth analysis |
| `get_skill_cap_cross_class_comparison` | Specific skill across all 16 classes |
| `get_spell_mana_efficiency_analysis` | Mana efficiency analysis |
| `get_faction_category_analysis` | Faction category distribution |
| `get_overseer_quest_slot_job_analysis` | Overseer quest slot/job analysis |
| `get_spell_endurance_cost_analysis` | Endurance cost analysis for a class |
| `get_zone_level_overlap_analysis` | Zone level overlap analysis |

</details>

---

### Local Data — Zones & Maps (14 tools)

| Tool | Description |
|------|-------------|
| `get_zone_map` | Zone map POIs with coordinates (34K+ locations) |
| `get_hot_zone_bonuses` | Current Hot Zone XP bonus information |
| `search_zones_by_name` | Search zones by name with optional level range filter |
| `search_zones_by_level` | Find zones appropriate for a character level range |
| `search_teleport_spells` | Find all spells that teleport to a specific zone |
| `get_leveling_zones_guide` | Complete leveling guide — all zones grouped by level tier |
| `get_zone_level_statistics` | Zone count by level band with bar chart |
| `get_map_statistics` | Map POI statistics and density distribution |
| `get_map_poi_label_analysis` | POI label analysis — categories, colors, density |
| `get_teleport_network_analysis` | Teleport network topology and hub zones |
| `get_zone_content_density_ranking` | Zones scored by content density |
| `get_map_poi_functional_classification` | POI functional categories (Merchant, Bank, etc.) |
| `get_zone_level_gap_analysis` | Level ranges with no zones or sparse coverage |
| `get_map_poi_zone_detail` | All POIs for a specific zone with coordinates |

---

### Local Data — Factions & Currencies (18 tools)

| Tool | Description |
|------|-------------|
| `search_factions` | Search 1600+ factions with expansion filter |
| `get_faction` | Faction details with starting values by race/class |
| `get_factions_by_race` / `get_factions_by_deity` / `get_factions_by_class` | Faction lookups |
| `get_character_factions` | Combined faction calculator for character creation |
| `search_alt_currencies` | Search alternate currencies |
| `search_tributes` / `get_tribute` | Tribute items lookup |
| `get_tribute_overview` / `get_tribute_benefit_analysis` / `get_tribute_role_analysis` / `get_tribute_efficiency_analysis` | Tribute system analysis |
| `get_faction_overview` / `compare_factions` | Faction overview and comparison |
| `get_currency_overview` | Alternate currency overview |
| `get_faction_modifier_overview` / `get_faction_starting_value_analysis` | Faction modifier analysis |
| `get_faction_network_analysis` | Faction relationship network |
| `get_deity_faction_impact_analysis` / `get_race_deity_optimizer` | Deity-faction optimization |
| `get_zone_faction_web_analysis` | Zone-faction cross-reference |
| `get_expansion_faction_timeline` | Faction growth across expansions |

---

### Local Data — Achievements & AAs (16 tools)

| Tool | Description |
|------|-------------|
| `search_achievements` / `get_achievement` | Achievement lookup |
| `list_achievement_categories` / `get_achievement_category` | Browse categories |
| `search_aa` / `get_aa` / `search_aa_by_description` | AA ability search |
| `get_achievement_overview` / `get_achievement_component_overview` / `get_achievement_requirement_analysis` | Achievement analysis |
| `get_aa_overview` / `get_aa_name_group_analysis` / `get_aa_role_theme_analysis` | AA system analysis |
| `get_achievement_category_depth_analysis` / `get_achievement_point_optimizer` | Achievement optimization |
| `get_aa_spell_correlation` | AA-spell cross-reference |
| `get_achievement_expansion_timeline` / `get_aa_ability_rank_analysis` | Timeline and rank analysis |

---

### Local Data — Overseer System (10 tools)

| Tool | Description |
|------|-------------|
| `search_overseer_agents` / `get_overseer_agent` | Agent lookup (300+ agents) |
| `search_overseer_quests` / `get_overseer_quest` | Quest lookup (800+ quests) |
| `get_overseer_incapacitations` | Incapacitation types and durations |
| `get_overseer_quest_summary` / `get_overseer_job_overview` | System overview |
| `search_overseer_agents_by_trait` | Search agents by trait |
| `get_overseer_slot_analysis` / `get_overseer_minion_rarity_analysis` | Slot and rarity analysis |
| `get_overseer_quest_efficiency_analysis` / `get_overseer_agent_trait_job_matrix` | Efficiency and optimization |
| `get_overseer_quest_category_guide` / `get_overseer_agent_job_coverage_optimizer` | Guides and optimization |
| `get_overseer_quest_difficulty_analysis` | Difficulty analysis |

---

### Local Data — Mercenaries (7 tools)

| Tool | Description |
|------|-------------|
| `search_mercenaries` / `get_mercenary` | Search and view 4200+ mercenary templates |
| `get_mercenary_stances` | Mercenary stances and descriptions |
| `get_mercenary_overview` | System overview with types, tiers, races |
| `get_mercenary_ability_overview` | All 14 mercenary abilities |
| `get_mercenary_tier_analysis` | Tier and proficiency analysis |
| `get_mercenary_class_synergy` | Recommended merc type per class |

---

### Local Data — Items & Effects (8 tools)

| Tool | Description |
|------|-------------|
| `search_item_effects` / `get_item_effect` | Search 1100+ item click/proc effects |
| `get_item_effect_overview` / `get_item_effect_spell_correlation` / `get_item_effect_category_breakdown` | Effect analysis |
| `search_augment_groups` / `list_augment_slot_types` | Augmentation system |
| `search_item_lore_groups` | Lore group search |
| `get_augmentation_system_analysis` | Full augmentation system analysis |

---

### Local Data — Lore, Reference & Patch Detection (30 tools)

| Tool | Description |
|------|-------------|
| `search_lore` / `get_lore` | Search and read 50+ in-game lore stories |
| `get_lore_overview` / `get_lore_theme_analysis` | Lore analysis |
| `get_starting_city_lore` | 29 starting city descriptions |
| `search_game_strings` | Search 7000+ game UI strings |
| `search_game_events` / `get_game_event` | Search 550+ in-game events |
| `list_expansions` / `get_expansion` / `compare_expansions` | Expansion info |
| `get_game_event_overview` / `get_game_event_calendar_analysis` | Event analysis |
| `get_expansion_timeline` / `get_expansion_content_density` / `get_expansion_impact_score` | Expansion analysis |
| `get_banner_categories` | Guild banner and campsite types |
| `search_help_topics` / `get_help_topic` | 75 official in-game help topics |
| `get_local_data_status` | Show loaded data files |
| `get_level_content_guide` | Content guide for a specific level |
| `get_content_progression_pathway` | Level 1-125 progression pathway |
| `get_game_data_summary_dashboard` | Summary of all 19 data systems |
| `search_all_local_data` | Unified search across all local data |
| `get_db_string_type_overview` | Meta overview of 68 string data types |
| `get_game_string_category_analysis` | Game string classification |
| `get_help_topic_content_analysis` | Help topic analysis |
| `get_cross_system_name_overlap` | Names appearing across 3+ systems |
| `save_data_snapshot` | Save game data snapshot for patch comparison |
| `get_data_update_summary` | Compare current data against snapshot |
| `get_data_update_detail` | Detailed diff per data system |

---

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
- "What are the most mana-efficient Wizard nukes?"
- "Compare burst damage between Wizard and Magician"
- "Which spells are exclusive to Bard?"

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
├── tools.ts          # Tool definitions and handlers (407 tools)
├── sources/          # Data source implementations
│   ├── base.ts       # Shared interfaces and fetch utilities
│   ├── index.ts      # Source aggregation
│   ├── localdata.ts  # Local EQ game file parser (40K+ lines)
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
