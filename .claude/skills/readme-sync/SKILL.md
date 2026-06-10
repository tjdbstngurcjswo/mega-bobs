---
name: readme-sync
description: Use when checking or updating README.md to reflect current code changes. Detects gaps and commits fixes. Invoke via /readme-sync or manually before PR.
allowed-tools: Bash(git:*), Read, Edit, Grep
---

# README 최신화 확인 스킬

PR 생성 전 README.md가 코드 변경사항을 충실히 반영하는지 검사하고, 필요하면 수정 후 커밋합니다.

## 체크 범위

README에 영향을 주는 변경 유형:

| 변경 유형                          | README에서 확인할 항목                |
| ---------------------------------- | ------------------------------------- |
| 새 환경변수 추가/삭제              | `## Environment Variables` 섹션       |
| 새 npm 스크립트 추가/삭제          | `## Commands` 섹션                    |
| 새 API 라우트 추가/삭제            | `## Architecture > API Routes` 테이블 |
| 새 주요 디렉토리/모듈 추가         | `## Architecture > Key Directories`   |
| 데이터 흐름 변경                   | `## Architecture > Data Flow`         |
| 새 외부 의존성 추가 (DB, 서드파티) | 해당 섹션                             |
| 프로젝트 개요·목적 변경            | 최상단 프로젝트 설명                  |

**체크 불필요 항목:** 내부 리팩터링, 버그 픽스, 스타일·타입 수정 — 동작·구조 변경 없으면 README 수정 불필요.

## 절차

### PHASE 1: 변경 내용 수집

다음을 **병렬**로 수집합니다:

```bash
# 1. 타겟 브랜치 대비 diff 통계
git diff <target-branch>...HEAD --stat

# 2. 타겟 브랜치 대비 전체 diff
git diff <target-branch>...HEAD
```

```
# 3. Read 도구로 README.md 전체 읽기
```

### PHASE 2: 갭 분석

diff를 읽고 아래 질문에 답합니다:

1. 새로 추가/삭제된 환경변수가 있는가? → README `Environment Variables`에 반영됐는가?
2. 새로 추가/삭제된 `pnpm` 스크립트가 있는가? → README `Commands`에 반영됐는가?
3. `src/app/api/` 아래 새 라우트가 생겼는가? → README `API Routes` 테이블에 있는가?
4. 새 주요 디렉토리·모듈이 생겼는가? → README `Key Directories`에 있는가?
5. 데이터 흐름이 달라졌는가? → README `Data Flow`가 맞는가?

**모두 최신이면 → PHASE 3 건너뛰고 완료 메시지 출력 후 종료.**

### PHASE 3: README 수정

누락·오래된 항목이 있으면:

1. **Edit 도구**로 README.md를 직접 수정합니다.
   - 기존 구조·포맷·언어(한국어)를 유지합니다.
   - **최소한의 변경**만 합니다 — 관련 없는 섹션을 건드리지 않습니다.
   - 추가 시 해당 섹션 맨 아래에 삽입, 삭제된 항목은 해당 행 제거.

2. 수정 후 커밋합니다:

```bash
git add README.md
git commit -m "docs: README 최신화 — <변경 요약 한 줄>"
```

### PHASE 4: 결과 보고

```
README 검사 완료:
- 상태: 수정됨 / 최신 상태 (변경 없음)
- 수정 항목: {항목1}, {항목2}  ← 수정된 경우만
- 커밋: {커밋 해시}             ← 수정된 경우만
```

## 주의사항

- 수정 범위는 **diff에서 확인된 변경사항**에 국한합니다.
- 불확실한 수정(예: 아키텍처 설명 재작성)은 임의로 고치지 말고 사용자에게 확인을 요청합니다.
- 수정이 없을 때도 "최신 상태" 메시지를 반드시 출력합니다.
