const pad = (n: number) => String(n).padStart(2, '0');

/** 구내식당 운영 시각 config — 여기만 수정하면 전체 반영 */
const CAFETERIA = {
  openHour: 11,
  openMinute: 0,
  closeHour: 13,
  closeMinute: 15,
} as const;

export const CAFETERIA_OPEN_MIN =
  CAFETERIA.openHour * 60 + CAFETERIA.openMinute;

export const CAFETERIA_CLOSE_MIN =
  CAFETERIA.closeHour * 60 + CAFETERIA.closeMinute;

export const CAFETERIA_LABEL = `${pad(CAFETERIA.openHour)}:${pad(CAFETERIA.openMinute)} – ${pad(CAFETERIA.closeHour)}:${pad(CAFETERIA.closeMinute)}`;
