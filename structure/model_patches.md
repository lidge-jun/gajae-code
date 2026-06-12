# 모델별 동작 패치 지도 (model behavior patch map)

> 특정 모델/프로바이더가 jwc 안에서 오동작할 때 **어디를 고치면 되는지**의 정본.
> 지금까지 패치한 모델 내역(§1)과, 다른 프로바이더에서 문제가 터졌을 때 따라가는
> 플레이북(§3)을 담는다. 상세 경위는 devlog 081 밴드, 구현은 각 코드 위치 참조.

jwc에서 "모델이 이상하다"는 문제는 대부분 네 층 중 하나에서 고친다: ① **카탈로그**
(모델 스펙·호환 플래그), ② **요청 변환기**(프로바이더별 파라미터 가공), ③ **모델별
시스템 프롬프트 주입**(행동 교정), ④ **도구/호스트 측 방어**(모델 무관 일반화).
아래로 갈수록 적용 범위가 넓고 위로 갈수록 정밀하다. 원칙: **사실 오류(스펙·파라미터)는
①②로, 행동 습성은 ③으로, 모든 모델이 당할 수 있는 함정은 ④로.**

---

## 1. 패치 완료 내역 (2026-06-12 기준)

| 대상 | 증상 | 패치 층 | 위치 | devlog |
|---|---|---|---|---|
| xai/grok-composer-2.5-fast | 미등록 모델 | ① 카탈로그 엔트리 | `packages/ai/src/models.json` xai 블록 (ctx 200k / maxOut 64k) | #518 (업스트림 머지) |
| 〃 | `reasoningEffort` 400 거부 | ① per-model compat | 같은 엔트리 `"compat": {"supportsReasoningEffort": false}` | 081 밴드, #518 |
| composer-* (xai·cursor 공통) | hashline 앵커 날조·sed 읽기·python 대역외 수정·heredoc에 추론 누출·타임아웃을 성공으로 오인·unpruned find 루프 | ③ 프롬프트 주입 | `packages/ai/src/providers/composer-discipline.ts` (+ 주입: `openai-completions.ts` convertMessages, `cursor.ts` buildCursorSystemPromptJsons) | [081.8](../devlog/_plan/260612_jawcode_fork/phase1/081.8_issue_composer_anchor_fabrication.md), [081.11](../devlog/_plan/260612_jawcode_fork/phase1/081.11_issue_composer_bash_timeout_loops.md) |
| cursor 프로바이더 전 모델 | Cursor IDE 관습 가정 (.cursorrules 등) | ③ 프롬프트 주입 | `cursor.ts` `CURSOR_HOST_OVERRIDE_PROMPT` | 081.6 |
| cursor 전송로 | bash timeout ms↔s 단위 혼동 (30000ms→3600s) | ② 변환기 | `coding-agent/src/cursor.ts` `shellTimeoutSeconds` | #519 (업스트림 머지) |
| 전 모델 (출력 64k+ 카탈로그) | 컴팩션 임계 과소 (예약 64k vs 실요청 32k) | ④ 호스트 | `packages/ai/src/stream.ts` `effectiveMaxOutputTokens` + agent-session/context-usage 정렬 | [081.9 §6](../devlog/_plan/260612_jawcode_fork/phase1/081.9_issue_composer_autocontinue_no_stop.md) |
| 전 모델 | bash 타임아웃 kill이 부분 출력만 반환 → 성공 오인 | ④ 호스트 | `coding-agent/src/tools/bash.ts` `formatTimedOutResult` (KILLED 명시) | 081.11 옵션 B |
| 전 모델 (표시) | 상태줄 session_name이 composer 환각 타이틀 전문 렌더 | ④ 호스트 | `status-line/segments.ts` sessionNameSegment 미렌더 | [081.10](../devlog/_plan/260612_jawcode_fork/phase1/081.10_issue_statusline_title_leak.md) |
| (프록시, 레포 밖) composer via progrok | 자체 하네스 도구 호출·effort 400 | 외부 | `002_proxy/05_progrok/src/proxy/composer-inject.ts` | progrok devlog 260604 |

## 2. 패치 층별 코드 지도

### ① 카탈로그 — `packages/ai/src/models.json`

- 모델 엔트리: `contextWindow`, `maxTokens`, `reasoning`, `thinking`, `cost`, `baseUrl`.
- **per-model `compat`**: `OpenAICompat` 키를 모델 단위로 오버라이드 (`resolveOpenAICompat`,
  `openai-completions-compat.ts:253`이 provider 기본값 위에 머지). 예: composer의
  `supportsReasoningEffort: false`. provider 휴리스틱(예: `isGrok`)을 건드리지 말고
  **반드시 해당 모델 엔트리에만** 둔다.
