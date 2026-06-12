# 010_shell — 셸 + 표면 리네이밍 (jwc_patched)

포크는 **`packages/jwc`** 래퍼 + bin **`jwc`** 를 추가했다. `gjc` bin은 공존(업스트림 구조 유지). 배너/상태줄/Identity 탭 등 일부 표면은 jaw 브랜딩으로 패치됐고, rebrand-inventory 가드에 `jwc`가 allowlist 확장됐다.

- ✅ `jwc` bin + `jwc/sdk` re-export (010 Phase1 완료)
- 🟡 잔여 grep: 서브커맨드 examples의 `$ gjc ...` 리터럴 (011 이월)
- [확정 D4] `.gjc/` 경로·`@gajae-code/*` 패키지명 유지
