# 057 — 스킬 호환 패치 구현 플랜 (로딩 파이프라인)

> 상위: [055_moc_dev_skills_compat.md](./055_moc_dev_skills_compat.md). 치환 계약: [056](./056_map_cli_jaw_to_jwc.md). 공통 엔진: [085.5](./085.5_plan_prompt_rebrand.md) M3 `brandPromptText()`.

## 1. 패치 지점 (전수 — Backend 분석 P1–P9)

| # | file:line | 역할 | 본 플랜 적용 |
|---|-----------|------|--------------|
| **P1** | `extensibility/skills.ts:398-410` `buildSkillPromptMessage` | `/skill:*` 실행 시 본문 최종 조립 — frontmatter 제거 후 현재 **무치환** | ✅ **본문 치환 본점** — body 생성 직후 분기 |
| **P2** | `skills.ts:379-395` `resolveSkillSlashCommands` | slash autocomplete description | ✅ description 치환 |
| **P3** | `skills.ts:209-217` `loadSkills` skillMap | `<skills>` listing description | ✅ |
| **P4** | 신규 `gjc-runtime/brand-prompt.ts` (085.5 M3) + `applyCliJawDevVocabularyMap()` | 순수 치환 엔진 + 056 테이블 | ✅ 단일 정본 모듈 |
| P5–P6 | task/agents.ts, orchestrate-runtime | dev 스킬 아님 | 085.5 소관 |
| **P7** | `skills.ts:160-167` `effectiveIgnoredSkills` | dev-pabcd/memory 제외 | 유지 — 무변경 |
| **P8** | `discovery/cli-jaw.ts:21-35` | provider 메타 | `_source.provider === "cli-jaw"` 판별 사용 (로드 자체는 무변경) |
| P9 | `task/executor.ts:1389`, `tools/skill.ts:135`, `input-controller.ts:510`, `acp-agent.ts:733` | buildSkillPromptMessage 호출부 4곳 | P1 수정으로 일괄 — 무변경 |

## 2. 구현 diff 스케치

### M1. `gjc-runtime/brand-prompt.ts` (신규, ≤150줄)

```typescript
/** 085.5 L2 공통 + 055 cli-jaw dev 어휘 맵. 순수 함수 — gjc 브랜드면 no-op. */
export function brandPromptText(text: string): string { /* 085.5 경계 보존 치환 */ }

const CLI_JAW_COMMAND_MAP: ReadonlyArray<[RegExp, string]> = [
	[/\bcli-jaw orchestrate ([IPABCD])\b/g, (…) => `jwc orchestrate ${stage.toLowerCase()}`],
	[/\bcli-jaw orchestrate reset\b/g, "jwc orchestrate complete (full reset 미지원)"],
	[/\bcli-jaw dispatch[^\n`]*/g, degraded("task subagent로 위임 — plan 전문을 task 프롬프트에 직접 포함")],
	[/\bcli-jaw bgtask[^\n`]*/g, degraded("장기 외부 대기는 로컬 폴링 또는 사용자 수동 재개")],
	[/\bcli-jaw (goal|memory)\b/g, "jwc $1"],          // 060/070 표면 — 구현 전엔 안내 문구 버전 사용
	[/\bcli-jaw (project|task|browser)[^\n`]*/g, degraded(…)],
];
export function applyCliJawDevVocabularyMap(body: string): string { … }
```

- 보존 규칙(테스트로 고정): `~/.cli-jaw` 경로 리터럴, `.gjc/`, fenced code 블록 내부는 명령 매핑만 적용하고 역할 어휘(Boss→main session)는 산문에만
- `degraded(msg)` = `[jwc: unavailable — ${msg}]` 고정 포맷

### M2. P1 분기 — `buildSkillPromptMessage`

```typescript
let body = content.replace(FRONTMATTER_RE, "").trim();
if (isJawBrand()) {
	if (skillSourceProvider(skill) === "cli-jaw") body = applyCliJawDevVocabularyMap(body);
	body = brandPromptText(body); // 085.5 공통 (번들 4종 포함)
}
```

- `skillSourceProvider`: Skill 타입의 source 메타(`_source.provider`)에서 — 없으면 `filePath.includes("/.cli-jaw/skills/")` 폴백
- P2/P3 description은 `brandPromptText` + 명령 매핑 1패스만 (degraded 블록 불요 — 짧은 문자열)

### M3. 호출부 — 무변경 (P9 4곳이 P1 경유)

## 3. 테스트 — `test/extensibility/skill-brand-compat.test.ts` (신규)

| 케이스 | 기대 |
|--------|------|
| jaw 브랜드 + cli-jaw provider 스킬 본문 `cli-jaw orchestrate I` | `jwc orchestrate i` |
| 동일 본문 `cli-jaw bgtask add --preset web-ai` | `[jwc: unavailable — …]` 포함, 원문 비노출 |
| `~/.cli-jaw/skills` 경로 리터럴 | 무변경 보존 |
| fenced 코드 블록 내 `cli-jaw dispatch …` | 명령 매핑 적용, 역할 어휘 비적용 |
| gjc 브랜드(env unset) | **byte-동일** (no-op) |
| native(비 cli-jaw) 스킬 | dev 어휘 맵 미적용, brandPromptText만 |
| dev-pabcd/memory | 여전히 미로드 (`skills-discovery-jaw.test.ts` 기존 + 회귀 확인) |

게이트: `bun run check:types` + biome + 기존 `skills-discovery-jaw.test.ts` 무회귀. rebrand/G002 무접촉(소스 스킬 파일 무변경).

## 4. 구현 순서·의존

1. 085.5 M3 `brandPromptText` 골격 (공통 엔진 — 085.5와 한 커밋 가능)
2. 본 플랜 M1 dev 어휘 맵 + M2 분기 + 테스트
3. 060/070 구현 시 056 §5-1에 따라 stub 문구를 실명령으로 갱신 (테이블 1곳)

## 5. [열린 질문]

1. cli-jaw 스킬 29종 중 dev 군 밖(search, telegram-send, k-thread-gen 등)도 로드되는데 — 이들의 cli-jaw 서버 의존(예: `cli-jaw browser`)은 056 범위 밖. 전수 확장 vs dev 군 우선 ([기본값 제안: dev 군 우선 — 다른 스킬은 발견 시 테이블 추가])
2. degraded 안내의 언어 — 스킬 본문이 영어면 영어로 (치환 포맷 이중화) ([기본값 제안: 영어 고정 — 스킬 본문 주류 언어])
