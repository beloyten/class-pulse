# 🎮 ClassPulse — UX Flows

---

## 1. Luồng Điểm danh cảm xúc (Màn hình chính cho học sinh)

### 1.1 Entry Point
- GV mở link: `classpulse.app/c/[classCode]`
- Hoặc: GV bấm "Bắt đầu điểm danh" từ dashboard → auto mở

---

### 1.2 Màn 1: Lưới linh vật (Chọn "Bạn là ai?")

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         🌈 ClassPulse - Lớp 3A                  │
│         "Tìm bạn linh vật của mình nhé!"       │
│                                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐ │
│  │ 🦊  │  │ 🐰  │  │ 🐻  │  │ 🐼  │  │ 🐨  │ │
│  │ An  │  │Bình │  │ Cúc │  │ Duy │  │  Em │ │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘ │
│                                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐ │
│  │ 🦁  │  │ 🐧  │  │ 🐱  │  │ ✓   │  │ 🐹  │ │
│  │Giang│  │Hùng │  │  Hy │  │(done)│  │Khánh│ │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘ │
│                                                 │
│  ... (scroll nếu > 20 bé)                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Chi tiết thiết kế:**
- Grid responsive: 4-5 cột (tùy màn hình)
- Mỗi thẻ: **Illustration linh vật to** + **Tên bé** bên dưới
- Màu nền thẻ = màu đặc trưng linh vật (dễ quét bằng mắt)
- Thẻ đã điểm danh: **mờ đi + dấu ✓** (không tap được nữa)
- **Không hiện mood** của bé trước (chỉ hiện đã xong/chưa)
- Animation: thẻ **bounce nhẹ** khi idle (mời gọi)

**Accessibility (tiểu học):**
- Font to, rõ ràng
- Không scroll ngang (chỉ dọc)
- Thẻ đủ lớn cho ngón tay bé (~80x100px minimum)

---

### 1.3 Màn 2: Chào đón (sau khi tap thẻ)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              🦊                                  │
│         (linh vật to, vẫy tay)                  │
│                                                 │
│         "Chào Minh An! ✨"                       │
│                                                 │
│                                                 │
│         [Tiếp tục →]                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Chi tiết:**
- Full screen, background gradient nhẹ theo màu linh vật
- Linh vật **vẫy tay** animation (Framer Motion)
- Tên bé hiện to, ấm áp
- Auto chuyển sang Màn 3 sau **1.5 giây** (hoặc tap "Tiếp tục")
- Mục đích: **xác nhận đúng người** + tạo cảm giác welcome

---

