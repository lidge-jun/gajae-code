# 053 — P 단계 Boss-author + 3-reviewer (050 IPABCD 재매핑)

> 2026-06-12 후속 결정. **050번대 lexicographic 연속** (D050-3).
> 선행: [050_moc_plan_pabcd.md](./050_moc_plan_pabcd.md), [051_design_command_port.md](./051_design_command_port.md), [052_decisions_ipabcd.md](./052_decisions_ipabcd.md)
> 배경: cli-jaw **P = Boss 1명이 계획 초안** vs gjc **ralplan = Planner가 작성** — 050은 **표면 cli-jaw, 리뷰 엔진 gjc**로 합친다.

## Metadata

| 항목 | 값 |
|------|-----|
| 결정 방식 | 설계 대화 확정 (jaw-interview 미재개) |
| 선행 topology | 050 Plan+IPABCD (052와 동일) |
| 패치 대상 | 050 MOC, 051 §3 — 본 세션에서 본문 반영 |

## 결정 (D050-10 … D050-15)

| ID | 주제 | 결정 | 표기 |
|----|------|------|------|
| D050-10 | **P 작성자** | **`orchestrate p` = Boss(메인 세션)가 spec 기반 plan 초안 작성** — devlog plan 파일 + 사용자용 요약/Mermaid. **Planner subagent는 작성자가 아님** | [확정] |
| D050-11 | **P 리뷰 루프** | Boss 초안 후 **순차 subagent**: Planner → Architect → Critic (ralplan SKILL과 동일 순서·fresh spawn 규칙). Critic `OKAY` 또는 max 5회 후 Boss가 초안 수정·재리뷰 | [확정] |
| D050-12 | **A 단계** | **Critic은 P 안에서 완료**. **`orchestrate a` = cli-jaw A** — audit employee dispatch + `parseWorkerVerdict` (import/시그니처/통합 리스크). ralplan Critic을 A에 **중복 배치하지 않음** | [확정] |
| D050-13 | **산출물 이중화** | **사람-facing**: Boss devlog plan → `pabcd.json` `plan_ref` + 채팅 요약. **실행 게이트 정본**: `gjc ralplan --write --stage final` → `.gjc/plans/ralplan/<run-id>/pending-approval.md`. 리뷰 stage는 planner/architect/critic/revision + receipt-only | [확정] |
| D050-14 | **`/skill:ralplan` vs `orchestrate p`** | **`jwc orchestrate p`** = Boss-author P (IPABCD 네이티브). **`/skill:ralplan`** = Planner-author consensus **유지** (jaw-interview handoff·team gate). M1에서 SKILL 본문 통합 **하지 않음** — 054에서 `orchestrate p` 런타임만 | [확정] |
| D050-15 | **trivial bypass** | 단일 파일·단일 동작·AC 명시 → Boss + **Planner 1-pass** (Architect/Critic 생략). `--deliberate`/high-risk/multi-file → **풀 3-reviewer**. `ctx.p_review_mode: "short"\|"full"` | [기본값] |

## P 단계 흐름 (정본)

```
orchestrate p
  │
  ├─ 1. Boss: spec → devlog plan 초안 + 사용자 요약/Mermaid
  ├─ 2. (full) Planner  — AC/scope 리뷰 → --write stage planner
  ├─ 3. (full) Architect — steelman/tradeoff → stage architect
  ├─ 4. (full) Critic    — OKAY|ITERATE|REJECT → stage critic
  │        loop ≤5 → Boss revises
  ├─ 5. Boss: final → devlog + ralplan --write --stage final
  └─ 6. ⛔ STOP → 사용자 승인 → orchestrate a
```

**Subagent 규칙:** read-only, receipt-only; Architect/Critic **매 패스 fresh spawn**.

## A 단계 (D050-12)

- **P:** Critic까지 plan 품질·합의 완료
- **A:** audit employee + `parseWorkerVerdict` — 기술 audit만 (cli-jaw 동형)

## 패치·후속

- [x] 050 MOC, 051 §3·§3.1, 052 supersede 노트
- [ ] **054** `orchestrate p` 구현 diff

## 속집 — cli-jaw 인터뷰 확정분 (260612 10:00, D050-16 … 18)

> 같은 날 cli-jaw `orchestrate I` 인터뷰(R1-2)에서 052 미확정 3건을 닫음.
> ⚠️ 인터뷰 트랜스크립트는 이를 "D050-10~12"로 불렀으나 본 문서가 선채번 — **D050-16~18이 정본**.

| ID | 주제 | 결정 | 표기 |
|----|------|------|------|
| D050-16 | **D 단계 산출물** | **cli-jaw D 동형 + receipt 병행** — 요약(변경 파일/충족 기준)+WONDER/REFLECT 텍스트가 사용자 산출물, `pabcd.json`에 gjc receipt 관례로 종결 기록 | [확정] |
| D050-17 | **C 체크리스트** | **cli-jaw 3스테이지(기계 검증→정밀 검토→평결) 프롬프트 사본 + repo 게이트 구체화** — 본 repo는 `bun run check`/대상 테스트/rebrand 게이트 명시, 타 repo는 프로젝트 컨벤션 자동 감지 문구 | [확정] |
| D050-18 | **슬래시/CLI 정본** | **`/orchestrate`·`jwc orchestrate` 정본 + `/pabcd`·`jwc pabcd` alias**. 단계 HUD 표시는 080 TUI 밴드 위임 | [확정] |

## 미확정 (054+)

- Planner review 프롬프트 조각, devlog `plan_ref` 자동 번호
- D050-15 trivial bypass — [기본값] 유지 중, [확정] 승격은 1문답
- 슬래시 HUD 구현 — 080 위임 (D050-18)

## Acceptance

- [x] D050-10 … D050-15 기록
- [x] D050-16 … D050-18 기록 (cli-jaw 인터뷰 속집)
- [x] 050/051 본문 패치
- [ ] `jwc orchestrate p` 구현 (054 diff 플랜)
