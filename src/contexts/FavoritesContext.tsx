/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { toggleFavorite as apiToggleFavorite, listFavorites, type FavoriteGame } from '../api/favorites';
import { useAuth } from './AuthContext';
import { trackFavoriteToggle } from '../utils/analytics';

interface FavoritesContextType {
  favorites: FavoriteGame[];
  favoriteGameIds: Set<string>;
  isLoading: boolean;
  toggleFavorite: (gameId: string) => Promise<void>;
  isFavorited: (gameId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteGame[]>([]);
  const [favoriteGameIds, setFavoriteGameIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteGameIds(new Set());
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await listFavorites(token);
      setFavorites(response.data);
      setFavoriteGameIds(new Set(response.data.map(fav => fav.gameId)));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavorite = useCallback(async (gameId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Você precisa estar logado para favoritar jogos');
    }

    try {
      const result = await apiToggleFavorite(gameId, token);
      
      // Find game name from current favorites if removing, or use gameId if adding
      const existingFav = favorites.find(fav => fav.gameId === gameId);
      const gameName = existingFav?.game?.game || gameId;
      
      // Update local state immediately
      if (result.isFavorited) {
        setFavoriteGameIds(prev => new Set([...prev, gameId]));
      } else {
        setFavoriteGameIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(gameId);
          return newSet;
        });
      }
      
      // Track analytics
      trackFavoriteToggle({
        id: gameId,
        name: gameName,
        added: result.isFavorited,
      });
      
      // Refresh the full list to get game details
      await refreshFavorites();
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }, [refreshFavorites, favorites]);

  const isFavorited = useCallback((gameId: string) => {
    return favoriteGameIds.has(gameId);
  }, [favoriteGameIds]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteGameIds,
        isLoading,
        toggleFavorite,
        isFavorited,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
