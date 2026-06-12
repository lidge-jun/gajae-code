# 000 — JAWCODE 마스터 로드맵 (전면 재편)

> 2026-06-12 02:57 확정 체계. **000–099 = jwc 만들기 (M1) / 100~ = cli-jaw 런타임 이식 (M2)**.
> 각 데케이드 = 작업 밴드 1개, 밴드 착수 시 해당 번호대에 diff 레벨 플랜 문서를 추가한다.
> 결정 근거: [05_interview_conclusions.md](./05_interview_conclusions.md) D1–D9.
> 구 문서(00–10, 2자리)는 리서치 입력으로 흡수 — 01(gjc 실사), 02(cli-jaw 시임), 03(구 로드맵, 본 문서로 대체), 04(인터뷰 로그), 05(결정 전집), 10(jwc 셸, ✅ 완료 → 010 밴드로 편입).

## M1: 000–099 — jwc 만들기 (jaw 워크플로우 네이티브 CLI)

| 밴드 | 이름 | 내용 | 완료 기준 (testable) |
|------|------|------|---------------------|
| 000–009 | 리서치·결정 | 인터뷰/실사/결정 전집. 구 00–05 흡수. 업스트림 리베이스 정책(주기·표면 리네이밍 유지 규칙) 문서화 | 000(본 문서)+리베이스 정책 문서 존재 |
| 010–019 | jwc 셸 + 표면 리네이밍 | ✅ 셸 완료(구 10). 잔여: bin `jwc` 정식화, 브랜딩(헬프/배너/에러 문구) jaw화, 문서 표면 `gjc`→`jwc`. `.gjc/`·`@gajae-code/*` 유지 (D4) | `jwc --help` 전 표면이 jaw 브랜딩, 업스트림 diff가 표면 파일에 국한 |
| 020–029 | 프롬프팅 개편 | 시스템 프롬프트 jaw 아이덴티티(말투/언어 규칙/보스-직원 어휘 정합), prompt 모듈 구조 파악 후 jaw 프리셋 추가. cli-jaw 프롬프트 빌더와 어휘 통일 (M2 대비) | jwc 기동 시 jaw 시스템 프롬프트 적용, 스냅샷 테스트로 프리셋 고정 |
| 030–039 | 스킬 디스커버리 3계층 | 임베디드 → 프로젝트 루트 → `~/.cli-jaw/skills` (글로벌 우선, D5). SKILL.md frontmatter 호환 검증(키워드/트리거), 충돌 해소 규칙 | jwc 세션에서 cli-jaw 스킬 1개가 글로벌 우선순위로 로드되는 e2e |
| 040–049 | 워크플로 병합 ①: Interview | deep-interview + jaw I 장점 통합 (D3): 수학적 ambiguity 스코어 + topology gate + spec 핸드오프 ←→ 4차원 트래커 + negativity bias + known/unknown 누적. 단일 `jaw-interview` 스킬로 | 모호한 요청 → 게이트 통과까지 진행 거부 + 차원 점수 표시 + spec 파일 산출 |
| 050–059 | 워크플로 병합 ②: Plan + PABCD 커맨드 | ralplan(Planner/Architect/Critic 합의, pending-approval 아티팩트, receipt-only) + jaw P/A(분리 게이트, 사용자 승인). **PABCD 범용 진입 커맨드** — 어떤 디렉토리의 jwc에서도 I→P→A→B→C→D 풀사이클 | `jwc`에서 `/pabcd` 진입 → P 산출물 pending-approval → A 감사 → B 게이트 풀사이클 1회 통과 |
| 060–069 | 워크플로 병합 ③: Goal | ultragoal ↔ jaw goal 시스템 (체크포인트/evidence/pause-audit) 매핑 통합 | goal set→checkpoint→done 사이클이 jwc 단독에서 동작 |
| 070–079 | 메모리 통합 | jwc memory 폴더 규약 (위치/포맷/확장 포인트, D 미세결정 — 이 밴드 착수 시 확정). cli-jaw memory 포맷과 호환 지향 | memory save/search가 jwc 단독에서 동작 + 규약 문서 |
| 080–089 | TUI 변경 | jaw 브랜딩 테마, 워크플로(040–060) 상태 표시(차원 점수/단계 게이트), 한국어 UX. interactive-mode는 Bun 유지 (D8 영향 없음) | TUI에서 인터뷰 차원 점수·PABCD 단계가 시각 표시 |
| 090–099 | 인증 시딩 + M1 통합 검증 | 로컬 토큰 추출 시딩(D7: Keychain/`.credentials.json` → AuthStorage), OAuth 옵션 유지. M1 release gate: 전 밴드 횡단 스모크 | 신규 머신 시나리오: 기존 Claude 로그인만으로 `jwc` 즉시 대화 가능. M1 체크리스트 전 항목 ✅ |

**M1 done = 090–099 release gate 통과.** (D2: M1이 M2보다 선행)

## M2: 100~ — cli-jaw 런타임 이식 (상주 네이티브)