### 1.4 Màn 3: Chọn Mood (THE CORE SCREEN)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│     "Hôm nay bạn thấy thế nào?"               │
│                                                 │
│      😊           😐           🙁               │
│    (nảy)       (nảy)        (nảy)              │
│                                                 │
│   "Vui lắm"  "Bình thường"  "Hơi buồn"        │
│                                                 │
│                                                 │
│          [ bỏ qua lần này ]                    │
│          (text nhỏ, xám, phía dưới cùng)       │
└─────────────────────────────────────────────────┘
```

**Chi tiết thiết kế (ĐẦU TƯ NHẤT):**
- **Full screen**, không có gì khác ngoài 3 lựa chọn + 1 tùy chọn bỏ qua
- 3 emoji **cực to** (≥ 80px), có **idle animation** (nảy nhẹ lệch nhau)
- Label text bên dưới mỗi emoji: "Vui lắm" / "Bình thường" / "Hơi buồn"
- **Vị trí 3 emoji đổi ngẫu nhiên mỗi ngày** (chống bias vị trí)
- Tap emoji → **phóng to + burst particles** → chuyển Màn 4
- **KHÔNG có nút confirm** — 1 tap là xong
- Background: gradient nhẹ, ấm áp (không trắng lạnh)

**Nút "bỏ qua lần này" — cố ý không nổi bật:**
- Vị trí: **dưới cùng**, cách xa 3 emoji
- Style: **text link nhỏ** (≈ 13px), màu xám nhạt, không border, không animated
- Mục tiêu: bé **có quyền bỏ qua khi thực sự muốn**, không dùng vì lười hoặc không thấy

> ⚠️ **Lý do nút "bỏ qua" phải nhỏ và không nổi bật:**
> Nếu bứt mắt như 3 emoji, bé sẽ chọn vì lười/ngại suy nghĩ → skip lan tràn → data phá vỡ.
> Nút nhỏ là có chủ ý: **quyền bỏ qua phải tồn tại, nhưng đường mặc định là chia sẻ.**

**Anti-bias design:**
- Vị trí 3 emoji random mỗi ngày
- Size 3 emoji BẰNG NHAU
- Animation 3 emoji GIỐNG NHAU
- Màu sắc: warm tones đồng nhất (🙁 không dùng đỏ/đen → xanh dương nhạt, dễ thương)

---

### 1.5 Màn 4: Celebration (2-3 giây)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│           🎉 ✨ 🌟                               │
│                                                 │
│              🦊                                  │
│         (linh vật nhảy múa)                     │
│                                                 │
│     "Cảm ơn An nhé! Hẹn ngày mai 🌟"          │
│                                                 │
│     🔥 Bạn đã điểm danh 5 ngày liên tiếp!     │
│                                                 │
│     [Đổi lại]  (2s countdown)                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Chi tiết:**
- Linh vật **nhảy / xoay / confetti** (celebration animation)
- **Streak badge** hiện nổi bật (🔥 + số ngày)
- Sticker bay vào "sổ sưu tầm" (visual effect nhỏ ở góc)
- **QUAN TRỌNG:** animation celebration **GIỐNG NHAU** cho mọi mood (xem Rule vàng)

**⏱️ Cơ chế Undo — Chống chọn nhầm (QUAN TRỌNG):**

Cấu trúc màn 4 gồm 2 vùng rõ ràng:
- **Vùng trên:** Celebration animation (confetti + linh vật nhảy)
- **Vùng dưới:** Nút "↩ Đổi lại" + countdown bar trực quan

Cơ chế hoạt động:
- Mood **lưu DB ngay khi tap** (upsert) — không mất data nếu mạng yếu giữa chừng
- Nút **"↩ Đổi lại"** hiện **to, nổi bật** (≥ 48px height, ≥ 50% chiều ngang màn hình)
- **Countdown bar** giảm dần từ 3s → 0 — bé thấy trực quan còn bao lâu để đổi
- Nút và countdown bar mờ dần theo thời gian (opacity giảm) → tạo urgency tự nhiên, không nặng nề
- Nếu bé tap "Đổi lại": **quay về Màn 3** (chọn mood lại), **KHÔNG** phải về Màn 1 (lưới linh vật)
- Nếu bé chọn mood mới: mood **ghi đè** (upsert) + celebration chạy lại từ đầu
- Nếu hết countdown (hoặc bé không tap): **auto reset về Màn 1** → sẵn sàng cho bạn kế tiếp

Design notes:
- Nút style: outline (không filled) — không cạnh tranh visual với confetti
- Label: "↩ Đổi lại" — ngắn, dễ hiểu ngay
- Countdown: progress bar mỏng ngay phía dưới nút, giảm từ 100% → 0%

**Celebration cho mood 🙁:**
- Vẫn có confetti nhẹ + linh vật ôm ♥
- Text (rotate mỗi ngày, không lặp):
  - *"Hôm nay hơi buồn cũng không sao, cảm ơn bạn đã chia sẻ nhé 💛"*
  - *"Ai cũng có ngày không vui, cảm ơn bạn nhé ✨"*
  - *"Cảm ơn bạn đã thật thà hôm nay 💛"*
  - *"Ngày mai sẽ khác nhé, hẹn gặp lại 🌈"*
- Vẫn có streak + sticker — **KHÔNG thiếu hơn** mood 😊

**Celebration cho “Bỏ qua” (mood = 0):**
- Animation **nhẹ hơn** mood selection — không confetti lớn (chưa chia sẻ ≠ chưa tham gia)
- Linh vật: vẫy tay nhẹ, không nhảy điệu
- Text ấm, tôn trọng:
  - *"Không sao, hôm nay có mặt là tuyệt rồi! ✨"*
  - *"Cảm ơn bạn đã tham gia hôm nay nhé 💛"*
- **Streak VẪN +1** và hiện — bé có mặt và đã đưa ra lựa chọn, đó là tham gia
- **Undo vẫn có** trong 3s: nếu bé nghĩ lại muốn chia sẻ → quay về Màn 3

---

### 1.6 Edge Cases

| Case | Xử lý |
|---|---|
| Bé tap nhầm thẻ (chọn tên bạn khác) | Màn 2 hiện tên → bé nhận ra sai → tap "← Quay lại" |
| Bé tap nhầm mood | Nút "Đổi lại" trong 2–3s ở Màn 4 |
| Bé tap thẻ đã done (✓) | Không phản hồi (disabled) hoặc tooltip "Bạn này đã xong rồi" |
| Mất mạng giữa chừng | Retry auto khi có mạng lại (queue local) |
| Bé điểm danh 2 lần cùng ngày | UNIQUE constraint → chỉ giữ lần cuối (upsert) |
| Bé chọn **"Bỏ qua"** | Ghi `mood = 0` vào DB → hiện Màn 4 phiên bản "bỏ qua"; streak **vẫn +1** (bé có mặt và tham gia) |
| Bé chọn "Bỏ qua" rồi muốn đổi sang chọn mood | Nút "↩ Đổi lại" vẫn có trong 3s → quay về Màn 3 chọn mood thật |
| Cả lớp bỏ qua (đồng loạt) | Hệ thống detect > 30% skip cùng ngày → không flag cá nhân (có tình huống bên ngoài) |

---

## 2. Avatar Selection Flow (Ngày đầu tiên)

> Chỉ xảy ra **1 lần** khi GV tạo lớp mới.

### Flow:
```
[GV mở "Chọn linh vật cho lớp"]
    → Màn hình full screen hiện 50 linh vật (grid to, đẹp)
    → GV gọi từng bé lên (hoặc truyền tay)
    → Bé tap linh vật mình thích
    → Linh vật "về" với bé (animation: linh vật nhảy vào khung tên)
    → Linh vật đó mờ đi trong grid (đã có chủ)
    → Truyền cho bé tiếp
