import pg from "pg";
const { Pool } = pg;

let pool;
export function databaseReady() { return Boolean(pool); }

export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL ausente: banco não inicializado. Configure no ambiente de deploy.");
    return;
  }
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      description TEXT,
      brand TEXT,
      model TEXT,
      price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
      stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      customer_phone TEXT,
      status TEXT NOT NULL DEFAULT 'aguardando_validacao_humana',
      items JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log("PostgreSQL conectado e estrutura verificada.");
}

export async function query(text, params = []) {
  if (!pool) throw new Error("Banco de dados não configurado.");
  return pool.query(text, params);
}
