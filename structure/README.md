# structure/ — Jawcode Source of Truth

> Jawcode(`jwc`) = gajae-code 0.4.4 fork 위에 Jaw/jwc 표면을 얹은 빌드. cli-jaw 메인 네이티브
> 런타임이 되는 것이 목표.
>
> **진입점은 [INDEX.md](./INDEX.md)** — 티어형 문서 허브·읽기 순서·삼축 정본·동기화 규칙이 거기 있다.
> 이 파일은 얇은 포인터로 유지한다(허브 이중화 방지, 260613 통합).

## 빠른 사실

| 항목 | 현재값 | 근거 |
|---|---|---|
| 제품 방향 | M1 = jwc 단독 완성, M2 = cli-jaw 런타임 이식 | `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md:1` |
| 공개 wrapper | `packages/jwc` = `jwc` bin + `jwc/sdk` export | `packages/jwc/package.json:7,15` |
| 실제 SDK 구현 | `packages/coding-agent/src/sdk.ts` | `packages/coding-agent/src/sdk.ts:217` |
| default workflows | `jaw-interview`, `ralplan`, `ultragoal`, `team` | `packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| config/state dir | 런타임 `.jwc/` (`~/.jwc`, 프로젝트 `.jwc/`) | `packages/utils/src/dirs.ts:219` |
| package namespace | `@gajae-code/*` 유지 (리베이스 경계) | `structure/conventions.md:69` |

## 개발 흐름 (upstream 참조 + pull)

| 층 | 경로 | 역할 |
|---|---|---|
| patched SoT | `structure/` | jawcode **현재 형태** 정본 |
| upstream mirror | `devlog/_upstream_gjc/` | gajae-code gitignored 클론 — diff·file:line 근거 |
| 양쪽 대조 | `struct_har/gjc_origin/` ↔ `jwc_patched/` | 밴드별 스냅샷 |

리베이스/밴드 착수 루틴·동기화 표는 [INDEX.md](./INDEX.md) §동기화 규칙 + [conventions.md](./conventions.md) §2.
계보(omp→gajae-code→jawcode)는 [fork_logic_changelog.md](./fork_logic_changelog.md) §계보.
관련: `AGENTS.md`(운영 계약) · [struct_har/](../struct_har/README.md)(대조) · cli-jaw 본체 `700_projects/cli-jaw/`.