```

**Design:**
- Grid 50 linh vật, to, đầy màu, nảy nhẹ
- Tap → zoom in + "Bạn chọn 🦊 Cáo đúng không?" → [Ừ!] / [Chọn lại]
- Đã chọn → grayscale + dấu ✓
- Có thể đổi linh vật sau (GV reset trong settings)

### 2 modes triển khai Avatar Selection

**Mode A — Truyền tay trong lớp (Recommended cho tiểu học):**
1. GV mở "Phiên chọn linh vật" từ màn quản lý lớp
2. Màn hình lưới 50 linh vật hiện lên (to, đầy màu, nảy nhẹ)
3. Truyền máy tuần tự từng bé — tương tự điểm danh cảm xúc hằng ngày
4. Bé tìm linh vật mình thích → tap → confirm:
   - *"Bạn chọn 🦊 Cáo đúng không?"*  →  **[Ừ đúng rồi!]** / **[Chọn lại]**
5. Thẻ linh vật đó: grayscale + dấu ✓ (đã có chủ, không ai chọn được nữa)
6. Truyền máy cho bé tiếp theo

⏱️ Ước tính: **5–8 phút** cho lớp 35–40 bé

**Mode B — GV chọn thay (khi bé vắng ngày đầu):**
- GV vào Settings → Quản lý linh vật → chọn tên bé vắng → chọn linh vật thay
- Khi bé quay trở lại: GV mở lại phiên chỉ cho đúng 1 bé đó tự chọn
- Hoặc: giữ nguyên lựa chọn của GV nếu bé đồng ý

**Đổi linh vật sau khi đã chọn:**
- GV vào Settings → Quản lý linh vật lớp → chọn tên bé → Reset
- Hệ thống mở lại phiên chọn chỉ cho 1 bé (không ảnh hưởng cả lớp)
- Lịch sử mood **vẫn giữ nguyên** — linh vật chỉ là display, không liên kết data

### Edge Cases Avatar Selection

| Case | Xử lý |
|---|---|
| Bé muốn đổi ngay sau khi confirm | Nút "Chọn lại" trong **5 giây** sau khi xác nhận |
| Bé vắng ngày đầu | Bỏ qua → bé điểm danh với icon mặc định ⭐; GV assign sau hoặc mở phiên riêng |
| Lớp > 50 bé (hiếm) | Auto-assign từ extended emoji list (đủ 60 options) |
| Session bị gián đoạn (mất mạng) | Lựa chọn đã lưu real-time, session tiếp tục được khi có mạng lại |
| GV muốn reset toàn bộ | Settings → "Reset linh vật cả lớp" — cần confirm 2 bước (không thể hoàn tác) |
| Bé thấy linh vật bạn khác đẹp hơn | GV có thể mở phiên đổi riêng cho bé đó (nếu linh vật kia chưa có chủ) |

> ⚠️ **Quan trọng:** Thay đổi linh vật không ảnh hưởng lịch sử mood. Linh vật là display identifier — data analytics vẫn liên kết theo `student_id`.

---

## 3. Teacher Dashboard Flow

### 3.1 Dashboard chính (sau login)

```
┌─────────────────────────────────────────────────┐
│  ClassPulse          Cô Hương 👩‍🏫  [Đăng xuất]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  📚 Lớp của tôi                                 │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ Lớp 3A           │  │ Lớp 3B           │    │
│  │ 35 học sinh      │  │ 32 học sinh      │    │
│  │ 🟢 30  🟡 3  🔴 2│  │ 🟢 28  🟡 4  🔴 0│    │
│  │ [Mở lớp]         │  │ [Mở lớp]         │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                 │
│  [+ Tạo lớp mới]                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3.2 Chi tiết lớp

