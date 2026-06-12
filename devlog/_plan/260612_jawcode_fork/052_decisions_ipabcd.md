# 052 — 050 IPABCD 결정 전집 (jaw-interview R0–R10)

> 2026-06-12 jaw-interview 세션 산출. **050번대 lexicographic 연속** — `051` 보강(`51.n`) 없이 본 문서에서 050 밴드 결정을 이어감.
> 선행: [050_moc_plan_pabcd.md](./050_moc_plan_pabcd.md), [051_design_command_port.md](./051_design_command_port.md)
> 인터뷰 로그 누적: [04_interview_log.md](./04_interview_log.md)

## Metadata

| 항목 | 값 |
|------|-----|
| Interview ID | e4c29588-713a-42bd-be75-0aa7c690e68e |
| Rounds | 0 (topology) + 10 (Q&A) |
| Final Ambiguity | 8% |
| Threshold | 5% (default) |
| Status | **EARLY_EXIT** — 사용자 "052에 기록하고 종료" (threshold 미달) |
| Active topology | 050 Plan+IPABCD only (060+ deferred) |

## 결정 (D050-1 … D050-9)

| ID | 주제 | 결정 | 표기 |
|----|------|------|------|
| D050-1 | `jwc interview` vs `jwc orchestrate i` | **동일 엔진** (040 `jaw-interview`). 차이는 `pabcd.json` 상태 등록·handoff UX만 | [확정] |
| D050-2 | I → P handoff | **자동 stage 전환 금지** (cli-jaw). 허용: (①) 사용자 `/orchestrate p`·`p` 명시, (②) 에이전트 handoff, (③) spec+threshold 충족 시 **orchestrate p 원클릭 제안** | [확정] |
| D050-3 | devlog 기록 규칙 | **050번대 lexicographic 연속** (`052`, `053`, …). 앞 문서 `51.n` 식 보강 금지 | [확정] |
| D050-4 | state-machine 이식 | **M1 사본** — cli-jaw `state-machine.ts` 프롬프트·`canTransition` 이식. **M2 130**에서 단일화 검토 | [확정] |
| D050-5 | B 단계 · team | **jwc 단독 B 기본**. cli-jaw 한계로 생긴 제약; 아주 복잡·대규모면 **team(tmux) 옵션** | [확정] |
| D050-6 | team 트리거 | **에이전트 재량** — 별도 수치 임계치 없음. B 진입 시 기본 solo | [확정] |
| D050-7 | M1 050 완료 기준 | **`orchestrate i→p→a→b→c→d` 풀사이클 1회** (050 MOC 완료 기준 유지) | [확정] |
| D050-8 | `pabcd.json` | `current_stage`, `ctx`, `spec_ref`, `plan_ref` + gjc state receipt 관례 | [확정] |
| D050-9 | C 단계 | **cli-jaw C와 동형** — 고정 체크리스트 + 기계적 pass/fail | [확정] |

## 050 MOC / 051 패치 체크리스트

- [ ] `050_moc_plan_pabcd.md` §열린 질문 1–3 → 위 D050-1/2/4로 [확정] 승격
- [ ] `051_design_command_port.md` §4 I→P·state-machine 항목 → D050-2/4 반영
- [ ] `050_moc` team/B → D050-5/6 반영 (M1 범위 밖 [기본값] → **조건부 team 허용**)
- [ ] C 단계 검증 — D050-9로 `051` §B/C 설명 보강 (053 후보)

## 미확정 (다음 인터뷰 / 053+)

- **D 단계** 요약·산출물 형식 (jaw D vs gjc receipt)
- **슬래시 표면** `/orchestrate` vs `/pabcd` alias 우선순위·HUD
- **C 체크리스트** 항목 목록 (cli-jaw에서 이식할 구체 파일/심볼)
- **060+ 밴드** — topology defer 해제 후 순차 구체화

## Acceptance (본 문서)

- [x] D050-1 … D050-9 devlog에 기록
- [ ] 050/051 MOC 본문 패치 (별도 PR/커밋)
- [ ] `jwc orchestrate` 구현 시 본 문서를 설계 입력으로 인용
