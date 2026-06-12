# architecture / conventions.md (jwc_patched)

> **스냅샷 (2026-06-13)**: patched SoT는 [`structure/conventions.md`](../../../structure/conventions.md).  
> fork `81bcea96` · gjc clone `67427c6`.

## structure/ 발췌 (첫 12줄)

```markdown
# Jawcode 컨벤션

## 1. 포크 규칙 (리베이스 친화)

업스트림과의 충돌 면적을 최소화한다. **업스트림 파일 수정은 최후 수단.**

- ✅ 신규 파일/폴더 추가: `structure/`, `devlog/`, 그리고 jawcode 전용 코드는
  가능한 한 새 패키지(`packages/jaw-*`) 또는 새 모듈 파일로
- ⚠️ 업스트림 파일 수정: 해당 devlog 플랜에 경로·사유를 기록한 뒤에만
- ❌ `AGENTS.md` 수정 금지 — 업스트림 운영 계약(워크플로 스킬 4종, 롤 에이전트 4종,
  `.jwc/` 경로 계약 (upstream AGENTS.md는 legacy `.gjc/` 표기))이며 리베이스 충돌 1순위. jawcode 컨텍스트는 `structure/`에 둔다

```

## 대조 메모

| side | 역할 |
|---|---|
| gjc_origin | upstream 클론 시점의 structure 동형 요약 (과거 har_struct) |
| jwc_patched | **structure/** 가 항상 최신 정본 — 본 파일은 인덱스·리베이스 전 훑기용 |

## 부록

- 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate-architecture.ts`

