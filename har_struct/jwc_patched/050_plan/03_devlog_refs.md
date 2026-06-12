# 050_plan — devlog refs (jwc_patched)

> `050*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `050_moc_plan_pabcd.md` | # 050 MOC — 워크플로 병합 ②: Orchestrate IPABCD | 91 |
| `050_moc_plan_pabcd.md` | # 050 MOC — 워크플로 병합 ②: Orchestrate IPABCD | 91 |

## 2. MOC 헤딩 트리

# 050 MOC — 워크플로 병합 ②: Orchestrate IPABCD
## 040 ↔ 050 역할 분리
## 병합 소재
## P 단계 — Boss-author + 3-reviewer [확정 053]
## 스코프
## [확정] / [기본값] 결정
## 완료 기준
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

### 050_moc_plan_pabcd.md

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
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `050_plan`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
