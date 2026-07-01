// Historical EverQuest lore and archive sources.
import { get as httpsGet } from 'node:https';
import { EQDataSource, SearchResult, fetchPage, stripHtml } from './base.js';

const OFFICIAL_HISTORY_URL = 'https://web.archive.org/web/19990910004532/http://everquest.station.sony.com/e_history.html';
const FVPROJECT_BASE_URL = 'https://fvproject.com';
const FVPROJECT_API_URL = `${FVPROJECT_BASE_URL}/api.php`;
const FV_LORE_CATEGORY = 'Category:Lore';
const EQ_ARCHIVES_SEARCH_URL = 'https://search.eqarchives.org/';
const EQ_ARCHIVES_REPOSITORY_URL = 'https://github.com/dbsanfte/eq-archives/tree/master';
const EQ_ARCHIVES_INDEX = 'eq-archive';
const EQ_ARCHIVES_ELASTIC_URL = `${EQ_ARCHIVES_SEARCH_URL}elasticsearch/${EQ_ARCHIVES_INDEX}`;
// Public readonly credential embedded by https://search.eqarchives.org/ for browser search.
const EQ_ARCHIVES_AUTHORIZATION = 'Basic cmVhZG9ubHk6ZTNjYzVjNTAtZWM2YS0xMWVmLWFmNzQtMDAxNTVkNGI2MDk5';
const ARCHIVE_TIMEOUT_MS = 15000;

export interface FvLorePage {
  title: string;
  pageId: number;
  ns: number;
  url: string;
}

export interface EqArchiveResult {
  id: string;
  title: string;
  url: string;
  alternateUrl?: string;
  score: number;
  snippet: string;
  summary?: string;
  captureDate?: string;
  guessedDate?: string;
  domainName?: string;
  mailingListName?: string;
  contentFlavour?: string;
  tags?: string[];
}

type FvCategoryMembersResponse = {
  continue?: { cmcontinue?: string };
  query?: {
    categorymembers?: Array<{ title: string; pageid: number; ns: number }>;
  };
};

type FvParseResponse = {
  parse?: {
    title: string;
    pageid: number;
    revid?: number;
    text?: string;
    links?: Array<{ title: string; exists?: boolean }>;
    categories?: Array<{ category: string; hidden?: boolean }>;
  };
  error?: { info: string };
};

type EqArchiveHit = {
  _id: string;
  _score?: number;
  _source?: {
    title?: string;
    url?: string;
    alternate_url?: string;
    llm_summary?: string;
    text_full?: string;
    llm_image_text?: string;
    capture_date?: string;
    llm_guessed_date?: string;
    domain_name?: string;
    mailing_list_name?: string;
    llm_content_flavour?: string | null;
    llm_tags?: string[] | string | null;
  };
  highlight?: Record<string, string[]>;
};

type EqArchiveSearchApiResponse = {
  hits?: {
    total?: { value?: number; relation?: 'eq' | 'gte' };
    hits?: EqArchiveHit[];
  };
};

function cleanText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function truncate(text: string, maxCharacters: number): string {
  return text.length <= maxCharacters ? text : `${text.slice(0, Math.max(0, maxCharacters - 1)).trimEnd()}...`;
}

function scoreText(text: string, query: string): number {
  const lower = text.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 1)
    .reduce((score, term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return score + (lower.match(new RegExp(escaped, 'g'))?.length ?? 0);
    }, 0);
}

function fvLorePageUrl(title: string): string {
  return `${FVPROJECT_BASE_URL}/index.php/${encodeURIComponent(title.replace(/\s+/g, '_')).replace(/%2F/g, '/')}`;
}

