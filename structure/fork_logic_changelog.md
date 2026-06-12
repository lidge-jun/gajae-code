# Fork logic changelog (jawcode vs gajae-code upstream)

> **정본**: upstream `67427c6` 대비 worktree `81bcea96`의 **동작·계약·런타임** 변경. 파일 목록은 [fork-delta.md](./fork-delta.md), 밴드 스냅샷은 [struct_har/](../struct_har/README.md).  
> **미구현 갭(99)**: pabcd discovery·memory CLI·CI 등은 [jwc_readiness.md](./jwc_readiness.md) · [099_stabilization](../struct_har/jwc_patched/099_stabilization/01_overview.md).
> 생성: git `log upstream/main..HEAD` + 주요 커밋 메시지·diff 경로 교차 (2026-06-13).

## 요약 축

| 축 | 핵심 로직 변경 |
|---|---|
| **표면** | `jwc` 단일 CLI; `gjc` 셸 패키지 제거; `APP_NAME`/`ENGINE_NAME` 분리; `jwc://` URL 스킴 |
| **경로** | 런타임 `.jwc/` + `migrate-config-dir` 원타임; 세션 env `JWC_*`↔`GJC_*` 미러 |
| **인터뷰** | `deep-interview` → `jaw-interview`; gate·mutation-guard·structured ask·설정 `jwc.interview.*` |
| **PABCD** | `orchestrate`/`pabcd` 네이티브 state machine + stage prompts + jaw-only brand gate |
| **Goal** | `goal` CLI + `goal-runtime` 어댑터; ultragoal 엔진 유지, 세션 goal mode 연동 |
| **스킬** | cli-jaw 글로벌 스킬 치환; dev 스킬 어휘; stage-skill-map 주입 |
| **프롬프트** | system/tools/agents 하드 jaw화; `agent-identity`; identity leak 테스트 |
| **TUI** | abyss-bite 테마; 도구 접기/간격/추론 세그먼트; provider 탭; `/quota`·`/effort` |
| **Auth** | 로컬 토큰 autodetect/import; kiro provider+OAuth; stale credential 정리 |
| **Cursor** | host model pin; native tool-call 실행/렌더 수정; autocompact estimate 폴백 |
| **가드** | bash allowlist·mutation-guard·default-gjc-definitions **jwc 기준 반전** |

---

## 010 — 셸·브랜드·릴리스

- `packages/jwc`: bin `jwc`, `jwc/sdk` 재수출; `cli-entry` 번들 퍼블리시 (P12).
- `packages/gajae-code` **삭제** — 더 이상 repo 내 `gjc` bin 없음.
- `dirs.ts`: `APP_NAME` 기본 `jwc`, config `~/.jwc`; `ENGINE_NAME`/`gjc` 내부 식별자 보존.
- `rebrand-inventory` / `verify-g002-gates`: 기대 bin·스킬 4종을 **jwc 어휘**로 확장·반전.
- 커밋: `7d55513b` jwc shell, `bb6571a0` gjc bin 제거, `6c9b3c53` jwc publish, `59d10c66` ENGINE/APP split.

## 020 — 프롬프트·정체성

- `system-prompt.md`: legacy gajae-code 산문 → Jaw/jwc 워크플로 표면; skill XML `jaw-interview`·`jwc` CLI 예시.
- `agent-identity.ts`: 설정 기반 이름/말투/언어 블록 (`identity.*` settings).
- Role agents (`planner`/`architect`/`critic`): bash allowlist **jwc** 접두; ralplan state 쓰기만 허용.
- Tools prompts (`bash`, `skill`, memory tools): 브랜드·경로 `.jwc` 정합.
- `system-prompt-identity.test.ts` / `agent-identity-leak.test.ts`: TUI "너는 누구야" → Jaw, legacy gajae-code 비언급.
- 커밋: `da701492`–`ff11c848` C7–C8, `db31d4bd` C12, `59043f77` identity settings.

## 030 — 스킬 디스커버리

