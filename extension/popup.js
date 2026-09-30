const $ = id => document.getElementById(id);
const t = LunaI18n.t;
const languagePicker = document.createElement('select');
languagePicker.id = 'language';
languagePicker.setAttribute('aria-label', 'Ngôn ngữ');
for (const [value, label] of [['vi', 'Tiếng Việt'], ['en', 'English']]) {
  const option = document.createElement('option'); option.value = value; option.textContent = label; languagePicker.append(option);
}
document.querySelector('header').insertBefore(languagePicker, document.querySelector('.version'));
let languageWrites = Promise.resolve();
languagePicker.onchange = () => {
  const language = languagePicker.value;
  LunaI18n.set(language);
  $('form-error').textContent = '';
  $('toast').classList.remove('show');
  render();
  languageWrites = languageWrites.catch(() => {}).then(() => chrome.storage.local.set({language})).catch(() => toast('Không thể lưu. Hãy thử mở lại Luna.'));
};
let config = Luna.settings(), domain = '', tab, scope = 'global', toastTimer;
let writes = Promise.resolve();
function toast(message) { $('toast').textContent = t(message); $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2300); }
function save() { const snapshot = structuredClone(config); writes = writes.catch(() => {}).then(() => chrome.storage.local.set({config: snapshot})).catch(() => toast('Không thể lưu. Hãy thử mở lại Luna.')); render(); }
function editing() { return scope === 'site' ? {...config, ...config.sites[domain]} : config; }
function change(values) { if (scope === 'site') config.sites[domain] = {...config.sites[domain], ...values}; else Object.assign(config, values); save(); }
function render() {
  const blocked = Luna.blocked(domain, config.blacklist);
  $('global-toggle').setAttribute('aria-checked', config.enabled);
  $('global-label').textContent = config.enabled ? 'Đang bảo vệ đôi mắt của bạn' : 'Nghỉ một chút, trở về màu gốc';
  $('status').textContent = config.enabled ? 'Tự động áp dụng khi duyệt web' : 'Đã tạm dừng trên tất cả website';
  $('status-dot').style.background = config.enabled ? '#a9d8b1' : '#8e829b';
  $('hostname').textContent = domain || 'Trang không được hỗ trợ';
  $('site-toggle').disabled = !domain;
  $('site-toggle').setAttribute('aria-checked', !blocked && !!domain);
  $('site-status').textContent = !domain ? 'Hãy mở một website http hoặc https' : blocked ? 'Đã tắt · Có trong blacklist' : !config.enabled ? 'Được phép · Chế độ tối đang tạm dừng' : 'Chế độ tối được bật cho website này';
  $('scope').options[1].disabled = !domain;
  const value = editing();
  for (const key of ['darkness', 'contrast', 'warmth']) {
    $(key).value = value[key]; $(key + '-value').textContent = value[key] + '%';
    $(key).style.setProperty('--fill', (value[key] - Number($(key).min)) / (Number($(key).max) - Number($(key).min)) * 100 + '%');
  }
  document.querySelectorAll('[data-palette]').forEach(el => {const selected = el.dataset.palette === value.palette; el.classList.toggle('selected', selected); el.setAttribute('aria-pressed', selected);});
  $('count').textContent = config.blacklist.length;
  $('empty').hidden = config.blacklist.length > 0;
  $('blacklist-items').replaceChildren();
  for (const item of config.blacklist) {
    const row = document.createElement('div'); row.className = 'blacklist-item';
    const label = document.createElement('span'); label.textContent = item;
    const remove = document.createElement('button'); remove.textContent = t('Xóa'); remove.setAttribute('aria-label', LunaI18n.removeLabel(item));
    remove.onclick = () => {config.blacklist = config.blacklist.filter(x => x !== item); save();};
    row.append(label, remove); $('blacklist-items').append(row);
  }
  LunaI18n.apply();
}
document.querySelectorAll('.tab').forEach(button => button.onclick = () => {
  document.querySelectorAll('.tab').forEach(el => {el.classList.toggle('active', el === button); el.setAttribute('aria-selected', el === button);});
  $('appearance').hidden = button.dataset.panel !== 'appearance'; $('exceptions').hidden = button.dataset.panel !== 'exceptions';
});
$('global-toggle').onclick = () => {config.enabled = !config.enabled; save();};
$('site-toggle').onclick = () => {
  if (!domain) return;
  const parents = config.blacklist.filter(x => domain === x || domain.endsWith('.' + x));
  if (parents.length) {config.blacklist = config.blacklist.filter(x => !parents.includes(x)); toast(LunaI18n.removed(parents.join(', ')));}
  else config.blacklist.push(domain);
  save();
};
$('scope').onchange = () => {scope = $('scope').value; render();};
for (const key of ['darkness', 'contrast', 'warmth']) $(key).oninput = () => change({[key]: Number($(key).value)});
document.querySelectorAll('[data-palette]').forEach(button => button.onclick = () => change({palette: button.dataset.palette}));
$('reset').onclick = () => {
  if (scope === 'site') {delete config.sites[domain]; save(); toast('Website đã dùng màu chung.');}
  else {change({darkness: 40, contrast: 100, warmth: 0, palette: 'slate'}); toast('Đã khôi phục màu mặc định.');}
};
$('blacklist-form').onsubmit = event => {
  event.preventDefault(); $('form-error').textContent = '';
  try {
    const item = Luna.host($('domain').value.trim());
    if (config.blacklist.includes(item)) throw Error('Website này đã có trong blacklist.');
    config.blacklist.push(item); config.blacklist.sort(); $('domain').value = ''; save(); toast('Đã thêm website vào blacklist.');
  } catch (error) {$('form-error').textContent = t(error instanceof TypeError ? 'Nhập tên miền hợp lệ, ví dụ: youtube.com' : error.message);}
};
async function init() {
  document.querySelector('.version').textContent = 'V ' + chrome.runtime.getManifest().version;
  const stored = await chrome.storage.local.get(['config', 'language']); config = Luna.settings(stored.config);
  LunaI18n.set(stored.language); LunaI18n.apply();
  [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  try {domain = Luna.host(tab.url); if (/^(chromewebstore.google.com|microsoftedge.microsoft.com)$/.test(domain)) domain = '';} catch {}
  if (domain) {
    if (config.sites[domain]) {scope = 'site'; $('scope').value = 'site';}
    try {
      const result = await chrome.runtime.sendMessage({type: 'ensure-tab', tabId: tab.id});
      if (!result || result.error) throw Error(result?.error);
    }
    catch {$('notice').hidden = false; $('notice').textContent = 'Luna chưa thể kết nối với trang này. Kiểm tra quyền truy cập website của tiện ích trong Edge.';}
  } else {$('notice').hidden = false; $('notice').textContent = 'Edge không cho phép extension đổi màu trang nội bộ, cửa hàng tiện ích hoặc trình xem PDF tích hợp.';}
  render();
}
init().catch(() => {$('notice').hidden = false; $('notice').textContent = t('Không thể đọc cài đặt. Hãy đóng và mở lại Luna.');});
