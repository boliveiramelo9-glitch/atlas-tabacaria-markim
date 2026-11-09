# Atlas — Tabacaria Markim

MVP de atendimento e registro de pedidos via WhatsApp para uma tabacaria em Itapipoca (CE), focado em acessórios cadastrados pela loja.

## Princípios
- Não inventar produtos, marcas, preços, estoque ou políticas da loja.
- O catálogo começa vazio e só recebe dados confirmados.
- Pedidos são rascunhos até validação da equipe.
- Dúvidas e informações ausentes devem ser encaminhadas a uma pessoa.

## Requisitos
- Node.js 20 ou superior

## Executar localmente
```bash
npm install
cp .env.example .env
npm run dev
```
Abra `http://localhost:3000`.

## Endpoints iniciais
- `GET /` — status do serviço
- `GET /api/health` — verificação de saúde
- `GET /api/catalog` — produtos ativos e disponíveis
- `GET /api/agent/instructions` — instruções do atendente
- `GET /api/orders` — pedidos em memória
- `POST /api/orders` — cria rascunho de pedido
- `GET /api/whatsapp/webhook` — verificação do webhook
- `POST /api/whatsapp/webhook` — recebimento de eventos

## Catálogo
Edite `src/catalog/products.js` somente com dados fornecidos e confirmados pela loja. Exemplo de estrutura (não é um produto real):
```js
{
  id: "codigo-interno",
  name: "Nome confirmado pela loja",
  description: "Descrição confirmada",
  brand: "Marca confirmada",
  model: "Modelo confirmado",
  price: 0,
  available: true,
  active: true
}
```

## Próximas etapas
1. Cadastrar catálogo real.
2. Escolher e configurar banco de dados persistente.
3. Conectar WhatsApp Cloud API e implementar respostas.
4. Integrar o modelo de IA com consulta obrigatória ao catálogo.
5. Criar painel simples para equipe atualizar produtos, estoque e pedidos.
6. Configurar deploy no Render e variáveis secretas.

## Segurança
Nunca envie `.env`, tokens, chaves ou credenciais ao GitHub. Use variáveis de ambiente no ambiente de deploy.
