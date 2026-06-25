# ⚙️ ClassPulse — Rule Engine Specification

---

## 1. Tổng quan

Rule Engine là bộ não phát hiện bất thường của ClassPulse. Nó chạy **5 rule cố định** (rule-based, không AI) dựa trên dữ liệu điểm danh cảm xúc và teacher signals.

### Nguyên tắc hoạt động:
- ❌ **KHÔNG** kết luận — chỉ **gợi ý "cần chú ý"**
- ✅ Chạy khi GV mở dashboard (on-demand)
- ✅ Mỗi rule trả về: `triggered: boolean`, `severity: 1-3`, `reason: string`
- ✅ Combine nhiều rule → severity cao hơn

### Khi nào chạy:
- Mỗi khi GV mở dashboard class
- Mỗi khi có điểm danh mới (background, optional)
- Khi generate weekly report

---

## 2. Input Data

Rule engine nhận input cho **mỗi học sinh**:

```typescript
interface RuleInput {
  studentId: string;
  // Mood logs gần nhất (7-14 ngày)
  moodLogs: {
    date: string;              // YYYY-MM-DD
    mood: 0 | 1 | 2 | 3;     // 0=skip, 1=happy, 2=neutral, 3=sad
  }[];
  // Teacher signals gần nhất
  teacherSignals: {
    date: string;
    signal: 1 | 2 | 3;  // 1=green, 2=yellow, 3=red
  }[];
  // Ngày có mặt + chọn mood (mood 1/2/3) trong 7 ngày gần nhất
  activeMoodDates: string[];   // mood = 1 | 2 | 3
  // Ngày chủ động bỏ qua (mood = 0)
  skipDates: string[];
  // Tổng số ngày học trong 7 ngày
  schoolDaysLast7: number; // thường = 5
}
// NOTE:
// Missing (vắng/không reach) = schoolDaysLast7 - len(activeMoodDates) - len(skipDates)
// Skip khác Missing: skip = có mặt + tự chọn không chia sẻ
```

---

## 3. Output Format

```typescript
interface RuleResult {
  rule: string;          // Rule ID
  triggered: boolean;    // Có kích hoạt không
  severity: 1 | 2 | 3;  // 1=low, 2=medium, 3=high
  reason: string;        // Mô tả tiếng Việt
}

interface StudentFlags {
  studentId: string;
  flags: RuleResult[];
  overallStatus: 'green' | 'yellow' | 'red';
}
```

### Overall Status Logic:
```
- Có bất kỳ flag severity 3     → 🔴 red
- Có bất kỳ flag severity 2     → 🟡 yellow (nếu không có red)
- Có ≥ 2 flag severity 1        → 🟡 yellow
- Còn lại                        → 🟢 green
```

---

## 4. Chi tiết 5 Rules

---

### 🔴 Rule 1: Thay đổi đột ngột (`sudden_change`)

**Ý nghĩa:** Mood hôm nay giảm mạnh so với hôm trước (hoặc trung bình gần đây).

**Logic:**
```
IF mood hôm nay = 3 (sad)
   AND mood hôm qua = 1 (happy)
THEN trigger (severity 2)

IF mood hôm nay = 3 (sad)
   AND trung bình 3 ngày trước < 1.5
THEN trigger (severity 3)
```

**Severity:**
- 2 = giảm 1→3 so với hôm trước
- 3 = giảm từ trung bình rất vui (< 1.5) xuống sad

**Reason mẫu:**
- `"Mood giảm đột ngột hôm nay (vui → buồn)"`
- `"Thay đổi lớn so với xu hướng tuần qua"`

**Edge cases:**
- Nếu không có data hôm qua → không trigger
- Nếu trung bình trước đó chỉ có 1 ngày → dùng rule đơn giản (so sánh 2 ngày)

---

### 🔴 Rule 2: Xu hướng giảm dần (`downward_trend`)

**Ý nghĩa:** Mood giảm dần theo thời gian (không đột ngột nhưng đều đặn đi xuống).

**Logic:**
```
Lấy mood 5 ngày gần nhất (có data).
Tính: có ≥ 3 ngày liên tiếp mood KHÔNG GIẢM ĐI hoặc TĂNG?

Cụ thể:
IF chuỗi mood có pattern giảm hoặc giữ nguyên negative:
   [1, 2, 2, 3] → trigger
   [1, 1, 2, 3] → trigger
   [2, 2, 3, 3] → trigger
   [1, 2, 2, 2] → trigger (xu hướng từ vui → neutral kéo dài)

Condition chính xác:
  - Lấy 4-5 ngày gần nhất
  - Tính slope (xu hướng): nếu slope > 0.3 (tăng = xấu đi) → trigger
  - HOẶC: ngày cuối ≥ ngày đầu + 1 AND không có ngày nào quay về 1
```

