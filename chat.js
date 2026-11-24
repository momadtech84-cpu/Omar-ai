export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const expectedPassword = process.env.OMAR_ACCESS_PASSWORD;
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-6.2-astra";

  if (!expectedPassword || !apiKey) {
    return res.status(503).json({
      error: "Configuração incompleta: falta definir OMAR_ACCESS_PASSWORD e OPENAI_API_KEY nas variáveis do projeto."
    });
  }

  const suppliedPassword = req.headers["x-omar-password"];
  if (!suppliedPassword || suppliedPassword !== expectedPassword) {
    return res.status(401).json({ error: "Palavra-passe incorreta." });
  }

  const { message, history = [] } = req.body || {};
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Escreve uma mensagem." });
  }

  const safeHistory = Array.isArray(history)
    ? history.slice(-12).filter(item =>
        item &&
        ["user", "assistant"].includes(item.role) &&
        typeof item.content === "string"
      ).map(item => ({ role: item.role, content: item.content.slice(0, 6000) }))
    : [];

  const instructions = [
    "O teu nome é OMAR AI.",
    "És um assistente privado, útil, rigoroso e orientado para resolver problemas difíceis.",
    "Responde em português claro, salvo se o utilizador pedir outro idioma.",
    "Quando a tarefa for complexa, divide-a em etapas, identifica dependências e verifica pressupostos.",
    "Não afirmes que executaste, publicaste, pesquisaste ou testaste algo se não o fizeste.",
    "Quando não tiveres uma ferramenta necessária, explica a limitação e dá o próximo passo concreto.",
    "Nunca peças ao utilizador para revelar palavras-passe, chaves API ou códigos secretos no chat.",
    "Para ações externas, pagamentos, publicação ou eliminação de dados, pede confirmação antes de agir."
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        instructions,
        input: [...safeHistory, { role: "user", content: message }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "O serviço de IA não conseguiu responder."
      });
    }

    let answer = data.output_text;
    if (!answer && Array.isArray(data.output)) {
      answer = data.output
        .filter(item => item.type === "message")
        .flatMap(item => item.content || [])
        .filter(part => part.type === "output_text")
        .map(part => part.text)
        .join("\n");
    }

    return res.status(200).json({
      answer: answer || "A IA não devolveu texto nesta resposta."
    });
  } catch (error) {
    return res.status(500).json({ error: "Falha de ligação. Verifica a internet e tenta novamente." });
  }
}
