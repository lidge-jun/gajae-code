# 100_node — devlog refs (gjc_origin)

> `100*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `100_moc_node_porting.md` | # 100 MOC — Node 포팅 베이스라인 (M2 진입) | 42 |
| `100_moc_node_porting.md` | # 100 MOC — Node 포팅 베이스라인 (M2 진입) | 42 |

## 2. MOC 헤딩 트리

# 100 MOC — Node 포팅 베이스라인 (M2 진입)
## 코드 사실 (구 01/03 조사 승계)
## 치환 매핑
## 스코프
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

### 100_moc_node_porting.md

```markdown
# 100 MOC — Node 포팅 베이스라인 (M2 진입)

> 상태: ⬜. 결정 근거: D8 [확정] — 상주 네이티브의 유일한 길. 구 03 §결정 1의 치환 매핑 승계.

## 코드 사실 (구 01/03 조사 승계)

- 업스트림은 명시적 Bun 전용, 전 패키지 raw .ts 배포(빌드 산출물 없음)
- `check:node20-baseline`은 "Node 지원 허위 주장 방지" 가드일 뿐 — 지원 보장 아님
- `Bun.*` 사용처: ai ~20지점 / agent 4파일 / tui 7파일(포팅 제외)
- 포팅 범위: `packages/ai` + `packages/agent` + coding-agent 비TUI 경로만

## 치환 매핑

| Bun API | Node 대응 |
|---------|----------|
| `Bun.env` | `process.env` |
| `Bun.file` | `node:fs/promises` |
| `Bun.spawn` | `node:child_process` |
| `Bun.hash` | `node:crypto` / xxhash |
| `Bun.WebSocket` | Node 22 전역 WebSocket (undici) |
| `Bun.JSONL.parseChunk` | 자체 청크 파서 (base-stream.ts 내 국소화) |
| `Bun.JSON5` | `json5` npm |
| `bun:sqlite` | `better-sqlite3` (cli-jaw 기보유, API 근접) |

## 스코프

1. 셰임 레이어: [기본값] `packages/jwc/src/shims/` 에 런타임 감지 셰임 — 듀얼 런타임
   (Bun에서는 네이티브, Node에서는 셰임). 업스트림 파일 수정은 import 치환 최소 diff
2. 트랜스파일 빌드: [기본값] esbuild로 `packages/{ai,agent,coding-agent}` → `dist-node/` (tsc는 타입체크만)
3. 테스트 베이스라인: 업스트림 핵심 테스트(stream.test.ts 1,662줄 등)를 Node 22 러너로 통과
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
