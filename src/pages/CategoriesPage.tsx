import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchCategories } from '../api/games';
import { Spinner } from '../components/ui/spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartIcon from '../components/cart/CartIcon';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: categoriesData, isPending } = useQuery({
    queryFn: fetchCategories,
    queryKey: ['categories'],
  });

  const categories = categoriesData?.data || [];

  return (
    <>
      <Header />
      <CartIcon />
      <div className="min-h-screen bg-zinc-950 pb-16">
        <div className="bg-zinc-900 py-8 px-4">
          <div className="container mx-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              TODAS AS <span className="text-primary">CATEGORIAS</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Explore nosso catálogo completo por categoria
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8">
          {isPending ? (
            <div className="flex items-center justify-center w-full py-16">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => navigate(`/category?category=${category.value}`)}
                  className="group relative overflow-hidden rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 border-2 border-zinc-800 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="aspect-square relative">
                    <img
                      src={category.imageUrl}
                      alt={category.label}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white font-bold text-xl text-center group-hover:text-primary transition-colors px-4">
                        {category.label}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-900/95 backdrop-blur-sm">
                    <p className="text-sm text-gray-400 text-center">
                      Explorar jogos
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoriesPage;