- ⚠️ **모델 캐시 함정**: `~/.jwc/agent/models.db`(`model_cache`, authoritative 플래그)가
  스테일 compat을 서빙할 수 있다. 카탈로그 수정 후 살아있는 400이 계속되면 캐시 row를
  확인하고 갱신/삭제할 것 (081 밴드에서 실제로 당함).

### ② 요청 변환기 — 프로바이더별 wire 가공

- openai-completions: `convertMessages`/`streamOpenAICompletions` (`openai-completions.ts`),
  effort 게이팅 :1212-1236, maxTokens 기본 `effectiveMaxOutputTokens` (stream.ts).
- cursor RPC: protobuf 빌드 (`cursor.ts` buildGrpcRequest), exec 핸들러 단위 변환은
  `coding-agent/src/cursor.ts`.
- 파라미터를 "조용히 떨군다/변환한다"류는 전부 이 층.

### ③ 모델별 시스템 프롬프트 주입 — 행동 교정

| 경로 | 주입 지점 | 현재 입주자 |
|---|---|---|
| openai-completions (xai 직결 등) | `convertMessages` 시스템 프롬프트 unshift (`openai-completions.ts:1432` 부근) | `COMPOSER_EDIT_DISCIPLINE_PROMPT` (composer 한정) |
| cursor RPC | `buildCursorSystemPromptJsons(systemPrompt, modelId?)` | `CURSOR_HOST_OVERRIDE_PROMPT` (전 모델) + discipline (composer 한정) |
| anthropic / google / codex | **주입 지점 미구축** — 필요 시 같은 패턴(시스템 블록 선두 prepend)으로 신설 | — |

규약: 모델 판별은 id 부분 문자열 헬퍼(`isComposerHarnessModel` 식)로 한 곳에, 프롬프트
텍스트는 **관찰된 실패 모드를 정조준한 명령문**으로(일반론 금지), 호스트 시스템 프롬프트가
있을 때만 주입(베어 호출 오염 방지), KV 캐시를 위해 항상 선두 고정.

### ④ 도구/호스트 방어 — 모델 무관 일반화

특정 모델 때문에 발견했어도 **모든 모델이 당할 수 있으면** 이 층으로 격상한다.
사례: bash KILLED 명시(081.11 B), 컴팩션 예약·요청 정합(081.9 E), cursor ms→s(#519).

## 3. 플레이북 — 새 프로바이더/모델에서 문제가 터지면

1. **증거 먼저**: 세션 JSONL(`~/.jwc/agent/sessions/<cwd-slug>/*.jsonl`)에서 도구 호출·
   stopReason·에러를 추출. HTTP 400은 `~/.jwc/logs/http-400-requests/*.json`이 원문 요청을
   담고 있다. 모델의 자기 설명은 증거가 아니다 (devlog 081 교훈 — composer 자기 진단은 confabulation).
2. **층 판별**:
   - 4xx/파라미터 거부 → ①(compat) 또는 ②(변환기). 먼저 ①로 풀리는지 본다.
   - 스펙 불일치(컨텍스트/출력 한도) → ① + 캐시(models.db) 확인.
   - 도구 오남용·형식 위반·추론 누출 등 습성 → ③ discipline 블록 (기존 텍스트에 조항
     추가가 우선, 새 모델군이면 새 모듈).
   - 어느 모델이든 같은 함정에 빠질 구조 → ④.
3. **구현 규약**: fork-delta 최소화 — 신규 파일 + 기존 파일 한두 줄 후킹. 주석에
   `jwc fork (devlog NNN.N)` 표기. 테스트는 packages/ai|coding-agent `test/`에 모델별
   주입/비주입 양쪽 케이스.
4. **검증**: 단위 테스트 + 살아있는 jwc 한 방(`jwc -p --no-session --model "<prov>/<id>" "Reply with exactly: OK"`).
   캐시 스테일 의심 시 models.db 직검. ⚠️ jwc는 `packages/jwc/dist/jwc.bundle.js`가 있으면 **번들 우선** —
   소스 패치 후 `cd packages/jwc && bun run bundle` 재번들 필수 (스테일 번들 = 패치 미반영 오판의 단골).
5. **기록**: devlog 081 밴드(또는 해당 밴드)에 issue 문서 + 081 MOC 행 + **이 문서 §1 표에
   행 추가**. 업스트림 가치가 있으면(사실 오류 계열) PR, 행동 교정(③)은 fork 유지가 기본.

## 4. 빠른 참조 — 자주 쓰는 진단 한 줄

```bash
# 모델 캐시에서 특정 모델 compat 확인
sqlite3 ~/.jwc/agent/models.db "select models from model_cache where provider='xai'" | python3 -m json.tool | grep -A3 composer
# 세션에서 도구 거부/에러 빈도
grep -c "anchors do not match" ~/.jwc/agent/sessions/<slug>/<session>.jsonl
# 살아있는 검증
jwc -p --no-session --no-tools --model "xai/grok-composer-2.5-fast" --thinking high "Reply with exactly: OK"
```
