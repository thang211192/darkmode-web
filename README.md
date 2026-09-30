# Luna — Dark mode cho Microsoft Edge

## Cài đặt
1. Mở `edge://extensions` trong Microsoft Edge.
2. Bật **Developer mode / Chế độ nhà phát triển**.
3. Chọn **Load unpacked / Tải tiện ích đã giải nén**.
4. Trỏ tới thư mục `C:\Project\apps\darkmode-web\export\Luna-Edge` (thư mục chứa manifest.json).
5. Tắt Dark Reader hoặc extension làm tối khác để tránh hai bộ xử lý chồng lên nhau. Tải lại các tab đang mở, ghim Luna vào thanh công cụ.

Giữ thư mục cài đặt ở vị trí cố định. Không cần npm, tài khoản hoặc trả phí để dùng bản xuất.

## Sử dụng
- Công tắc lớn: bật/tắt toàn bộ.
- Công tắc cạnh tên miền: bật/tắt website hiện tại; website tắt được đưa vào blacklist.
- Blacklist: nhập tên miền hoặc URL và nhấn +; Xóa để áp dụng chế độ tối trở lại. Mỗi mục áp dụng cả các tên miền phụ. Bật một website đang bị chặn bởi tên miền cha sẽ gỡ mục tên miền cha (popup thông báo tên miền vừa gỡ).
- Chọn Tất cả website hoặc Riêng website này trước khi chỉnh màu. Cài đặt riêng được ưu tiên. Khôi phục khi chọn riêng website sẽ xóa màu riêng để dùng màu chung.
- Độ tối: tăng để giảm độ sáng; Tương phản: điều chỉnh độ khác biệt sáng/tối; Sắc ấm: tăng sắc vàng. Có ba bảng màu Dịu mắt, Đêm sâu, Ấm áp.
- Lưu tự động trên thiết bị, áp dụng ngay cho các tab và khung nhúng, giữ lại sau khi khởi động trình duyệt.

## Phạm vi và quyền riêng tư
Luna dùng bộ chuyển màu động Dark Reader, không đảo màu toàn trang; ảnh/video thường giữ màu tự nhiên. Không thể đảm bảo mọi thiết kế hoặc nội dung canvas/PDF đều chuyển màu hoàn hảo. Có thể dùng blacklist cho trang không tương thích.

Trang edge://, chrome://, cửa hàng extension, New Tab và trình xem PDF tích hợp bị trình duyệt hạn chế. Phiên bản này hỗ trợ website HTTP/HTTPS, không hỗ trợ file://. Cần tải lại tab mở trước khi cài.

Quyền đọc/thay đổi website phục vụ chuyển màu; quyền tabs dùng xác định tên miền của tab hiện tại; storage lưu tùy chọn. Không analytics, không máy chủ thu thập, không gửi lịch sử duyệt web. Khi cần, extension tải CSS/ảnh từ chính các URL tài nguyên được trang tham chiếu để phân tích màu; không gửi cookie trong các yêu cầu nền. Mã xử lý nằm trong gói cài, không tải mã từ CDN.

## Phát triển
Node.js: `npm ci`, `npm run build`, `npm test`. Bản cài ở `export/Luna-Edge`.

## Nguồn mở
Dùng thư viện Dark Reader theo giấy phép MIT: https://github.com/darkreader/darkreader . Giấy phép gốc nằm tại vendor/LICENSE-DarkReader.txt trong thư mục cài. Luna là giao diện và phần tích hợp độc lập, không phải bản phát hành chính thức của Dark Reader.
