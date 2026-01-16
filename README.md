# EverQuest MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with access to EverQuest game data. Search across multiple EQ databases simultaneously to get information about spells, items, NPCs, zones, quests, tradeskills, and more.

## Features

- **Multi-source search** - Query 9 different EQ databases in parallel
- **Comprehensive coverage** - Spells, items, NPCs, zones, quests, tradeskills, epic guides
- **Detailed lookups** - Get full spell effects, item stats, NPC loot tables, zone info
- **Quest guides** - Epic quest walkthroughs, leveling guides, farming guides
- **Raid loot** - Raid drop tables by expansion
- **UI mods** - Maps, parsers, and interface tools

## Data Sources

| Source | Specialty |
|--------|-----------|
| [Allakhazam](https://everquest.allakhazam.com) | Primary database - spells, items, NPCs, zones |
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

## Available Tools

### Multi-Source Search
| Tool | Description |
|------|-------------|
| `search_all` | Search ALL databases simultaneously |
| `search_quests` | Search for quests and quest guides |
| `search_tradeskills` | Search for tradeskill recipes and guides |
| `list_sources` | List all available data sources |

### Allakhazam (Primary Database)
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
| `search_eqresource` | EQResource - modern expansions |
| `search_fanra` | Fanra's Wiki - game mechanics |
| `search_eqtraders` | EQ Traders - tradeskill recipes |
| `search_lucy` | Lucy - classic EQ spell/item data |
| `search_raidloot` | RaidLoot - raid drop tables |
| `search_ui` | EQInterface - UI mods, maps, parsers |

## Example Queries

Once configured, you can ask your AI assistant things like:

- "What are the best leveling spots for level 70-80?"
- "How do I start the bard epic 1.0 quest?"
- "What does the spell Complete Heal do?"
- "Where can I find a Thick Banded Belt?"
- "How do I get to Plane of Knowledge from Freeport?"
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
├── tools.ts          # Tool definitions and handlers
├── sources/          # Data source implementations
│   ├── base.ts       # Shared interfaces and fetch utilities
│   ├── index.ts      # Source aggregation
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

## Adding New Sources

1. Create a new file in `src/sources/` implementing the `EQDataSource` interface
2. Export it from `src/sources/index.ts`
3. Add to the `sources` array for multi-source search
4. Optionally add source-specific tools in `src/tools.ts`

## License

MIT
