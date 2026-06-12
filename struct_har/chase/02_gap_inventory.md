# chase — 갭 인벤토리 (횡단)

> 스냅샷: gjc `67427c6` · jwc `81bcea96` · omp `e13ad3805` (2026-06-13).  
> 상태: `⬜` 미착수 · `🟡` 설계/부분 · `✅` jwc 선행 · `—` 해당 없음  
> **기록**: [10_gjc_chase_MOC](./10_gjc_chase_MOC.md) · [20_omp_chase_MOC](./20_omp_chase_MOC.md) (`10.NNN_*` / `20.NNN_*`)
## 요약

| 축 | jwc가 **앞서거나 유일** | jwc가 **뒤처지거나 약함** |
|---|---|---|
| **gjc** | orchestrate/PABCD 런타임, jaw 표면, `.jwc`, cli-jaw skills | upstream 0.4.x 이후 패치 미동기 (수동 diff 필요) |
| **omp** | 4 workflow 번들, jaw 워크플로 | LSP/DAP 깊이, catalog 분리 문화, worker 패턴 |
| **자체** | — | 99.01–07, CI, M2 Node |

## 밴드별

| 밴드 | G1 gjc | G2 omp | G3 jwc | 참조 카드 |
|---|---|---|---|---|
| 010_shell | 🟡 bin/퍼블리시 동기 | — | ✅ jwc only | [bands/README.md](./bands/README.md) |
| 020_prompt | 🟡 upstream 프롬프트 drift | 🟡 ttsr/docs | ⬜ **99.03 M1** discovery | [bands/020_prompt.md](./bands/020_prompt.md) |
| 030_skills | 🟡 discoverSkills 테스트·스킬 수 | 🟡 `.omp/skills` 3계층 | 🟡 D5 cli-jaw | [bands/030_skills.md](./bands/030_skills.md) |
| 040_interview | 🟡 deep-interview upstream | — | ✅ jaw-interview | [bands/040_interview.md](./bands/040_interview.md) |
| 050_plan | 🟡 ralplan upstream | — orchestrate 없음 | ✅ orchestrate · ⬜ **99.03** discovery | [bands/050_plan.md](./bands/050_plan.md) |
| 060_goal | 🟡 ultragoal reconcile | — | ✅ goal CLI · 🟡 M4 TUI | [bands/060_goal.md](./bands/060_goal.md) |
| 070_memory | 🟡 upstream memory hooks | 🟡 mnemopi | 🟡 **99.01** CLI·query | [bands/070_memory.md](./bands/070_memory.md) |
| 080_tui | 🟡 upstream TUI fixes | 🟡 테마/런타임 docs | 🟡 jaw 테마 · ⬜ **99.04** HUD | [bands/080_tui.md](./bands/080_tui.md) |
| 081_cursor | 🟡 **높음** — cursor/provider | 🟡 IDE convention | 🟡 WIP kiro 분기 | [bands/081_cursor.md](./bands/081_cursor.md) |
| 082_input | 🟡 IME upstream | — | ✅ jaw IME 일부 | [bands/082_input.md](./bands/082_input.md) |
| 083_output | 🟡 compaction/session | — | ✅ segment·collapse | [bands/083_output.md](./bands/083_output.md) |
| 090_auth | 🟡 **높음** — oauth 범용 | 🟡 provider 수 | 🟡 kiro NEW · ⬜ 99.05 | [bands/090_auth.md](./bands/090_auth.md) |
| 099 | — | — | ⬜ **99.01–07** | [../jwc_patched/099_stabilization/](../jwc_patched/099_stabilization/) |
| 100_node | 🟡 Bun-only parity | 🟡 **workerHost** | ⬜ M2 포팅 | [bands/100_node.md](./bands/100_node.md) |

## G1 — gjc에서 흔히 뒤쳐지는 항목 (CHANGELOG·코드 교차)

| 영역 | upstream 후보 | jaw 병합 난이도 | 참조 |
|---|---|---|---|
| 세션/autocompact | maxTokens reserve, post-compaction continue | HARD-EDIT `agent-session` | [03](./03_reference_from_gjc.md) §세션 |
| harness recover | owner-vanished / bootstrap | 중 | packages/coding-agent CHANGELOG 0.4.1+ |
| task/subagent | sessionId OAuth, forkContext | 🟡 jaw 가드 반전 유지 | `task/executor.ts` |
| providers | Bedrock/Azure, web_search default | ai 패키지 diff | `packages/ai/` |
| schemas | check:schemas drift | ⬜ **99.02** | `schemas/` |
| models.json | regenerate only | AGENTS 규칙 동일 | generator 스크립트 |

## G2 — omp 참조만 (이식 아님)

| 영역 | omp | jaw 방향 |
|---|---|---|
| catalog | `packages/catalog/` | **비채택** — ai 내 models 유지 |
| LSP/DAP | docs/ 깊이 | 선택 포팅 · 081 |
| worker | `cli.ts` worker argv | **100** M2 |
| memory | mnemopi | 99.01 + [omp 070](../omp_origin/070_memory/) |

## 갱신 체크리스트

```bash
git -C devlog/_upstream_gjc fetch origin
git -C devlog/_upstream_gjc log -1 --oneline
git -C devlog/_upstream_omp fetch origin
diff -qr devlog/_upstream_gjc/packages/coding-agent/src packages/coding-agent/src | head -40
```

→ 본 표 · [bands/README.md](./bands/README.md) · struct_har HEAD 행.