# architecture.md — gjc_origin

> **정본**: `structure/architecture.md` · side `gjc_origin`

## 1. structure/ 정본 전문

# Jawcode 아키텍처 (현재 형태)

> 2026-06-12 기준. gajae-code 0.4.4 fork, HEAD `2654e6c`.
> 미래 희망이 아닌 **현재 코드의 형태**를 기록한다. 로드맵은 devlog 참조.

## 1. 정체

Jawcode는 gajae-code(`gjc`) 모노레포의 포크다. gjc는 Bun 런타임 기반의
Claude Code급 풀 코딩 에이전트로, 프로바이더 계층부터 TUI까지 전부 자체 구현돼 있다.

- 런타임: **Bun 1.3.14** (workspaces + catalog)
- 린트/포맷: biome
- 네이티브: `crates/` (Rust, napi-rs → `@gajae-code/natives`), `python/robogjc` (web)

## 2. 패키지 맵

```
packages/
  ai/              @gajae-code/ai          — 44+ 프로바이더 스트리밍 계층 (stream.ts 디스패처)
  agent/           @gajae-code/agent-core  — 에이전트 루프, 상태, 컴팩션, transport 추상화
  coding-agent/    @gajae-code/coding-agent — gjc CLI 본체 (도구, 세션, 스킬, 슬래시커맨드, 모드)
  tui/             @gajae-code/tui         — 차등 렌더링 TUI 라이브러리
  utils/           @gajae-code/utils       — 공용 유틸
  stats/           @gajae-code/stats       — 사용량/통계
  natives/         @gajae-code/natives     — Rust napi 바인딩
  bridge-client/   @gajae-code/bridge-client — 원격 브리지
  gajae-code/      gajae-code              — npm 설치 래퍼 (bin: gjc)
  jwc/             jwc                     — jaw 표면 래퍼 (bin: jwc, export: ./sdk)
```

전체 package/crate 표는 [packages_overview.md](./packages_overview.md)가 정본이다.

| 핵심 패키지 | 현재 역할 | 근거 |
|---|---|---|
| `packages/jwc` | `jwc` bin + `jwc/sdk` public boundary wrapper | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1` |
| `packages/coding-agent` | 실제 CLI/runtime/SDK 구현 | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:796` |
| `packages/agent` | agent loop/core abstraction | `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:5` |
| `packages/ai` | provider/model/auth layer | `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:5` |
| `packages/natives` | Rust N-API native binding | `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:2`, `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:50` |

## 3. 핵심 시임 (cli-jaw 통합 관점)

### 3.1 `packages/jwc/src/sdk.ts` → `packages/coding-agent/src/sdk.ts` — 프로그래매틱 임베딩 (★ 최중요)

`createAgentSession(options)` 가 CLI 없이 에이전트 세션을 코드로 생성한다.
부속 API: `discoverSkills()`, `discoverSlashCommands()`, `discoverPromptTemplates()`,
`buildSystemPrompt()`, `discoverAuthStorage()`, `discoverExtensions()`.
→ cli-jaw 서버가 jawcode를 **in-process로 품는 공식 통로**.

| 표면 | 현재 사실 | 근거 |
|---|---|---|
| `jwc/sdk` | coding-agent SDK를 재수출한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1` |
| `createAgentSession()` | `CreateAgentSessionOptions`를 받아 `AgentSession`을 만든다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:796` |
| system prompt override | `options.systemPrompt`는 array 또는 default prompt transformer function이다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:240`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1613` |
| auth injection | `options.authStorage`와 `discoverAuthStorage()`가 credential bridge 지점이다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:225`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:409` |

### 3.2 `packages/coding-agent/src/modes/` — 실행 모드

- `interactive-mode.ts` — TUI 대화 모드 (기본)
- `print-mode.ts` — 단발 실행
- `rpc/` — JSONL RPC 모드 (cli-jaw pi-runtime과 동일 패턴의 사이드카 통로)
- `acp/` — Agent Client Protocol
- `bridge/` — 원격 브리지

### 3.3 `packages/agent/src/agent-loop.ts` — 에이전트 루프

