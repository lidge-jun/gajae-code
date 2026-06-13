# Jawcode (jwc)

> cli-jaw의 네이티브 에이전트 런타임. upstream gajae-code 0.4.4 포크 위에 Jaw/jwc 표면을 얹은 빌드.

## 관계

- **엔진**: gajae-code 0.4.4 포크 — **소스 하드 수정 원칙** (인터뷰 260612 02:04 확정): 프롬프트·번들 스킬에 Jaw/jwc 어휘 직접 기입, 가드는 jwc 기준. 업스트림 머지 시 프롬프트 충돌은 수용 비용. 기능 식별자(`.jwc/` 경로·`GJC_*` env·`@gajae-code/*` 스코프)는 보존
- **jwc bin**: `packages/jwc/bin/jwc.js` — **단일 진입점** (legacy shell package는 제거됨; 필요 시 upstream npm `gajae-code` 별도 설치)
- **임베딩 표면**: `jwc/sdk` (`packages/jwc/src/sdk.ts`) — cli-jaw가 import하는 단일 통로
- 상태 경로(`.jwc/`)·패키지 스코프(`@gajae-code/*`)·릴리스 에셋명은 upstream engine 계보 그대로

## 실행

```sh
bun packages/jwc/bin/jwc.js            # TUI
bun packages/jwc/bin/jwc.js --version  # jwc/<engine version>
```

기여: [CONTRIBUTING.jwc.md](./CONTRIBUTING.jwc.md) · beta 문서 마감: [structure/50_status.md](structure/50_status.md)
문서 정본 가이드와 에이전트용 개발로그는 [`AGENTS.md`](./AGENTS.md)에 적는다.

## 아이덴티티 설정

`/settings` Identity 탭(또는 `identity.{name,emoji,vibe,language}` config 키)으로 에이전트 이름/말투/언어를
설정하면 시스템 프롬프트에 반영된다. `/identity`는 설정 경로 안내, `/identity-auto`는 대화형 설정. 미설정 시 업스트림과 동일.

## 로드맵

- M1 (000–099): jwc 단독 완성 — 리네이밍 · 프롬프팅 · 스킬 3계층 · Interview/Plan/Goal 병합 · 메모리 · TUI · 인증 시딩
- M2 (100–150): cli-jaw 상주 런타임 이식 — Node 포팅 · JawRuntime · jaw.db 세션 · 주입 · 승격

정본 계획: `devlog/_plan/260614_cli_jaw_jwc_distribution_strategy/000_moc_distribution_strategy.md` · legacy fork 계획: `devlog/_plan/260614_cli_jaw_jwc_distribution_strategy/_legacy/260612_jawcode_fork/phase1/000_roadmap.md` · 코드 지도: `structure/00_INDEX.md` · **레디니스**: `structure/50_status.md` · **99 결정**: `structure/50_status.md` · **beta v0.1 문서 마감**: `structure/50_status.md` · 로직: `structure/40_fork-delta.md` · 문서 삼축: `structure/00_INDEX.md` · 대조: `struct_har/README.md` · omp: `struct_har/omp_origin/README.md`
