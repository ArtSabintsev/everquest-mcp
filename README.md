# EverQuest MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with comprehensive access to EverQuest game data. Search across 9 online databases and a local game data installation with 125 tools covering spells, items, NPCs, zones, quests, factions, achievements, overseer, mercenaries, and more.

## Features

- **125 tools** for querying EverQuest data
- **Multi-source search** - Query 9 online EQ databases in parallel
- **Local game data** - Parse 70K+ spells, 1600+ factions, 2700+ AAs, 800+ overseer quests, and more directly from game files
- **Spell analysis** - Effects, categories, stacking groups, class lists, effect/resist/target/description search, recourse links, teleport zones, cast messages, endurance costs, timer groups, and resolved descriptions
- **Character data** - Race/class info with starting city lore and Drakkin heritages, skill caps, base stats, AC mitigation, deities
- **Creature encyclopedia** - 980+ NPC/monster race types searchable by name
- **Overseer system** - Agents with archetypes/traits/jobs, quests with slot details and success/failure outcomes
- **Zone maps** - 34K+ points of interest from Brewall map files, zone search by name/level, teleport spell lookup
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
| `search_spells_by_duration` | Search spells by buff/debuff duration (find short emergency spells or long-lasting buffs) |
| `search_spells_by_pushback` | Search spells with knockback/pushback effects (push back and push up values) |
| `search_spells_by_recovery_time` | Search spells by recovery time (delay after casting before next action) |
| `search_spells_by_subcategory` | Search spells by subcategory (Twincast, Undead, etc.) with auto-list of available subcategories |

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
| `search_creature_types` | Search 980+ creature/NPC race types (Aviaks, Werewolves, Giants, etc.) |
| `compare_races` | Compare two races side by side (stats, classes, deities) |
| `compare_classes` | Compare two classes side by side (races, spell counts, category breakdown) |
| `compare_deities` | Compare two deities side by side (follower races, classes, lore) |
| `list_all_races` | List all 16 playable races with base stats, classes, deities, descriptions |
| `list_all_classes` | List all 16 classes with type (melee/hybrid/caster), races, spell counts |
| `list_all_deities` | List all deities with follower races, available classes, and lore |
| `get_race_class_matrix` | Visual matrix of all race-class combinations with counts |
| `get_character_creation_guide` | Role-based character creation advisor with class/race recommendations |
| `get_deity_class_matrix` | Visual matrix of deity-class availability (which classes can worship each deity) |

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
| `get_faction_overview` | Faction system overview with counts by expansion, value ranges, starting modifier stats |
| `compare_factions` | Compare two factions side by side (expansion, value ranges, starting values by race) |
| `get_currency_overview` | Alternate currency overview — total count, description stats, keyword analysis, complete listing |

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
| `get_aa_overview` | AA system overview with keyword analysis, description stats, and rank distribution |

### Local Data - Overseer System
| Tool | Description |
|------|-------------|
| `search_overseer_agents` | Search 300+ overseer agents |
| `get_overseer_agent` | Agent details: traits, jobs, rarity, bio |
| `search_overseer_quests` | Search 800+ overseer quests |
| `get_overseer_quest` | Quest details: slots, traits, risks, success/failure outcomes |
| `get_overseer_incapacitations` | List incapacitation types and durations |
| `get_overseer_quest_summary` | Overseer system overview with categories, difficulties, durations, agent stats |
| `search_overseer_agents_by_trait` | Search overseer agents by trait (race/creature type) with auto-list of available traits |

### Local Data - Mercenaries
| Tool | Description |
|------|-------------|
| `search_mercenaries` | Search 4200+ mercenary templates |
| `get_mercenary` | Get mercenary details with abilities |
| `get_mercenary_stances` | List mercenary stances and descriptions |
| `get_mercenary_overview` | Mercenary system overview with types, tiers, races, and stances |

### Local Data - Items & Effects
| Tool | Description |
|------|-------------|
| `search_item_effects` | Search 1100+ item click/proc effect descriptions |
| `get_item_effect` | Get specific item effect description |
| `search_augment_groups` | Search augmentation slot groups |
| `list_augment_slot_types` | List all 31 augmentation slot types |
| `search_item_lore_groups` | Search item lore groups (LORE duplicate definitions) |

### Local Data - Lore & Reference
| Tool | Description |
|------|-------------|
| `search_lore` | Search 50+ in-game lore stories |
| `get_lore` | Read a lore story |
| `get_lore_overview` | Lore overview — story count, word count stats, longest/shortest stories, complete listing |
| `search_game_strings` | Search 7000+ game UI strings |
| `search_game_events` | Search 550+ in-game event announcements |
| `get_game_event` | Get event announcement details |
| `list_expansions` | List all 33 EverQuest expansions |
| `compare_expansions` | Compare two expansions side by side (factions, achievements, faction lists) |
| `get_game_event_overview` | Game event overview with category breakdown (seasonal, expansion, double XP, etc.) |
| `get_expansion` | Expansion content summary with factions and achievements |
| `get_banner_categories` | Guild banner and fellowship campsite types |
| `search_help_topics` | Search 75 official in-game help topics on game mechanics |
| `get_help_topic` | Read a specific help topic (augments, combat, mercenaries, etc.) |
| `get_local_data_status` | Show which local data files are loaded |

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
├── tools.ts          # Tool definitions and handlers (125 tools)
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
