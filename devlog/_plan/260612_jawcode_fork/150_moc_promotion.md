# 150 MOC — 메인 런타임 승격 (기본 cli = jwc)

> 상태: ⬜. M2 마지막 밴드. 구 03 Phase 6 승계.

## 스코프

1. 도구 패리티 갭 목록: 벤더 CLI 고유 기능(웹검색, computer-use 라우팅, vision 등) vs
   gjc tools + cli-jaw `lib/mcp` 충당 범위 — **갭 표를 본 밴드 첫 문서로 작성**
2. 기본값 전환: 신규 세션 기본 cli=`jwc`, 벤더 CLI(claude/codex/gemini)는 fallback 체인 강등
3. 마이그레이션: 기존 인스턴스 settings.json의 cli 값 처리 — [기본값] 기존 값 존중, 신규만 jwc
4. 회귀 스위트: AGY/spawn 계열 기존 테스트 + 110–130 e2e를 승격 게이트로
5. OAuth ToS 그레이존 재평가 (090 이월) — 메인 승격으로 노출 증가하는 리스크 문서화

## [기본값] 결정

- 승격 조건: 130 done 3항목 + 140 검색 어댑터 + 패리티 갭 표에서 "차단급 갭 0건" 판정
- 롤백 스위치: settings 한 줄로 기존 spawn 경로 복귀 가능하게 유지 (한 릴리스 동안)

## 완료 기준

- 신규 세션이 기본 jwc로 생성, Web/Telegram/Discord 전 채널 스모크
- 회귀 스위트 통과 + 패리티 갭 표 승인
- 롤백 스위치 동작 검증

## 열린 질문

- 벤더 CLI fallback의 유지 기한 (영구 공존 vs 단계적 제거)
- heartbeat/goal/orchestrate 등 모든 서버 경로의 jwc 라우팅 전수 검사 범위
