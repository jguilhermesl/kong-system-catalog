import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'discount';

interface SortOptionsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ value, onChange }) => {
  const options = [
    { value: 'default', label: 'Padrão' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'discount', label: 'Maior Desconto' },
    { value: 'name-asc', label: 'A-Z' },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-400">Ordenar:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-zinc-800 text-gray-300 text-sm border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-zinc-700 transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;
