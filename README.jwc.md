# Jawcode (jwc)

> cli-jaw의 네이티브 에이전트 런타임. [gajae-code](./README.md) 0.4.4 포크 위에 jaw 표면을 얹은 빌드.

## 관계

- **엔진**: gajae-code (`gjc`) — 업스트림 무수정 추종 원칙, 표면 리네이밍만 (D4)
- **jwc bin**: `packages/jwc/bin/jwc.js` — `GJC_BRAND_NAME=jwc`로 브랜드만 전환해 같은 엔진 구동
- **임베딩 표면**: `jwc/sdk` (`packages/jwc/src/sdk.ts`) — cli-jaw가 import하는 단일 통로
- 상태 경로(`.gjc/`)·패키지 스코프(`@gajae-code/*`)·릴리스 에셋명은 엔진(gjc) 그대로

## 실행

```sh
bun packages/jwc/bin/jwc.js            # TUI
bun packages/jwc/bin/jwc.js --version  # jwc/<engine version>
```

## 아이덴티티 설정

`/settings` Identity 탭(또는 `identity.{name,emoji,vibe,language}` config 키)으로 에이전트 이름/말투/언어를
설정하면 시스템 프롬프트에 반영된다. `/identity`는 설정 경로 안내, `/identity-auto`는 대화형 설정. 미설정 시 업스트림과 동일.

## 로드맵

- M1 (000–099): jwc 단독 완성 — 리네이밍 · 프롬프팅 · 스킬 3계층 · Interview/Plan/Goal 병합 · 메모리 · TUI · 인증 시딩
- M2 (100–150): cli-jaw 상주 런타임 이식 — Node 포팅 · JawRuntime · jaw.db 세션 · 주입 · 승격

정본 계획: `devlog/_plan/260612_jawcode_fork/000_roadmap.md` · 코드 지도: `structure/INDEX.md`
