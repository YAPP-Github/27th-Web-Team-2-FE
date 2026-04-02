import { startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import {
  normalizeDateTimestamp,
  pathSetToDates,
  toggleDatesSmart,
} from './dateUtils';

// Helper: create a Date for a given YYYY-MM-DD
function d(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

// ── Layer 1: 순수 로직 테스트 ──────────────────────────────────

describe('normalizeDateTimestamp', () => {
  it('T1-1: 같은 날짜의 다른 시간 → 동일한 timestamp 반환', () => {
    const morning = new Date(2026, 2, 5, 9, 30, 0);
    const evening = new Date(2026, 2, 5, 21, 45, 0);
    expect(normalizeDateTimestamp(morning)).toBe(
      normalizeDateTimestamp(evening),
    );
  });

  it('T1-2: 다른 날짜 → 다른 timestamp 반환', () => {
    const day1 = d('2026-03-05');
    const day2 = d('2026-03-06');
    expect(normalizeDateTimestamp(day1)).not.toBe(normalizeDateTimestamp(day2));
  });
});

describe('pathSetToDates', () => {
  it('T2-1: 빈 Set → 빈 배열', () => {
    expect(pathSetToDates(new Set())).toEqual([]);
  });

  it('T2-2: 단일 timestamp → 단일 Date 배열', () => {
    const ts = startOfDay(d('2026-03-05')).getTime();
    const result = pathSetToDates(new Set([ts]));
    expect(result).toHaveLength(1);
    expect(result[0].getTime()).toBe(ts);
  });

  it('T2-3: 복수 timestamp → 정렬된 Date 배열', () => {
    const ts1 = startOfDay(d('2026-03-07')).getTime();
    const ts2 = startOfDay(d('2026-03-05')).getTime();
    const ts3 = startOfDay(d('2026-03-06')).getTime();
    const result = pathSetToDates(new Set([ts1, ts2, ts3]));
    expect(result).toHaveLength(3);
    expect(result[0].getTime()).toBe(ts2); // 3/5
    expect(result[1].getTime()).toBe(ts3); // 3/6
    expect(result[2].getTime()).toBe(ts1); // 3/7
  });

  it('T2-4: 비연속 timestamp → 비연속 Date 배열 (정렬됨)', () => {
    const ts1 = startOfDay(d('2026-03-10')).getTime();
    const ts2 = startOfDay(d('2026-03-05')).getTime();
    const ts3 = startOfDay(d('2026-03-07')).getTime();
    const result = pathSetToDates(new Set([ts1, ts2, ts3]));
    expect(result).toHaveLength(3);
    expect(result[0].getTime()).toBe(ts2); // 3/5
    expect(result[1].getTime()).toBe(ts3); // 3/7
    expect(result[2].getTime()).toBe(ts1); // 3/10
  });
});

describe('toggleDatesSmart with path-based input', () => {
  it('T3-1: 빈 selection + 비연속 경로 → 날짜 추가', () => {
    const path = [d('2026-03-05'), d('2026-03-07'), d('2026-03-10')];
    const result = toggleDatesSmart([], path);
    expect(result).toHaveLength(3);
  });

  it('T3-2: 선택 상태 + 부분 경로 → 해당 날짜만 제거', () => {
    const selected = [d('2026-03-05'), d('2026-03-06'), d('2026-03-07')];
    const path = [d('2026-03-05'), d('2026-03-06')];
    const result = toggleDatesSmart(selected, path);
    // 3/5, 3/6 제거 → 3/7만 남음
    expect(result).toHaveLength(1);
  });

  it('T3-3: 시작 셀이 선택됨 → 제거 모드로 전체 경로 제거', () => {
    const selected = [d('2026-03-05')];
    const path = [d('2026-03-05'), d('2026-03-07'), d('2026-03-10')];
    const result = toggleDatesSmart(selected, path);
    // 3/5 제거, 3/7과 3/10은 원래 선택에 없었으므로 변화 없음 → 빈 배열
    expect(result).toHaveLength(0);
  });

  it('T3-4: 빈 selection + 단일 경로 → 단일 클릭 추가', () => {
    const result = toggleDatesSmart([], [d('2026-03-05')]);
    expect(result).toHaveLength(1);
  });

  it('T3-5: 선택 상태 + 동일 단일 경로 → 단일 클릭 제거', () => {
    const result = toggleDatesSmart([d('2026-03-05')], [d('2026-03-05')]);
    expect(result).toHaveLength(0);
  });

  it('T3-6: 빈 경로 → 현재 selection 그대로 반환', () => {
    const selected = [d('2026-03-05'), d('2026-03-06')];
    const result = toggleDatesSmart(selected, []);
    expect(result).toHaveLength(2);
  });
});

// ── Layer 2: 통합 로직 테스트 (드래그 시나리오 시뮬레이션) ──────

describe('Drag scenario simulation', () => {
  it('T4-1: 연속 드래그 선택 시나리오', () => {
    // 경로: 3/5 → 3/6 → 3/7
    const path = new Set([
      normalizeDateTimestamp(d('2026-03-05')),
      normalizeDateTimestamp(d('2026-03-06')),
      normalizeDateTimestamp(d('2026-03-07')),
    ]);
    const pathDates = pathSetToDates(path);
    const result = toggleDatesSmart([], pathDates);
    expect(result).toHaveLength(3);
  });

  it('T4-2: 비연속 드래그 해제 시나리오', () => {
    // 초기 선택: 3/5, 3/6, 3/7, 3/8
    const selected = [
      d('2026-03-05'),
      d('2026-03-06'),
      d('2026-03-07'),
      d('2026-03-08'),
    ];
    // 경로: 3/5, 3/7 (6일 건너뜀)
    const path = new Set([
      normalizeDateTimestamp(d('2026-03-05')),
      normalizeDateTimestamp(d('2026-03-07')),
    ]);
    const pathDates = pathSetToDates(path);
    const result = toggleDatesSmart(selected, pathDates);
    // 3/5, 3/7 제거 → 3/6, 3/8 남음
    expect(result).toHaveLength(2);
  });

  it('T4-3: 재진입 방지 (Set 기반)', () => {
    const ts = normalizeDateTimestamp(d('2026-03-05'));
    const path = new Set<number>();
    path.add(ts);
    path.add(ts); // 중복 추가
    expect(path.size).toBe(1);
    expect(pathSetToDates(path)).toHaveLength(1);
  });
});
