# 094 — plan: Local Token Auto-Detection for `/login` (Overview)

> 상태: [계획] — 구현 대기
> 선행: 093 (Kiro provider, SQLite auto-read 패턴 확립)
> 소속: 090 밴드 (인증 시딩)

## 요약

jwc `/login` 시 로컬에 설치된 CLI 도구의 토큰을 자동 감지하여 사용.
이미 credential 있으면 무시, 빈 상태에서만 자동 적용.
Kiro 패턴(SQLite auto-read)을 일반화.

---

## ① 대상 CLI 목록

| # | CLI | 토큰 경로 | 포맷 | jwc Provider | 동일 OAuth App | Plan |
|---|---|---|---|---|---|---|
| 1 | **Codex CLI** | `~/.codex/auth.json` | JSON | `openai-codex` | ✅ `app_EMoamEEZ73f0CkXaXp7hrann` | [094.1](094.1_codex_local_token.md) |
| 2 | **Claude Code** | macOS Keychain `"Claude Code-credentials"` | JSON in Keychain | `anthropic` | ✅ `9d1c250a-e61b-44d9-88ed-5944d1962f5e` | [094.2](094.2_claude_code_local_token.md) |
| 3 | **xAI/Grok CLI** | `~/.grok/auth.json` | JSON | `xai` | ✅ `b1a00492-073a-47ea-816f-4c329264a828` | [094.3](094.3_xai_local_token.md) |
| 4 | **Kiro CLI** | `~/Library/…/kiro-cli/data.sqlite3` | SQLite | `kiro` | ✅ | ✅ 구현 완료 (093) |

---

## ② 공통 아키텍처

### 범용 레지스트리 (`packages/ai/src/utils/oauth/local-token-detect.ts`)

```typescript
interface LocalTokenSource {
  provider: OAuthProvider;
  detect: () => OAuthCredentials | null;  // sync — 파일/키체인 읽기
  description: string;
}

const LOCAL_TOKEN_SOURCES: LocalTokenSource[] = [
  { provider: "openai-codex", detect: detectCodexCliToken, description: "Codex CLI" },
  { provider: "anthropic", detect: detectClaudeCodeToken, description: "Claude Code" },
  { provider: "xai", detect: detectGrokCliToken, description: "Grok CLI" },
];

export function detectLocalToken(provider: OAuthProvider): OAuthCredentials | null;
```

### 동작 원칙

1. `/login {provider}` 선택 시 **무조건** auto-detect 시도 (기존 credential 유무 무관 — `this.remove()` 후 재감지)
2. 감지 성공 → 만료 체크 → refresh if needed → 저장 → 완료
3. 감지 실패 → 기존 OAuth 플로우 fallback (브라우저, device code 등)

### 보안 원칙

- 동일 OAuth Client ID를 사용하므로 토큰 재사용은 기술적으로 legitimate
- 파일/키체인 읽기만 (쓰기 금지)
- 로그에 토큰 전문 출력 금지 (마스킹)
- auto-detect 시 "Found {source} token" 1줄 로그

---

## 상세 플랜

- **094.1** — [Codex CLI](094.1_codex_local_token.md) (`~/.codex/auth.json`)
- **094.2** — [Claude Code](094.2_claude_code_local_token.md) (macOS Keychain)
- **094.3** — [xAI/Grok CLI](094.3_xai_local_token.md) (`~/.grok/auth.json`)
