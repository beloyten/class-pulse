# 📋 ClassPulse — Product Brief (PRD)

> **"Đây không phải là hệ thống hiểu tâm lý học sinh, mà là một lớp hỗ trợ giúp giáo viên nhận ra những thay đổi nhỏ theo thời gian – thứ mà con người rất dễ bỏ sót trong một lớp học đông học sinh."**

---

## 1. Tổng quan sản phẩm

| Hạng mục | Chi tiết |
|---|---|
| **Tên sản phẩm** | ClassPulse |
| **Loại** | Web app (responsive, mobile-first) |
| **Đối tượng MVP** | Học sinh tiểu học |
| **Scale sau** | THCS → THPT → Đại học |
| **Ngôn ngữ giao diện** | Tiếng Việt |
| **Tagline** | *"Lắng nghe lớp học mỗi ngày"* |

---

## 2. Định vị sản phẩm

### ✅ ClassPulse LÀ:
- Hệ thống hỗ trợ giáo viên **phát hiện sớm** những thay đổi bất thường của học sinh
- Dựa trên **tín hiệu nhỏ** tích lũy theo thời gian
- Công cụ **hỗ trợ** giáo viên (không thay thế)

### ❌ ClassPulse KHÔNG phải:
- App khảo sát tâm lý
- Hệ thống chẩn đoán trầm cảm / rối loạn
- AI hiểu nội tâm học sinh
- Bảng xếp hạng hoặc hệ thống đánh giá hạnh kiểm

### 🔑 Key concepts:
- **Early signal** — phát hiện sớm, không phải sau khi sự việc xảy ra
- **Pattern over time** — không tin 1 lần, chỉ tin xu hướng
- **Support teacher** — gợi ý chú ý, không kết luận

---

## 3. Vấn đề (Problem)

### Hiện tại:
- Giáo viên **không thể** theo dõi chi tiết 30–40 học sinh mỗi ngày
- Chỉ nhận ra **sự kiện lớn** (đánh nhau, khóc, nghỉ học dài), bỏ sót **biến động nhỏ**

### Hệ quả:
> *"Những học sinh im lặng, thay đổi dần dần → bị phát hiện rất muộn."*

---

## 4. Giải pháp (Solution Core)

**Nguyên tắc:**
- 👉 KHÔNG đo tâm lý
- 👉 CHỈ track tín hiệu đơn giản + theo thời gian
- 👉 Combine nhiều nguồn → detect bất thường

### 3 nguồn tín hiệu:

| # | Nguồn | Ai nhập | Tần suất | Độ nặng |
|---|---|---|---|---|
| A | **Điểm danh cảm xúc (HS)** | Học sinh | Hằng ngày | 1 tap, 3 giây |
| B | **Teacher observation** | Giáo viên | Khi cần | ≤ 20 giây/ngày |
| C | **Participation signal** | Tự động | Hằng ngày | Không cần nhập |

---

## 5. Đối tượng người dùng

### 👨‍🏫 Giáo viên (Primary user)
- Tạo & quản lý lớp
- Xem dashboard trạng thái lớp
- Mark observation (optional)
- Nhận flag cảnh báo
- Gửi report cho phụ huynh

### 👶 Học sinh tiểu học
- Điểm danh cảm xúc hằng ngày (1 tap)
- Tương tác với linh vật
- Xem streak điểm danh

### 👨‍👩‍👧 Phụ huynh
- Nhận weekly summary qua email
- Xem báo cáo tuần qua link (không cần account)

---

## 6. Mô hình sử dụng

### Thiết bị:
- **1 điện thoại/tablet của giáo viên, truyền tay trong lớp**

### Flow hằng ngày:
1. Cuối giờ, GV mở ClassPulse → bấm "Bắt đầu điểm danh"
2. Truyền máy theo bàn
3. Mỗi bé: tìm thẻ linh vật → tap → chọn mood → truyền tiếp
4. Tổng thời gian: **2–3 phút / lớp**

### Quy tắc lớp:
- ❌ Không nhìn màn người khác
- ❌ Không gọi tên
- ❌ Không công khai mood

