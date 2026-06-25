# 📅 ClassPulse — MVP Plan & Roadmap

---

## 1. MVP Definition

### Thời gian: 2–3 tuần
### Mục tiêu: Demo được end-to-end flow cho 1 lớp tiểu học

---

## 2. Sprint Breakdown

### 🏃 Sprint 1 — Foundation (Ngày 1–5)

| # | Task | Priority | Estimate |
|---|---|---|---|
| 1.1 | Setup project (Next.js + Supabase + Tailwind + Vercel) | P0 | 0.5 ngày |
| 1.2 | Setup Supabase schema + migrations + seed avatars | P0 | 0.5 ngày |
| 1.3 | Auth flow (GV đăng ký + đăng nhập: email + Google) | P0 | 1 ngày |
| 1.4 | Tạo lớp + nhập danh sách HS (paste list) | P0 | 1 ngày |
| 1.4b | Excel template: download mẫu + upload + parse + preview | P1 | 0.5 ngày |
| 1.5 | Generate class code + QR/link | P0 | 0.5 ngày |
| 1.6 | Avatar selection flow (session, 2 modes, handle bé vắng, edge cases) | P0 | 1.5 ngày |

**Deliverable Sprint 1:** GV có thể đăng ký, tạo lớp, nhập HS, bé chọn linh vật.

---

### 🏃 Sprint 2 — Core Điểm danh cảm xúc (Ngày 6–10)

| # | Task | Priority | Estimate |
|---|---|---|---|
| 2.1 | Màn điểm danh cảm xúc: lưới linh vật | P0 | 1 ngày |
| 2.2 | Mood selection screen (3 emoji, animation) | P0 | 1.5 ngày |
| 2.3 | Celebration screen (confetti, streak) | P0 | 1 ngày |
| 2.4 | API: save mood log + update streak | P0 | 0.5 ngày |
| 2.5 | Anti-bias: random emoji position | P0 | 0.5 ngày |
| 2.6 | Undo flow: countdown bar 3s + nút "↩ Đổi lại" → quay về Màn 3 chọn lại | P0 | 0.5 ngày |

**Deliverable Sprint 2:** Bé có thể điểm danh cảm xúc hằng ngày, trải nghiệm mượt.

---

### 🏃 Sprint 3 — Teacher Dashboard + Rules (Ngày 11–17)

| # | Task | Priority | Estimate |
|---|---|---|---|
| 3.1 | Teacher dashboard: danh sách lớp + tổng quan | P0 | 1 ngày |
| 3.2 | Class detail: danh sách HS + status flag | P0 | 1.5 ngày |
| 3.3 | Student detail: lịch sử 7 ngày + flag reasons | P0 | 1 ngày |
| 3.4 | Rule engine: implement 6 rules (5 gốc + Rule 6: skip_pattern) | P0 | 2 ngày |
| 3.5 | Teacher observation: mark 🟢🟡🔴 + note | P1 | 1 ngày |
| 3.6 | Flag display + resolve flow | P1 | 0.5 ngày |
| 3.7 | Teacher action guidelines: hiển thị gợi ý hành động theo cấp flag trong dashboard | P1 | 0.5 ngày |

**Deliverable Sprint 3:** GV thấy trạng thái lớp, flag tự động, lịch sử từng bé.

---

### 🏃 Sprint 4 — Parent Report + Polish (Ngày 18–21)

| # | Task | Priority | Estimate |
|---|---|---|---|
| 4.1 | Weekly report generation (cron) | P1 | 1 ngày |
| 4.2 | Parent report page (link + token) | P1 | 1 ngày |
| 4.3 | Email gửi PH via Resend | P1 | 0.5 ngày |
| 4.4 | Nhập email PH cho từng HS | P1 | 0.5 ngày |
| 4.5 | Polish UI: responsive, animation tuning | P1 | 1 ngày |
| 4.8 | Disclaimer text + xóa lớp (Privacy by Design) | P0 | 0.5 ngày |
| 4.6 | Testing + bug fix | P0 | 1 ngày |
| 4.7 | Deploy production (Vercel + domain) | P0 | 0.5 ngày |

**Deliverable Sprint 4:** End-to-end hoàn chỉnh, PH nhận report, deploy live.

---

## 3. Feature Priority Matrix

