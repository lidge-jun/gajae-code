# 070_memory — 메모리 통합 (jwc_patched)

> **MOC 정본**: `devlog/_plan/260612_jawcode_fork/070_moc_memory.md`
> **side**: `jwc_patched` · **최소 100줄** · patched SoT는 `structure/`

## 0. baseline 스냅샷 (요약)

이전 스냅샷 요약

# 070_memory — Memory (jwc_patched)

**⬜ MOC** — D10 `jwc memory search/save/...` 표면 + gjc memories 엔진.

- `memory`, `dev-pabcd` cli-jaw 스킬은 네이티브 대체로 로드 제외 (030)
- M1-4 메모리 통합

## 1. MOC 전문

```markdown
# 070 MOC — 메모리 통합

> 📐 상세 설계: [051_design_command_port.md](./051_design_command_port.md) §2 — jwc memory 동사 → memories/hindsight-retain 매핑.
> R16 확정: gjc 메모리는 user-level 전역(+per-project-tagged 스코핑, settings-schema.ts:1415) — "세션 단위" 우려 해소.

> 상태: ⬜. 입력: 사용자 "jwc memory 폴더를 만들어서 확장 가능하게" (R2, 시맨틱 미확정 — 본 MOC의 [기본값]이 1안).

## repo 기본값 (코드 확인 260612 03:09 — 중요 발견)

- **gjc 메모리는 완성된 서브시스템**: `packages/coding-agent/src/memories/index.ts` —
  SQLite 기반(agent db), 2단계 파이프라인(stage1 추출 잡 → global phase2 consolidation),
  watermark/heartbeat 잡 큐, `memory-backend/local-backend.ts` + `hindsight/client.ts`
- 저장 위치: `getMemoriesDir()` = **`<agentDir>/memories/state`** (utils/dirs.ts:431),
  agentDir 기본 = `~/.gjc/agent` → 기본 경로는 `~/.gjc/agent/memories/state`
- 프롬프트: `prompts/memories/` consolidation/read-path/stage_one_input·system/unavailable
- cli-jaw 메모리(비교): `~/.cli-jaw/memory/structured/` markdown 파일 + FTS5 — **포맷이 다름** (md vs SQLite)

## 스코프

1. gjc 메모리 엔진 실사 마무리: consolidation 트리거 조건/read-path 주입 시점 정밀 조사 — 본 밴드 첫 문서
2. [기본값] **gjc 엔진·경로 그대로 사용** (`~/.gjc/agent/memories/state`, SQLite) — 사용자 요구
   "jwc memory 폴더 + 확장 가능"의 1차 충족은 repo 기본 경로의 규약 문서화로
3. 표면 커맨드 [확정 D10 — cli-jaw 통일, R14]: `jwc memory search/read/save` — cli-jaw memory 명령과
   동일 어휘·시맨틱 (엔진은 gjc memories 재사용, 저장소는 jwc 자체 — D6 비공유 유지)

## 제안 (인터뷰 결정 필요)

- cli-jaw `structured/` markdown 포맷 호환 레이어 (미래 federation 대비) — repo 기본값은 SQLite라
  포맷 변환 비용 있음. 안 하면 federation(140)은 검색 API 경유로만
- `~/.jwc/` 홈 분리 — repo 기본값은 `~/.gjc/agent`. D4(경로 유지)와 일관성 있게 가려면 분리 안 하는 게 맞음

## 완료 기준

- 세션 간 기억: 세션 A 사실을 세션 B가 회수하는 e2e (repo 파이프라인 검증)
- 메모리 규약 문서(위치/포맷/확장 방법) 존재
- consolidation 트리거/주입 시점이 문서화됨

## 열린 질문

- gjc 자동 consolidation과 명시 save의 우선순위/중복 처리
- cli-jaw 메모리와의 포맷 호환 여부 (위 [제안])
```

## 2. 관련 devlog 문서 목록


## 3. gjc_origin ↔ jwc_patched delta

| 항목 | gjc_origin | jwc_patched |
|---|---|---|
| 1 | upstream baseline | fork patched |
| 2 | upstream baseline | fork patched |
| 3 | upstream baseline | fork patched |
| 4 | upstream baseline | fork patched |

## 4. structure/ 링크

- `structure/INDEX.md`
- `structure/workflows.md`
- `structure/architecture.md`

## 5. patched runtime

- DEFAULT_GJC_DEFINITION_NAMES jaw-interview first
- jwc bin via packages/jwc


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `070_memory`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
