# 082_input — TUI 입력·IME (gjc_origin)

> **upstream 정본**: [`devlog/_upstream_gjc/`](../../devlog/_upstream_gjc/) @ `40c8d7f`  
> **절대경로**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` · code facts는 클론 파일:line cite
> **MOC 정본**: `devlog/_plan/260612_jawcode_fork/082_moc_tui_input.md`
> **side**: `gjc_origin` · **최소 100줄** · patched SoT는 `structure/`

## 0. baseline 스냅샷 (요약)

이전 스냅샷 요약

# 082_input — TUI 입력 / IME (gjc_origin)

TUI 입력 — legacy 터미널 IME 경계에서 **Ctrl 단축키 미작동** upstream 버그.

- 한글 IME: Ctrl이 0x03 대신 자모 바이트 전달
- native matcher는 C0만 인식
- first-char cursor jump (082.2)

## 1. MOC 전문

```markdown
# 082 — TUI 입력/IME 이슈 (MOC)

> 상태: 🔍 조사 완료 / 수정 ⬜. 소속: 080 밴드(TUI)의 입력·IME 하위군.
> ⚠️ 번호 규약: 입력/IME 버그군을 082 하위(082.n)로 묶음 (cursor 도구군 = [081](./081_moc_cursor_tools.md)).
> 공통점: 둘 다 **업스트림 gjc 코드 (0 diff)**, 둘 다 **한글 IME 환경에서 발현**, 수정은 `packages/tui` 입력/렌더 경로.

## 하위 문서

| # | 이슈 | 원인 요지 | 상태 |
|---|------|-----------|------|
| [082.1](./082.1_issue_tui_ctrl_ime.md) | 한글 IME에서 Ctrl 단축키·종료 미작동 | legacy 터미널이 0x03 대신 자모 바이트 전달, native 매처가 C0만 인식 | ✅ 종료 안전망(ESC 2연타) / 일반 Ctrl=Kitty 권고 |
| [082.2](./082.2_issue_first_char_cursor_jump.md) | 첫 글자 입력 시 캐럿 우측 점프→복귀 | 플레이스홀더 프레임이 커서 마커를 꺼 미동기화 → 첫 글자 IME preedit 스냅 | ✅ 수정 (placeholder 마커 유지) |

## 공통 배경

`packages/tui`는 자체 차등 렌더러 + 하드웨어 커서(IME support) 모드. 입력 경로에 preedit/compose 처리가
없어 조합 글리프는 터미널/OS IME에 위임됨 (`showHardwareCursor` 기본 true). 두 이슈 모두 이 "IME는
터미널이 그린다 + 앱은 C0/마커 기반"이라는 구조에서 한글 IME가 가정을 벗어나며 발생.

## 수정 우선순위 (제안)

1. **082.2 (A 또는 B안)** — placeholder 프레임에서도 커서 마커 유지. 낮은 위험, UX 직접 개선.
2. **082.1 (A+B+C 조합)** — Kitty baseLayoutKey 경로 자모 fallback + IME 독립 종료 안전망. legacy 터미널은
   터미널이 modifier를 안 주면 근본 한계 → Kitty 지원 터미널(Ghostty/Kitty/WezTerm) 권고 병행.

## 완료 기준

- 082.1: 한글 IME에서 Ctrl+C/Ctrl+D/주요 단축키 동작 (최소 Kitty 프로토콜 터미널) + 종료 안전망
- 082.2: 빈 입력에 첫 한글 글자 입력 시 캐럿 점프 없음 (PI_TUI_DEBUG 프레임 로그로 검증)
```

## 2. 관련 devlog 문서 목록

- `082.1_issue_tui_ctrl_ime.md` — # 082.1 — issue: 한글 IME에서 Ctrl 단축키·종료가 안 먹음
- `082.2_issue_first_char_cursor_jump.md` — # 082.2 — issue: 첫 글자 입력 시 캐럿이 우측으로 튀었다 복귀 (IME preedit)

## 3. gjc_origin ↔ jwc_patched delta

| 항목 | gjc_origin | jwc_patched |
|---|---|---|
| 1 | upstream baseline | fork patched |
| 2 | upstream baseline | fork patched |
| 3 | upstream baseline | fork patched |
| 4 | upstream baseline | fork patched |

## 4. structure/ 링크

- `structure/INDEX.md`
- `structure/workflows.md`
- `structure/architecture.md`

## 5. upstream 계약

- AGENTS.md 수정 금지
- default workflows 표면: deep-interview (코드는 jaw-interview)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `082_input`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