- `discovery/cli-jaw.ts` **NEW**: `~/.cli-jaw/skills` 등 cli-jaw 루트 병합.
- `extensibility/skills.ts`: jaw-brand **substitution model** (글로벌 스킬명 치환).
- `cli-jaw-vocab.ts`: dev 스킬 본문 어휘 맵 (057).
- `DEFAULT_GJC_DEFINITION_NAMES`: `jaw-interview` (upstream `deep-interview`).
- 커밋: `49da5846` discovery, `02ca8ba2` C11, `af7523f9` jaw-brand.

## 040 — Interview

- Rename: `deep-interview` → `jaw-interview` (SKILL, runtime, gate, guards, fixtures).
- `jaw-interview-runtime.ts`: spec 경로·phase·topology gate 유지 + jaw 4차원/structured ask.
- `structured-renderer.ts` + `ask.ts`: elicitation meta·D041 스키마 렌더.
- `jaw-interview-mutation-guard.ts`: `.jwc/` 쓰기 전용; jwc CLI만 허용 (가드 반전).
- `jaw-interview-gate.ts`: workflow gate 브로커 연동.
- 설정 키: `gjc.jawInterview.*` → **`jwc.interview.*`** (c7c748ec).
- 레거시: state 파일명 `deep-interview-state.json` 등 read-compat (042).
- 커밋: `eb4273c2` B1, `1be32975` B2, `8ced9eb2` B3, `063114c9` B5, `c7c748ec` settings.

## 050 — Plan / PABCD / orchestrate

- `orchestrate-state.ts`: native registry, transitions, verdict parser (D050-22).
- `orchestrate-runtime.ts`: stage I/P/A/B/C/D entry, gates, audit sub-prompts, fail-closed writer.
- `commands/orchestrate.ts` + slash `/orchestrate`; **jaw-only brand gate** (D050-24).
- `prompts/jaw/orchestrate-*.md` + audit planner/architect lens.
- `ralplan` SKILL: jwc CLI 예시; pending-approval; handoff ultragoal.
- 테스트: `orchestrate-state.test.ts`, `cli-command-surface` brand 분기.
- 커밋: `595350bf` B1, `975302db` B3, `0d38fe05` B4, `09c76c23` B2, `5f1d442a` B2 surface.
- **모델 discovery**: orchestrate 표면은 **99.03** (런타임만 ✅) — [m1_closeout.md](./m1_closeout.md)

## 060 — Goal / ultragoal

- `commands/goal.ts` **NEW**: cli-jaw-shaped goal verb surface.
- `goal-runtime.ts`: jaw evidence/pause/done 계약 → ultragoal 엔진·`.jwc/ultragoal` ledger.
- `goal-mode-request.ts`: 세션 스코프 `sessionId` (457-class fix 유지).
- ultragoal SKILL/commands: `jwc ultragoal *` 문구; checkpoint quality-gate.
- 커밋: `0207d326` C13 M1–M7, `db31d4bd` goal tests 연동.

## 070 — Memory

- jwc: memories startup stage1→phase2; 주입 `memory_summary.md` + (local) Task Snapshot·`local-query`/`memory-fts` (**99.01** 마감·테스트·문서 동기화 중).
- cli-jaw 패리티: BM25/RRF/trigram 일부 후속 — [memory_pipeline.md](./memory_pipeline.md).
- structure: [memory_pipeline.md](./memory_pipeline.md).

## 080–086 — TUI·HUD·브랜딩

- 테마 `abyss-bite` / `abyss-bite-light`; welcome/banner Jawcode (086).
- `model-selector`: provider 탭 CLAUDE/CODEX/LOCAL (084).
- `/quota` slash + provider quota UI (094.4).
- `/effort` reasoning effort selector (083.4).
- Workflow HUD: IPABCD 띠·인터뷰 게이지·goal 세그먼트 (085 MOC; 일부 WIP).
- `status-line/segments.ts`: jaw 라벨.
- 커밋: `3bc79781` C3, `89800b67` C5a, `7259a7c6` C4, `33fbee4d` 083.4.

## 081 — Cursor·composer

- `cursor.ts` + provider: **host model pin**, IDE convention disclaimer (081.6).
- Tool-call: render + execute 경로 수정 (02b50ad9, 081.1–3).
- `composer-discipline.ts`: autocontinue/anchor 관련 (081.8–9).
- `agent-session` autocompact: usage under-report 시 **content estimate 폴백** (081.7).
- 커밋: `e12e03d4`, `02b50ad9`, `16ce10d7`.