`@gajae-code/ai`의 `streamSimple()` 위에서 tool call → 실행 → 피드백 루프.
`AppendOnlyContextManager`, 컴팩션(`compaction/`), thinking 제어 포함.

### 3.4 확장 표면 (스킬/슬래시커맨드/도구)

- `src/extensibility/skills.ts` — SKILL.md 디스커버리 (cli-jaw 전역 스킬과 같은 포맷 계열)
- `src/extensibility/slash-commands.ts` + `src/slash-commands/` — 슬래시커맨드 레지스트리
- `src/extensibility/custom-tools/` — 커스텀 도구 주입
- `src/tools/` — read/bash/edit/write/grep/browser/ast-edit 등 내장 도구
- 기본 워크플로 스킬 4종: jaw-interview / ralplan / ultragoal / team (fork runtime; upstream `AGENTS.md`는 `deep-interview` 표기 유지)

세부 표는 [extensibility.md](./extensibility.md)와 [workflows.md](./workflows.md)가 정본이다.

### 3.5 세션/상태

- `src/session/` — 세션 영속화 (agent db)
- `.gjc/` — 런타임 상태, 플랜, 스펙, 원장 (업스트림 계약상 고정 경로)

세부 storage 표는 [session_storage.md](./session_storage.md)가 정본이다.

## 4. cli-jaw 쪽 대응 시임 (참조)

| cli-jaw | 역할 | jawcode 대응 |
|---------|------|--------------|
| `src/agent/spawn.ts` `spawnAgent()` | 런타임 디스패치, `{child, promise}` 계약 | in-process 어댑터가 `child:null`로 반환 |
| `src/prompt/builder.ts` | 전역 스킬(`~/.cli-jaw/skills`) 시스템 프롬프트 주입 | `buildSystemPrompt()`/`discoverSkills()`와 브리지 |
| `src/orchestrator/state-machine.ts` | PABCD 단계 프롬프트 | 동일 프롬프트를 세션에 주입 (장기: 코드 레벨 게이팅) |
| `src/core/bus.ts` | 이벤트 브로드캐스트 | AgentEvent → bus 매핑 |
| `jaw.db` | 세션/메시지 영속화 | 네이티브 세션 저장 → spawn/resume 로직 불요 |

## 5. 미해결 결정 (devlog에서 추적)

1. **호스팅 방식**: Node 포팅(`Bun.*` 치환) vs cli-jaw를 Bun으로 vs Bun 사이드카(rpc 모드).
   `Bun.*` 사용처: ai 계층 ~20지점, agent 4파일, tui 7파일 (tui는 TUI 바이너리에만 필요).
2. **스킬 단일화**: cli-jaw 전역 스킬 vs gjc `.gjc` 디스커버리 — 어느 쪽으로 수렴할지.
3. **세션 소유권**: jaw.db vs gjc agent db.

## 6. M1/M2 로드맵 연결

| 마일스톤 | 코드상 접점 | 근거 |
|---|---|---|
| M1 010–019 jwc 셸 + 표면 리네이밍 | `packages/jwc/bin/jwc.js`, `packages/jwc/package.json` | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:13`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/bin/jwc.js:1` |
| M1 020–029 프롬프팅 개편 | `packages/coding-agent/src/system-prompt.ts`, `prompts/system/system-prompt.md` | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:14`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:372` |
| M1 030–039 스킬 디스커버리 3계층 | `extensibility/skills.ts`, `discovery/builtin.ts` | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:15`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:105` |
| M2 110–119 JawRuntime 상주 서비스 | `createAgentSession()` + event bus + session manager | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:25`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:796` |
| M2 120–129 jaw.db 영속화 | `SessionManager` override와 cli-jaw adapter | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:26`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:311` |

## 2. har_struct delta (origin vs patched)

| key | gjc_origin | jwc_patched |
|---|---|---|
| CLI | gjc | jwc + gjc |
| interview | deep-interview | jaw-interview |
| global skills | ~/.gjc/agent/skills | ~/.cli-jaw/skills |
| orchestrate | — | 050 WIP |


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 12

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `architecture`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
