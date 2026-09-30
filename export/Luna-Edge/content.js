(() => {
  if (globalThis.__lunaConnected) return;
  document.dispatchEvent(new Event('__luna_dispose'));
  globalThis.__lunaConnected = true;
  let domain = location.hostname;
  let initialized = false;
  let timer;
  let latest;
  let disposed = false;
  async function resourceFetch(url) {
    const absolute = new URL(url, location.href);
    if (absolute.protocol === 'data:' || absolute.protocol === 'blob:') return fetch(absolute.href);
    const result = await lunaSendMessage({type: 'fetch', url: absolute.href});
    if (!result || result.error) throw Error(result?.error || 'Resource unavailable');
    return new Response(Uint8Array.from(atob(result.data), c => c.charCodeAt(0)), {headers: {'Content-Type': result.type}});
  }
  DarkReader.setFetchMethod(resourceFetch);
  // Use the supported plugin hook to avoid the API bundle's runtime message shim.
  DarkReader.Plugins = {fetch: async request => {
    const response = await resourceFetch(request.url);
    if (request.responseType !== 'data-url') return response.text();
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject;
      response.blob().then(blob => reader.readAsDataURL(blob), reject);
    });
  }};
  function apply() {
    if (disposed) return;
    const state = Luna.effective(Luna.settings(latest), domain);
    // A non-null fixes object enables Dark Reader's palette refresh on subsequent
    // color changes; without it cached CSS variables can retain the old colors.
    if (state.enabled) DarkReader.enable({...Luna.theme(state), immediateModify: true}, {});
    else DarkReader.disable();
  }
  function onStorage(changes, area) {
    if (area === 'local' && changes.config) {
      latest = changes.config.newValue;
      // Throttle, rather than debounce: update while the slider is still moving.
      if (initialized && !timer) timer = setTimeout(() => {timer = null; apply();}, 16);
    }
  }
  chrome.storage.onChanged.addListener(onStorage);
  function onMessage(message, sender, reply) {
    if (message.type === 'status') reply({enabled: DarkReader.isEnabled(), domain});
  }
  chrome.runtime.onMessage.addListener(onMessage);
  document.addEventListener('__luna_dispose', () => {
    disposed = true; clearTimeout(timer); DarkReader.disable();
    try {chrome.storage.onChanged.removeListener(onStorage); chrome.runtime.onMessage.removeListener(onMessage);} catch {}
  }, {once: true});
  (async () => {
    const context = await lunaSendMessage({type: 'context'});
    try { domain = Luna.host(context.url); } catch {}
    const {config} = await chrome.storage.local.get('config');
    if (latest === undefined) latest = config;
    initialized = true;
    apply();
  })().catch(console.error);
})();
