# 010_shell — code facts (gjc_origin)

> MOC `010_moc_shell_rename.md`에서 추출한 경로·팩트 + devlog `010*` 플랜.

## 1. 경로 인벤토리 (MOC 인용)

| # | path |
|---:|---|
| 1 | `(MOC에 경로 없음 — structure/ 참조)` |

## 2. devlog 플랜·diff 발췌

### `010_moc_shell_rename.md`

```markdown
# 010 MOC — jwc 셸 + 표면 리네이밍

> 상태: 셸 ✅ (구 10_phase1) / 리네이밍 ⬜. 결정 근거: D4(표면 리네이밍).
> ⚖️ 표기 (전 MOC 공통, 260612 03:09 개정): [확정] = 인터뷰 확정 / **[기본값] = repo(업스트림 gjc)가 실제로 하는 동작 — 결정 없으면 이대로 간다** / [제안] = repo 기본값에서 벗어나는 내 아이디어, 채택하려면 인터뷰 결정 필요.

## 목표

업스트림 diff를 표면 파일에 국한하면서 사용자가 보는 모든 표면을 jaw 브랜드로.

## 스코프

1. ✅ `packages/jwc` 셸 — bin `jwc`, `jwc/sdk` 재수출 (구 10 문서)
2. ⬜ 브랜딩 문자열: 배너/`--help`/에러 문구/업데이트 안내의 `gjc`/`Gajae-Code` → `jwc`/`Jawcode`
3. ⬜ 버전 문자열: [기본값] `jwc/0.1.0 (gajae-code 0.4.4 base)` — 업스트림 추적 가시화
4. ⬜ README.jwc.md 신설 (업스트림 README 무수정)
5. ⬜ 기본 스킬 4종의 사용자-가시 이름/설명만 jaw 어휘로 (파일 경로·skill name 키는 유지)

## 기본값/제안

- [기본값] 업스트림은 브랜딩 문자열이 코드에 분산 — 그대로 두면 `jwc` bin도 gjc 브랜딩 출력
- [제안] 브랜딩 상수 모듈 1개(`packages/jwc/src/brand.ts`)를 만들고 coding-agent의 배너/헬프 출력
  지점만 최소 패치해 상수 참조 — 리베이스 충돌 면적 최소화
- [기본값] `gjc` bin 공존 (업스트림 구조 유지, 제거하지 않음)
- `.gjc/` 상태 경로, `@gajae-code/*` 패키지명, env prefix는 그대로 [확정 D4]

## 리포 가드 (260612 03:30 발견, 03:34 의도 분석 완료)

- **의도적 가드 맞음 — 단 우리를 막으려는 게 아님.** gajae-code 자체가 상류 "oh-my-pi"의 리브랜드 포크이고,
  `scripts/rebrand-inventory.ts`는 **자기 리브랜드 완전성 가드**다 (`docs/REBRANDING_PLAN_260525.md` 승인 계약의 산출물):
  - 패키지 스코프 `@gajae-code/` + 비스코프 허용은 `gajae-code` 1개만 (L36-37) → `jwc`가 걸린 지점
  - CLI bin 정확히 `[gjc, gjc-stats]` (L35)
  - **번들 워크플로 스킬 정확히 4종 / 롤 에이전트 정확히 4종을 기계 강제** (L32-33, L257-260)
  - 레거시 토큰(oh-my-pi 계열) 금지 + allowlist 사례 (attribution/호환 문서)
- **010 전략**: 가드를 끄지 않고 **상수를 jaw 기대값으로 확장** — `allowedUnscopedPackageNames`에 `jwc` 추가,
  `expectedCliBins`에 `jwc` 추가. 가드는 그대로 살아서 우리 리브랜드의 가드가 됨 (gjc가 oh-my-pi에 한 일을 우리가 gjc에 반복)
- 참고 교본: `docs/REBRANDING_PLAN_260525.md` — gjc의 리브랜드 계약 문서. 010 착수 시 jaw 버전 작성 권장
- ⚠️ 파급: 040/050에서 jaw-interview/pabcd를 **번들 스킬로 추가하면 이 가드의 정확히-4종 검사에 걸림** —
  expected 목록 확장(포크 수정, D5 허용) 또는 비번들 계층 배포 중 선택 필요 (해당 MOC에 기록)
- 브랜딩 상수: `packages/utils/src/dirs.ts:20 APP_NAME = "gjc"` (+`VERSION`), 사용처 21파일 —
  치환 지점이 이미 중앙화돼 있어 [제안]의 brand.ts 별도 모듈은 불필요할 수 있음 (착수 시 판단)

## 완료 기준

- `jwc --help`/`--version`/배너에 gjc 문자열 0건 (grep 검증)
- **`bun check` 통과** (rebrand-inventory 포함 — 단 기존 002_proxy Rust allowlist 실패는 본 밴드 범위 밖)
```

## 3. 검증 명령

```bash
bun check
bun test packages/coding-agent
bun scripts/rebrand-inventory.ts --strict
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
