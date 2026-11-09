// MVP em memória: os pedidos são perdidos ao reiniciar o servidor.
// Persistência em banco de dados será adicionada na próxima etapa.
const orders = [];

export function createDraftOrder(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Informe pelo menos um item.");
  }
  const order = {
    id: `PED-${Date.now()}`,
    status: "aguardando_validacao_humana",
    items,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  return order;
}

export function listOrders() {
  return [...orders];
}
