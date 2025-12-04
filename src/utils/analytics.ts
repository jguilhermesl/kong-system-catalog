// Google Analytics 4 Integration
// Para usar: Adicione seu ID do Google Analytics na variável GA_MEASUREMENT_ID

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Verifica se o Google Analytics está carregado
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag !== 'undefined';
};

// Envia evento de pageview
export const trackPageView = (url: string, title?: string) => {
  if (isGALoaded() && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// Eventos customizados
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (isGALoaded() && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, eventParams);
  }
};

// Eventos específicos do e-commerce
export const trackGameView = (game: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  trackEvent('view_item', {
    currency: 'BRL',
    value: game.price || 0,
    items: [
      {
        item_id: game.id,
        item_name: game.name,
        item_category: game.category || 'N/A',
        price: game.price || 0,
      },
    ],
  });
};

export const trackAddToCart = (game: {
  id: string;
  name: string;
  category?: string;
  price: number;
  accountType: string;
}) => {
  trackEvent('add_to_cart', {
    currency: 'BRL',
    value: game.price,
    items: [
      {
        item_id: game.id,
        item_name: game.name,
        item_category: game.category || 'N/A',
        item_variant: game.accountType,
        price: game.price,
        quantity: 1,
      },
    ],
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

export const trackCategoryView = (category: string) => {
  trackEvent('view_item_list', {
    item_list_name: category,
    item_list_id: category.toLowerCase().replace(/\s+/g, '_'),
  });
};

export const trackGameClick = (game: {
  id: string;
  name: string;
  category?: string;
  position?: number;
}) => {
  trackEvent('select_item', {
    items: [
      {
        item_id: game.id,
        item_name: game.name,
        item_category: game.category || 'N/A',
        index: game.position || 0,
      },
    ],
  });
};

export const trackFavoriteToggle = (game: {
  id: string;
  name: string;
  added: boolean;
}) => {
  trackEvent(game.added ? 'add_to_wishlist' : 'remove_from_wishlist', {
    items: [
      {
        item_id: game.id,
        item_name: game.name,
      },
    ],
  });
};

export const trackLogin = (method: string) => {
  trackEvent('login', {
    method: method,
  });
};

export const trackSignUp = (method: string) => {
  trackEvent('sign_up', {
    method: method,
  });
};

// Declaração de tipos para o Google Analytics
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: Record<string, unknown>[];
  }
}
