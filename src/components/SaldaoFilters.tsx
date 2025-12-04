import React, { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';

interface SaldaoFiltersProps {
  searchTerm: string;
  selectedPrice: string;
  selectedConsole: string;
  onSearchChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onConsoleChange: (value: string) => void;
  onClearFilters: () => void;
}

const SaldaoFilters: React.FC<SaldaoFiltersProps> = ({
  searchTerm,
  selectedPrice,
  selectedConsole,
  onSearchChange,
  onPriceChange,
  onConsoleChange,
  onClearFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = searchTerm || selectedPrice || selectedConsole;

  const priceRanges = [
    { label: 'Até R$ 15', value: 'under15' },
    { label: 'R$ 15 - R$ 50', value: '15-50' },
    { label: 'R$ 50 - R$ 100', value: '50-100' },
    { label: 'R$ 100+', value: 'over100' },
  ];

  const consoles = [
    { label: 'PS4', value: 'PS4' },
    { label: 'PS5', value: 'PS5' },
  ];

  const handlePriceClick = (value: string) => {
    onPriceChange(selectedPrice === value ? '' : value);
  };

  const handleConsoleClick = (value: string) => {
    onConsoleChange(selectedConsole === value ? '' : value);
  };

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-4 md:py-6 shadow-lg border-b border-orange-500/20">
      <div className="container mx-auto px-4">
        {/* Mobile Accordion Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-between w-full py-3 px-4 mb-3 bg-zinc-800 hover:bg-zinc-750 rounded-lg border-2 border-orange-500/50 hover:border-orange-500 transition-all"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white uppercase">🔍 Filtros</h3>
            {hasActiveFilters && (
              <span className="bg-orange-500 text-white text-sm font-bold px-2.5 py-1 rounded-full shadow-lg">
                {[searchTerm, selectedPrice, selectedConsole].filter(Boolean).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-500 font-medium">
              {isOpen ? 'Ocultar' : 'Mostrar'}
            </span>
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-orange-500" />
            ) : (
              <ChevronDown className="w-6 h-6 text-orange-500" />
            )}
          </div>
        </button>

        {/* Desktop Header - Always visible */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase">Filtrar Jogos</h3>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Filters Content - Collapsible on mobile, always visible on desktop */}
        <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col gap-4 md:gap-5`}>
          {/* Mobile Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="md:hidden text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors self-end"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}

          {/* Search Bar */}
          <div className="relative">
            <label className="text-xs text-gray-400 font-medium mb-2 block">Buscar jogo:</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Digite o nome do jogo..."
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-800 border-2 border-zinc-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Console Filter */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-2 block">Console:</label>
            <div className="flex flex-wrap items-center gap-2">
              {consoles.map((console) => (
                <button
                  key={console.value}
                  onClick={() => handleConsoleClick(console.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedConsole === console.value
                      ? 'bg-orange-500 text-white border-2 border-orange-500 shadow-lg shadow-orange-500/30'
                      : 'bg-zinc-800 text-gray-300 border-2 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {console.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-2 block">Faixa de Preço:</label>
            <div className="flex flex-wrap items-center gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handlePriceClick(range.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedPrice === range.value
                      ? 'bg-orange-500 text-white border-2 border-orange-500 shadow-lg shadow-orange-500/30'
                      : 'bg-zinc-800 text-gray-300 border-2 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaldaoFilters;
