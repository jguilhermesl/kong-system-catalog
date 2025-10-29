import React, { useState } from 'react';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../contexts/CartContext';
import CartModal from './cart/CartModal';
import { fetchCategories } from '../api/games';
import logoImage from '../assets/logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { totalItems } = useCart();

  const { data: categoriesData } = useQuery({
    queryFn: fetchCategories,
    queryKey: ['categories'],
  });

  const categories = categoriesData?.data || [];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  const handleCategoryClick = (categoryValue: string) => {
    navigate(`/category?category=${categoryValue}`);
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  };

  return (
    <header className="bg-zinc-900 shadow-lg sticky top-0 z-50 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Kong Games" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/all-games" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Todos os Jogos
            </Link>
            <Link 
              to="/all-games?type=promo" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Ofertas
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="text-gray-300 hover:text-orange-500 transition-colors font-medium flex items-center gap-1"
              >
                Categorias
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoriesOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsCategoriesOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryClick(category.value)}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-zinc-700 hover:text-orange-500 transition-colors"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleCartModal}
              className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-300 hover:text-orange-500 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-zinc-800 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/all-games" 
                className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos os Jogos
              </Link>
              <Link 
                to="/all-games?type=promo" 
                className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ofertas
              </Link>
              
              {/* Mobile Categories */}
              <div>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="w-full text-left text-gray-300 hover:text-orange-500 transition-colors font-medium flex items-center justify-between"
                >
                  Categorias
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoriesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryClick(category.value)}
                        className="block w-full text-left text-sm text-gray-400 hover:text-orange-500 transition-colors py-1"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={toggleCartModal} />
    </header>
  );
};

export default Header;
