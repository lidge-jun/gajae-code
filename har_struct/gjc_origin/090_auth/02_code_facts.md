# 090_auth — code facts (gjc_origin)

> **upstream 정본**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` @ `40c8d7f`  
> MOC 보조: `devlog/_plan/260612_jawcode_fork/090_moc_*.md`

## 1. upstream 경로 인벤토리 (`devlog/_upstream_gjc/`)

| # | upstream path | line | excerpt |
|---:|---|---:|---|
| 1 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 3 | ` * Handles loading, saving, refreshing credentials, and usage tracking.` |
| 2 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 7 | ` * - `AuthStorage` class: credential management with round-robin, usage limits, OAuth refresh` |
| 3 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 33 | `import { getOAuthApiKey, getOAuthProvider, refreshOAuthToken } from "./utils/oauth";` |
| 4 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 34 | `import { loginDeepSeek } from "./utils/oauth/deepseek";` |
| 5 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 35 | `import { loginOpenAICodexDevice } from "./utils/oauth/openai-codex";` |
| 6 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 36 | `import type { OAuthController, OAuthCredentials, OAuthProvider, OAuthProviderId } from "./utils/oauth/types";` |
| 7 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 48 | `	type: "oauth";` |
| 8 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 55 | `export type AuthStorageData = Record<string, AuthCredentialEntry>;` |
| 9 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 58 | ` * Serialized representation of AuthStorage for passing to subagent workers.` |
| 10 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 59 | ` * Contains only the essential credential data, not runtime state.` |
| 11 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 61 | `export interface SerializedAuthStorage {` |
| 12 | `devlog/_upstream_gjc/packages/ai/src/auth-storage.ts` | 62 | `	credentials: Record<` |
| 13 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 225 | `	/** Auth storage for credentials. Default: discoverAuthStorage(agentDir) */` |
| 14 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 226 | `	authStorage?: AuthStorage;` |
| 15 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 227 | `	/** Model registry. Default: discoverModels(authStorage, agentDir) */` |
| 16 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 409 | `export async function discoverAuthStorage(agentDir: string = getDefaultAgentDir()): Promise<AuthStorage> {` |
| 17 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 804 | `	// Pin authStorage to modelRegistry.authStorage: ModelRegistry.getApiKey() routes refresh` |
| 18 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 809 | `		new ModelRegistry(options.authStorage ?? (await logger.time("discoverModels", discoverAuthStorage, agentDir)));` |
| 19 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 810 | `	const authStorage = modelRegistry.authStorage;` |
| 20 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 811 | `	if (options.authStorage && options.authStorage !== authStorage) {` |
| 21 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 813 | `			"options.authStorage and options.modelRegistry.authStorage must be the same instance when both are provided",` |
| 22 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 822 | `	let unsubscribeCredentialDisabled: (() => void) \| undefined = authStorage.onCredentialDisabled(event => {` |
| 23 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 1239 | `			authStorage,` |
| 24 | `devlog/_upstream_gjc/packages/coding-agent/src/sdk.ts` | 1873 | `						await modelRegistry.authStorage.invalidateCredentialMatching(provider, oldKey, {` |

## 2. fork diff 관찰 (worktree vs upstream)

```bash
# 밴드 공통 diff 패턴
diff -qr devlog/_upstream_gjc/packages/coding-agent/src/ packages/coding-agent/src/ | head
git -C devlog/_upstream_gjc rev-parse --short HEAD   # → 40c8d7f
git rev-parse --short HEAD               # → e90ee99
```

| 관찰 | upstream (`devlog/_upstream_gjc`) | fork (worktree) |
|---|---|---|
| HEAD | `40c8d7f` | `e90ee99` |
| jwc wrapper | 없음 | `packages/jwc` ✅ |
| interview slug | `deep-interview` | `jaw-interview` ✅ |

## 3. 검증 명령 (upstream 클론에서)

```bash
git -C devlog/_upstream_gjc log -1 --oneline
grep -n deep-interview devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts
grep -n expectedCliBins devlog/_upstream_gjc/scripts/rebrand-inventory.ts
bun -C devlog/_upstream_gjc run check   # upstream 자체 검증
```

## 4. devlog 교차 (스코프·결정)

- MOC: `devlog/_plan/260612_jawcode_fork/090_moc_*`
- 로드맵: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
- patched SoT: `structure/` (jwc_patched side)


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


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `090_auth`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
