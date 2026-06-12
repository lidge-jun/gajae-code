# 090_auth — devlog refs (gjc_origin)

> `090*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `090_moc_auth_release_gate.md` | # 090 MOC — 인증 시딩 + M1 Release Gate | 49 |
| `090_moc_auth_release_gate.md` | # 090 MOC — 인증 시딩 + M1 Release Gate | 49 |

## 2. MOC 헤딩 트리

# 090 MOC — 인증 시딩 + M1 Release Gate
## 코드 사실
## 스코프 A — 인증 시딩
## 스코프 B — M1 Release Gate (횡단 스모크)
## 완료 기준
## 서브플랜
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

### 090_moc_auth_release_gate.md

```markdown
# 090 MOC — 인증 시딩 + M1 Release Gate

> 상태: ⬜. 결정 근거: D7 [확정] — 로컬 토큰 시딩 즉시 로그인, OAuth 옵션 유지.

## 코드 사실

- cli-jaw 추출 패턴 (`/Users/jun/Developer/new/700_projects/cli-jaw/src/routes/quota.ts:145`):
  macOS Keychain `security find-generic-password -s "Claude Code-credentials" -w` + `~/.claude/.credentials.json`
- gjc: `session/auth-storage.ts` AuthStorage + `discoverAuthStorage(agentDir)` (sdk.ts:409) —
  **외부 CLI credential 임포트는 업스트림에 없음 → 포크 신규 표면**
- OAuth 40+ 프로바이더는 `packages/ai/` 보유 — 플로우 자체는 공짜

## 스코프 A — 인증 시딩

1. `jwc auth import` 커맨드: Claude Code(Keychain/credentials.json) → AuthStorage 시딩
2. [기본값] 첫 기동 시 자동 감지: AuthStorage 비어있고 로컬 토큰 발견 시 시딩 제안(1키 확인)
3. 대상 소스 우선순위: [기본값] ① Claude Code ② Codex(`~/.codex/auth.json`) ③ Gemini — 1차는 ①만 필수
4. 토큰 갱신: 만료 시 재추출 시도 → 실패하면 OAuth 플로우 안내 (silent fallback 금지, 명시 보고)
5. 보안: 토큰 값 로그 출력 금지, 시딩 결과는 마스킹 표시

## 스코프 B — M1 Release Gate (횡단 스모크)

| # | 검증 | 밴드 |
|---|------|------|
| G1 | `jwc --help` jaw 브랜딩, gjc 문자열 0건 | 010 |
| G2 | 시스템 프롬프트 jaw 아이덴티티 스냅샷 | 020 |
| G3 | `~/.cli-jaw/skills` 스킬 로드·발동 e2e | 030 |
| G4 | jaw-interview 게이트+4차원 점수 동작 | 040 |
| G5 | `/pabcd` 풀사이클 (mutation 게이트 포함) | 050 |
| G6 | goal set→checkpoint(evidence)→done | 060 |
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
