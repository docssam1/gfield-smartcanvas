# Apps Script Web App Draft

This folder contains a draft Google Apps Script backend for Drive output saving.

## Files

- `Code.gs`: `doPost(e)` action router for Drive save operations

## Supported Actions

- `testConnection`
- `saveProjectJson`
- `saveHtmlSnapshot`
- `savePdfBase64`
- `saveImageBase64`

## Fixed Drive Folder

- `1yeo05ciw-xELhaKfqu62JCPrgZwrCdCO`

## Response Contract

All responses follow:

```json
{
  "ok": true,
  "data": {},
  "warnings": [],
  "errors": [],
  "engine": "apps-script",
  "elapsedMs": 123
}
```

## Deploy Steps

1. Open [script.new](https://script.new).
2. Paste `Code.gs`.
3. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone (or your allowed scope)
4. Copy Web App URL.
5. Put URL into `index.html` UI field: `Apps Script Web App URL`.

## Security Rules

- Do not store API keys in frontend.
- Do not return API keys in API response.
- Do not store student personal information.
- Save outputs to approved Drive folder only.

## TODO

- Gemini OCR server-side integration
- Gemini Video Understanding server-side integration
- OpenAI verification server-side integration
- Request rate limit / quota policy
- Logging policy
