// src/agent/gemini.js
// Módulo de IA do Atlas usando a API do Gemini (REST, sem dependências extras).
// Requer Node 18+ (fetch nativo) e "type": "module" no package.json.
//
// Variáveis de ambiente (configure no Render, nunca no GitHub):
//   GEMINI_API_KEY  -> sua chave do Google AI Studio
//   GEMINI_MODEL    -> opcional, padrão "gemini-2.5-flash"

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODELO = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const INSTRUCOES_PADRAO = `Você é o atendente virtual da Tabacaria Markim, de Itapipoca, Ceará. Atende clientes pelo WhatsApp com cordialidade, clareza e mensagens curtas.

Ajude a pessoa a encontrar acessórios disponíveis no CATÁLOGO abaixo, explique diferenças entre as opções usando apenas as informações do catálogo e informe preço e disponibilidade somente quando esses dados estiverem cadastrados.

Se não encontrar uma informação no catálogo, diga que vai confirmar com a equipe. Nunca invente produtos, marcas, preços, estoque, endereço, horário, entrega ou formas de pagamento.

Antes de concluir um pedido, confirme itens, quantidades e valores registrados. Encaminhe para um funcionário quando houver dúvida, reclamação, pedido especial ou informação ausente.

Venda apenas para maiores de 18 anos: se houver indício de que o cliente é menor, não prossiga com a venda e encaminhe para a equipe.

Mantenha o atendimento natural e respeitoso. Não pressione o cliente.

Se a conversa precisar de um funcionário, termine a resposta com a marca [TRANSFERIR].`;

export function filtrarCatalogo(catalogo, texto, limite = 15) {
  if (!Array.isArray(catalogo) || catalogo.length === 0) return [];
  const termos = (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\W+/)
    .filter((t) => t.length > 2);

  if (termos.length === 0) return catalogo.slice(0, limite);

  const pontuados = catalogo.map((p) => {
    const campos = [p.nome, p.categoria, p.marca, p.descricao]
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const pontos = termos.filter((t) => campos.includes(t)).length;
    return { p, pontos };
  });

  const relevantes = pontuados
    .filter((x) => x.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite)
    .map((x) => x.p);

  return relevantes.length > 0 ? relevantes : catalogo.slice(0, limite);
}

function formatarCatalogo(produtos) {
  if (produtos.length === 0) {
    return "CATÁLOGO: vazio no momento. Não há produtos cadastrados; diga que vai confirmar com a equipe.";
  }
  const linhas = produtos.map((p) => {
    const preco = p.preco != null ? `R$ ${Number(p.preco).toFixed(2).replace(".", ",")}` : "preço a confirmar";
    const estoque = p.estoque != null ? (p.estoque > 0 ? `em estoque (${p.estoque})` : "sem estoque") : "estoque a confirmar";
    return `- ${p.nome} | ${p.categoria || "sem categoria"} | ${p.marca || "marca n/d"} | ${p.descricao || ""} | ${preco} | ${estoque}`;
  });
  return `CATÁLOGO (única fonte de verdade):\n${linhas.join("\n")}`;
}

export async function responder({ historico = [], mensagem, catalogo = [], instrucoes = INSTRUCOES_PADRAO }) {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) {
    return { texto: "Um instante, vou confirmar com a equipe e já te respondo. 🙏", transferir: true };
  }

  const relevantes = filtrarCatalogo(catalogo, mensagem);
  const sistema = `${instrucoes}\n\n${formatarCatalogo(relevantes)}`;
  const contents = [
    ...historico.slice(-12).map((m) => ({ role: m.role, parts: [{ text: m.texto }] })),
    { role: "user", parts: [{ text: mensagem }] },
  ];

  try {
    const resp = await fetch(`${API_BASE}/${MODELO}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistema }] },
        contents,
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
      }),
    });

    if (!resp.ok) {
      const erro = await resp.text();
      console.error("Erro Gemini:", resp.status, erro);
      return { texto: "Um instante, vou confirmar com a equipe e já te respondo. 🙏", transferir: true };
    }

    const dados = await resp.json();
    let texto = dados?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim() || "";
    if (!texto) {
      return { texto: "Um instante, vou confirmar com a equipe e já te respondo. 🙏", transferir: true };
    }

    const transferir = texto.includes("[TRANSFERIR]");
    texto = texto.replaceAll("[TRANSFERIR]", "").trim();
    return { texto, transferir };
  } catch (error) {
    console.error("Falha ao chamar Gemini:", error);
    return { texto: "Um instante, vou confirmar com a equipe e já te respondo. 🙏", transferir: true };
  }
}
