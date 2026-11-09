# Atlas — Tabacaria Markim

MVP de atendimento com IA e WhatsApp para a Tabacaria Markim, em Itapipoca (CE).

## O que já está preparado
- API Node.js/Express.
- PostgreSQL para catálogo e pedidos persistentes.
- Integração com OpenAI Responses API.
- Webhook de recebimento e envio de mensagens de texto pela WhatsApp Cloud API.
- Pedidos registrados como rascunhos aguardando validação humana.
- Catálogo vazio até a loja cadastrar dados reais.

## Rodar localmente
Requer Node.js 20+ e PostgreSQL.
```bash
npm install
cp .env.example .env
# preencha as variáveis no arquivo .env local
npm run dev
```

## Configurar em produção
Siga o guia completo em [docs/SETUP.md](docs/SETUP.md). Configure as chaves e tokens diretamente no painel de variáveis do Render, nunca no GitHub.

## Endpoints
- `GET /` — status
- `GET /api/health` — saúde e estado da conexão com banco
- `GET /api/catalog` — catálogo ativo com estoque
- `GET /api/orders` — últimos pedidos
- `POST /api/orders` — cria pedido como rascunho
- `GET /api/whatsapp/webhook` — verificação Meta
- `POST /api/whatsapp/webhook` — recebe mensagens do WhatsApp

## Limitações antes de operar
O webhook processa apenas mensagens de texto. Ainda faltam histórico de conversas, deduplicação de eventos, validação HMAC da assinatura Meta, suporte a áudio/imagens, painel de gestão e testes de carga/segurança. Faça testes controlados antes de divulgar o número aos clientes.
