# 🚨 비상 보안 매뉴얼

> 키가 노출되었거나 의심될 때 이 순서를 따르세요.

---

## 즉시 대응 순서

### 1단계 — 노출된 키 확인
어떤 서비스의 키가 노출되었는지 먼저 파악하세요:
- **OpenRouter API 키** (`sk-or-v1-...`)
- **Oracle 서버 SSH 키** (`~/.ssh/oracle-server.key`)
- **WordPress 비밀번호 또는 DB 키**
- **기타 API 키**

### 2단계 — 즉시 폐기
| 서비스 | 폐기 방법 |
|--------|-----------|
| OpenRouter | https://openrouter.ai → Settings → API Keys → 해당 키 삭제 |
| Oracle Cloud | Oracle Cloud Console → Identity → API Keys → 삭제 |
| WordPress | 관리자 패널 → 설정 → 비밀번호 변경 |

### 3단계 — 새 키 재발급
폐기 직후 동일한 서비스에서 새 키를 발급받으세요.

### 4단계 — 환경변수 교체
```bash
# .env 파일 열기 (절대 공유 금지)
# nano ~/claude-workspace/.env
# 또는
# code ~/claude-workspace/.env
```
기존 키 값을 새 키로 교체하고 저장.

### 5단계 — 사용 이력 확인
- OpenRouter: https://openrouter.ai → Usage 탭
- Oracle: Oracle Cloud Console → Audit 로그
- GitHub 등 코드 저장소에 키가 커밋된 경우: `git log -p | grep "sk-"` 로 확인

### 6단계 — 재발생 방지
- `.gitignore`에 `.env` 포함 여부 확인
- 코드에 하드코딩된 키 없는지 확인: `grep -r "sk-" ./`

---

## 예방 규칙

- `.env` 파일은 절대 git에 커밋하지 않는다
- API 키는 항상 환경변수로만 사용한다
- 로그·채팅에 키를 붙여넣지 않는다
- 키를 공유해야 할 경우 마스킹(`sk-or-v1-***`)해서 전달

---

*마지막 업데이트: 2026-06-16*
