# 📊 Configuração de Analytics - Kong Games Catalog

## ✅ Implementação Concluída

Sistema de análise de acessos implementado usando **Google Analytics 4** - a solução mais rápida e eficiente para rastreamento.

---

## 🚀 Como Configurar

### 1. Criar uma Propriedade Google Analytics 4

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma nova propriedade ou use uma existente
3. Copie o **ID de Medição** (formato: `G-XXXXXXXXXX`)

### 2. Configurar Variável de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto `kong-games-catalog`:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Substitua** `G-XXXXXXXXXX` pelo seu ID de medição real.

### 3. Atualizar o HTML

Abra o arquivo `index.html` e **substitua** o placeholder:

```html
<!-- Encontre esta linha: -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

<!-- E substitua G-XXXXXXXXXX pelo seu ID real -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SEU_ID_AQUI"></script>
```

### 4. Rodar o Projeto

```bash
cd kong-games-catalog
yarn install
yarn dev
```

---

## 📈 O Que Está Sendo Rastreado

### Eventos Automáticos

✅ **Page Views** - Todas as navegações entre páginas  
✅ **Visualizações de Jogos** - Quando um usuário abre a página de detalhes  
✅ **Cliques em Jogos** - Quando um usuário clica em um card de jogo  
✅ **Adicionar ao Carrinho** - Com informações do jogo e tipo de conta  
✅ **Favoritos** - Quando adiciona ou remove dos favoritos  
✅ **Login** - Quando o usuário faz login

### Dados Capturados

Para cada evento, são capturados:
- **ID do Jogo**
- **Nome do Jogo**
- **Categoria**
- **Preço** (quando aplicável)
- **Tipo de Conta** (Primária/Secundária)
- **URL da Página**
- **Timestamp**

---

## 📊 Visualizando os Dados

### No Google Analytics

1. Acesse sua propriedade no GA4
2. Navegue para **Relatórios > Eventos**
3. Você verá eventos como:
   - `page_view`
   - `view_item`
   - `select_item`
   - `add_to_cart`
   - `add_to_wishlist`
   - `remove_from_wishlist`
   - `login`

### Principais Métricas Disponíveis

- 👥 **Usuários ativos**
- 📄 **Páginas mais visitadas**
- 🎮 **Jogos mais visualizados**
- 🛒 **Taxa de conversão (visualização → carrinho)**
- ⭐ **Jogos mais favoritados**
- 💰 **Valor médio por transação**
- 📱 **Dispositivos usados (mobile/desktop)**
- 🌍 **Localização geográfica dos usuários**

---

## 🔧 Arquivos Modificados

### Novos Arquivos
- ✅ `src/utils/analytics.ts` - Funções de rastreamento

### Arquivos Atualizados
- ✅ `src/App.tsx` - Rastreamento de navegação
- ✅ `index.html` - Script do Google Analytics
- ✅ `src/pages/GameDetailsPage.tsx` - Visualizações de jogos
- ✅ `src/components/GameCard.tsx` - Cliques em jogos
- ✅ `src/components/cart/AddToCartModal.tsx` - Adicionar ao carrinho
- ✅ `src/contexts/AuthContext.tsx` - Login
- ✅ `src/contexts/FavoritesContext.tsx` - Favoritos

---

## 🎯 Próximos Passos Recomendados

### 1. Configurar Conversões no GA4
- Marque `add_to_cart` como conversão
- Configure metas de engajamento

### 2. Criar Relatórios Personalizados
- Top 10 jogos mais visualizados
- Taxa de conversão por categoria
- Funil de compra completo

### 3. Configurar Alertas
- Queda súbita de tráfego
- Picos de erro
- Metas de conversão

### 4. Integrar com Google Tag Manager (Opcional)
- Para rastreamento mais avançado sem modificar código
- Testes A/B
- Eventos customizados dinâmicos

---

## 🆘 Troubleshooting

### Analytics não está funcionando?

1. **Verifique o console do browser**
   ```javascript
   // No console do navegador, teste:
   window.gtag
   // Deve retornar a função gtag, não undefined
   ```

2. **Verifique as variáveis de ambiente**
   ```bash
   # Reinicie o servidor após adicionar o .env
   yarn dev
   ```

3. **Verifique o ID no HTML**
   - O ID deve ser o mesmo no `.env` e no `index.html`

4. **Use o Google Analytics DebugView**
   - Acesse sua propriedade GA4 → Configure → DebugView
   - Veja eventos em tempo real

### Eventos não aparecem no GA4?

- Pode levar **24-48 horas** para aparecer nos relatórios principais
- Use **DebugView** para ver eventos em tempo real
- Verifique se está usando o modo de desenvolvimento

---

## 📚 Documentação Adicional

- [Google Analytics 4 - Documentação Oficial](https://support.google.com/analytics/answer/9306384)
- [GA4 Events Reference](https://support.google.com/analytics/answer/9267735)
- [Measurement Protocol (GA4)](https://developers.google.com/analytics/devguides/collection/protocol/ga4)

---

## 💡 Benefícios da Implementação

✅ **Rápida** - Setup em minutos  
✅ **Gratuita** - Até 10 milhões de eventos/mês  
✅ **Completa** - Todos os dados importantes rastreados  
✅ **Insights Poderosos** - Entenda o comportamento dos usuários  
✅ **Otimização** - Tome decisões baseadas em dados  
✅ **Sem Infraestrutura** - Não precisa de backend adicional

---

**Criado em:** 04/12/2025  
**Desenvolvido para:** Kong Games Catalog