```
┌─────────────────────────────────────────────────┐
│  ← Lớp 3A                     [⚙️] [📤 Report]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Tổng quan hôm nay:                          │
│  Điểm danh: 33/35 (94%)                          │
│  🟢 28  │  🟡 4  │  🔴 3                        │
│                                                 │
│  ─────── Cần chú ý ───────                     │
│                                                 │
│  🔴 🦊 Minh An                                  │
│     "Mood giảm 3 ngày liên tiếp"               │
│     [Xem chi tiết →]                            │
│                                                 │
│  🔴 🐰 Thu Bình                                 │
│     "Không điểm danh 3 ngày"                   │
│     [Xem chi tiết →]                            │
│                                                 │
│  🟡 🐻 Hoàng Cúc                                │
│     "Mood giảm đột ngột hôm nay"              │
│     [Xem chi tiết →]                            │
│                                                 │
│  ─────── Bình thường ───────                    │
│                                                 │
│  🟢 🐼 Minh Duy                                 │
│  🟢 🐨 Thanh Em                                 │
│  🟢 🦁 Tuấn Giang                              │
│  ...                                           │
│                                                 │
│  [▶️ Bắt đầu điểm danh]                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3.3 Chi tiết học sinh (khi click)

```
┌─────────────────────────────────────────────────┐
│  ← Lớp 3A          🦊 Minh An                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  📅 7 ngày gần nhất:                            │
│                                                 │
│  T2    T3    T4    T5    T6    T7    CN         │
│  😊    😊    😐    😐    🙁    🙁    --         │
│                                                 │
│  ⚠️ Cảnh báo:                                   │
│  • Mood giảm dần 4 ngày (Rule: downward_trend) │
│  • Chọn 🙁 2 ngày liên tiếp (Rule: repeated)  │
│                                                 │
│  👁️ Quan sát của bạn:                           │
│  [🟢 Bình thường] [🟡 Hơi khác] [🔴 Cần chú ý] │
│                                                 │
│  📝 Ghi chú (optional):                         │
│  ┌─────────────────────────────────────────┐    │
│  │ Hay ngồi một mình giờ ra chơi...       │    │
│  └─────────────────────────────────────────┘    │
│  [Lưu]                                         │
│                                                 │
│  📧 Email phụ huynh: an.nguyen@gmail.com        │
│  [✓ Đã nhận report tuần]                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**💡 Gợi ý hành động (hiển thị trong Student Detail dashboard):**

