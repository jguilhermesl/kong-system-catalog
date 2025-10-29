import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { GAMES_CATEGORIES } from '../constants/games-categories';
import type { FormikProps } from 'formik';

interface FilterFormValues {
  search: string;
  category: string;
  price: string;
  console: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<FilterFormValues>;
  onSubmit: () => void;
  onReset: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  formik,
  onSubmit,
  onReset,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  const handleReset = () => {
    formik.resetForm({
      values: {
        search: '',
        category: '',
        price: '',
        console: '',
      }
    });
    onReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">Filtros avançados</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Categoria</label>
            <Select
              containerClassName="w-full"
              value={formik.values.category}
              onChange={(value) => formik.setFieldValue('category', value)}
              options={GAMES_CATEGORIES}
              placeholder="Selecione uma categoria"
            />
          </div>

          {/* Preço */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Preço</label>
            <Select
              containerClassName="w-full"
              value={formik.values.price}
              onChange={(value) => formik.setFieldValue('price', value)}
              options={[
                { value: 'under15', label: 'Abaixo de R$15' },
                { value: '15-50', label: 'Entre R$15 e R$50' },
                { value: '50-100', label: 'Entre R$50 e R$100' },
                { value: '100-200', label: 'Entre R$100 e R$200' },
              ]}
              placeholder="Selecione uma faixa de preço"
            />
          </div>

          {/* Console */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Console</label>
            <Select
              containerClassName="w-full"
              value={formik.values.console}
              onChange={(value) => formik.setFieldValue('console', value)}
              options={[
                { value: 'PS4', label: 'PS4' },
                { value: 'PS5', label: 'PS5' },
              ]}
              placeholder="Selecione um console"
            />
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="flex-1 border-gray-600 text-black"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSubmit}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Aplicar filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
