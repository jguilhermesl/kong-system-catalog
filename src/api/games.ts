import axios from 'axios';
import type { Game } from '../models/Game';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface FetchGamesResponse {
  data: Game[];
  promoGames: Game[];
  unmissableGames: Game[];
}

export interface FetchGamesProps {
  search?: string;
  category?: string;
  price?: string;
  console?: string;
  clean?: boolean;
}

export const fetchGames = async (params: FetchGamesProps = {}): Promise<FetchGamesResponse> => {
  const response = await axios.get(`${API_URL}/games`, { params: { ...params, clean: true } });
  return response.data;
};

export interface GameCategory {
  value: string;
  label: string;
  imageUrl: string;
}

export const fetchCategories = async (): Promise<{ data: GameCategory[] }> => {
  const response = await axios.get(`${API_URL}/games/categories`);
  return response.data;
};
