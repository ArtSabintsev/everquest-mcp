# EverQuest MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with comprehensive access to EverQuest game data. Search across 9 online databases and a local game data installation with 72 tools covering spells, items, NPCs, zones, quests, factions, achievements, overseer, mercenaries, and more.

## Features

- **72 tools** for querying EverQuest data
- **Multi-source search** - Query 9 online EQ databases in parallel
- **Local game data** - Parse 70K+ spells, 1600+ factions, 2700+ AAs, 800+ overseer quests, and more directly from game files
- **Spell analysis** - Effects, categories, stacking groups, class lists, effect-type search, resist-type search, recourse links, teleport zones, cast messages, endurance costs, timer groups, and resolved descriptions
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

## Available Tools (70)

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
| `get_spell_stacking` | Check spell stacking conflicts and overwrite rules |
| `search_stacking_groups` | Search spell stacking groups by name to find conflicting buffs/debuffs |
| `list_spell_categories` | List all 176 spell categories for filtering |
| `search_spells_by_name` | Search spells by name, find all ranks/versions of a spell line |
| `search_combat_abilities` | Search combat abilities (disciplines) by name |

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

### Local Data - Zones & Maps
| Tool | Description |
|------|-------------|
| `get_zone_map` | Zone map POIs with coordinates (34K+ locations) |
| `get_hot_zone_bonuses` | Current Hot Zone XP bonus information |
| `search_zones_by_name` | Search zones by name with optional level range filter |
| `search_zones_by_level` | Find zones appropriate for a character level range |
| `search_teleport_spells` | Find all spells that teleport to a specific zone |

### Local Data - Factions & Currencies
| Tool | Description |
|------|-------------|
| `search_factions` | Search 1600+ factions with expansion filter |
| `get_faction` | Faction details with starting values by race/class |
| `search_alt_currencies` | Search alternate currencies |
| `search_tributes` | Search tribute items |
| `get_tribute` | Get tribute item details |

### Local Data - Achievements & AA
| Tool | Description |
|------|-------------|
| `search_achievements` | Search achievements by name |
| `get_achievement` | Get achievement details with components |
| `search_aa` | Search 2700+ AA abilities |
| `get_aa` | Get AA ability details |

### Local Data - Overseer System
| Tool | Description |
|------|-------------|
| `search_overseer_agents` | Search 300+ overseer agents |
| `get_overseer_agent` | Agent details: traits, jobs, rarity, bio |
| `search_overseer_quests` | Search 800+ overseer quests |
| `get_overseer_quest` | Quest details: slots, traits, risks, success/failure outcomes |
| `get_overseer_incapacitations` | List incapacitation types and durations |

### Local Data - Mercenaries
| Tool | Description |
|------|-------------|
| `search_mercenaries` | Search 4200+ mercenary templates |
| `get_mercenary` | Get mercenary details with abilities |
| `get_mercenary_stances` | List mercenary stances and descriptions |

### Local Data - Items & Effects
| Tool | Description |
|------|-------------|
| `search_item_effects` | Search 1100+ item click/proc effect descriptions |
| `get_item_effect` | Get specific item effect description |
| `search_augment_groups` | Search augmentation slot groups |

### Local Data - Lore & Reference
| Tool | Description |
|------|-------------|
| `search_lore` | Search 50+ in-game lore stories |
| `get_lore` | Read a lore story |
| `search_game_strings` | Search 7000+ game UI strings |
| `search_game_events` | Search 550+ in-game event announcements |
| `get_game_event` | Get event announcement details |
| `list_expansions` | List all 33 EverQuest expansions |
| `get_banner_categories` | Guild banner and fellowship campsite types |
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
├── tools.ts          # Tool definitions and handlers (72 tools)
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

## Adding New Sources

1. Create a new file in `src/sources/` implementing the `EQDataSource` interface
2. Export it from `src/sources/index.ts`
3. Add to the `sources` array for multi-source search
4. Optionally add source-specific tools in `src/tools.ts`

## License

MIT
