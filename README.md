# G-FIELD Smart Canvas

## 운영 기준 확정

- GitHub Repository: [docssam1/gfield-smartcanvas](https://github.com/docssam1/gfield-smartcanvas)
- Repository full name: `docssam1/gfield-smartcanvas`
- GitHub Pages 예상 URL: [https://docssam1.github.io/gfield-smartcanvas/](https://docssam1.github.io/gfield-smartcanvas/)
- Google Drive 저장 폴더 ID: `1Hrc4hS-xlTmBHb1ruhVEGtd7IX6IKIO7`

지필드 영재교육 강사용 시험지/교재 제작 도구입니다. 현재 운영 우선순위는 **시험지 모드**이며, `index.html` 하나로 GitHub Pages에서 정적 실행될 수 있게 유지합니다.

## 현재 운영 구조

- GitHub: 코드, 문서, 정적 assets만 보관합니다.
- GitHub Pages: `index.html`을 정적 페이지로 배포합니다.
- Google Drive: 생성된 PDF, JSON, 이미지 산출물을 저장하는 기본 저장소로 사용합니다.
- 서버: 당장 사용하지 않습니다. 고정 IP가 필요한 외부 API 중계, 알리고 같은 외부 서비스 연결이 필요할 때만 보류된 중계 서버로 사용합니다.
- AI/OCR: 현재는 Mock 어댑터로 동작합니다. 나중에 OpenAI/Gemini API Adapter로 교체할 수 있게 함수 구조만 분리되어 있습니다.

## 정적 실행 기준

필수 파일:

- `index.html`
- `assets/logo-gfield-transparent.png`

브라우저에서 `index.html`을 직접 열거나, GitHub Pages로 배포해서 실행할 수 있습니다. 현재 시험지 모드의 핵심 흐름은 클라이언트 단독 실행을 기준으로 유지합니다.

## 폴더 기준

### `assets/`

정적 배포에 필요한 공개 assets만 둡니다.

- 로고
- 배경 없는 이미지
- GitHub Pages에서 공개되어도 되는 UI 리소스

API Key, 학생 개인정보, 생성된 시험지 PDF, 프로젝트 JSON, 업로드 원본 이미지는 넣지 않습니다.

### `archive/`

작업 중 백업과 이전 버전 참고 파일만 둡니다.

- 예: `index.backup.html`
- 운영 배포 기준 파일은 항상 루트의 `index.html`입니다.

archive 안의 파일은 GitHub Pages 진입 파일로 사용하지 않습니다.

### `exports/`

생성 산출물 임시 폴더입니다. GitHub에는 올리지 않습니다. PDF/JSON/이미지 산출물은 Google Drive 4TB 저장소를 우선 사용합니다.

## GitHub Pages 배포 기준

1. GitHub 저장소에 `index.html`, `assets/`, 문서 파일을 올립니다.
2. 저장소 Settings → Pages로 이동합니다.
3. Source를 `Deploy from a branch`로 설정합니다.
4. Branch는 보통 `main`, Folder는 `/root`를 선택합니다.
5. 배포 URL에서 `index.html`이 바로 열리는지 확인합니다.

주의:

- GitHub Pages는 정적 호스팅입니다.
- 브라우저에 API Key를 넣는 구조는 안전하지 않습니다.
- 실제 AI/OCR 호출이 필요하면 고정 IP 서버나 Apps Script 같은 중계 계층을 별도로 둡니다.

## 보안 원칙

- 실제 API Key는 GitHub에 저장하지 않습니다.
- `.env`, `.env.local`, `secrets.json`, `*.key`, `*.pem`은 커밋하지 않습니다.
- 학생 개인정보를 GitHub 저장소나 GitHub Pages에 저장하지 않습니다.
- 생성 PDF/JSON/이미지 산출물은 GitHub가 아니라 Google Drive에 저장합니다.
- 프로젝트 JSON 저장 시 API Key 실제 값은 저장하지 않고, 설정 여부만 기록합니다.
- `index.html`, JSON, localStorage 어디에도 API Key를 영구 저장하지 않습니다.
- 실제 AI 호출은 프론트 직접 호출을 금지하고 `apiClient.request()` 단일 경로로만 연결합니다.

## AI/OCR 연결 TODO

현재 `index.html`에는 아래 어댑터 구조가 있습니다.

- `apiClient.request(action, payload)`
- `aiAdapter.recognizeProblem()`
- `aiAdapter.generateSimilarSet()`
- `aiAdapter.verifyProblem()`
- `aiAdapter.verifySolution()`
- `aiAdapter.verifyOutput()`
- `mockAdapter.*`

지금은 `aiAdapter`가 `apiClient.request()`를 거쳐 `mockAdapter`로 위임됩니다. 실제 연결 단계에서는 `apiClient`를 Apps Script 또는 고정 IP 서버 중계로 바꾸고, API Key는 GitHub Pages 안에 저장하지 않고 중계 계층으로만 전달해야 합니다.
유튜브 자동 분석은 현재 비활성이고, 추후 중계 서버에서 Gemini Video Understanding으로 처리할 예정입니다.

## 현재 집중 범위

시험지 모드:

- 시험지 헤더
- 2단/전면 레이아웃
- 이미지 업로드 → 문제 인식 → 개선 원문항 → 유사문항 세트 생성
- 문제 검증 / 풀이 검증 / 출력 검증
- 손글씨 풀이 페이지
- PDF 출력
- JSON 저장/불러오기

보류:

- 교재 모드
- 오답노트 고급 기능
- Drive/API 실제 연동
- 외부 서버 중계

## API 중계 계약 초안

상세 문서:
- [Apps Script API Contract](docs/APPS_SCRIPT_API_CONTRACT.md)
- [Access Gate QA](docs/ACCESS_GATE_QA.md)

액션 목록(고정):

- `recognizeProblem`
- `generateSimilarSet`
- `verifyProblem`
- `verifySolution`
- `verifyOutput`
- `analyzeSolutionReference`

공통 response 형식:

```json
{
  "ok": true,
  "data": {},
  "warnings": [],
  "errors": [],
  "engine": "mock|gemini|openai|hybrid",
  "elapsedMs": 123
}
```

에러 코드 기준:

- `MISSING_IMAGE`
- `INVALID_PAYLOAD`
- `API_TIMEOUT`
- `AI_PARSE_FAILED`
- `FORBIDDEN_SOLUTION_METHOD`
- `LAYOUT_CHECK_FAILED`
- `UNKNOWN_ERROR`

보안 운영 원칙:

- 프론트는 API Key를 `index.html`, JSON, localStorage, GitHub에 저장하지 않습니다.
- 실제 AI 호출은 프론트 직접 호출을 금지하고 `apiClient.request()` 경유로만 처리합니다.
- API Key는 중계 서버 환경변수 또는 Apps Script `PropertiesService`에만 저장합니다.

현재 상태:

- 실제 `fetch` 호출은 아직 연결하지 않았습니다.
- 현재는 `apiClient.request()`가 mock 어댑터 결과를 공통 response 형식으로 감싸서 반환합니다.

## 배포 전 체크리스트

- [ ] 1. `index.html` 단독 실행 확인
- [ ] 2. JS syntax OK 확인
- [ ] 3. `assets/logo-gfield-transparent.png` 존재 확인
- [ ] 4. `docs/APPS_SCRIPT_API_CONTRACT.md` 존재 확인
- [ ] 5. `.gitignore`에 `exports/`, `tmp_*`, PDF, key류 제외 확인
- [ ] 6. API Key가 `index.html`/JSON/localStorage에 저장되지 않음 확인
- [ ] 7. 실제 `fetch` 호출 없음 확인
- [ ] 8. `?debug=1` 외 디버그 UI 숨김 확인
- [ ] 9. 시험지 모드 기본 흐름 확인
- [ ] 10. PDF 출력 전 하드 게이트 작동 확인
