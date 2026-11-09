import "dotenv/config";
import express from "express";
import { agentInstructions } from "./agent/instructions.js";
import { listAvailableProducts } from "./catalog/products.js";
import { createDraftOrder, listOrders } from "./orders/orders.js";
import { initDatabase, databaseReady } from "./db/database.js";
import { whatsappRouter } from "./whatsapp/webhook.js";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use("/api/whatsapp", whatsappRouter);

app.get("/", (_req, res) => {
  res.json({ name: "Atlas — Tabacaria Markim", status: "online", version: "1.1.0" });
});

app.get("/api/health", async (_req, res) => {
  res.json({ status: "ok", database: databaseReady() ? "connected" : "not_configured" });
});
app.get("/api/catalog", async (_req, res, next) => {
  try { res.json({ products: await listAvailableProducts() }); } catch (error) { next(error); }
});
app.get("/api/agent/instructions", (_req, res) => res.json({ instructions: agentInstructions }));
app.get("/api/orders", async (_req, res, next) => {
  try { res.json({ orders: await listOrders() }); } catch (error) { next(error); }
});
app.post("/api/orders", async (req, res, next) => {
  try {
    const order = await createDraftOrder(req.body.items, req.body.customerPhone);
    res.status(201).json({ order, message: "Pedido registrado como rascunho; aguarda validação da equipe." });
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Erro interno. A equipe deve verificar os logs." });
});

const port = Number(process.env.PORT || 3000);
await initDatabase();
app.listen(port, () => console.log(`Atlas iniciado na porta ${port}`));
