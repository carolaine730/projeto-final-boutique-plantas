# Boutique Encantada 🌷

Aplicativo mobile acadêmico de uma boutique de flores e plantas, desenvolvido com **React Native**, **Expo Router**, **TypeScript**, **Context API**, **AsyncStorage** e integração com **Firebase Firestore**.

> Este repositório contém uma base funcional de demonstração. Preços e alguns dados botânicos são ilustrativos; confirme-os com a equipe antes da apresentação. O item “Pomo de adão” está marcado como espécie a confirmar porque o nome popular precisa ser validado.

## Funcionalidades implementadas

- Catálogo com busca por nome/categoria e filtros.
- Produtos em destaque e tela de detalhes com orientações de cuidado.
- Favoritos persistidos localmente com AsyncStorage.
- Sacola com inclusão, remoção e alteração de quantidade.
- Formulário de cadastro/edição de produtos com validação.
- Seleção de imagem da galeria com `expo-image-picker` (recurso nativo do aparelho).
- Context API para compartilhar catálogo, favoritos e sacola entre telas.
- Firestore: leitura em tempo real do catálogo, criação/edição/exclusão de produtos e gravação de pedidos.
- Feedback de erro/sucesso e preservação da sacola quando o pedido falha.
- Navegação com Expo Router: Bottom Tabs + Native Stack.

## Tecnologias

- Expo SDK 54 / React Native 0.81
- TypeScript
- Expo Router 6
- `@expo/vector-icons`
- AsyncStorage
- Firebase JS SDK 12 / Cloud Firestore
- Expo Image Picker

## Como executar

1. Instale Node.js LTS.
2. Extraia o projeto e abra a pasta no VS Code.
3. Execute `npm install`.
4. Copie `.env.example` para `.env`.
5. Preencha as variáveis com a configuração do aplicativo Web do Firebase (Firebase Console → Configurações do projeto → Seus apps).
6. Crie o banco Cloud Firestore no projeto Firebase.
7. Execute `npx expo start`.
8. Leia o QR code com Expo Go compatível com SDK 54 ou inicie um emulador.
9. Para verificar os tipos TypeScript, execute `npm run typecheck`.

Sem Firebase configurado, o app abre em modo demonstração com catálogo inicial e favoritos/sacola locais. Nesse modo, o checkout não simula sucesso: ele avisa que nenhum pedido foi enviado.

## Configuração do Firebase

Variáveis esperadas no `.env`:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Crie as coleções:

### `plants/{plantId}`

Campos: `name`, `scientificName`, `category`, `price` (number), `light`, `water`, `description`, `emoji`, `imageUrl` (opcional) e `featured` (opcional).

### `orders/{orderId}`

Campos: `items` (array com produto, quantidade e valores), `total`, `createdAt` (server timestamp) e `status`.

**Segurança:** não publique regras do Firestore permitindo escrita irrestrita. Para uma entrega real, restrinja a criação/edição/exclusão de produtos a usuários administradores autenticados e valide os campos no backend/regras. A autenticação Firebase Auth e a autorização de administrador ainda precisam ser configuradas pela equipe; o formulário administrativo desta versão é uma tela acadêmica sem bloqueio de login. Não use dados pessoais ou informações de clientes reais.

### Imagens

A seleção da galeria está implementada, mas nesta versão o URI escolhido é local ao dispositivo. Para que a imagem apareça em outros aparelhos, implemente upload para Firebase Storage e grave a URL de download em `imageUrl`. Até lá, use URLs hospedadas e acessíveis ou imagens locais empacotadas no app para a demonstração em equipe.

## Estrutura principal

```text
app/
  (tabs)/          # Início, favoritos, sacola e perfil
  plant/[id].tsx   # Detalhes do produto
  admin/new.tsx    # Cadastro e edição
src/
  components/      # Componentes reutilizáveis
  data/            # Catálogo inicial e tipos
  services/        # Configuração Firebase
  state/           # Context API e persistência local
  theme.ts         # Identidade visual e cores
```

## Identidade visual

- Creme: `#FFF8F0`
- Ameixa: `#552344`
- Lilás: `#EBDCF0`
- Rosa suave: `#F5DDE5`
- Branco: `#FFFFFF`
- Texto: `#30232D`

