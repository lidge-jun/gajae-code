# 030_skills — devlog refs (gjc_origin)

> `030*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `030_moc_skills_discovery.md` | # 030 MOC — 스킬 디스커버리 (대체 모델) | 72 |
| `030_moc_skills_discovery.md` | # 030 MOC — 스킬 디스커버리 (대체 모델) | 72 |

## 2. MOC 헤딩 트리

# 030 MOC — 스킬 디스커버리 (대체 모델)
## [확정] jwc 스킬 루트 셋 (인터뷰 R13, 260612 04:46)
## [D10 파급] 네이티브-충돌 스킬 처리 (R14)
## 코드 사실
## repo 기본값 (코드 확인 260612 03:09)
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

### 030_moc_skills_discovery.md

```markdown
# 030 MOC — 스킬 디스커버리 (대체 모델)

> 상태: ⬜ (스코프 확정 — 260612 04:46 인터뷰). 결정 근거: D5 + R13 확정.

## [확정] jwc 스킬 루트 셋 (인터뷰 R13, 260612 04:46)

| 레벨 | jwc 브랜드 | gjc 브랜드 (무회귀) |
|------|-----------|---------------------|
| 임베디드 | gjc defaults 4종 (+ 이후 jaw 워크플로) | 동일 |
| 프로젝트 | `.gjc/skills` + **`.agents/skills` (신규 베이스, 워크업 nearest)** + `.gemini` 유지 | 업스트림 그대로 (.gjc/.gemini) |
| 사용자/글로벌 | **`~/.cli-jaw/skills` (— `~/.gjc/agent/skills` 자리를 대체)**, 부재 시 업스트림 폴백 | `~/.gjc/agent/skills` 그대로 |

- **대체+폴백 (a)**: 글로벌 정본 1개 원칙 — 드리프트 방지 (실측: ~/.gjc/agent/skills는 빈 디렉토리라 잃을 것 0)
- **.agents 추가 (a)**: 크로스툴 표준 관례 — `Developer/new/.agents/skills`(48개)가 하위 전 프로젝트에서 워크업으로 잡힘.
  동명 충돌은 D5대로 글로벌(~/.cli-jaw) 승이라 노후 버전이 못 이김
- **`<루트>/skills/` 인식 안 함** — ".agents가 표본이니까 이걸로" (사용자)
- **`.gemini` 베이스 유지**

## [D10 파급] 네이티브-충돌 스킬 처리 (R14)

- 스킬 의존도 실측 (R14): 순수 가이드 19개 ✅ / cli-jaw 명령 의존(browser·search 등)은 cli-jaw 설치 머신에서
  bash로 그대로 동작 ✅ / **네이티브 충돌 2개: `memory`, `dev-pabcd`** — cli-jaw의 메모리·오케스트레이터를
  조작하라고 지시
- D10(명령 통일)으로 처리 논리 확정: jwc는 같은 명령 어휘(`jwc memory`, `jwc orchestrate`)를 **네이티브로 제공**
  (050/070) → 두 스킬은 jwc 브랜드에서 **네이티브-대체 제외 목록**으로 로드 제외, jwc 자체 가이드(040/050 병합
  스킬 문서)가 그 자리를 채움. 범용 exclude 메커니즘 아님 — 고정 명단 2개
- jwc 명령 재구현 범위는 D10 표면(orchestrate/goal/memory)에 한정 — browser/telegram 등 cli-jaw 인프라
  명령은 재구현하지 않음 (bash 실행으로 충분)

## 코드 사실
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
