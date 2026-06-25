# 📊 ClassPulse — Progress Tracker

> Cập nhật lần cuối: 2026-06-25

---

## 🎯 Tổng quan dự án

| Attribute | Value |
|---|---|
| **Tên sản phẩm** | ClassPulse |
| **Mục tiêu** | MVP hoàn chỉnh, deploy Vercel |
| **Timeline** | 2–3 tuần |
| **Ngày bắt đầu** | 2026-06-24 |
| **Ngày mục tiêu hoàn thành** | 2026-07-15 |

---

## 📋 Tiến độ tổng thể

```
Phase 1: Documentation    [████████████████████] 100% ✅
Phase 2: Foundation       [████████████████████] 100% ✅
Phase 3: Core Check-in    [████████████████████] 100% ✅
Phase 4: Teacher Dashboard[████████████████████] 100% ✅
Phase 5: Parent Report    [████████████████████] 100% ✅
Phase 6: Polish & Deploy  [██████████████████░░]  90% 🔄
```

---

## ✅ Phase 1: Documentation (DONE)

| # | Task | Status | Note |
|---|---|---|---|
| 1 | Product Brief (PRD) | ✅ Done | `docs/01-product-brief.md` |
| 2 | Architecture | ✅ Done | `docs/02-architecture.md` |
| 3 | Data Model | ✅ Done | `docs/03-data-model.md` |
| 4 | Rule Engine Spec | ✅ Done | `docs/04-rule-engine.md` |
| 5 | UX Flows | ✅ Done | `docs/05-ux-flows.md` |
| 6 | MVP Plan | ✅ Done | `docs/06-mvp-plan.md` |
| 7 | Design System | ✅ Done | `docs/07-design-system.md` |
| 8 | Teacher Action Guidelines | ✅ Done | `docs/08-teacher-action-guidelines.md` |

---

## ✅ Phase 2: Foundation (Sprint 1) — DONE

| # | Task | Status | Note |
|---|---|---|---|
| 2.1 | Setup Next.js 15 + TypeScript strict + TailwindCSS 4 | ✅ Done | pnpm + node-linker=hoisted (Windows fix) |
| 2.2 | Setup Supabase client/server/middleware helpers | ✅ Done | @supabase/ssr, createServiceClient |
| 2.3 | DB schema + migrations | ✅ Done | `supabase/migrations/001_initial_schema.sql` + RLS |
| 2.4 | Seed 50 avatars | ✅ Done | `supabase/seed.sql` |
| 2.5 | Auth flow (email + Google OAuth) | ✅ Done | login, register, /auth/callback |
| 2.6 | Create class + paste student list | ✅ Done | CreateClassWizard (3 steps) |
| 2.7 | Generate class code | ✅ Done | `classCode.ts` — no 0/O/I/1 chars |
| 2.8 | Avatar selection flow | ✅ Done | AvatarSelectionSession (2 modes), wired to `/class/[id]?new=1` |
| 2.9 | Excel template: download + upload + parse + preview | ✅ Done | `excelParser.ts`, error surfaced in UI |

---

## ✅ Phase 3: Core Điểm danh cảm xúc (Sprint 2) — DONE

| # | Task | Status | Note |
|---|---|---|---|
| 3.1 | Avatar grid screen | ✅ Done | `AvatarGrid.tsx` — stagger bounce, done state dimmed |
| 3.2 | Welcome screen (avatar wave) | ✅ Done | `WelcomeScreen.tsx` — 1.5s auto-advance, tap to skip |
| 3.3 | Màn chọn mood | ✅ Done | `MoodSelector.tsx` — deterministic daily shuffle (anti-bias), skip button nhỏ |
| 3.4 | Celebration screen + confetti | ✅ Done | `CelebrationScreen.tsx` — 90 particles happy / 40 sad / none skip |
| 3.5 | Streak tracking + display | ✅ Done | gap ≤ 3 ngày = ok (Fri→Mon giữ streak) |
| 3.6 | Random emoji position | ✅ Done | Hash seed = date → deterministic per day |
| 3.7 | Undo flow | ✅ Done | Countdown bar 3s, "↩ Đổi lại" → về Màn 3 |
| 3.8 | API: save mood + update streak | ✅ Done | `POST /api/checkin` — upsert, service role |

---

## ✅ Phase 4: Teacher Dashboard (Sprint 3) — DONE