## Catálogo inicial

1. Suculenta
2. Pomo de adão (espécie a confirmar)
3. Orquídea
4. Lírio
5. Copo-de-leite
6. Tulipas
7. Costela-de-adão
8. Trepadeira (variedade a definir)
9. Peônias
10. Girassol

Os preços do catálogo são fictícios para demonstração.

## Git Flow recomendado para a equipe

```text
main
└── develop
    ├── feature/identidade-visual
    ├── feature/catalogo-produtos
    ├── feature/telas-e-navegacao
    ├── feature/firebase-pedidos
    └── feature/documentacao
```

- `main`: versão estável para entrega.
- `develop`: integração das funcionalidades.
- `feature/*`: branches de trabalho individuais.
- Abra Pull Requests de `feature/*` para `develop`, solicite revisão de outra pessoa e só então faça merge.
- Faça commits pequenos e frequentes, identificando a contribuição de cada integrante.

Exemplos:

```bash
git switch develop
git pull origin develop
git switch -c feature/identidade-visual
# faça as alterações
git add .
git commit -m "feat: aplica identidade visual da boutique"
git push -u origin feature/identidade-visual
```

## Divisão de tarefas (preencher com os nomes reais)

- Integrante 1: interface, identidade visual e telas.
- Integrante 2: catálogo, navegação, favoritos e sacola.
- Integrante 3: Firebase, formulário, testes e documentação.

Em dupla ou individual, redistribuam as tarefas e registrem as contribuições reais no histórico do Git.

## Checklist dos critérios do professor

| Critério | O que existe / o que falta validar |
|---|---|
| Arquitetura e componentização (15) | Componentes reutilizáveis, tema, dados e estado separados; revisar qualidade final em equipe. |
| Navegação e roteamento (15) | Expo Router com Bottom Tabs e Stack; testar todos os caminhos no aparelho. |
| Estados e formulários (15) | Context API, useState, AsyncStorage e validação; testar campos inválidos e válidos. |
| Firebase (15) | Firestore implementado para catálogo e pedidos; configurar projeto, regras e testar leitura/escrita reais. |
| Interface e UX (15) | Identidade visual, feedbacks e estados vazios; inserir fotos finais e testar em diferentes tamanhos. |
| Recursos nativos (10) | Galeria de fotos via Expo Image Picker; testar permissão concedida/negada em aparelho real. |
| Git Flow (10) | Fluxo documentado; equipe precisa criar branches, commits e PRs reais. |
| README e apresentação (5) | Guia incluído; adicionar integrantes, link, screenshots e vídeo final. |

## Roteiro sugerido para o vídeo (3–5 minutos)

1. Apresentar o problema, público-alvo e proposta (30 segundos).
2. Mostrar início, busca, filtros e catálogo (60 segundos).
3. Abrir detalhes, favoritar e adicionar à sacola (45 segundos).
4. Demonstrar formulário e seleção de foto da galeria (45 segundos).
5. Demonstrar leitura/escrita no Firestore e pedido salvo (45 segundos; requer Firebase configurado).
6. Mostrar estrutura, Context API, branches e Pull Requests (30 segundos).

## Pendências antes da entrega

- [ ] Confirmar o nome/espécie de “Pomo de adão” e variedade de trepadeira.
- [ ] Substituir preços demonstrativos por valores definidos pela equipe.
- [ ] Inserir fotografias finais e configurar hospedagem compartilhada (Firebase Storage, se adotado).
- [ ] Configurar Firebase e regras seguras; testar operações reais.
- [ ] Implementar autenticação/autorização administrativa se o cadastro não puder ser público.
- [ ] Testar em dispositivo/emulador e corrigir eventuais problemas.
- [ ] Preencher integrantes, link do repositório e divisão real de tarefas.
- [ ] Adicionar capturas de tela e gravar vídeo de 3 a 5 minutos.
- [ ] Comprovar Git Flow com commits e PRs reais da equipe.

## Entrega

- Repositório: **[inserir link do GitHub]**
- Integrantes: **[inserir nomes completos]**
- Vídeo: **[inserir link ou arquivo]**
