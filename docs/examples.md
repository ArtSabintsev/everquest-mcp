# EverQuest MCP Examples

Real-world examples of using the EverQuest MCP with Claude.

## Quest Help

### Epic Quests

**User:** "How do I start the bard epic 1.0 quest?"

The MCP will search Almar's Guides and Allakhazam to provide:
- Starting NPC location
- Required items and mobs
- Step-by-step walkthrough
- Zone navigation tips

**User:** "I have the Solusek Mining Company Invoice for the bard epic. What's next?"

The MCP can track your progress and give you the next steps with locations and routes.

### Progression Quests

**User:** "What quests should I do in Plane of Knowledge?"

**User:** "How do I get keyed for Vex Thal?"

## Item Lookups

### Finding Items

**User:** "Where can I find a Thick Banded Belt?"

Returns:
- Item stats
- Who drops it
- Zone location
- Approximate drop rate

### Comparing Gear

**User:** "What's better gear than Grandiose Consigned for a level 100 bard?"

Searches for items with better stats at appropriate level ranges.

## Spell Information

### Spell Details

**User:** "What does Selo's Song of Travel do?"

Returns full spell description including:
- Effects (run speed, levitate, see invis, etc.)
- Duration
- Mana cost
- Level requirements
- Stacking information

### Class Spells

**User:** "What healing spells does a level 65 cleric have?"

**User:** "Show me all bard songs that give haste"

## Zone Information

### Getting Around

**User:** "How do I get to Plane of Knowledge from Freeport?"

Returns navigation instructions using PoK books/stones.

**User:** "What's the fastest way to get to Lavastorm?"

### Zone Details

**User:** "What level range is Karnor's Castle?"

**User:** "What named mobs are in Lower Guk?"

## Tradeskills

### Recipes

**User:** "How do I level blacksmithing from 200 to 300?"

Searches EQ Traders for optimal leveling recipes.

**User:** "What are the components for a Celestial Solvent?"

### Tradeskill Trophies

**User:** "How do I get the blacksmithing trophy?"

## Modern Content

### Heroic Adventures

**User:** "What are Gribble HAs and how do I do them?"

Searches for Dead Hills Heroic Adventure guides.

### Expansion Content

**User:** "What's the ToV progression path?"

Searches EQResource for modern expansion progression guides.

## Tips for Best Results

1. **Be specific** - "bard epic 1.0" works better than just "epic quest"
2. **Include context** - "level 100 bard gear" helps narrow results
3. **Use zone names** - "NPCs in Plane of Fear" is more precise
4. **Ask follow-ups** - The MCP maintains context within a conversation
