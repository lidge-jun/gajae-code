# 00 — MOC: GitHub 배포 준비

> 상태: 🟡 플래닝 완료 / 미착수. structure 갱신 + README + GitHub Pages + CI + postinstall.
> 블로커(100+)를 먼저 해소하고, 기능 작업(001-079)을 진행한다.

## 작업 범위

| 범위 | 번호 | 작업 수 |
|---|---|---|
| structure/ 갱신 | 001-005 | 5 |
| README 폴리시 | 010-014 | 5 |
| GitHub Pages + Developer Docs | 020-027 | 8 |
| CI 파이프라인 | 040-049 | 10 |
| postinstall / --safeinstall | 060-069 | 10 |
| **블로커** (선행) | 100-104 | 5 |
| **합계** | | **43** |

## 실행 순서

```
100-104 (블로커 해소) → 040-049 (CI) → 060-069 (postinstall)
                    → 001-005 (structure) → 010-014 (README) → 020-027 (Pages)
```

블로커 5건이 **CI를 완전 차단**하므로 최우선. CI가 green이면 나머지는 병렬 가능.

## 문서

| # | 문서 | 내용 |
|---|---|---|
| 00 | 본 MOC | 전체 범위·순서·블로커 요약 |
| [10](./10_tasks_structure_readme_pages.md) | 001-027 | structure·README·Pages 작업 |
| [20](./20_tasks_ci_postinstall.md) | 040-069 | CI·postinstall 작업 |
| [30](./30_blockers.md) | 100-104 | CI 블로커 5건 (전수조사 결과) |

## 블로커 요약 (100+)

| # | 블로커 | 복잡도 | CI 차단 |
|---|---|---|---|
| 100 | Biome 66 lint/format 에러 | S (auto-fix 가능) | lint check |
| 101 | 27 failing tests / 8591 | M-L (mock fixture 갱신) | test check |
| 102 | 2209 TS6305 stale .d.ts | S (build 먼저 실행) | tsc check |
| 103 | cu-mcp-server zod 3 vs catalog zod 4 | M | latent build risk |
| 104 | dirty bun.lock + uncommitted files | S (commit) | frozen-lockfile |

## discoveryMode (도구 토큰 최적화)

jwc 35개 빌트인 도구 = ~30K 토큰 (Claude Code는 ~12K). `tools.discoveryMode = "all"` 켜면
read/bash/edit/write만 로드(~8K), 나머지는 search_tool_bm25 뒤에 deferred. 이 작업은
CI 블로커 해소와 **별개**이며, 도구 토큰 최적화 전용 태스크로 분리 권장.
