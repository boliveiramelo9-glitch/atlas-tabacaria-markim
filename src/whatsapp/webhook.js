import { Router } from "express";
import { listAvailableProducts } from "../catalog/products.js";
import { replyToCustomer } from "../agent/openai.js";
import { sendWhatsAppMessage } from "./send.js";

export const whatsappRouter = Router();

whatsappRouter.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

whatsappRouter.post("/webhook", async (req, res) => {
  // Confirma recebimento à Meta; o processamento ocorre em seguida.
  res.sendStatus(200);
  try {
    const entries = req.body?.entry ?? [];
    for (const entry of entries) {
      for (const change of entry.changes ?? []) {
        const value = change.value ?? {};
        for (const message of value.messages ?? []) {
          if (message.type !== "text" || !message.from || !message.text?.body) continue;
          const products = await listAvailableProducts();
          const answer = await replyToCustomer(message.text.body, products);
          await sendWhatsAppMessage(message.from, answer);
        }
      }
    }
  } catch (error) {
    console.error("Falha ao processar mensagem do WhatsApp:", error);
  }
});
