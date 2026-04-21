import { describe, expect, it } from 'vitest';

import {
  formatTime,
  generateTimeSlots,
  getEndTimeOptions,
  isValidTimeRange,
  timeToMinutes,
} from './timeUtils';

describe('generateTimeSlots', () => {
  it('48개 슬롯을 생성한다', () => {
    const slots = generateTimeSlots();
    expect(slots).toHaveLength(48);
  });

  it('00:00으로 시작한다', () => {
    const slots = generateTimeSlots();
    expect(slots[0]).toEqual({ hour: 0, minute: 0 });
  });

  it('23:30으로 끝난다', () => {
    const slots = generateTimeSlots();
    expect(slots[47]).toEqual({ hour: 23, minute: 30 });
  });

  it('30분 간격으로 증가한다', () => {
    const slots = generateTimeSlots();
    expect(slots[1]).toEqual({ hour: 0, minute: 30 });
    expect(slots[2]).toEqual({ hour: 1, minute: 0 });
    expect(slots[3]).toEqual({ hour: 1, minute: 30 });
  });
});

describe('formatTime', () => {
  it('10:00 포맷', () => {
    expect(formatTime({ hour: 10, minute: 0 })).toBe('10:00');
  });

  it('한 자리 시각은 0 패딩', () => {
    expect(formatTime({ hour: 9, minute: 30 })).toBe('09:30');
  });

  it('자정 00:00', () => {
    expect(formatTime({ hour: 0, minute: 0 })).toBe('00:00');
  });

  it('23:30 포맷', () => {
    expect(formatTime({ hour: 23, minute: 30 })).toBe('23:30');
  });
});

describe('timeToMinutes', () => {
  it('10:30 → 630', () => {
    expect(timeToMinutes({ hour: 10, minute: 30 })).toBe(630);
  });

  it('00:00 → 0', () => {
    expect(timeToMinutes({ hour: 0, minute: 0 })).toBe(0);
  });

  it('23:30 → 1410', () => {
    expect(timeToMinutes({ hour: 23, minute: 30 })).toBe(1410);
  });
});

describe('isValidTimeRange', () => {
  it('종료 > 시작 → true', () => {
    expect(
      isValidTimeRange({ hour: 10, minute: 0 }, { hour: 22, minute: 0 }),
    ).toBe(true);
  });

  it('종료 = 시작 (동일) → false', () => {
    expect(
      isValidTimeRange({ hour: 10, minute: 0 }, { hour: 10, minute: 0 }),
    ).toBe(false);
  });

  it('종료 < 시작 (역전) → false', () => {
    expect(
      isValidTimeRange({ hour: 14, minute: 0 }, { hour: 13, minute: 30 }),
    ).toBe(false);
  });

  it('23:00 → 23:30 → true', () => {
    expect(
      isValidTimeRange({ hour: 23, minute: 0 }, { hour: 23, minute: 30 }),
    ).toBe(true);
  });
});

describe('getEndTimeOptions', () => {
  const allSlots = generateTimeSlots();

  it('시작 시각 10:00이면 10:00 이하는 disabled', () => {
    const options = getEndTimeOptions({ hour: 10, minute: 0 }, allSlots);
    expect(options).toHaveLength(48);
    // 00:00 ~ 10:00 (인덱스 0~20) → disabled
    for (let i = 0; i <= 20; i++) {
      expect(options[i].isDisabled).toBe(true);
    }
    // 10:30 (인덱스 21) ~ 23:30 → enabled
    for (let i = 21; i < 48; i++) {
      expect(options[i].isDisabled).toBe(false);
    }
  });

  it('label은 formatTime 결과와 동일하다', () => {
    const options = getEndTimeOptions({ hour: 10, minute: 0 }, allSlots);
    expect(options[0].label).toBe('00:00');
    expect(options[47].label).toBe('23:30');
  });

  it('value는 원본 TimeValue와 동일하다', () => {
    const options = getEndTimeOptions({ hour: 10, minute: 0 }, allSlots);
    expect(options[0].value).toEqual({ hour: 0, minute: 0 });
  });
});

describe('Edge cases', () => {
  const allSlots = generateTimeSlots();

  it('23:00 시작이면 종료 옵션은 23:30만 활성화', () => {
    const options = getEndTimeOptions({ hour: 23, minute: 0 }, allSlots);
    const enabled = options.filter((o) => !o.isDisabled);
    expect(enabled).toHaveLength(1);
    expect(enabled[0].value).toEqual({ hour: 23, minute: 30 });
  });

  it('23:30 시작이면 종료 옵션은 모두 비활성화', () => {
    const options = getEndTimeOptions({ hour: 23, minute: 30 }, allSlots);
    expect(options.every((o) => o.isDisabled)).toBe(true);
  });

  it('자정 경계 23:30 formatTime은 "23:30"이다', () => {
    expect(formatTime({ hour: 23, minute: 30 })).toBe('23:30');
  });

  it('30분 경계 09:00/09:30은 서로 유효한 범위를 이룬다', () => {
    expect(
      isValidTimeRange({ hour: 9, minute: 0 }, { hour: 9, minute: 30 }),
    ).toBe(true);
    expect(
      isValidTimeRange({ hour: 9, minute: 30 }, { hour: 9, minute: 0 }),
    ).toBe(false);
  });

  it('09:00 시작 기준 getEndTimeOptions는 09:00 이하를 모두 disable한다', () => {
    const options = getEndTimeOptions({ hour: 9, minute: 0 }, allSlots);
    // 00:00 ~ 09:00 (0 ~ 18 인덱스) → disabled
    for (let i = 0; i <= 18; i++) {
      expect(options[i].isDisabled).toBe(true);
    }
    // 09:30 이후 → enabled
    for (let i = 19; i < 48; i++) {
      expect(options[i].isDisabled).toBe(false);
    }
  });

  it('09:30 시작 기준 09:30까지 disable, 10:00부터 enable', () => {
    const options = getEndTimeOptions({ hour: 9, minute: 30 }, allSlots);
    expect(options.find((o) => o.label === '09:30')?.isDisabled).toBe(true);
    expect(options.find((o) => o.label === '10:00')?.isDisabled).toBe(false);
  });
});
