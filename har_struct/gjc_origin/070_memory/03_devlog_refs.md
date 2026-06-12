# 070_memory — devlog refs (gjc_origin)

> `070*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `070_moc_memory.md` | # 070 MOC — 메모리 통합 | 41 |
| `070_moc_memory.md` | # 070 MOC — 메모리 통합 | 41 |

## 2. MOC 헤딩 트리

# 070 MOC — 메모리 통합
## repo 기본값 (코드 확인 260612 03:09 — 중요 발견)
## 스코프
## 제안 (인터뷰 결정 필요)
## 완료 기준
## 열린 질문

## 3. structure 교차

- `structure/architecture.md` (112 lines): # Jawcode 아키텍처 (현재 형태)
- `structure/conventions.md` (63 lines): # Jawcode 컨벤션
- `structure/extensibility.md` (69 lines): # Extensibility
- `structure/packages_overview.md` (58 lines): # Packages / Crates Overview
- `structure/prompt_flow.md` (78 lines): # Prompt Flow
- `structure/session_storage.md` (77 lines): # Session / Storage
- `structure/workflows.md` (59 lines): # Default Workflow Skills

## 4. 갱신·증거 규칙 (structure/conventions)

- absolute path:line 수동 검증
- generated 파일 수동 편집 금지
- AGENTS.md upstream contract

## 5. 관련 devlog 발췌 (상위 30줄)

### 070_moc_memory.md

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
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `070_memory`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
