# Hồ sơ Microsoft Edge Add-ons — Luna 1.0.2

Trạng thái: đã chuẩn bị tệp cục bộ, chưa upload hoặc gửi duyệt.

## Tệp upload
- Package: `export/Luna-Edge-Store-1.0.2.zip` (manifest.json nằm ở gốc).
- Logo: `store/logo-300.png` (300 × 300 PNG, nền trong suốt).
- Ảnh popup hiện tại: `export/Luna-preview.png`. Đây là bản xem trước, KHÔNG upload vào trường screenshot vì chưa đúng kích thước của Store. Screenshot là tùy chọn; có thể bỏ trống khi gửi lần đầu.

## Đường dẫn
- Dashboard: https://partner.microsoft.com/dashboard/microsoftedge/overview
- Website: https://github.com/thang211192/darkmode-web
- Support: https://github.com/thang211192/darkmode-web/issues
- Privacy policy: https://github.com/thang211192/darkmode-web/blob/main/PRIVACY.md

## Availability / Properties
- Visibility: Public.
- Markets: theo lựa chọn của chủ tài khoản; All markets nếu muốn phát hành toàn cầu.
- Category: chọn danh mục phù hợp về năng suất hoặc tùy chỉnh trình duyệt trong danh sách hiện có.
- Không có nội dung người lớn, tài khoản trả phí hoặc mua hàng trong tiện ích.
- Chủ tài khoản tự khai báo thông tin cá nhân/doanh nghiệp và đọc, chấp nhận thỏa thuận Microsoft.

## Single purpose
Luna lets users customize website colors into a dark reading theme, with live brightness, contrast and warmth controls and per-website exclusions.

## Permission justification

### storage
Stores the user's enabled state, color preferences, excluded domains and per-site overrides locally. No cloud synchronization or analytics is used.

### tabs
Identifies the current website for per-site controls and finds open HTTP/HTTPS tabs so Luna can apply the user's dark mode preferences to them.

### scripting
Injects bundled dark mode scripts into already-open permitted tabs and frames, so installation and settings can take effect without reloading the website.

### HTTP/HTTPS host permissions
Luna changes colors on the user's permitted websites and loads CSS/image resources referenced by those pages for local color analysis. Broad host access is required because users can enable dark mode on arbitrary HTTP/HTTPS websites. Restricted browser pages are not supported.

## Remote code
No. All executable code, including the MIT-licensed Dark Reader library and page proxy, is bundled in the extension. Referenced website CSS and images are fetched as resources for color processing, not as remote JavaScript or WebAssembly.

## Data usage
Answer the exact questions shown in Partner Center consistently with PRIVACY.md. Luna processes page content and URLs locally and stores user-selected domains and preferences locally. It does not transmit browsing history or page content to a developer-operated service. Resource servers may receive requests for CSS/images, including the user's IP address and resource URL. Do not claim that Luna never accesses website data or never makes network requests.

## Description — Tiếng Việt
Giao diện hỗ trợ Tiếng Việt và English; chuyển ngôn ngữ trực tiếp trong popup và tự động ghi nhớ lựa chọn trên thiết bị.
Luna giúp bạn chuyển các website sang giao diện tối và tùy chỉnh màu sắc theo sở thích ngay khi đang duyệt web.

Bạn có thể bật hoặc tắt chế độ tối cho toàn bộ trình duyệt hoặc riêng từng website. Danh sách ngoại lệ giúp giữ nguyên giao diện gốc trên những trang bạn chọn, bao gồm cả tên miền phụ. Ba bảng màu Dịu mắt, Đêm sâu và Ấm áp đi kèm các thanh chỉnh độ tối, tương phản và sắc ấm. Thay đổi được áp dụng trực tiếp mà không cần tải lại website.

Luna lưu tùy chọn trên thiết bị, hỗ trợ cấu hình màu riêng cho từng tên miền, không yêu cầu đăng nhập và không tích hợp quảng cáo hay công cụ phân tích người dùng. Bộ chuyển màu sử dụng thư viện Dark Reader nguồn mở theo giấy phép MIT. Luna là sản phẩm độc lập, không phải bản phát hành chính thức của Dark Reader.

Lưu ý: các trang nội bộ Edge, cửa hàng tiện ích và trình xem PDF tích hợp bị trình duyệt giới hạn. Một số nội dung canvas hoặc thiết kế đặc biệt có thể không chuyển màu hoàn hảo; bạn có thể thêm website đó vào danh sách ngoại lệ. Hãy tắt các tiện ích chuyển màu khác khi dùng Luna để tránh xung đột.

## Description — English
The interface supports English and Vietnamese. Switch languages directly in the popup; your selection is remembered locally on your device.
Luna brings a customizable dark theme to websites while you browse. Turn dark mode on or off globally or for an individual website, and keep selected domains in their original appearance using the exclusion list.

Choose from three palettes and adjust darkness, contrast and warmth. Changes apply live without reloading the page. Save separate color preferences for individual websites or use one shared configuration.

Preferences are stored locally on your device. Luna requires no account and includes no ads or analytics. It uses the open-source Dark Reader library under the MIT license. Luna is an independent project, not an official Dark Reader release.

Browser-internal pages, extension stores and the built-in PDF viewer cannot be themed. Some canvas content and unusual page designs may not convert perfectly; exclude those websites when needed. Disable other dark mode extensions to avoid conflicting color changes.

## Search terms
dark mode, night mode, website theme, dark theme, chế độ tối

## Notes for certification
No account, payment or credentials are required. Open a normal HTTP or HTTPS website and click the Luna toolbar icon. Use the large switch to toggle dark mode globally, or the switch next to the hostname to toggle that website. Adjust darkness, contrast or warmth and verify that the page changes without a reload. Select per-site scope to save a separate theme for the current domain. Add or remove a domain in the Blacklist tab to test exclusions. Domain exclusions include subdomains. Internal browser pages, extension store pages and the built-in PDF viewer are intentionally unsupported. Please disable other dark-mode extensions while testing. The Dark Reader MIT license is included under vendor/LICENSE-DarkReader.txt.
