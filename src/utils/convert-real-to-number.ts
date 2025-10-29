export const convertRealToNumber = (priceString: string): number => {
  if (!priceString) return 0;
  
  // Remove 'R$' and spaces
  const cleaned = priceString.replace(/R\$\s*/g, '').trim();
  
  // Replace comma with dot for decimal conversion
  const normalized = cleaned.replace(',', '.');
  
  // Parse as float
  const value = parseFloat(normalized);
  
  return isNaN(value) ? 0 : value;
};