**Severity:**
- 1 = xu hướng nhẹ (slope 0.3–0.5)
- 2 = xu hướng rõ (slope 0.5–0.8 hoặc kết thúc ở 3)
- 3 = xu hướng mạnh (slope > 0.8, hoặc 4+ ngày liên tục giảm)

**Reason mẫu:**
- `"Mood có xu hướng giảm dần trong 5 ngày qua"`
- `"Xu hướng tiêu cực kéo dài"`

---

### 🔴 Rule 3: Lặp lại tiêu cực (`repeated_negative`)

**Ý nghĩa:** Mood sad (3) xuất hiện nhiều lần liên tiếp.

**Logic:**
```
IF mood = 3 liên tiếp ≥ 2 ngày → trigger severity 2
IF mood = 3 liên tiếp ≥ 3 ngày → trigger severity 3
IF mood ≥ 2 (neutral hoặc sad) liên tiếp ≥ 4 ngày → trigger severity 2
```

**Severity:**
- 2 = sad 2 ngày liên tiếp, hoặc neutral+ 4 ngày
- 3 = sad 3+ ngày liên tiếp

**Reason mẫu:**
- `"Chọn 🙁 2 ngày liên tiếp"`
- `"Chọn 🙁 3 ngày liên tiếp — cần quan tâm"`
- `"Không vui suốt 4 ngày qua"`

---

### 🔴 Rule 4: Không tương tác (`silent_risk`)

**Ý nghĩa:** Bé không check-in (miss — không được reach) nhiều ngày — đây là "silent signal" cực quan trọng.

> ⚠️ Rule này chỉ đếm **Missing** (không có record) — **không đếm Skip** (mood=0).
> Skip được xử lý riêng ở Rule 6.

**Logic:**
```
missingCount = schoolDaysLast7 - len(activeMoodDates) - len(skipDates)

IF missingCount >= 2 AND missingCount < 3 → trigger severity 1
IF missingCount >= 3 → trigger severity 2
IF missingCount >= 4 → trigger severity 3

BONUS: Nếu bé từng điểm danh đều (streak > 5) rồi đột nhiên miss 2+ → severity +1
```

**Severity:**
- 1 = miss 2 ngày trong tuần
- 2 = miss 3 ngày
- 3 = miss 4+ ngày (hoặc 2+ ngày nhưng trước đó rất đều)

**Reason mẫu:**
- `"Không điểm danh 2 ngày trong tuần qua"`
- `"Vắng mặt 3 ngày — trước đó rất đều đặn"`
- `"Im lặng: không tương tác 4 ngày"`

---

### 🔴 Rule 5: Tín hiệu chéo (`mixed_signal`)

**Ý nghĩa:** Khi CẢ học sinh mood xấu VÀ giáo viên cũng mark bất thường → confidence rất cao.

**Logic:**
```
Lấy teacher_signals gần nhất (7 ngày).

IF student mood = 3 (sad) hôm nay
   AND teacher signal = 2 (yellow) hoặc 3 (red) trong 3 ngày gần
THEN trigger

IF student mood ≥ 2 (neutral/sad) 3+ ngày
   AND teacher signal = 3 (red)
THEN trigger (severity 3)

// Skip cũng được xét trong Rule này:
IF student skip 2+ ngày gần nhất (mood=0)
   AND teacher signal = 2 (yellow) hoặc 3 (red)
THEN trigger (severity 2)
```

**Severity:**
- 2 = student sad + teacher yellow
- 3 = student sad + teacher red, HOẶC neutral kéo dài + teacher red

**Reason mẫu:**
- `"Học sinh chọn 🙁 + Giáo viên cũng nhận thấy bất thường"`
- `"Bỏ qua nhiều ngày + Giáo viên đã mark bất thường"`
- `"Nhiều tín hiệu cùng lúc — cần quan tâm sớm"`

---

### 🔴 Rule 6: Mẫu bỏ qua (`skip_pattern`)

**Ý nghĩa:** Học sinh có mặt, nhận máy, nhưng chủ động chọn không chia sẻ nhiều ngày liên tục. Đây là một dạng im lặng chủ động.

