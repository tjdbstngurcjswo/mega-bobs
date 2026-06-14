---
name: design-system-guard
description: UI·스타일 코드 작성 또는 리뷰 시 DESIGN.md 토큰·규칙 위반을 검출하고 수정 제안. 컴포넌트 구현, 스타일 변경, QA 시 발동.
---

# Design System Guard

## STEP 1: DESIGN.md 로드

`DESIGN.md` (repo root)를 Read로 읽는다. 이미 읽었으면 스킵.

## STEP 2: 금지 패턴 체크

DESIGN.md 기준으로 대상 파일을 grep/Read로 확인한다.

## STEP 3: 접근성 체크

- 인터랙티브 요소 터치 타깃 44px 미만 여부
- `focus-visible` 없는 버튼/링크
- `aria-label` / `aria-pressed` / `aria-disabled` / `aria-hidden` 누락 여부

## STEP 4: 위반 리포트

```
🚨 디자인 시스템 위반 발견

| 파일:줄 | 패턴 | 위반 유형 | 수정 제안 |
|---|---|---|---|
| SiteHeader.tsx:42 | `border border-line` | 카드 border 금지 | `shadow-[var(--shadow-card)]` |
```

위반이 없으면: "✅ 디자인 시스템 규칙 통과"

## STEP 5: 구현 지침

- 조건부 렌더 요소(투표 버튼, 상태 배지 등) 마운트 시 → `animate-[fadeIn_0.3s_ease_both]`
- 컨테이너 높이 변경 시 → Web Animations API로 보간, `overflow-hidden` 함께 적용
- **페이지 로드 시 fadeUp·stagger 입장 애니메이션 금지**
