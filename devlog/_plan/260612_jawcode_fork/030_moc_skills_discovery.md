# 030 MOC — 스킬 디스커버리 3계층

> 상태: ⬜. 결정 근거: D5 [확정] — 정본 `~/.cli-jaw/skills`, 글로벌 우선, 포크 직접 수정 허용.

## 코드 사실

- `packages/coding-agent/src/extensibility/skills.ts` — SKILL.md 디스커버리
- `sdk.ts discoverSkills(...)` (L444) — 임베딩에서 스킬 셋 주입 가능
- 기존 루트: 임베디드 defaults(`defaults/gjc/skills/` 4종) + `.gjc` 사용자/프로젝트 경로
- cli-jaw 스킬: `~/.cli-jaw/skills/` 29개, frontmatter(name/description/keywords/triggers) — 같은 SKILL.md 계열

## repo 기본값 (코드 확인 260612 03:09)

- 스킬 로딩은 capability API 경유: `loadSkills({ cwd: getProjectDir(), ... })` →
  `loadCapability(skillCapability.id, ...)` (extensibility/skills.ts:107,133)
- 루트 해석 컨텍스트: `{ cwd, home: os.homedir(), repoRoot }` — 사용자 레벨 `~/.gjc/agent/...`,
  프로젝트 레벨 `.gjc/...` (config.ts:50-51)
- **"GJC only accepts native `.gjc` skills"** (skills.ts:122 주석) — 외부 루트 추가 설정은 업스트림에 없음
- 임의 추가 루트 설정(`additionalRoots` 류)은 **존재하지 않음** → `~/.cli-jaw/skills` 추가는 포크 수정 필요 (D5가 허용)
- ⚠️ **`sdk.ts:444 discoverSkills()`는 스텁** — 빈 배열 반환. 실제 로딩은 내부 `loadSkills()`
  (extensibility/skills.ts:105). 임베딩(M2 130)에서 sdk의 discoverSkills에 의존하면 안 됨 —
  포크에서 스텁을 실구현으로 채우거나 loadSkills 경로를 jwc/sdk로 재수출해야 함 (structure/sdk_surface.md에 리스크 기록됨)

## 스코프

1. 디스커버리 루트 확장: 임베디드 → 프로젝트(`.gjc`) → 글로벌(`~/.cli-jaw/skills`) [확정 순서]
   — capability 경로 목록에 글로벌 루트 1개 추가하는 최소 diff
2. 우선순위 충돌 해소: 같은 name이면 글로벌 승 [확정]
3. frontmatter 호환 검증: cli-jaw 확장 키(keywords/triggers)를 gjc 파서가 살리는지 확인, 필요시 파서 확장

## 제안 (인터뷰 결정 필요)

- 프로젝트 루트 `skills/` 디렉토리 추가 인식 (repo 기본값은 `.gjc` 베이스만) —
  사용자 R3 발언("프로젝트 루트에 있는 스킬도 읽지만")의 구현 위치를 `.gjc/skills`로 볼지 `<root>/skills`로 볼지
- 글로벌 경로 환경변수 오버라이드 (`JAW_SKILLS_DIR`)
- cli-jaw 전용 스킬(telegram-send 등) 필터링 없이 전부 로드할지

## 완료 기준

- e2e: `~/.cli-jaw/skills/`의 실제 스킬 1개가 jwc 세션에서 로드·발동
- 동명 스킬 충돌 시 글로벌 승 테스트
- `jwc skills list`가 계층·출처 표시

## 열린 질문

- skills_ref(비활성 201개) 인식 여부 — [기본값] 안 읽음 (active만)
- 스킬 propagation(cli-jaw postinstall 동기화)과의 관계 — jwc는 읽기만, 쓰기 없음
