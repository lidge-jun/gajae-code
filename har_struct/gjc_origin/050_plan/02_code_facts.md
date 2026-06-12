# 050_plan — code facts (gjc_origin)

> MOC `050_moc_plan_pabcd.md`에서 추출한 경로·팩트 + devlog `050*` 플랜.

## 1. 경로 인벤토리 (MOC 인용)

| # | path |
|---:|---|
| 1 | `(MOC에 경로 없음 — structure/ 참조)` |

## 2. devlog 플랜·diff 발췌

### `050_moc_plan_pabcd.md`

```markdown
# 050 MOC — 워크플로 병합 ②: Orchestrate IPABCD

> 📐 상세 설계: [051_design_command_port.md](./051_design_command_port.md) — D10 표면 3종(orchestrate/goal/memory)의
> 명령 아키텍처(CLI Command 클래스 + 슬래시 2계층, jaw 브랜드 게이트), cli-jaw 이식 자산 표(state-machine
> getPrefix/getStatePrompt/canTransition/parseWorkerVerdict), **IPABCD 단계 엔진·전이 매핑**.
>
> 🔗 선행 밴드: [040 MOC](./040_moc_interview_merge.md) — **I 단계 엔진**(`jaw-interview` 스킬·spec write).
> 본 밴드는 I를 포함한 **오케스트레이션 표면·상태머신**을 담당한다. 사용자 관점 파이프라인은 하나:
> `orchestrate i → p → a → b → c → d` (cli-jaw `orchestrate i|p|a|…`와 동형).
>
> 📌 P 재매핑: [053_decisions_p_boss_author.md](./053_decisions_p_boss_author.md) (D050-10 … D050-14)

> 상태: 🟡 MOC 본문 패치 완료 (053). **P = Boss-author + 3-reviewer** [확정 D050-10].
> 결정 근거: D3 [확정] 매핑 병합 — deep-interview↔I, ralplan 리뷰·artifact↔P, ultragoal↔goal (05 §D3).
> **P/A 분리:** P = Boss 계획 + Planner/Architect/Critic 합의; A = cli-jaw audit employee (Critic과 역할 중복 없음).

## 040 ↔ 050 역할 분리

| 밴드 | 담당 | 산출물 | 사용자 진입 |
|------|------|--------|-------------|
| **040** | I **엔진** — 인터뷰·게이트·spec | `jaw-interview` 스킬, `.gjc/specs/jaw-interview-{slug}.md` | `jwc interview` / `/interview` (I 단독) |
| **050** | **IPABCD 오케스트레이션** — 단계 전이·상태·프롬프트 주입 | `commands/orchestrate.ts`, `.gjc/state/pabcd.json`, `prompts/jaw/orchestrate-*.md` | `jwc orchestrate i\|p\|a\|b\|c\|d`, `jwc pabcd`, `/orchestrate` |

**handoff 계약:** 040 spec → `orchestrate p` 입력. I 완료 시 `pabcd.json`에 `spec_ref` 기록. P는 spec을 Boss가 읽고 초안 작성; 리뷰 artifact는 ralplan writer로 영속화 ([D050-13](./053_decisions_p_boss_author.md)).

```
모호한 요청 ──► orchestrate i (또는 interview 단독)
                    │
                    ▼
            jaw-interview spec (040 엔진)
                    │
                    ▼
orchestrate p ──► a ──► b ──► c ──► d
  Boss 초안          audit
  + 3-reviewer       employee
(spec 있으면 p부터 진입 가능)
```

## 병합 소재

| 출처 | 가져올 것 |
|------|----------|
| gjc ralplan | **리뷰 subagent** (Planner/Architect/Critic 순차), `--write --stage`, pending-approval, receipt-only, `--deliberate`, pre-execution gate — **작성자 역할은 P에서 Boss가 가져감** (053 D050-10) |
| jaw orchestrate | **I/P/A/B/C/D 단계 분리** + 명시 전이, **P = Boss plan 초안 + CEO 승인 STOP**, **A = audit employee PASS/FAIL**, B Boss 구현, C 기계 검증, D 요약 |
| 040 jaw-interview | I 엔진 — 050은 재구현 없이 `orchestrate i` / `interview` 호출 |
```

## 3. 검증 명령

```bash
bun check
bun test packages/coding-agent
bun scripts/rebrand-inventory.ts --strict
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `050_plan`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
