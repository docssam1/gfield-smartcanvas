# APPS_SCRIPT_API_CONTRACT

## 1. 목적

- GitHub Pages 프론트에서 Gemini/OpenAI를 직접 호출하지 않는다.
- Google Apps Script가 API 중계 서버 역할을 수행한다.

## 2. 엔드포인트

- `POST` only
- `Content-Type: application/json`

## 3. Request 공통 형식

```json
{
  "action": "recognizeProblem",
  "payload": {},
  "clientVersion": "exam-mode-v0.1"
}
```

## 4. Response 공통 형식

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

## 5. Action 목록

- `recognizeProblem`
- `generateSimilarSet`
- `verifyProblem`
- `verifySolution`
- `verifyOutput`
- `analyzeSolutionReference`

## 6. 에러 코드

- `MISSING_IMAGE`
- `INVALID_PAYLOAD`
- `API_TIMEOUT`
- `AI_PARSE_FAILED`
- `FORBIDDEN_SOLUTION_METHOD`
- `LAYOUT_CHECK_FAILED`
- `UNKNOWN_ERROR`

## 7. 보안 원칙

- API Key는 Apps Script `PropertiesService`에 저장한다.
- 프론트로 API Key를 반환하지 않는다.
- 학생 개인정보는 전송하지 않는다.
- 문제 원본/산출물(PDF, JSON, 이미지)은 Google Drive에 저장한다.
- GitHub에는 코드와 정적 assets만 저장한다.

## 8. TODO

- Gemini OCR 연결
- Gemini Video Understanding 연결
- OpenAI 검증 연결
- 요청 제한/사용량 제한
- 로그 저장 정책
