# Scroll — TUI 스크롤/뷰포트 모델 (정본)

> jwc TUI의 스크롤 모델 전체: 차등 렌더러의 물리 제약, 컴포저 핀(ViewportFill), floor/압축,
> 커밋 시점 접기, 레퍼런스(Codex/CC) 대조. 083.6/083.7/99.20.03/99.20.04의 구현 결과를 단일
> 문서로 통합한 SoT. 사용자 e2e 확인: 260613 00:25.

## 1. 모델 — 스크롤백-네이티브

jwc는 CC(구세대)·gjc 계열의 **스크롤백-네이티브** 모델이다: 프레임 = 전체 트랜스크립트이고,
터미널 스크롤백이 히스토리의 1급 저장소다 (위로 스크롤 = 진짜 과거). 차등 렌더러가 변경 행만
다시 그리고, 뷰포트를 넘어간 행은 스크롤백으로 들어간다.

**물리 제약 (모든 설계의 출발점)**: 터미널은 **un-scroll이 불가능**하다. 버퍼에 들어간 행은
지울 수만 있고(2K) 회수할 수 없다. 따라서 "프레임 수축"은 반드시 잔여물(빈 행)을 남기며,
이를 어디에 두고 언제 청소하느냐가 스크롤 UX의 전부다.

## 2. 프레임 레이아웃 (B2-lite — 083.7 §11)

```
[ 환영 배너 ]                ← 상단 고정 (스크롤백으로 자연 진입)
[ ViewportFill ]             ← 뷰포트 잔여 높이만큼 늘어나는 스페이서
[ chatContainer ]            ← 트랜스크립트 (커밋된 셀만, 단조 성장)
[ pendingMessages ]          ┐
[ liveToolContainer ]        │ ← 99.20.04 라이브 존: 실행 중 도구 preview
[ statusContainer(로더) ]    │
[ todo / btw / statusLine ]  │ 컴포저 클러스터 — 항상 터미널 바닥에 밀집
[ hookAbove / editor / hookBelow ] ┘
```

- fill이 채팅 **위**에 있는 게 핵심 (B2-lite): 콘텐츠·슬래시 출력·셀렉터 복구가 전부 입력창
  주변(바닥)에 모이고, 수축 델타는 **상단 여백**이 흡수한다. §0의 B2 기각 근거(전화면 diff·
  스크롤백 붕괴)는 frame ≤ viewport 구간에선 무효 — 줄 이동은 스크롤백 진입 전에만 발생.
- 마운트: `interactive-mode.ts` (addChild 순서). 활성화 해석:
  `!$flag("PI_NO_COMPOSER_PIN") && (settings.get("tui.composerPin") ?? isJawBrand())`.

## 3. ViewportFill 메커니즘 (`packages/tui/`)

| 단계 | 위치 | 동작 |
|------|------|------|
| 센티널 방출 | `components/viewport-fill.ts` | `VIEWPORT_FILL_SENTINEL` 1줄 (disabled면 0줄 — 레거시 바이트 동일) |
| 확장 | `tui.ts #expandViewportFill` — 트리 렌더 직후·오버레이 합성 **이전** | 첫 센티널을 `max(0, target - 콘텐츠줄수)`개의 빈 줄로 치환, 추가 센티널 제거. 렌더러 코어 분기 무수정 |
| **sticky gap** (§9→§12) | 동일 함수 `#viewportFillGap`/`#viewportFillFloor` | 초과 구간 수축 시 갭이 늘어 컴포저를 바닥에 고정(풀렌더 1회). **성장 시 갭 동결** — 프레임이 끝에서 자라 append-only diff 유지 (§12: 갭을 위에서 소비하면 전 행 시프트 → append마다 3J 풀렌더 폭풍). 갭은 상단(스크롤백 쪽)이라 뷰포트에 안 보임 |
| gap 추적 | `#viewportFillGap` | floor가 적립한 빈 행 수 |
| **압축** (§10) | `compactViewportFill()` | floor/gap 리셋 + `requestRender(true)` — 전체 트랜스크립트 재인쇄로 스크롤백을 빈 행 없이 재구축. 갭 0이면 no-op |

압축 트리거 맵 (정본: devlog `99.20.03_issue_transient_shrink_triggers.md`):
agent_end(`event-controller.ts #handleAgentEnd`) · 슬래시 디스패치 완료(`input-controller.ts`
`slashResult === true`) · ctrl+o/ctrl+t 토글 말미. 잔여 에지: ESC 드롭다운(제출 없음).

