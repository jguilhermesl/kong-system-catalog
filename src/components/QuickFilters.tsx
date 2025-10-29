import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchCategories } from '../api/games';

interface QuickFiltersProps {
  onFilterChange?: (filters: { category?: string; price?: string; console?: string }) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const activeCategory = searchParams.get('category');
  const activePrice = searchParams.get('price');
  const activeConsole = searchParams.get('console');

  const handleFilterClick = (type: 'category' | 'price' | 'console', value: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Toggle filter - if clicking the same filter, remove it
    if (params.get(type) === value) {
      params.delete(type);
    } else {
      params.set(type, value);
    }
    
    setSearchParams(params);
    
    if (onFilterChange) {
      onFilterChange({
        category: params.get('category') || undefined,
        price: params.get('price') || undefined,
        console: params.get('console') || undefined,
      });
    }
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('price');
    params.delete('console');
    setSearchParams(params);
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const hasActiveFilters = activeCategory || activePrice || activeConsole;

  const priceRanges = [
    { label: 'Até R$ 15', value: 'under15' },
    { label: 'R$ 15 - R$ 50', value: '15-50' },
    { label: 'R$ 50 - R$ 100', value: '50-100' },
    { label: 'R$ 100 - R$ 200', value: '100-200' },
  ];

  const consoles = [
    { label: 'PS4', value: 'PS4' },
    { label: 'PS5', value: 'PS5' },
  ];

  // Use all fetched categories
  const popularCategories = categoriesData?.data || [];

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-4 md:py-6 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Mobile Accordion Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-between w-full py-3 px-4 mb-3 bg-zinc-800 hover:bg-zinc-750 rounded-lg border-2 border-primary/50 hover:border-primary transition-all"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white uppercase">🔍 Filtros Rápidos</h3>
            {hasActiveFilters && (
              <span className="bg-primary text-white text-sm font-bold px-2.5 py-1 rounded-full shadow-lg">
                {[activeCategory, activePrice, activeConsole].filter(Boolean).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary font-medium">
              {isOpen ? 'Ocultar' : 'Mostrar'}
            </span>
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-primary" />
            ) : (
              <ChevronDown className="w-6 h-6 text-primary" />
            )}
          </div>
        </button>

        {/* Desktop Header - Always visible */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase">Filtros Rápidos</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Filters Content - Collapsible on mobile, always visible on desktop */}
        <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col gap-4 md:gap-6`}>
          {/* Mobile Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="md:hidden text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors self-end"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}

          {/* Consoles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Console:</span>
            {consoles.map((console) => (
              <button
                key={console.value}
                onClick={() => handleFilterClick('console', console.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeConsole === console.value
                    ? 'bg-primary text-white border-2 border-primary'
                    : 'bg-zinc-800 text-gray-300 border-2 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {console.label}
              </button>
            ))}
          </div>

          {/* Price Ranges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Preço:</span>
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleFilterClick('price', range.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activePrice === range.value
                    ? 'bg-primary text-white border-2 border-primary'
                    : 'bg-zinc-800 text-gray-300 border-2 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Popular Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Categoria:</span>
            {popularCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleFilterClick('category', category.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === category.value
                    ? 'bg-primary text-white border-2 border-primary'
                    : 'bg-zinc-800 text-gray-300 border-2 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
