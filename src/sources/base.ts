// Base interfaces and utilities for all EQ data sources

export interface SearchResult {
  name: string;
  type: 'spell' | 'item' | 'npc' | 'zone' | 'quest' | 'guide' | 'tradeskill' | 'event' | 'unknown';
  id: string;
  url: string;
  source: string;
  description?: string;
}

// ============ NEW INTERFACES FOR DIALOG/LOCATION DATA ============

export interface Coordinates {
  x: number;
  y: number;
  z?: number;
}

export interface DialogEntry {
  speaker: 'player' | 'npc';
  text: string;
  trigger?: string;
}

export interface ZoneLocation {
  name: string;
  coordinates?: Coordinates;
  description?: string;
  destination?: string;
}

export interface QuestStep {
  number: number;
  action: string;
  target?: string;
  location?: string;
  coordinates?: Coordinates;
  result?: string;
}

export interface QuestNpc {
  name: string;
  zone?: string;
  coordinates?: Coordinates;
  role?: string;
}

export interface QuestItem {
  name: string;
  source?: string;
  quantity?: number;
}

// ============ DATA INTERFACES ============

export interface QuestData {
  name: string;
  url: string;
  source: string;
  steps?: QuestStep[];
  npcs?: QuestNpc[];
  items?: QuestItem[];
  zones?: string[];
  level?: string;
  description?: string;
  dialog?: DialogEntry[];
  raw?: string;
}

export interface SpellData {
  name: string;
  id: string;
  source: string;
  description?: string;
  mana?: number;
  castTime?: string;
  recastTime?: string;
  recoveryTime?: string;
  duration?: string;
  range?: string;
  aeRange?: string;
  target?: string;
  resist?: string;
  skill?: string;
  beneficial?: boolean;
  pushBack?: number;
  pushUp?: number;
  classes?: Record<string, number>; // class name -> level
  effects?: string[];
  expansion?: string;
  category?: string;
  subcategory?: string;
  recourseId?: number;      // Recourse spell ID (cast on caster when landing)
  recourseName?: string;    // Recourse spell name
  teleportZone?: string;    // Teleport destination zone short name
  timerId?: number;         // Shared reuse timer group (>0 = shared timer)
  raw?: string;
}

export interface ItemData {
  name: string;
  id: string;
  source: string;
  slot?: string;
  ac?: number;
  damage?: number;
  delay?: number;
  ratio?: number;
  stats?: Record<string, number>; // stat name -> value
  heroicStats?: Record<string, number>;
  effects?: string[];
  classes?: string[];
  races?: string[];
  weight?: number;
  dropsFrom?: string[];
  expansion?: string;
  required?: number; // required level
  recommended?: number; // recommended level
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
  dialog?: DialogEntry[];
  spawnPoint?: Coordinates;
  questInvolvement?: string[];
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
  portalStones?: ZoneLocation[];
  books?: ZoneLocation[];
  notableLocations?: ZoneLocation[];
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
  'User-Agent': 'EverQuest-MCP/1.0 (https://github.com/ArtSabintsev/everquest-mcp)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Connection': 'keep-alive',
};

// ============ CACHING ============

interface CacheEntry {
  data: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_CACHE_SIZE = 500; // Max entries

function getCached(url: string): string | null {
  const entry = cache.get(url);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(url);
    return null;
  }
  return entry.data;
}

