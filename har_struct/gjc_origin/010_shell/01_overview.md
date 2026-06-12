# 010_shell — 셸 + 표면 리네이밍 (gjc_origin)

업스트림 gajae-code는 **단일 CLI bin `gjc`** 만 공개한다. `packages/jwc` 래퍼는 없고, 배너·`--help`·에러·버전 문자열에 `gjc`/`Gajae-Code` 브랜딩이 코드 전역에 분산돼 있다.

- bin: `gjc`, `gjc-stats` (`scripts/rebrand-inventory.ts` 기계 검증)
- `APP_NAME = "gjc"` (`packages/utils/src/dirs.ts`)
- README는 upstream 단일본
- default workflow 스킬 **표면 이름**은 `deep-interview`, `ralplan`, `ultragoal`, `team`
