# 10 — Tasks 001-027: structure·README·GitHub Pages

## 001-005: structure/ 갱신

| # | 제목 | 설명 | 복잡도 |
|---|---|---|---|
| 001 | packaging 반영 | `architecture.md`에 postinstall/safeinstall 스크립트 계획 반영 | S |
| 002 | consolidated tool + cua-driver | `00_INDEX.md` 동기화 규칙에 cua-driver row 추가 | S |
| 003 | subagent model routing | `providers.md`에 서브에이전트 모델 라우팅 섹션 추가 | S |
| 004 | PABCD SDK export | `architecture.md` SDK 표면 테이블에 pabcd 상태 함수 추가 | S |
| 005 | status.md readiness | 패키징 블로커 해소 + 99-band 체크포인트 반영 | S |

## 010-014: README 폴리시

| # | 제목 | 설명 | 복잡도 |
|---|---|---|---|
| 010 | Architecture 섹션 | 모노레포/cli-jaw 시임, fork 계보, 런타임 분리 1문단 | S |
| 011 | Contributing 섹션 | fork 규칙(D4), rebase guard, jawdev 플래그, conventions 링크 | S |
| 012 | Badge 추가 | CI(GitHub Actions), TypeScript, Node 버전 — cli-jaw 패턴 | S |
| 013 | 다국어 stub | `English / 한국어` 전환기 + README.ko.md placeholder | S |
| 014 | Changelog 링크 | "What's new" → GitHub Releases / CHANGELOG.md | S |

## 020-027: GitHub Pages + Developer Docs

| # | 제목 | 설명 | 복잡도 |
|---|---|---|---|
| 020 | VitePress scaffold | `docs/` 초기화, sidebar, jawcode 브랜드 테마 | M |
| 021 | Pages workflow | `.github/workflows/deploy-docs.yml` — main push → gh-pages | S |
| 022 | Landing page | `docs/index.md` — hero, tagline, 설치, 가이드 링크 | S |
| 023 | Architecture guide | `structure/10_architecture.md` → 공개용 prose (내부 fork-delta 제거) | M |
| 024 | Workflow guide | jaw-interview/ralplan/ultragoal/team 워크플로 각 1페이지 | M |
| 025 | API/SDK reference | `createAgentSession`, PABCD exports 공개 표면 | M |
| 026 | cli-jaw 통합 가이드 | jawcode↔cli-jaw M2 시임, cli-jaw 컨트리뷰터용 | M |
| 027 | Contributing guide | conventions 공개 버전 — fork 규칙, 커밋 포맷, 내부 rebase 제외 | S |

**추천 SSG**: VitePress (Bun/TS 모노레포 호환, zero-config, flat MD → sidebar 자동 생성)
