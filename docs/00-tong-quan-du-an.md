# ClassPulse — Tổng quan dự án
### Tài liệu dành cho thành viên non-tech · Tiếng Việt

---

## Mục lục

1. [Ý tưởng & Vấn đề giải quyết](#1-ý-tưởng--vấn-đề-giải-quyết)
2. [ClassPulse là gì?](#2-classpulse-là-gì)
3. [Ai sử dụng? Dùng như thế nào?](#3-ai-sử-dụng-dùng-như-thế-nào)
4. [Luồng vận hành hằng ngày](#4-luồng-vận-hành-hằng-ngày)
5. [Hệ thống phát hiện bất thường](#5-hệ-thống-phát-hiện-bất-thường)
6. [Báo cáo cho phụ huynh](#6-báo-cáo-cho-phụ-huynh)
7. [Giao diện & Thiết kế](#7-giao-diện--thiết-kế)
8. [Bảo mật & Quyền riêng tư](#8-bảo-mật--quyền-riêng-tư)
9. [Công nghệ sử dụng (giải thích đơn giản)](#9-công-nghệ-sử-dụng-giải-thích-đơn-giản)
10. [Triển khai](#10-triển-khai)
11. [Lộ trình phát triển](#11-lộ-trình-phát-triển)
12. [Điểm nổi bật khi thuyết trình](#12-điểm-nổi-bật-khi-thuyết-trình)

---

## 1. Ý tưởng & Vấn đề giải quyết

### Bài toán thực tế

Một giáo viên tiểu học thường quản lý **30–40 học sinh** mỗi ngày. Với số lượng đó, họ chỉ có thể nhận ra những sự kiện lớn — đứa trẻ khóc, đánh nhau, nghỉ học nhiều tuần. Còn những **thay đổi nhỏ, từ từ, tích lũy** thì gần như không thể theo dõi được bằng mắt thường:

> *"Tuần trước em ấy vẫn bình thường. Tôi không biết sao lại vậy..."*
> — câu nói quen thuộc của giáo viên khi một học sinh có biểu hiện đáng lo sau khi đã trải qua thời gian dài thay đổi thầm lặng.

**Vấn đề cốt lõi:** Những học sinh im lặng, thay đổi dần dần — thường bị phát hiện rất muộn.

### Tại sao không dùng khảo sát tâm lý?

Vì khảo sát tâm lý:
- Phức tạp, cần chuyên gia phân tích
- Không thể làm hằng ngày
- Không phù hợp với học sinh tiểu học
- Tạo cảm giác bị "đánh giá"

### Giải pháp của ClassPulse

**Không đo tâm lý. Chỉ quan sát tín hiệu đơn giản theo thời gian.**

Một học sinh chọn "hơi buồn" 1 lần — bình thường. Nhưng nếu em đó chọn buồn liên tục 5 ngày, kết hợp với việc hay bỏ điểm danh và giáo viên cũng nhận thấy em ngồi tách biệt — đó là **tín hiệu đáng chú ý**.

ClassPulse tự động nhận ra các mẫu như vậy và **nhắc nhở giáo viên quan tâm sớm hơn**.

---

## 2. ClassPulse là gì?

**ClassPulse** (tạm dịch: *"Nhịp đập của lớp học"*) là ứng dụng web hỗ trợ giáo viên phát hiện sớm những thay đổi cảm xúc của học sinh tiểu học thông qua hoạt động **"Điểm danh cảm xúc"** hằng ngày — chỉ mất **2–3 phút/ngày** cho cả lớp.

| | |
|---|---|
| **Tagline** | *"Lắng nghe lớp học mỗi ngày"* |
| **Loại sản phẩm** | Web app (chạy trên điện thoại, máy tính bảng, máy tính) |
| **Đối tượng MVP** | Học sinh tiểu học (lớp 1–5) |
| **Ngôn ngữ** | Tiếng Việt |

### ClassPulse LÀ:
- Công cụ **hỗ trợ** giáo viên nhận ra những thay đổi nhỏ mà mắt thường bỏ sót
- Hệ thống **cảnh báo sớm** dựa trên tín hiệu tích lũy theo thời gian
- Kênh **liên lạc nhẹ nhàng** giữa trường và phụ huynh (báo cáo tuần)

### ClassPulse KHÔNG phải:
- App chẩn đoán tâm lý hay bệnh lý
- Hệ thống đánh giá, xếp loại hạnh kiểm học sinh
- Công cụ thay thế chuyên viên tâm lý học đường
- Ứng dụng có AI hay machine learning

---

## 3. Ai sử dụng? Dùng như thế nào?

ClassPulse có **3 nhóm người dùng** với vai trò khác nhau:

### Giáo viên — Người dùng chính

**Làm gì:**
- Tạo lớp học, nhập danh sách học sinh (dán tay hoặc upload file Excel)
- Mở app mỗi ngày để học sinh điểm danh cảm xúc
- Xem dashboard tổng quan trạng thái lớp
- Nhận cảnh báo khi có học sinh có dấu hiệu bất thường
- Ghi chú quan sát cá nhân khi cần
- Gửi báo cáo tuần cho phụ huynh

**Thời gian sử dụng:** ~5 phút/ngày (2-3 phút điểm danh + 1-2 phút xem dashboard)

---

### Học sinh tiểu học — Người tương tác trực tiếp

**Làm gì:**
- Tìm thẻ linh vật của mình trong lưới (nhận dạng bằng ảnh linh vật + tên)
- Chọn 1 trong 3 trạng thái cảm xúc hôm nay: 😊 Vui / 😐 Bình thường / 🙁 Hơi buồn
- (Tùy chọn) Bấm "Bỏ qua lần này" nếu không muốn chia sẻ

**Thời gian:** ~5 giây/bé, cả lớp xong trong 2–3 phút

**Cách vận hành trong lớp:** Giáo viên mở app trên **1 thiết bị duy nhất** rồi **truyền tay** lần lượt từng bé — không cần mỗi bé có điện thoại riêng.

---

### Phụ huynh — Người nhận thông tin

**Làm gì:**
- Nhận **email tóm tắt mỗi tuần** (thứ Hai)
- Xem báo cáo qua **link trong email** — không cần tài khoản, không cần đăng nhập

**Phụ huynh KHÔNG thấy:** dữ liệu thô từng ngày, cảnh báo từ hệ thống, thông tin của học sinh khác.

---

## 4. Luồng vận hành hằng ngày

### Quy trình 2–3 phút trong lớp

```
Cuối giờ học
     │
     ▼
GV bấm "Bắt đầu điểm danh"
     │
     ▼
Đưa máy cho bé đầu tiên
     │
     ├──► Bé tìm thẻ linh vật của mình
     │         │
     │         ▼
     │    Màn hình chào: "Chào Minh An! ✨"
     │         │
     │         ▼
     │    Chọn mood: 😊 / 😐 / 🙁
     │         │
     │         ▼
     │    Màn celebration + streak 🔥
     │         │
     │         ▼
     │    Tự động quay về lưới linh vật
     │         │
     └──► Truyền máy cho bé tiếp theo
          (lặp lại cho đến hết lớp)
     │
     ▼
GV nhận máy lại
"33/35 đã xong!"
```

### Chi tiết từng bước từ góc nhìn học sinh

**Bước 1 — Tìm linh vật:**
Mỗi học sinh có 1 linh vật riêng (do bé tự chọn ngày đầu tiên). Lưới hiện tất cả linh vật của lớp. Bé đã điểm danh rồi sẽ mờ đi và có dấu ✓.

**Bước 2 — Màn chào đón:**
Khi tap vào linh vật, app hiện: *"Chào Minh An! ✨"* cùng hình linh vật vẫy tay — để xác nhận đúng người trước khi chọn mood.

**Bước 3 — Chọn cảm xúc:**
3 emoji to, bằng nhau, vị trí thay đổi mỗi ngày (để tránh bé quen vị trí và chọn theo thói quen thay vì cảm xúc thật). Bên dưới có nút "bỏ qua lần này" nhỏ, xám — cố ý không nổi bật để bé chỉ dùng khi thực sự muốn.

**Bước 4 — Celebration:**
Dù chọn mood nào, app đều có animation vui vẻ giống nhau (không thiên vị mood buồn). Hiện streak 🔥 nếu bé điểm danh nhiều ngày liên tiếp. Có nút "↩ Đổi lại" trong 3 giây nếu bé chọn nhầm.

---

### Kịch bản điển hình trong tuần

| Thời điểm | Hoạt động |
|---|---|
| Hằng ngày (cuối giờ) | Điểm danh cảm xúc toàn lớp, 2–3 phút |
| Ngay sau điểm danh | Hệ thống tự động phân tích tín hiệu cả lớp |
| Bất cứ lúc nào | GV mở dashboard xem trạng thái, thêm ghi chú quan sát |
| Thứ Hai đầu tuần | Email tóm tắt tuần tự động gửi đến phụ huynh |

---

## 5. Hệ thống phát hiện bất thường

Đây là **"trái tim"** của ClassPulse — thứ phân biệt nó với một app điểm danh thông thường.

### Nguyên tắc quan trọng

> **Không tin 1 lần. Chỉ tin xu hướng.**

Một học sinh chọn buồn hôm nay — không có nghĩa gì. Nhưng hệ thống theo dõi **pattern trong 7–14 ngày** và kết hợp nhiều loại tín hiệu.

### 3 nguồn tín hiệu

| Nguồn | Ai cung cấp | Nội dung |
|---|---|---|
| **Điểm danh cảm xúc** | Học sinh tự chọn | 😊 Vui / 😐 Bình thường / 🙁 Buồn / ⬜ Bỏ qua |
| **Quan sát của GV** | Giáo viên chủ động đánh dấu | 🟢 Bình thường / 🟡 Hơi khác / 🔴 Cần chú ý |
| **Sự vắng mặt** | Hệ thống tự ghi nhận | Ngày nào bé không điểm danh (dù không phải bỏ qua) |

### 6 quy tắc phát hiện (Rule Engine)

Hệ thống chạy 6 "quy tắc" cho mỗi học sinh mỗi ngày. Mỗi quy tắc như một câu hỏi tự động:

| # | Tên quy tắc | Câu hỏi hệ thống hỏi |
|---|---|---|
| 1 | **Thay đổi đột ngột** | Hôm nay bé vui, hôm qua bé rất vui — có gì bất thường không? |
| 2 | **Xu hướng giảm dần** | Mood của bé đang đi xuống từ từ theo thời gian không? |
| 3 | **Lặp lại tiêu cực** | Bé chọn buồn nhiều ngày liên tiếp không? |
| 4 | **Im lặng đáng lo** | Bé không điểm danh nhiều ngày — trong khi trước đó rất đều? |
| 5 | **Tín hiệu chéo** | Cả bé chọn buồn VÀ GV cũng đã nhận thấy bất thường? |
| 6 | **Mẫu bỏ qua** | Bé có mặt nhưng hay chọn "bỏ qua" nhiều ngày liên tiếp không? |

### Kết quả: 3 mức cảnh báo

```
🟢 Bình thường    — Không có tín hiệu bất thường
🟡 Cần để ý       — Có 1-2 tín hiệu nhẹ → GV quan sát thêm
🔴 Cần quan tâm   — Có tín hiệu rõ hoặc nhiều tín hiệu kết hợp → GV chủ động hỏi thăm
```

### Ví dụ thực tế

**Ví dụ 1 — Học sinh 🟡:**
> Em Bình 5 ngày qua chọn: 😊 → 😊 → 😐 → 🙁 → 🙁
> → Hệ thống nhận ra "xu hướng giảm dần" + "lặp lại tiêu cực"
> → Dashboard hiển thị 🟡 với gợi ý: *"Cân nhắc trò chuyện nhẹ nhàng với em"*

**Ví dụ 2 — Học sinh 🔴:**
> Em An: 3 ngày không điểm danh, 2 ngày còn lại chọn 🙁, GV đã mark 🟡 hôm qua
> → Hệ thống kết hợp 3 loại tín hiệu cùng lúc
> → Dashboard hiển thị 🔴 với gợi ý: *"Nên dành thời gian trò chuyện riêng với em"*

### Điều quan trọng cần nhớ

- Hệ thống **KHÔNG kết luận** gì về học sinh — chỉ gợi ý giáo viên chú ý thêm
- Giáo viên **KHÔNG đề cập hệ thống** với học sinh ("Cô thấy em điểm danh buồn...")
- Mọi hành động đều **tự nhiên**, như thể giáo viên đang tự quan sát

---

## 6. Báo cáo cho phụ huynh

### Cách thức

Mỗi **thứ Hai**, hệ thống tự động gửi email tóm tắt tuần cho phụ huynh (nếu có email trong hệ thống). Phụ huynh bấm link trong email để xem — không cần tài khoản, không cần đăng nhập.

### Nội dung email

```
Xin chào ba/mẹ của Minh An,

Tuần vừa qua (16/06 – 20/06), bé có:
  🙂 3 ngày vui
  😐 1 ngày bình thường
  🙁 1 ngày hơi buồn

👉 Gợi ý: Dành thời gian trò chuyện nhẹ
   với bé về trường lớp nhé!
```

### Triết lý giao tiếp với phụ huynh

| Không dùng | Thay bằng |
|---|---|
| "Cảnh báo", "nguy hiểm" | "Gợi ý", "để ý thêm" |
| "Bất thường", "có vấn đề" | "Dành thời gian trò chuyện" |
| Dữ liệu thô từng ngày | Tóm tắt tuần, ngôn ngữ ấm áp |
| Chẩn đoán, kết luận | Gợi ý nhẹ nhàng cho ba mẹ |

Link báo cáo có **mã bí mật** và **hết hạn sau 30 ngày** — không ai khác truy cập được.

---

## 7. Giao diện & Thiết kế

### Triết lý thiết kế

ClassPulse có **2 giao diện riêng biệt** phục vụ 2 đối tượng rất khác nhau:

**Giao diện học sinh** — Tươi sáng, đơn giản, thân thiện:
- Màu sắc ấm, pastel dễ chịu
- Emoji to, dễ nhìn, dễ tap
- Animation vui vẻ (linh vật vẫy tay, confetti, streak)
- Không có chữ nhỏ, không có menu phức tạp
- Thiết kế cho ngón tay bé — nút đủ to để tap chính xác

**Giao diện giáo viên** — Rõ ràng, nhanh, thực dụng:
- Dashboard tổng quan ngay khi mở
- Màu sắc nhất quán: 🟢🟡🔴 để quét thông tin nhanh
- Học sinh có vấn đề luôn hiện lên đầu danh sách
- Thao tác tối thiểu — mở app là thấy ngay cần làm gì

### Hệ thống linh vật

50 linh vật độc đáo — mỗi học sinh **tự chọn 1 con** trong buổi đầu tiên. Linh vật giúp:
- Học sinh nhận ra thẻ của mình nhanh hơn (hình ảnh > tên)
- Tạo sự gắn kết, hào hứng với hoạt động hằng ngày
- Bảo mật nhẹ: học sinh khác không biết bạn chọn mood gì (chỉ thấy linh vật, không thấy mood)

### Thiết bị sử dụng

| Tình huống | Thiết bị |
|---|---|
| Điểm danh trong lớp | 1 điện thoại/tablet của GV, truyền tay |
| GV xem dashboard | Điện thoại hoặc máy tính |
| Phụ huynh xem report | Điện thoại (link từ email) |

> **Ưu điểm lớn:** Không cần học sinh có điện thoại riêng. Không cần trường đầu tư thiết bị.

---

## 8. Bảo mật & Quyền riêng tư

### Dữ liệu được lưu

ClassPulse lưu trữ **tối thiểu** để hoạt động:

| Dữ liệu | Mức độ nhạy cảm | Ghi chú |
|---|---|---|
| Tên học sinh | Trung bình | Chỉ hiện trong lớp của GV đó |
| Mood hằng ngày (con số 1/2/3) | Nhạy cảm | Không lưu lý do, không lưu văn bản |
| Email phụ huynh | Trung bình | Chỉ dùng gửi báo cáo tuần |
| Ghi chú của GV | Nhạy cảm | Chỉ GV đó thấy |

### Những gì ClassPulse KHÔNG làm

- Không bán dữ liệu cho bên thứ ba
- Không dùng data để huấn luyện AI
- Không công khai thông tin học sinh
- Không so sánh học sinh giữa các lớp/trường

### Kiến trúc bảo mật

- Mỗi giáo viên chỉ thấy dữ liệu lớp của **chính mình**
- Phụ huynh chỉ thấy báo cáo của **con mình**
- Link báo cáo có mã bí mật ngẫu nhiên, hết hạn sau 30 ngày
- Dữ liệu lưu trên máy chủ Supabase (đặt tại Singapore — tuân thủ PDPA)

### Yêu cầu pháp lý (theo Nghị định 13/2023/NĐ-CP VN)

**Với MVP (1–5 trường pilot):**
- Ban giám hiệu biết và đồng ý (email hoặc biên bản ngắn)
- Giáo viên thông báo với phụ huynh tại họp đầu năm
- Disclaimer trong app: *"Dữ liệu chỉ dùng để hỗ trợ giáo viên — không chia sẻ bên ngoài"*

**Khi mở rộng quy mô:** Cần Privacy Policy chính thức, quyền xóa dữ liệu theo yêu cầu.

---

## 9. Công nghệ sử dụng (giải thích đơn giản)

*Phần này dành cho ai muốn hiểu thêm — không cần thiết cho thuyết trình cơ bản.*

### Hình dung tổng thể

```
Người dùng (điện thoại/máy tính)
        │  truy cập qua trình duyệt web
        ▼
   ClassPulse Web App
   (Next.js — chạy trên Vercel)
        │  lưu & truy xuất dữ liệu
        ▼
   Cơ sở dữ liệu
   (Supabase — PostgreSQL)
        │  gửi email
        ▼
   Dịch vụ email
   (Resend)
```

### Từng thành phần

| Thành phần | Công nghệ | Hiểu đơn giản là... |
|---|---|---|
| Giao diện người dùng | Next.js 15 + React | "Bộ khung" tạo ra các trang web người dùng thấy |
| Thiết kế giao diện | Tailwind CSS + Framer Motion | CSS tạo màu sắc, bố cục + animation mượt mà |
| Cơ sở dữ liệu | Supabase (PostgreSQL) | Nơi lưu toàn bộ dữ liệu: lớp, học sinh, mood, flags |
| Xác thực đăng nhập | Supabase Auth | Giáo viên đăng nhập bằng email hoặc Google |
| Gửi email | Resend | Dịch vụ gửi email báo cáo tuần cho phụ huynh |
| Hosting | Vercel | Nơi "đặt" ứng dụng để chạy trên internet |
| Tên miền | Tùy chọn | Địa chỉ website (vd: classpulse.vn) |

### Tại sao chọn công nghệ này?

- **Không cần server riêng** — Vercel và Supabase đều là dịch vụ cloud, không cần đội IT
- **Chi phí thấp** — Free tier đủ dùng cho MVP (xem phần tiếp theo)
- **Mở rộng dễ** — Khi có nhiều trường, chỉ cần nâng gói, không cần viết lại từ đầu

---

## 10. Triển khai

### Cách triển khai

ClassPulse là **web app** — chạy trên trình duyệt, không cần cài đặt. Giáo viên chỉ cần:
1. Truy cập địa chỉ web (vd: classpulse.vn)
2. Đăng ký tài khoản (email hoặc Google)
3. Tạo lớp, nhập danh sách học sinh
4. Bắt đầu điểm danh

### Điều kiện để triển khai tại trường

- Trường có mạng WiFi (hoặc GV dùng 4G)
- 1 điện thoại/tablet cho GV (không yêu cầu thiết bị cho học sinh)
- Không cần cài đặt phần mềm, không cần IT hỗ trợ

---

## 11. Lộ trình phát triển

### Phạm vi MVP

- Đăng ký / đăng nhập giáo viên (email + Google)
- Tạo lớp, nhập danh sách (dán tay hoặc Excel)
- Học sinh chọn linh vật (buổi đầu tiên)
- Điểm danh cảm xúc hằng ngày
- Dashboard giáo viên với cảnh báo 🟢🟡🔴
- Lịch sử 7 ngày từng học sinh
- Ghi chú quan sát của giáo viên
- Báo cáo tuần tự động qua email
- Trang báo cáo cho phụ huynh (không cần đăng nhập)

### Giai đoạn 2 (sau pilot)

- App mobile native (iOS + Android) — tăng trải nghiệm điểm danh
- Thông báo push cho giáo viên khi có cảnh báo mới
- Tích hợp Zalo (kênh giao tiếp phổ biến tại VN)
- Dashboard dành cho ban giám hiệu (xem tổng hợp nhiều lớp)
- Chế độ offline (điểm danh không cần mạng, đồng bộ sau)

### Giai đoạn 3 (mở rộng)

- Mở rộng lên THCS, THPT
- Multi-school admin portal
- Phân tích xu hướng theo học kỳ
- Tích hợp với hệ thống quản lý trường học (SMAS, MISA School)

---

## 12. Điểm nổi bật khi thuyết trình

### Những con số ấn tượng

- **2–3 phút** — thời gian điểm danh toàn lớp (30-40 học sinh)
- **5 giây** — thời gian mỗi học sinh cần để điểm danh
- **6 quy tắc** phát hiện bất thường, chạy tự động hằng ngày
- **0 thiết bị phụ** — không cần học sinh có điện thoại

### Điểm khác biệt so với giải pháp hiện có

| Giải pháp hiện tại | ClassPulse |
|---|---|
| Giáo viên quan sát bằng mắt → bỏ sót | Hệ thống theo dõi liên tục, không bỏ sót |
| Khảo sát tâm lý định kỳ → phức tạp | Điểm danh hằng ngày, 5 giây/bé |
| Phụ huynh chỉ biết khi có sự cố lớn | Báo cáo tuần chủ động, nhẹ nhàng |
| Cần thiết bị cho từng học sinh | 1 thiết bị dùng chung truyền tay |
| Dữ liệu rời rạc, không có pattern | Phân tích xu hướng theo thời gian |

### Câu chuyện người dùng (để thuyết trình)

> **Cô Hương — Giáo viên lớp 3A:**
> *"Trước đây tôi không biết em An đang có chuyện. Em ấy không khóc, không làm ồn, cứ ngồi im. Đến khi mẹ em gọi điện thì sự việc đã kéo dài mấy tuần. Với ClassPulse, tuần trước hệ thống đã nhắc tôi chú ý em An sớm hơn — tôi kịp hỏi thăm và phát hiện em đang bị bạn trêu chọc."*

### Tóm tắt giá trị cốt lõi

```
ClassPulse giải quyết một bài toán đơn giản nhưng quan trọng:
Giáo viên không thể nhớ mọi thứ của 35+ học sinh mỗi ngày.
ClassPulse nhớ thay — và nhắc đúng lúc.
```

---

*Tài liệu này được tạo ngày 2026-06-29. Để biết thêm chi tiết kỹ thuật, xem các file docs khác trong cùng thư mục.*
