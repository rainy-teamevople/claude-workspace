# claude-workspace

Claude Code와 함께 사용하는 개인 작업공간입니다.

---

## 폴더 구조

```
claude-workspace/
│
├── portfolio/                        # 포트폴리오 웹페이지
│   ├── index.html                    # 박한준 대표 포트폴리오
│   ├── hwasun.html                   # 박화선 리더 포트폴리오
│   └── images/
│       └── hwasun_caricature.png     # 프로필 캐리커처
│
├── Docs/                             # 참고 문서 (PDF 제외됨)
│   └── sales.csv
│
├── tasks/                            # 작업 기록
│   ├── todo.md                       # 오늘 할 일 체크리스트
│   └── progress.md                   # 완료 기록 (누적)
│
├── fetch_weather.ps1                 # 날씨 자동화 (PowerShell)
├── fetch_weather.py                  # 날씨 자동화 (Python)
├── weather_server.py                 # 날씨 데이터 서버
│
├── CLAUDE.md                         # Claude Code 행동 지침서 (자동으로 읽힘)
├── SECURITY.md                       # 🚨 키 노출 비상 매뉴얼
├── .gitignore
└── README.md
```

> `.env`, `Docs/*.pdf` 등 민감 파일은 `.gitignore`로 제외됩니다.

---

## 파일별 역할

| 파일/폴더 | 역할 | 주의 |
|-----------|------|------|
| `portfolio/` | Team Evople 리더십 포트폴리오 (브라우저에서 바로 열기 가능) | — |
| `CLAUDE.md` | Claude Code가 시작할 때 자동으로 읽는 지침서 | 규칙 변경 시 여기를 수정 |
| `SECURITY.md` | API 키 노출 시 즉시 열어볼 비상 매뉴얼 | 키 노출 의심 시 최우선 참고 |
| `.env` | API 키·환경변수 저장 | **절대 git 커밋 금지** |
| `tasks/todo.md` | 작업 시작 시 확인하는 체크리스트 | 완료 항목은 `[x]`로 체크 |
| `tasks/progress.md` | 완료한 작업을 날짜별로 기록 | 내용 삭제 금지 (누적만) |

---

## 자주 쓰는 작업 흐름

### 작업 시작할 때
1. `tasks/todo.md` 열어서 오늘 할 일 확인
2. Claude Code에게 작업 요청

### 작업 마칠 때
1. `tasks/todo.md`에서 완료 항목 `[x]` 체크
2. `tasks/progress.md`에 한 일 기록 추가

### API 키가 노출됐을 때
1. `SECURITY.md` 즉시 열기
2. 순서대로 따라하기 (폐기 → 재발급 → 교체)

---

## 보안 원칙

- `.env` 파일은 절대 GitHub 등 외부에 올리지 않는다
- API 키는 코드에 직접 쓰지 않고 항상 `.env`에서 불러온다
- 키를 채팅·이메일로 공유할 때는 반드시 마스킹 (`sk-or-v1-***`)

---

*이 작업공간은 Claude Code CLI와 함께 사용하도록 설정되어 있습니다.*
