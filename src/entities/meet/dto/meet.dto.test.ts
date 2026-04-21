import { describe, expect, it } from 'vitest';

import { createMeetRequestDto } from './meet.dto';

describe('createMeetRequestDto', () => {
  const baseRequest = {
    title: '2월 스터디',
    hostName: '주최자',
    dates: ['2026-02-20', '2026-02-21'],
  };

  it('timeRange 미포함 시 성공하고 결과 객체에 timeRange 키가 없다', () => {
    const result = createMeetRequestDto.parse(baseRequest);
    expect(result).toEqual(baseRequest);
    expect('timeRange' in result).toBe(false);
  });

  it('유효한 timeRange(09:00 ~ 12:00) 포함 시 성공한다', () => {
    const body = {
      ...baseRequest,
      timeRange: { startTime: '09:00', endTime: '12:00' },
    };
    const result = createMeetRequestDto.parse(body);
    expect(result.timeRange).toEqual({
      startTime: '09:00',
      endTime: '12:00',
    });
  });

  it('startTime이 30분 단위가 아니면 regex 검증에 실패한다', () => {
    const body = {
      ...baseRequest,
      timeRange: { startTime: '09:15', endTime: '12:00' },
    };
    expect(() => createMeetRequestDto.parse(body)).toThrow();
  });

  it('startTime > endTime이면 refine 검증에 실패한다', () => {
    const body = {
      ...baseRequest,
      timeRange: { startTime: '12:00', endTime: '09:00' },
    };
    expect(() => createMeetRequestDto.parse(body)).toThrow();
  });

  it('startTime === endTime이면 refine 검증에 실패한다', () => {
    const body = {
      ...baseRequest,
      timeRange: { startTime: '09:00', endTime: '09:00' },
    };
    expect(() => createMeetRequestDto.parse(body)).toThrow();
  });

  it('endTime이 24:00이면 regex 검증에 실패한다', () => {
    const body = {
      ...baseRequest,
      timeRange: { startTime: '23:30', endTime: '24:00' },
    };
    expect(() => createMeetRequestDto.parse(body)).toThrow();
  });
});
