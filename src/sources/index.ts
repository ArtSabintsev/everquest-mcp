// Export all data sources
export * from './base.js';
export { allakhazam } from './allakhazam.js';
export { almars } from './almars.js';
export { eqresource } from './eqresource.js';
export { fanra } from './fanra.js';
export { eqtraders } from './eqtraders.js';
export { zliz } from './zliz.js';

import { EQDataSource, SearchResult } from './base.js';
import { allakhazam } from './allakhazam.js';
import { almars } from './almars.js';
import { eqresource } from './eqresource.js';
import { fanra } from './fanra.js';
import { eqtraders } from './eqtraders.js';
import { zliz } from './zliz.js';

// All registered sources
export const sources: EQDataSource[] = [
  allakhazam,
  almars,
  eqresource,
  fanra,
  eqtraders,
  zliz,
];

// Get a source by name
export function getSource(name: string): EQDataSource | undefined {
  return sources.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
}

// Search across all sources
export async function searchAll(query: string): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];

  const searchPromises = sources.map(async (source) => {
    try {
      const results = await source.search(query);
      return results;
    } catch (error) {
      console.error(`Error searching ${source.name}:`, error);
      return [];
    }
  });

  const resultsArrays = await Promise.all(searchPromises);

  for (const results of resultsArrays) {
    allResults.push(...results);
  }

  // Sort by relevance (exact matches first)
  const lowerQuery = query.toLowerCase();
  allResults.sort((a, b) => {
    const aExact = a.name.toLowerCase() === lowerQuery ? 1 : 0;
    const bExact = b.name.toLowerCase() === lowerQuery ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    const aStarts = a.name.toLowerCase().startsWith(lowerQuery) ? 1 : 0;
    const bStarts = b.name.toLowerCase().startsWith(lowerQuery) ? 1 : 0;
    return bStarts - aStarts;
  });

  return allResults.slice(0, 30);
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
