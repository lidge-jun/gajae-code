# 00 — MOC: jawcode Computer Use 통합

> 상태: 🟡 조사·실증 완료 / 통합 1/2 작동 (260613). jawcode에서 데스크톱 제어(computer use)를
> 쓸 수 있게 하는 두 방법론을 전부 실증하고 문서화한다.
> 입력: 사용자 — "codex computer use app을 jwc에서 쓸 수 있냐. openclaw·cli-jaw는 쓰는데
> 여기선 구조상 불가능하냐 뚫을 길이 있냐." → 조사 결과 **뚫을 수 있다**(방법론 A 작동 확인).

## 한 줄 결론

데스크톱 제어는 **모델 기능이 아니라 MCP 서버**다(codex의 computer-use도 `computer-use@openai-bundled`
번들 MCP 플러그인). jawcode는 SDK가 MCP 자동 디스커버리를 **격리(quarantine)**해놨을 뿐, 구조적으로
막힌 게 아니다 — 격리를 풀고 MCP 서버를 등록하면 **grok-4.3 포함 모든 툴 모델**이 데스크톱 제어를
쓸 수 있다(실증: grok-4.3이 `cursor_position`으로 실제 macOS 커서 좌표 반환).

## 두 방법론

| | 방법론 A — cu-mcp 재구현 | 방법론 B — 실물 Codex/Sky 앱 |
|---|---|---|
| 정체 | Sky 기술의 **좌표/스크린샷 기반 재구현**(Claude/Anthropic computer-use 스타일) | OpenAI가 **Sky 인수** 후 Codex에 번들한 **AX-트리 기반** 정품 |
| 위치 | `~/developer/codex/23_computer_use/src/cu-mcp-server` (+ `cu-native` Swift) | `~/.codex/computer-use/Codex Computer Use.app` (`SkyComputerUseClient mcp`) |
| 도구 | 29종: `left_click`·`screenshot`·`type`·`key`·`scroll`·`cursor_position`·`drag`·`teach`·`inspect`… | 10종: `list_apps`·`get_app_state`·`click`·`set_value`·`select_text`·`scroll`·`drag`·`press_key`·`type_text`·`perform_secondary_action` |
| 제어 모델 | 스크린샷 → 비전 추론 → 픽셀 좌표 클릭 | `get_app_state`(스크린샷+AX 트리+element_index) → 요소 단위 조작 |
| jawcode 연결 | ✅ **작동** (node 스크립트, 250ms 내 연결) | ⚠️ 메타는 되나 **액션 불가** — codex 부모 attestation([20](./20_methodology_b_codex_sky_app.md)) |
| grok-4.3 실증 | ✅ `cursor_position` → `264.24, 25.50` 실좌표 | 메타 10도구는 보이나 `list_apps` 액션 무응답 |
| jwc 직접 구동 | ✅ 가능(parent 요구 없음) | ❌ **불가** — Codex 트리 밖이면 code signature invalid→SIGKILL (리포트:303). codex 경유만 가능 |
| 선결 수정 | mouse.ts `$ref` 스키마 픽스 + cu-native debug→release 복사 ([10](./10_methodology_a_cu_mcp_reimpl.md)) | (a) codex 서브프로세스 dispatch, 또는 (b) 방법론 A 채택 |
| 노출 도구명 | `mcp__computer-use_*` (jawcode 브리지 네이밍) | cli-jaw는 `mcp__computer_use__*` 규약 |

## 공통 선결 조건 — jawcode MCP 격리 해제

두 방법론 모두 jawcode가 MCP를 자동 로드해야 한다. SDK(`sdk.ts:278/1273`)가 "MCP runtime discovery
is quarantined for the GJC surface"로 막아놔서, **CLI(main.ts)에서 `discoverAndLoadMCPTools`로
manager를 만들어 세션에 주입**하는 배선을 추가했다. 상세 [30](./30_jawcode_mcp_unquarantine.md). 커밋
`0b493665`.

