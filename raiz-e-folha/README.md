# Raiz & Folha 🌿

> Boutique de plantas em React Native: encontre a planta certa para o seu ambiente e a sua rotina, com orientações de luz e rega.

Projeto Final da disciplina **Programação para Dispositivos Móveis** (IESB), desenvolvido com **Expo + React Native + Expo Router + Firebase Firestore**.

---

## Sumário

1. [Sobre o projeto](#sobre-o-projeto)
2. [Funcionalidades](#funcionalidades)
3. [Capturas de tela](#capturas-de-tela)
4. [Tecnologias](#tecnologias)
5. [Requisitos da disciplina atendidos](#requisitos-da-disciplina-atendidos)
6. [Estrutura do projeto](#estrutura-do-projeto)
7. [Como executar](#como-executar)
8. [Configuração do Firebase](#configuração-do-firebase)
9. [Modelo de dados](#modelo-de-dados)
10. [Modo demonstração (sem Firebase)](#modo-demonstração-sem-firebase)
11. [Fluxo de Git (Git Flow)](#fluxo-de-git-git-flow)
12. [Integrantes e divisão de tarefas](#integrantes-e-divisão-de-tarefas)
13. [Limitações conhecidas e próximos passos](#limitações-conhecidas-e-próximos-passos)
14. [Entrega](#entrega)

---

## Sobre o projeto

**Problema:** quem quer ter plantas em casa costuma não saber qual espécie combina com a luz do ambiente, com o tempo disponível para cuidar e com a presença de pets.

**Solução:** o Raiz & Folha reúne um catálogo de plantas com busca, categorias por estilo (fáceis de cuidar, tropicais, pendentes, pet friendly) e uma ficha de cuidados (luz e rega) em cada planta. O usuário salva favoritas, monta uma sacola e registra o pedido. A boutique cadastra, edita e remove produtos pelo próprio app.

**Público-alvo:** iniciantes em jardinagem doméstica, moradores de apartamento e pessoas que buscam plantas seguras para pets.

---

## Funcionalidades

- **Catálogo** com busca por nome/categoria e filtro por categorias (chips).
- **Detalhes da planta** com descrição, preço e orientações de **luz** e **rega**.
- **Favoritos** (coração) com tela própria; persistem no aparelho.
- **Sacola** com ajuste de quantidade, total em tempo real e persistência local.
- **Finalização de pedido**, gravado na coleção `orders` do Firestore.
- **Cadastro e edição de planta** em formulário validado, com **foto escolhida da galeria**.
- **Remoção** de produto pela tela de detalhes, com confirmação antes de apagar.
- **Catálogo em tempo real** via Firestore (`onSnapshot`): alterações aparecem sem recarregar o app.
- **Indicador de conexão** na aba Perfil (Firebase conectado ou modo demonstração).

---

## Capturas de tela

> Adicione as imagens na pasta `docs/screenshots/` com estes nomes (ou ajuste os caminhos abaixo).

| Início | Detalhes | Favoritos |
|:---:|:---:|:---:|
| ![Início](docs/screenshots/home.png) | ![Detalhes](docs/screenshots/details.png) | ![Favoritos](docs/screenshots/favorites.png) |

| Sacola | Cadastro de planta | Perfil |
|:---:|:---:|:---:|
| ![Sacola](docs/screenshots/cart.png) | ![Cadastro](docs/screenshots/form.png) | ![Perfil](docs/screenshots/profile.png) |

---

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | Expo SDK 54, React Native 0.81, React 19 |
| Linguagem | TypeScript |
| Navegação | Expo Router 6 (Stack + Bottom Tabs + modal) |
| Estado global | Context API + hooks (`StoreProvider` / `useStore`) |
| Persistência local | `@react-native-async-storage/async-storage` |
| Backend NoSQL | Firebase Firestore (SDK Web `firebase` 12) |
| Recurso nativo | `expo-image-picker` (galeria de fotos) |
| Ícones | `@expo/vector-icons` (Ionicons) |

---

## Requisitos da disciplina atendidos

| Requisito | Como foi atendido | Onde ver |
|---|---|---|
| Componentização e Flexbox | Componente reutilizável `PlantCard`, tema de cores centralizado, grids e cartões com `flexDirection`, `flexWrap` e `justifyContent` | `src/components/PlantCard.tsx`, `src/theme.ts` |
| UI/UX com feedback | Indicador de carregamento do catálogo, mensagens de erro no formulário, `Alert` de sucesso/erro, confirmação antes de remover, botões com estado de carregamento ("Salvando...", "Registrando pedido..."), estados vazios (busca sem resultado, favoritos e sacola vazios) | `app/(tabs)/index.tsx`, `app/admin/new.tsx`, `app/(tabs)/cart.tsx`, `app/plant/[id].tsx` |
| Navegação com múltiplos navegadores | **Stack** raiz contendo **Bottom Tabs** (Início, Favoritos, Sacola, Perfil), tela de detalhes `plant/[id]` (rota dinâmica) e formulário `admin/new` em **modal** | `app/_layout.tsx`, `app/(tabs)/_layout.tsx` |
| Estado local | `useState` nos formulários, busca e categoria selecionada; `useMemo` para filtragem | `app/(tabs)/index.tsx`, `app/admin/new.tsx` |
| Estado global | Context API com plantas, favoritos, sacola e ações (`toggleFavorite`, `addToCart`, `changeQty`, `savePlant`, `removePlant`, `placeOrder`) | `src/state/Store.tsx` |
| Formulário com validação | Nome (mín. 2 caracteres), preço numérico maior que zero (aceita vírgula), descrição (mín. 10 caracteres), luz e rega obrigatórias, categoria por seletor | `app/admin/new.tsx` |
| Recurso nativo | Seleção de imagem da galeria com `expo-image-picker` (permissão descrita em `app.json`) | `app/admin/new.tsx` |
| Ícones vetoriais | Ionicons na barra de abas, nos corações de favorito, na sacola e na ficha de cuidados | `app/(tabs)/_layout.tsx`, `src/components/PlantCard.tsx`, `app/plant/[id].tsx` |
| Firebase (NoSQL) | Leitura em tempo real, criação, edição e remoção em `plants`; criação de documentos em `orders` | `src/services/firebase.ts`, `src/state/Store.tsx` |
| Git Flow | `main`, `develop` e branches `feature/*` com Pull Requests | [Fluxo de Git](#fluxo-de-git-git-flow) |

---

## Estrutura do projeto

```text
raiz-e-folha/
├── app/                      # Rotas (Expo Router)
│   ├── _layout.tsx           # Stack raiz + StoreProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom Tabs
│   │   ├── index.tsx         # Início: busca, categorias e catálogo
│   │   ├── favorites.tsx     # Favoritos
│   │   ├── cart.tsx          # Sacola e finalização do pedido
│   │   └── profile.tsx       # Perfil, status da conexão e área da boutique
│   ├── plant/[id].tsx        # Detalhes da planta (rota dinâmica)
│   └── admin/new.tsx         # Cadastro/edição de planta (modal)
├── src/
│   ├── components/PlantCard.tsx
│   ├── data/plants.ts        # Tipo Plant e catálogo de demonstração
│   ├── services/firebase.ts  # Inicialização do Firebase/Firestore
│   ├── state/Store.tsx       # Contexto global (estado + persistência)
│   └── theme.ts              # Paleta de cores
├── app.json
├── package.json
├── .env.example
└── README.md
```

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- Git
- App **Expo Go** no celular (Android/iOS) **ou** um emulador Android/iOS configurado

### Passo a passo

```bash
# 1. Clone o repositório
git clone <URL-DO-REPOSITÓRIO>
cd raiz-e-folha

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de variáveis de ambiente
cp .env.example .env        # no Windows (PowerShell): copy .env.example .env

# 4. Preencha o .env com as chaves do seu app Firebase Web
#    (veja a seção "Configuração do Firebase")

# 5. Inicie o Expo
npx expo start
```

Depois, escaneie o QR code com o Expo Go (Android) ou com a câmera (iOS). Para emulador, pressione `a` (Android) ou `i` (iOS) no terminal.

> **Importante:** sempre que alterar o `.env`, reinicie o servidor com `npx expo start -c` para limpar o cache.

---

## Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um projeto.
2. Em **Visão geral do projeto**, adicione um app **Web** (`</>`) e copie os valores de configuração.
3. Em **Build → Firestore Database**, clique em **Criar banco de dados** (modo de teste para desenvolvimento).
4. Preencha o `.env` com os valores copiados:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

5. Em **Firestore → Regras**, use estas regras **apenas para teste/demonstração** (o app ainda não usa Firebase Auth):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /plants/{plantId} {
      allow read, write: if true;
    }
    match /orders/{orderId} {
      allow create: if true;   // o app só grava pedidos
      allow read, update, delete: if false;
    }
  }
}
```

> ⚠️ Essas regras permitem escrita pública em `plants`. Não use em produção. Para produção, adicione Firebase Auth e restrinja a escrita aos administradores.

**Segurança:** as variáveis `EXPO_PUBLIC_*` são configurações do app Web e ficam embutidas no aplicativo. Nunca coloque credenciais de *service account* no projeto. O arquivo `.env` está no `.gitignore` e **não** deve ser commitado; use o `.env.example` como modelo.

---

## Modelo de dados

### Coleção `plants/{id}`

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome popular |
| `scientificName` | string | Nome científico |
| `category` | string | `Fáceis de cuidar`, `Tropicais`, `Pendentes` ou `Pet friendly` |
| `price` | number | Preço em reais |
| `description` | string | Descrição do produto |
| `light` | string | Orientação de luz |
| `water` | string | Orientação de rega |
| `emoji` | string | Emoji exibido quando não há foto |
| `imageUrl` | string (opcional) | Foto escolhida na galeria |

### Coleção `orders/{id}`

| Campo | Tipo | Descrição |
|---|---|---|
| `items` | array | Lista de `{ plantId, plantName, qty }` |
| `createdAt` | timestamp | Data do pedido (`serverTimestamp`) |
| `status` | string | Inicia como `recebido` |

### Armazenamento local (AsyncStorage)

| Chave | Conteúdo |
|---|---|
| `@rf/favorites` | Lista de ids favoritados |
| `@rf/cart` | Mapa `id → quantidade` |

---

## Modo demonstração (sem Firebase)

Se o `.env` não estiver configurado, o app abre normalmente em **modo demonstração**:

- exibe um catálogo de 6 plantas embutido no código;
- favoritos e sacola continuam persistindo no aparelho;
- cadastro, edição e remoção funcionam apenas em memória (somem ao reiniciar o app);
- finalizar pedido exibe o aviso "Pedido simulado" e **não grava nada na nuvem**.

A aba **Perfil** mostra `○ Modo demonstração` ou `● Firebase conectado`.

Com o Firebase configurado, o catálogo passa a vir do Firestore. Se a coleção `plants` estiver vazia, o app continua exibindo o catálogo de demonstração; ao cadastrar a primeira planta, o catálogo passa a mostrar somente as plantas que estão no Firestore.

---

## Fluxo de Git (Git Flow)

```text
main                      ← versão estável/demonstrável
└── develop               ← integração das funcionalidades
    ├── feature/catalogo-e-navegacao
    ├── feature/favoritos-sacola
    ├── feature/firebase-crud
    └── feature/formulario-galeria-readme
```

**Regras da equipe**

1. Nunca commitar direto em `main` ou `develop`.
2. Cada funcionalidade nasce em `feature/<nome>` a partir de `develop`.
3. Ao concluir, abrir **Pull Request** para `develop` e solicitar revisão de outro integrante.
4. Só fazer merge após aprovação.
5. `main` recebe `develop` apenas em versões demonstráveis.
6. Commits pequenos e frequentes, seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

**Comandos úteis**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-funcionalidade

git add .
git commit -m "feat: adiciona busca por categoria"
git push -u origin feature/nome-da-funcionalidade
# abrir o Pull Request no GitHub: feature/... → develop
```

**Prefixos de commit:** `feat` (nova funcionalidade), `fix` (correção), `docs` (documentação), `style` (visual), `refactor` (refatoração), `chore` (configuração).

---

## Integrantes e divisão de tarefas

| Integrante | Responsabilidades | Branches |
|---|---|---|
| Thiago Gonçalves de Medeiros | ⚠️ *ajuste conforme a divisão real* | ⚠️ *preencher* |
| ⚠️ *Nome completo (se houver)* | ⚠️ *preencher* | ⚠️ *preencher* |
| ⚠️ *Nome completo (se houver)* | ⚠️ *preencher* | ⚠️ *preencher* |

**Sugestão de divisão para equipe de 3**

- **Integrante 1:** catálogo, busca, categorias, detalhes e navegação.
- **Integrante 2:** Firebase, CRUD de produtos e registro de pedidos.
- **Integrante 3:** formulário, validação, galeria, interface e README.

*Em dupla, combinar as tarefas 1 e 3 e dividir Firebase/integração. Em trabalho individual, seguir as etapas em sequência, mantendo uma branch por funcionalidade. Apague as linhas não usadas da tabela.*

---

## Limitações conhecidas e próximos passos

- **Fotos locais:** a imagem escolhida na galeria é salva como caminho do aparelho. Outros dispositivos não a veem. Próximo passo: enviar a foto ao **Firebase Storage** e gravar a URL de download em `imageUrl`.
- **Sem autenticação:** qualquer pessoa com o app pode editar ou remover produtos. Próximo passo: **Firebase Auth** com perfil de administrador e regras de segurança por usuário.
- **Pedidos sem pagamento:** o pedido apenas registra os itens; pagamento e entrega são combinados diretamente com a boutique.
- **Favoritos e sacola locais:** ficam no aparelho e não sincronizam entre dispositivos.

---

## Entrega

- **Repositório:** ⚠️ *adicionar o link do GitHub/GitLab (público ou com acesso liberado ao professor)*
- **Vídeo demonstrativo (3 a 5 min):** ⚠️ *adicionar o link*

### Roteiro sugerido para o vídeo

| Tempo | Conteúdo |
|---|---|
| 0:00–0:30 | Problema, público-alvo e proposta do app |
| 0:30–1:30 | Catálogo, busca, categorias e detalhes com cuidados |
| 1:30–2:15 | Favoritar e adicionar à sacola; alterar quantidade e conferir o total |
| 2:15–3:00 | Cadastrar planta com foto da galeria e validação; ver o catálogo atualizar |
| 3:00–3:30 | Finalizar pedido e mostrar o documento no Firestore |
| 3:30–4:30 | Código: componentes, Context, Firestore, branches e Pull Requests |

---

Feito com 🌱 para a disciplina de Programação para Dispositivos Móveis, IESB.
