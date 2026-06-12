# 090_auth — code facts (jwc_patched)

> **upstream 대조**: [`devlog/_upstream_gjc/`](../../devlog/_upstream_gjc/) @ `40c8d7f`
> MOC `090_moc_auth_release_gate.md`에서 추출한 경로·팩트 + devlog `090*` 플랜.

## 1. 경로 인벤토리 (MOC 인용)

| # | path |
|---:|---|
| 1 | `(MOC에 경로 없음 — structure/ 참조)` |

## 2. devlog 플랜·diff 발췌

### `090_moc_auth_release_gate.md`

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
| G7 | memory save→search 세션 간 회수 | 070 |
| G8 | TUI 워크플로 표시 + 한글 스모크 | 080 |
| G9 | **신규 머신 시나리오**: 기존 Claude 로그인만으로 `jwc` 즉시 대화 | 090 |

## 완료 기준

- G1–G9 전부 ✅ + 증거(출력/스크린샷)를 본 밴드 문서에 기록 → **M1 done 선언**

## 서브플랜

- [091_plan_provider_kiro.md](./091_plan_provider_kiro.md) — kiro 프로바이더 추가 [제안] (260612 06시).
  토큰 캐시 임포트(`~/.aws/sso/cache/kiro-auth-token.json` 등)가 본 밴드 D7 시딩 패턴과 동형.
  **착수 게이트**: Kiro ToS가 서드파티 하네스 사용을 명문 금지 — 리스크 수용 인터뷰 선행

## 열린 질문
```

## 3. 검증 명령

```bash
bun check
bun test packages/coding-agent
bun scripts/rebrand-inventory.ts --strict
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `090_auth`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
