/**
 * Cole este arquivo em Extensões > Apps Script dentro da sua planilha.
 * Depois implante como Aplicativo da Web.
 */
const SHEET_NAME = "Leads";
const HEADERS = [
  "ID", "Data do cadastro", "Nome do aluno", "Idade", "WhatsApp do aluno",
  "Cidade", "Escola / série", "Nome do responsável", "WhatsApp do responsável",
  "Aceite da privacidade", "Perfil", "Pontuações", "Respostas", "Origem"
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

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight("bold")
        .setBackground("#0758d5")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      safeCell(lead.id),
      lead.createdAt ? new Date(lead.createdAt) : new Date(),
      safeCell(lead.studentName),
      safeCell(lead.age),
      safeCell(lead.studentWhatsapp),
      safeCell(lead.city),
      safeCell(lead.schoolGrade),
      safeCell(lead.guardianName),
      safeCell(lead.guardianWhatsapp),
      lead.privacyAccepted === true ? "Sim" : "Não",
      safeCell(lead.profile),
      JSON.stringify(lead.scores || {}),
      JSON.stringify(lead.answers || []),
      safeCell(lead.source)
    ]);

    return jsonResponse({ ok: true, id: lead.id });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function validateLead(lead) {
  const required = ["studentName", "age", "studentWhatsapp", "city", "schoolGrade", "guardianName", "guardianWhatsapp", "profile"];
  const missing = required.filter(function (field) { return !lead[field]; });
  if (missing.length) throw new Error("Campos ausentes: " + missing.join(", "));
  if (lead.privacyAccepted !== true) throw new Error("Política de privacidade não aceita.");
}

// Impede que textos iniciados por =, +, - ou @ sejam interpretados como fórmulas.
function safeCell(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
