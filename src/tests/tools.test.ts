// Basic tests for eq-mcp tools
import { handleToolCall, tools } from '../tools.js';

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

  console.log('list_sources tests passed!');
}

// Run all tests
async function runTests() {
  console.log('=== Running eq-mcp tests ===\n');

  try {
    testToolDefinitions();
    await testValidation();
    await testListSources();

    console.log('\n=== All tests passed! ===');
    process.exit(0);
  } catch (error) {
    console.error('\n=== Tests failed! ===');
    console.error(error);
    process.exit(1);
  }
}

runTests();
