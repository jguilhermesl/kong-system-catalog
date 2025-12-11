/* eslint-disable @typescript-eslint/no-explicit-any */
// Sistema de Analytics Próprio - Kong Games
// Eventos são enviados para nossa API backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
const ANALYTICS_ENDPOINT = `${API_URL}/analytics/event`;
const SOURCE = 'CATALOG';
const SESSION_STORAGE_KEY = 'kong_analytics_session_id';

// Gerar um identificador único de sessão/dispositivo
const generateSessionId = (): string => {
  // Tentar recuperar sessionId existente do localStorage
  const existingSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  
  if (existingSessionId) {
    return existingSessionId;
  }
  
  // Gerar novo sessionId baseado em características do dispositivo
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  // Criar hash simples do fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Adicionar timestamp e número aleatório para garantir unicidade
  const uniqueId = `${Math.abs(hash)}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  // Salvar no localStorage
  localStorage.setItem(SESSION_STORAGE_KEY, uniqueId);
  
  return uniqueId;
};

// Obter sessionId atual (será o mesmo para o mesmo dispositivo)
const getSessionId = (): string => {
  return generateSessionId();
};

// Queue local para eventos
interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  source: string;
  page?: string;
  referer?: string;
  sessionId?: string;
}

const eventQueue: AnalyticsEvent[] = [];
let isProcessingQueue = false;

// Processar queue de eventos
const processQueue = async () => {
  if (isProcessingQueue || eventQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    if (event) {
      try {
        await fetch(ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
      } catch (error) {
        console.error('Failed to send analytics event:', error);
        // Se falhar, recoloca na fila (máximo 3 tentativas)
        if (!event.eventData?.retries || event.eventData.retries < 3) {
          eventQueue.push({
            ...event,
            eventData: {
              ...event.eventData,
              retries: (event.eventData?.retries || 0) + 1,
            },
          });
        }
      }
    }

    // Pequeno delay entre requisições
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  isProcessingQueue = false;
};

// Adicionar evento na queue
const queueEvent = (event: AnalyticsEvent) => {
  // Adicionar sessionId a todos os eventos
  const eventWithSession = {
    ...event,
    sessionId: getSessionId(),
  };
  
  eventQueue.push(eventWithSession);
  processQueue();
};

// Obter informações da página atual
const getPageInfo = () => {
  return {
    page: window.location.pathname,
    referer: document.referrer || undefined,
  };
};

// Envia evento de pageview
export const trackPageView = (url: string, title?: string) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'PAGE_VIEW',
    eventData: {
      url,
      title: title || document.title,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

// Eventos customizados genéricos
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: eventName,
    eventData: eventParams,
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

// Eventos específicos do e-commerce
export const trackGameView = (game: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'GAME_VIEW',
    eventData: {
      id: game.id,
      name: game.name,
      category: game.category,
      price: game.price,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

export const trackAddToCart = (game: {
  id: string;
  name: string;
  category?: string;
  price: number;
  accountType: string;
}) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'ADD_TO_CART',
    eventData: {
      id: game.id,
      name: game.name,
      category: game.category,
      price: game.price,
      accountType: game.accountType,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

export const trackSearch = (searchTerm: string) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'SEARCH',
    eventData: {
      searchTerm,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

export const trackCategoryView = (category: string) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'CATEGORY_VIEW',
    eventData: {
      category,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

export const trackGameClick = (game: {
  id: string;
  name: string;
  category?: string;
  position?: number;
}) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'GAME_CLICK',
    eventData: {
      id: game.id,
      name: game.name,
      category: game.category,
      position: game.position,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

export const trackFavoriteToggle = (game: {
  id: string;
  name: string;
  added: boolean;
}) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: game.added ? 'FAVORITE_ADDED' : 'FAVORITE_REMOVED',
    eventData: {
      id: game.id,
      name: game.name,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

export const trackLogin = (method: string) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'LOGIN',
    eventData: {
      method,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

export const trackSignUp = (method: string) => {
  const pageInfo = getPageInfo();
  
  queueEvent({
    eventType: 'SIGN_UP',
    eventData: {
      method,
    },
    source: SOURCE,
    page: pageInfo.page,
    referer: pageInfo.referer,
  });
};

// Funções de compatibilidade (não usadas mais, mas mantidas por compatibilidade)
export const isGALoaded = (): boolean => {
  return false;
};

export const GA_MEASUREMENT_ID = '';
