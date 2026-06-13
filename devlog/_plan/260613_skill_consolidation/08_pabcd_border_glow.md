# PABCD 입력 테두리 light cycling 효과

> 상태: 🔨 구현 중 (260613)

## 설계

PABCD 모드 활성 시 채팅 입력 테두리에 phase별 색상 띠 + breathing pulse 애니메이션.

### Phase 색상

| Phase | 색상 | HSL 기준 hue | 의미 |
|---|---|---|---|
| I | cyan | 180° | 정보 수집 |
| P | yellow | 50° | 계획 수립 |
| A | magenta | 300° | 감사/검증 |
| B | green | 120° | 구현 |
| C | red | 0° | 최종 검증 |
| D | white | — | 완료 |

### Breathing Pulse

- saturation 80% 고정, lightness를 40%↔70% 사이에서 sinusoidal 순환
- 주기: ~2초 (부드러운 호흡 효과)
- 프레임: 10fps (100ms interval) — 터미널 부하 최소
- 메모리: < 0.01MB (ANSI 문자열 1줄 재생성)

### 구현 위치

- `interactive-mode.ts` `updateEditorChrome()` — PABCD 상태 감지 + borderColor 설정
- 새 유틸: `pabcd-border.ts` — phase→color 매핑 + breathing timer

### 동작

```
PABCD IDLE → 일반 테두리 (session accent / thinking level)
PABCD P active → 노란 breathing pulse 테두리
PABCD B active → 초록 breathing pulse 테두리
PABCD complete → 일반 테두리로 복원
```

timer는 PABCD 진입 시 시작, IDLE 복귀 시 정리.
