# 020_prompt — devlog refs (gjc_origin)

> `020*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `020_moc_prompting.md` | # 020 MOC — 프롬프팅 개편 (jaw 아이덴티티) | 59 |
| `020_moc_prompting.md` | # 020 MOC — 프롬프팅 개편 (jaw 아이덴티티) | 59 |

## 2. MOC 헤딩 트리

# 020 MOC — 프롬프팅 개편 (jaw 아이덴티티)
## 코드 사실 (조사 완료)
## repo 기본값 (코드 확인 260612 03:09)
## 스코프
## 제안 (결정 필요 아님, 품질 장치)
## 완료 기준
## cli-jaw 리포 기본 아이덴티티 (코드 확인 260612 03:16 — 전제 교정)
## [확정] 사용자 identity 설정 표면 (260612 04:07 인터뷰 R12)
## 열린 질문

## 3. structure 교차

- `structure/architecture.md` (112 lines): # Jawcode 아키텍처 (현재 형태)
- `structure/conventions.md` (63 lines): # Jawcode 컨벤션
- `structure/extensibility.md` (69 lines): # Extensibility
- `structure/packages_overview.md` (58 lines): # Packages / Crates Overview
- `structure/prompt_flow.md` (78 lines): # Prompt Flow
- `structure/session_storage.md` (77 lines): # Session / Storage
- `structure/workflows.md` (59 lines): # Default Workflow Skills

## 4. 갱신·증거 규칙 (structure/conventions)

- absolute path:line 수동 검증
- generated 파일 수동 편집 금지
- AGENTS.md upstream contract

## 5. 관련 devlog 발췌 (상위 30줄)

### 020_moc_prompting.md

```markdown
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
2. 어휘 정합 [D10으로 확장, R14]: cli-jaw 보스-직원/PABCD/goal 어휘와 통일 + **시스템 프롬프트가 안내하는
   명령 예시도 cli-jaw 통일 표면(`jwc orchestrate/goal/memory`) 기준** (M2에서 같은 프롬프트 어휘 공유 대비)
3. 역할 프롬프트(agents/) 검토: planner/architect/critic은 050 병합의 입력 — 여기선 어휘만 손봄
4. 언어 정책: [기본값] `language.instruction` 패턴 재사용

## 제안 (결정 필요 아님, 품질 장치)

```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
