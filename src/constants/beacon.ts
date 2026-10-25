/** beacon 수집 서버(hongsoohyuk.com)에서 메가밥스 이벤트를 구분하는 키 */
export const BEACON_SITE_ID = 'mega-bobs';

/**
 * 브라우저 SDK가 보내는 같은 오리진 경로. 수집 서버 CORS 허용 목록에 메가밥스가
 * 없으므로 /api/collect 가 서버 간 요청으로 대신 전달한다.
 */
export const BEACON_ENDPOINT = '/api/collect';

export const BEACON_COLLECT_URL = 'https://hongsoohyuk.com/api/collect';

/** SDK가 64KB 단위로 나눠 보내므로 그보다 큰 본문은 거른다 */
export const BEACON_MAX_BODY_BYTES = 64 * 1024;
