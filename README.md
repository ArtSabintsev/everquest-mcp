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

### Local Game Data (requires EverQuest installation)

The primary data source, powering 386 of the 407 tools. This server does not ship with game data — it reads and parses files directly from an EverQuest installation on your machine at runtime. The code contains the parsing and analysis logic; the actual data (70K+ spells, faction tables, map files, etc.) lives in the EQ game directory.

This means you need a local EverQuest installation and must set the `EQ_GAME_PATH` environment variable pointing to it (see [Configuration](#configuration)). Without this, only the 21 online search tools are available.

When configured, the server parses these game files on demand and caches them in memory:

- **70K+ spells** with effects, classes, categories, stacking rules, and cast messages
- **1600+ factions** with starting values by race, class, and deity
- **2700+ AA abilities** with ranks, descriptions, and spell correlations
- **800+ overseer quests** and 300+ agents with traits, jobs, and slot requirements
- **4200+ mercenary templates** with stances, tiers, and abilities
- **34K+ map points of interest** from Brewall map files
- **980+ creature/NPC race types**, 550+ in-game events, 50+ lore stories
- **Achievement system**, skill caps, base stats, AC mitigation tables, and more

No external network calls required. Data stays up to date automatically — when EQ patches, the server reads the updated files on next use.

### Online Databases

Nine external EQ community databases searched via web scraping. These provide quest guides, item databases, raid loot tables, and other community-maintained content not available in local game files.

| Source | Specialty |
|--------|-----------|
| [Allakhazam](https://everquest.allakhazam.com) | Primary online database — spells, items, NPCs, zones |
| [Almar's Guides](https://www.almarsguides.com/eq) | Quest walkthroughs, epic guides, leveling |
| [EQ Traders](https://www.eqtraders.com) | Tradeskill recipes and guides |
| [EQInterface](https://www.eqinterface.com) | UI mods, maps, parsers, and tools |
| [EQResource](https://eqresource.com) | Modern expansion content, progression |
| [Fanra's Wiki](https://everquest.fanra.info) | General game information, mechanics |
| [Lucy](https://lucy.allakhazam.com) | Classic EQ spell and item data (historical) |
| [RaidLoot](https://raidloot.com/EQ) | Raid loot tables by expansion |
| [Zliz's Compendium](https://www.zlizeq.com) | Comprehensive EQ encyclopedia |

## Installation

```bash
git clone https://github.com/ArtSabintsev/everquest-mcp.git
cd everquest-mcp
npm install
npm run build
```

## Configuration

Add to your MCP client config. For Claude Desktop, edit `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS:

```json
{
  "mcpServers": {
    "everquest": {
      "command": "node",
      "args": ["/absolute/path/to/everquest-mcp/dist/index.js"],
      "env": {
        "EQ_GAME_PATH": "/path/to/your/EverQuest/installation"
      }
    }
  }
}
```

`EQ_GAME_PATH` must point to the root of your EverQuest installation directory — the folder containing `spells_us.txt`, `dbstr_us.txt`, the `Resources/` folder, and the `maps/` folder. This is required for the 386 local data tools to function. Without it, only the 21 online search tools are available.

Common EQ installation paths:

| Platform | Typical Path |
|----------|-------------|
| Windows | `C:\Users\Public\Daybreak Game Company\Installed Games\EverQuest` |
| macOS (CrossOver) | `~/Library/Application Support/CrossOver/Bottles/EverQuest/drive_c/users/Public/Daybreak Game Company/Installed Games/EverQuest` |

Then restart your MCP client.

## Available Tools (407)

| Category | Tools | Description |
|----------|------:|-------------|
| [Online Search](docs/tools-online-search.md) | 21 | Multi-source search across 9 EQ databases |
| [Spells & Abilities](docs/tools-spells.md) | 276 | Lookup, search, per-class profiles, efficiency analysis, cross-class comparisons, global statistics |
| [Character & Classes](docs/tools-character-classes.md) | 60 | Race/class/deity info, skill caps, base stats, AC mitigation, creature types |
| [Zones & Maps](docs/tools-zones-maps.md) | 14 | Zone search, map POIs, teleport network, leveling guide |
| [Factions & Currencies](docs/tools-factions-currencies.md) | 18 | 1600+ factions, alternate currencies, tributes, deity-faction optimization |
| [Achievements & AAs](docs/tools-achievements-aas.md) | 16 | Achievement lookup, AA abilities, category browsing |
| [Overseer](docs/tools-overseer.md) | 10 | 300+ agents, 800+ quests, trait/job optimization |
| [Mercenaries](docs/tools-mercenaries.md) | 7 | 4200+ templates, stances, tier analysis, class synergy |
| [Items & Effects](docs/tools-items-effects.md) | 8 | 1100+ item click/proc effects, augmentation system |
| [Lore, Reference & Patch Detection](docs/tools-lore-reference.md) | 30 | Lore stories, expansions, events, help topics, patch diff detection |

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

## Game Files Parsed

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
