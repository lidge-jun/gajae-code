# 010_shell — devlog refs (gjc_origin)

> `010*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `010_moc_shell_rename.md` | # 010 MOC — jwc 셸 + 표면 리네이밍 | 51 |
| `010_moc_shell_rename.md` | # 010 MOC — jwc 셸 + 표면 리네이밍 | 51 |

## 2. MOC 헤딩 트리

# 010 MOC — jwc 셸 + 표면 리네이밍
## 목표
## 스코프
## 기본값/제안
## 리포 가드 (260612 03:30 발견, 03:34 의도 분석 완료)
## 완료 기준
## 열린 질문 (후속 인터뷰)

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

### 010_moc_shell_rename.md

```markdown
# 010 MOC — jwc 셸 + 표면 리네이밍

> 상태: 셸 ✅ (구 10_phase1) / 리네이밍 ⬜. 결정 근거: D4(표면 리네이밍).
> ⚖️ 표기 (전 MOC 공통, 260612 03:09 개정): [확정] = 인터뷰 확정 / **[기본값] = repo(업스트림 gjc)가 실제로 하는 동작 — 결정 없으면 이대로 간다** / [제안] = repo 기본값에서 벗어나는 내 아이디어, 채택하려면 인터뷰 결정 필요.

## 목표

업스트림 diff를 표면 파일에 국한하면서 사용자가 보는 모든 표면을 jaw 브랜드로.

## 스코프

1. ✅ `packages/jwc` 셸 — bin `jwc`, `jwc/sdk` 재수출 (구 10 문서)
2. ⬜ 브랜딩 문자열: 배너/`--help`/에러 문구/업데이트 안내의 `gjc`/`Gajae-Code` → `jwc`/`Jawcode`
3. ⬜ 버전 문자열: [기본값] `jwc/0.1.0 (gajae-code 0.4.4 base)` — 업스트림 추적 가시화
4. ⬜ README.jwc.md 신설 (업스트림 README 무수정)
5. ⬜ 기본 스킬 4종의 사용자-가시 이름/설명만 jaw 어휘로 (파일 경로·skill name 키는 유지)

## 기본값/제안

- [기본값] 업스트림은 브랜딩 문자열이 코드에 분산 — 그대로 두면 `jwc` bin도 gjc 브랜딩 출력
- [제안] 브랜딩 상수 모듈 1개(`packages/jwc/src/brand.ts`)를 만들고 coding-agent의 배너/헬프 출력
  지점만 최소 패치해 상수 참조 — 리베이스 충돌 면적 최소화
- [기본값] `gjc` bin 공존 (업스트림 구조 유지, 제거하지 않음)
- `.gjc/` 상태 경로, `@gajae-code/*` 패키지명, env prefix는 그대로 [확정 D4]

## 리포 가드 (260612 03:30 발견, 03:34 의도 분석 완료)

- **의도적 가드 맞음 — 단 우리를 막으려는 게 아님.** gajae-code 자체가 상류 "oh-my-pi"의 리브랜드 포크이고,
  `scripts/rebrand-inventory.ts`는 **자기 리브랜드 완전성 가드**다 (`docs/REBRANDING_PLAN_260525.md` 승인 계약의 산출물):
  - 패키지 스코프 `@gajae-code/` + 비스코프 허용은 `gajae-code` 1개만 (L36-37) → `jwc`가 걸린 지점
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