function setCache(url: string, data: string): void {
  // Evict oldest entries if cache is full
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = [...cache.entries()]
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, 50); // Remove 50 oldest
    for (const [key] of oldest) {
      cache.delete(key);
    }
  }
  cache.set(url, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheStats(): { size: number; maxSize: number; ttlMinutes: number } {
  return { size: cache.size, maxSize: MAX_CACHE_SIZE, ttlMinutes: CACHE_TTL_MS / 60000 };
}

// ============ RATE LIMITING ============

interface RateLimitState {
  tokens: number;
  lastRefill: number;
}

const rateLimits = new Map<string, RateLimitState>();
const RATE_LIMIT_TOKENS = 10; // requests per window
const RATE_LIMIT_REFILL_MS = 1000; // refill window (1 second)

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

async function waitForRateLimit(url: string): Promise<void> {
  const domain = getDomain(url);
  let state = rateLimits.get(domain);

  if (!state) {
    state = { tokens: RATE_LIMIT_TOKENS, lastRefill: Date.now() };
    rateLimits.set(domain, state);
  }

  // Refill tokens based on time passed
  const now = Date.now();
  const timePassed = now - state.lastRefill;
  const tokensToAdd = Math.floor(timePassed / RATE_LIMIT_REFILL_MS) * RATE_LIMIT_TOKENS;

  if (tokensToAdd > 0) {
    state.tokens = Math.min(RATE_LIMIT_TOKENS, state.tokens + tokensToAdd);
    state.lastRefill = now;
  }

  // Wait if no tokens available
  if (state.tokens <= 0) {
    const waitTime = RATE_LIMIT_REFILL_MS - (now - state.lastRefill);
    if (waitTime > 0) {
      await sleep(waitTime);
      state.tokens = RATE_LIMIT_TOKENS;
      state.lastRefill = Date.now();
    }
  }

  state.tokens--;
}

// ============ FUZZY MATCHING ============

// Simple Levenshtein distance for typo tolerance
export function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Normalize search terms (handle common EQ typos/variations)
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    // Common zone name variations
    .replace(/karnors?/gi, "karnor's")
    .replace(/pok\b/gi, 'plane of knowledge')
    .replace(/\bpof\b/gi, 'plane of fear')
    .replace(/\bpoh\b/gi, 'plane of hate')
    .replace(/\bpom\b/gi, 'plane of mischief')
    .replace(/\bpoj\b/gi, 'plane of justice')
    .replace(/\bpov\b/gi, 'plane of valor')
    .replace(/\bpoi\b/gi, 'plane of innovation')
    .replace(/\bpon\b/gi, 'plane of nightmare')
    .replace(/\bpod\b/gi, 'plane of disease')
    .replace(/\bsol\s?a\b/gi, "solusek's eye")
    .replace(/\bsol\s?b\b/gi, 'nagafen')
    .replace(/\bguk\b/gi, 'guk')
    .replace(/\blguk\b/gi, 'lower guk')
    .replace(/\buguk\b/gi, 'upper guk')
    .replace(/\bha\b/gi, 'heroic adventure')
    .replace(/\bhas\b/gi, 'heroic adventures')
    // Apostrophe handling
    .replace(/'/g, "'")
    .replace(/`/g, "'");
}

// Check if result matches query with fuzzy tolerance
export function fuzzyMatch(query: string, text: string, threshold = 0.3): boolean {
  const normalizedQuery = normalizeQuery(query);
  const normalizedText = text.toLowerCase();

  // Exact substring match
  if (normalizedText.includes(normalizedQuery)) return true;

  // Check each word
  const queryWords = normalizedQuery.split(/\s+/);
  const textWords = normalizedText.split(/\s+/);

  for (const qWord of queryWords) {
    let matched = false;
    for (const tWord of textWords) {
      // Direct match
      if (tWord.includes(qWord) || qWord.includes(tWord)) {
        matched = true;
        break;
      }
      // Fuzzy match for longer words
      if (qWord.length >= 4 && tWord.length >= 4) {
        const distance = levenshtein(qWord, tWord);
        const maxLen = Math.max(qWord.length, tWord.length);
        if (distance / maxLen <= threshold) {
          matched = true;
          break;
        }
      }
    }
    if (!matched) return false;
  }
  return true;
}

// ============ FETCH UTILITIES ============

const FETCH_TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

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

export async function fetchPage(url: string, skipCache = false): Promise<string> {
  // Check cache first
  if (!skipCache) {
    const cached = getCached(url);
    if (cached) {
      return cached;
    }
  }

  // Rate limit
  await waitForRateLimit(url);

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
          await sleep(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
        throw error;
      }

      const text = await response.text();
      setCache(url, text);
      return text;
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

// Parse number from string, handling commas and K/M suffixes
export function parseNumber(str: string | undefined): number | undefined {
  if (!str) return undefined;
  const cleaned = str.replace(/,/g, '').trim();
  if (cleaned.endsWith('k') || cleaned.endsWith('K')) {
    return parseFloat(cleaned) * 1000;
  }
  if (cleaned.endsWith('m') || cleaned.endsWith('M')) {
    return parseFloat(cleaned) * 1000000;
  }
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

// Extract coordinates from various EQ formats
export function extractCoordinates(text: string): Coordinates | null {
  // Pattern 1: loc(x, y) or loc(x, y, z)
  let match = text.match(/loc\s*\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*(?:,\s*([+-]?\d+(?:\.\d+)?))?\s*\)/i);
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      z: match[3] ? parseFloat(match[3]) : undefined,
    };
  }

  // Pattern 2: /loc output format: "Your Location is X, Y, Z"
  match = text.match(/location\s+(?:is\s+)?([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*(?:,\s*([+-]?\d+(?:\.\d+)?))?/i);
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      z: match[3] ? parseFloat(match[3]) : undefined,
    };
  }

  // Pattern 3: Signed coordinate pairs +1234, -5678 or (-1234, 5678)
  match = text.match(/\(?([+-]\d+(?:\.\d+)?)\s*,\s*([+-]\d+(?:\.\d+)?)\s*(?:,\s*([+-]?\d+(?:\.\d+)?))?\)?/);
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      z: match[3] ? parseFloat(match[3]) : undefined,
    };
  }

  // Pattern 4: "at coords x, y" or "coords: x, y"
  match = text.match(/(?:at|coords?|coordinates)[:\s]+([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
    };
  }

  return null;
}

// Extract dialog entries from EQ-style text
export function extractDialog(text: string, npcName?: string): DialogEntry[] {
  const dialog: DialogEntry[] = [];
  const seenTexts = new Set<string>();

  // Pattern 1: "You say, 'text'" or "You say 'text'"
  const playerPattern = /You say,?\s*'([^']+)'/gi;
  let match;
  while ((match = playerPattern.exec(text)) !== null) {
    const dialogText = match[1].trim();
    if (!seenTexts.has(dialogText.toLowerCase())) {
      seenTexts.add(dialogText.toLowerCase());
      dialog.push({
        speaker: 'player',
        text: dialogText,
        trigger: dialogText,
      });
    }
  }

  // Pattern 2: "NpcName says, 'text'" or "NpcName says 'text'"
  if (npcName) {
    const escapedName = npcName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const npcPattern = new RegExp(`${escapedName}\\s+says,?\\s*'([^']+)'`, 'gi');
    while ((match = npcPattern.exec(text)) !== null) {
      const dialogText = match[1].trim();
      if (!seenTexts.has(dialogText.toLowerCase())) {
        seenTexts.add(dialogText.toLowerCase());
        dialog.push({
          speaker: 'npc',
          text: dialogText,
        });
      }
    }
  }

  // Pattern 3: Generic "says, 'text'" for any speaker
  const genericPattern = /(\w[\w\s]{0,30}?)\s+says,?\s*'([^']+)'/gi;
  while ((match = genericPattern.exec(text)) !== null) {
    const dialogText = match[2].trim();
    if (!seenTexts.has(dialogText.toLowerCase())) {
      seenTexts.add(dialogText.toLowerCase());
      dialog.push({
        speaker: 'npc',
        text: dialogText,
      });
    }
  }

  return dialog;
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