| # | Task | Status | Note |
|---|---|---|---|
| 4.1 | Dashboard: class list + overview | ✅ Done | `/dashboard`, ClassWithStats (red/yellow/green counts) |
| 4.2 | Class detail: student list sorted by status | ✅ Done | `/class/[id]` — 🔴🟡🟢 grouped, checkin progress bar |
| 4.3 | Student detail sheet | ✅ Done | Bottom sheet — 7-day history, flags, action suggestion |
| 4.4 | Rule engine: sudden_change | ✅ Done | `src/lib/rules/sudden-change.ts` |
| 4.5 | Rule engine: downward_trend | ✅ Done | Linear regression slope |
| 4.6 | Rule engine: repeated_negative | ✅ Done | Consecutive count |
| 4.7 | Rule engine: silent_risk | ✅ Done | School days missing |
| 4.8 | Rule engine: mixed_signal | ✅ Done | Teacher signal + student mood correlation |
| 4.9 | Rule engine: skip_pattern | ✅ Done | Skip count last 5 days |
| 4.10 | Rule combine + overall status | ✅ Done | `src/lib/rules/index.ts` — severity escalation |
| 4.11 | Teacher observation mark | ✅ Done | `POST /api/observations`, StudentDetail sheet |
| 4.12 | Flag resolve flow | ✅ Done | `PATCH /api/flags/[id]` — set is_active=false |
| 4.13 | Action suggestion by flag severity | ✅ Done | StudentDetail — 3 levels of gợi ý |

---

## ✅ Phase 5: Parent Report (Sprint 4) — DONE

| # | Task | Status | Note |
|---|---|---|---|
| 5.1 | Weekly report cron job | ✅ Done | `POST /api/cron/weekly-report` — Monday 08:00 UTC+7 |
| 5.2 | Report page (public, token-based) | ✅ Done | `/report/[token]` — 30-day expiry |
| 5.3 | Resend email integration | ✅ Done | `src/lib/email/weeklyReportHtml.ts` |
| 5.4 | Parent email stored in student record | ✅ Done | Nhập khi tạo lớp (paste/Excel) |
| 5.5 | Email template design | ✅ Done | Inline-style HTML, 7-day circles, warm message |
| 5.6 | DB migration: UNIQUE constraint | ✅ Done | `supabase/migrations/002_weekly_report_unique.sql` |
| 5.7 | Vercel Cron config | ✅ Done | `vercel.json` — `"0 1 * * 1"` |

---

## 🔄 Phase 6: Polish & Deploy (Sprint 5) — IN PROGRESS

| # | Task | Status | Note |
|---|---|---|---|
| 6.1 | Error page (error.tsx) | ✅ Done | Branded, "Thử lại" + về trang chủ |
| 6.2 | 404 page (not-found.tsx) | ✅ Done | Branded |
| 6.3 | Settings page | ✅ Done | `/settings` — update display name |
| 6.4 | Responsive polish | ✅ Done | Touch targets ≥44px, grid breakpoints, email truncate, iOS-safe inputs |
| 6.5 | Loading states (skeleton/spinner) | ✅ Done | loading.tsx for dashboard, class detail, report |
| 6.6 | Edge case states | ✅ Done | Empty class improved, dashboard empty state |
| 6.7 | SEO + meta tags | ✅ Done | Title template + openGraph + per-page titles |
| 6.8 | Dashboard real flag counts | ✅ Done | Fixed hardcoded zeros — now queries DB |
| 6.9 | Visual progress bar in class detail | ✅ Done | Green when 100%, purple otherwise |
| 6.10 | Bug fixes + final review | ✅ Done | Stale closure, undo race, stagger modulo, rule redundancy |
| 6.11 | Vercel production deploy | ⬜ Todo | Cần Supabase keys + Resend key — xem docs/deploy.md |
| 6.12 | Custom domain setup | ⬜ Todo | Sau deploy |
| 6.13 | Final testing (smoke test each flow) | ⬜ Todo | |

---

## 🐛 Known Issues / Resolved Bugs

