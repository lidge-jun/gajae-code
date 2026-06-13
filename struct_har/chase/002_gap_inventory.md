# chase — 갭 인벤토리 (횡단)

> 스냅샷: gjc `75d103f45145` · jwc **`b03cb3be`** · omp `db421bb2ef68` (2026-06-13 **4차 — chase refresh**).
> **reviewed through**: GJC `75d103f45145` (변동 없음); OMP `db421bb2ef68` (변동 없음); JWC `b03cb3be`
> (260613 후반: 100밴드 완료 + 감사 6라운드, reformation 전 과정(G5·T1·T4·D5·가시성·안정성·fast 진단),
> xAI 검색·`/searchengine`, MCP runtime discovery, 99.xx TUI/브랜드/pabcd 시리즈, structure 24→10 통합).
> 상태: `⬜` 미착수 · `🟡` 설계/부분 · `✅` jwc 선행 · `—` 해당 없음
> **기록**: [10_gjc_chase_MOC](./10_gjc_chase_MOC.md) · [20_omp_chase_MOC](./20_omp_chase_MOC.md) (`10.NNN_*` / `20.NNN_*`)
## 요약

| 축 | jwc가 **앞서거나 유일** | jwc가 **뒤처지거나 약함** |
|---|---|---|
| **gjc** | orchestrate/PABCD, jaw 표면, `.jwc`, cli-jaw skills, pi-shell UTF-8·submit gate(10.009·10.010 ✅), **Codex 전송 안정화(reformation ✅: 프리웜·WS 수명주기·워치독·rate-limit 텔레메트리·가시성)**, **xAI 검색·`/searchengine` ✅**, **MCP runtime discovery ✅** | upstream `75d103f` 기준: pre-prompt context maintenance, RPC lifecycle, team profile self-heal, receipt spool(10.011) |
| **omp** | 4 workflow 번들, jaw 워크플로 | task-agent discovery/lifecycle, session export/share/fork/resume, local memory, compaction pruning = **참조 전용** |
| **자체** | **100 Node 포팅 완료**(감사 6라운드), **TUI 렌더 O(n²) 수정**, 99.03·99.01·99.07 부분 | 99.02(CI)·99.04(HUD)·99.05(auth)·99.06(docs)·M2 110+ |

## 밴드별

| 밴드 | G1 gjc | G2 omp | G3 jwc | 참조 카드 |
|---|---|---|---|---|
| 010_shell | 🟡 bin/퍼블리시 동기 | — | ✅ jwc only | [bands/README.md](./bands/README.md) |
| 020_prompt | 🟡 upstream 프롬프트 drift | 🟡 ttsr/docs | ⬜ **99.03 M1** discovery | [bands/020_prompt.md](./bands/020_prompt.md) |
| 030_skills | 🟡 discoverSkills 테스트·스킬 수·team profile guard | 🟡 `.omp/skills` 3계층·agent discovery precedence | 🟡 D5 cli-jaw | [bands/030_skills.md](./bands/030_skills.md) |
| 040_interview | 🟡 deep-interview upstream | — | ✅ jaw-interview | [bands/040_interview.md](./bands/040_interview.md) |
| 050_plan | 🟡 ralplan upstream | — orchestrate 없음 | ✅ orchestrate · ⬜ **99.03** discovery | [bands/050_plan.md](./bands/050_plan.md) |
| 060_goal | 🟡 ultragoal reconcile | — | ✅ goal CLI · 🟡 M4 TUI | [bands/060_goal.md](./bands/060_goal.md) |
| 070_memory | 🟡 upstream memory hooks | 🟡 mnemopi local memory pipeline | 🟡 **99.01** CLI·query | [bands/070_memory.md](./bands/070_memory.md) |
| 080_tui | 🟡 upstream TUI fixes | 🟡 테마/런타임 docs | 🟡 jaw 테마 · ⬜ **99.04** HUD | [bands/080_tui.md](./bands/080_tui.md) |
| 081_cursor | 🟡 **높음** — cursor/provider | 🟡 IDE convention | 🟡 WIP kiro 분기 | [bands/081_cursor.md](./bands/081_cursor.md) |
| 082_input | 🟡 IME upstream | — | ✅ jaw IME 일부 | [bands/082_input.md](./bands/082_input.md) |
| 083_output | 🟡 compaction/session/pruning | 🟡 pruning docs | ✅ segment·collapse·**렌더 O(n²) 수정**(G5) | [bands/083_output.md](./bands/083_output.md) |
| 090_auth | 🟡 **높음** — oauth 범용 | 🟡 provider 수 | 🟡 kiro NEW · ⬜ 99.05 | [bands/090_auth.md](./bands/090_auth.md) |
| 099 | — | — | 🟡 99.03✅·99.01✅·99.07부분✅ / 99.02·04·05·06 ⬜ | [../jwc_patched/099_stabilization/](../jwc_patched/099_stabilization/) |
| 100_node | 🟡 Bun-only parity · tmux/worker runtime | 🟡 **workerHost** · isolation PAL docs | ✅ **완료**(260613, 감사 6라운드) | [bands/100_node.md](./bands/100_node.md) |

