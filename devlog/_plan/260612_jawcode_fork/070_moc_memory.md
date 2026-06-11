# 070 MOC — 메모리 통합

> 상태: ⬜. 입력: 사용자 "jwc memory 폴더를 만들어서 확장 가능하게" (R2, 시맨틱 미확정 — 본 MOC의 [기본값]이 1안).

## repo 기본값 (코드 확인 260612 03:09 — 중요 발견)

- **gjc 메모리는 완성된 서브시스템**: `packages/coding-agent/src/memories/index.ts` —
  SQLite 기반(agent db), 2단계 파이프라인(stage1 추출 잡 → global phase2 consolidation),
  watermark/heartbeat 잡 큐, `memory-backend/local-backend.ts` + `hindsight/client.ts`
- 저장 위치: `getMemoriesDir()` = **`<agentDir>/memories/state`** (utils/dirs.ts:431),
  agentDir 기본 = `~/.gjc/agent` → 기본 경로는 `~/.gjc/agent/memories/state`
- 프롬프트: `prompts/memories/` consolidation/read-path/stage_one_input·system/unavailable
- cli-jaw 메모리(비교): `~/.cli-jaw/memory/structured/` markdown 파일 + FTS5 — **포맷이 다름** (md vs SQLite)

## 스코프

1. gjc 메모리 엔진 실사 마무리: consolidation 트리거 조건/read-path 주입 시점 정밀 조사 — 본 밴드 첫 문서
2. [기본값] **gjc 엔진·경로 그대로 사용** (`~/.gjc/agent/memories/state`, SQLite) — 사용자 요구
   "jwc memory 폴더 + 확장 가능"의 1차 충족은 repo 기본 경로의 규약 문서화로
3. 표면 커맨드: gjc에 이미 있는 메모리 조작 표면 실사 후, 없으면 `jwc memory search/save` 추가 [제안]

## 제안 (인터뷰 결정 필요)

- cli-jaw `structured/` markdown 포맷 호환 레이어 (미래 federation 대비) — repo 기본값은 SQLite라
  포맷 변환 비용 있음. 안 하면 federation(140)은 검색 API 경유로만
- `~/.jwc/` 홈 분리 — repo 기본값은 `~/.gjc/agent`. D4(경로 유지)와 일관성 있게 가려면 분리 안 하는 게 맞음

## 완료 기준

- 세션 간 기억: 세션 A 사실을 세션 B가 회수하는 e2e (repo 파이프라인 검증)
- 메모리 규약 문서(위치/포맷/확장 방법) 존재
- consolidation 트리거/주입 시점이 문서화됨

## 열린 질문

- gjc 자동 consolidation과 명시 save의 우선순위/중복 처리
- cli-jaw 메모리와의 포맷 호환 여부 (위 [제안])
