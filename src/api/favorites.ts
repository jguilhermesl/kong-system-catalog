import axios from 'axios';
import type { Game } from '../models/Game';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface FavoriteGame {
  id: string;
  gameId: string;
  game: Game;
  createdAt: string;
}

export interface ToggleFavoriteResponse {
  isFavorited: boolean;
}

export interface CheckFavoriteResponse {
  isFavorited: boolean;
}

export const toggleFavorite = async (gameId: string, token: string): Promise<ToggleFavoriteResponse> => {
  const response = await axios.post(
    `${API_URL}/favorites/toggle`,
    { gameId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const listFavorites = async (token: string): Promise<{ data: FavoriteGame[] }> => {
  const response = await axios.get(`${API_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const checkFavorite = async (gameId: string, token: string): Promise<CheckFavoriteResponse> => {
  const response = await axios.get(`${API_URL}/favorites/check/${gameId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
