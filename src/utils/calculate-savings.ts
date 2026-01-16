export const calculateSavings = (originalPrice: number, currentPrice: number): string => {
  if (!originalPrice || originalPrice <= 0) return '0%';

  const savings = ((originalPrice - currentPrice) / originalPrice) * 100;
  return `${Math.round(savings)}%`;
};

export const calculateSavingsInReais = (originalPrice: number, currentPrice: number): string => {
  if (!originalPrice || originalPrice <= 0) return 'R$ 0,00';

  const savings = originalPrice - currentPrice;
  return savings.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};
