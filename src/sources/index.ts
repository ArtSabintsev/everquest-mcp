// Export all data sources
export * from './base.js';
export { allakhazam } from './allakhazam.js';
export { almars } from './almars.js';
export { eqresource } from './eqresource.js';
export { fanra } from './fanra.js';
export { eqtraders } from './eqtraders.js';
export { zliz } from './zliz.js';
export { lucy } from './lucy.js';
export { raidloot } from './raidloot.js';
export { eqinterface } from './eqinterface.js';
export * from './localdata.js';

import { EQDataSource, SearchResult, normalizeQuery, fuzzyMatch } from './base.js';
import { allakhazam } from './allakhazam.js';
import { almars } from './almars.js';
import { eqresource } from './eqresource.js';
import { fanra } from './fanra.js';
import { eqtraders } from './eqtraders.js';
import { zliz } from './zliz.js';
import { lucy } from './lucy.js';
import { raidloot } from './raidloot.js';
import { eqinterface } from './eqinterface.js';

// All registered sources
export const sources: EQDataSource[] = [
  allakhazam,
  almars,
  eqresource,
  fanra,
  eqtraders,
  zliz,
  lucy,
  raidloot,
  eqinterface,
];

// Get a source by name
export function getSource(name: string): EQDataSource | undefined {
  return sources.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
}

// Search across all sources with fuzzy matching
export async function searchAll(query: string): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];
  const normalizedQuery = normalizeQuery(query);

  const searchPromises = sources.map(async (source) => {
    try {
      const results = await source.search(query);
      return results;
    } catch (error) {
      console.error(`[${source.name}] Search failed:`, error instanceof Error ? error.message : error);
      return [];
    }
  });

  const resultsArrays = await Promise.all(searchPromises);

  for (const results of resultsArrays) {
    allResults.push(...results);
  }

  // Deduplicate by name (case-insensitive)
  const seen = new Set<string>();
  const deduped = allResults.filter(r => {
    const key = r.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by relevance (exact matches first, then starts-with, then fuzzy)
  const lowerQuery = normalizedQuery.toLowerCase();
  deduped.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // Exact match
    const aExact = aName === lowerQuery ? 3 : 0;
    const bExact = bName === lowerQuery ? 3 : 0;
    if (aExact !== bExact) return bExact - aExact;

    // Starts with
    const aStarts = aName.startsWith(lowerQuery) ? 2 : 0;
    const bStarts = bName.startsWith(lowerQuery) ? 2 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;

    // Contains
    const aContains = aName.includes(lowerQuery) ? 1 : 0;
    const bContains = bName.includes(lowerQuery) ? 1 : 0;
    return bContains - aContains;
  });

  return deduped.slice(0, 30);
}

// Search for quests across all sources
export async function searchQuests(query: string): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];

  const searchPromises = sources.map(async (source) => {
    try {
      if (source.searchQuests) {
        return await source.searchQuests(query);
      }
      // Fall back to general search for quest-like results
      const results = await source.search(query + ' quest');
      return results.filter(r => r.type === 'quest' || r.type === 'guide');
    } catch (error) {
      console.error(`[${source.name}] Quest search failed:`, error instanceof Error ? error.message : error);
      return [];
    }
  });

  const resultsArrays = await Promise.all(searchPromises);
  for (const results of resultsArrays) {
    allResults.push(...results);
  }

  return allResults.slice(0, 20);
}

// Search for tradeskills across relevant sources
export async function searchTradeskills(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  // EQ Traders is the primary source for tradeskills
  try {
    const tsResults = await eqtraders.search(query);
    results.push(...tsResults);
  } catch (error) {
    console.error('[EQ Traders] Tradeskill search failed:', error instanceof Error ? error.message : error);
  }

  // Also check Allakhazam for tradeskill items
  try {
    const zamResults = await allakhazam.searchItems(query);
    results.push(...zamResults.slice(0, 5));
  } catch (error) {
    console.error('[Allakhazam] Item search failed:', error instanceof Error ? error.message : error);
  }

  return results.slice(0, 20);
}

// Search for raid loot
export async function searchRaidLoot(query: string): Promise<SearchResult[]> {
  try {
    return await raidloot.search(query);
  } catch (error) {
    console.error('[RaidLoot] Search failed:', error instanceof Error ? error.message : error);
    return [];
  }
}

// Search for UI mods and tools
export async function searchUI(query: string): Promise<SearchResult[]> {
  try {
    return await eqinterface.search(query);
  } catch (error) {
    console.error('[EQInterface] Search failed:', error instanceof Error ? error.message : error);
    return [];
  }
}