> ⚠️ **Không kết luận gì về lý do bỏ qua.**
> Bỏ qua 1 lần = bình thường, là quyền tự chủ.
> Bỏ qua nhiều lần liên tục (sau giai đoạn chia sẻ đều) = thông tin đáng chú ý.

**Logic:**
```
skipCount_last5 = len(skipDates trong 5 ngày gần nhất)

IF skipCount_last5 >= 3 → trigger severity 1
IF skipCount_last5 >= 4 → trigger severity 2

BONUS: Nếu trước đó bé từng điểm danh đều đặn (streak > 5, mood ≠ 0)
        rồi đột nhiên skip 3+ ngày → severity +1

IF skip 1-2 ngày (bất kỳ) → KHÔNG trigger (bình thường)
```

**Severity:**
- 1 = skip 3/5 ngày (nhẹ, để ý thêm)
- 2 = skip 4+/5 ngày, hoặc skip đột ngột sau streak dài

**Reason mẫu:**
- `"Bỏ qua 3 ngày liên tục — quan sát thêm"`
- `"Hay bỏ qua sau giai đoạn chia sẻ đều đặn"`

**Edge cases:**
- Những ngày đầu tiên của lớp (≤ 5 ngày dữ liệu) → không trigger, cần ít nhất 2 tuần dữ liệu
- Bé mới chuyển vào lớp → grace period 5 ngày không trigger
- Skip xảy ra đồng loạt cả lớp (> 30% lớp skip ngày đó) → khả năng tình huống bất thường ngoài lớp, không đánh flag cá nhân

---

## 5. Combine Rules — Escalation Logic

Khi nhiều rule trigger cùng lúc cho 1 HS:

```typescript
function calculateOverallSeverity(flags: RuleResult[]): number {
  const activeFlags = flags.filter(f => f.triggered);

  if (activeFlags.length === 0) return 0; // green

  const maxSeverity = Math.max(...activeFlags.map(f => f.severity));

  // Escalation: nhiều flag nhẹ = 1 flag nặng hơn
  if (activeFlags.length >= 3 && maxSeverity < 3) {
    return maxSeverity + 1; // escalate
  }

  // mixed_signal + bất kỳ rule nào khác → luôn severity 3
  if (activeFlags.some(f => f.rule === 'mixed_signal') && activeFlags.length > 1) {
    return 3;
  }

  return maxSeverity;
}
```

---

## 6. Implementation Notes

### Performance:
- Rule chạy **server-side** (API route hoặc Supabase function)
- Input: query 1 lần cho cả lớp (batch), không query từng HS
- Cache kết quả 5 phút (nếu GV refresh liên tục)

### Khi nào cập nhật flags:
1. **On-demand:** mỗi khi GV mở class dashboard
2. **Sau mỗi lần điểm danh:** sau khi có mood log mới → re-evaluate HS đó
3. **Cron (daily 9pm):** chạy lại cho tất cả → update flag bảng `student_flags`

### Flag lifecycle:
```
[Trigger] → is_active = true
[GV đánh dấu "đã xem"] → vẫn active nhưng hiển thị khác
[HS mood cải thiện 3 ngày] → is_active = false, resolved_at = now()
[GV manual resolve] → is_active = false
```

---

## 7. Testing Scenarios

| Scenario | Expected | Rule |
|---|---|---|
| Mood: 1,1,1,3 | 🟡 severity 2 | sudden_change |
| Mood: 1,2,2,3 | 🟡 severity 2 | downward_trend |
| Mood: 3,3,3 | 🔴 severity 3 | repeated_negative |
| Miss 3/5 days (không có record) | 🟡 severity 2 | silent_risk |
| Skip 3/5 days (mood=0) | 🟡 severity 1 | skip_pattern |
| Skip 4/5 days sau streak 10 ngày | 🟡 severity 2 | skip_pattern (escalated) |
| Skip 2 ngày + Teacher 🟡 | 🟡 severity 2 | mixed_signal |
| Mood 3 + Teacher 🟡 | 🟡 severity 2 | mixed_signal |
| Mood 3 + Teacher 🔴 | 🔴 severity 3 | mixed_signal |
| Miss 2 + skip 2 + Teacher 🟡 | 🔴 escalated | combine |
| Skip 1-2 ngày (đơn lẻ) | 🟢 no flag | (không trigger) |
| Mood: 1,2,3 + miss 2 + teacher 🟡 | 🔴 escalated | combine |
