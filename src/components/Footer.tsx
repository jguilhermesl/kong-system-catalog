import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import logoImage from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src={logoImage} 
                alt="Kong Games" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Sua loja especializada em jogos digitais para PlayStation com os melhores preços e atendimento de qualidade.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://instagram.com/konggamesoficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="mailto:konggamesofc@gmail.com" 
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-white font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link 
                  to="/all-games" 
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Todos os Jogos
                </Link>
              </li>
              <li>
                <Link 
                  to="/all-games?type=promo" 
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link 
                  to="/all-games?type=unmissable" 
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Imperdíveis
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="text-white font-bold mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">
                Segunda a Sexta: 9h às 20h
              </li>
              <li className="text-sm text-gray-400">
                Sábado: 9h às 18h
              </li>
              <li>
                <a 
                  href="mailto:contato@konggames.com" 
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  konggamesofc@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Kong Games. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
