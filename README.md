# 🌿 Fibrarte — Catálogo Oficial de Artesanato

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://fibrarte-catalogo.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

Catálogo digital interativo e Progressive Web App (PWA) desenvolvido para a **Fibrarte**, destacando peças sustentáveis e artesanais produzidas com fibra de bananeira. O aplicativo conecta diretamente clientes e artesãs através de pedidos integrados ao WhatsApp e conta com um painel de gestão simplificado em tempo real.

🔗 **Acesse o catálogo online:** [fibrarte-catalogo.vercel.app](https://fibrarte-catalogo.vercel.app)

---

## ✨ Principais Funcionalidades

- **🛍️ Vitrine Digital Intuitiva:** Exibição elegante das peças artesanais com fotos em alta definição, preços por tamanho (P/M/G) e descrições detalhadas.
- **💬 Pedidos em 1 Clique via WhatsApp:** O cliente clica em "Fazer Pedido no WhatsApp" e é direcionado para a conversa já com a mensagem pré-formatada contendo o nome da peça, especificações e valor.
- **🔒 Painel de Gestão Protegido:** Acesso restrito para a equipe de artesãs via senha administrativa (`?modo=gestao`), sem expor credenciais na vitrine pública.
- **✏️ Gestão Completa de Produtos:** Cadastro ágil com captura de foto via câmera ou upload da galeria, edição de preços/detalhes e exclusão segura com confirmação em duas etapas.
- **☁️ Sincronização em Nuvem (Firebase Firestore):** Qualquer produto adicionado ou editado é refletido instantaneamente em todos os celulares e computadores conectados.
- **📱 PWA & Modo Offline:** Aplicativo instalável na tela inicial do celular (Android e iOS) com cache local persistente para navegação rápida e resiliente a quedas de conexão.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 18](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Banco de Dados & Nuvem:** [Firebase Firestore Web SDK](https://firebase.google.com/docs/firestore)
- **Hospedagem & CI/CD:** [Vercel](https://vercel.com/)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Gerenciador de pacotes `npm`

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/krlos01ac-web/Fibrartecatalogo.git
   cd Fibrartecatalogo
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo de exemplo para `.env`:
   ```bash
   cp .env.example .env
   ```
   Preencha os valores das credenciais do Firebase e a senha de gestão (veja a tabela abaixo).

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O projeto estará acessível em `http://localhost:5173`.

5. **Para gerar a versão de produção:**
   ```bash
   npm run build
   ```

---

## 🔐 Variáveis de Ambiente

As credenciais do projeto são protegidas e nunca são versionadas no Git. Configure as seguintes chaves em seu arquivo `.env` ou no painel da plataforma de hospedagem:

| Variável | Descrição |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Chave de API pública do projeto Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação do Firebase (`*.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto no Firebase Console |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de armazenamento do Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID de remetente para Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | Identificador do Web App no Firebase |
| `VITE_ADMIN_PASSWORD` | Senha administrativa para acesso ao painel de gestão |

Consulte o arquivo [`.env.example`](.env.example) para o modelo pronto.

---

## 🔒 Segurança e Boas Práticas

- **Histórico Blindado:** Repositório auditado com zero credenciais ou chaves sensíveis commitadas no histórico.
- **Isolamento de Credenciais:** As chaves de API e senhas são gerenciadas estritamente via variáveis de ambiente seguras.
- **Restrição de Domínio:** A chave de API do Firebase possui restrição de *HTTP Referrers* no Google Cloud Console, aceitando exclusivamente requisições do domínio oficial e de desenvolvimento local.

---

## 📄 Licença

Este projeto é desenvolvido para o catálogo da **Fibrarte**. Todos os direitos reservados.
