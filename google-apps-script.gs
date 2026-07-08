/**
 * Cole este arquivo em Extensões > Apps Script dentro da sua planilha.
 * Depois implante como Aplicativo da Web.
 */
const SHEET_NAME = "Leads";
const SPREADSHEET_ID = "1o8Ll6l2By7BaiO41kxKlm6j6fX7C_2v4qa9Zp_oU0MI";
const HEADERS = [
  "ID", "Data do cadastro", "Nome", "WhatsApp",
  "Aceite da privacidade", "Perfil", "Pontuações", "Respostas", "Origem", "Status"
];

function doGet() {
  return jsonResponse({ ok: true, message: "Integração do quiz ativa." });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const lead = JSON.parse((e.postData && e.postData.contents) || "{}");
    validateLead(lead);

    // Abre explicitamente a planilha correta, mesmo que o Apps Script não esteja vinculado a ela.
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
        .setValues([HEADERS])
        .setFontWeight("bold")
        .setBackground("#0758d5")
        .setFontColor("#ffffff");
    sheet.setFrozenRows(1);

    const row = [
      safeCell(lead.id),
      lead.createdAt ? new Date(lead.createdAt) : new Date(),
      safeCell(lead.studentName),
      safeCell(lead.studentWhatsapp),
      "Não solicitado",
      safeCell(lead.profile),
      JSON.stringify(lead.scores || {}),
      JSON.stringify(lead.answers || []),
      safeCell(lead.source),
      safeCell(lead.status || "Em andamento")
    ];

    // O primeiro envio cria o lead; o segundo completa a mesma linha com o resultado.
    const lastRow = sheet.getLastRow();
    const existing = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(String(lead.id)).matchEntireCell(true).findNext()
      : null;
    if (existing) sheet.getRange(existing.getRow(), 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);

    return jsonResponse({ ok: true, id: lead.id });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function validateLead(lead) {
  const required = ["studentName", "studentWhatsapp"];
  const missing = required.filter(function (field) { return !lead[field]; });
  if (missing.length) throw new Error("Campos ausentes: " + missing.join(", "));
}

// Impede que textos iniciados por =, +, - ou @ sejam interpretados como fórmulas.
function safeCell(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
