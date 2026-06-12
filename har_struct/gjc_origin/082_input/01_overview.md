# 082_input — TUI 입력 / IME (gjc_origin)

TUI 입력 — legacy 터미널 IME 경계에서 **Ctrl 단축키 미작동** upstream 버그.

- 한글 IME: Ctrl이 0x03 대신 자모 바이트 전달
- native matcher는 C0만 인식
- first-char cursor jump (082.2)
