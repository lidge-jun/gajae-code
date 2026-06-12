# 050 MOC — 워크플로 병합 ②: Orchestrate IPABCD

> 📐 상세 설계: [051_design_command_port.md](./051_design_command_port.md) — D10 표면 3종(orchestrate/goal/memory)의
> 명령 아키텍처(CLI Command 클래스 + 슬래시 2계층, jaw 브랜드 게이트), cli-jaw 이식 자산 표(state-machine
> getPrefix/getStatePrompt/canTransition/parseWorkerVerdict), **IPABCD 단계 엔진·전이 매핑**.
>
> 🔗 선행 밴드: [040 MOC](./040_moc_interview_merge.md) — **I 단계 엔진**(`jaw-interview` 스킬·spec write).
> 본 밴드는 I를 포함한 **오케스트레이션 표면·상태머신**을 담당한다. 사용자 관점 파이프라인은 하나:
> `orchestrate i → p → a → b → c → d` (cli-jaw `orchestrate i|p|a|…`와 동형).

> 상태: ⬜. 결정 근거: D3 [확정] 매핑 병합 — deep-interview↔I, ralplan↔P+A, ultragoal↔goal (05 §D3).
> P/A 동형 근거: Planner/Architect/Critic 합의 루프 = jaw P계획+A감사의 다중 에이전트 버전.

## 040 ↔ 050 역할 분리

| 밴드 | 담당 | 산출물 | 사용자 진입 |
|------|------|--------|-------------|
| **040** | I **엔진** — 인터뷰·게이트·spec | `jaw-interview` 스킬, `.gjc/specs/jaw-interview-{slug}.md` | `jwc interview` / `/interview` (I 단독) |
| **050** | **IPABCD 오케스트레이션** — 단계 전이·상태·프롬프트 주입 | `commands/orchestrate.ts`, `.gjc/state/pabcd.json`, `prompts/jaw/orchestrate-*.md` | `jwc orchestrate i\|p\|a\|b\|c\|d`, `jwc pabcd`, `/orchestrate` |

**handoff 계약:** 040 spec이 존재하면 `orchestrate p`의 입력. I 단계 완료 시 spec 경로를 `pabcd.json` ctx에 기록하고 P 진입 시 ralplan이 소비한다.

```
모호한 요청 ──► orchestrate i (또는 interview 단독)
                    │
                    ▼
            jaw-interview spec (040 엔진)
                    │
                    ▼
orchestrate p ──► a ──► b ──► c ──► d
(spec 있으면 p부터 진입 가능)
```

## 병합 소재

| 출처 | 가져올 것 |
|------|----------|
| gjc ralplan | Planner→Architect→Critic 합의 N회 루프, pending-approval 아티팩트(`.gjc/plans/ralplan/<run-id>/`), receipt-only 역할 응답, `--deliberate` 프리모템, CLI 아티팩트 라이터(`--write --stage`) |
| jaw orchestrate | **I/P/A/B/C/D 단계 분리** + 명시 전이(`orchestrate i`, `orchestrate p`, …), P/A 사용자 승인 게이트(⛔ STOP), B 보스 단독 구현·직원 read-only, C 기계 검증, D 요약 |
| 040 jaw-interview | I 단계 엔진 — 050은 엔진을 **재구현하지 않고** `orchestrate i` 진입 시 040 스킬/런타임을 호출 |

## 스코프

1. **I 단계 = orchestrate i**: 040 `jaw-interview` 엔진을 IPABCD 상태머신의 첫 단계로 등록. 단독 `jwc interview`와 동일 엔진, 차이는 `pabcd.json`에 단계·ctx가 기록됨 [기본값]
2. **P 단계 = orchestrate p**: ralplan 합의 루프, 최종 plan pending-approval [기본값]
3. **A 단계 = orchestrate a**: ralplan Critic 독립 패스 (jaw A read-only 감사)
4. **B/C/D**: jaw 계약 이식 — B 구현(role executor), C 기계 검증, D 요약
5. **명령 표면 [확정 D10]**: `jwc orchestrate I|P|A|B|C|D` — **cli-jaw `orchestrate i|p|a|…`와 동일 어휘·전이·게이트**
   - alias: `jwc pabcd`
   - 슬래시: `/orchestrate`, `/pabcd`
   - 소문자 단계 인자(`i`, `p`, …) — cli-jaw 관례 따름
6. **상태 영속화**: [기본값] `.gjc/state/pabcd.json` (current_stage, ctx, spec_ref, plan_ref) — resume·단계 재진입 가능

## [기본값] 결정

- ⚠️ 번들 스킬 4종 가드 — IPABCD는 **번들 스킬 추가가 아님**. CLI/슬래시+프롬프트+상태머신으로 가드 비저촉 (010 MOC §리포 가드)
- 단계 전환은 **명시 `orchestrate <stage>`만** (자동 전환 금지) — cli-jaw 규약
- 아티팩트: ralplan 라이터 재사용 (`.gjc/plans/` 직접 편집 금지)
- 게이트: P/A 종료 시 STOP; goal 모드는 self-advance (cli-jaw 규약)
- M1: cli-jaw `state-machine.ts` 프롬프트·전이 규칙 **자체 사본** 이식; M2 130에서 정본 단일화 검토

## 완료 기준

- `jwc orchestrate i` → spec 산출 → `orchestrate p` → `a` → `b` → `c` → `d` 풀사이클 1회 (또는 `/pabcd` 동등 경로)
- spec 보유 시 `orchestrate p` 단독 진입 e2e (040 handoff 소비)
- P 산출물 pending-approval, 명시 승인 전 mutation 0건
- receipt-only: 역할 에이전트 본문 미복제

## 열린 질문

- `jwc interview` 단독 vs `jwc orchestrate i` — 동일 엔진이지만 상태머신 등록·handoff UX 차이; 착수 시 052 P에서 확정
- cli-jaw 상태머신 텍스트 공유 vs 사본 — [기본값] M1 사본, M2 130 단일화
- team(tmux)와 B단계 — [기본값] M1 범위 밖