Ngay bên dưới phần cảnh báo flag, hệ thống hiển thị gợi ý hành động tương ứng với mức severity:

| Mức flag | Gợi ý hiển thị trong dashboard |
|---|---|
| 🟡 Severity 1 — Nhẹ | *"Quan sát thêm em trong lớp — chú ý sự tham gia và tương tác với bạn bè"* |
| 🟠 Severity 2 — Trung bình | *"Cân nhắc trò chuyện nhẹ nhàng, tự nhiên với em trong giờ ra chơi"* |
| 🔴 Severity 3 — Mạnh | *"Nên dành thời gian trò chuyện riêng với em — có thể liên hệ phụ huynh nếu cần"* |

> ⚠️ Đây là **gợi ý**, không phải chỉ thị. GV hành động tự nhiên, không đề cập hệ thống với học sinh.

→ Xem hướng dẫn đầy đủ: [Teacher Action Guidelines](./08-teacher-action-guidelines.md)

---

### 3.4 Teacher Observation (Mark nhanh)

- Từ danh sách lớp, GV có thể **tap nhanh** vào bất kỳ HS nào
- Popup nhỏ: 3 nút `[🟢] [🟡] [🔴]` + ô ghi chú (optional)
- Nguyên tắc: **không bắt buộc**, chỉ dùng khi GV **chủ động thấy** điều gì đó
- ≤ 20 giây / interaction

---

## 4. Tạo lớp Flow (Teacher)

### 4.1 Bước 1: Thông tin cơ bản
```
Tên lớp: [Lớp 3A        ]
Trường:   [Tiểu học ABC   ] (optional)
Khối:     [3 ▼]
```

### 4.2 Bước 2: Nhập danh sách HS
```
Dán danh sách học sinh (mỗi dòng 1 tên):

┌─────────────────────────────────────────┐
│ Nguyễn Minh An                          │
│ Trần Thu Bình                           │
│ Lê Hoàng Cúc                            │
│ Phạm Minh Duy                           │
│ ...                                     │
└─────────────────────────────────────────┘

Đã nhận: 35 học sinh
STT sẽ theo thứ tự bạn nhập.
[Tiếp tục →]
```

### 4.2b Bước 2 (Cách B): Upload file Excel

> GV cũng có thể tải template Excel về, điền offline rồi upload. Kết quả giống hệt Cách A (paste tay).

**Cấu trúc file template Excel:**

| Cột | Tên cột | Bắt buộc | Mô tả |
|---|---|---|---|
| A | Họ và tên | ✅ | Tên đầy đủ học sinh |
| B | Email phụ huynh | ❌ | Để gửi weekly report |

- Hàng 1: Header (không xóa)
- Dữ liệu từ hàng 2 trở đi
- STT tự động theo thứ tự hàng

**Flow upload:**
1. **[📥 Tải template Excel mẫu]** — download file `.xlsx` chuẩn
2. Điền thông tin học sinh (mỗi hàng = 1 bé)
3. **[⬆️ Upload file]** — chấp nhận `.xlsx` và `.csv`
4. Hệ thống parse → hiện preview để xác nhận:

```
✅ Đã đọc được 35 học sinh:
  1. Nguyễn Minh An
  2. Trần Thu Bình
  3. Lê Hoàng Cúc
  ...
[Xem đầy đủ ▼]

[← Đổi file]        [Xác nhận & tiếp tục →]
```

**Xử lý lỗi khi parse:**
- Dòng thiếu tên → bỏ qua + cảnh báo: *"Dòng X không có tên, đã bỏ qua"*
- Email sai format → giữ bé, bỏ email + cảnh báo nhẹ
- File quá lớn (> 200 bé) → cho phép nhưng hiển thị cảnh báo hiệu năng
- File sai format → hướng dẫn download lại template

