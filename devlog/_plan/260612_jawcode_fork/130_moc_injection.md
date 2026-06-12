# 130 MOC — 스킬·PABCD·인증 주입 (cli-jaw 측) = M2 Done 지점

> 📐 상세 설계: [111_design_runtime_attach.md](./111_design_runtime_attach.md) §5 — 030 brand-aware 디스커버리 덕에
> 스킬 주입 1차 경로가 "서버 GJC_BRAND_NAME=jwc 설정"으로 단순화됨 (프롬프트 합성 주입안 대체).

> 상태: ⬜. 결정 근거: D5/D7 [확정]. **이 밴드 완료 = M2 done 3항목 충족.**
> **260613 플립 기준 재구체화 (gjc→jwc flip 반영)** — 앵커 재검증·추가:
> `loadSkills`(`src/extensibility/skills.ts:108`, dir 단위는 `:71 loadSkillsFromDir`) ·
> `discoverAuthStorage`(`src/sdk.ts:409`, 세션 주입 계약은 `sdk.ts:225` AuthStorage 옵션) ·
> pabcd 상태 정본 `src/jwc-runtime/orchestrate-state.ts`(구 gjc-runtime — 플립) ·
> 스킬 임베디드 prefix `embedded:jwc/`(`jwc-defaults.ts`). **이별 교차(99.30.02→260613 확정)**:
> 주입 대상 워크플로 스킬은 jaw-interview·ultragoal·team — ralplan은 superseded 스텁이라
> 주입 카탈로그에서 제외 후보 (착수 시 CANONICAL_JWC_WORKFLOW_SKILLS 축소와 동행 검토).

## 스코프 A — 스킬 주입 (M2 done ③)

> ⚓ 상위 원칙 [D112-2, 260612]: cli-jaw = 영속 인스턴스(메모리·스킬의 주체) / jwc = 일회용 병렬
> 세션(소비자). 스킬·메모리는 **하향 주입만**, 세션의 자체 축적(consolidation)은 임베디드에서 격하/비활성
> [확정 260612: **비활성 — 주입만**, 격하안 기각] — [112_moc_gui.md](./112_moc_gui.md) §인스턴스 vs 세션.

1. [기본값] 1차는 프롬프트 합성 경로: cli-jaw `src/prompt/builder.ts` 산출(스킬 목록 포함)을
   `createAgentSession()` 시스템 프롬프트로 주입 — 최소 작업, 기존 Web UI와 표면 동일
2. 2차(개선): 030의 디스커버리 3계층을 임베디드 런타임에도 활성 — SKILL.md 본문을 도구로 직접 읽는
   jwc 네이티브 방식과 cli-jaw "읽어라" 지시 방식의 중복 제거
3. 충돌 주의: 020 jaw 아이덴티티 오버레이와 cli-jaw 시스템 프롬프트의 이중 적용 방지 — 합성 규칙 1개로 통일

> [D10 이득, R14] M1에서 jwc 명령 표면이 cli-jaw와 통일되므로(orchestrate/goal/memory),
> 임베딩 시 프롬프트·스킬·사용자 학습의 어휘 충돌이 원천 제거 — 130의 단일화 작업이 "표면 정합"이 아니라
> "엔진 연결"만으로 줄어듦.

## 스코프 B — PABCD 연결

1. cli-jaw orchestrate 상태머신(P/A/B/C/D 프롬프트 생성)이 JawRuntime 세션에 단계 프롬프트 주입
2. **[확정 D130-1, 260612]** 정본 규칙은 "어느 저장소가 이기느냐"가 아니라 **스코프 분리**:
   cli-jaw `orc_state`(단일 행, 서버당 1개)와 jwc `pabcd-state.json`(cwd·세션당 N개)은 **같은 사실의
   중복 저장이 아니라 다른 스코프의 상태**다.
   - cli-jaw DB = **boss 파이프라인 정본** ("회사가 지금 무슨 단계인가", 전사 1개)
   - jwc 상태 파일 = **세션/프로젝트 로컬 파이프라인** ("이 작업장이 지금 무슨 단계인가")
   - 동기화는 **단방향 주입만**: boss 단계 → 임베디드 jwc 세션 컨텍스트 (99.03 M2 헤더 레일 재사용).
     역방향 sync 금지 — N개 세션 → 1행 머지 문제 원천 차단. 세션 로컬 pabcd가 boss와 다른 단계여도 모순 아님.
   - 상향은 sync가 아니라 **보고**: worker verdict/체크포인트는 기존 dispatch 결과·`orchestrate verdict`
     경로로 boss가 수신 후 boss가 DB에 기록 (cli-jaw 현행 모델 유지).
   - 세부는 jaw 적용 시 **튜닝으로 보정** [사용자 확정]: ① 하향 주입 표기(boss/로컬 동시 활성 시
     `[BOSS — B] · [LOCAL — P]` 이중 라벨 vs boss 단독), ② 주입 시점(매 턴 vs 단계 변화 시),
     ③ HUD 세그먼트의 스코프 우선순위, ④ 자가 전이 단락 훅(아래 열린 질문)과의 결합.
   - (구 [기본값] "cli-jaw 상태머신을 정본으로"는 boss 스코프에 한정해 유지; 텍스트 리소스 공유로
     사본 드리프트 방지 원칙도 유지.)
3. 단계별 도구 게이팅: P/A에서 write/edit 비활성 (jwc role agent read-only 패턴 재사용 — `src/jwc-runtime/restricted-role-agent-bash.ts`)

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
- cli-jaw A1 시스템 프롬프트(`src/prompt/templates/a1-system.md`)와 jwc 시스템 프롬프트의 권한 어휘 충돌 목록
- 자가 전이 단락 훅: 상주 환경에서 모델의 `jwc orchestrate <stage>` shell 호출을 in-process로 가로채는
  방식 (BashTool 인터셉트 vs 전용 도구 등록) — [111 §착수 전 실측 보강](./111_design_runtime_attach.md) 열린 질문 2 승계
- D130-1 튜닝 항목 ①~④의 확정 시점 (130 착수 시 프로토타입으로 결정)
