# architecture / extensibility.md (gjc_origin)

> **스냅샷 (2026-06-13)**: patched SoT는 [`structure/21_extensibility.md`](../../../structure/21_extensibility.md).
> fork `dc4f22672581` · gjc clone `75d103f45145`.

## structure/ 발췌 (첫 12줄)

```markdown
# Default Workflow Skills

> jwc의 공개 workflow surface는 기본 4종 + **native IPABCD orchestration**(`jwc orchestrate`)이다.
> fork 런타임 기준 canonical slug는 `jaw-interview`이며, upstream `AGENTS.md`는 아직 `deep-interview` 표기를 유지한다 `[기본값]`.

## Native orchestration (050 — 런타임 ✅ / discovery ⬜ 99.03)

| 표면 | 동작 | 상태 |
|---|---|---|
| CLI | `jwc orchestrate <i\|p\|a\|b\|c\|d>`, `audit-prompt`, `status`, **`reset`** (99.07-U1: 어느 상태→idle, goal 불가침, --shared/--dry-run) | ✅ 구현 (`orchestrate-runtime.ts`) |
| interview CLI | `jwc interview cancel` | ✅ **99.07-U2** — 세션 스코프 상태 파일 삭제 + HUD inactive 동기화 (`jaw-interview-runtime.ts`) |
| Slash | `/orchestrate` (jaw brand only) | ✅ |
```

## 대조 메모

| side | 역할 |
|---|---|
| gjc_origin | upstream 클론 시점의 structure 동형 요약 (과거 har_struct) |
| jwc_patched | **structure/** 가 항상 최신 정본 — 본 파일은 인덱스·리베이스 전 훑기용 |

## 부록

- 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate-architecture.ts`