async function fvApi<T>(params: Record<string, string | number | boolean>): Promise<T> {
  const url = new URL(FVPROJECT_API_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');
  const response = await fetchNodeHttps(url.href, 3);
  return JSON.parse(response) as T;
}

function sourceFromLoreHtml(html: string, maxCharacters: number): string {
  const content = html.match(/<!-- CONTENT SECTION STARTS HERE -->([\s\S]*?)<!-- CONTENT SECTION ENDS HERE -->/i)?.[1] ?? html;
  const text = cleanText(stripHtml(content).replace(/FILE ARCHIVED ON[\s\S]*$/i, ''));
  return truncate(text, maxCharacters);
}

async function fetchNodeHttps(url: string, redirectsRemaining: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = httpsGet(
      url,
      {
        rejectUnauthorized: false,
        headers: {
          accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
          'user-agent': 'everquest-mcp/1.0'
        }
      },
      response => {
        const location = response.headers.location;
        if (location && response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
          response.resume();
          if (redirectsRemaining <= 0) {
            reject(new Error(`FVProject redirect limit exceeded for ${url}`));
            return;
          }
          fetchNodeHttps(new URL(location, url).href, redirectsRemaining - 1).then(resolve, reject);
          return;
        }

        if (!response.statusCode || response.statusCode >= 400) {
          response.resume();
          reject(new Error(`GET ${url} failed with HTTP ${response.statusCode ?? 'unknown'}`));
          return;
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      }
    );
    request.setTimeout(15000, () => {
      request.destroy(new Error(`GET ${url} timed out`));
    });
    request.on('error', reject);
  });
}

export async function getOfficialEverQuestHistory(maxCharacters = 12000): Promise<string> {
  const html = await fetchPage(OFFICIAL_HISTORY_URL);
  const text = sourceFromLoreHtml(html, maxCharacters);
  return [
    '# Official 1999 EverQuest History of Norrath',
    '',
    `Source: ${OFFICIAL_HISTORY_URL}`,
    '',
    text
  ].join('\n');
}

export async function getFvProjectLorePages(limit = 50): Promise<FvLorePage[]> {
  const target = Math.max(1, Math.min(limit, 500));
  const pages: FvLorePage[] = [];
  let cmcontinue: string | undefined;

  while (pages.length < target) {
    const response = await fvApi<FvCategoryMembersResponse>({
      action: 'query',
      list: 'categorymembers',
      cmtitle: FV_LORE_CATEGORY,
      cmlimit: Math.min(500, target - pages.length),
      ...(cmcontinue ? { cmcontinue } : {})
    });

    pages.push(
      ...(response.query?.categorymembers ?? []).map(page => ({
        title: page.title,
        pageId: page.pageid,
        ns: page.ns,
        url: fvLorePageUrl(page.title)
      }))
    );

    cmcontinue = response.continue?.cmcontinue;
    if (!cmcontinue) break;
  }

  return pages;
}

export async function searchFvProjectLore(query: string, limit = 10): Promise<SearchResult[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const terms = normalized.split(/\s+/).filter(Boolean);
  const pages = await getFvProjectLorePages(500);
  return pages
    .map(page => {
      const title = page.title.toLowerCase();
      const score = terms.reduce((total, term) => total + (title.includes(term) ? 1 : 0), 0);
      return { page, score };
    })
    .filter(entry => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.page.title.localeCompare(right.page.title))
    .slice(0, Math.max(1, Math.min(limit, 50)))
    .map(({ page }) => ({
      name: page.title,
      type: 'lore',
      id: page.title,
      url: page.url,
      source: 'The Firiona Vie Project',
      description: 'FVProject Category:Lore page'
    }));
}

export async function getFvProjectLore(title: string, maxCharacters = 12000): Promise<string> {
  const response = await fvApi<FvParseResponse>({
    action: 'parse',
    page: title,
    redirects: true,
    prop: 'text|links|categories|revid'
  });

  if (response.error || !response.parse) {
    return `FVProject lore page not found: ${title}`;
  }

  const parsed = response.parse;
  const text = truncate(cleanText(stripHtml(parsed.text ?? '')), maxCharacters);
  const categories = (parsed.categories ?? [])
    .filter(category => !category.hidden)
    .map(category => category.category);
  const links = (parsed.links ?? [])
    .filter(link => link.exists !== false)
    .map(link => link.title)
    .slice(0, 30);

  const lines = [
    `# ${parsed.title}`,
    '',
    `**Source:** The Firiona Vie Project`,
    `**URL:** ${fvLorePageUrl(parsed.title)}`,
    `**Page ID:** ${parsed.pageid}${parsed.revid ? `, revision ${parsed.revid}` : ''}`,
    ''
  ];

  if (categories.length > 0) lines.push(`**Categories:** ${categories.join(', ')}`, '');
  lines.push(text);
  if (links.length > 0) lines.push('', '## Links', ...links.map(link => `- ${link}`));
  return lines.join('\n');
}

