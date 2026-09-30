(function (root) {
  const defaults = {enabled: true, darkness: 40, contrast: 100, warmth: 0, palette: 'slate', sites: {}, blacklist: []};
  function host(value) {
    if (/\s/.test(value)) throw Error('Nhập tên miền hợp lệ, ví dụ: youtube.com');
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || /[\s*%]/.test(url.hostname)) throw Error('Nhập tên miền hợp lệ, ví dụ: youtube.com');
    return url.hostname.toLowerCase().replace(/\.$/, '');
  }
  function blocked(domain, list) { return list.some(item => domain === item || domain.endsWith(`.${item}`)); }
  function settings(raw = {}) { return {...defaults, ...raw, sites: raw.sites || {}, blacklist: raw.blacklist || []}; }
  function effective(config, domain) { return {...config, ...config.sites[domain], enabled: config.enabled && !blocked(domain, config.blacklist)}; }
  function theme(config) {
    const colors = {slate: ['#181b20', '#dedee5'], midnight: ['#080a0e', '#d7dce6'], warm: ['#221d19', '#e3dbcf']};
    const [background, foreground] = colors[config.palette] || colors.slate;
    return {mode: 1, brightness: 110 - Math.round(config.darkness * 0.5), contrast: config.contrast, sepia: config.warmth, darkSchemeBackgroundColor: background, darkSchemeTextColor: foreground};
  }
  root.Luna = {defaults, host, blocked, settings, effective, theme};
  if (typeof module !== 'undefined') module.exports = root.Luna;
})(globalThis);
