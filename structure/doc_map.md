# 문서 지도 (structure · struct_har · upstream)

> 한 화면에서 **어디가 정본인지** 찾는 허브. 코드 변경 시 [INDEX.md](./INDEX.md) 동기화 표와 같이 본다.

## 세 층

| 층 | 경로 | 정본 역할 |
|---|---|---|
| **Patched SoT** | [structure/](./README.md) | jawcode **현재** 계약·아키텍처·포크 규칙 |
| **양축 대조** | [struct_har/](../struct_har/README.md) | `gjc_origin` ↔ `jwc_patched` 밴드별 code facts |
| **OMP 참조축** | [struct_har/omp_origin/](../struct_har/omp_origin/README.md) | oh-my-pi — **13 밴드** (gajae-code/jwc 동형 id), fork diff 아님 |

## 업스트림 클론 (gitignored)

| 클론 | remote | HEAD (2026-06-13) |
|---|---|---|
| `devlog/_upstream_gjc/` | Yeachan-Heo/gajae-code | `67427c6` |
| `devlog/_upstream_omp/` | can1357/oh-my-pi | `e13ad3805` |

## 읽기 순서 (신규 기여자)

1. [README.jwc.md](../README.jwc.md) — jwc가 뭔지
2. [architecture.md](./architecture.md) — 모노레포 형태
3. [workflows.md](./workflows.md) — 번들 스킬 4종
4. [struct_har/README.md](../struct_har/README.md) — 포크가 upstream gajae-code에서 어디가 달라졌는지
5. [upstream_lineage.md](./upstream_lineage.md) — omp → gajae-code → jawcode 관계
6. `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md` — M1/M2 밴드

## cli-jaw (제3 축)

M2 임베딩 대상. 코드 정본: `/Users/jun/Developer/new/700_projects/cli-jaw/`.  
struct_har 밴드 문서의 **cli-jaw cite**는 PABCD·memory·주입 레일 비교용 — jawcode SoT가 아님.

## cite 규칙 (요약)

- gjc_origin: `devlog/_upstream_gjc/<path>:<line>`
- jwc_patched: `700_projects/jawcode/<path>:<line>`
- omp_origin: `devlog/_upstream_omp/<path>:<line>`
- **chase**: [struct_har/chase/](../struct_har/chase/README.md) — 갭·참조 (체리픽 아님)
- 구 플랜의 `har_struct` 경로는 **`struct_har`** 로 읽는다 (리네임 2026-06-13).

## 로직 vs 파일 (fork)

| 문서 | 답하는 질문 |
|---|---|
| [fork-delta.md](./fork-delta.md) | **어떤 파일**이 바뀌었나 (HARD-EDIT/NEW/REMOVED) |
| [fork_logic_changelog.md](./fork_logic_changelog.md) | **동작·계약**이 어떻게 바뀌었나 (git `upstream/main..HEAD`) |
| `struct_har/<side>/<band>/02_logic_changes.md` | 밴드별 요약 + 관련 커밋 해시 |
| `struct_har/jwc_patched/099_stabilization/` | 99 밴드·레디니스·8기 조사 스냅샷 |
| [jwc_readiness.md](./jwc_readiness.md) | **지금 jwc 쓸 수 있나** (MLB·블로커·착수 순서) |
| [m1_closeout.md](./m1_closeout.md) | 99 패키지·결정·착수 순서·struct_har 매핑 |
| [todo_pipeline.md](./todo_pipeline.md) | todo_write · 세션 phases · TUI 접힘(99.30) | agent-session, interactive-mode |
| [search.md](./search.md) | web 검색 프로바이더·OAuth/키 게이팅·auto·`/searchengine`·xAI web+X | web/search, slash-commands |
| [codex_transport.md](./codex_transport.md) | Codex WS/SSE 전송·프리워밍·워치독·레이트리밋 텔레메트리 | ai/providers, agent-session |
| [beta_v0.1_closeout.md](./beta_v0.1_closeout.md) | beta v0.1 문서 세트·OSS·착수 순서 단일 정본 |
| [struct_har/chase/](../struct_har/chase/README.md) | 갭 · **`10_*` / `20_*` 플랜 정본** |
| [10_gjc_chase_MOC](../struct_har/chase/10_gjc_chase_MOC.md) | upstream gajae-code `10.NNN_*` |
| [20_omp_chase_MOC](../struct_har/chase/20_omp_chase_MOC.md) | omp `20.NNN_*` |
| [chase/_legacy](../struct_har/chase/_legacy/INDEX.md) | 완료 아카이브 |
## struct_har 재생성

upstream/worktree HEAD 갱신 후:

```bash
bun struct_har/_scripts/struct-har-regenerate.ts
bun struct_har/_scripts/struct-har-regenerate-logic.ts
bun struct_har/_scripts/struct-har-regenerate-architecture.ts
bun struct_har/_scripts/struct-har-regenerate-overviews.ts
bun struct_har/_scripts/struct-har-regenerate-omp.ts
```

그다음 `struct_har/README.md`·`INDEX.md`·`structure/gitstructure.md`에 HEAD 기록.