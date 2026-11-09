export async function sendWhatsAppMessage(to, body) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    console.warn("Credenciais do WhatsApp ausentes; resposta não enviada.");
    return;
  }
  const version = process.env.WHATSAPP_API_VERSION || "v21.0";
  const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body }
    })
  });
  if (!response.ok) throw new Error(`WhatsApp API ${response.status}: ${await response.text()}`);
  return response.json();
}
