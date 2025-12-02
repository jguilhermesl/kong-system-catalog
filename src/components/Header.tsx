import React, { useState } from 'react';
import {
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  Search,
  ExternalLink,
  Users,
  LogOut,
  CircleUserRound,
  Heart,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartModal from './cart/CartModal';
import AuthModal from './AuthModal';
import SignUpModal from './SignUpModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { fetchCategories } from '../api/games';
import { Input } from './ui/input';
import logoImage from '../assets/logo.png';

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  searchValue = '',
  onSearchChange,
  showSearch = false,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

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

          {/* Search Bar - Desktop */}
          {showSearch && (
            <div className="hidden xl:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  placeholder="Buscar jogos..."
                  className="h-10 w-full bg-zinc-800 border-gray-600 text-gray-100 placeholder:text-gray-400 pl-10 pr-4 rounded-lg"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-8">
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
            <Link
              to="/favorites"
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              Favoritos
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="text-gray-300 hover:text-orange-500 transition-colors font-medium flex items-center gap-1"
              >
                Categorias
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isCategoriesOpen ? 'rotate-180' : ''
                  }`}
                />
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

            {/* Client Portal Button */}
            <a
              href={
                import.meta.env.VITE_CLIENT_PORTAL_URL ||
                'https://app.konggames.com.br'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
            >
              Portal do Cliente
              <ExternalLink className="w-4 h-4" />
            </a>
          </nav>

          {/* Cart Icon & User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Menu - Desktop */}
            <div className="hidden xl:block relative">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 p-2 text-gray-300 hover:text-orange-500 transition-colors rounded-lg hover:bg-zinc-800"
                aria-label={isAuthenticated ? 'Menu do usuário' : 'Fazer login'}
              >
                <CircleUserRound className="w-6 h-6" />
                {isAuthenticated && user?.name && (
                  <span className="text-sm font-medium">{user.name}</span>
                )}
              </button>
              
              {isAuthenticated && isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-2">
                    <div className="px-4 py-2 border-b border-zinc-700">
                      <p className="text-sm font-medium text-gray-300">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-zinc-700 hover:text-orange-500 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>

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
              className="xl:hidden text-gray-300 hover:text-orange-500 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        {showSearch && (
          <div className="xl:hidden mt-4">
            <div className="relative">
              <Input
                placeholder="Buscar jogos..."
                className="h-10 w-full bg-zinc-800 border-gray-600 text-gray-100 placeholder:text-gray-400 pl-10 pr-4 rounded-lg"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Trust Badge - Mobile */}
        <div className="xl:hidden mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full">
          <Users className="w-4 h-4 text-green-400" />
          <span className="text-xs font-semibold text-green-400">
            +2000 Clientes Satisfeitos
          </span>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="xl:hidden mt-4 pb-4 border-t border-zinc-800 pt-4">
            <div className="flex flex-col space-y-4">
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
              <Link
                to="/favorites"
                className="text-gray-300 hover:text-orange-500 transition-colors font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </Link>

              {/* Mobile Categories */}
              <div>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="w-full text-left text-gray-300 hover:text-orange-500 transition-colors font-medium flex items-center justify-between"
                >
                  Categorias
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isCategoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
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

              {/* User Menu - Mobile */}
              <div className="border-t border-zinc-800 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-2 mb-2">
                      <p className="text-sm font-medium text-gray-300">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-gray-300 hover:text-orange-500 transition-colors font-medium w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-gray-300 hover:text-orange-500 transition-colors font-medium w-full"
                  >
                    <CircleUserRound className="w-5 h-5" />
                    Entrar
                  </button>
                )}
              </div>

              {/* Client Portal Button - Mobile */}
              <a
                href={
                  import.meta.env.VITE_CLIENT_PORTAL_URL ||
                  'https://app.konggames.com.br'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Portal do Cliente
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </nav>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={toggleCartModal} />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsAuthModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setIsAuthModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />
      
      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotPasswordModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
    </header>
  );
};

export default Header;
