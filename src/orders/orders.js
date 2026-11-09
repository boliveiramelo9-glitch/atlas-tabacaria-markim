import { query } from "../db/database.js";

export async function createDraftOrder(items, customerPhone = null) {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Informe pelo menos um item.");
  if (!process.env.DATABASE_URL) throw new Error("Banco de dados não configurado.");
  const result = await query(
    "INSERT INTO orders (customer_phone, status, items) VALUES ($1, 'aguardando_validacao_humana', $2) RETURNING id, customer_phone, status, items, created_at",
    [customerPhone, JSON.stringify(items)]
  );
  return result.rows[0];
}

export async function listOrders() {
  if (!process.env.DATABASE_URL) return [];
  const result = await query("SELECT id, customer_phone, status, items, created_at FROM orders ORDER BY created_at DESC LIMIT 100");
  return result.rows;
}
