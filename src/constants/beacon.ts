/** beacon 수집 서버(hongsoohyuk.com)에서 메가밥스 이벤트를 구분하는 키 */
export const BEACON_SITE_ID = 'mega-bobs';

/** 수집 서버. CORS 허용 목록에 메가밥스 도메인이 등록되어 있어 브라우저가 직접 보낸다 */
export const BEACON_COLLECT_URL = 'https://hongsoohyuk.com/api/collect';

/**
 * 수집 서버 CORS 허용 목록과 같아야 하는 호스트. 목록 밖 오리진에서 보내면
 * 저장은 되지만 응답을 못 읽어 SDK가 재시도하고 이벤트가 중복 저장된다.
 */
export const BEACON_ALLOWED_HOSTS = ['megabobs.vercel.app'];

/** 서버 이벤트 전송 대기 한도. 수집 서버 지연이 슬랙 함수 실행을 붙잡지 않게 한다 */
export const BEACON_SERVER_TIMEOUT_MS = 3000;
