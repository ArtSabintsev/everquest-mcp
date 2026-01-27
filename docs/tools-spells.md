# Spell & Ability Tools (276)

The spell system is the most deeply covered area, with tools ranging from basic lookups to sophisticated analysis.

## Spell Lookup & Search (30 tools)

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

## Flexible Spell Queries (13 tools)

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

## Per-Class Spell Profiles (100+ tools)

Deep analysis of a single class's spell book. Each accepts a class name parameter.

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

## Efficiency & DPS Analysis (6 tools)

Combat effectiveness rankings with mana efficiency metrics.

| Tool | Description |
|------|-------------|
| `get_class_nuke_efficiency` | Direct damage ranked by DPS and damage per mana |
| `get_class_heal_efficiency` | Direct heals ranked by HPS and heal per mana |
| `get_class_dot_efficiency` | DoTs ranked by total damage and damage per mana |
| `get_class_burst_damage_window` | Max damage in 6s, 12s, and 18s burst windows |
| `get_class_sustained_dps_profile` | Nukes ranked by damage per cycle time (cast + recast) |
| `get_class_spell_by_effect_value` | Filter spells by SPA and minimum base value |

## Cross-Class Comparisons (30+ tools)

Tools comparing all 16 classes or specific class pairs.

| Tool | Description |
|------|-------------|
| `get_class_comparison_matrix` | All 16 classes compared — spell count, beneficial %, skills, stats |
| `get_class_spell_diversity_index` | Distinct SPA effects per class, exclusive effects, overlap matrix |
| `get_class_role_analysis` | Classes classified by role (Tank/Healer/DPS/CC/Utility) |
| `get_class_comparison_radar` | Classes scored 0-100 across 8 dimensions |
| `get_class_synergy_matrix` | 16x16 class pair synergy scores |
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

## Global Spell Statistics (15+ tools)

Database-wide statistics not tied to any specific class.

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
| `get_spell_duration_formula_analysis` | Duration formula x value interactions |
| `get_spell_progression_analysis` | SPA effects per bracket per class |
| `get_resist_type_by_level_analysis` | Resist types by level bracket |
| `get_spell_cost_efficiency_analysis` | Cost vs resource pool analysis |
| `get_spell_scaling_analysis` | Spell line scaling across ranks |
| `get_spell_buff_duration_tier_list` | Buff duration tier list per class |
| `get_spell_damage_efficiency` | Damage-per-mana rankings |
| `get_spell_resist_bar_chart` | Resist type deep dive |
| `get_spell_name_pattern_analysis` | Name patterns and rank distributions |
| `get_spell_school_analysis` | Resist x beneficial/detrimental "school" analysis |
| `get_spell_category_cooccurrence` | Category co-occurrence patterns |
| `get_spell_target_effect_matrix` | Target type x effect matrix |
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
