# 100 MOC — Node 포팅 베이스라인 (M2 진입)

> 상태: ⬜. 결정 근거: D8 [확정] — 상주 네이티브의 유일한 길. 구 03 §결정 1의 치환 매핑 승계.

## 코드 사실 (구 01/03 조사 승계)

- 업스트림은 명시적 Bun 전용, 전 패키지 raw .ts 배포(빌드 산출물 없음)
- `check:node20-baseline`은 "Node 지원 허위 주장 방지" 가드일 뿐 — 지원 보장 아님
- `Bun.*` 사용처: ai ~20지점 / agent 4파일 / tui 7파일(포팅 제외)
- 포팅 범위: `packages/ai` + `packages/agent` + coding-agent 비TUI 경로만

## 치환 매핑

| Bun API | Node 대응 |
|---------|----------|
| `Bun.env` | `process.env` |
| `Bun.file` | `node:fs/promises` |
| `Bun.spawn` | `node:child_process` |
| `Bun.hash` | `node:crypto` / xxhash |
| `Bun.WebSocket` | Node 22 전역 WebSocket (undici) |
| `Bun.JSONL.parseChunk` | 자체 청크 파서 (base-stream.ts 내 국소화) |
| `Bun.JSON5` | `json5` npm |
| `bun:sqlite` | `better-sqlite3` (cli-jaw 기보유, API 근접) |

## 스코프

1. 셰임 레이어: [기본값] `packages/jwc/src/shims/` 에 런타임 감지 셰임 — 듀얼 런타임
   (Bun에서는 네이티브, Node에서는 셰임). 업스트림 파일 수정은 import 치환 최소 diff
2. 트랜스파일 빌드: [기본값] esbuild로 `packages/{ai,agent,coding-agent}` → `dist-node/` (tsc는 타입체크만)
3. 테스트 베이스라인: 업스트림 핵심 테스트(stream.test.ts 1,662줄 등)를 Node 22 러너로 통과
4. natives(napi-rs Rust)는 Node 로드 가능 형식 — 빌드 파이프라인만 검증

## 완료 기준

- `node dist-node/...` 로 createAgentSession 헬로월드 (실 프로바이더 1개 스트리밍 포함)
- 업스트림 stream/agent 테스트 Node 22 통과 목록을 본 밴드 문서에 기록
- Bun 경로 무회귀: `bun test` 기존 통과 유지

## 열린 질문

- 듀얼 런타임 유지비 vs Node 단일화 — [기본값] 듀얼 (TUI가 Bun이므로)
- 업스트림 리베이스 시 셰임 충돌 처리 규칙 (000 리베이스 정책에 위임)
