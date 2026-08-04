# Neon Flow Intranet 🚀

Salve! Esse é o repositório principal da intranet da Neon Flow. O projeto é dividido em duas partes: um backend em Node.js (com Express e Prisma) e um frontend em React (usando Vite, Tailwind v4 e Radix UI). 

Aqui você vai encontrar tudo o que precisa pra rodar o projeto na sua máquina ou subir num servidor.

## 🛠️ Tecnologias usadas

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- Multer (pra upload de arquivos)
- Nodemailer (envio de emails)

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Radix UI (componentes acessíveis e bonitos)
- React Query & React Router
- Lucide React (ícones)

---

## ⚙️ Pré-requisitos

Antes de começar, garante que você tem instalado na sua máquina:
- Node.js (recomendo a versão LTS mais recente)
- NPM ou Yarn
- PM2 (opcional, mas recomendado pra rodar em background. Instale com `npm install -g pm2`)

Você também vai precisar configurar as variáveis de ambiente. Tem os exemplos nos arquivos `.env.example` (se tiverem criados). Basicamente, o backend precisa da URL do banco de dados pro Prisma e o frontend pode precisar da URL da API.

---

## 🏃 Como rodar o projeto localmente

O jeito mais fácil de rodar tudo de uma vez é usando o PM2, mas você também pode rodar separadamente.

### 1. Instalando as dependências

Primeiro, instala as dependências dos dois lados. No terminal, na raiz do projeto:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configurando o Banco de Dados (Backend)

No backend, a gente usa o Prisma. Então precisa rodar as migrations e gerar o client:

```bash
cd backend
npx prisma generate
npx prisma db push
```
*(Se tiver um script de seed pra popular o banco, pode rodar `npm run prisma:seed` ou `npx prisma db seed`)*

### 3. Rodando a aplicação

**Opção A: Usando PM2 (Recomendado)**

A gente tem um arquivo `ecosystem.config.js` configurado na raiz do projeto pra rodar o backend e o frontend juntos. Na raiz do projeto, roda:

```bash
pm2 start ecosystem.config.js
```
Pra ver os logs, é só dar um `pm2 logs` ou `pm2 list` pra ver o status.

**Opção B: Rodando manualmente (em abas separadas do terminal)**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

---

## 📦 Scripts úteis (Frontend)

Se precisar fazer build do frontend pra produção:
- `npm run build`: Gera a pasta `dist` pronta pra produção.
- `npm run preview`: Sobe um servidor local pra testar a build gerada.

---

## 💡 Dicas e Solução de problemas

- **O pm2 sumiu ou a aplicação caiu:** Roda `pm2 list` pra ver se o daemon tá ativo. Se não tiver nada, roda `pm2 start ecosystem.config.js` de novo na raiz do projeto e depois `pm2 save` pra salvar a sessão.
- **Erro no Prisma:** Lembra de sempre rodar `npx prisma generate` se você mudar alguma coisa no `schema.prisma`.

## 🤝 Contribuindo

Se for mexer em alguma coisa, cria uma branch nova com o nome da feature (`feature/minha-feature`) e manda um Pull Request detalhando o que foi feito.

Qualquer dúvida, é só dar um grito!
