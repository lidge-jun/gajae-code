# Codex Transport — WS/SSE 전송·프리워밍·워치독·레이트리밋 텔레메트리 (정본)

> OpenAI Codex(ChatGPT 백엔드 Responses) 전송로의 jwc 전용 안정화·가시성 레이어 정본.
> 콜드스타트(프로덕션 2m15s 측정)·끊김·과부하를 줄이고 운영자에게 전송 상태를 노출한다.
> 모델 카탈로그/노출 패치는 [model_patches.md](./model_patches.md), 일반 검색은
> [search.md](./search.md) 참조. 구현 경위는 devlog 100 밴드 T1/T4/D5.

Codex는 다른 OpenAI-compat 프로바이더와 달리 **WebSocket 우선, SSE 폴백**의 자체 전송로를
쓴다(`packages/ai/src/providers/openai-codex-responses.ts`). 그 위에 네 가지 jwc 패치가 얹혀 있다.

---

## 1. WebSocket 라이프사이클 (T4)

- 핸드셰이크가 진행 중이면 **새 요청이 기존 pending 핸드셰이크에 조인**(중복 연결 방지),
  치명 오류에는 **유한 retry 예산**을 둬 무한 재시도를 막는다.
- 위치: `openai-codex-responses.ts` (`36738838`).

## 2. 워치독 — 네이티브 패리티 (T4 후속)

- **300s idle floor + first-event floor**: 첫 이벤트까지/이벤트 간 유휴를 300초 바닥으로 둬
  네이티브 Codex 클라이언트와 동일한 끊김 판정. 너무 짧은 타임아웃이 정상 스트림을 죽이던 문제 교정.
- 위치: `packages/ai/src/providers/register-builtins.ts`, `packages/ai/src/utils/idle-iterator.ts`
  (`93b7b66e`).

## 3. 콘텐츠 프리워밍 (T1)

- `generate:false` prefill로 모델 호스트를 미리 데우고, **유휴 시 최대 6회까지 4분 간격 갱신**.
  콜드스타트 2m15s를 상각. SDK 진입(`sdk.ts`)에서 세션 생성 시 best-effort로 발화.
- 위치: `packages/agent/src/agent.ts`, `packages/coding-agent/src/sdk.ts`,
  `packages/coding-agent/src/session/agent-session.ts` (`cd41e54d`).

## 4. 레이트리밋 텔레메트리 + 과부하 분류 (D5)

- 스트림 내 `codex.rate_limits` 푸시 이벤트를 캡처해 사용률을 추적, **≥75%면 푸터에 `%` 마커**.
- `server_is_overloaded`를 명시 분류해 일반 오류와 구분.
- 위치: `packages/ai/src/provider-details.ts`, `agent-session.ts` (`bad0a8e1`).

## 5. 전송 상태 가시성 (visibility)

- 푸터에 전송로 마커 `ws`/`sse`/`sse!`(폴백 강제) 표시, delta/full 로그, 폴백 발생 시 notice.
- 위치: `agent-session.ts` (`76176ce3`).

> 참고 — fast/service_tier 표시(`bf4feb28` ⚡? → `7315a7a6` revert): `/fast`의 `service_tier:priority`가
> 백엔드에서 조용히 `default`로 강등되는지 보이려 했으나, **`service_tier` 에코는 fast-실현 신호가
> 아님**이 판명돼 ⚡? 마커는 되돌렸다. `/fast` 설정 영속화 자체는 [fork-delta.md](./fork-delta.md) 참조.

---

## 근거 파일

| 영역 | 위치 | commit |
|---|---|---|
| WS 라이프사이클 | `packages/ai/src/providers/openai-codex-responses.ts` | `36738838` |
| 워치독 floor | `register-builtins.ts`, `utils/idle-iterator.ts` | `93b7b66e` |
| 프리워밍 | `agent/src/agent.ts`, `coding-agent/src/sdk.ts`, `agent-session.ts` | `cd41e54d` |
| 레이트리밋 텔레메트리 | `provider-details.ts`, `agent-session.ts` | `bad0a8e1` |
| 전송 가시성 | `agent-session.ts` | `76176ce3` |
| 안정화(레이트리밋 progress 중복·final-args refresh) | 리뷰 후속 | `65d36ec3` |
