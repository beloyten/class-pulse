# 🏗️ ClassPulse — Kiến trúc hệ thống

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js App (App Router)                  │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  Student UI  │  │  Teacher UI   │  │  Parent UI  │  │  │
│  │  │ (điểm danh)  │  │  (dashboard)  │  │  (report)   │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │  │
│  │         │                  │                  │         │  │
│  │  ┌──────┴──────────────────┴──────────────────┴──────┐ │  │
│  │  │              API Routes (Server)                    │ │  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐  │ │  │
│  │  │  │ Điểm danh  │  │ Dashboard  │  │ Report Gen  │  │ │  │
│  │  │  │ Service    │  │ Service    │  │ Service     │  │ │  │
│  │  │  └────────────┘  └────────────┘  └─────────────┘  │ │  │
│  │  │                                                     │ │  │
│  │  │  ┌──────────────────────────────────────────────┐  │ │  │
│  │  │  │           Rule Engine (6 rules)               │  │ │  │
│  │  │  └──────────────────────────────────────────────┘  │ │  │
│  │  └────────────────────────┬───────────────────────────┘ │  │
│  └───────────────────────────┼─────────────────────────────┘  │
│                              │                                 │
└──────────────────────────────┼─────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────┴─────┐        ┌─────┴─────┐
              │ SUPABASE  │        │  RESEND   │
              │           │        │  (Email)  │
              │ • Postgres│        └───────────┘
              │ • Auth    │
              │ • Storage │
              └───────────┘
