# 111 — 설계: cli-jaw에 jwc 런타임 부착 (M2 100–130 통합 설계)

> M2 착수 전 정본 설계 (260612 05:20, 사용자 지시). 각 밴드 P에서 diff 레벨로 구체화.
> 구조: D1(2-제품) — cli-jaw 서버가 `jwc/sdk`를 import해 상주. spawn/resume 계층 소멸이 목적.

## 0. 선행 조건 체인

100(Node 포팅: Bun.* 셰임 + 트랜스파일 + bun:sqlite→better-sqlite3) → 110(상주 서비스) → 120(세션) → 130(주입) 순.
M1 산출물이 주는 공짜: **030 디스커버리가 이미 brand-aware** — 서버가 `GJC_BRAND_NAME=jwc`만 설정하면
`~/.cli-jaw/skills` 네이티브 로드·제외 2종이 그대로 동작 (130 스킬 주입의 2안이 사실상 완성됨).
020 아이덴티티도 동일: cli-jaw가 settings 주입 대신 config 필드로 전달 가능.

## 1. 진입 계약 — spawnAgent 어댑터 (cli-jaw 측)

- 계약: `src/agent/spawn.ts:677 spawnAgent(prompt, opts): SpawnResult = { child: ChildProcess|null, promise }`
  — **`child:null` 경로 기존재** (settings gate)로 in-process 호환 증명 (02 리서치)
- 어댑터: `opts`/settings의 cli 값 `jwc` → JawRuntime 위임, `child:null` + promise 반환
- 주의 (실코드 확인): L678–684의 `mainManaged`/`gateEligibleMain`/employee 분기 — 어댑터는 origin(web/telegram/…),
  employeeSessionId, internal 플래그 시맨틱을 보존해야 큐/게이트/직원 디스패치가 그대로 탐

## 2. JawRuntime 싱글톤 (NEW `src/agent/jwc-runtime.ts`, cli-jaw 측)

```
JawRuntime
├─ 세션 풀: Map<sessionKey, AgentSession>  — 인스턴스당 활성 1 (D 확정 "단 하나의 jwc")
│   · createAgentSession() via `jwc/sdk` 단일 임포트 (010 호환 표면; discoverSkills 스텁 주의 — 030 MOC 경고)
├─ prompt(text)  → session.prompt(text)                     — spawn 소멸
├─ steer(text)   → session.prompt(text, { streamingBehavior: "steer" })   — kill-respawn 소멸 (PromptOptions 기존재 확인)
├─ followUp(text)→ session.prompt(text, { streamingBehavior: "followUp" })
└─ dispose/recreate — 예외 격리 (런타임 크래시가 서버를 죽이지 않게 경계 try/catch + 세션 재생성)
```

## 3. 이벤트 매핑 — gjc AgentEvent → cli-jaw bus

- 수신: `createAgentSession` 이벤트 스트림 (메시지 델타/도구 시작·종료/thinking/컴팩션/에러)
- 송신: `src/core/bus.ts:49 broadcast(type, data, audience)` — SSE로 Web UI 도달 (public 게이트 주의)
- 110 P에서 매핑 표 작성: assistant 델타→`agent_stream`, 도구 로그→tool_log 직렬화(120과 합의), 에러→기존 에러 이벤트 타입
- 원칙: **cli-jaw 기존 이벤트 타입에 맞춘다** (Web UI 무수정 목표) — 새 타입은 도구 블록 가시화 등 부족분만

## 4. 세션 영속화 (120) — jaw.db 정본

- 쓰기: **완료 시 1회 기록** (스트리밍 중간 저장 금지 — AGY 진행문 저장 버그 교훈, 120 MOC 계약)
- resume: 서버 재시작 → jaw.db messages 로드 → 세션 재구성. gjc 쪽 주입 경로는 110 P에서 실사
  (후보: sessionManager 복원 / createAgentSession 메시지 시드 옵션 / agent db 캐시 동기화)
- gjc agent db는 내부 캐시로 유지, 충돌 시 jaw.db 승 (D6)
- resume-classifier/session-persistence/spawn/resume.ts는 cli='jwc' 경로에서 전체 우회

## 5. 주입 3종 (130) — M2 done 지점

| 항목 | 1차 경로 | 비고 |
|------|---------|------|
| 스킬 | **서버가 GJC_BRAND_NAME=jwc 설정 → 030 네이티브 디스커버리 그대로** | cli-jaw 프롬프트 빌더 산출물 주입(구 1안)은 불필요해짐 — 중복 주의만 검증 |
| 아이덴티티/프롬프트 | A2 사용자 설정 → identity.* config 매핑 (020 산출물) + cli-jaw A1 시스템 프롬프트와 합성 규칙 1개 | 020·130 MOC 충돌 주의 항목 |
| PABCD | cli-jaw orchestrate 상태머신을 정본으로, 051 이식분과 텍스트 리소스 공유 (사본 드리프트 방지) | 단계 도구 게이팅은 gjc role 패턴 |
| 인증 | `discoverAuthStorage(agentDir)` 공유 (sdk.ts:409) + 090 시딩 브리지를 서버 기동 경로에서 호출 | |

## 6. 라이프사이클·롤아웃

- 서버 수명 = 런타임 수명. busy/queue: `isAgentBusy()`/queueCtrl 계약 준수 (어댑터가 promise 수명으로 표현)
- 단계적 전환: settings cli='jwc' 옵트인 → 검증 후 150에서 기본 승격, spawn 경로 롤백 스위치 1릴리스 유지
- 멀티 인스턴스(.cli-jaw-34xx): 인스턴스별 서버 프로세스 = 인스턴스별 JawRuntime — 자연 격리

## 7. 리스크 레지스터 (M2)

1. **Node 포팅 표면적** — stream.test.ts 1,662줄 등 업스트림 테스트가 베이스라인 (100 완료 기준)
2. **이벤트 순서/중복** — 스트리밍 델타와 완료 기록의 정합 (120 테스트로 고정)
3. **이중 컴팩션** — gjc 자체 컴팩션 vs cli-jaw compact 핸드오프 (기본: gjc 위임, 120 MOC)
4. **discoverSkills 스텁** — sdk 표면 의존 금지, loadSkills 경로 재수출 (030 경고 승계)
5. **natives(napi-rs)** — Node 로드 검증 (100)
