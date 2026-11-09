import { agentInstructions } from "./instructions.js";

export async function replyToCustomer(message, products) {
  if (!process.env.OPENAI_API_KEY) {
    return "Obrigado pela mensagem! 😊 Vou encaminhar seu atendimento para nossa equipe confirmar as informações.";
  }
  const input = [
    { role: "system", content: agentInstructions },
    { role: "system", content: "CATÁLOGO ATUAL (fonte única de produtos): " + JSON.stringify(products) },
    { role: "user", content: message }
  ];
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input,
      max_output_tokens: 250
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("OpenAI API error:", response.status, detail);
    return "Recebi sua mensagem! 😊 Nossa equipe vai continuar seu atendimento em instantes.";
  }
  const data = await response.json();
  const answer = (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text)
    .join("\n")
    .trim();
  return answer || "Obrigado pela mensagem! 😊 Vou encaminhar seu atendimento para nossa equipe.";
}