| Feature | Priority | Sprint | Status |
|---|---|---|---|
| Project setup | P0 | 1 | ⬜ |
| Supabase schema + seed | P0 | 1 | ⬜ |
| GV Auth (email + Google) | P0 | 1 | ⬜ |
| Tạo lớp + paste list | P0 | 1 | ⬜ |
| Excel template upload | P1 | 1 | ⬜ |
| Avatar selection (session + edge cases) | P0 | 1 | ⬜ |
| Điểm danh cảm xúc (core) | P0 | 2 | ⬜ |
| Mood screen + animation | P0 | 2 | ⬜ |
| Celebration + streak | P0 | 2 | ⬜ |
| Undo flow (countdown bar 3s) | P0 | 2 | ⬜ |
| Teacher dashboard | P0 | 3 | ⬜ |
| Rule engine (6 rules, bao gồm skip_pattern) | P0 | 3 | ⬜ |
| Student detail view | P0 | 3 | ⬜ |
| Teacher action guidelines display | P1 | 3 | ⬜ |
| Teacher observation | P1 | 3 | ⬜ |
| Weekly report (cron) | P1 | 4 | ⬜ |
| Parent report page | P1 | 4 | ⬜ |
| Email PH (Resend) | P1 | 4 | ⬜ |
| Polish + deploy | P0 | 4 | ⬜ |

---

## 4. Technical Milestones

```
Week 1: "Skeleton works"
├── Repo live trên Vercel
├── Supabase connected
├── Auth working
├── Tạo lớp + HS successfully
└── Avatar selection functional

Week 2: "Core loop complete"
├── Điểm danh cảm xúc end-to-end
├── Mood data flowing to DB
├── Dashboard shows real data
├── Rules triggering correctly
└── Flags appearing on dashboard

Week 3: "Ship it"
├── Parent reports generated
├── Email sent
├── UI polished (mobile-first)
├── Responsive tested
└── Production deploy + custom domain
```

---

## 5. Phase 2 (Sau MVP — tháng 2-3)

| Feature | Mô tả |
|---|---|
| Offline support | Service worker, queue local |
| Sticker book / Vườn | Gamification sâu hơn |
| Sound effects | Âm thanh nhẹ khi điểm danh |
| Analytics GV | Biểu đồ xu hướng lớp theo tuần/tháng |
| Multi-class view | GV dạy nhiều lớp → tổng quan nhanh |
| Zalo integration | Gửi report qua Zalo OA |
| THCS/THPT theme | UI tối giản hơn, avatar → tên/số |
| School admin | Portal cho BGH xem tổng thể |
| Export data | CSV/PDF cho báo cáo |
| Realtime dashboard | Supabase Realtime — thấy điểm danh cảm xúc live |
| **Class lifecycle** | Archive cuối năm, chuyển lớp, GV nghỉ dạy → data đi theo ai |
| **Onboarding kit** | Script mẫu cho GV giải thích với HS + PH; guide tuần đầu tiên |

---

## 6. Acceptance Criteria (MVP Done = khi nào?)

### ✅ MVP hoàn thành khi:

1. **GV** có thể: đăng ký → tạo lớp → nhập HS → cho bé chọn linh vật
2. **HS** (truyền tay) có thể: tìm thẻ → chọn mood → thấy celebration → truyền tiếp
3. **GV** có thể: xem dashboard → thấy flag → xem chi tiết → mark observation
4. **Rule engine** chạy đúng 5 rule với test scenarios
5. **PH** nhận email tuần + xem report qua link
6. **Deploy** live trên Vercel, truy cập được từ phone
7. **Responsive** hoạt động tốt trên phone (360px+)
8. **Disclaimer** hiển thị trên mọi màn GV; GV có thể xóa lớp → xóa sạch dữ liệu liên quan

---

## 7. Risks & Mitigations (MVP Phase)

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Animation phức tạp tốn thời gian | Cao | Trung bình | Dùng Framer Motion presets, giữ simple |
| 50 SVG linh vật cần thiết kế | Cao | Cao | **Dùng emoji to + màu nền** cho MVP, custom SVG ở phase 2 |
| Supabase free tier giới hạn | Thấp | Thấp | MVP nhỏ, đủ dùng; upgrade khi cần |
| Email deliverability | Trung bình | Trung bình | Dùng Resend (reputation tốt), verify domain |

### 🎯 Quyết định quan trọng về linh vật (MVP):
> **MVP sẽ dùng EMOJI LỚN + MÀU NỀN** thay vì custom SVG illustration.
> Lý do: tiết kiệm 3-5 ngày design, vẫn đảm bảo UX cute & nhận diện được.
> Custom SVG illustration → Phase 2 khi có designer.

---

## 8. Definition of Done (per task)

Mỗi task được coi là "Done" khi:
- [ ] Code reviewed (nếu làm team)
- [ ] Responsive trên mobile (360px)
- [ ] Tiếng Việt đúng chính tả
- [ ] Không console error
- [ ] Data flow đúng (DB insert/read thành công)
- [ ] Edge cases handled (empty state, error state)
