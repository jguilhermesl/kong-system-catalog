import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api/games';
import { Spinner } from './ui/spinner';

const CategoriesShowcase: React.FC = () => {
  const navigate = useNavigate();

  const { data: categoriesData, isPending } = useQuery({
    queryFn: fetchCategories,
    queryKey: ['categories'],
  });

  const categories = categoriesData?.data || [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="py-12 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            EXPLORE POR <span className="text-primary">CATEGORIA</span>
          </h2>
          <p className="text-gray-400">Encontre jogos do seu gênero favorito</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => navigate(`/category?category=${category.value}`)}
              className="group relative overflow-hidden rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 border border-zinc-800 hover:border-primary"
            >
              <div className="aspect-square relative">
                <img
                  src={category.imageUrl}
                  alt={category.label}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg text-center group-hover:text-primary transition-colors">
                    {category.label}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/categories')}
            className="text-primary hover:text-primary/80 font-medium underline"
          >
            Ver todas as categorias
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;
