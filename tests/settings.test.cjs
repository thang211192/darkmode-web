const {test} = require('node:test');
const assert = require('node:assert/strict');
const Luna = require('../extension/shared.js');
test('normalize hosts and reject unsupported input', () => {
  assert.equal(Luna.host('https://EXAMPLE.com/a?q=1'), 'example.com');
  assert.equal(Luna.host('example.com'), 'example.com');
  assert.throws(() => Luna.host('edge://settings'));
  assert.throws(() => Luna.host('bad host'));
});
test('blacklist respects domain boundaries and child domains', () => {
  assert.equal(Luna.blocked('news.example.com', ['example.com']), true);
  assert.equal(Luna.blocked('notexample.com', ['example.com']), false);
});
test('global off and blacklist override site colors', () => {
  const state = Luna.settings({enabled: false, sites: {'example.com': {darkness: 80}}});
  assert.equal(Luna.effective(state, 'example.com').enabled, false);
  assert.equal(Luna.effective(state, 'example.com').darkness, 80);
  state.enabled = true; state.blacklist = ['example.com'];
  assert.equal(Luna.effective(state, 'sub.example.com').enabled, false);
});
test('darkness changes theme brightness monotonically', () => {
  assert.ok(Luna.theme({...Luna.defaults, darkness: 100}).brightness < Luna.theme({...Luna.defaults, darkness: 0}).brightness);
});
