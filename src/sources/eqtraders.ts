// EQ Traders - Tradeskill database and guides
import {
  EQDataSource,
  SearchResult,
  TradeskillData,
  fetchPage,
  stripHtml,
} from './base.js';

const BASE_URL = 'https://www.eqtraders.com';

export class EQTradersSource extends EQDataSource {
  name = 'EQ Traders';
  baseUrl = BASE_URL;

  async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Tradeskill categories
    const tradeskills = [
      { name: 'Alchemy', url: '/recipes/recipe_search.php?tradeskill=Alchemy' },
      { name: 'Baking', url: '/recipes/recipe_search.php?tradeskill=Baking' },
      { name: 'Blacksmithing', url: '/recipes/recipe_search.php?tradeskill=Blacksmithing' },
      { name: 'Brewing', url: '/recipes/recipe_search.php?tradeskill=Brewing' },
      { name: 'Fletching', url: '/recipes/recipe_search.php?tradeskill=Fletching' },
      { name: 'Jewelry Making', url: '/recipes/recipe_search.php?tradeskill=Jewelry' },
      { name: 'Pottery', url: '/recipes/recipe_search.php?tradeskill=Pottery' },
      { name: 'Tailoring', url: '/recipes/recipe_search.php?tradeskill=Tailoring' },
      { name: 'Tinkering', url: '/recipes/recipe_search.php?tradeskill=Tinkering' },
      { name: 'Poison Making', url: '/recipes/recipe_search.php?tradeskill=Poison' },
      { name: 'Research', url: '/recipes/recipe_search.php?tradeskill=Research' },
    ];

    // Check if query matches a tradeskill
    for (const ts of tradeskills) {
      if (lowerQuery.includes(ts.name.toLowerCase().split(' ')[0])) {
        results.push({
          name: `${ts.name} Recipes`,
          type: 'tradeskill',
          id: ts.name.toLowerCase().replace(/\s+/g, '-'),
          url: `${BASE_URL}${ts.url}`,
          source: this.name,
          description: `Search ${ts.name} recipes`,
        });
      }
    }

    // Search for specific recipe
    if (results.length === 0 || lowerQuery.includes('recipe')) {
      const searchResults = await this.searchRecipes(query);
      results.push(...searchResults);
    }

    // Tradeskill guides
    if (lowerQuery.includes('guide') || lowerQuery.includes('level') || lowerQuery.includes('skillup')) {
      results.push({
        name: 'Tradeskill Leveling Guides',
        type: 'guide',
        id: 'ts-guides',
        url: `${BASE_URL}/articles/guides.php`,
        source: this.name,
        description: 'Guides for leveling tradeskills',
      });
    }

    // Trophy quests
    if (lowerQuery.includes('trophy')) {
      results.push({
        name: 'Tradeskill Trophy Guide',
        type: 'guide',
        id: 'trophy-guide',
        url: `${BASE_URL}/articles/trophy_guide.php`,
        source: this.name,
        description: 'Guide to tradeskill trophies',
      });
    }

    return results.slice(0, 15);
  }

  async searchRecipes(query: string): Promise<SearchResult[]> {
    try {
      const url = `${BASE_URL}/recipes/recipe_search.php?name=${encodeURIComponent(query)}`;
      const html = await fetchPage(url);
      const results: SearchResult[] = [];

      // Parse recipe results
      const recipePattern = /href="(recipe_page\.php\?article=\d+[^"]*)"[^>]*>([^<]+)/gi;
      let match;
      while ((match = recipePattern.exec(html)) !== null) {
        const recipeUrl = match[1];
        const name = stripHtml(match[2]);
        if (name && name.length > 1) {
          results.push({
            name,
            type: 'tradeskill',
            id: recipeUrl,
            url: `${BASE_URL}/recipes/${recipeUrl}`,
            source: this.name,
          });
        }
      }

      return results.slice(0, 20);
    } catch (error) {
      console.error('[EQ Traders] Recipe search failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  async searchTradeskills(query: string): Promise<SearchResult[]> {
    return this.search(query);
  }
}

export const eqtraders = new EQTradersSource();