```

---

## 2. Tech Stack chi tiết

| Layer | Công nghệ | Version | Lý do chọn |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 15.x | Full-stack 1 repo, SSR + API routes |
| **Language** | TypeScript | 5.x | Type safety, DX tốt |
| **UI** | TailwindCSS | 4.x | Mobile-first, utility classes, nhanh |
| **Animation** | Framer Motion | 11.x | Smooth animation cho linh vật, emoji |
| **Icons/Illustrations** | Custom SVG | - | 50 linh vật thiết kế riêng |
| **Database** | Supabase (PostgreSQL) | - | Quan hệ, time-series, free tier đủ MVP |
| **Auth** | Supabase Auth | - | Email/pass + Google OAuth |
| **Realtime** | Supabase Realtime | - | Dashboard live update (phase 2) |
| **Cron** | Vercel Cron | - | Weekly report + daily flag recalc (Vercel Cron, không dùng Supabase pg_cron — logic gọi Resend API nên phù hợp hơn ở server runtime) |
| **Email** | Resend | - | Transactional email cho PH |
| **Deploy** | Vercel | - | Zero-config, edge, domain custom |
| **Package Manager** | pnpm | 9.x | Nhanh, disk-efficient |

---

## 3. Cấu trúc thư mục (Monorepo đơn giản)

```
classpulse/
├── docs/                          # Documentation (file này)
├── public/
│   └── avatars/                   # 50 SVG linh vật
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth pages (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (teacher)/             # Teacher routes (protected)
│   │   │   ├── dashboard/
│   │   │   ├── class/[id]/
│   │   │   └── settings/
│   │   ├── (student)/             # Màn điểm danh cảm xúc (public)
│   │   │   └── c/[classCode]/
│   │   ├── (parent)/              # Parent report view
│   │   │   └── report/[token]/
│   │   ├── api/                   # API routes
│   │   │   ├── checkin/
│   │   │   ├── classes/
│   │   │   ├── observations/
│   │   │   ├── reports/
│   │   │   └── cron/
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # Base UI components
│   │   ├── student/               # Điểm danh cảm xúc components
│   │   ├── teacher/               # Dashboard components
│   │   └── shared/                # Shared components
│   ├── lib/
│   │   ├── supabase/              # Supabase client & helpers
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── rules/                 # Rule engine
│   │   │   ├── index.ts
│   │   │   ├── sudden-change.ts
│   │   │   ├── downward-trend.ts
│   │   │   ├── repeated-negative.ts
│   │   │   ├── silent-risk.ts
│   │   │   └── mixed-signal.ts
│   │   ├── email/                 # Resend integration
│   │   │   ├── client.ts
│   │   │   └── templates/
│   │   ├── constants/             # Avatars, config
│   │   └── utils/                 # Helpers
│   ├── hooks/                     # Custom React hooks
│   ├── types/                     # TypeScript types
│   └── styles/                    # Global styles
├── supabase/
│   ├── migrations/                # DB migrations
│   └── seed.sql                   # Seed data (avatars)
├── .env.local                     # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. Routing & Access Control

| Route | Ai truy cập | Auth? | Mô tả |
|---|---|---|---|
| `/` | Tất cả | ❌ | Landing page |
| `/login` | GV | ❌ | Đăng nhập |
| `/register` | GV | ❌ | Đăng ký |
| `/dashboard` | GV | ✅ | Dashboard tổng quan |
| `/class/[id]` | GV | ✅ | Chi tiết lớp |
| `/c/[classCode]` | HS | ❌ | Màn điểm danh cảm xúc (mã lớp) |
| `/report/[token]` | PH | ❌ | Xem report (token bí mật) |
| `/api/*` | Internal | Mixed | API endpoints |

---

## 5. Luồng dữ liệu chính

### 5.1 Luồng Điểm danh cảm xúc (Student)
```
[Student tap emoji]
    → POST /api/checkin
        → Validate (classCode + studentId + mood)
        → INSERT mood_logs
        → UPDATE student streak
        → Return success + streak count
```

### 5.2 Teacher Dashboard Load
```
[Teacher opens dashboard]
    → GET /api/classes/[id]/status
        → FETCH all students in class
        → FETCH mood_logs (last 7 days)
        → FETCH teacher_observations
        → RUN rule engine (5 rules per student)
        → Return students[] with flags
```

### 5.3 Weekly Report Generation
```
[Vercel Cron - every Sunday 8pm]
    → /api/cron/weekly-report
        → For each class:
            → For each student with parent email:
                → Aggregate week mood data
                → Generate report content
                → Create unique token
                → Send email via Resend
```

---

## 6. Supabase Configuration

### Auth:
- Email + Password (enabled)
- Google OAuth (enabled)
- Confirm email: enabled
- Password policy: minimum 6 chars

### Row Level Security (RLS):
```sql
-- Teachers chỉ thấy lớp của mình
CREATE POLICY "teacher_own_classes" ON classes
  FOR ALL USING (teacher_id = auth.uid());

-- Mood logs: insert không cần auth (điểm danh public)
CREATE POLICY "public_checkin_insert" ON mood_logs
  FOR INSERT WITH CHECK (true);

-- Mood logs: read chỉ GV của lớp
CREATE POLICY "teacher_read_mood" ON mood_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN students s ON s.class_id = c.id
      WHERE s.id = mood_logs.student_id
      AND c.teacher_id = auth.uid()
    )
  );
```

---

## 7. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
CRON_SECRET=
```

---

## 8. Performance & Scalability

| Concern | Giải pháp |
|---|---|
| Điểm danh nhiều lớp cùng lúc | Supabase connection pooling (Supavisor) |
| Dashboard load nhanh | Server-side computation + caching |
| 50 SVG linh vật | Static assets, CDN qua Vercel |
| Weekly email batch | Vercel Cron + queue (xử lý tuần tự) |
| Scale lên nhiều trường | Row Level Security + index trên teacher_id, class_id |

---

## 9. Security

| Lớp | Biện pháp |
|---|---|
| Auth | Supabase Auth + JWT + RLS |
| Link điểm danh | Mã lớp 6 ký tự (không đoán được) |
| Parent report | Token ngẫu nhiên, có thời hạn (7 ngày) |
| API | Rate limiting (Vercel Edge) |
| Data | Không lưu thông tin nhạy cảm; mood chỉ là 1/2/3 |
| CORS | Chỉ cho phép domain chính |
