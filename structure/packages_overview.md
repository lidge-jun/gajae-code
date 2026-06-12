# Packages / Crates Overview

> jawcode는 Bun monorepo + Rust crates 구조다. 공개 CLI는 `jwc`이고, 현재 런타임 본체는 `@gajae-code/coding-agent`에 있다.

## 의존 방향

```text
jwc CLI/package
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
| `packages/jwc` | jwc 공개 CLI wrapper. 현재 `jwc` bin은 coding-agent CLI를 재수출한다. | `bin/jwc.js`, `src/sdk.ts`, `src/index.ts` | `@gajae-code/coding-agent`만 의존 | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/bin/jwc.js:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1` |
| `packages/coding-agent` | jwc CLI 본체. 도구, 세션, 스킬, 슬래시커맨드, prompt, mode, workflow runtime이 있다. | `src/cli.ts`, `src/sdk.ts`, `src/main.ts` | `agent-core`, `ai`, `natives`, `tui`, `utils`, `stats` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:30`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:49` |
| `packages/agent` | provider-agnostic agent loop/core. transport/state/attachment abstraction. | `src/index.ts` export | `ai`, `natives`, `utils` | `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:27`, `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:37` |
| `packages/ai` | provider/model registry, stream, auth broker/gateway, OAuth/API key 계층. | `src/index.ts`, `src/cli.ts`(`pi-ai`) | `utils`, OpenAI/Anthropic SDK 등 외부 provider deps | `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:31`, `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/package.json:43` |
| `packages/tui` | differential rendering 기반 terminal UI library. | `src/index.ts`, `src/components/*` exports | `natives`, `utils` | `/Users/jun/Developer/new/700_projects/jawcode/packages/tui/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/tui/package.json:40`, `/Users/jun/Developer/new/700_projects/jawcode/packages/tui/package.json:58` |
| `packages/natives` | Rust N-API binding package. grep/clipboard/image/PTY/shell/syntax highlighting. | `native/index.js`, `native/index.d.ts` | Rust `crates/pi-natives` 빌드 산출물 | `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:2`, `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:29`, `/Users/jun/Developer/new/700_projects/jawcode/packages/natives/package.json:50` |
| `packages/utils` | 경로, config dir, logger, prompt/render helper 등 공용 유틸. | `src/index.ts` | `natives`, handlebars, winston | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/package.json:23`, `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/package.json:33` |
| `packages/stats` | local observability dashboard. | `src/index.ts`, `gjc-stats` legacy package bin | `ai`, `utils`, React/Tailwind/Chart deps | `/Users/jun/Developer/new/700_projects/jawcode/packages/stats/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/stats/package.json:27`, `/Users/jun/Developer/new/700_projects/jawcode/packages/stats/package.json:39` |
| `packages/bridge-client` | jwc backend bridge protocol TypeScript client SDK. | `src/index.ts` | 독립 TS SDK | `/Users/jun/Developer/new/700_projects/jawcode/packages/bridge-client/package.json:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/bridge-client/package.json:22`, `/Users/jun/Developer/new/700_projects/jawcode/packages/bridge-client/package.json:41` |
| `packages/gajae-code` | REMOVED legacy shell wrapper. repo 내 공개 진입은 `packages/jwc` 하나다. | — | — | `structure/fork_logic_changelog.md:28` |
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
| M1 `jwc` 표면 | `packages/jwc`는 wrapper만 있고, bin은 coding-agent CLI import 1줄이다. | 공개 표면은 `packages/jwc`와 coding-agent CLI help/branding에서 jwc 기준으로 유지한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/bin/jwc.js:1`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md:12` |
| M2 임베딩 | `packages/jwc/src/sdk.ts`가 `@gajae-code/coding-agent/sdk`를 재수출한다. | cli-jaw는 내부 `@gajae-code/*`가 아니라 `jwc/sdk`를 import해야 리베이스 흡수 지점이 생긴다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15` |
| Node 포팅 위험 | package engines는 Bun `>=1.3.14`가 기본이다. | M2 Node 포팅은 `bun:sqlite`, Bun imports, Bun APIs를 별도 밴드에서 다뤄야 한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:77`, `/Users/jun/Developer/new/700_projects/jawcode/packages/agent/package.json:48`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:17` |
