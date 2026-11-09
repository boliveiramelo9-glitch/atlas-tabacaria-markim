import { Router } from "express";

export const whatsappRouter = Router();

whatsappRouter.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

whatsappRouter.post("/webhook", (req, res) => {
  // Recebe eventos da WhatsApp Cloud API. O processamento e a resposta
  // automática serão ligados após configurar credenciais e regras da loja.
  console.log("Evento recebido do WhatsApp:", JSON.stringify(req.body));
  return res.sendStatus(200);
});
