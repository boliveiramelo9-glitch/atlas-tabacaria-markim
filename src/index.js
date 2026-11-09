import "dotenv/config";
import express from "express";
import { agentInstructions } from "./agent/instructions.js";
import { listAvailableProducts } from "./catalog/products.js";
import { createDraftOrder, listOrders } from "./orders/orders.js";
import { whatsappRouter } from "./whatsapp/webhook.js";

const app = express();
app.use(express.json());
app.use("/api/whatsapp", whatsappRouter);

app.get("/", (_req, res) => {
  res.json({ name: "Atlas — Tabacaria Markim", status: "online", version: "1.0.0" });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/catalog", (_req, res) => res.json({ products: listAvailableProducts() }));
app.get("/api/agent/instructions", (_req, res) => res.json({ instructions: agentInstructions }));
app.get("/api/orders", (_req, res) => res.json({ orders: listOrders() }));
app.post("/api/orders", (req, res) => {
  try {
    const order = createDraftOrder(req.body.items);
    return res.status(201).json({ order, message: "Pedido registrado como rascunho; aguarda validação da equipe." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Atlas iniciado na porta ${port}`));