async function postEqArchives(body: Record<string, unknown>): Promise<EqArchiveSearchApiResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ARCHIVE_TIMEOUT_MS);
  try {
    const response = await fetch(`${EQ_ARCHIVES_ELASTIC_URL}/_search`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        authorization: EQ_ARCHIVES_AUTHORIZATION,
        'content-type': 'application/json',
        'user-agent': 'everquest-mcp/1.0'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`EQArchives search failed with HTTP ${response.status}`);
    }

    return (await response.json()) as EqArchiveSearchApiResponse;
  } finally {
    clearTimeout(timeout);
  }
}

function asTags(value: string[] | string | null | undefined): string[] | undefined {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map(tag => tag.trim()).filter(Boolean);
  return undefined;
}

function archiveSnippet(hit: EqArchiveHit): string {
  const highlighted = Object.values(hit.highlight ?? {}).flat()[0];
  const source = hit._source ?? {};
  const text = highlighted ?? (source.llm_summary && !source.llm_summary.startsWith('[ Still awaiting') ? source.llm_summary : source.text_full) ?? '';
  return truncate(cleanText(stripHtml(text.replace(/<\/?em>/g, ''))), 700);
}

function hitToArchiveResult(hit: EqArchiveHit): EqArchiveResult {
  const source = hit._source ?? {};
  return {
    id: hit._id,
    title: source.title || hit._id,
    url: source.url || source.alternate_url || `${EQ_ARCHIVES_SEARCH_URL}?q=${encodeURIComponent(hit._id)}`,
    ...(source.alternate_url && source.alternate_url !== source.url ? { alternateUrl: source.alternate_url } : {}),
    score: hit._score ?? 0,
    snippet: archiveSnippet(hit),
    ...(source.llm_summary && !source.llm_summary.startsWith('[ Still awaiting') ? { summary: source.llm_summary } : {}),
    ...(source.capture_date ? { captureDate: source.capture_date } : {}),
    ...(source.llm_guessed_date ? { guessedDate: source.llm_guessed_date } : {}),
    ...(source.domain_name ? { domainName: source.domain_name } : {}),
    ...(source.mailing_list_name ? { mailingListName: source.mailing_list_name } : {}),
    ...(source.llm_content_flavour ? { contentFlavour: source.llm_content_flavour } : {}),
    ...(asTags(source.llm_tags) ? { tags: asTags(source.llm_tags) } : {})
  };
}

export async function searchEqArchivesDetailed(query: string, limit = 10): Promise<{ total: number; relation: 'eq' | 'gte'; results: EqArchiveResult[] }> {
  const normalized = query.trim();
  if (!normalized) return { total: 0, relation: 'eq', results: [] };
  const response = await postEqArchives({
    size: Math.max(1, Math.min(limit, 25)),
    query: {
      multi_match: {
        query: normalized,
        fields: ['title^3', 'llm_summary^2', 'text_full', 'llm_image_text']
      }
    },
    highlight: {
      fields: {
        title: { fragment_size: 160, number_of_fragments: 1 },
        llm_summary: { fragment_size: 220, number_of_fragments: 1 },
        text_full: { fragment_size: 320, number_of_fragments: 1 },
        llm_image_text: { fragment_size: 220, number_of_fragments: 1 }
      }
    },
    _source: {
      includes: [
        'title',
        'url',
        'alternate_url',
        'llm_summary',
        'capture_date',
        'llm_guessed_date',
        'domain_name',
        'mailing_list_name',
        'llm_content_flavour',
        'llm_tags'
      ]
    }
  });

  return {
    total: response.hits?.total?.value ?? 0,
    relation: response.hits?.total?.relation ?? 'eq',
    results: (response.hits?.hits ?? []).map(hitToArchiveResult)
  };
}

export async function searchEqArchives(query: string, limit = 10): Promise<SearchResult[]> {
  const search = await searchEqArchivesDetailed(query, limit);
  return search.results.map(result => ({
    name: result.title,
    type: 'archive',
    id: result.id,
    url: result.url,
    source: 'EQArchives',
    description: result.snippet
  }));
}

