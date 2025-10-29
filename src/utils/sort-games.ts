import type { Game } from '../models/Game';
import { convertRealToNumber } from './convert-real-to-number';
import { calculateSavings } from './calculate-savings';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'discount';

export const sortGames = (games: Game[], sortBy: SortOption): Game[] => {
  const sortedGames = [...games];

  switch (sortBy) {
    case 'price-asc':
      return sortedGames.sort((a, b) => {
        const priceA = convertRealToNumber(a.secondaryValue?.toString() || '0');
        const priceB = convertRealToNumber(b.secondaryValue?.toString() || '0');
        return priceA - priceB;
      });

    case 'price-desc':
      return sortedGames.sort((a, b) => {
        const priceA = convertRealToNumber(a.secondaryValue?.toString() || '0');
        const priceB = convertRealToNumber(b.secondaryValue?.toString() || '0');
        return priceB - priceA;
      });

    case 'name-asc':
      return sortedGames.sort((a, b) => a.game.localeCompare(b.game));

    case 'discount':
      return sortedGames.sort((a, b) => {
        const getDiscountValue = (game: Game): number => {
          const originalPrice = game.originalPrice ? convertRealToNumber(game.originalPrice.toString()) : null;
          const secondaryPrice = game.secondaryValue ? convertRealToNumber(game.secondaryValue.toString()) : 0;
          
          if (!originalPrice || originalPrice <= secondaryPrice) return 0;
          
          const savingsStr = calculateSavings(originalPrice, secondaryPrice);
          return parseInt(savingsStr) || 0;
        };

        return getDiscountValue(b) - getDiscountValue(a);
      });

    case 'default':
    default:
      return sortedGames;
  }
};