## cli-jaw 게이트

cli-jaw는 "codex가 아니면 computer use 금지"를 **프롬프트 레벨**로 게이팅한다(employee.md·
a1-system.md·orchestration.md). jwc도 computer-use MCP를 갖게 됐으므로 **jwc를 codex와 동급
(self-serve)으로 추가**했다. 상세 [40](./40_cli_jaw_gate.md).

## 문서

| # | 문서 | 내용 |
|---|---|---|
| 00 | 본 MOC | 결론·두 방법론 비교·계보 |
| [10](./10_methodology_a_cu_mcp_reimpl.md) | 방법론 A — cu-mcp 재구현(좌표 기반), 작동 경로·수정·실증 |
| [20](./20_methodology_b_codex_sky_app.md) | 방법론 B — 실물 Codex/Sky 앱(AX 트리), 250ms 블로커·parent coderequirement |
| [30](./30_jawcode_mcp_unquarantine.md) | jawcode MCP 격리 해제 배선(main.ts) + 250ms startup 레이스 + 스키마 정규화 |
| [40](./40_cli_jaw_gate.md) | cli-jaw "codex-only" 게이트에 jwc 추가 |
| [50](./50_two_tier_routing_synctoall.md) | **2-tier 라우팅(Sky=codex / cu-mcp=나머지) + syncToAll 최신화(kiro 추가·grok 자동·claude 경로 검증)** |

## 진행

- [x] 두 방법론 실물 확인 + standalone MCP 프로브(A 29도구·B 10도구)
- [x] jawcode MCP 격리 해제 배선 (`0b493665`)
- [x] 방법론 A 엔드투엔드 실증 (grok-4.3 → cursor_position 실좌표)
- [x] cli-jaw 게이트에 jwc 추가 (프롬프트 3종)
- [x] 방법론 B 근본 블로커 규명 — **codex 부모 코드서명 attestation**(team 2DC432GLL2, Codex 트리
  밖이면 SIGKILL). 250ms는 표면일 뿐. 실증: bash 부모로 메타 OK·액션 무응답. cli-jaw는 codex 경유.
- [ ] (선택) 방법론 B를 jwc에서 쓰려면 codex 서브프로세스 dispatch 경로 설계 — 미착수
- [x] **2-tier 라우팅** ([50](./50_two_tier_routing_synctoall.md)) — Sky=codex / cu-mcp=나머지
  - [x] syncToAll 최신화: kiro 타깃 추가(`toClaudeMcp` 재활용) · grok 자동(조치 없음) · claude 경로 **수정** (`~/.mcp.json`→`~/.claude.json`)
  - [x] codex 타깃 cu-mcp 제외 분기 (`filterServers`, Sky 중복 방지)
  - [ ] cu-mcp 통합 MCP 등록 → 전파 (수동 등록 가능, syncToAll 런타임 확인 필요)
  - [x] 프롬프트 2-tier 게이트 재작성 (Tier1=cu-mcp self-serve / Tier2=codex AX dispatch)
  - [x] cli-jaw 빌드 완료 (`npm run build`, dist 반영 검증)
- [ ] **좌표 정밀도 개선 (deferred)** — GPT-5.5 등 비-Claude 모델의 비전 좌표 추론이 부정확. cu-mcp 코드베이스에 이미 구현된 인프라: 그리드 오버레이(`cu-native drawGrid`), 비전 보정 계수(`est:N` 1.56x/1.97x), AX semantic press(`ax_press`), 커서 프리뷰(`cmdPreview`), 그리드 줌(`cmdGridZoom`). 가장 효과적인 미구현: **Set-of-Mark(SoM)** — AX 요소 열거 → 스크린샷에 번호 바운딩 박스 → 모델이 번호 지정 → 서버가 중심 좌표 변환. 순수 JS(inspect+sharp). cli-jaw 2-tier와 연계 시 cu-mcp 프로바이더별 정밀도 보상 전략.
- [ ] 사용자 검수