---

## 7. Triết lý dữ liệu

> *"Data không cần đúng từng lần, chỉ cần đủ đều để tạo pattern."*

- Không tin 1 lần chọn → chỉ tin pattern nhiều ngày
- Combine signals từ nhiều nguồn
- Thiết kế để **chịu được** noise (bé chọn theo bạn, chọn lung tung)

---

## 8. Phụ huynh

### KHÔNG:
- Gửi daily
- Gửi raw data
- Dùng từ "nguy hiểm", "bất thường", "cảnh báo"

### CHỈ gửi WEEKLY:
```
Tuần này của bé An:
🙂 3 ngày · 😐 2 ngày · 🙁 1 ngày

👉 Gợi ý: Dành thời gian trò chuyện nhẹ với bé nhé!
```

---

## 9. MVP Scope

### ✅ PHẢI CÓ (Must-have):
- [ ] Tạo lớp: paste danh sách **hoặc** upload Excel template (tải mẫu → điền → upload)
- [ ] Thư viện 50 linh vật — bé tự chọn trong session đầu tiên (có hỗ trợ bé vắng, GV chọn thay)
- [ ] Màn điểm danh cảm xúc (lưới linh vật + tên + 3 emoji full screen)
- [ ] Cơ chế undo: nút "↩ Đổi lại" + countdown bar 3 giây → quay về chọn lại mood
- [ ] Teacher dashboard cơ bản (danh sách + status 🟢🟡🔴)
- [ ] Rule engine detect (6 rule)
- [ ] Lịch sử 7 ngày khi click vào từng HS
- [ ] Gợi ý hành động theo cấp độ flag (3 mức: quan sát / trò chuyện nhẹ / quan tâm sớm)
- [ ] Teacher observation mark (🟢🟡🔴 + ghi chú ngắn, optional)
- [ ] Weekly parent report (email Resend + link xem không cần login)
- [ ] Streak & celebration animation (đồng nhất mọi mood, không thiên vị)

### ❌ KHÔNG LÀM (trong MVP):
- AI / Machine Learning
- Auth phức tạp (OTP SMS)
- Mobile app native
- Phân tích sâu / tâm lý
- Bảng xếp hạng / so sánh HS
- Zalo integration
- Multi-school / admin portal

---

## 10. Metrics thành công (MVP)

| Metric | Mục tiêu |
|---|---|
| Tỷ lệ điểm danh cảm xúc hằng ngày | > 80% HS trong lớp |
| Thời gian điểm danh toàn lớp | < 3 phút |
| GV mở dashboard | ≥ 3 lần/tuần |
| Flag phát hiện đúng | GV confirm "có ích" > 60% |

---

## 11. Rủi ro & Giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Bé chọn lung tung | Trung bình | Pattern > single data point; combine signals |
| Bé hỏi nhau "mày chọn gì" | Cao | Thiết kế chịu được noise; reset nhanh |
| GV quên dùng | Trung bình | UX nhanh (2 phút); nhắc nhở nhẹ |
| Phụ huynh lo lắng quá | Thấp | Ngôn từ nhẹ nhàng; chỉ gợi ý |
| Mạng trường không ổn | Thấp | Progressive loading; offline queue (phase 2) |

---

## 12. Pháp lý & Quyền riêng tư

> ⚠️ **Nhận thức cần có — không phải blocker cho MVP, nhưng cần xử lý trước khi scale.**

### Tại sao cần chú ý?
Câu hỏi "Hôm nay cảm xúc của em thế nào?" hoàn toàn bình thường — GV hỏi điều này mỗi ngày bằng lời. Nhưng ClassPulse **lưu trữ + track + sinh pattern theo thời gian + gửi report ra ngoài** từ câu trả lời của trẻ em — đó là thứ tạo ra yêu cầu pháp lý (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân tại Việt Nam).

