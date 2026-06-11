# Devlog

Jawcode 포크의 계획, 완료 기록, 레퍼런스 문서 모음.

## Layout

```text
devlog/
  _plan/       # active or pending plans (YYMMDD_slug/)
  _fin/        # completed summaries
  _reference/  # structure/ — 코드 지도와 source-of-truth 문서
               # 002_proxy/ — gjc 프로바이더 계층 분석 노트 (자체 git repo, 원본: /Users/jun/Developer/new/002_proxy)
```

upstream(gajae-code) 소유인 `docs/`는 리베이스 충돌 방지를 위해 루트에 그대로 둔다.
jawcode 전용 컨텍스트는 전부 이 폴더 아래에 둔다.
