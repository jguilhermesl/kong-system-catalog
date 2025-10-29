export const formatPrice = (price: string | number): string => {
  // If it's already a formatted string like "R$ 89,90"
  if (typeof price === 'string') {
    return price;
  }
  
  // If it's a number, format it
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};
