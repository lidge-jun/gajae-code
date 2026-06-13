# Codex Transport — WS/SSE 전송·프리워밍·워치독·레이트리밋 텔레메트리 (정본)

> OpenAI Codex(ChatGPT 백엔드 Responses) 전송로의 jwc 전용 안정화·가시성 레이어 정본.
> 콜드스타트(프로덕션 2m15s 측정)·끊김·과부하를 줄이고 운영자에게 전송 상태를 노출한다.
> 모델 카탈로그/노출 패치는 [model_patches.md](./model_patches.md), 일반 검색은
> [search.md](./search.md) 참조. 구현·진단 경위는 [devlog/_fin/000000_reformation](../devlog/_fin/000000_reformation/00_moc_toolcall_loop_reformation.md)
> (T1/T4/D5 + 측정 기반 진단).

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
- 위치: `packages/ai/src/providers/register-builtins.ts`, `packages/ai/src/utils/idle-iterator.ts`,
  `openai-codex-responses.ts`(SSE idle 폴백) (`93b7b66e`).

## 3. 콘텐츠 프리워밍 (T1)

- `generate:false` prefill로 모델 호스트를 미리 데우고, **유휴 시 최대 6회까지 4분 간격 갱신**.
  콜드스타트 2m15s를 상각. SDK 진입(`sdk.ts`)에서 세션 생성 시 best-effort로 발화.
- **모델 전환 시 idle-refresh 타이머 취소**(`1efee068`): 모델을 바꾸면 진행 중인 유휴 갱신 타이머를
  취소하고, 다음 turn_end에 새 모델이 여전히 codex면 재무장한다(stale 모델 프리워밍 방지).
- 위치: `packages/agent/src/agent.ts`, `packages/coding-agent/src/sdk.ts`,
  `packages/coding-agent/src/session/agent-session.ts` (`cd41e54d`, `1efee068`).

## 4. 레이트리밋 텔레메트리 + 과부하 분류 (D5)

- 스트림 내 `codex.rate_limits` 푸시 이벤트를 캡처해 사용률을 추적, **≥75%면 푸터에 `%` 마커**
  (마커 렌더는 `packages/coding-agent/src/modes/components/status-line/segments.ts`).
- `server_is_overloaded`를 명시 분류해 일반 오류와 구분.
- 위치: `packages/ai/src/provider-details.ts`(레이트리밋 값), `agent-session.ts`, `segments.ts`(푸터 `%`) (`bad0a8e1`).
- **레이트리밋 watchdog 우회 (`65d36ec3`)**: `codex.rate_limits`를 `CODEX_PROGRESS_EVENT_TYPES`에
  넣어, 추론 정적 구간에서 레이트리밋 푸시만 흐를 때 300s idle 워치독이 오발화해 스트림을 죽이던
  문제를 막는다(+ final-args refresh 중복 제거).

## 5. 전송 상태 가시성 (visibility)

- 푸터에 전송로 마커 `ws`/`sse`/`sse!`(폴백 강제) 표시, delta/full 로그, 폴백 발생 시 notice.
- 위치: `agent-session.ts` (`76176ce3`).

> 참고 — fast/service_tier 표시(`bf4feb28` ⚡? → `7315a7a6` revert): `/fast`의 `service_tier:priority`가
> 백엔드에서 조용히 `default`로 강등되는지 보이려 했으나, **`service_tier` 에코는 fast-실현 신호가
> 아님**이 판명돼 ⚡? 마커는 되돌렸다. `/fast` 설정 영속화 자체는 [fork-delta.md](./fork-delta.md) 참조.

---

## 6. 진단 결론 — "fast 둔화"는 서버측 (클라 수리 불가)

위 패치들은 전송 **안정화·가시성**이며, 사용자가 겪은 "대화 이어가면/끊어치면 출력 둔화,
기다리면 회복"의 **근본 원인은 아니다.** 측정 기반 진단(전문: [10.04](../devlog/_fin/000000_reformation/10.04_symptom_burst_slowdown.md)):

- **원인 = gpt-5.5 `fast`(service_tier=priority) 서버측 회귀.** 5중 확정: ① 사용자 실증(fast off→둔화0)
  ② 코드(codex·jwc 모두 passthrough — tier 전용 타임아웃/재시도 없음, 100% 서버측)
  ③ openai/codex 이슈 다발(#24422 등, 2026-04~, 미해결) ④ headless 버스트 미재현(간헐 서버 현상)
  ⑤ 공식 문서(priority는 spiky 트래픽 부적합).
- **기각된 가설(측정)**: 서버 quota 스로틀(rate_limits 6% 평탄) / 클라 라운드당 clone+stringify
  (마이크로벤치 0.6ms) / 배칭 프롬프트 유도(gpt-5.5 무반응, revert).
- **완화책**(수리 아님): `/fast off`(=`serviceTier:none`) + effort `:high→:medium`(체감 3~5x) +
  단순작업 `gpt-5.4-mini`. 가시성 패치(델타/full 로그·rate_limit 텔레메트리)가 **이 진단을 가능케 함**.

## 7. 별개 상존 — TUI 긴-텍스트 마크다운 O(n²) (전송 무관)

- `coding-agent/src/modes/components/assistant-message.ts:193` `updateContent`가 텍스트 델타마다
  누적 전체 텍스트로 `new Markdown(fullText)` 재생성 → 캐시 키가 전체 텍스트라 토큰마다 미스 →
  전체 lexer+highlight 재실행 = **출력 길이에 O(n²)**. 긴 단일 응답 렌더 둔화 유발(본 fast 증상의
  주인은 아님). **확정 패치 후보**지만 보호된 TUI 영역(메모리 `tui-visual-design-protected`)이라
  코얼레싱/tail-only 파싱은 시각 검증 후 적용. (툴-args O(n²) `G5`는 이미 수리 — `1814bb95`.)

## 근거 파일

| 영역 | 위치 | commit |
|---|---|---|
| WS 라이프사이클 | `packages/ai/src/providers/openai-codex-responses.ts` | `36738838` |
| 워치독 floor | `register-builtins.ts`, `utils/idle-iterator.ts` | `93b7b66e` |
| 프리워밍 | `agent/src/agent.ts`, `coding-agent/src/sdk.ts`, `agent-session.ts` | `cd41e54d` |
| 레이트리밋 텔레메트리 | `provider-details.ts`, `agent-session.ts` | `bad0a8e1` |
| 전송 가시성 | `agent-session.ts` | `76176ce3` |
| 안정화(레이트리밋 progress 중복·final-args refresh) | 리뷰 후속 | `65d36ec3` |
