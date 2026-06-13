# 00 — MOC: GitHub 배포 전 패키징 감사

> 상태: 🟡 전수조사 진행 중. jawcode + cli-jaw GitHub 배포 전 외부 의존성·하드코딩 경로·
> 머신 종속 참조를 전부 찾아 내부화하거나 동적 해석으로 교체한다.

## 배경

cu-mcp(`~/developer/codex/23_computer_use/`)가 jawcode 외부 레포에 절대경로로 참조됨.
cua-driver(`~/.local/bin/cua-driver`)도 외부 바이너리. GitHub에 배포하면 다른 머신에서 깨짐.

## 조사 범위

| 대상 | 조사 항목 |
|---|---|
| jawcode 모노레포 | 소스·설정·MCP config의 절대경로, `file:` 의존성, 외부 바이너리 참조 |
| cli-jaw | prompt 템플릿·mcp-sync·structure의 머신 종속 경로 |
| cu-mcp-server | 의존성 포터빌리티, cu-native 바이너리 전략, 모노레포 패키지화 방안 |
| cua-driver | 외부 바이너리 → 설치 스크립트 or 선택적 의존 |

## 작업 항목 (Sonnet 전수조사 결과로 갱신 예정)

- [ ] cu-mcp를 `packages/computer-use-mcp/`로 이동 (의존성: `@modelcontextprotocol/sdk` + `zod`)
- [ ] cu-native Swift 바이너리 전략 결정 (prebuilt binary vs build-from-source vs optional)
- [ ] `~/.jwc/agent/mcp.json`의 절대경로 → 상대경로 or 동적 해석
- [ ] cua-driver → optional peer dependency + 설치 가이드
- [ ] jawcode 소스 내 `/Users/jun` 하드코딩 제거
- [ ] cli-jaw 소스 내 머신 종속 참조 제거
- [ ] structure 문서의 절대경로 → 상대경로 변환 (devlog 참조 경로)

## 문서

| # | 문서 | 내용 |
|---|---|---|
| 00 | 본 MOC | 감사 범위·작업 항목 |
| (추가 예정) | Sonnet 전수조사 결과 | jawcode·cli-jaw·cu-mcp 감사 결과 |
