(() => {
  const messages = {
    'Luna · Không gian dịu mắt': 'Luna · A softer web',
    'Không gian web dịu mắt': 'A softer shade of the web',
    'MỘT CHÚT TỐI. NHIỀU DỄ CHỊU.': 'LESS LIGHT. MORE COMFORT.',
    'Chế độ tối': 'Dark mode',
    'Đang bảo vệ đôi mắt của bạn': 'A softer view for your eyes',
    'Nghỉ một chút, trở về màu gốc': 'Taking a break, original colors restored',
    'Bật tắt chế độ tối toàn bộ': 'Toggle dark mode everywhere',
    'Sẵn sàng cho mọi website': 'Ready for your websites',
    'Tự động áp dụng khi duyệt web': 'Applied automatically as you browse',
    'Đã tạm dừng trên tất cả website': 'Paused on all websites',
    'Cài đặt': 'Settings',
    'Điều chỉnh': 'Appearance',
    'Đang đọc website…': 'Reading website…',
    'Áp dụng cho website hiện tại': 'Applies to the current website',
    'Bật tắt website hiện tại': 'Toggle dark mode for this website',
    'Trang không được hỗ trợ': 'Unsupported page',
    'Hãy mở một website http hoặc https': 'Open an HTTP or HTTPS website',
    'Đã tắt · Có trong blacklist': 'Disabled · In blacklist',
    'Được phép · Chế độ tối đang tạm dừng': 'Allowed · Dark mode is paused',
    'Chế độ tối được bật cho website này': 'Dark mode enabled for this website',
    'Không gian của bạn': 'Make it yours',
    'Phạm vi điều chỉnh': 'Adjustment scope',
    'Tất cả website': 'All websites',
    'Riêng website này': 'This website only',
    'Dịu mắt': 'Soft dark',
    'Đêm sâu': 'Midnight',
    'Ấm áp': 'Warm',
    'Độ tối': 'Darkness',
    'Sáng hơn': 'Lighter',
    'Tối hơn': 'Darker',
    'Tương phản': 'Contrast',
    'Sắc ấm': 'Warmth',
    '↺ \u00a0 Khôi phục màu mặc định': '↺ \u00a0 Reset default colors',
    'Giữ giao diện gốc': 'Keep the original look',
    'Luna sẽ bỏ qua các tên miền này, bao gồm cả tên miền phụ.': 'Luna skips these domains, including their subdomains.',
    'Website muốn loại trừ': 'Website to exclude',
    'Ví dụ: youtube.com': 'Example: youtube.com',
    'Thêm vào blacklist': 'Add to blacklist',
    'Chưa có ngoại lệ': 'No exclusions yet',
    'Những website bạn tắt sẽ xuất hiện ở đây.': 'Websites you turn off will appear here.',
    'Lưu trên thiết bị của bạn': 'Saved on your device',
    'Xóa': 'Remove',
    'Không thể lưu. Hãy thử mở lại Luna.': 'Unable to save. Please reopen Luna.',
    'Website đã dùng màu chung.': 'This website now uses the shared colors.',
    'Đã khôi phục màu mặc định.': 'Default colors restored.',
    'Website này đã có trong blacklist.': 'This website is already in the blacklist.',
    'Đã thêm website vào blacklist.': 'Website added to the blacklist.',
    'Nhập tên miền hợp lệ, ví dụ: youtube.com': 'Enter a valid domain, for example: youtube.com',
    'Luna chưa thể kết nối với trang này. Kiểm tra quyền truy cập website của tiện ích trong Edge.': 'Luna could not connect to this page. Check its website access permissions in Edge.',
    'Edge không cho phép extension đổi màu trang nội bộ, cửa hàng tiện ích hoặc trình xem PDF tích hợp.': 'Edge does not allow extensions to theme internal pages, extension stores or the built-in PDF viewer.',
    'Không thể đọc cài đặt. Hãy đóng và mở lại Luna.': 'Unable to read settings. Please close and reopen Luna.',
    'Ngôn ngữ': 'Language'
  };
  const reverse = Object.fromEntries(Object.entries(messages).map(([vi, en]) => [en, vi]));
  let language = 'vi';
  function translate(value) {
    const original = reverse[value] || value;
    if (language === 'vi') return original;
    return messages[original] || original;
  }
  function apply() {
    document.documentElement.lang = language;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement.closest('script, style, #language, #hostname, #blacklist-items, #toast, #form-error')) continue;
      const trimmed = node.textContent.trim();
      if (messages[trimmed] || reverse[trimmed]) node.textContent = node.textContent.replace(trimmed, translate(trimmed));
    }
    document.querySelectorAll('[aria-label], [placeholder]').forEach(element => {
      if (element.closest('#blacklist-items')) return;
      for (const attr of ['aria-label', 'placeholder']) if (element.hasAttribute(attr)) element.setAttribute(attr, translate(element.getAttribute(attr)));
    });
    document.title = translate('Luna · Không gian dịu mắt');
    document.getElementById('language').value = language;
  }
  globalThis.LunaI18n = {
    t: translate, apply,
    set(value) {language = value === 'en' ? 'en' : 'vi';},
    get language() {return language;},
    removeLabel(domain) {return language === 'en' ? `Remove ${domain} from blacklist` : `Xóa ${domain} khỏi blacklist`;},
    removed(domains) {return (language === 'en' ? 'Exclusion removed: ' : 'Đã bỏ ngoại lệ: ') + domains;}
  };
})();
