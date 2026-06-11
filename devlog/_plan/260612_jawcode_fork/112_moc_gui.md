# 112 MOC — GUI (cli-jaw 네이티브 런타임 GUI + Claude Desktop 연계)

> 상태: ⬜ [제안]. 입력: 사용자 "GUI 구현 혹은 cli-jaw 앱에서 네이티브로 런타임 GUI, Claude Desktop 관련 조사" (260612 06시).
> 조사: 웹 리서치 서브에이전트 (Claude Desktop 표면 / 네이티브 GUI 옵션 / 선행 사례 3트랙).
> 소속: 110 밴드 (JawRuntime 상주 서비스의 표면 트랙) — jwc가 cli-jaw에 임베드되면 GUI는 cli-jaw 대시보드/셸이 표면이 된다.

핵심 발견: **cli-jaw에는 electron 데스크톱 셸이 이미 절반 구축되어 있다.** 따라서 이 밴드의 본선은
"새 GUI 만들기"가 아니라 **기존 셸 완성**이고, Claude Desktop은 주 GUI가 될 수 없어 보조 채널로만 쓴다.

## 코드 사실 (cli-jaw, 260612 실사)

- 서버: Node ≥22.4 + Express 단일 서버, 기본 포트 **3457** (`/Users/jun/Developer/new/700_projects/cli-jaw/server.ts:139`,
  `src/core/config.ts:44`). 라우트 ~30모듈 (`src/routes/`)
- 대시보드: `public/` 정적 웹앱 + **`manifest.json` + `sw.js` → 이미 PWA 설치 가능**.
  실시간은 WebSocket이 아닌 **SSE** (`GET /api/events`; legacy WS 제거 — `server.ts:316` 주석)
- **`electron/` 셸 존재 (v0.1.0, 진행 중)**: electron-vite + electron-builder. `jaw dashboard serve`
  attach 또는 직접 spawn, 패키징 시 `extraResources/server` Node sidecar, `node-pty` 포함,
  관리 레인 24576(웹)/24577–24590(Electron) — `electron/README.md`, `electron/package.json` (electron ^41.4.0)
- jawcode `packages/tui`는 터미널 전용 차등 렌더러 — GUI 전용 불가, 본 밴드와 무관

## Claude Desktop을 GUI로 쓰는 길 — 가능/불가능 경계

**가능 (공식 지원)**:

