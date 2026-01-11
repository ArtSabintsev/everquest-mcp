// Basic tests for everquest-mcp tools
import { handleToolCall, tools } from '../tools.js';
import { normalizeQuery, levenshtein, fuzzyMatch, getCacheStats, clearCache } from '../sources/base.js';

// Test validation functions
async function testValidation() {
  console.log('Testing input validation...');

  // Test missing query
  const result1 = await handleToolCall('search_all', {});
  console.assert(
    result1.includes('Error: query parameter must be a non-empty string'),
    'Should reject missing query'
  );

  // Test empty query
  const result2 = await handleToolCall('search_eq', { query: '' });
  console.assert(
    result2.includes('Error: query parameter must be a non-empty string'),
    'Should reject empty query'
  );

  // Test empty query with spaces
  const result3 = await handleToolCall('search_spells', { query: '   ' });
  console.assert(
    result3.includes('Error: query parameter must be a non-empty string'),
    'Should reject whitespace-only query'
  );

  // Test missing id
  const result4 = await handleToolCall('get_spell', {});
  console.assert(
    result4.includes('Error: id parameter must be a non-empty string'),
    'Should reject missing id'
  );

  // Test unknown tool
  const result5 = await handleToolCall('unknown_tool', {});
  console.assert(result5.includes('Unknown tool'), 'Should reject unknown tool');

  console.log('Validation tests passed!');
}

// Test tool definitions
function testToolDefinitions() {
  console.log('Testing tool definitions...');

  // Check all tools have required fields
  for (const tool of tools) {
    console.assert(typeof tool.name === 'string', `Tool ${tool.name} should have name`);
    console.assert(typeof tool.description === 'string', `Tool ${tool.name} should have description`);
    console.assert(typeof tool.inputSchema === 'object', `Tool ${tool.name} should have inputSchema`);
    console.assert(tool.inputSchema.type === 'object', `Tool ${tool.name} schema should be object type`);
  }

  // Check expected tools exist
  const expectedTools = [
    'search_all',
    'search_quests',
    'search_tradeskills',
    'search_eq',
    'get_spell',
    'get_item',
    'get_npc',
    'get_zone',
    'search_spells',
    'search_items',
    'search_npcs',
    'search_zones',
    'search_almars',
    'search_eqresource',
    'search_fanra',
    'search_eqtraders',
    'search_lucy',
    'search_raidloot',
    'search_ui',
    'list_sources',
  ];

  for (const toolName of expectedTools) {
    console.assert(
      tools.some((t) => t.name === toolName),
      `Tool ${toolName} should exist`
    );
  }

  console.log(`Tool definitions tests passed! (${tools.length} tools)`);
}

// Test list_sources tool
async function testListSources() {
  console.log('Testing list_sources...');

  const result = await handleToolCall('list_sources', {});

  console.assert(result.includes('Allakhazam'), 'Should list Allakhazam');
  console.assert(result.includes("Almar's Guides"), "Should list Almar's Guides");
  console.assert(result.includes('EQResource'), 'Should list EQResource');
  console.assert(result.includes("Fanra's Wiki"), "Should list Fanra's Wiki");
  console.assert(result.includes('EQ Traders'), 'Should list EQ Traders');
  console.assert(result.includes("Zliz's Compendium"), "Should list Zliz's Compendium");
  console.assert(result.includes('Lucy'), 'Should list Lucy');
  console.assert(result.includes('RaidLoot'), 'Should list RaidLoot');
  console.assert(result.includes('EQInterface'), 'Should list EQInterface');
  console.assert(result.includes('Cache'), 'Should show cache stats');

  console.log('list_sources tests passed!');
}

// Test fuzzy matching functions
function testFuzzyMatching() {
  console.log('Testing fuzzy matching...');

  // Test normalizeQuery
  console.assert(
    normalizeQuery('PoK') === 'plane of knowledge',
    'Should expand PoK abbreviation'
  );
  console.assert(
    normalizeQuery('sol a') === "solusek's eye",
    'Should expand sol a abbreviation'
  );
  console.assert(
    normalizeQuery('  TEST  ') === 'test',
    'Should trim and lowercase'
  );

  // Test levenshtein distance
  console.assert(levenshtein('', '') === 0, 'Empty strings should have distance 0');
  console.assert(levenshtein('abc', 'abc') === 0, 'Same strings should have distance 0');
  console.assert(levenshtein('abc', 'abd') === 1, 'One char diff should be 1');
  console.assert(levenshtein('kitten', 'sitting') === 3, 'kitten->sitting should be 3');

  // Test fuzzyMatch
  console.assert(fuzzyMatch('test', 'test'), 'Exact match should pass');
  console.assert(fuzzyMatch('test', 'testing'), 'Substring should pass');
  console.assert(fuzzyMatch('tset', 'test', 0.5), 'Typo with loose threshold should pass');
  console.assert(!fuzzyMatch('xyz', 'abc'), 'Unrelated strings should fail');

  console.log('Fuzzy matching tests passed!');
}

// Test cache functions
function testCacheFunctions() {
  console.log('Testing cache functions...');

  const stats = getCacheStats();
  console.assert(typeof stats.size === 'number', 'Cache size should be a number');
  console.assert(typeof stats.maxSize === 'number', 'Cache maxSize should be a number');
  console.assert(stats.maxSize === 500, 'Cache maxSize should be 500');

  // Clear cache and verify
  clearCache();
  const afterClear = getCacheStats();
  console.assert(afterClear.size === 0, 'Cache should be empty after clear');

  console.log('Cache function tests passed!');
}

// Run all tests
async function runTests() {
  console.log('=== Running everquest-mcp tests ===\n');

  try {
    testToolDefinitions();
    await testValidation();
    await testListSources();
    testFuzzyMatching();
    testCacheFunctions();

    console.log('\n=== All tests passed! ===');
    process.exit(0);
  } catch (error) {
    console.error('\n=== Tests failed! ===');
    console.error(error);
    process.exit(1);
  }
}

runTests();
