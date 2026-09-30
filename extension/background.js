importScripts('shared.js');
chrome.runtime.onInstalled.addListener(async () => {
  const {config} = await chrome.storage.local.get('config');
  if (!config) await chrome.storage.local.set({config: Luna.settings()});
});
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (sender.id !== chrome.runtime.id) return;
  if (message.type === 'context') {
    reply({url: sender.tab?.url || sender.url});
    return;
  }
  if (message.type !== 'fetch') return;
  (async () => {
    const url = new URL(message.url);
    if (!['http:', 'https:'].includes(url.protocol)) throw Error('Unsupported protocol');
    const response = await fetch(url.href, {credentials: 'omit', signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    const type = response.headers.get('content-type') || 'text/plain';
    if (!/^(text\/css|text\/plain|application\/.*css|image\/)/i.test(type)) throw Error('Unsupported resource');
    const reader = response.body.getReader();
    let size = 0; const chunks = [];
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 8 * 1024 * 1024) { await reader.cancel(); throw Error('Resource too large'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    reply({data: btoa(binary), type});
  })().catch(error => reply({error: error.message}));
  return true;
});
