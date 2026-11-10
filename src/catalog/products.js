import { query } from "../db/database.js";

// Catálogo vazio até a loja cadastrar informações reais e verificadas.
export async function listAvailableProducts() {
  if (!process.env.DATABASE_URL) return [];
  const result = await query(
    "SELECT id, name, category, description, brand, model, price_cents, stock_quantity FROM products WHERE active = TRUE AND stock_quantity > 0 ORDER BY name"
  );
  return result.rows.map((p) => ({
    id: p.id,
    nome: p.name,
    categoria: p.category || p.model || "",
    marca: p.brand || "",
    descricao: p.description || "",
    preco: (p.price_cents / 100).toFixed(2),
    estoque: p.stock_quantity,
  }));
}

export async function findProductById(id) {
  const result = await query("SELECT * FROM products WHERE id = $1 AND active = TRUE", [id]);
  return result.rows[0] ?? null;
}
