# Teste de Perfil de Inteligência e Carreira

Projeto estático e mobile-first para captação de leads interessados em cursos profissionalizantes.

## Publicação

Publique index.html, styles.css e script.js juntos no GitHub Pages, Netlify, Vercel ou hospedagem da instituição.

## Antes de publicar

1. Em script.js, troque teamWhatsapp pelo número oficial.
2. Em index.html, personalize a marca provisória PróximoPasso.
3. Revise a Política de Privacidade com o responsável jurídico.
4. Integre Google Sheets ou Supabase na função saveLead.
5. Adicione Meta Pixel e Google Analytics nos pontos comentados.

Até a integração externa, os leads ficam no localStorage do navegador, na chave careerQuizLeads.


## Integração com Google Sheets

1. Crie ou abra a planilha que receberá os leads.
2. Acesse **Extensões > Apps Script**.
3. Apague o conteúdo de `Código.gs` e cole todo o conteúdo de `google-apps-script.gs` deste projeto.
4. Clique em **Implantar > Nova implantação**.
5. Em **Selecionar tipo**, escolha **Aplicativo da Web**.
6. Configure **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**.
7. Clique em **Implantar**, autorize o acesso e copie a URL terminada em `/exec`.
8. Em `script.js`, coloque essa URL em `SHEETS_WEB_APP_URL`.
9. Envie um cadastro de teste. A aba **Leads** será criada automaticamente.

Ao alterar o Apps Script no futuro, use **Implantar > Gerenciar implantações > Editar > Nova versão**. Salvar o código sem criar uma nova versão não atualiza a integração publicada.
