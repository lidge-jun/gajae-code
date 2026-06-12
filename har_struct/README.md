# har_struct/ — gjc_origin ↔ jwc_patched 계층 대조

> **목적**: 업스트림 gajae-code(`gjc_origin`)과 jawcode 포크(`jwc_patched`)의 **현재 형태**를 devlog MOC 밴드별로 병렬 기록한다.  
> `structure/`가 단일 SoT라면, `har_struct/`는 **양쪽 스냅샷 대조용**이다.

## 기준선

| 쪽 | 기준 | HEAD (2026-03-13) |
|---|---|---|
| **gjc_origin** | `devlog/_upstream_gjc/` 클론 + devlog 조사 | `40c8d7f` |
| **jwc_patched** | 현재 worktree (포크 패치 반영) | `b10e2e5` |

업스트림 remote: `https://github.com/Yeachan-Heo/gajae-code`

## 폴더 규약

```text
har_struct/
  README.md          ← 본 파일
  INDEX.md           ← lexicographic 전체 인덱스
  gjc_origin/        ← 업스트림 baseline
    <band>/          ← devlog MOC 밴드 (010, 020, …)
      *.md           ← 파일명 lexicographic
  jwc_patched/       ← 포크 patched 상태 (동일 밴드 트리)
    <band>/
      *.md
```

- **밴드 폴더명** = devlog `NNN_moc_*` 접두와 정렬 (`010_shell` … `100_node`, `architecture`).
- **파일명** = 같은 폴더 안에서 lexicographic (`01_overview.md` → `02_code_facts.md` → `03_devlog_refs.md`).
- **갱신 규칙**: 포크 밴드 완료 시 `jwc_patched` 먼저, upstream 리베이스 후 `gjc_origin` HEAD만 갱신.

## 읽기 순서

1. [INDEX.md](./INDEX.md) — 전체 트리
2. `architecture/` — 양쪽 공통 토폴로지
3. M1 밴드 순: `010` → `040` → `050` → …
4. TUI 서브밴드: `081_cursor` / `082_input` / `083_output`

## 관련 문서

| 문서 | 역할 |
|---|---|
| [structure/](../structure/) | jawcode 단일 SoT (patched 기준) |
| [devlog/_plan/260612_jawcode_fork/](../devlog/_plan/260612_jawcode_fork/) | MOC·플랜·이슈 원본 |
| [AGENTS.md](../AGENTS.md) | upstream 운영 계약 (수정 금지) |
