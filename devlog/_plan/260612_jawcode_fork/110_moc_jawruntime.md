# 110 MOC — JawRuntime 상주 서비스

> 📐 상세 설계: [111_design_runtime_attach.md](./111_design_runtime_attach.md) — M2 100–130 통합 설계
> (spawnAgent 어댑터 시맨틱, JawRuntime 풀/steer=session.prompt(steer), 이벤트 매핑 원칙, M1 산출물 시너지: GJC_BRAND_NAME=jwc로 030 디스커버리 그대로 동작).

> 상태: ⬜. 결정 근거: D1/D8 [확정] — cli-jaw 서버 프로세스 안 상주, spawn 소멸. 구 02/03 시임 분석 승계.
> **111 실측 보강 260612** — [111 §착수 전 실측 보강] 참조: in-process SDK 권고 실측 확인, cli-jaw 어댑터 솔기(spawn.ts:696/700-701/767) 검증, 성능 논거 5개 레이어 계층화, M1→M2 드리프트 6항목(PABCD 정본 충돌·orchestrate 자가 전이 단락·Bun.sleep 잔존 포함).
> 표면 트랙: [112_moc_gui.md](./112_moc_gui.md) — 본 밴드 산출물(상주 런타임 + Web UI)의 GUI 패키징
> (기존 `electron/` 셸 완성 본선 + PWA 즉효 + Claude Desktop 보조). [제안] 단계, 착수 시점은 112 열린 질문 1.

## 코드 사실 (구 02 승계)

- 진입 계약: cli-jaw `src/agent/spawn.ts:677` `spawnAgent(prompt, opts): SpawnResult`
  — `{ child: ChildProcess | null, promise }`, **`child:null` 경로 기존재** (settings gate) → in-process 호환 증명
- 큐/게이트: `isAgentBusy()`, `queueCtrl`, fallback 체인 — cli 값 `jwc` 추가만으로 편입
- 이벤트: `src/core/bus.ts` `broadcast(event, payload, scope)` ← gjc AgentEvent 매핑 대상

## 아키텍처 (구 03 승계)

```
cli-jaw 서버 (단일 프로세스)
└─ JawRuntime 싱글톤
   ├─ AgentSession 풀 — createAgentSession() 인스턴스 상주 (100 포팅 산출물 import)
   ├─ spawnAgent 어댑터 — cli='jwc' → child:null + promise (세션 풀 위임)
   └─ AgentEvent → bus broadcast 매핑 (스트리밍/도구 로그/상태)
```

## 스코프

1. `src/agent/jwc-runtime.ts` (cli-jaw 측): JawRuntime 서비스 + 세션 풀 (인스턴스당 활성 1 세션 [확정 — "단 하나의 jwc"])
2. spawnAgent 어댑터: cli 값 `jwc` 라우팅, 기존 큐/게이트/타임아웃 계약 준수
3. AgentEvent 매핑 표: gjc 이벤트 종 → cli-jaw bus 이벤트/Web UI 렌더 (도구 로그 가시화 포함)
4. 에러/충돌 격리: 런타임 예외가 서버를 죽이지 않게 경계 (try/catch + 세션 재생성)

## [기본값] 결정

- 임포트 경로는 `jwc/sdk` 단일 (010에서 고정한 호환 표면) — 내부 직접 import 금지
- 프로세스 모델: 서버 수명 = 런타임 수명, 세션은 idle 시에도 메모리 상주 (명시 dispose 전까지)

## 완료 기준

- 서버 기동 → Web UI에서 spawn 없이 대화+도구 실행 (**M2 done ①**)
- `ps`로 자식 프로세스 0 확인 (도구 실행 제외)
- 런타임 예외 주입 테스트: 서버 생존 + 세션 자동 복구

## 열린 질문

- 도구 실행 샌드박스/권한 게이트를 cli-jaw 설정과 어떻게 합치할지 (gjc tools의 권한 모델 실사 필요)
- 멀티 인스턴스(.cli-jaw-34xx)별 JawRuntime 독립성 검증 범위