### MVP (1–5 trường pilot): Đơn giản, làm được ngay
- ✅ BGH trường biết và đồng ý (email hoặc biên bản họp ngắn gọn)
- ✅ GV thông báo với PH tại buổi họp đầu năm (1–2 câu, không cần form phức tạp)
- ✅ Disclaimer trong app: *"Dữ liệu chỉ dùng để hỗ trợ giáo viên — không chia sẻ bên ngoài"*
- ✅ GV có nút xóa lớp → xóa toàn bộ mood log của lớp đó

### Khi scale (10+ trường): Cần làm nghiêm túc hơn
- [ ] Privacy Policy rõ ràng, truy cập được từ app
- [ ] Parental consent rõ ràng khi tạo lớp
- [ ] Data retention policy: mood log giữ bao lâu, xóa khi nào
- [ ] Right to deletion: PH/HS yêu cầu → xóa trong 30 ngày
- [ ] Không bán, không share, không dùng cho AI training bên thứ 3

### Privacy by Design (áp dụng từ đầu, không phải sau)
| Nguyên tắc | Cách ClassPulse áp dụng |
|---|---|
| **Dữ liệu tối thiểu** | Chỉ lưu mood (giá trị 0–3), không lưu lý do, không text, không audio |
| **Có thể xóa** | Nút "Xóa lớp" → xóa cả mood logs, flags, reports liên quan |
| **Không phán xét** | Output chỉ là "gợi ý chú ý", không phải "chẩn đoán" hay "xếp loại" |
| **Vô hình với HS** | HS không biết có hệ thống track — chỉ thấy "điểm danh cảm xúc" đơn giản |

---

## 13. Ngôn ngữ sản phẩm — Naming Convention

> **Quyết định:** Gọi là **"Điểm danh cảm xúc"** trong toàn bộ giao diện hướng người dùng — không dùng "Check-in".

| Ngữ cảnh | Dùng | Không dùng |
|---|---|---|
| Giao diện HS/GV | "Điểm danh cảm xúc" | "Check-in", "Mood check-in" |
| Nút bắt đầu | "Bắt đầu điểm danh" | "Start check-in" |
| Thống kê | "Đã điểm danh: 33/35" | "Checked in: 33/35" |
| Streak | "Chuỗi ngày điểm danh" | "Check-in streak" |
| Code nội bộ (API, DB) | `/api/checkin`, `mood_logs` | (giữ nguyên — là kỹ thuật) |

**Lý do:** GV VN đã quen với "điểm danh" như một ritual hằng ngày. "Cảm xúc" bình thường hóa chủ đề. Kết hợp lại → HS hiểu ngay, không có cảm giác bị theo dõi bằng "app tech".

---

## 12. Teacher Action Guidelines

> Xem đầy đủ: [`docs/08-teacher-action-guidelines.md`](./08-teacher-action-guidelines.md)

Hệ thống **không chẩn đoán, không kết luận** — chỉ gợi ý GV cần chú ý thêm. GV hành động **tự nhiên**, như thể đang tự quan sát, không đề cập đến hệ thống với học sinh.

### 3 cấp hành động:

| Cấp | Trigger | Gợi ý hệ thống hiển thị | Hành động GV |
|---|---|---|---|
| 🟡 Level 1 — Nhẹ | Tín hiệu nhẹ, thay đổi nhỏ | *"Quan sát thêm em trong lớp"* | Chú ý sự tham gia, tương tác của bé |
| 🟠 Level 2 — Trung bình | Xu hướng tiêu cực kéo dài | *"Cân nhắc trò chuyện nhẹ"* | Hỏi thăm tự nhiên: *"Dạo này em thấy học ổn không?"* |
| 🔴 Level 3 — Mạnh | Nhiều tín hiệu kết hợp | *"Nên quan tâm sớm"* | Trò chuyện riêng, có thể liên hệ PH hoặc chuyên viên |

### Nguyên tắc vàng:
- ✅ Hành động tự nhiên — như đang tự quan sát, không nhắc đến hệ thống
- ✅ Hỏi câu mở, không dẫn dắt
- ❌ KHÔNG nói *"Cô thấy em điểm danh buồn..."*
- ❌ KHÔNG dán nhãn học sinh
- ❌ KHÔNG hành động chỉ từ 1 data point duy nhất