## 082–083 — 입력·출력

- IME: Ctrl-chord 한글 힌트 (082.1); editor first-char caret (082.2); ESC 2연타 안전망.
- `custom-editor` + hook-selector 인라인 입력 (082.3 계획 일부).
- 도구 블록: 완료 시 **auto-minimize** (083.1); spacing 1줄 (083.2); assistant **segment split**으로 추론↔tool interleave 복원 (083.3).
- `tool-transcript-overlay` alt+t (083.1 pattern A).
- 커밋: `cc61d506`, `d14ed4e2`, `3a858246`, `a590aea9`, `b06d48c7`.

## 090–094 — Auth·provider

- `local-token-detect.ts`: Claude Code/Codex/Grok 등 로컬 자격증명 탐지·import.
- OAuth 경로 보강 (`anthropic`, `openai-codex`, `xai`); auth-storage stale 제거.
- `kiro.ts` provider + `oauth/kiro.ts` (091 WIP).
- 커밋: `a17d5ac0` C2, `4d7733c2` kiro WIP.

## 061 / Phase β — 경로·마이그레이션

- `beta-jwc-sweep.ts`: 소스 `.gjc` 경로 리터럴 → `.jwc` (1530건/227파일, 경계 안전).
- `migrate-config-dir.ts`: `~/.gjc`→`~/.jwc`, 프로젝트 `.gjc`→`.jwc`, sentinel 멱등.
- `migrate-config-dir-startup.ts`: `cli.ts` **첫 import** (로거 순서 계약).
- `cli.ts` `jawOnlyCommands`: interview, orchestrate, goal 네이티브 등록.
- 커밋: `0b603b05` P9+P11, `d34097b8` P10, `0d7383df` 키트.

## 062–065 — Env·URL·명령

- `env.ts` `$resolveEnv`: **JWC→GJC→PI** 체인; 런타임 미러.
- `gjc-protocol.ts`: **`jwc://`** + `gjc://` legacy redirect.
- `gjc-command.ts`: subagent default **`jwc`** (`--jwc-command`, deprecated `--gjc-command`).
- `workflow-command-ref` / manifest: jwc 네이티브 CLI 표면.
- 커밋: `184a77da` P2, `c3e9cc13` P3, `314c0ceb` P5, `1affa135` P6, `cec8e763` P7.

## State / workflow (횡단)

- `state-schema.ts`: `jaw-interview` canonical; legacy `deep-interview` read-compat.
- `state-runtime` / `state-writer`: jwc stderr·reconcile; receipt owner `gjc-runtime` **보존**.
- `skill-state` / `skill-keywords`: jaw-interview 키워드; Stop/handoff 게이트.
- `bridge-client/workflow-gate.ts`: stage enum에 `jaw-interview` + legacy `deep-interview`.

## 테스트·가드 반전 (085.5)

- `default-gjc-definitions.test.ts`: 번들 4종 + **jwc 산문 필수**, gjc 사용자 표면 금지.
- `bash-allowed-prefixes` / `bash-interceptor`: role agent **jwc** prefix.
- `gjc-dogfood-template`: jwc 템플릿 기준.
## 99 밴드 (미구현 — 결정 260612)

| GG | 갭 | structure |
|---|---|---|
| 99.03 | discovery M1/M2/M3 + re-facing [확정] | [m1_closeout.md](./m1_closeout.md) |
| 99.01 | memory CLI + local-query/FTS | [memory_pipeline.md](./memory_pipeline.md) |
| 99.02 | CI schemas·biome | [jwc_readiness.md](./jwc_readiness.md) |

## 리베이스 시 주의

- HARD-EDIT 파일에서 **동작** 우선: D4(`.jwc/`, `@gajae-code/*`, receipt owner) > upstream 문구.
- Phase β 이후 문서·스냅샷은 `.jwc/` 기준; AGENTS.md upstream 계약은 수정 금지.

*갱신: struct_har 밴드 `02_logic_changes.md`는 본 문서 절을 밴드별로 요약·링크한다.*