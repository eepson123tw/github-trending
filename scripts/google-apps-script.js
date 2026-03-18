/**
 * Google Apps Script — deploy as Web App
 *
 * Steps:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this code (replace Code.gs content)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the URL and set it as APPS_SCRIPT_URL in .env.local
 */

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var datePattern = /^\d{4}-\d{2}-\d{2}$/;
  var result = {};

  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var name = sheet.getName();

    // Only process sheets named as dates (YYYY-MM-DD)
    if (!datePattern.test(name)) continue;

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) continue; // skip empty or header-only

    // Find column indices from header row
    var headers = data[0].map(function (h) {
      return String(h).trim().toLowerCase();
    });
    var colTitle = headers.indexOf("title");
    var colAuthor = headers.indexOf("author");
    var colDesc = headers.indexOf("description");
    var colUrl = headers.indexOf("url");

    // Fallback: assume order [title, author, repository, url, created_at, description]
    if (colTitle === -1) colTitle = 0;
    if (colAuthor === -1) colAuthor = 1;
    if (colUrl === -1) colUrl = 3;
    if (colDesc === -1) colDesc = 5;

    var repos = [];
    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var title = String(row[colTitle] || "").trim();
      var author = String(row[colAuthor] || "").trim();
      var description = String(row[colDesc] || "").trim();
      var url = String(row[colUrl] || "").trim();

      if (!author && !url) continue; // skip empty rows

      repos.push({
        title: title,
        author: author,
        description: description,
        url: url,
      });
    }

    if (repos.length > 0) {
      result[name] = repos;
    }
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}
