# architecture / packages.md (jwc_patched)

> **스냅샷 (2026-06-13)**: patched SoT는 [`structure/packages_overview.md`](../../../structure/packages_overview.md).  
> fork `81bcea96` · gjc clone `67427c6`.

## structure/ 발췌 (첫 12줄)

```markdown
# Packages / Crates Overview

> jawcode는 Bun monorepo + Rust crates 구조다. jwc는 표면 wrapper이고, 현재 런타임 본체는 `@gajae-code/coding-agent`에 있다.

## 의존 방향

```text
jwc wrapper
  -> @gajae-code/coding-agent
       -> @gajae-code/agent-core
       -> @gajae-code/ai
       -> @gajae-code/tui
```

## 대조 메모

| side | 역할 |
|---|---|
| gjc_origin | upstream 클론 시점의 structure 동형 요약 (과거 har_struct) |
| jwc_patched | **structure/** 가 항상 최신 정본 — 본 파일은 인덱스·리베이스 전 훑기용 |

## 부록

- 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate-architecture.ts`

