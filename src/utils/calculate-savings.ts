export const calculateSavings = (originalPrice: number, currentPrice: number): string => {
  if (!originalPrice || originalPrice <= 0) return '0%';
  
  const savings = ((originalPrice - currentPrice) / originalPrice) * 100;
  return `${Math.round(savings)}%`;
};
