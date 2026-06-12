# 090_auth — 인증 / 릴리스 게이트 (jwc_patched)

**⬜ MOC** — [확정 D7] 로컬 토큰 시딩: cli-jaw Keychain 패턴 → jwc AuthStorage.

- M2 done: 기존 로그인 토큰 그대로 동작
- `createAgentSession({ authStorage })` 주입
- npm publish 정책 열린 질문 (010)
