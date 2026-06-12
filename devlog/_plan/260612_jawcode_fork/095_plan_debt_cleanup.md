# 095 — 부채 해소 플랜 (하드 수정 전환 + 미커밋 혼재 + 가드/문서 정합)

> 입력: 사용자 "지금까지 이어져 왔던 부채를 해결하는 플랜" (260612 02:11). 전수 감사: Backend 직원 read-only (260612 02:1x, HEAD `efb3d290`).
> 배경: 인터뷰 02:04 확정 — 소스 하드 수정 원칙 전환([085.5](./085.5_plan_prompt_rebrand.md) 개정판)으로 구원칙(diff-0·런타임 치환·gjc 무회귀) 기반 코드·테스트·문서가 부채화. 별도로 dirty tree에 3개 워크스트림 혼재 + biome 레드.

## 0. 부채 인벤토리 (감사 결과 요약 — 전수는 감사 보고 원문)

| 분류 | 규모 | 핵심 |
|------|------|------|
| **D1 미커밋 혼재** | 수정 22 + 미추적 5 파일, 3개 워크스트림(086 비주얼 / 094.3 로컬토큰 / 094.4 quota / 085.5-M6 부분) | 단일 커밋 부적합 — 분리 커밋 필요. 086 테마 JSON 2종·094.3 `local-token-detect.ts`는 미추적이라 빌드 의존 깨짐 상태 |
| **D2 biome 레드** | error 16 · warning 3 (check:tools에서 check:ts 차단) | 선행 차단: **커밋된** kiro provider 9건+format. 미커밋 연동 6건(welcome/controllers/theme/registry/local-token-detect) |
| **D3 구원칙 코드·테스트** | 가드/테스트 ~10파일 깨질 예정, 기능 버그 3지점 미착수 | `default-gjc-definitions.test.ts`(214·319-371)·`bash-allowed-prefixes`·`bash-interceptor`·`agent-fields`·`state-handoff-thrift`·`gjc-dogfood-template`·`verify-g002-gates.ts`·`rebrand-inventory.ts` = M5 반전 대상. 유지: `skills-discovery-jaw`·`cli-command-surface`·`brand-visual-identity`·TUI/tool byte 스냅샷(브랜드 무관) |
| **D4 문서 부채** | devlog 구플랜 20+파일 + `README.jwc.md:7-8` + `structure/gitstructure.md:45-46` + 코드 주석 4곳 + `har_struct/` 27+파일 | "무수정 추종·diff-0·무회귀·런타임 치환"을 현행처럼 서술 |

브랜드 분기(`isJawBrand`/`GJC_BRAND_NAME`) 자체는 대부분 **유지 대상**(기능 게이트: jaw 전용 CLI/slash·스킬 디스커버리·TUI 비주얼·APP_NAME 표시) — 폐기되는 역할은 "gjc 산문 보존·byte-동일 assert"뿐.

## 1. 해소 웨이브

| W | 작업 | 내용 | 게이트 |
|---|------|------|--------|
| **W1** | biome 그린 | 커밋된 kiro 9건+format → 단독 커밋. 미커밋 연동 6건은 W2 각 커밋에 포함 | `bun run check:ts` exit 0 |
| **W2** | 미커밋 분리 커밋 | ① 094.3 로컬토큰(+`local-token-detect.ts` 추적) ② 094.4 quota ③ 086 비주얼(+테마 JSON 2종, `brand-visual-identity.test.ts`) ④ 084 모델셀렉터 테스트 ⑤ 085.5-M6 부분(commands 3종 — [열린 질문 3] 답대로 재작업 여부) | 워크스트림당 1커밋, 각 테스트 green |
| **W3** | 085.5 M1→M2+M5→M3→M4→M6 | 기능 버그 → 하드 수정+가드 반전 → 조립 코드 → 번들 스킬 → commands 잔여 (085.5 §5 순서) | 085.5 §3 테스트 표 |
| **W4** | 문서·주석 정합 | devlog 구플랜에 "[구원칙 — 02:04 개정으로 폐기]" 헤더 배너 일괄(파일별 본문 재작성은 안 함 — 역사 기록 보존), `README.jwc.md` 관계 절 개정, `structure/gitstructure.md` 게이트 목록 갱신, 코드 주석 4곳(cli.ts:56 등), `har_struct/` 처리([열린 질문 6]) | grep "무수정 추종\|diff-0" 현행 서술 0 (배너 처리 제외) |

W1·W2는 085.5 본 작업(W3)과 독립 — 즉시 착수 가능. W3가 W4의 선행(가드 반전 후 문서가 사실과 일치).

## 2. 사용자 결정 7건 (감사자 식별 — 기본값 제안)

| # | 쟁점 | 기본값 제안 |
|---|------|-------------|
| 1 | **gjc bin 존치 의미** — 하드 수정 후 gjc 실행도 Jaw 산문 노출 | 존치하되 **deprecated**(엔진 디버그용) 명문화, 업스트림 diff-0 목표 공식 폐기 |
| 2 | identity diff-0 불변식(`system-prompt-identity.test.ts:63`) | **재정의** — "미설정 시 하드-수정된 baseline과 동일"로 테스트 패턴 유지 |
| 3 | M6 예시 — `${APP_NAME}` 동적 vs `$ jwc` 리터럴 | **동적 유지** — 이미 구현 3건 활용, gjc bin 존치와 정합 (리터럴 하드는 gjc bin에서 jwc 안내라는 모순) |
| 4 | 브랜드 게이트(isJawBrand 등) 잔존 범위 | **전부 유지** — 기능 게이트는 산문 정체성과 무관 |
| 5 | G002/rebrand-inventory 계약 | jwc 어휘 기준 **반전** + gjc bin 표면 검증 항목 **폐기**(deprecated이므로) |
| 6 | `har_struct/` 27+파일 | W3 완료 후 **재생성** (자동 생성 스냅샷 — 수기 수정 금지) |
| 7 | 병렬성 — 086/094 커밋과 085.5 M1~M5 | **병렬 허용** — W1·W2 선행 후 W3와 TUI 잔여 작업 병렬 |

## 3. 완료 기준

1. `bun run check:ts` exit 0 (W1·W2 직후 시점부터 유지)
2. `git status` clean — 워크스트림별 분리 커밋 완료
3. 085.5 §3 테스트 표 green (M5 반전 가드 포함)
4. 구원칙 현행 서술 0 — devlog 배너·README.jwc·structure·코드 주석 처리 완료
5. jwc TUI "너는 누구야" e2e — Jaw 정체성, GJC 비언급
