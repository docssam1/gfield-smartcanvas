/**
 * G-FIELD Smart Canvas Apps Script Web App
 *
 * Security notes:
 * - Do not store API keys in frontend.
 * - Do not return API keys in responses.
 * - Do not store student personal information.
 * - Save outputs only to approved Drive folder.
 *
 * TODO (future):
 * - Gemini OCR via server-side key (PropertiesService)
 * - Gemini Video Understanding via server-side key
 * - OpenAI verification via server-side key
 */

var DRIVE_FOLDER_ID = "1yeo05ciw-xELhaKfqu62JCPrgZwrCdCO";

function doPost(e) {
  var startedAt = new Date().getTime();
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return _jsonResponse(false, null, [], ["INVALID_PAYLOAD"], startedAt);
    }
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var payload = body.payload || {};

    if (!action) {
      return _jsonResponse(false, null, [], ["INVALID_PAYLOAD"], startedAt);
    }

    if (action === "testConnection") {
      var writable = _checkWritePermission_();
      return _jsonResponse(true, {
        success: true,
        folderId: DRIVE_FOLDER_ID,
        folderName: _getTargetFolder_().getName(),
        serverTime: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
        driveWritePermission: writable,
        lastSavedFileName: _getLastSavedFileName_(),
        message: "connection ok"
      }, [], [], startedAt);
    }
    if (action === "saveProjectJson") {
      var jsonText = String(payload.jsonText || "");
      if (!jsonText) return _jsonResponse(false, null, [], ["INVALID_PAYLOAD"], startedAt);
      var fileName = _tsPrefix_() + "_project.json";
      var file = _getTargetFolder_().createFile(fileName, jsonText, MimeType.PLAIN_TEXT);
      _setLastSavedFileName_(file.getName());
      return _jsonResponse(true, { fileId: file.getId(), fileName: file.getName() }, [], [], startedAt);
    }
    if (action === "saveHtmlSnapshot") {
      var htmlText = String(payload.htmlText || "");
      if (!htmlText) return _jsonResponse(false, null, [], ["INVALID_PAYLOAD"], startedAt);
      var snapshotName = _tsPrefix_() + "_snapshot.html";
      var snap = _getTargetFolder_().createFile(snapshotName, htmlText, MimeType.HTML);
      _setLastSavedFileName_(snap.getName());
      return _jsonResponse(true, { fileId: snap.getId(), fileName: snap.getName() }, [], [], startedAt);
    }
    if (action === "savePdfBase64") {
      var pdfB64 = String(payload.base64 || "");
      if (!pdfB64) return _jsonResponse(false, null, [], ["INVALID_PAYLOAD"], startedAt);
      var pdfBytes = Utilities.base64Decode(pdfB64);
      var pdfBlob = Utilities.newBlob(pdfBytes, "application/pdf", _tsPrefix_() + "_output.pdf");
      var pdf = _getTargetFolder_().createFile(pdfBlob);
      _setLastSavedFileName_(pdf.getName());
      return _jsonResponse(true, { fileId: pdf.getId(), fileName: pdf.getName() }, [], [], startedAt);
    }
    if (action === "saveImageBase64") {
      var imageB64 = String(payload.base64 || "");
      var mimeType = String(payload.mimeType || "image/png");
      if (!imageB64) return _jsonResponse(false, null, [], ["INVALID_PAYLOAD"], startedAt);
      var ext = _extFromMime_(mimeType);
      var imgBytes = Utilities.base64Decode(imageB64);
      var imgBlob = Utilities.newBlob(imgBytes, mimeType, _tsPrefix_() + "_image." + ext);
      var img = _getTargetFolder_().createFile(imgBlob);
      _setLastSavedFileName_(img.getName());
      return _jsonResponse(true, { fileId: img.getId(), fileName: img.getName() }, [], [], startedAt);
    }

    return _jsonResponse(false, null, [], ["INVALID_PAYLOAD"], startedAt);
  } catch (err) {
    return _jsonResponse(false, null, [String(err)], ["UNKNOWN_ERROR"], startedAt);
  }
}

function _getTargetFolder_() {
  return DriveApp.getFolderById(DRIVE_FOLDER_ID);
}

function _tsPrefix_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
}

function _extFromMime_(mimeType) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  return "png";
}
function _setLastSavedFileName_(name) {
  PropertiesService.getScriptProperties().setProperty("LAST_SAVED_FILE_NAME", String(name || ""));
}
function _getLastSavedFileName_() {
  return PropertiesService.getScriptProperties().getProperty("LAST_SAVED_FILE_NAME") || "";
}
function _checkWritePermission_() {
  try {
    var folder = _getTargetFolder_();
    var probeName = "_write_probe_" + new Date().getTime() + ".txt";
    var probe = folder.createFile(probeName, "probe", MimeType.PLAIN_TEXT);
    probe.setTrashed(true);
    return true;
  } catch (_e) {
    return false;
  }
}

function _jsonResponse(ok, data, warnings, errors, startedAt) {
  var elapsed = new Date().getTime() - startedAt;
  var payload = {
    ok: !!ok,
    data: data || {},
    warnings: warnings || [],
    errors: errors || [],
    engine: "apps-script",
    elapsedMs: elapsed
  };
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
