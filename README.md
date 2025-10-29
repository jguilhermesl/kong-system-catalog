# Kong Games Catalog

Catálogo de jogos PS4/PS5 com mídia digital.

## 🚀 Funcionalidades

- ✨ Banner rotativo com imagens dos jogos
- 🎮 Catálogo completo de jogos
- 🔍 Busca de jogos em tempo real
- 📂 Navegação por categorias
- 💰 Seções especiais: Imperdíveis e Ofertas
- 📱 Design responsivo
- 🎨 Interface moderna com Tailwind CSS
- ⚡ Carrossel de jogos com Swiper

## 🛠️ Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Query (TanStack Query)
- React Router DOM
- Swiper
- Axios
- Lucide React (ícones)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de configuração
cp .env.example .env
```

## 🔧 Configuração

Edite o arquivo `.env` para configurar a URL da API:

```env
VITE_API_URL=http://localhost:3001
```

## 🚀 Executar

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── api/              # Chamadas à API
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes de UI
│   └── GameCard.tsx # Card de jogo
├── constants/        # Constantes da aplicação
├── hooks/           # Custom hooks
├── models/          # Tipos TypeScript
├── pages/           # Páginas da aplicação
│   ├── GamesPage.tsx
│   ├── CategoryPage.tsx
│   └── AllGamesPage.tsx
├── utils/           # Funções utilitárias
├── App.tsx          # Componente principal
├── main.tsx         # Entry point
└── index.css        # Estilos globais
```

## 🎯 Rotas

- `/` - Página principal com catálogo completo
- `/category?category=...` - Jogos por categoria
- `/all-games?type=...` - Listagem completa (all, promo, unmissable)

## 📝 API

A aplicação espera as seguintes rotas da API:

### GET /api/games

Parâmetros de query:
- `search` - Termo de busca
- `category` - Filtro por categoria
- `price` - Filtro por faixa de preço
- `console` - Filtro por console (PS4/PS5)

Resposta esperada:
```json
{
  "data": [...],
  "promoGames": [...],
  "unmissableGames": [...]
}
```

### Estrutura do Game

```typescript
{
  id: string;
  game: string;
  gameVersion: string;
  category: string;
  imageLink: string;
  primaryValue: string;
  secondaryValue: string;
  originalPrice?: string;
  console?: string;
  status?: string;
}
```

## 🎨 Customização

### Cores

As cores principais podem ser alteradas no `tailwind.config.js`:

```js
colors: {
  primary: 'rgb(255, 136, 0)',
}
```

### Mock Data

Durante desenvolvimento, a aplicação usa dados mock quando a API não está disponível. Os dados podem ser encontrados em `src/api/games.ts`.

## 📄 Licença

Este projeto é privado e pertence à Kong Games.
