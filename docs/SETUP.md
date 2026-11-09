# Configuração das integrações

## Variáveis de ambiente
Configure no Render (Environment), nunca no Git:
- `DATABASE_URL`: URL interna/externa do PostgreSQL.
- `DB_SSL=true`: use quando o provedor exigir SSL.
- `OPENAI_API_KEY`: chave da API OpenAI.
- `OPENAI_MODEL=gpt-4.1-mini`: modelo de atendimento.
- `WHATSAPP_VERIFY_TOKEN`: segredo aleatório escolhido por você.
- `WHATSAPP_ACCESS_TOKEN`: token da Meta WhatsApp Cloud API.
- `WHATSAPP_PHONE_NUMBER_ID`: ID do número de telefone na Meta.
- `WHATSAPP_API_VERSION`: versão Graph API ativa na sua aplicação (opcional).
- `STORE_NAME=Tabacaria Markim`
- `CITY=Itapipoca`
- `STATE=CE`

## Render
Crie um PostgreSQL no Render e um Web Service conectado a este repositório.
Build command: `npm install`
Start command: `npm start`
Adicione as variáveis de ambiente acima no painel do serviço.

## Meta WhatsApp Cloud API
No app Meta for Developers, configure o produto WhatsApp e o webhook:
- Callback URL: `https://SEU-SERVICO.onrender.com/api/whatsapp/webhook`
- Verify token: o mesmo valor de `WHATSAPP_VERIFY_TOKEN`
- Assine o campo `messages`.
- Copie o Phone Number ID e um token de acesso válido para as variáveis do Render.

## OpenAI
Crie uma chave de API na plataforma OpenAI e salve como `OPENAI_API_KEY` no Render. A chave da API é separada da assinatura do ChatGPT.

## Segurança e limitações desta versão
- Não publique segredos no repositório nem os envie pelo chat.
- Catálogo permanece vazio até cadastro de produtos reais.
- Pedidos são sempre rascunhos para validação humana.
- O webhook atual trata mensagens de texto recebidas. Áudio, imagens, templates, histórico de conversa, assinatura HMAC, deduplicação e painel administrativo ainda precisam ser implementados antes de uma operação comercial robusta.
