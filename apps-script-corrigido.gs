function doPost(e) {
  try {
    const planilha = SpreadsheetApp.getActiveSheet();
    
    // Pega os dados enviados
    let dados;
    if (e.postData && e.postData.contents) {
      dados = JSON.parse(e.postData.contents);
    } else {
      return ContentService.createTextOutput(JSON.stringify({sucesso: false, erro: "Sem dados"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Adiciona uma nova linha com os dados
    planilha.appendRow([
      dados.id || "",
      dados.createdAt || "",
      dados.studentName || "",
      dados.age || "",
      dados.studentWhatsapp || "",
      dados.city || "",
      dados.schoolGrade || "",
      dados.guardianName || "",
      dados.guardianWhatsapp || "",
      dados.profile || "",
      dados.profileKey || "",
      JSON.stringify(dados.scores || {})
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({sucesso: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(erro) {
    return ContentService.createTextOutput(JSON.stringify({sucesso: false, erro: erro.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
