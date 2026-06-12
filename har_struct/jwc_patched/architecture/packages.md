# packages.md — jwc_patched

> **정본**: `structure/packages_overview.md` · side `jwc_patched`

## 1. structure/ 정본 전문

# Packages / Crates Overview

> jawcode는 Bun monorepo + Rust crates 구조다. jwc는 표면 wrapper이고, 현재 런타임 본체는 `@gajae-code/coding-agent`에 있다.

## 의존 방향

```text
jwc wrapper
  -> @gajae-code/coding-agent
       -> @gajae-code/agent-core
       -> @gajae-code/ai
       -> @gajae-code/tui
       -> @gajae-code/natives
       -> @gajae-code/utils
       -> @gajae-code/stats
@gajae-code/natives
  -> crates/pi-natives
       -> crates/pi-ast
       -> crates/pi-iso
       -> crates/pi-shell
            -> crates/brush-*-vendored
```

## `packages/*`

| 패키지 | 역할 | 핵심 진입 파일/표면 | 의존 방향 | 근거 |
|---|---|---|---|---|
| `packages/jwc` | jaw 표면 CLI wrapper. 현재 `jwc` bin은 coding-agent CLI를 재수출한다. | `bin/jwc.js`, `src/sdk.ts`, `src/index.ts` | `@gajae-code/coding-agent`만 의존 | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/bin/jwc.js:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1` |
| `packages/coding-agent` | GJC/JWC CLI 본체. 도구, 세션, 스킬, 슬래시커맨드, prompt, mode, workflow runtime이 있다. | `src/cli.ts`, `src/sdk.ts`, `src/main.ts` | `agent-core`, `ai`, `natives`, `tui`, `utils`, `stats` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:30`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:49` |
| `packages/agent` | provider-agnostic agent loop/core. transport/state/attachment abstraction. | `src/index.ts` export | `ai`, `natives`, `utils` | `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:27`, `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:37` |
| `packages/ai` | provider/model registry, stream, auth broker/gateway, OAuth/API key 계층. | `src/index.ts`, `src/cli.ts`(`pi-ai`) | `utils`, OpenAI/Anthropic SDK 등 외부 provider deps | `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:31`, `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:43` |
| `packages/tui` | differential rendering 기반 terminal UI library. | `src/index.ts`, `src/components/*` exports | `natives`, `utils` | `/Users/jun/Developer/new/700_projects/jawcode/packages/tui/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/tui/package.json:40`, `/Users/jun/Developer/new/700_projects/jawcode/packages/tui/package.json:58` |
| `packages/natives` | Rust N-API binding package. grep/clipboard/image/PTY/shell/syntax highlighting. | `native/index.js`, `native/index.d.ts` | Rust `crates/pi-natives` 빌드 산출물 | `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:2`, `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:29`, `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:50` |
| `packages/utils` | 경로, config dir, logger, prompt/render helper 등 공용 유틸. | `src/index.ts` | `natives`, handlebars, winston | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/package.json:23`, `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/package.json:33` |
| `packages/stats` | local observability dashboard. | `src/index.ts`, `gjc-stats` bin | `ai`, `utils`, React/Tailwind/Chart deps | `/Users/jun/Developer/new/700_projects/jawcode/packages/stats/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/stats/package.json:27`, `/Users/jun/Developer/new/700_projects/jawcode/packages/stats/package.json:39` |
| `packages/bridge-client` | GJC backend bridge protocol TypeScript client SDK. | `src/index.ts` | 독립 TS SDK | `/Users/jun/Developer/new/700_projects/jawcode/packages/bridge-client/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/bridge-client/package.json:22`, `/Users/jun/Developer/new/700_projects/jawcode/packages/bridge-client/package.json:41` |
| `packages/gajae-code` | npm one-line install wrapper. `gjc` bin wrapper. | `bin/gjc.js` | `@gajae-code/coding-agent` | `/Users/jun/Developer/new/700_projects/jawcode/packages/gajae-code/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/gajae-code/package.json:29`, `/Users/jun/Developer/new/700_projects/jawcode/packages/gajae-code/package.json:32` |
| `packages/orchestration-token-benchmark` | orchestration token efficiency internal benchmark. live model call 없는 deterministic benchmark가 기본이다. | `src/index.ts`, `src/live-runner.ts` | private package | `/Users/jun/Developer/new/700_projects/jawcode/packages/orchestration-token-benchmark/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/orchestration-token-benchmark/package.json:6`, `/Users/jun/Developer/new/700_projects/jawcode/packages/orchestration-token-benchmark/package.json:22` |
| `packages/typescript-edit-benchmark` | TypeScript edit mutation benchmark. | `src/index.ts`, `typescript-edit-benchmark` bin | `coding-agent`, `agent-core`, `ai`, `tui`, AST deps | `/Users/jun/Developer/new/700_projects/jawcode/packages/typescript-edit-benchmark/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/typescript-edit-benchmark/package.json:15`, `/Users/jun/Developer/new/700_projects/jawcode/packages/typescript-edit-benchmark/package.json:28` |

## `crates/*`

| crate | 역할 | 핵심 surface | 근거 |
|---|---|---|---|
| `crates/pi-natives` | N-API `cdylib`; TS native package로 연결되는 Rust entry. | `crate-type = ["cdylib"]`, `napi`, `napi-derive` | `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-natives/Cargo.toml:1`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-natives/Cargo.toml:9`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-natives/Cargo.toml:31` |
| `crates/pi-ast` | tree-sitter/ast-grep 기반 AST parsing helper. | 다수 tree-sitter grammar dependencies | `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-ast/Cargo.toml:1`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-ast/Cargo.toml:12`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-ast/Cargo.toml:69` |
| `crates/pi-iso` | OS isolation/portable helper 계층. | `tokio`, `similar`, platform deps | `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-iso/Cargo.toml:1`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-iso/Cargo.toml:12`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-iso/Cargo.toml:17` |
| `crates/pi-shell` | shell execution helper. brush vendored crates를 사용한다. | `brush-builtins`, `brush-core`, `brush-parser` | `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-shell/Cargo.toml:1`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-shell/Cargo.toml:12`, `/Users/jun/Developer/new/700_projects/jawcode/crates/pi-shell/Cargo.toml:15` |
| `crates/brush-builtins-vendored` | vendored POSIX/bash shell builtins. | upstream brush package metadata | `/Users/jun/Developer/new/700_projects/jawcode/crates/brush-builtins-vendored/Cargo.toml:1`, `/Users/jun/Developer/new/700_projects/jawcode/crates/brush-builtins-vendored/Cargo.toml:12`, `/Users/jun/Developer/new/700_projects/jawcode/crates/brush-builtins-vendored/Cargo.toml:23` |
| `crates/brush-core-vendored` | vendored reusable POSIX/bash shell core. | `brush_core` lib | `/Users/jun/Developer/new/700_projects/jawcode/crates/brush-core-vendored/Cargo.toml:1`, `/Users/jun/Developer/new/700_projects/jawcode/crates/brush-core-vendored/Cargo.toml:12`, `/Users/jun/Developer/new/700_projects/jawcode/crates/brush-core-vendored/Cargo.toml:49` |

## M1/M2 관점의 의미

| 구분 | 현재 상태 | 개발 판단 | 근거 |
|---|---|---|---|
| M1 `jwc` 표면 | `packages/jwc`는 wrapper만 있고, bin은 coding-agent CLI import 1줄이다. | 표면 리네이밍은 `packages/jwc`와 coding-agent CLI help/branding에서 진행한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/bin/jwc.js:1`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:12` |
| M2 임베딩 | `packages/jwc/src/sdk.ts`가 `@gajae-code/coding-agent/sdk`를 재수출한다. | cli-jaw는 내부 `@gajae-code/*`가 아니라 `jwc/sdk`를 import해야 리베이스 흡수 지점이 생긴다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15` |
| Node 포팅 위험 | package engines는 Bun `>=1.3.14`가 기본이다. | M2 Node 포팅은 `bun:sqlite`, Bun imports, Bun APIs를 별도 밴드에서 다뤄야 한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:77`, `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:48`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:17` |

## 2. har_struct delta (origin vs patched)

| key | gjc_origin | jwc_patched |
|---|---|---|
| CLI | gjc | jwc + gjc |
| interview | deep-interview | jaw-interview |
| global skills | ~/.gjc/agent/skills | ~/.cli-jaw/skills |
| orchestrate | — | 050 WIP |


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 12

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
