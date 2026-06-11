# 020 MOC — 프롬프팅 개편 (jaw 아이덴티티)

> 상태: ⬜. 입력: 코드 사실 — 프롬프트는 전부 모듈형 .md (`packages/coding-agent/src/prompts/`).

## 코드 사실 (조사 완료)

- `prompts/system/system-prompt.md` + 보조 모듈 23개 (plan-mode, auto-continue, web-search, subagent 등)
- `prompts/system/custom-system-prompt.md` — 커스텀 시스템 프롬프트 공식 통로 기존재
- `prompts/agents/` — planner/architect/critic/executor/explore/reviewer 등 역할 프롬프트 10개
- `sdk.ts buildSystemPrompt(options)` — 임베딩 측에서 시스템 프롬프트 교체/합성 가능
- AGENTS.md 디렉토리 컨텍스트 자동 디스커버리 (`sdk.ts:453`)

## repo 기본값 (코드 확인 260612 03:09)

- **공식 오버레이 메커니즘 기존재**: `createAgentSession({ systemPrompt })` 옵션이
  `string[] | ((defaultPrompt: string[]) => string[])` (sdk.ts:241) — 함수형으로 넘기면
  기본 프롬프트를 받아 가공해 반환. **별도 모듈 추가 없이 repo 방식 그대로 오버레이 가능**
- 언어 정책: deep-interview에 `language.instruction` 사용자 언어 추종 패턴 기존재

## 스코프

1. jaw 아이덴티티 오버레이: [기본값 메커니즘 사용] `systemPrompt: (def) => [...def, JAW_IDENTITY]`
   — 업스트림 prompts/ 파일 무수정, jwc 셸에서 주입 (이름/말투/한국어 규칙/존칭)
2. 어휘 정합: cli-jaw 보스-직원/PABCD/goal 어휘와 통일 (M2에서 같은 프롬프트 어휘 공유 대비)
3. 역할 프롬프트(agents/) 검토: planner/architect/critic은 050 병합의 입력 — 여기선 어휘만 손봄
4. 언어 정책: [기본값] `language.instruction` 패턴 재사용

## 제안 (결정 필요 아님, 품질 장치)

- 스냅샷 테스트로 jaw 프리셋 고정 (프롬프트 회귀 방지)

## 완료 기준

- jwc 기동 → 시스템 프롬프트에 jaw 아이덴티티 블록 포함 (스냅샷 테스트)
- 동일 입력에 대한 gjc/jwc 프롬프트 diff가 의도된 오버레이뿐임을 문서화

## cli-jaw 리포 기본 아이덴티티 (코드 확인 260612 03:16 — 전제 교정)

- cli-jaw **리포 기본값** = `src/prompt/templates/a2-default.md`:
  Name `Jaw`, Emoji 🦈, Vibe "Friendly, warm / Technically accurate", Language English
- 미소녀/이모지 톤은 리포에 없음(grep 0건) — **사용자 인스턴스 settings로 주입되는 값**이지 기본값이 아님
- → jwc 아이덴티티도 같은 구조로: [기본값] 중립 아이덴티티(a2-default 상당: Jaw 🦈, friendly+technically accurate)
  + 사용자 vibe는 설정 주입 계층으로 분리. "미소녀 톤 적용 여부"는 설계 결정이 아니라 사용자 설정의 몫

## 열린 질문

- jwc 사용자 설정 주입 표면: cli-jaw a2 템플릿 오버라이드처럼 jwc도 사용자 설정 파일에서 identity/vibe를
  읽을지, 1차는 고정 중립으로 갈지
- AGENTS.md vs CLAUDE.md 디스커버리 우선순위
