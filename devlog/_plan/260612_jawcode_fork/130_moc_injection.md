# 130 MOC — 스킬·PABCD·인증 주입 (cli-jaw 측) = M2 Done 지점

> 📐 상세 설계: [111_design_runtime_attach.md](./111_design_runtime_attach.md) §5 — 030 brand-aware 디스커버리 덕에
> 스킬 주입 1차 경로가 "서버 GJC_BRAND_NAME=jwc 설정"으로 단순화됨 (프롬프트 합성 주입안 대체).

> 상태: ⬜. 결정 근거: D5/D7 [확정]. **이 밴드 완료 = M2 done 3항목 충족.**

## 스코프 A — 스킬 주입 (M2 done ③)

1. [기본값] 1차는 프롬프트 합성 경로: cli-jaw `src/prompt/builder.ts` 산출(스킬 목록 포함)을
   `createAgentSession()` 시스템 프롬프트로 주입 — 최소 작업, 기존 Web UI와 표면 동일
2. 2차(개선): 030의 디스커버리 3계층을 임베디드 런타임에도 활성 — SKILL.md 본문을 도구로 직접 읽는
   gjc 네이티브 방식과 cli-jaw "읽어라" 지시 방식의 중복 제거
3. 충돌 주의: 020 jaw 아이덴티티 오버레이와 cli-jaw 시스템 프롬프트의 이중 적용 방지 — 합성 규칙 1개로 통일

> [D10 이득, R14] M1에서 jwc 명령 표면이 cli-jaw와 통일되므로(orchestrate/goal/memory),
> 임베딩 시 프롬프트·스킬·사용자 학습의 어휘 충돌이 원천 제거 — 130의 단일화 작업이 "표면 정합"이 아니라
> "엔진 연결"만으로 줄어듦.

## 스코프 B — PABCD 연결

1. cli-jaw orchestrate 상태머신(P/A/B/C/D 프롬프트 생성)이 JawRuntime 세션에 단계 프롬프트 주입
2. [기본값] 장기 목표(050 열린 질문의 단일화): cli-jaw 상태머신을 정본으로, jwc 단독 PABCD(050)는
   같은 텍스트 리소스를 공유 — 사본 드리프트 방지
3. 단계별 도구 게이팅: P/A에서 write/edit 비활성 (gjc role agent read-only 패턴 재사용)

## 스코프 C — 인증 공유 (M2 done ②)

1. cli-jaw 서버와 jwc TUI가 같은 AuthStorage(agentDir) 사용 — `discoverAuthStorage` 주입 [확정 D7]
2. 090 시딩 브리지를 cli-jaw 기동 경로에서도 호출 (서버가 먼저 떠도 토큰 사용 가능)

## M2 Done 검증 (3항목)

| # | 항목 | 검증 |
|---|------|------|
| ① | spawn 없는 jaw chat | 110 완료 기준 승계 + 회귀 |
| ② | 로컬 토큰 즉시 사용 | 신규 머신 시나리오: Claude 로그인만으로 Web UI 대화 |
| ③ | `~/.cli-jaw/skills` 주입 | Web UI에서 스킬 발동 e2e (search/diagram 등 실스킬 1개) |

## 열린 질문

- 스킬 주입 1차(프롬프트)→2차(네이티브) 전환 시점
- cli-jaw A1 시스템 프롬프트(`src/prompt/templates/a1-system.md`)와 gjc 시스템 프롬프트의 권한 어휘 충돌 목록
