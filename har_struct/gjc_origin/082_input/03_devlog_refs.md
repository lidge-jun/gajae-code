# 082_input — devlog refs (gjc_origin)

> `082*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `082_moc_tui_input.md` | # 082 — TUI 입력/IME 이슈 (MOC) | 29 |
| `082.1_issue_tui_ctrl_ime.md` | # 082.1 — issue: 한글 IME에서 Ctrl 단축키·종료가 안 먹음 | 95 |
| `082.2_issue_first_char_cursor_jump.md` | # 082.2 — issue: 첫 글자 입력 시 캐럿이 우측으로 튀었다 복귀 (IME preedit) | 63 |
| `082_moc_tui_input.md` | # 082 — TUI 입력/IME 이슈 (MOC) | 29 |

## 2. MOC 헤딩 트리

# 082 — TUI 입력/IME 이슈 (MOC)
## 하위 문서
## 공통 배경
## 수정 우선순위 (제안)
## 완료 기준

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

### 082.1_issue_tui_ctrl_ime.md

```markdown
# 082.1 — issue: 한글 IME에서 Ctrl 단축키·종료가 안 먹음

> 상태: ✅ **부분 수정 (종료 안전망, 260612 10시)** / 일반 Ctrl 단축키는 Kitty 터미널 권고. 조사: Opus 서브에이전트.
> 수정: **ESC 2연타 → 종료 안전망**(C안)을 `custom-editor.ts`에 추가 — ESC는 IME 무관하게 항상 0x1b라,
> 한글 IME에서 ctrl+d/ctrl+c가 안 먹혀도 **항상 빠져나갈 수 있음**. 첫 ESC는 기존 interrupt, 윈도우(500ms) 내
> 두 번째 ESC가 onExit. 테스트 4건 추가. ⚠️ 일반 Ctrl 단축키 자모 remap은 **미채택**(아래 §결정).
> 소속: 082 밴드 (TUI 입력/IME, [082_moc_tui_input.md](./082_moc_tui_input.md)). 발현 표면 = TUI interactive 모드. **업스트림 gjc 버그(0 diff 확인)**.
> 입력: 사용자 "tui 종료나 ctrl 커맨드가 영문으로만 먹는다, Ctrl+ㅊ(=Ctrl+C) 안 먹는 문제".

macOS 입력 소스가 **한글(두벌식)** 일 때 jwc/gjc TUI에서 Ctrl 단축키와 종료(Ctrl+C/Ctrl+D)가 안 먹는다.
물리적으로 Ctrl + 'c' 키(한글 레이아웃에선 'ㅊ')를 눌러도 동작하지 않고, 자모가 입력창에 텍스트로 들어간다.

## 원인 메커니즘 (확정 95%)

**터미널이 0x03이 아니라 한글 자모 바이트를 보내고, parser가 그걸 Ctrl 코드로 인식 못 해 텍스트로 흘린다.**

바이트 흐름 (각 hop):
1. raw 모드 stdin (`packages/tui/src/terminal.ts:166` `setRawMode(true)`) — 멀티바이트 UTF-8을 그대로 Buffer 전달.
   **raw 모드라 Ctrl+C가 SIGINT를 안 만든다** → 종료도 named binding에만 의존.
2. decode (`packages/tui/src/stdin-buffer.ts`) → string.
3. dispatch: `packages/coding-agent/src/modes/components/custom-editor.ts:201` `handleInput` →
   `#matchesAction()`(`:103`) → `matchesKey(data, "ctrl+c")`. 실패 시 `:352 super.handleInput` →
   base Editor(`packages/tui/src/components/editor.ts:1317`)가 `extractPrintableText`로 뽑아 입력창에 삽입.
4. **핵심 손실 지점**: `packages/tui/src/keys.ts:523` `matchesKey` → native 매처. legacy(non-Kitty) 경로는
   **C0 컨트롤 바이트(0x01–0x1A)로만** Ctrl+letter를 인식. 한글 자모(ㅊ = U+314A, UTF-8 `0xe3 0x85 0x8a`)는
   컨트롤 바이트가 아니라 매칭 실패 → printable로 분류.

