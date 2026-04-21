# Component Interface Contract: Time Range Picker (v2 — Wheel UI)

**이 피처는 백엔드 API를 직접 호출하지 않는다.**
모든 계약은 React 컴포넌트 props/콜백 인터페이스로 정의된다.

---

## CONTRACT-001: TimeRangePicker 컴포넌트

**위치**: `src/features/time-range-select/ui/TimeRangePicker.tsx`
**역할**: "시간" 섹션 전체 — 시작시간/종료시간 행 표시 + 바텀 시트 통합 + 건너뛰기 체크박스

### Props

```typescript
interface TimeRangePickerProps {
  initialStartTime?: TimeValue; // 기본값: { hour: 9, minute: 0 }
  initialEndTime?: TimeValue; // 기본값: { hour: 9, minute: 0 }
  onComplete?: (range: { startTime: TimeValue; endTime: TimeValue }) => void;
  onSkip?: () => void; // "시간 설정 안하고 넘어가기" 체크 시 호출
}
```

### 동작 보장

- 기본값은 `{ hour: 9, minute: 0 }`
- 시작시간/종료시간 행 탭 → 바텀 시트에서 휠 피커 표시
- 바텀 시트 "확인" 클릭 → 선택값 적용 후 시트 닫힘
- `isValid` (endTime > startTime)일 때만 `onComplete` 호출

---

## CONTRACT-002: TimeWheelPicker 컴포넌트

**위치**: `src/features/time-range-select/ui/TimeWheelPicker.tsx`
**역할**: iOS 스타일 휠 피커 — 시 컬럼 + 콜론 + 분 컬럼

### Props

```typescript
interface TimeWheelPickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
}
```

### 동작 보장

- 시 컬럼: 0~23 스크롤 목록
- 분 컬럼: [00, 30] 스크롤 목록
- 중앙 선택 항목: 진한 텍스트 + 둥근 테두리 강조
- ±1 항목: 중간 회색, ±2 항목: 연한 회색 (페이드 효과)
- `scroll-snap-type: y mandatory` 스냅 동작
- 스크롤 종료 후 onChange 호출

---

## CONTRACT-003: TimeWheelColumn 컴포넌트

**위치**: `src/features/time-range-select/ui/TimeWheelColumn.tsx`
**역할**: 단일 스크롤 휠 컬럼 (시 또는 분)

### Props

```typescript
interface TimeWheelColumnProps {
  items: number[];
  value: number;
  onChange: (value: number) => void;
  formatItem?: (n: number) => string;
}
```

### 동작 보장

- `scroll-snap-type: y mandatory` 스냅
- 스크롤 위치 기반 실시간 색상 페이드 (distance 0: 진함, 1: 회색, 2+: 연함)
- 항목 탭 시 해당 항목으로 스크롤 이동
- 스크롤바 숨김
- 최소 탭 영역 44px

---

## CONTRACT-004: useTimeRangeSelect 훅

**위치**: `src/features/time-range-select/model/useTimeRangeSelect.ts`

(기존과 동일, 상세는 data-model.md 참조)

---

## CONTRACT-005: 순수 유틸 함수

**위치**: `src/features/time-range-select/lib/timeUtils.ts`

(기존과 동일, TDD 테스트 완료)

---

## 데이터 흐름

```
app/test/time-picker/page.tsx
  └── TimeRangePicker (features/time-range-select/ui)
        ├── useTimeRangeSelect (model)
        │     ├── timeUtils.isValidTimeRange() (lib)
        │     └── timeUtils.getEndTimeOptions() (lib)
        ├── BottomSheet (shared/ui)
        │     └── TimeWheelPicker (ui)
        │           ├── TimeWheelColumn — 시(0~23)
        │           └── TimeWheelColumn — 분(0, 30)
        └── Checkbox (shared/ui)

onComplete callback → 부모 컴포넌트 (테스트 페이지 state / 추후 meet-create)
```
