# Arquitetura inicial

1. WhatsApp Cloud API envia eventos para `GET/POST /api/whatsapp/webhook`.
2. Camada do agente aplica as instruções em `src/agent/instructions.js`.
3. Catálogo em `src/catalog/products.js` é a única fonte de produtos e disponibilidade.
4. Pedidos são criados como rascunhos e aguardam validação humana.

## Limitações conhecidas do MVP
- Catálogo vazio até a loja fornecer os dados reais.
- Pedidos armazenados apenas em memória; reiniciar o servidor apaga os registros.
- Webhook recebe eventos, mas ainda não envia respostas automáticas.
- Integração com modelo de IA, banco de dados e WhatsApp Cloud API ainda precisa ser configurada.