| 밴드 | 이름 | 내용 | 완료 기준 (testable) |
|------|------|------|---------------------|
| 100–109 | Node 포팅 베이스라인 | `Bun.*` 셰임 + tsc/esbuild 트랜스파일 (ai/agent/비TUI coding-agent). `bun:sqlite`→better-sqlite3 포함 (D8) | 업스트림 핵심 테스트(stream.test.ts 등)가 Node 22에서 통과 |
| 110–119 | JawRuntime 상주 서비스 | cli-jaw 서버 내 싱글톤: `createAgentSession()` 풀, `spawnAgent` 어댑터(`child:null` 경로), AgentEvent→`core/bus` broadcast | 서버 기동 시 상주, Web UI에서 spawn 없이 대화+도구 실행 (M2 done ①) |
| 120–129 | 세션 jaw.db 영속화 | resume = DB 메시지 로드 후 세션 재구성, steer = 살아있는 루프에 push (D6). resume-classifier/세션ID 역추적 소멸 | 서버 재시작 후 이어서 대화 + 실행 중 steer 주입 e2e |
| 130–139 | 스킬·PABCD·인증 주입 (cli-jaw 측) | `~/.cli-jaw/skills` 주입(M2 done ③), PABCD 단계 프롬프트 연결, 토큰 시딩 브리지 공유(M2 done ②) | M2 done 3항목 전부 ✅ |
| 140–149 | federation 검색 어댑터 | gjc `history` 스키마 어댑터로 dashboard chat search에 jwc 세션 노출 (D9, 후순위) | `cli-jaw dashboard chat search`가 jwc 세션 히트 반환 |
| 150–159 | 메인 런타임 승격 | 기본 cli=`jwc`, 벤더 CLI는 fallback 체인 강등. 도구 패리티 갭 목록화·충당 | 신규 세션 기본값 jwc, 회귀 스위트 통과 |

**M2 done = 130–139 완료 시점 (3항목).** 140~150은 승격 전 안정화 밴드.

## 밴드별 MOC (2026-06-12 03:01 전 밴드 작성 완료)

각 밴드의 스코프/기본값/완료 기준/열린 질문은 MOC 문서가 정본.
**표기 규약 (03:09 개정)**: [확정] = 인터뷰 확정 / **[기본값] = repo(업스트림 gjc)의 실제 동작 — 결정 없으면 이대로 간다** / [제안] = repo 기본값에서 벗어나는 변경안, 채택은 인터뷰 결정 필요.

| M1 | M2 |
|----|----|
| [010_moc_shell_rename.md](./010_moc_shell_rename.md) | [100_moc_node_porting.md](./100_moc_node_porting.md) |
| [020_moc_prompting.md](./020_moc_prompting.md) | [110_moc_jawruntime.md](./110_moc_jawruntime.md) |
| [030_moc_skills_discovery.md](./030_moc_skills_discovery.md) | [120_moc_session_jawdb.md](./120_moc_session_jawdb.md) |
| [040_moc_interview_merge.md](./040_moc_interview_merge.md) | [130_moc_injection.md](./130_moc_injection.md) ← **M2 done 지점** |
| [050_moc_plan_pabcd.md](./050_moc_plan_pabcd.md) | [140_moc_federation_adapter.md](./140_moc_federation_adapter.md) |
| [060_moc_goal_merge.md](./060_moc_goal_merge.md) | [150_moc_promotion.md](./150_moc_promotion.md) |
| [070_moc_memory.md](./070_moc_memory.md) | |
| [080_moc_tui.md](./080_moc_tui.md) | |
| [090_moc_auth_release_gate.md](./090_moc_auth_release_gate.md) ← **M1 done 지점 (G1–G9)** | |

설계 정본 (밴드 횡단): [051_design_command_port.md](./051_design_command_port.md) — D10 명령 이식 (050/060/070 기반) ·
[111_design_runtime_attach.md](./111_design_runtime_attach.md) — M2 런타임 부착 통합 설계 (100–130 기반)

밴드 내 이슈/서브플랜 (260612 06–09시) — **번호는 소속 분류일 뿐, 밴드 순서와 무관하게 선착수 가능**.
버그가 많은 군은 하위번호(081.n)로 묶음:
[081](./081_moc_cursor_tools.md) **cursor 도구군** (MOC/정본) — 081.1 미표시·081.2 타이틀환각·081.3 실행 unbound this·081.4 Glob —
**✅ 4건 수정·e2e 검증 완료** (080 밴드 발현, hotfix 트랙). 081.5 = cursor 외 동형 패턴 감사 ·
[082](./082_moc_tui_input.md) **TUI 입력/IME 이슈군** — 082.1 Ctrl/종료 미작동·082.2 첫 글자 캐럿 점프 (둘 다 한글 IME, 원인 확정, 수정 대기) ·
[091](./091_plan_provider_kiro.md) — kiro 프로바이더 [제안] (090 밴드, 기술 의존 없음 — 게이트는 ToS 결정뿐) ·
[112](./112_moc_gui.md) — GUI/Claude Desktop 옵션 (110 밴드 표면 트랙, M2 산출물 의존)

## 횡단 원칙

0. **명령어 체계 cli-jaw 통일 (D10, 260612 04:54)**: jwc 사용자-가시 명령은 cli-jaw 어휘를 따른다 —
   `jwc orchestrate`(PABCD)/`jwc goal`/`jwc memory` 등. 엔진은 gjc 네이티브 재사용, 표면만 통일.
   040–070 밴드의 명령 표면 계약이 이 원칙에 종속되고, M2 임베딩 시 어휘 충돌이 원천 제거됨
1. **리베이스 가드**: 업스트림 수정은 밴드별 최소 diff, 표면 파일 우선. 분기 수용(D4)하되 `git fetch upstream` 충돌 면적을 밴드 문서에 기록
2. **검증 우선**: 각 밴드 완료 기준은 testable — 통과 증거를 밴드 문서에 남김
3. **devlog 연속 기록**: 모든 개선안/결정은 이 폴더에 번호 문서로 (사용자 지시)
4. **cli-jaw 별도 과제 분리**: messages LIKE→FTS5 전환은 jawcode 범위 밖 (D9)