- 로컬 stdio MCP 서버의 원클릭 설치 — `.dxt`는 **`.mcpb`(MCP Bundles)로 개명**되어 MCP 프로젝트에 기증됨
  > 출처: [modelcontextprotocol/mcpb](https://github.com/modelcontextprotocol/mcpb), [MCP 블로그 2025-11-20](https://blog.modelcontextprotocol.io/posts/2025-11-20-adopting-mcpb/), [Anthropic 엔지니어링](https://www.anthropic.com/engineering/desktop-extensions)
- **MCP Apps 리치 UI 인라인 렌더링 — 이미 출시**: SEP-1865 Final, 2026-01-26 Claude Desktop 포함 전 플랫폼
  출시. 툴의 `_meta.ui.resourceUri` → `ui://` HTML 리소스 → 샌드박스 iframe + postMessage JSON-RPC
  > 출처: [SEP-1865](https://modelcontextprotocol.io/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp), [MCP Apps 스펙](https://modelcontextprotocol.io/extensions/apps/overview), [Claude 블로그](https://claude.com/blog/interactive-tools-in-claude)
- 리모트 MCP 커넥터 — 단, Anthropic 클라우드에서 접속하므로 localhost:3457 직결 불가
  > 출처: [커스텀 커넥터 가이드](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)

**불가능 (경계)**:

- 외부 런타임의 **상주 프론트엔드**로 쓰기 — MCP 서버가 대화를 개시하거나 사이드바/패널 상주 불가,
  MCP App UI는 툴 호출 결과로 대화 안 인라인만
- Claude Desktop은 MCP sampling ❌ / roots ❌ — cli-jaw가 Desktop의 모델을 빌려 쓰는 것도 불가
  > 출처: [MCP clients 매트릭스](https://github.com/modelcontextprotocol/docs/blob/main/clients.mdx)

→ **결론: Claude Desktop = 보조 표면** (`.mcpb`로 jaw 툴 노출 + MCP Apps로 상태 보드 인라인). 주 GUI 불가.

## 네이티브 GUI 4옵션 — MLB 20-80 스카우팅

| 옵션 | 개발비용 | 유지보수 | UX | Bun호환 | 배포 | 총평 |
|---|---|---|---|---|---|---|
| **Electron (기존 셸 완성)** | **65** | 50 | 60 | 45 | 40 | 셸이 이미 있어 한계비용 최저. Bun은 sidecar만 |
| Tauri v2 | 45 | 60 | 55 | 60 | 60 | 번들 ~9MiB, `bun --compile` sidecar 공식 수용. 단 전면 재작성 + Rust 툴체인 |
| Neutralinojs | 55 | 45 | 45 | 60 | 65 | 경량이나 소규모 팀, 자식 프로세스 정리 미흡 |
| PWA + Add to Dock | 70 | 65 | 50 | 70 | 75 | 빌드 제로 — `public/`이 이미 PWA, 오늘 바로 가능 |

근거 (주요):
> 출처: [Hopp Tauri vs Electron 벤치마크](https://www.gethopp.app/blog/tauri-vs-electron) (번들 244MiB vs 8.6MiB),
> [electron#34876](https://github.com/electron/electron/issues/34876) (Bun main 프로세스 공식 거절),
> [Tauri sidecar 문서](https://v2.tauri.app/develop/sidecar/) · [Node.js sidecar 가이드](https://v2.tauri.app/learn/sidecar-nodejs/),
> [Bun 단일 바이너리](https://bun.com/docs/bundler/executables) (darwin-arm64 크로스 타깃),
> [Apple — Add to Dock](https://support.apple.com/en-us/104996),
> [Apple — 로컬 빌드 앱은 quarantine 미적용 → 공증 불필요](https://support.apple.com/guide/security/gatekeeper-and-runtime-protection-sec5599b66df/web)

## 선행 사례 교훈

| 프로젝트 | 스택 | 상태 |
|---|---|---|
| [opcode (구 claudia)](https://github.com/winfunc/opcode) | Tauri 2 + React, Claude Code 래퍼 | 2025-10 이후 정체 |
| [Crystal](https://github.com/stravu/crystal) | Electron, CLI 병렬 worktree | 2026-02 deprecated |
| [vibe-kanban](https://github.com/BloopAI/vibe-kanban) | Rust+React 멀티 CLI | 선셋 공지 |
| [opencode](https://github.com/anomalyco/opencode) | **자체 서버 + OpenAPI/SSE 클라이언트 분리** | 매우 활발 |
| [happy](https://github.com/slopus/happy) | Expo/RN + E2E 동기화 | 활발 |

**패턴**: 단순 CLI 래퍼는 1st-party GUI([Claude Code Desktop 탭](https://code.claude.com/docs/en/desktop-quickstart)) 등장 후 줄줄이
정체/아카이브. 생존한 건 자체 클라이언트/서버 프로토콜 보유(opencode형) — **cli-jaw는 이미 opencode형 구조라 유리**.
Agent SDK로 커스텀 GUI를 만드는 것은 공식 권장 패턴이나, 배포 제품은 API 키 필수 + 2026-06-15부터
구독 플랜 SDK 사용은 별도 크레딧 차감.
> 출처: [Agent SDK 개요](https://code.claude.com/docs/en/agent-sdk/overview), [Claude 플랜의 SDK 사용 정책](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)

## [제안] 추천안

1. **즉효 (0비용)**: Safari **Add to Dock**으로 `localhost:3457` 대시보드를 독립 앱화 — 오늘 가능
2. **본선**: 기존 `electron/` 셸 완성 — jwc는 `bun build --compile` 바이너리를 `extraResources`
   sidecar로 탑재 (Bun이 main이 될 수 없으므로 어떤 프레임워크든 동일한 답; M2 임베딩과 정합)
3. **보조**: Claude Desktop용 `.mcpb` 번들 + MCP Apps 상태 패널 — 주 GUI 아님, 역할 분담
4. 개인용 로컬 빌드는 공증/$99 불필요 (quarantine 미적용, ad-hoc 서명으로 충분)

## 완료 기준

- electron 앱 기동 → cli-jaw 서버 attach/spawn + 대시보드 렌더 + jwc sidecar로 대화 1회 e2e
- (보조 트랙 착수 시) Claude Desktop에 `.mcpb` 설치 → jaw 툴 1회 호출 + MCP Apps 패널 1회 렌더

## 열린 질문 (착수 전 인터뷰)

1. 착수 시점 — M2 110–139(상주 런타임) 완료 전 electron 셸을 먼저 완성할지, 후행할지
2. electron 셸의 jwc sidecar 탑재 방식 — `bun --compile` 단일 바이너리 vs 시스템 bun 의존
3. Claude Desktop 보조 트랙(`.mcpb`+MCP Apps)을 본 밴드에 포함할지 별도 밴드로 뺄지