---

### 4.3 Bước 3: Xác nhận
```
✅ Lớp 3A - 35 học sinh
Mã điểm danh: AB12CD
Link: classpulse.app/c/AB12CD

[Bắt đầu chọn linh vật 🎉]
```

### 4.4 Bước 4: Chọn linh vật (avatar selection flow ở trên)

### 4.5 Bổ sung email PH (optional, có thể làm sau)
```
Thêm email phụ huynh (không bắt buộc):

🦊 Minh An:    [an.parent@gmail.com    ]
🐰 Thu Bình:   [binh.parent@gmail.com  ]
🐻 Hoàng Cúc:  [                        ]
...

[Lưu] [Bỏ qua, thêm sau]
```

---

## 5. Parent Report Flow

### 5.1 Email nhận được (weekly)

```
Subject: ClassPulse - Báo cáo tuần của An (Lớp 3A)

─────────────────────────────────────────
Xin chào ba/mẹ của Minh An,

Tuần vừa qua (16/06 - 20/06), bé có:
  🙂 3 ngày vui
  😐 1 ngày bình thường
  🙁 1 ngày hơi buồn

👉 Gợi ý: Dành thời gian trò chuyện nhẹ
   với bé về trường lớp nhé!

[Xem chi tiết →]
─────────────────────────────────────────
```

### 5.2 Trang report (link không cần login)

```
┌─────────────────────────────────────────────────┐
│  ClassPulse 💛                                   │
│                                                 │
│  Báo cáo tuần của 🦊 Minh An                    │
│  Lớp 3A • Tuần 16/06 - 20/06                   │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  T2   T3   T4   T5   T6                │    │
│  │  😊   😊   😐   😊   🙁                │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Tóm tắt:                                      │
│  • 🙂 Vui: 3 ngày                              │
│  • 😐 Bình thường: 1 ngày                      │
│  • 🙁 Hơi buồn: 1 ngày                        │
│                                                 │
│  💛 Gợi ý cho ba mẹ:                           │
│  "Dành vài phút hỏi bé về ngày thứ Sáu        │
│   ở trường nhé — chỉ cần lắng nghe thôi!"     │
│                                                 │
│  ⚠️ Lưu ý: Đây chỉ là tín hiệu tham khảo,     │
│  không phải đánh giá tâm lý.                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Lưu ý ngôn từ:**
- ❌ KHÔNG dùng: "cảnh báo", "nguy hiểm", "bất thường", "trầm cảm"
- ✅ Dùng: "gợi ý", "hơi buồn", "dành thời gian", "trò chuyện nhẹ"
- Link có **token bí mật** + **hết hạn 7 ngày**

---

## 6. Classroom Flow — Thực tế trong lớp

### Quy trình chuẩn (2-3 phút cuối giờ):

```
1. GV: "Đến giờ điểm danh cảm xúc rồi nhé!"
2. GV mở app → bấm "Bắt đầu điểm danh"
3. Đưa máy cho bé bàn đầu
4. Bé: tìm thẻ → tap → chọn mood → truyền bạn kế
5. Máy đi vòng quanh lớp
6. Bé cuối cùng trả máy cho GV
7. GV check: "33/35 đã xong!" → kết thúc
```

### Quy tắc lớp (GV hướng dẫn bé):
- 🤫 Không nói cho bạn mình chọn gì
- 👀 Không nhìn bạn đang chọn
- ⚡ Chọn nhanh, truyền nhanh
- 💛 Chọn gì cũng được, không có đúng sai

---

## 7. Responsive Design Notes

| Thiết bị | Ưu tiên layout | Ghi chú |
|---|---|---|
| Phone (student) | **Full screen**, 1 hành động/màn | Đây là primary device |
| Phone (teacher) | Compact dashboard, scroll dọc | Quick check |
| Tablet (classroom) | Grid 5 cột, thẻ to hơn | Truyền tay dễ hơn |
| Desktop (teacher) | Full dashboard, sidebar | Quản lý lớp ở nhà |