코드베이스에 **한글 자모 → QWERTY 역매핑이 전혀 없음**(`grep jamo|두벌식|hangulToQwerty` → 0건). 영문 키 가정이 구조적.

## 증거 (native 매처 직접 실행)
```

### 082.2_issue_first_char_cursor_jump.md

```markdown
# 082.2 — issue: 첫 글자 입력 시 캐럿이 우측으로 튀었다 복귀 (IME preedit)

> 상태: ✅ **수정 완료 (B안, 260612 10시)**. 조사: Opus 서브에이전트.
> 수정: `editor.ts` placeholder 블록(`784-789`)을 `showPlaceholder && !this.#useTerminalCursor`로 가드 —
> 하드웨어 커서 모드에선 placeholder가 마커를 끄지 않고, 기존 ghost-text 경로(`835-843`)가 marker+placeholder를
> 렌더해 커서가 입력 시작 컬럼에 동기화됨. 회귀 테스트 2건 추가(`editor.test.ts`), tui 896 pass.
> ⚠️ 실행 중 jwc는 재시작해야 반영(소스 symlink 직결, 재빌드 불필요).
> 소속: 082 밴드 (TUI 입력/IME, [082_moc_tui_input.md](./082_moc_tui_input.md)). **업스트림 gjc 코드 (0 diff)**.
> 입력: 사용자 "첫글자 입력이 오른쪽으로 처음에 가버린다 — 타이핑하면 거의 바로 돌아오지만 UX 문제". (IME 관련 추정 — 확인됨)

빈 입력창에 **첫 글자**를 치면 캐럿이 잠깐 오른쪽(잘못된 컬럼)으로 튀었다가, 이어 타이핑하면 거의 바로
제자리로 복귀한다. 한 프레임짜리 전이 글리치. **컬럼 산수 버그가 아니라 커서 표시 타이밍 + IME preedit 문제.**

## 원인 메커니즘 (신뢰도 75%)

**플레이스홀더 프레임이 하드웨어 커서를 "숨김+위치 미동기화"로 두고, 첫 글자 프레임에서 커서를 재표시하는
순간 IME 조합(preedit) 글리프가 직전 잔류 위치에서 정착 위치로 스냅**되는 것:

1. **빈 입력 = 플레이스홀더 프레임**: 에디터가 비면 `showPlaceholder = true` (`packages/tui/src/components/editor.ts:767`).
   이 분기가 "Type your message..."를 dim으로 그리며 **`hasCursor = false`로 강제 → `CURSOR_MARKER` 미방출**
   (`editor.ts:784-789`).
2. **마커 없음 → 커서 숨김만, 컬럼 미이동**: `#cursorControlSequence`가 `\x1b[?25l`(숨김)만 내보내고 물리
   컬럼은 직전 위치에 잔류 (`packages/tui/src/tui.ts:1525` `if (!cursorPos…) return {seq:"\x1b[?25l"…}`,
   `#hideCursor` `tui.ts:446-448`).
3. **첫 글자 프레임**: `showPlaceholder = false` → 마커 재방출 → `\x1b[?25h`로 커서 재표시. 최종 컬럼은
   절대 위치(`\x1b[${col+1}G`, `tui.ts:1539-1540`)라 **목표 컬럼은 정확**. 그러나 IME 활성 한글 입력은
   조합 중 음절을 **커서 재표시 시점 위치**에 그리는데, 커서가 직전 잔류 위치에서 정착 위치로 한 프레임 스냅 →
   "우측 점프 후 복귀"로 보임.

핵심: **플레이스홀더 분기가 의도적으로 마커를 꺼(`editor.ts:788`) 하드웨어 커서를 미동기화 상태로 둔다.**
```

### 082_moc_tui_input.md

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
