# 🗄️ ClassPulse — Data Model

---

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌─────────────────┐       ┌──────────────────┐
│  teachers   │       │     classes      │       │    students      │
├─────────────┤       ├─────────────────┤       ├──────────────────┤
│ id (PK)     │──1:N──│ id (PK)         │──1:N──│ id (PK)          │
│ email       │       │ teacher_id (FK)  │       │ class_id (FK)    │
│ full_name   │       │ name            │       │ full_name        │
│ avatar_url  │       │ code (unique)   │       │ order_number     │
│ created_at  │       │ school_name     │       │ avatar_id (FK)   │
└─────────────┘       │ grade           │       │ parent_email     │
                      │ is_active       │       │ streak_count     │
                      │ created_at      │       │ last_checkin_date│
                      └─────────────────┘       │ created_at       │
                                                └──────────────────┘
                                                         │
                              ┌───────────────────────────┼───────────────────┐
                              │                           │                   │
                    ┌─────────┴────────┐      ┌──────────┴───────┐  ┌───────┴────────────┐
                    │    mood_logs      │      │ teacher_signals  │  │  weekly_reports    │
                    ├──────────────────┤      ├──────────────────┤  ├────────────────────┤
                    │ id (PK)          │      │ id (PK)          │  │ id (PK)            │
                    │ student_id (FK)  │      │ student_id (FK)  │  │ student_id (FK)    │
                    │ class_id (FK)    │      │ teacher_id (FK)  │  │ week_start         │
                    │ mood (1,2,3)     │      │ signal (1,2,3)   │  │ mood_summary       │
                    │ checked_at       │      │ note (optional)  │  │ token (unique)     │
                    │ created_at       │      │ created_at       │  │ sent_at            │
                    └──────────────────┘      └──────────────────┘  │ expires_at         │
                                                                     │ created_at         │
                                                                     └────────────────────┘

┌──────────────────┐       ┌──────────────────┐
│    avatars       │       │  student_flags   │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ name             │       │ student_id (FK)  │
│ emoji            │       │ rule_triggered   │
│ color            │       │ severity (1,2,3) │
│ svg_path         │       │ reason           │
│ category         │       │ is_active        │
└──────────────────┘       │ triggered_at     │
                           │ resolved_at      │
                           │ created_at       │
                           └──────────────────┘
