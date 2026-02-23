export const WEEKS = ['일', '월', '화', '수', '목', '금', '토'];

// 주최자 모드에서 날짜 선택 가능한 최대 범위 (다음해 2월까지)
export const HOST_RANGE_LIMIT_MONTH = 2; // 0-indexed (2 = March? No, 1 is Feb. Let's use logic for next year Feb)
// Actually logic will be handle in component: Current Year Dec + Next Year Jan, Feb.

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
