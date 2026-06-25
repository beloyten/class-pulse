# 🎨 ClassPulse — Design System

---

## 1. Brand Identity

| Attribute | Value |
|---|---|
| **Tên** | ClassPulse |
| **Tagline** | "Lắng nghe lớp học mỗi ngày" |
| **Tính cách** | Ấm áp, an toàn, vui nhộn, đáng tin |
| **Không được** | Lạnh lùng, lâm sàng, phán xét, đáng sợ |

---

## 2. Color Palette

### Primary Colors
```
--primary:       #6C63FF   (Indigo — đáng tin, sáng tạo)
--primary-light: #A29BFE   (Hover, background nhẹ)
--primary-dark:  #4A42D4   (Active state)
```

### Mood Colors (CRITICAL — phải trung tính, không phán xét)
```
--mood-happy:    #FFD93D   (Vàng ấm — vui, nhưng KHÔNG quá nổi bật)
--mood-neutral:  #74B9FF   (Xanh dương nhạt — bình yên, calm)
--mood-sad:      #A29BFE   (Tím nhạt — nhẹ nhàng, KHÔNG buồn/dark)
```

> ⚠️ **NGUYÊN TẮC:** Mood 🙁 (sad) **TUYỆT ĐỐI KHÔNG** dùng màu đỏ, đen, xám đậm.
> Phải dùng màu **dễ thương, nhẹ nhàng** để bé không sợ chọn.

### Status Colors (chỉ GV thấy)
```
--status-green:  #00B894   (Bình thường)
--status-yellow: #FDCB6E   (Cần để ý)
--status-red:    #E17055   (Cần quan tâm — KHÔNG dùng đỏ đậm aggressive)
```

### Background & Neutral
```
--bg-primary:    #FAFBFF   (Nền chính — trắng ấm)
--bg-secondary:  #F0F3FF   (Nền phụ — tím rất nhạt)
--bg-card:       #FFFFFF   (Nền card)
--text-primary:  #2D3436   (Text chính)
--text-secondary:#636E72   (Text phụ)
--text-muted:    #B2BEC3   (Text mờ)
--border:        #E8ECF4   (Border nhẹ)
```

### Avatar Background Colors (50 màu, mỗi linh vật 1 màu)
```
Yêu cầu: 50 màu khác biệt rõ ràng, pastel/saturated vừa phải
Mỗi linh vật có 1 màu nền riêng (xem data-model.md)
```

---

## 3. Typography

### Font Stack
```css
--font-display: 'Nunito', sans-serif;    /* Headings, số lớn — tròn, friendly */
--font-body: 'Inter', sans-serif;         /* Body text — rõ ràng, dễ đọc */
```

### Scale
| Use | Size | Weight | Font |
|---|---|---|---|
| Heading 1 (tên lớp, tiêu đề) | 28-32px | 700 (Bold) | Nunito |
| Heading 2 (section) | 22-24px | 600 (SemiBold) | Nunito |
| Student name (on card) | 16-18px | 600 | Nunito |
| Body text | 14-16px | 400 | Inter |
| Small/caption | 12-13px | 400 | Inter |
| Emoji (mood select) | 64-80px | - | System emoji |
| Emoji (card avatar) | 48-56px | - | System emoji |

> 📌 **Tiểu học rule:** Minimum font size cho bé đọc = **16px**. Không có text nhỏ hơn 14px trên student-facing screens.

---

## 4. Spacing & Layout

### Grid System
```
Container: max-width 420px (mobile), 768px (tablet), 1200px (desktop)
Padding: 16px (mobile), 24px (tablet), 32px (desktop)
Card gap: 12px (mobile), 16px (tablet)
```

### Avatar Card Dimensions
```
Mobile (4 col): 76 x 96 px per card
Tablet (5 col): 100 x 120 px per card
Desktop (6 col): 120 x 140 px per card
```

### Touch Target
```
Minimum tap area: 48 x 48 px (Google Material guideline)
Emoji mood button: 80 x 80 px (extra large for kids)
Avatar card: full card is tappable
```

---

## 5. Linh vật System (50 Avatars)

### MVP Approach: Emoji + Colored Background
Vì MVP không có custom illustration, mỗi linh vật = **emoji lớn trên nền tròn có màu**.

```
┌────────────────┐
│   ┌────────┐   │
│   │  🦊    │   │  ← Emoji 48-56px
│   │        │   │     trên nền tròn (#FF6B35)
│   └────────┘   │
│    Minh An     │  ← Tên 16px, Nunito SemiBold
└────────────────┘
     Card nền trắng, border-radius 16px
     Shadow nhẹ
```

### Phase 2: Custom SVG Illustration
- Style: Flat, rounded, friendly (kiểu Duolingo/Headspace)
- Mỗi con vật: 3 poses (idle, wave, celebrate)
- Format: SVG animated (Lottie hoặc CSS animation)

### Danh sách 50 linh vật (xem chi tiết trong `03-data-model.md`)

**Phân loại:**
| Category | Số lượng | Ví dụ |
|---|---|---|
| Mammal (động vật có vú) | 25 | Cáo, Thỏ, Gấu, Mèo, Chó... |
| Bird (chim) | 10 | Cú, Vẹt, Chim cánh cụt, Gà con... |
| Sea (biển) | 10 | Cá heo, Bạch tuộc, Rùa, Cá voi... |
| Insect (côn trùng) | 5 | Bướm, Ong, Bọ rùa, Kiến, Ốc sên |

---

## 6. Animation Guidelines

### 6.1 Student-facing Animations

