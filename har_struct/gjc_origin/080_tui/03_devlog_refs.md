# 080_tui — devlog refs (gjc_origin)

> `080*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `080_moc_tui.md` | # 080 MOC — TUI 전반 리브랜딩 (비주얼 정체성 + 워크플로 시각화) | 63 |
| `080_moc_tui.md` | # 080 MOC — TUI 전반 리브랜딩 (비주얼 정체성 + 워크플로 시각화) | 63 |

## 2. MOC 헤딩 트리

# 080 MOC — TUI 전반 리브랜딩 (비주얼 정체성 + 워크플로 시각화)
## 코드 사실 (260612 04:29 구체화)
## 스코프 — 2트랙
### §A. 비주얼 리브랜딩 트랙 (워크플로 무관 — 분리 선행 가능)
### §B. 워크플로 시각화 트랙 (040–060 산출물 의존)
## [기본값] 결정
## 완료 기준
## 열린 질문 (착수 전 인터뷰)

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

### 080_moc_tui.md

```markdown
# 080 MOC — TUI 전반 리브랜딩 (비주얼 정체성 + 워크플로 시각화)

> 상태: ⬜. 입력: 사용자 "주력으로 개발할 TUI 필요" [확정] + "전반적인 TUI 리브랜딩 계획" 요청 (260612 04:29).
> 040–060 산출물(위젯 표시 대상) 뒤 배치가 기본이나, §A 비주얼 트랙은 분리 선행 가능 (열린 질문 1).

## 코드 사실 (260612 04:29 구체화)

- `packages/tui/` — 자체 차등 렌더링 라이브러리. Bun 전용 7파일 — Node 포팅 대상 아님 (D8)
- **비주얼 정체성은 아직 100% gjc**:
  - 기본 다크 테마 = **`red-claw`**, `theme.ts`에 폴백 포함 4곳 하드코딩 (L1788 `autoDarkTheme`,
    L1809 `darkTheme ?? "red-claw"`, L1824–25 로딩 실패 폴백)
  - 내장 테마: `modes/theme/defaults/` — `red-claw.json`, `blue-crab.json` (jaw 테마 없음)
  - **welcome 배너가 claw(집게발) 마크를 드로잉** — welcome.ts:18 "a claw/talon mark without copying
    another agent shell", L82 레이아웃이 claw 마크 폭 기준 (`minLeftCol = 18`)
  - `scripts/verify-gjc-ui-redesign.ts` 가드: 상태줄 프리셋이 레거시 "pi" 세그먼트를 쓰지 않는지 검사 —
    jaw 테마/세그먼트 추가 시 저촉 여부 착수 시 확인
- 010/020에서 이미 끝난 텍스트 표면: 배너 타이틀(`jwc vX · Jawcode`), 상태줄 `JWC`, 안내문/헬프, Identity 탭 🦈
- **(260612 06시 조사) "TUI에 도구 행이 안 나오는" 버그는 TUI 무죄 판정** — 원인은 cursor 프로바이더
  파서의 네이티브 ToolCall oneof 드롭 ([081.1_issue_toolcall_render.md](./081.1_issue_toolcall_render.md),
  수정 대상은 `packages/ai/src/providers/cursor.ts`). 자매 이슈 [081.2](./081.2_issue_title_hallucination.md)(타이틀 환각)도 본 밴드 발현·프로바이더 소관.
  TUI는 미등록 도구명도 폴백 렌더 가능 (`ui-helpers.ts:371`, `tool-execution.ts:188`) — 본 밴드 비주얼 작업과 독립

## 스코프 — 2트랙

### §A. 비주얼 리브랜딩 트랙 (워크플로 무관 — 분리 선행 가능)

1. **jaw 테마 신설**: `modes/theme/defaults/jaw-<이름>.json` — red-claw.json을 베이스로 jaw 팔레트
   (방향 미정 — 열린 질문 2). 시맨틱 컬러 무결성 유지 (gjc REBRANDING_PLAN 원칙 3: 브랜드색 ≠ error/warning/diff 색)
2. **브랜드 조건부 기본 테마**: `APP_NAME !== "gjc"`일 때 autoDarkTheme 기본값을 jaw 테마로 —
   010의 brand-조건 패턴 재사용, 4곳 하드코딩을 단일 헬퍼로 수렴. gjc 무회귀 (diff-0 패턴)
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `080_tui`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
