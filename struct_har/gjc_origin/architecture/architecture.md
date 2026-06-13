# architecture / architecture.md (gjc_origin)

> **스냅샷 (2026-06-13)**: patched SoT는 [`structure/10_architecture.md`](../../../structure/10_architecture.md).
> fork `dc4f22672581` · gjc clone `75d103f45145`.

## structure/ 발췌 (첫 12줄)

```markdown
# Jawcode 아키텍처 (현재 형태)

> 2026-06-13 기준. gajae-code 0.4.4 fork, worktree HEAD `81bcea96`.
> **현재 코드 형태** 기록. 로드맵·밴드: `devlog/_plan/260612_jawcode_fork/`. 계보: [fork-delta.md](./fork-delta.md).

## 1. 정체

Jawcode는 gajae-code 모노레포의 포크이며 공개 실행 표면은 `jwc`다. 엔진은 Bun 런타임 기반의
Claude Code급 풀 코딩 에이전트로, 프로바이더 계층부터 TUI까지 전부 자체 구현돼 있다.

- 런타임: **Bun 1.3.14** (workspaces + catalog)
- 린트/포맷: biome
```

## 대조 메모

| side | 역할 |
|---|---|
| gjc_origin | upstream 클론 시점의 structure 동형 요약 (과거 har_struct) |
| jwc_patched | **structure/** 가 항상 최신 정본 — 본 파일은 인덱스·리베이스 전 훑기용 |

## 부록

- 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate-architecture.ts`