| Nơi | Animation | Duration | Library |
|---|---|---|---|
| Avatar card (idle) | Bounce nhẹ, stagger | 2s loop | Framer Motion |
| Tap card | Scale up 1.05 → 1 | 200ms | Framer Motion |
| Mood emoji (idle) | Float up/down nhẹ | 3s loop | CSS keyframe |
| Tap mood | Scale 1 → 1.3 → 1 + particles | 400ms | Framer Motion |
| Celebration confetti | Burst from center | 2s | canvas-confetti |
| Streak badge | Slide in from bottom | 500ms | Framer Motion |
| Avatar wave (welcome) | Rotate ±10deg | 1s x2 | CSS keyframe |
| Card done (fade) | Opacity 1 → 0.4 + checkmark | 300ms | Framer Motion |

### 6.2 Teacher-facing Animations
- Minimal — không cần flashy
- Page transitions: fade 200ms
- Flag highlight: subtle pulse glow
- Number count up: spring animation

### 6.3 Performance Rules
- Không animation trên list > 20 items (chỉ animate visible)
- `will-change` chỉ trên animated elements
- Prefer CSS animation cho loop, Framer Motion cho gesture
- `prefers-reduced-motion`: tắt hết animation

---

## 7. Celebration System (CRITICAL DESIGN)

### Nguyên tắc vàng:
> **Mọi celebration GIỐNG NHAU cho mọi mood. Không có mood nào "thưởng" nhiều hơn.**

### Celebration elements:
| Element | Mô tả | Mood 😊 | Mood 😐 | Mood 🙁 |
|---|---|---|---|---|
| Confetti | Hạt bay | ✅ | ✅ | ✅ (nhẹ hơn, mềm hơn) |
| Avatar reaction | Nhảy/vẫy | Nhảy vui | Gật đầu | Ôm ♥ |
| Text | Lời chào | "Tuyệt vời!" | "Cảm ơn nhé!" | "Không sao, cảm ơn bạn 💛" |
| Streak | Hiện số ngày | ✅ | ✅ | ✅ |
| Sound | Effect | ✅ ting! | ✅ ting! | ✅ ting! (cùng sound) |

### Text variations cho mood 🙁 (rotate mỗi ngày):
```
"Hôm nay hơi buồn cũng không sao, cảm ơn bạn đã chia sẻ nhé 💛"
"Ai cũng có ngày không vui, cảm ơn bạn nhé ✨"
"Cảm ơn bạn đã thật với mình hôm nay 💛"
"Ngày mai sẽ khác, hẹn gặp lại nhé 🌈"
```

---

## 8. Component Library (Key Components)

### Student-facing:
```
<AvatarCard>          — Thẻ linh vật (emoji + tên + màu)
<AvatarGrid>          — Lưới thẻ linh vật
<MoodSelector>        — 3 emoji chọn mood
<CelebrationScreen>   — Confetti + streak + lời chào
<StreakBadge>          — Badge hiện số ngày liên tiếp
<WelcomeScreen>       — Chào đón bé (avatar wave + tên)
```

### Teacher-facing:
```
<ClassCard>           — Card lớp học (tên + stats)
<StudentList>         — Danh sách HS + status
<StudentDetail>       — Chi tiết 1 HS (history + flags)
<MoodHistory>         — Biểu đồ 7 ngày
<FlagBadge>           — Badge cảnh báo (🟡🟠🔴)
<ObservationInput>    — Input mark + note
<CreateClassWizard>   — Wizard tạo lớp (multi-step)
```

### Shared:
```
<Button>              — Primary, secondary, ghost
<Card>                — Rounded, shadow
<Modal>               — Bottom sheet (mobile) / center (desktop)
<Toast>               — Notification nhẹ
<LoadingSpinner>      — Skeleton hoặc spinner cute
```

---

## 9. Iconography

- Style: Rounded, filled, 24px default
- Library: **Lucide React** (MIT, consistent, rounded style)
- Custom: Chỉ cần cho streak fire 🔥 và mood emojis

---

## 10. Responsive Breakpoints

```css
/* Mobile first */
sm: 640px    /* Large phone */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
```

### Layout rules:
| Screen | Student view | Teacher view |
|---|---|---|
| < 640px | Full screen, 4 col grid | Single column, compact |
| 640-768px | Full screen, 5 col grid | Single column, more info |
| 768-1024px | Full screen, 5 col grid | Two column (list + detail) |
| > 1024px | Center max-420px | Sidebar + main content |

---

## 11. Accessibility

| Concern | Solution |
|---|---|
| Color contrast | WCAG AA minimum (4.5:1 text, 3:1 UI) |
| Touch target | ≥ 48px (kids: ≥ 64px for primary actions) |
| Font size | ≥ 16px on student screens |
| Reduced motion | Respect `prefers-reduced-motion` |
| Screen reader | aria-labels cho emoji (role="img" aria-label="Vui") |

---

## 12. Dark Mode

> **MVP: KHÔNG làm dark mode.**
> Lý do: Tiểu học dùng trong lớp ban ngày, không cần. Phase 2 nếu cần.

---

## 13. Emotional Design Principles

1. **Safe space:** Mọi interaction đều ấm áp, không có "sai"
2. **No judgment:** 🙁 không bao giờ bị "phạt" hay "kém hơn" 😊
3. **Ownership:** "Linh vật CỦA CON" → gắn bó
4. **Ritual:** Điểm danh cảm xúc = thói quen vui, không phải bài tập
5. **Brevity:** Tối đa 3-5 giây attention span (tiểu học)
6. **Delight:** Mỗi interaction có 1 "surprise nhỏ" (confetti, lời khác mỗi ngày)
