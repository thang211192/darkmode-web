(() => {
  let domain = location.hostname;
  let initialized = false;
  let timer;
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
  async function apply() {
    const {config} = await chrome.storage.local.get('config');
    const state = Luna.effective(Luna.settings(config), domain);
    if (state.enabled) DarkReader.enable(Luna.theme(state));
    else DarkReader.disable();
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.config && initialized) {
      clearTimeout(timer); timer = setTimeout(() => apply().catch(console.error), 60);
    }
  });
  chrome.runtime.onMessage.addListener((message, sender, reply) => {
    if (message.type === 'status') reply({enabled: DarkReader.isEnabled(), domain});
  });
  (async () => {
    const context = await lunaSendMessage({type: 'context'});
    try { domain = Luna.host(context.url); } catch {}
    initialized = true;
    await apply();
  })().catch(console.error);
})();
