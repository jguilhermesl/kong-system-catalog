import axios from 'axios';
import type { SaldaoGame } from '../models/SaldaoGame';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface FetchSaldaoGamesResponse {
  data: SaldaoGame[];
}

export const fetchSaldaoGames = async (): Promise<FetchSaldaoGamesResponse> => {
  const response = await axios.get(`${API_URL}/saldao`);
  return response.data;
};
