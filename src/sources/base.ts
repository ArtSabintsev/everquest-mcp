// Base interfaces and utilities for all EQ data sources

export interface SearchResult {
  name: string;
  type: 'spell' | 'item' | 'npc' | 'zone' | 'quest' | 'guide' | 'tradeskill' | 'unknown';
  id: string;
  url: string;
  source: string;
  description?: string;
}

export interface QuestData {
  name: string;
  url: string;
  source: string;
  steps?: string[];
  npcs?: string[];
  items?: string[];
  zones?: string[];
  level?: string;
  description?: string;
  raw?: string;
}

export interface SpellData {
  name: string;
  id: string;
  source: string;
  mana?: string;
  castTime?: string;
  recastTime?: string;
  duration?: string;
  range?: string;
  target?: string;
  resist?: string;
  skill?: string;
  classes?: string;
  effect?: string;
  expansion?: string;
  raw?: string;
}

export interface ItemData {
  name: string;
  id: string;
  source: string;
  slot?: string;
  ac?: string;
  damage?: string;
  delay?: string;
  stats?: string;
  effect?: string;
  classes?: string;
  races?: string;
  weight?: string;
  dropsFrom?: string;
  expansion?: string;
  raw?: string;
}

export interface NpcData {
  name: string;
  id: string;
  source: string;
  level?: string;
  zone?: string;
  race?: string;
  class?: string;
  faction?: string;
  loot?: string[];
  location?: string;
  raw?: string;
}

export interface ZoneData {
  name: string;
  id: string;
  source: string;
  levelRange?: string;
  continent?: string;
  expansion?: string;
  npcs?: string[];
  connectedZones?: string[];
  raw?: string;
}

export interface TradeskillData {
  name: string;
  url: string;
  source: string;
  skill?: string;
  trivial?: string;
  components?: string[];
  result?: string;
  raw?: string;
}

export const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

const FETCH_TIMEOUT_MS = 10000; // 10 second timeout
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

// Check if error is retryable (network issues, 5xx errors)
function isRetryable(error: unknown, status?: number): boolean {
  if (status && status >= 500) return true;
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('timeout') || msg.includes('network') || msg.includes('abort');
  }
  return false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchPage(url: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: HEADERS,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        if (isRetryable(error, response.status) && attempt < MAX_RETRIES) {
          console.error(`[Fetch] Attempt ${attempt + 1} failed for ${url}: ${error.message}, retrying...`);
          await sleep(RETRY_DELAY_MS * (attempt + 1)); // Exponential backoff
          continue;
        }
        throw error;
      }
      return response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));

      if (isRetryable(error, undefined) && attempt < MAX_RETRIES) {
        console.error(`[Fetch] Attempt ${attempt + 1} failed for ${url}: ${lastError.message}, retrying...`);
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      throw lastError;
    }
  }

  throw lastError ?? new Error('Fetch failed');
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractText(html: string, startMarker: string, endMarker: string): string {
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return '';
  const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
  if (endIdx === -1) return html.slice(startIdx + startMarker.length);
  return html.slice(startIdx + startMarker.length, endIdx);
}

// Base class for data sources
export abstract class EQDataSource {
  abstract name: string;
  abstract baseUrl: string;

  abstract search(query: string): Promise<SearchResult[]>;

  // Optional methods - not all sources have all data types
  async searchSpells?(query: string): Promise<SearchResult[]>;
  async searchItems?(query: string): Promise<SearchResult[]>;
  async searchNpcs?(query: string): Promise<SearchResult[]>;
  async searchZones?(query: string): Promise<SearchResult[]>;
  async searchQuests?(query: string): Promise<SearchResult[]>;
  async searchTradeskills?(query: string): Promise<SearchResult[]>;

  async getSpell?(id: string): Promise<SpellData | null>;
  async getItem?(id: string): Promise<ItemData | null>;
  async getNpc?(id: string): Promise<NpcData | null>;
  async getZone?(id: string): Promise<ZoneData | null>;
  async getQuest?(id: string): Promise<QuestData | null>;
}