export async function getEqArchiveDocument(id: string, maxCharacters = 12000): Promise<string> {
  const normalizedId = id.trim();
  if (!normalizedId) return 'Error: id parameter must be a non-empty string';

  const response = await postEqArchives({
    size: 1,
    query: { ids: { values: [normalizedId] } },
    _source: {
      includes: [
        'title',
        'url',
        'alternate_url',
        'llm_summary',
        'text_full',
        'llm_image_text',
        'capture_date',
        'llm_guessed_date',
        'domain_name',
        'mailing_list_name',
        'llm_content_flavour',
        'llm_tags'
      ]
    }
  });

  const hit = response.hits?.hits?.[0];
  if (!hit) return `EQArchives document not found: ${normalizedId}`;

  const result = hitToArchiveResult(hit);
  const source = hit._source ?? {};
  const text = truncate(cleanText(source.text_full ?? source.llm_image_text ?? source.llm_summary ?? ''), maxCharacters);
  const lines = [
    `# ${result.title}`,
    '',
    '**Source:** EQArchives',
    `**Document ID:** ${result.id}`,
    `**URL:** ${result.url}`,
    ...(result.captureDate ? [`**Capture Date:** ${result.captureDate}`] : []),
    ...(result.domainName ? [`**Domain:** ${result.domainName}`] : []),
    '',
    text
  ];
  return lines.join('\n');
}

export function formatEqArchiveSearch(query: string, total: number, relation: 'eq' | 'gte', results: EqArchiveResult[]): string {
  const lines = [
    `## EQArchives Search Results for "${query}"`,
    '',
    `Total matches: ${relation === 'gte' ? 'at least ' : ''}${total}`,
    `Search portal: ${EQ_ARCHIVES_SEARCH_URL}`,
    `Corpus provenance: ${EQ_ARCHIVES_REPOSITORY_URL}`,
    ''
  ];

  if (results.length === 0) {
    lines.push('No results found.');
    return lines.join('\n');
  }

  for (const result of results) {
    lines.push(`### ${result.title}`);
    lines.push(`- ID: ${result.id}`);
    lines.push(`- URL: ${result.url}`);
    if (result.captureDate) lines.push(`- Capture Date: ${result.captureDate}`);
    if (result.domainName) lines.push(`- Domain: ${result.domainName}`);
    if (result.mailingListName) lines.push(`- Mailing List: ${result.mailingListName}`);
    if (result.snippet) lines.push(`- Snippet: ${result.snippet}`);
    lines.push('');
  }

  lines.push('Use `get_eqarchive_document` with a result ID to fetch bounded document text.');
  return lines.join('\n');
}

export class OfficialEverQuestHistorySource extends EQDataSource {
  name = 'Official Sony EQ History (Wayback)';
  baseUrl = OFFICIAL_HISTORY_URL;

  async search(query: string): Promise<SearchResult[]> {
    const history = await getOfficialEverQuestHistory(40000);
    if (scoreText(history, query) <= 0) return [];
    return [{
      name: 'From the Dawn of Time to the Present Day: The History of Norrath',
      type: 'lore',
      id: 'official-history-of-norrath-1999',
      url: OFFICIAL_HISTORY_URL,
      source: this.name,
      description: 'Original official Sony EverQuest history/lore page archived by the Wayback Machine.'
    }];
  }
}

export class FVProjectLoreSource extends EQDataSource {
  name = 'The Firiona Vie Project Lore';
  baseUrl = `${FVPROJECT_BASE_URL}/index.php/Category:Lore`;

  async search(query: string): Promise<SearchResult[]> {
    return searchFvProjectLore(query, 10);
  }
}

export class EQArchivesSource extends EQDataSource {
  name = 'EQArchives';
  baseUrl = EQ_ARCHIVES_SEARCH_URL;

  async search(query: string): Promise<SearchResult[]> {
    return searchEqArchives(query, 10);
  }
}

export const officialEverQuestHistory = new OfficialEverQuestHistorySource();
export const fvprojectLore = new FVProjectLoreSource();
export const eqarchives = new EQArchivesSource();
