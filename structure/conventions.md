# Jawcode 컨벤션

## 1. 포크 규칙 (리베이스 친화)

업스트림과의 충돌 면적을 최소화한다. **업스트림 파일 수정은 최후 수단.**

- ✅ 신규 파일/폴더 추가: `structure/`, `devlog/`, 그리고 jawcode 전용 코드는
  가능한 한 새 패키지(`packages/jaw-*`) 또는 새 모듈 파일로
- ⚠️ 업스트림 파일 수정: 해당 devlog 플랜에 경로·사유를 기록한 뒤에만
- ❌ `AGENTS.md` 수정 금지 — 업스트림 운영 계약(워크플로 스킬 4종, 롤 에이전트 4종,
  `.gjc/` 경로 계약)이며 리베이스 충돌 1순위. jawcode 컨텍스트는 `structure/`에 둔다

### 커밋 트레일러 규약 (fork-delta 동기 — 067.1 §3.1)

HARD-EDIT·INVERTED-GUARD·REMOVED 파일이 포함된 커밋은 트레일러를 붙인다 (NEW/SOFT-EDIT는 선택 — `fork-delta.md` 갱신으로 대체 가능):

```
Fork-Delta: <NEW|HARD-EDIT|REMOVED|INVERTED-GUARD|SOFT-EDIT> <저장소상대경로>
```

파싱: `git log --format=%(trailers:key=Fork-Delta)`. 소스 인라인 마커(`// [jawcode-fork]`)는 채택하지 않음 — 예외: 파일 상단 1행 한정 보존 경계 주석.

## 2. 업스트림 동기화

### 2.1 worktree remote

- remote: `upstream` = https://github.com/Yeachan-Heo/gajae-code
- `origin`은 비어 있음 — jawcode 자체 저장소 생성 시 추가
- 동기화: `git fetch upstream && git rebase upstream/main` (또는 merge — 첫 동기화 때 결정)
- `packages/ai/src/models.json`(1.5MB 모델 카탈로그)은 업스트림 추종, 직접 수정 금지

### 2.2 업스트림 참조 클론 (`devlog/_upstream_gjc/`)

포크 개발은 **worktree 패치 + upstream 클론 pull·대조**를 병행한다. `structure/`는 patched SoT, 클론은 upstream baseline 근거다.

| 항목 | 값 |
|---|---|
| 경로 | `devlog/_upstream_gjc/` |
| remote | `https://github.com/Yeachan-Heo/gajae-code` |
| git 추적 | **gitignored** — jawcode 커밋에 upstream 트리를 넣지 않음 |
| 용도 | file:line 근거, `diff -u` 대조, upstream-only 버그 재현 (081 등) |
| 대조 문서 | `har_struct/gjc_origin/` (클론 @ HEAD) ↔ `har_struct/jwc_patched/` (worktree) |

**최초 클론**

```bash
git clone https://github.com/Yeachan-Heo/gajae-code devlog/_upstream_gjc
```

**밴드 착수·리베이스 전 pull (권장)**

```bash
git -C devlog/_upstream_gjc fetch origin
git -C devlog/_upstream_gjc log -1 --oneline    # HEAD를 devlog·har_struct에 기록
git fetch upstream && git rebase upstream/main    # worktree — 변경 정리 후
```

**근거 cite 규칙**

- upstream baseline: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/<repo-relative-path>:<line>`
- fork patched: `/Users/jun/Developer/new/700_projects/jawcode/<path>:<line>`

클론 HEAD 갱신 후: `har_struct/gjc_origin/**/02_code_facts.md` path 인벤토리, `har_struct/README.md` 기준선, 필요 시 `structure/gitstructure.md` HEAD 표를 맞춘다.

## 3. 코드 컨벤션

업스트림 컨벤션을 그대로 따른다:
- Bun workspaces + catalog, biome (린트/포맷), TypeScript strict
- 패키지 네임스페이스: 업스트림 `@gajae-code/*`는 유지, jawcode 신규 패키지만 `@jaw/*`
- 커밋: 업스트림은 conventional commits (`fix(scope):`, `docs(changelog):`) — 동일하게

| 규칙 | 근거 |
|---|---|
| no `any`, no `ReturnType<>`, no inline imports | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:52`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:53` |
| prompts는 static `.md` 파일 import | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:57` |
| `packages/coding-agent/`에서 console logging 금지 | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:75` |
| 검증은 `bun check` / `bun run check:ts`, `tsc`/`npx tsc` 금지 | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:89` |

## 4. Devlog (Jawdev 표준)

- 플랜 단위 폴더: `devlog/_plan/YYMMDD_slug/`
- 10진 프리픽스: `00–09` 리서치/인덱스, `10–19` Phase 1, `20–29` Phase 2, …
- `00_*`가 그 플랜 단위의 인덱스
- diff 레벨 플랜은 채팅이 아닌 파일로: 정확한 경로, NEW/MODIFY/DELETE, MODIFY는 before/after
- 완료된 플랜 폴더는 `devlog/_fin/`으로 이동
- 문서 내 파일 참조는 **절대 경로** 사용

## 4.1 MOC 표기 규약

| 표기 | 의미 | 사용 위치 | 근거 |
|---|---|---|---|
| `[확정]` | 인터뷰에서 확정된 결정. 구현은 이 결정을 기준으로 한다. | MOC/roadmap/structure 문서 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:34` |
| `[기본값]` | repo(업스트림 gjc)의 실제 동작. 별도 결정이 없으면 이대로 간다. | 코드 실사 결과, default behavior | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:34` |
| `[제안]` | repo 기본값에서 벗어나는 변경안. 채택은 인터뷰 결정 필요. | 설계 옵션, 향후 개선안 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:34` |

## 4.2 문서 근거 규칙

| 규칙 | 적용 |
|---|---|
| 구조 문서의 사실 주장은 실제 파일 경로와 라인 번호를 단다. | `structure/*.md` |
| 실행 결과 근거는 명령과 관찰값을 같이 쓴다. | `gitstructure.md`의 remote/status/HEAD |
| 계획/결정과 코드 사실을 분리한다. | `[확정]`, `[기본값]`, `[제안]` 표기 |
| `structure/INDEX.md`는 문서 추가/삭제/범위 변경 때 같이 갱신한다. | `/Users/jun/Developer/new/700_projects/jawcode/structure/INDEX.md:1` |

## 5. str_func

현 단계에서는 사용하지 않는다 (경량 표준). 모듈 단위 함수 문서가 필요해지는
첫 광역 기능 작업 때 도입을 재검토한다.
