export const SPARKLE_POSITIONS = [
  { left: '18%', bottom: '22%', size: 13, delay: '0s' },
  { left: '42%', bottom: '12%', size: 10, delay: '-1.2s' },
  { left: '65%', bottom: '28%', size: 12, delay: '-2.4s' },
  { left: '80%', bottom: '15%', size: 9, delay: '-0.6s' },
] as const;

export const PLANE_CONFIGS = [
  { size: 15, duration: 7, delay: 0, opacity: 1, top: '50%' },
  { size: 12, duration: 7, delay: -3.5, opacity: 0.5, top: '50%' },
  { size: 10, duration: 5.5, delay: -1.5, opacity: 0.75, top: '30%' },
  { size: 17, duration: 9, delay: -4.5, opacity: 0.65, top: '65%' },
  { size: 8, duration: 6, delay: -2, opacity: 0.8, top: '20%' },
  { size: 14, duration: 8, delay: -5, opacity: 0.6, top: '75%' },
  { size: 11, duration: 4.5, delay: -1, opacity: 0.85, top: '40%' },
  { size: 16, duration: 7.5, delay: -3, opacity: 0.45, top: '60%' },
] as const;

export const INITIAL_PLANE_COUNT = 2;

export const BOARD_EMPTY_COPY = {
  closed: {
    label: '휴무',
    title: '구내식당이 쉬는 날이에요',
    body: '인근 식당을 이용해 주세요',
    bodyPast: '다들 어디서 드셨나요?',
  },
  comingUp: {
    label: '메뉴 준비 중',
    title: '다음 주 메뉴를 준비하고 있어요',
    body: '매주 목요일에 업데이트돼요',
  },
} as const;
