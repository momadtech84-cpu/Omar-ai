# OMAR AI — versão 1

Primeira versão: painel privado com conversa via OpenAI Responses API e histórico local no navegador.

## Publicar pelo Android
1. Cria uma conta no GitHub e um repositório privado chamado `omar-ai`.
2. Envia todos os ficheiros desta pasta para o repositório, mantendo `api/` e `public/`.
3. Em Vercel, importa o repositório GitHub e faz Deploy.
4. Em Vercel > Settings > Environment Variables, adiciona:
   - `OPENAI_API_KEY` = a tua chave secreta da API OpenAI
   - `OMAR_ACCESS_PASSWORD` = cria uma palavra-passe longa e única
   - `OPENAI_MODEL` = `gpt-6.2-astra` (ou outro modelo disponível na tua conta API)
5. Faz Redeploy para aplicar as variáveis.

## Segurança
- Nunca coloques a chave API no HTML, GitHub ou numa mensagem.
- Mantém o repositório privado.
- A autenticação desta versão protege a API com uma palavra-passe partilhada; antes de uso público ou com dados sensíveis, acrescenta autenticação individual, rate limiting e armazenamento seguro de sessões.
- A chave API e a utilização do modelo podem gerar custos separados da subscrição ChatGPT.

## Limites da versão 1
Esta versão conversa e mantém histórico no navegador. Ainda não executa comandos no computador, não cria ficheiros autonomamente, não pesquisa a web e não publica projetos por si. Essas capacidades serão adicionadas por etapas com ferramentas controladas e confirmação para ações sensíveis.