```

---

## 2. Chi tiết bảng

### 2.1 `teachers` — Giáo viên

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | uuid | PK, default gen_random_uuid() | Supabase Auth UID |
| `email` | text | NOT NULL, UNIQUE | Email đăng nhập |
| `full_name` | text | NOT NULL | Tên đầy đủ |
| `avatar_url` | text | NULL | Ảnh đại diện (optional) |
| `created_at` | timestamptz | default now() | Ngày tạo |

### 2.2 `classes` — Lớp học

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | uuid | PK | |
| `teacher_id` | uuid | FK → teachers.id | GV sở hữu |
| `name` | text | NOT NULL | Tên lớp (VD: "Lớp 3A") |
| `code` | text | UNIQUE, 6 chars | Mã lớp / link điểm danh (VD: "AB12CD") |
| `school_name` | text | NULL | Tên trường (optional) |
| `grade` | smallint | NULL | Khối lớp (1-12) |
| `is_active` | boolean | default true | Đang hoạt động |
| `created_at` | timestamptz | default now() | |

**Index:** `idx_classes_code` ON `code`

### 2.3 `avatars` — Thư viện linh vật (50 bản ghi seed)

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | smallint | PK | 1-50 |
| `name` | text | NOT NULL | Tên VN (VD: "Cáo") |
| `emoji` | text | NOT NULL | Emoji đại diện (VD: "🦊") |
| `color` | text | NOT NULL | Mã màu nền (VD: "#FF6B35") |
| `svg_path` | text | NOT NULL | Path đến file SVG |
| `category` | text | NOT NULL | Nhóm (mammal, bird, sea, insect) |

### 2.4 `students` — Học sinh

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | uuid | PK | |
| `class_id` | uuid | FK → classes.id, ON DELETE CASCADE | Lớp |
| `full_name` | text | NOT NULL | Tên HS |
| `order_number` | smallint | NOT NULL | STT trong lớp (khóa ngầm) |
| `avatar_id` | smallint | FK → avatars.id, NULL | Linh vật đã chọn |
| `parent_email` | text | NULL | Email phụ huynh |
| `streak_count` | integer | default 0 | Chuỗi ngày điểm danh liên tiếp (chỉ đếm ngày học) |
| `last_checkin_date` | date | NULL | Ngày điểm danh gần nhất |
| `created_at` | timestamptz | default now() | |

**Index:** `idx_students_class` ON `(class_id, order_number)`
**Constraint:** UNIQUE `(class_id, order_number)`
**Constraint:** UNIQUE `(class_id, avatar_id)` — mỗi linh vật chỉ 1 bé/lớp

**Streak logic:**
- Streak tăng khi `checked_at > last_checkin_date`
- Gap cuối tuần **không đứt streak**: nếu `last_checkin_date` là thứ 6 và `checked_at` là thứ 2, vẫn coi là liên tiếp (gap ≤ 3 ngày calendar = qua weekend)
- Ngưỡng: gap > 3 ngày calendar → streak reset về 1
- Skip (mood = 0) **vẫn tính streak** — bé có mặt và tham gia

### 2.5 `mood_logs` — Nhật ký mood (core data)

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | uuid | PK | |
| `student_id` | uuid | FK → students.id, ON DELETE CASCADE | |
| `class_id` | uuid | FK → classes.id | Denormalize để query nhanh |
| `mood` | smallint | NOT NULL, CHECK (0-3) | 0=bỏ qua, 1=😊, 2=😐, 3=🙁 |
| `checked_at` | date | NOT NULL | Ngày điểm danh |
| `created_at` | timestamptz | default now() | Timestamp chính xác |

**Index:** `idx_mood_logs_student_date` ON `(student_id, checked_at DESC)`
**Index:** `idx_mood_logs_class_date` ON `(class_id, checked_at DESC)`
**Constraint:** UNIQUE `(student_id, checked_at)` — mỗi bé chỉ 1 lần/ngày

### 2.6 `teacher_signals` — GV mark quan sát

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | uuid | PK | |
| `student_id` | uuid | FK → students.id | |
| `teacher_id` | uuid | FK → teachers.id | |
| `signal` | smallint | NOT NULL, CHECK (1-3) | 1=🟢, 2=🟡, 3=🔴 |
| `note` | text | NULL | Ghi chú ngắn (optional) |
| `created_at` | timestamptz | default now() | |

**Index:** `idx_teacher_signals_student` ON `(student_id, created_at DESC)`

### 2.7 `student_flags` — Cờ cảnh báo (output của rule engine)

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | uuid | PK | |
| `student_id` | uuid | FK → students.id | |
| `rule_triggered` | text | NOT NULL | Rule nào (VD: "sudden_change") |
| `severity` | smallint | NOT NULL, CHECK (1-3) | 1=nhẹ, 2=trung bình, 3=cao |
| `reason` | text | NOT NULL | Mô tả VN (VD: "Mood giảm 3 ngày liên tiếp") |
| `is_active` | boolean | default true | Còn hiệu lực |
| `triggered_at` | date | NOT NULL | Ngày phát hiện |
| `resolved_at` | timestamptz | NULL | Ngày GV đánh dấu đã xử lý |
| `created_at` | timestamptz | default now() | |

**Index:** `idx_flags_student_active` ON `(student_id, is_active)`

### 2.8 `weekly_reports` — Báo cáo tuần cho PH

| Column | Type | Constraint | Mô tả |
|---|---|---|---|
| `id` | uuid | PK | |
| `student_id` | uuid | FK → students.id | |
| `week_start` | date | NOT NULL | Ngày đầu tuần |
| `mood_summary` | jsonb | NOT NULL | `{happy: 3, neutral: 2, sad: 1, skip: 1, missing: 1}` |
| `token` | text | UNIQUE, NOT NULL | Token xem report (32 chars) |
| `sent_at` | timestamptz | NULL | Đã gửi email chưa |
| `expires_at` | timestamptz | NOT NULL | Hết hạn (7 ngày) |
| `created_at` | timestamptz | default now() | |

**Index:** `idx_reports_token` ON `token`

---

## 3. Mood Value Mapping

| Giá trị DB | Emoji / Label | Ý nghĩa | Ai tạo | Hiển thị trong dashboard |
|---|---|---|---|---|
| `null` / không có record | ➖ | **Missing** — không được reach (vắng học, máy không đến tay) | Tự động | ➖ Vắng |
| `0` | ⬜ Bỏ qua | **Skip** — có mặt, chủ động chọn không chia sẻ | Học sinh | ⬜ Bỏ qua |
| `1` | 😊 | **Happy** — vui / ổn | Học sinh | 😊 Vui |
| `2` | 😐 | **Neutral** — bình thường | Học sinh | 😐 Bình thường |
| `3` | 🙁 | **Sad** — không vui | Học sinh | 🙁 Hơi buồn |

> ⚠️ **Phân biệt quan trọng:**
> - `null` (Missing) = bị động — bé vắng, máy không đến tay, hoặc chaos trong lớp
> - `0` (Skip) = chủ động — bé có mặt, nhận máy, tự quyết định không chia sẻ hôm nay
>
> Skip là một **quyền tự chủ** của học sinh — và đồng thời cũng là một **tín hiệu** cần theo dõi theo thời gian.

---

## 4. Teacher Signal Mapping

| Giá trị DB | Icon | Ý nghĩa |
|---|---|---|
| `1` | 🟢 | Bình thường |
| `2` | 🟡 | Hơi khác |
| `3` | 🔴 | Cần chú ý |

---

## 5. Flag Severity Mapping

| Giá trị DB | Label | Hiển thị | Ý nghĩa |
|---|---|---|---|
| `1` | low | 🟡 | Để ý nhẹ |
| `2` | medium | 🟠 | Nên chú ý |
| `3` | high | 🔴 | Cần quan tâm sớm |

---

## 6. Seed Data — Avatars (50 linh vật)

```sql
INSERT INTO avatars (id, name, emoji, color, svg_path, category) VALUES
(1,  'Cáo',         '🦊', '#FF6B35', '/avatars/fox.svg',       'mammal'),
(2,  'Thỏ',         '🐰', '#FFB5C2', '/avatars/rabbit.svg',    'mammal'),
(3,  'Gấu',         '🐻', '#8B4513', '/avatars/bear.svg',      'mammal'),
(4,  'Gấu trúc',    '🐼', '#2D2D2D', '/avatars/panda.svg',     'mammal'),
(5,  'Koala',        '🐨', '#808080', '/avatars/koala.svg',     'mammal'),
(6,  'Sư tử',       '🦁', '#DAA520', '/avatars/lion.svg',      'mammal'),
(7,  'Chim cánh cụt','🐧', '#1C1C1C', '/avatars/penguin.svg',  'bird'),
(8,  'Mèo',         '🐱', '#F4A460', '/avatars/cat.svg',       'mammal'),
(9,  'Chó',         '🐶', '#DEB887', '/avatars/dog.svg',       'mammal'),
(10, 'Hamster',      '🐹', '#FFEAA7', '/avatars/hamster.svg',   'mammal'),
(11, 'Ếch',         '🐸', '#27AE60', '/avatars/frog.svg',      'mammal'),
(12, 'Cú',          '🦉', '#6C3483', '/avatars/owl.svg',       'bird'),
(13, 'Bướm',        '🦋', '#AF7AC5', '/avatars/butterfly.svg', 'insect'),
(14, 'Ong',         '🐝', '#F1C40F', '/avatars/bee.svg',       'insect'),
(15, 'Bọ rùa',      '🐞', '#E74C3C', '/avatars/ladybug.svg',  'insect'),
(16, 'Cá heo',      '🐬', '#3498DB', '/avatars/dolphin.svg',   'sea'),
(17, 'Hồng hạc',    '🦩', '#E91E8C', '/avatars/flamingo.svg', 'bird'),
(18, 'Rùa',         '🐢', '#2E8B57', '/avatars/turtle.svg',   'sea'),
(19, 'Vẹt',         '🦜', '#E74C3C', '/avatars/parrot.svg',   'bird'),
(20, 'Bạch tuộc',   '🐙', '#9B59B6', '/avatars/octopus.svg',  'sea'),
(21, 'Voi',         '🐘', '#95A5A6', '/avatars/elephant.svg', 'mammal'),
(22, 'Hươu',        '🦌', '#A0522D', '/avatars/deer.svg',     'mammal'),
(23, 'Sóc',         '🐿️', '#D2691E', '/avatars/squirrel.svg', 'mammal'),
(24, 'Nhím',        '🦔', '#8B7355', '/avatars/hedgehog.svg', 'mammal'),
(25, 'Cá vàng',     '🐟', '#FF8C00', '/avatars/goldfish.svg', 'sea'),
(26, 'Cua',         '🦀', '#DC143C', '/avatars/crab.svg',     'sea'),
(27, 'Sao biển',    '⭐', '#FF69B4', '/avatars/starfish.svg', 'sea'),
(28, 'Cá voi',      '🐳', '#4169E1', '/avatars/whale.svg',    'sea'),
(29, 'Chim sẻ',     '🐦', '#CD853F', '/avatars/sparrow.svg', 'bird'),
(30, 'Đại bàng',    '🦅', '#4A4A4A', '/avatars/eagle.svg',   'bird'),
(31, 'Thiên nga',   '🦢', '#FFFFFF', '/avatars/swan.svg',     'bird'),
(32, 'Gà con',      '🐥', '#FFD700', '/avatars/chick.svg',   'bird'),
(33, 'Hổ',          '🐯', '#FF8C00', '/avatars/tiger.svg',   'mammal'),
(34, 'Ngựa',        '🐴', '#8B4513', '/avatars/horse.svg',   'mammal'),
(35, 'Kỳ lân',      '🦄', '#DDA0DD', '/avatars/unicorn.svg', 'mammal'),
(36, 'Khỉ',         '🐵', '#D2691E', '/avatars/monkey.svg',  'mammal'),
(37, 'Gấu bắc cực','🐻‍❄️','#B0E0E6', '/avatars/polar-bear.svg','mammal'),
(38, 'Chuột',       '🐭', '#C0C0C0', '/avatars/mouse.svg',   'mammal'),
(39, 'Lợn',         '🐷', '#FFB6C1', '/avatars/pig.svg',     'mammal'),
(40, 'Bò',          '🐮', '#F5F5DC', '/avatars/cow.svg',     'mammal'),
(41, 'Cừu',         '🐑', '#FFFAF0', '/avatars/sheep.svg',   'mammal'),
(42, 'Kangaroo',    '🦘', '#CD853F', '/avatars/kangaroo.svg','mammal'),
(43, 'Cá sấu',     '🐊', '#006400', '/avatars/crocodile.svg','sea'),
(44, 'Rắn',         '🐍', '#228B22', '/avatars/snake.svg',   'mammal'),
(45, 'Ốc sên',      '🐌', '#DEB887', '/avatars/snail.svg',   'insect'),
(46, 'Kiến',        '🐜', '#2F4F4F', '/avatars/ant.svg',     'insect'),
(47, 'Chuồn chuồn','🪰', '#00CED1', '/avatars/dragonfly.svg','insect'),
(48, 'Tắc kè',      '🦎', '#32CD32', '/avatars/gecko.svg',   'mammal'),
(49, 'Hải cẩu',     '🦭', '#778899', '/avatars/seal.svg',    'sea'),
(50, 'Tuần lộc',    '🦌', '#8B0000', '/avatars/reindeer.svg','mammal');
```

---

## 7. Query Patterns chính

### Lấy mood 7 ngày của 1 HS:
```sql
SELECT checked_at, mood
FROM mood_logs
WHERE student_id = $1
  AND checked_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY checked_at DESC;
```

### Lấy trạng thái toàn lớp hôm nay:
```sql
SELECT
  s.id, s.full_name, s.avatar_id, s.streak_count,
  ml.mood AS today_mood,
  sf.severity AS flag_severity,
  sf.reason AS flag_reason
FROM students s
LEFT JOIN mood_logs ml ON ml.student_id = s.id AND ml.checked_at = CURRENT_DATE
LEFT JOIN student_flags sf ON sf.student_id = s.id AND sf.is_active = true
WHERE s.class_id = $1
ORDER BY s.order_number;
```

### Đếm mood tuần cho report PH:
```sql
SELECT
  mood,
  COUNT(*) as count
FROM mood_logs
WHERE student_id = $1
  AND checked_at >= $2  -- week_start
  AND checked_at <= $3  -- week_end
GROUP BY mood;
```