## G1 — gjc에서 흔히 뒤쳐지는 항목 (CHANGELOG·코드 교차)

| 영역 | upstream 후보 | jaw 병합 난이도 | 참조 |
|---|---|---|---|
| 세션/autocompact | pre-send estimated context maintenance; canonical prune persistence; maxTokens reserve | **HARD-EDIT** `packages/coding-agent/src/session/agent-session.ts` — jaw 083 segment/collapse와 충돌 예상 | [10.004](./10.004_gjc_chase_session_compaction.md) |
| RPC/headless | malformed JSONL recovery; EOF/shutdown `ensureOnDisk`; `get_state` tools/systemPrompt include-gate | 중 — workflow gate/RPC 표면 유지하며 선별 | [10.008](./10.008_gjc_chase_rpc_lifecycle.md) |
| pi-shell fixup ✅ | char→byte index 변환으로 멀티바이트 bash 명령 panic 제거 (#551, GJC `2b4d407b471b`) | **landed 260613** — clean cherry-pick, 188 tests ([99.11.01](../../devlog/_plan/260612_jawcode_fork/phase1/99.11.01_plan_upstream_pishell_utf8_fixup.md)) | [10.009](./_fin/10/10.009_gjc_chase_pishell_utf8_fixup.md) |
| harness submit gate ✅ | `submitUnavailableReason` 체인 + `Observation.readyForSubmit` (#549, `f814413`) | **landed 260613** — sm/types/owner + `#submit` 선별 포팅, 175 tests ([99.11.02](../../devlog/_plan/260612_jawcode_fork/phase1/99.11.02_plan_upstream_harness_submit_gate.md)) | [10.010](./_fin/10/10.010_gjc_chase_harness_submit_readiness.md) |
| receipt spool | `ReceiptEnvelope` JSONL spool export — `--receipt-spool-dir`/env, cursor append on `writeReceiptImmutable` (#554, `75d103f`) | 소~중 — owner/storage hunk **clean 실측**, `harness.ts` 배관만 선별; 10.008 묶음 권장 | [10.011](./10.011_gjc_chase_receipt_spool.md) |
| model-profiles UX | 그룹 프리셋 선택 (`model-selector.ts` +346, #553, `a12a751`) | — **사용자 직접 패치 중 (260613)**, 카드 미발급 | [10.001 changelog](./10.001_gjc_chase_cycle.md) |
| team/leader bootstrap | `@gjc-profile` tag self-heal for gjc-launched leaders (#546, GJC `050aa1731551`) | 중 — jwc `team` workflow surface and leader profile invariant must survive rebrand | [10.007](./10.007_gjc_chase_team_profile_self_heal.md) |
| harness recover | owner-vanished / bootstrap | 중 | packages/coding-agent CHANGELOG 0.4.1+ |
| task/subagent | sessionId OAuth, forkContext | 🟡 jaw 가드 반전 유지 | `task/executor.ts` |
| providers/models | Bedrock/Azure, web_search default, codex profile drift | ai 패키지 diff; models.json은 regenerate only | `packages/ai/` |
| schemas | check:schemas drift | ⬜ **99.02** | `schemas/` |

## G2 — omp 참조만 (이식 아님)

| 영역 | omp | jaw 방향 |
|---|---|---|
| catalog | `packages/catalog/` | **비채택** — ai 내 models 유지 |
| LSP/DAP | docs/ 깊이 | 선택 포팅 · 081 |
| task-agent discovery | `.omp/agents` only roots, Claude plugin roots, first-wins exact-name dedup, execution-time rediscovery, `read-summarize: false`, plan-mode narrowing | 참조 전용 — jwc의 bundled role-agent 4종/cli-jaw 방향 우선 |
| task tool lifecycle | batch default-on, required shared `context`, no per-call `schema`, async job delivery, `agent://`/`history://`, yield-required finish, idle/parked revival, semaphore + recursion gates, IRC follow-up | 참조 전용 — subagent UX/contract gap 분해 |
| session ops | export recursive `subSessions`, custom share no-fallback, encrypted share, fork parentSession metadata, cross-project resume re-root/fork, rollback switchSession caveats | 참조 전용 — operator-visible semantics first |
| memory | mnemopi local backend: disabled-by-default, Memory Guidance injection, `memory://`, startup extraction/consolidation, redaction, model-role fallback | 99.01 + [omp 070](../omp_origin/070_memory/) |
| compaction pruning | superseded read-result pruning, useless-result elision, protected tools, 40k protect / 20k min savings, prompt-cache-aware suffix/idle flush | 083/session context-retention candidate |
| steering delivery | yield-boundary steering re-poll, settle-time stranded queue drain, steer idle mirror (`42ffc83`) | [20.005](./20.005_omp_chase_steering_delivery.md) — jwc 부분 보유, 구현 후보 |
| TUI 입력 micro | Esc draft clear·selector resetDisplay (`e914bf0`), ast-edit status 공백 축약 (`3d646d8`) | [20.006](./20.006_omp_chase_tui_input_micro_fixes.md) — 99.20 레인 선별 |
| collab/brew | dot-joined room secrets (`0d49f94`), brew formula (`389add4`) | **비채택** — gjc/jwc lineage에 collab 부재, brew 미사용 |
| worker/isolation | `workerHost` / isolation PAL docs | **100** M2 |

## 260613 후반 신규 착지 — chase 스냅샷 이후 jwc 독자 성과

| 영역 | 커밋 범위 | 요약 | 정본 |
|---|---|---|---|
| **Codex 전송 reformation** | `76176ce3`…`65d36ec3` (12커밋) | WS 수명주기(CONNECTING 합류·fatal 예산)·프리웜(`generate:false`+idle refresh)·워치독 300s 패리티·rate-limit 텔레메트리·가시성(footer ws/sse·delta/full·notice)·안정성 리뷰 2건·fast 진단(서버 회귀 5중 확정) | [structure/30_providers.md](../../structure/30_providers.md) · [devlog/_fin/000000_reformation/](../../devlog/_fin/000000_reformation/) |
| **TUI 렌더 O(n²)** | `1814bb95` | 연속 Write 시 settled 컴포넌트 재클론·재렌더 제거 + TTSR 16KB 윈도 | 위 reformation |
| **xAI 검색·`/searchengine`** | `c8df2824`…`a1bcf31e` (7커밋) | xAI Grok web+X 검색, `/searchengine` 프로바이더 전환+OAuth/키 게이팅, `/model` TUI args 위임 | [structure/30_providers.md](../../structure/30_providers.md) |
| **100 Node 완료** | `2e9efc59`…`503f6467` (16커밋) | dist-node esbuild·전 Bun API 셰임·SDK import/session/streaming green·적대 감사 6라운드(보안 포함)·photon WASM 이미지 | [structure/10_architecture.md](../../structure/10_architecture.md) |
| **MCP runtime discovery** | `0b493665` | CLI 세션에 MCP 런타임 디스커버리 와이어링(탈격리) | — |
| **99.xx TUI/브랜드** | 다수 (pabcd·todo·login·search-panel·slash 등) | 99.03 완료, 99.07 부분, 99.20 시리즈, 99.30 todo 패널 접기 | [structure/50_status.md](../../structure/50_status.md) |

이 항목들은 기존 chase 스냅샷(`dc4f2267`)에는 없었던 jwc 독자 성과이며, **chase 추적 대상이
아닌 완료 사실**이다. gjc/omp 축 미변동(`75d103f`/`db421bb` 유지)이므로 G1/G2 항목은 그대로.

## 구현가치 (MLB 20-80) — 활성 chase 전 항목

> 20=가치 없음 · 50=평균 · 60=plus · 70=plus-plus · 80=elite. **가치 = 효용 × 적용 확실성**; 비용은 별도 열.
> 갱신: upstream pull마다 재평가. 등급 분류 — **즉시 채택**(diff 깨끗+효용 확실) > **선별 병합** > **참조 설계**(1:1 이식 아님) > **보류/비채택**.

| 항목 | 축 | 구현가치 | 비용 | 분류 | 근거 |
|---|---|:---:|---|---|---|
| [10.009](./_fin/10/10.009_gjc_chase_pishell_utf8_fixup.md) pi-shell UTF-8 panic | gjc | **70** | 소 (clean cherry-pick) | ✅ **채택 완료 (260613)** | 크래시 수정 + 한글 명령 노출 면적 큼 — 99.11.01로 랜딩 |
| [10.010](./_fin/10/10.010_gjc_chase_harness_submit_readiness.md) harness submit gate | gjc | **65** | 중 (`owner.ts`만 선별) | ✅ **채택 완료 (260613)** | headless/orchestrate 신뢰성 직결 — 99.11.02로 랜딩 |
| [10.004](./10.004_gjc_chase_session_compaction.md) session/compaction | gjc | 65 | **대 (HARD-EDIT)** | 선별 병합 | 효용 높으나 jaw 083 segment/collapse와 충돌 예상 |
| [10.011](./10.011_gjc_chase_receipt_spool.md) receipt spool exporter | gjc | **60** | 소~중 (owner/storage clean 실측) | **즉시~선별** | orchestrate 관측성 직결; 10.010 랜딩 직후가 적기; 10.008과 묶음 |
| [10.002](./10.002_gjc_chase_ai_auth.md) ai·auth | gjc | 60 | 중 | 선별 병합 | provider/oauth 폭 — 90 밴드 99.05와 동레인 |
| [10.003](./10.003_gjc_chase_cursor.md) cursor | gjc | 60 | 중 | 선별 병합 | jwc kiro 분기와 병행 검토 |
| [10.008](./10.008_gjc_chase_rpc_lifecycle.md) RPC lifecycle | gjc | 60 | 중 | 선별 병합 | 10.010과 같은 신뢰성 레인 — 묶음 처리 권장 |
| [20.005](./20.005_omp_chase_steering_delivery.md) steering delivery | omp | 60 | 중 (부분 보유) | 참조 후 구현 | stranded-queue 버그 클래스; orchestrate 영향면 큼; gjc 수용 시 충돌 주의 |
| [10.007](./10.007_gjc_chase_team_profile_self_heal.md) team self-heal | gjc | 55 | 중 | 보류 | team 표면 reconcile 시점에만 의미 |
| [20.003](./20.003_omp_chase_memory_skills.md) memory·skills | omp | 55 | 설계 | 참조 설계 | 99.01 입력 자료 |
| [10.005](./10.005_gjc_chase_task_subagent.md) task/subagent | gjc | 50 | 중 | 보류 | jaw 가드 반전 유지 전제 |
| [20.006](./20.006_omp_chase_tui_input_micro_fixes.md) TUI 입력 micro | omp | 50 | 소 | 선별 채택 | 99.20 레인에 묶으면 한계비용 ~0 |
| [10.006](./10.006_gjc_chase_tui_core.md) tui core | gjc | 45 | 중 | 보류 | jaw 테마/HUD 자체 작업이 선행 |
| [20.002](./20.002_omp_chase_worker_catalog.md) worker·catalog | omp | 45 | 대 | M2 보류 | 100_node 포팅 결정 이후 |
| [20.004](./20.004_omp_chase_lsp_dap.md) LSP/DAP | omp | 45 | 대 | 보류 | 깊이 대비 jwc 우선순위 낮음 |
| omp collab·brew (카드 없음) | omp | 30 | — | **비채택** | lineage 부재 / 배포 표면 불일치 — [20.006 §비채택](./20.006_omp_chase_tui_input_micro_fixes.md) |

## 갱신 체크리스트

```bash
git -C devlog/_upstream_gjc fetch origin dev
git -C devlog/_upstream_gjc switch dev
git -C devlog/_upstream_gjc pull --ff-only origin dev
git -C devlog/_upstream_omp fetch origin main
git -C devlog/_upstream_omp pull --ff-only origin main
```

→ 본 표 · [bands/README.md](./bands/README.md) · struct_har HEAD 행 · 10/20 MOC `reviewed through` 행을 함께 갱신.