## 4. 커밋 시점 접기 (99.20.04 — 수축의 근원 제거)

`tool.renderMode` (미지정 = 브랜드 기본: jwc=commit, gjc=verbose):

- **commit**: 실행 중 도구는 `liveToolContainer`(라이브 존)에서만 펼쳐 보이고, 완료 시
  `setMinimized(true)` 상태로 chatContainer에 **단 한 번** append — 히스토리 단조 성장,
  도구발 수축 원천 소멸. agent_end가 잔여 라이브 셀 일괄 커밋(abort 안전망).
- **verbose**: 083.1 현행 — preview가 히스토리에 흐르고 사후 접힘(§9/§10 안전망 의존).
- 구현: `event-controller.ts` `#commitFoldingEnabled`/`#commitLiveTool`. ctrl+o 스윕은
  라이브 존 자식도 순회(`input-controller.ts setToolsExpanded`).

## 5. fullRender와 스크롤백 재구축

`fullRender(true)` = `2J H` (+비멀티플렉서 `3J`) 후 **프레임 전체(=전체 트랜스크립트) 재인쇄** —
스크롤백이 내용 동일하게 재구성되므로 히스토리가 보존된다(압축이 안전한 이유). 멀티플렉서
(tmux/zellij)는 3J 생략 + `multiplexerViewportRepaint` 경로. 발화 분기: width/height 변화,
`firstChanged < viewportTop`, `extraLines > height`, clearOnShrink(기본 off), requestRender(true).

## 6. 레퍼런스 대조 (소스 실측 — `~/Developer/codex/01_tui-design/` 보강 섹션)

| | jwc | Codex | CC (현세대) |
|---|---|---|---|
| 모델 | 스크롤백-네이티브 (프레임=트랜스크립트) | **inline viewport 기본** — 커밋 셀만 `insert_history.rs`(SetScrollRegion+`\x1bM`)로 실 스크롤백에 write, 이후 불변 | alt-screen + 더블버퍼 — 스크롤백에 아무것도 안 씀 |
| 접기 | commit 모드: 커밋 시점 접기 (head/tail 아님, minimized 1줄) | compact-from-birth: head 5+tail 5+`…+N lines`로 커밋 | 완료 항목 컴팩트 출생 |
| 과거 보기 | 터미널 스크롤백(진짜) + alt+t 오버레이 | Ctrl+T transcript 오버레이 | ctrl+o/오버레이 |
| 수축 문제 | floor+압축으로 방어 (커밋 모드에선 거의 발생 안 함) | 구조적 부재 | 구조적 부재 |

jwc가 스크롤백-네이티브를 유지하는 이유: 사용자가 터미널 스크롤로 과거를 실제로 읽음(확인됨) +
tmux 친화. alt-screen 전환은 99.20 장기 메모로만 존재.

## 7. 설정·이스케이프·가드

- `tui.composerPin` (boolean, 미지정=브랜드 기본) · `tool.renderMode` (enum, 동일) —
  settings UI에서 미지정은 **"default"로 표기** (`settings-selector.ts`).
- `PI_NO_COMPOSER_PIN=1` — 핀 강제 off (리그레션 대조용).
- 크래시 가드: `settings-list.ts`가 비-string currentValue에 내성 (`String(v ?? "")`) —
  260613 00:08 `/settings` 전체 다운(undefined→`truncateToWidth` native throw)의 재발 방지.

## 8. 테스트 자산

- `packages/tui/test/viewport-fill.test.ts` — **13케이스**: 핀 불변식(grow/collapse×3) ·
  clearOnShrink 미발화 · 센티널 규칙 · 경계 상/하향 통과 · off 경로 바이트 동일 · 커서 정합 ·
  리사이즈 · post-overflow 수축(autocomplete/접힘) · 갭 압축+no-op · 슬래시 복구 ·
  **뷰포트 초과 셀렉터 복구**(260613 00:04 스크린샷 시나리오).
- `packages/tui/test/settings-list-undefined-value.test.ts` — 크래시 회귀.
- `packages/coding-agent/test/commit-time-folding.test.ts` — 라이브존→접힌 커밋 · agent_end
  잔여 커밋 · verbose 보존.

## 관련 문서

- devlog: `083.6`(출렁임 기전) · `083.7`(핀 §1~§11) · `99.20.03`(압축 트리거 맵) ·
  `99.20.04`(커밋 폴딩 설계·구현·핫픽스)
- 주입/프롬프트와의 경계: [prompt_flow.md](./prompt_flow.md) — 스크롤은 표시층, 주입은 컨텍스트층.