| # | Issue | Severity | Status | Resolution |
|---|---|---|---|---|
| 1 | pnpm ERR_PNPM_ENOENT (Windows) | Critical | ✅ Fixed | `node-linker=hoisted` in .npmrc |
| 2 | `mixed_signal` filter bug — tất cả signals lọt qua | High | ✅ Fixed | Simplified to `sort + slice(0, 3)` |
| 3 | `consecutiveNegative` đếm tổng, không đếm liên tiếp | High | ✅ Fixed | Loop + break |
| 4 | `yellowCount` double-count students nhiều flags | High | ✅ Fixed | Deduplicate by student_id, max severity |
| 5 | `MoodHistory` timezone UTC bug (getDay() sai ngày) | High | ✅ Fixed | `date + 'T12:00:00'` |
| 6 | Status route: 2 dead empty-array queries | Medium | ✅ Fixed | Removed, restructured to 2 batches |
| 7 | Dashboard HTTP fetch always 401 (empty cookies) | Medium | ✅ Fixed | Direct Supabase queries |
| 8 | `AvatarSelectionSession` not wired to class creation | High | ✅ Fixed | `/class/[id]?new=1` triggers setup overlay |
| 9 | Excel parse error silently swallowed | Medium | ✅ Fixed | try/catch, error displayed in UI |
| 10 | `checkin/route.ts` null dereference on cls | Medium | ✅ Fixed | Added null check |

---

## 📝 Decision Log

| Date | Decision | Reason |
|---|---|---|
| 2026-06-24 | Chọn tên **ClassPulse** | Thân thiện, "pulse" nhẹ nhàng, không lâm sàng |
| 2026-06-24 | Tech: Next.js 15 + Supabase + Resend | Full-stack 1 repo, free tier đủ MVP |
| 2026-06-24 | Deploy: Vercel | Zero-config, domain custom |
| 2026-06-24 | Định danh HS: **Linh vật + Tên** | Bé tiểu học nhớ tên + nhận diện visual |
| 2026-06-24 | MVP dùng **emoji to** thay SVG | Tiết kiệm thời gian design, vẫn cute |
| 2026-06-24 | Celebration **đồng nhất** mọi mood | Không bias data |
| 2026-06-24 | Auth: Email + Google (không OTP SMS) | Miễn phí, đủ dùng |
| 2026-06-24 | PH: Email + link (không account) | Đơn giản, không rào cản |
| 2026-06-24 | 50 linh vật **hệ thống thiết kế sẵn**, bé tự chọn | GV không phải nghĩ |
| 2026-06-24 | Target MVP: Tiểu học | Scale THCS/THPT/ĐH sau, chỉ đổi theme UI |
| 2026-06-24 | Undo flow = countdown bar 3s, quay về Màn 3 | Không về Màn 1 — giữ ngữ cảnh |
| 2026-06-24 | Streak: gap ≤ 3 ngày = ok | Thứ 6 → Thứ 2 giữ streak |
| 2026-06-25 | Vercel Cron thay vì pg_cron | Đơn giản hơn, không cần Supabase Pro |
| 2026-06-25 | Dashboard không gọi HTTP API từ server | Tránh auth issue cookie, direct DB query |

---

## 🔄 Changelog

| Date | Change |
|---|---|
| 2026-06-24 | Khởi tạo project, hoàn thành toàn bộ documentation |
| 2026-06-24 | **Naming:** "Điểm danh cảm xúc" trong UI, không dùng "Check-in" |
| 2026-06-24 | **Pháp lý:** MVP = BGH biết + disclaimer đơn giản |
| 2026-06-25 | Sprint 1: Foundation hoàn chỉnh — schema, auth, class wizard, avatars |
| 2026-06-25 | Sprint 2: Student check-in flow 4 screens hoàn chỉnh |
| 2026-06-25 | Sprint 3: Teacher dashboard + 6 rule engine + student detail sheet |
| 2026-06-25 | Sprint 4: Parent weekly report — cron, email, public report page |
| 2026-06-25 | Bug fixes: mixed_signal, consecutive count, yellow count, timezone, dead queries |
| 2026-06-25 | Sprint 5: loading skeletons, SEO metadata, dashboard real counts, responsive touch targets |
| 2026-06-25 | Final review fixes: stale closure in CheckinFlow, undo race guard, AvatarGrid stagger, rule redundancy |
| 2026-06-25 | Critical fixes: cron POST→GET, student_flags UNIQUE constraint, MoodSelector seed collision, double-tap guard, expired report data leak, since7 off-by-one |
| 2026-06-25 | Final fixes: CheckinPage self-fetch→direct query, DashboardClient stale state, page.tsx since7 aligned, Settings update by id, persistFlags accumulation+escalation, email HTML injection |
| 2026-06-25 | Avatar selection wired to class creation flow |
| 2026-06-25 | Settings page, error.tsx, not-found.tsx added |
